<template>
  <view class="chat-page">
    <view class="chat-bot-container">

      <MessageList
          ref="messageListRef"
          class="message-list-wrapper"
          :messages="messages"
          :show-scroll-button="showScrollToBottomButton"
          @onScrollStateChange="handleScrollStateChange"
          @requestScroll="forceScrollToBottomAnimated"
      />

      <ChatInput class="input-wrapper" :disabled="isLoading" @sendMessage="handleSendMessage"/>

      <gao-ChatSSEClient
          ref="chatSSEClient"
          :timeout="300000"
          :heartbeat-timeout="120000"
          :max-retry-count="0"
          @onOpen="handleSSEOpen"
          @onMessage="handleSSEMessage"
          @onError="handleSSEError"
          @onFinish="handleSSEFinish"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import MessageList from './MessageList.vue';
import ChatInput from './ChatInput.vue';
import { idStore } from '../../store/idStorage';

const store = idStore();

// --- 响应式状态定义 ---
const chatSSEClient = ref(null);
const messageListRef = ref(null);
let currentAiMarkdownContent = '';

// API和会话配置
const CHAT_CONFIG = reactive({
  API_URL: 'http://59.110.81.142:8081/api-ai/chat-stream',
  USER_ID: '',
  CHAT_ID: ''
});

const isLoading = ref(false);

const messages = reactive([
  {
    id: 'msg_init',
    sender: 'ai',
    text: '你好！我是你的智能助手，有什么可以帮你的吗？',
    timeline: { completed: [], current: null, error: null },
    references: []
  }
]);

let activeTimer = null;

const showScrollToBottomButton = ref(false);
const userHasScrolledUp = ref(false);


onMounted(() => {
  CHAT_CONFIG.USER_ID = store.userId;
  console.log("获取到用户ID:", store.userId);
  // 页面加载完成，立即滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: false });
  });
});

onUnmounted(() => {
  if (chatSSEClient.value) {
    chatSSEClient.value.stopChat();
  }
  if (activeTimer) {
    clearInterval(activeTimer);
  }
});


const forceScrollToBottomAnimated = () => {
  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: true });
    userHasScrolledUp.value = false;
    showScrollToBottomButton.value = false;
  });
};


const maintainScrollImmediate = () => {
  if (userHasScrolledUp.value) {
    return;
  }
  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: false });
  });
};


const handleScrollStateChange = ({ isFar }) => {
  if (isFar) {
    userHasScrolledUp.value = true;
    showScrollToBottomButton.value = true;
  } else {
    userHasScrolledUp.value = false;
    showScrollToBottomButton.value = false;
  }
};


const handleSendMessage = (prompt) => {
  if (isLoading.value || !prompt) return;

  isLoading.value = true;
  CHAT_CONFIG.CHAT_ID = `chat_${Date.now()}`;
  currentAiMarkdownContent = '';

  messages.push({ id: generateMessageId(), sender: 'user', text: prompt });
  messages.push({
    id: generateMessageId(),
    sender: 'ai',
    text: '',
    timeline: { completed: [], current: { name: '开始处理', startTime: Date.now(), elapsed: '0.0', toolCalls: [] }, error: null },
    references: []
  });


  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: false });
    userHasScrolledUp.value = false;
    showScrollToBottomButton.value = false;
  });

  startStepTimer();
  const urlWithParams = `${CHAT_CONFIG.API_URL}?prompt=${encodeURIComponent(prompt)}&chatId=${encodeURIComponent(CHAT_CONFIG.CHAT_ID)}&userId=${encodeURIComponent(CHAT_CONFIG.USER_ID)}`;
  chatSSEClient.value.startChat({ url: urlWithParams, method: 'GET', headers: { 'Content-Type': 'application/json' } });
};

// --- SSE 事件回调函数 ---
const handleSSEOpen = (response) => {
  console.log("[LOG] SSE connection opened successfully.", response);
  const aiMessage = getCurrentAiMessage();
  if (!aiMessage) return;
  completeCurrentStep();
};

const handleSSEMessage = (event) => {
  const aiMessage = getCurrentAiMessage();
  if (!aiMessage) return;

  try {
    const data = JSON.parse(event.data);
    switch (event.event) {
      case 'runAgent':
        completeCurrentStep();
        aiMessage.timeline.current = { name: `正在调用: ${data.agentName}`, startTime: Date.now(), elapsed: '0.0', toolCalls: [] };
        break;
      case 'toolCall':
        if (data && data.toolName && aiMessage.timeline.current) {
          aiMessage.timeline.current.toolCalls.push(data.toolName);
        }
        break;
      case 'text':
        if (aiMessage.timeline.current?.name !== "生成回复") {
          completeCurrentStep();
          aiMessage.timeline.current = { name: "生成回复", startTime: Date.now(), elapsed: '0.0', toolCalls: [] };
        }
        currentAiMarkdownContent += data.text;
        aiMessage.text = currentAiMarkdownContent;


        maintainScrollImmediate();
        break;
      case 'reference':
        if (!aiMessage.references.includes(data.reference)) {
          aiMessage.references.push(data.reference);
        }
        break;
    }
  } catch(e) {
    console.error("[LOG] Failed to parse SSE message data.", "Error:", e, "Raw Event:", event);
  }
};

const handleSSEError = (error) => {
  console.error("[LOG] SSE connection error occurred.", error);
  const aiMessage = getCurrentAiMessage();
  if (!aiMessage) return;
  if (activeTimer) clearInterval(activeTimer);
  aiMessage.timeline.current = null;
  aiMessage.timeline.error = "服务异常";
  isLoading.value = false;
};

const handleSSEFinish = () => {
  console.log("[LOG] SSE connection finished.");
  const aiMessage = getCurrentAiMessage();
  if (!aiMessage) return;
  if (activeTimer) clearInterval(activeTimer);
  completeCurrentStep();
  aiMessage.timeline.current = null;
  isLoading.value = false;
};

// --- 辅助函数 ---
const generateMessageId = () => `msg_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
const getCurrentAiMessage = () => messages.slice().reverse().find(m => m.sender === 'ai');
const completeCurrentStep = () => {
  const aiMessage = getCurrentAiMessage();
  if (!aiMessage || !aiMessage.timeline.current) return;
  const duration = ((Date.now() - aiMessage.timeline.current.startTime) / 1000).toFixed(1);
  aiMessage.timeline.completed.push({ name: aiMessage.timeline.current.name, duration: `${duration}s`, toolCalls: aiMessage.timeline.current.toolCalls || [] });
  aiMessage.timeline.current = null;
};
const startStepTimer = () => {
  if (activeTimer) clearInterval(activeTimer);
  activeTimer = setInterval(() => {
    const aiMessage = getCurrentAiMessage();
    if (aiMessage && aiMessage.timeline.current) {
      const elapsed = ((Date.now() - aiMessage.timeline.current.startTime) / 1000).toFixed(1);
      aiMessage.timeline.current.elapsed = elapsed;
    } else {
      clearInterval(activeTimer);
      activeTimer = null;
    }
  }, 100);
};
</script>

<style lang="scss" scoped>
.chat-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.chat-bot-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f8fafc;
  box-sizing: border-box;
}
.message-list-wrapper {
  flex: 1;
  box-sizing: border-box;
  min-height: 0;
}
.input-wrapper {
  flex-shrink: 0;
  box-sizing: border-box;
}
</style>
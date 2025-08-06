<template>
  <view class="chat-page">
    <uni-drawer ref="historyDrawer" mode="left" :width="280">
      <ChatHistoryDrawer @switchChat="closeDrawer" @requestSwitchChat="handleRequestSwitchChat" />
    </uni-drawer>

    <view class="chat-bot-container">
      <view class="chat-header">
        <view class="history-button" @click="openDrawer">
          <uni-icons type="bars" size="22" color="#333"></uni-icons>
        </view>
        <view class="chat-title">智能助手</view>
        <view class="new-chat-button" @click="startNewChat">
          <uni-icons type="plusempty" size="22" color="#333"></uni-icons>
          <text>新对话</text>
        </view>
      </view>

      <MessageList
          ref="messageListRef"
          class="message-list-wrapper"
          :messages="messages"
          :show-scroll-button="showScrollToBottomButton"
          @onScrollStateChange="handleScrollStateChange"
          @requestScroll="forceScrollToBottomAnimated"
      />

      <ChatInput 
          class="input-wrapper" 
          :is-loading="isLoading" 
          @sendMessage="handleSendMessage"
          @interruptGeneration="handleInterruptGeneration"
      />

      <gao-ChatSSEClient
          ref="chatSSEClient"
          :timeout="300000"
          :heartbeat-timeout="120000"
          :max-retry-count="-1"
          @onOpen="handleSSEOpen"
          @onMessage="handleSSEMessage"
          @onError="handleSSEError"
          @onFinish="handleSSEFinish"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { onShow, onHide, onBackPress } from '@dcloudio/uni-app';
import MessageList from './MessageList.vue';
import ChatInput from './ChatInput.vue';
import ChatHistoryDrawer from './ChatHistoryDrawer.vue';
import { idStore } from '../../store/idStorage';
import { useChatStore } from '../../store/chatStore';
import apiConfig from "../../config/api";
const id_store = idStore();
const chatStore = useChatStore();
const messages = computed(() => chatStore.currentMessages);

// --- 响应式状态定义 ---
const chatSSEClient = ref(null);
const messageListRef = ref(null);
const historyDrawer = ref(null);
let currentAiMarkdownContent = '';



// API和会话配置
const CHAT_CONFIG = reactive({
  API_URL: apiConfig.botURL + '/api-ai/chat-stream',
  USER_ID: '',
  CHAT_ID: ''
});

const isLoading = ref(false);

let activeTimer = null;

const showScrollToBottomButton = ref(false);
const userHasScrolledUp = ref(false);


onMounted(() => {
  CHAT_CONFIG.USER_ID = id_store.userId;
  console.log("获取到用户ID:", id_store.userId);
  // 页面加载完成，立即滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: false });
  });
});

onShow(() => {
  // 页面显示时，滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: false });
  });
});

onUnmounted(() => {
  cleanup();
});

onHide(() => {
  cleanup();
});

onBackPress((options) => {
  if (isLoading.value) {
    if (options.from === 'navigateBack') {
      return true; // 暂时禁用滑动返回
    }
    uni.showModal({
      title: '提示',
      content: '智能助手正在生成内容，退出将中断任务。是否继续？',
      success: (res) => {
        if (res.confirm) {
          handleInterruptGeneration();
          uni.navigateBack();
        }
      }
    });
    return true; // 阻止默认返回行为
  }
  return false; // 允许正常返回
});

const cleanup = () => {
  if (chatSSEClient.value) {
    chatSSEClient.value.stopChat();
  }
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  isLoading.value = false; // 重置加载状态
};


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

  if (!chatStore.currentChatId) {
    const newChatId = chatStore.startNewChat();
    CHAT_CONFIG.CHAT_ID = newChatId;
  } else {
    CHAT_CONFIG.CHAT_ID = chatStore.currentChatId;
  }

  isLoading.value = true;
  currentAiMarkdownContent = '';

  chatStore.addMessage({ id: generateMessageId(), sender: 'user', text: prompt });
  chatStore.addMessage({
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

const startNewChat = () => {
  if (isLoading.value) {
    uni.showModal({
      title: '提示',
      content: '智能助手正在生成内容，开始新对话会中断当前任务。是否继续？',
      success: (res) => {
        if (res.confirm) {
          handleInterruptGeneration();
          cleanup();
          const newChatId = chatStore.startNewChat();
          CHAT_CONFIG.CHAT_ID = newChatId;
          currentAiMarkdownContent = '';
          nextTick(() => {
            messageListRef.value?.scrollToBottom({ animated: false });
          });
        }
      }
    });
    return;
  }
  cleanup();
  const newChatId = chatStore.startNewChat();
  CHAT_CONFIG.CHAT_ID = newChatId;
  currentAiMarkdownContent = '';
  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: false });
  });
};

const openDrawer = () => {
  historyDrawer.value.open();
};

const closeDrawer = () => {
  historyDrawer.value.close();
  // 切换对话后，可能需要滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom({ animated: false });
  });
};


const handleRequestSwitchChat = (chatId) => {
  if (isLoading.value) {
    uni.showModal({
      title: '提示',
      content: '智能助手正在生成内容，切换对话会中断当前任务。是否继续？',
      success: (res) => {
        if (res.confirm) {
          handleInterruptGeneration();
          chatStore.setCurrentChat(chatId);
          closeDrawer();
        }
      }
    });
  } else {
    chatStore.setCurrentChat(chatId);
    closeDrawer();
  }
};

const handleInterruptGeneration = () => {
  if (chatSSEClient.value) {
    chatSSEClient.value.stopChat();
    console.log("用户中断了生成");
  }
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  isLoading.value = false;
  const aiMessage = chatStore.findLastAiMessage();
  if (aiMessage) {
    chatStore.updateLastAiMessage(currentMessage => {
      currentMessage.timeline.current = null;
      currentMessage.timeline.error = "已中断";
    });
  }
};

// --- SSE 事件回调函数 ---
const handleSSEOpen = (response) => {
  console.log("[LOG] SSE connection opened successfully.", response);
  const aiMessage = chatStore.findLastAiMessage();
  if (!aiMessage) return;
  completeCurrentStep();
};

const handleSSEMessage = (event) => {
  const aiMessage = chatStore.findLastAiMessage();
  if (!aiMessage) return;

  try {
    const data = JSON.parse(event.data);
    chatStore.updateLastAiMessage(currentMessage => {
        switch (event.event) {
          case 'runAgent':
            completeCurrentStep(currentMessage);
            currentMessage.timeline.current = { name: `正在调用: ${data.agentName}`, startTime: Date.now(), elapsed: '0.0', toolCalls: [] };
            break;
          case 'toolCall':
            if (data && data.toolName && currentMessage.timeline.current) {
              currentMessage.timeline.current.toolCalls.push(data.toolName);
            }
            break;
          case 'text':
            if (currentMessage.timeline.current?.name !== "生成回复") {
              completeCurrentStep(currentMessage);
              currentMessage.timeline.current = { name: "生成回复", startTime: Date.now(), elapsed: '0.0', toolCalls: [] };
            }
            currentAiMarkdownContent += data.text;
            currentMessage.text = currentAiMarkdownContent;


            maintainScrollImmediate();
            break;
          case 'reference':
            if (!currentMessage.references.includes(data.reference)) {
              currentMessage.references.push(data.reference);
            }
            break;
        }
    });
  } catch(e) {
    console.error("[LOG] Failed to parse SSE message data.", "Error:", e, "Raw Event:", event);
  }
};

const handleSSEError = (error) => {
  console.error("[LOG] SSE connection error occurred.", error);
  if (activeTimer) clearInterval(activeTimer);
  chatStore.updateLastAiMessage(currentMessage => {
      currentMessage.timeline.current = null;
      currentMessage.timeline.error = "服务异常";
  });
  isLoading.value = false;
};

const handleSSEFinish = () => {
  console.log("[LOG] SSE connection finished.");
  if (activeTimer) clearInterval(activeTimer);
  const aiMessage = chatStore.findLastAiMessage();
  if (!aiMessage) return;
  completeCurrentStep(aiMessage);
  chatStore.updateLastAiMessage(currentMessage => {
      currentMessage.timeline.current = null;
  });
  isLoading.value = false;
};

// --- 辅助函数 ---
const generateMessageId = () => `msg_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
const completeCurrentStep = (message) => {
  const aiMessage = message || chatStore.findLastAiMessage();
  if (!aiMessage || !aiMessage.timeline.current) return;
  const duration = ((Date.now() - aiMessage.timeline.current.startTime) / 1000).toFixed(1);
  aiMessage.timeline.completed.push({ name: aiMessage.timeline.current.name, duration: `${duration}s`, toolCalls: aiMessage.timeline.current.toolCalls || [] });
  aiMessage.timeline.current = null;
};
const startStepTimer = () => {
  if (activeTimer) clearInterval(activeTimer);
  activeTimer = setInterval(() => {
    chatStore.updateLastAiMessage(currentMessage => {
        if (currentMessage && currentMessage.timeline.current) {
          const elapsed = ((Date.now() - currentMessage.timeline.current.startTime) / 1000).toFixed(1);
          currentMessage.timeline.current.elapsed = elapsed;
        } else {
          clearInterval(activeTimer);
          activeTimer = null;
        }
    });
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
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
  .history-button {
    padding: 6px;
    cursor: pointer;
  }
  .chat-title {
    font-size: 18px;
    font-weight: bold;
  }
  .new-chat-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 20px;
    background-color: #f1f5f9;
    font-size: 14px;
    cursor: pointer;
    &:active {
      background-color: #e2e8f0;
    }
  }
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
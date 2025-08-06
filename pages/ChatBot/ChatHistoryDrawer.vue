<template>
  <view class="chat-history-drawer">
    <view class="drawer-header">
      <text class="drawer-title">对话历史</text>
    </view>
    <scroll-view scroll-y class="history-list">
      <view
          v-for="chat in history"
          :key="chat.id"
          class="history-item"
          :class="{ 'active': chat.id === currentChatId }"
          @click="switchChat(chat.id)"
      >
        <text class="history-title">{{ chat.title }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useChatStore } from '../../store/chatStore';

const chatStore = useChatStore();

const history = computed(() => chatStore.chatHistory);
const currentChatId = computed(() => chatStore.currentChatId);

const emit = defineEmits(['switchChat', 'requestSwitchChat']);

const switchChat = (chatId) => {
  emit('requestSwitchChat', chatId);
};
</script>

<style lang="scss" scoped>
.chat-history-drawer {
  width: 280px;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 20px 15px 10px;
  border-bottom: 1px solid #f0f0f0;
  .drawer-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}

.history-list {
  flex: 1;
  min-height: 0;
}

.history-item {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f7f7f7;
  }

  &.active {
    background-color: #e6f7ff;
    border-right: 3px solid #1890ff;
  }

  .history-title {
    font-size: 14px;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

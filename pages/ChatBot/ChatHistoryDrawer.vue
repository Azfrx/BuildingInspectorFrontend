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
      >
        <view class="history-item-content" @click="switchChat(chat.id)">
          <text class="history-title">{{ chat.title }}</text>
        </view>
        <view class="delete-button" @click.stop="confirmDelete(chat.id)">
          <uni-icons type="trash" size="16" color="#6b7280"></uni-icons>
        </view>
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

const confirmDelete = (chatId) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个对话吗？此操作无法撤销。',
    success: (res) => {
      if (res.confirm) {
        chatStore.deleteChat(chatId);
      }
    },
  });
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f7f7f7;
  }

  &.active {
    background-color: #e6f7ff;
    border-right: 3px solid #1890ff;
    padding-right: 0;
  }
}

.history-item-content {
  flex-grow: 1;
  padding: 12px 0;
  cursor: pointer;
  overflow: hidden;
}

.history-title {
  font-size: 14px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-button {
  flex-shrink: 0;
  padding: 12px 15px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}
</style>

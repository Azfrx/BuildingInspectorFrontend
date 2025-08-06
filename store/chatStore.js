import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: {}, // 使用对象存储对话，以 chatId 为键
    currentChatId: null,
  }),
  getters: {
    // 获取当前对话的消息列表
    currentMessages: (state) => {
      if (!state.currentChatId || !state.conversations[state.currentChatId]) {
        return [
          {
            id: 'msg_init',
            sender: 'ai',
            text: '你好！我是你的智能助手，有什么可以帮你的吗？',
            timeline: { completed: [], current: null, error: null },
            references: []
          }
        ];
      }
      return state.conversations[state.currentChatId].messages;
    },
    // 获取用于历史记录显示的所有对话列表
    chatHistory: (state) => {
      return Object.values(state.conversations).map(conv => ({
        id: conv.id,
        // 使用第一条用户消息作为标题，如果没有则显示默认标题
        title: conv.messages.find(m => m.sender === 'user')?.text.substring(0, 30) || '新对话',
      })).reverse(); // 按时间倒序排列
    },
  },
  actions: {
    // 开始一个新对话
    startNewChat() {
      const chatId = `chat_${Date.now()}`;
      this.conversations[chatId] = {
        id: chatId,
        messages: [
          {
            id: 'msg_init',
            sender: 'ai',
            text: '你好！我是你的智能助手，有什么可以帮你的吗？',
            timeline: { completed: [], current: null, error: null },
            references: []
          }
        ],
      };
      this.currentChatId = chatId;
      return chatId;
    },
    // 设置当前对话
    setCurrentChat(chatId) {
      if (this.conversations[chatId]) {
        this.currentChatId = chatId;
      }
    },
    // 向当前对话添加消息
    addMessage(message) {
      if (!this.currentChatId) {
        this.startNewChat();
      }
      this.conversations[this.currentChatId].messages.push(message);
    },
    // 更新当前对话的最后一条 AI 消息
    updateLastAiMessage(updater) {
      if (!this.currentChatId) return;
      const messages = this.conversations[this.currentChatId].messages;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'ai') {
        updater(lastMessage);
      }
    },
    // 查找当前对话的最后一条 AI 消息
    findLastAiMessage() {
      if (!this.currentChatId) return null;
      const messages = this.conversations[this.currentChatId].messages;
      return messages.slice().reverse().find(m => m.sender === 'ai');
    },
    // clearMessages is deprecated, use startNewChat instead.
    clearMessages() {
        if (!this.currentChatId) return;
        this.conversations[this.currentChatId].messages = [
            {
                id: 'msg_init',
                sender: 'ai',
                text: '你好！我是你的智能助手，有什么可以帮你的吗？',
                timeline: { completed: [], current: null, error: null },
                references: []
            }
        ];
    }
  },
});


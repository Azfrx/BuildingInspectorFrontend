<template>
  <view class="chat-input-container" :style="{ paddingBottom: keyboardHeight + 'px' }">
    <textarea
        class="input-area"
        v-model="text"
        placeholder="请输入你的问题..."
        :auto-height="true"
        :disabled="props.disabled"
        maxlength="-1"
        confirm-type="send"
        @confirm="handleSend"
        :adjust-position="false"  ></textarea>
    <button class="send-button" @click="handleSend" :disabled="props.disabled || !text.trim()">
      <uni-icons type="paperplane-filled" size="24" color="#FFFFFF"></uni-icons>
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['sendMessage']);

const text = ref('');

const keyboardHeight = ref(0);

onMounted(() => {

  uni.onKeyboardHeightChange(res => {
    console.log('键盘高度变化：', res.height);
    keyboardHeight.value = res.height + 5;
  });
});

onUnmounted(() => {

  uni.offKeyboardHeightChange();
});

const handleSend = () => {
  const content = text.value.trim();
  if (!content || props.disabled) {
    return;
  }
  emit('sendMessage', content);
  text.value = '';
};
</script>

<style lang="scss" scoped>
.chat-input-container {
  display: flex;
  align-items: flex-end;
  padding: 8px 10px;
  border-top: 1px solid #e5e7eb;
  background-color: #f8fafc;
  margin-bottom: 12px;
  transition: padding-bottom 0.2s ease-out;
}

.input-area {
  flex-grow: 1;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 9px 12px;
  background-color: #ffffff;
  line-height: 1.5;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2563eb;
  margin-left: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  transition: all 0.2s ease;

  &:after {
    border: none;
  }

  &:hover {
    background-color: #1d4ed8;
  }

  &[disabled] {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
}
</style>
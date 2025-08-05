<template>
  <view class="message-item" :class="props.message.sender">
    <view class="avatar">
      <uni-icons :type="props.message.sender === 'user' ? 'person-filled' : 'staff-filled'" size="22"
                 color="#FFFFFF"></uni-icons>
    </view>
    <view class="content-container">
      <view class="content">
        <template v-if="props.message.sender === 'ai'">
          <StatusTimeline :timeline="props.message.timeline"/>
        </template>

        <view class="text-content">
          <zero-markdown-view v-if="props.message.sender === 'ai'" :markdown="props.message.text || '...'"
                              :aiMode="true"/>
          <text v-else selectable="true">{{ props.message.text }}</text>
        </view>

        <template v-if="props.message.sender === 'ai'">
          <KnowledgeSources :sources="props.message.references"/>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup>
import StatusTimeline from './StatusTimeline.vue';
import KnowledgeSources from './KnowledgeSources.vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.message-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
  padding: 8px;

  &.user {
    align-items: flex-end;
  }

  &.ai {
    align-items: flex-start;

    .text-content {
      padding: 0;
    }
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 600;
}

.content-container {
  max-width: 100%;
  flex-shrink: 1;
  margin-top: 8px;
}

.content {
  border-radius: 12px;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.text-content {
  padding: 8px 12px;
  font-size: 15px;
  line-height: 1.5;
  word-wrap: break-word;
}
</style>
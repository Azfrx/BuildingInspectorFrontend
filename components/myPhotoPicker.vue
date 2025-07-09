<template>
  <view class="photo-picker">
    <!-- 预览区域（点击触发弹窗） -->
    <view class="preview-list">
      <view 
        v-for="(img, idx) in previewImages" 
        :key="idx" 
        class="preview-container"
      >
        <image :src="img" class="preview-image" mode="scaleToFill" />
        <view class="delete-icon" @click.stop="deleteImage(idx)">×</view>
      </view>
      <!-- 添加按钮 -->
    <view class="preview-container" @click="showActionSheet">
        <view class="empty-preview">
          <view class="plus-icon"></view>
        </view>
      </view>
    </view>
    
    <!-- 底部弹出层 -->
    <view class="action-sheet" v-if="actionSheetVisible">
      <view class="action-sheet-content">
        
        <view class="action-sheet-item" @click="takePhoto">
          <text>相机</text>
        </view>
        
        <view class="action-sheet-item" @click="chooseFromAlbum">
          <text>设备相册</text>
        </view>
        
        <view class="action-sheet-item" @click="showPhotoNumberInput">
          <text>输入照片序号</text>
        </view>
      </view>
      <view class="action-sheet-mask" @click="closeActionSheet"></view>
    </view>

    <!-- 照片序号输入弹窗 -->
    <view class="photo-number-popup" v-if="photoNumberVisible">
      <view class="photo-number-content">
        <view class="popup-title">输入照片序号</view>
        <view class="input-container">
          <input 
            class="photo-number-input" 
            v-model="photoNumber"
            placeholder="请输入照片序号" 
            type="text"
          />
        </view>
        <view class="popup-buttons">
          <view class="btn cancel-btn" @click="cancelPhotoNumber">取消</view>
          <view class="btn confirm-btn" @click="confirmPhotoNumber">确定</view>
        </view>
      </view>
      <view class="popup-mask" @click="cancelPhotoNumber"></view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['update:photos', 'select']);

const previewImages = ref([]);
const actionSheetVisible = ref(false);
const photoNumberVisible = ref(false);
const photoNumber = ref('');

// 显示底部弹出层
const showActionSheet = () => {
  console.log('点击了预览区域');
  actionSheetVisible.value = true;
  console.log('actionSheetVisible:', actionSheetVisible.value);
};

// 关闭底部弹出层
const closeActionSheet = () => {
  actionSheetVisible.value = false;
};

// 拍摄照片
const takePhoto = () => {
  closeActionSheet();
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    sizeType: ['compressed'],
    success: (res) => {
      handleImageSuccess(res.tempFilePaths[0]);
    },
    fail: (err) => {
      console.error('拍照失败:', err);
      uni.showToast({
        title: '拍照失败',
        icon: 'none'
      });
    }
  });
};

// 从相册选取
const chooseFromAlbum = () => {
  closeActionSheet();
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    sizeType: ['compressed'],
    success: (res) => {
      handleImageSuccess(res.tempFilePaths[0]);
    },
    fail: (err) => {
      console.error('选择照片失败:', err);
      uni.showToast({
        title: '选择照片失败',
        icon: 'none'
      });
    }
  });
};

// 显示照片序号输入弹窗
const showPhotoNumberInput = () => {
  closeActionSheet();
  photoNumberVisible.value = true;
  photoNumber.value = '';
};

// 取消照片序号输入
const cancelPhotoNumber = () => {
  photoNumberVisible.value = false;
  photoNumber.value = '';
};

// 确认照片序号输入
const confirmPhotoNumber = () => {
  if (photoNumber.value.trim()) {
    // 这里可以处理照片序号逻辑
    console.log('照片序号:', photoNumber.value);
    uni.showToast({
      title: `照片序号: ${photoNumber.value}`,
      icon: 'none'
    });
    photoNumberVisible.value = false;
  } else {
    uni.showToast({
      title: '请输入照片序号',
      icon: 'none'
    });
  }
};

// 处理图片选择成功
const handleImageSuccess = (filePath) => {
  previewImages.value.push(filePath);
  emit('select', filePath); // 新增：触发 select 事件
  uni.showToast({
    title: '图片已选择',
    icon: 'success'
  });
};

const deleteImage = (idx) => {
  previewImages.value.splice(idx, 1);
  uni.showToast({ title: '图片已删除', icon: 'success' });
};
</script>

<style scoped>
.photo-picker {
  padding: 20rpx;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  justify-content: flex-start; /* 关键：左对齐 */
  margin-top: 30rpx;
}

.preview-container {
  border: none;
  border-radius: 0;
  padding: 0;
  width: 200px;
  height: 200px;
  min-width: 200px;
  min-height: 200px;
  max-width: 200px;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  cursor: pointer;
  box-sizing: border-box;
  position: relative; /* Added for delete icon positioning */
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
  object-fit: fill;
  object-position: center;
  min-width: 100%;
  min-height: 100%;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.plus-icon {
  width: 60rpx;
  height: 60rpx;
  position: relative;
  margin: 0 auto;
}
.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background: #bbb;
  border-radius: 0;
}
.plus-icon::before {
  left: 50%;
  top: 0;
  width: 4rpx;
  height: 100%;
  transform: translateX(-50%);
}
.plus-icon::after {
  top: 50%;
  left: 0;
  width: 100%;
  height: 4rpx;
  transform: translateY(-50%);
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  z-index: 1;
  cursor: pointer;
}

.action-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.action-sheet-content {
  background-color: white;
  border-radius: 0;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
  transform: translateY(100%);
  }
  to {
  transform: translateY(0);
  }
}

.action-sheet-title {
  padding: 30rpx 0;
  text-align: center;
  font-size: 34rpx;
  color: #333;
  border-bottom: 2rpx solid #f0f0f0;
}

.action-sheet-item {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
  justify-content: center;
  border-bottom: 2rpx solid #f0f0f0;
  font-size: 18px;
  height: 20rpx;
}

.sheet-icon {
  width: 40rpx;
  height: 20rpx;
  margin-right: 20rpx;
  font-size: 18px;
}

.action-sheet-cancel {
  padding: 15rpx 0;
  text-align: center;
  margin-top: 10rpx;
  background-color: white;
  color: #007aff;
  font-size: 18px;
  height: 20rpx;
}

.action-sheet-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

/* 照片序号输入弹窗样式 */
.photo-number-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-number-content {
  background-color: white;
  border-radius: 16rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
}

.popup-title {
  font-size: 36rpx;
  text-align: center;
  color: #333;
  margin-bottom: 40rpx;
}

.input-container {
  margin-bottom: 40rpx;
}

.photo-number-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  box-sizing: border-box;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: #007aff;
  color: white;
}

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
</style>

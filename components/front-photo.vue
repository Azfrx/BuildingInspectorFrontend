<template>

  <view>

    <view v-if="isDataLoaded">

      <view class="title">
        <view class="status-text">
          正立面照状态:
          <text :class="{ 'not-submitted': !isSubmit }">{{ isSubmit ? '已提交' : '未提交' }}</text>
        </view>
        <button class="save" @click="savePhoto">保存</button>
      </view>

      <view class="photo-container">
        <view class="photo-item">
          <view class="head">
            <view class="head-text">
              左正面照
            </view>
          </view>
          <uni-file-picker class="file-picker" limit="1" :image-styles="imageStyles" v-model="frontLeft"
                         file-mediatype="image" mode="grid" @select="frontLeftSelect"
                         :auto-upload="false"></uni-file-picker>
        </view>
        
        <view class="photo-item">
          <view class="head">
            <view class="head-text">
              右正面照
            </view>
          </view>
          <uni-file-picker class="file-picker" limit="1" :image-styles="imageStyles" v-model="frontRight"
                         file-mediatype="image" mode="grid" @select="frontRightSelect"
                         :auto-upload="false"></uni-file-picker>
        </view>
      </view>
      
      <view class="photo-container">
        <view class="photo-item">
          <view class="head">
            <view class="head-text">
              左侧面照
            </view>
          </view>
          <uni-file-picker class="file-picker" limit="1" :image-styles="imageStyles" v-model="sideLeft"
                         file-mediatype="image" mode="grid" @select="sideLeftSelect"
                         :auto-upload="false"></uni-file-picker>
        </view>
        
        <view class="photo-item">
          <view class="head">
            <view class="head-text">
              右侧面照
            </view>
          </view>
          <uni-file-picker class="file-picker" limit="1" :image-styles="imageStyles" v-model="sideRight"
                         file-mediatype="image" mode="grid" @select="sideRightSelect"
                         :auto-upload="false"></uni-file-picker>
        </view>
      </view>

    </view>



    <view v-else class="loading-container">
      <text class="loading-text">正在加载桥梁数据...</text>
    </view>

  </view>

</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {getFrontPhoto, getProperty, readBridgeImage} from "@/utils/readJsonNew";
import {idStore} from "@/store/idStorage";
import {userStore} from "@/store";
import {saveBridgeImages, setFrontPhoto} from "@/utils/writeNew";

// 接收父组件传递的数据加载状态
const props = defineProps({
  isDataLoaded: {
    type: Boolean,
    default: false
  }
});
// 是否从json中读取数据
const isJson = ref(1);
const isSubmit = ref(false);

const frontLeft = ref([]);
const frontRight = ref([]);
const sideLeft = ref([]);
const sideRight = ref([]);

// 用于存储原始图片数据，用于比较是否有变化
const originalFrontLeft = ref([]);
const originalFrontRight = ref([]);
const originalSideLeft = ref([]);
const originalSideRight = ref([]);

const idStorageInfo = idStore();
const userInfo = userStore()

// 图片上传样式
const imageStyles = reactive({
  width: '200rpx',
  height: '200rpx'
});

// 监听isDataLoaded属性变化
watch(() => props.isDataLoaded, (newVal) => {
  console.log('front-photo组件检测到isDataLoaded变化:', newVal);
  if (newVal === true) {
    readBridgeImageByJson();
  }
}, { immediate: true });

const frontLeftSelect = (e) => {
  if (e && e.tempFiles && e.tempFiles.length > 0) {
    console.log('选择的文件数量:', e.tempFiles.length);
    // 将tempFiles的信息直接更新到fileList
    frontLeft.value = e.tempFiles.map(file => {
      return {
        name: file.name,
        url: file.url || file.path || (file.file && file.file.path) ||
            (file.image && file.image.location) || file.tempFilePath,
        extname: file.extname || 'jpg',
      };
    });
  }
};
const frontRightSelect = (e) => {
  if (e && e.tempFiles && e.tempFiles.length > 0) {
    console.log('选择的文件数量:', e.tempFiles.length);
    // 将tempFiles的信息直接更新到fileList
    frontRight.value = e.tempFiles.map(file => {
      return {
        name: file.name,
        url: file.url || file.path || (file.file && file.file.path) ||
            (file.image && file.image.location) || file.tempFilePath,
        extname: file.extname || 'jpg',
      };
    });
  }
};
const sideLeftSelect = (e) => {
  if (e && e.tempFiles && e.tempFiles.length > 0) {
    console.log('选择的文件数量:', e.tempFiles.length);
    // 将tempFiles的信息直接更新到fileList
    sideLeft.value = e.tempFiles.map(file => {
      return {
        name: file.name,
        url: file.url || file.path || (file.file && file.file.path) ||
            (file.image && file.image.location) || file.tempFilePath,
        extname: file.extname || 'jpg',
      };
    });
  }
};
const sideRightSelect = (e) => {
  if (e && e.tempFiles && e.tempFiles.length > 0) {
    console.log('选择的文件数量:', e.tempFiles.length);
    // 将tempFiles的信息直接更新到fileList
    sideRight.value = e.tempFiles.map(file => {
      return {
        name: file.name,
        url: file.url || file.path || (file.file && file.file.path) ||
            (file.image && file.image.location) || file.tempFilePath,
        extname: file.extname || 'jpg',
      };
    });
  }
};

const createPhotoDate = async () => {
  const result = {
    frontLeft: [],
    frontRight: [],
    sideLeft: [],
    sideRight: []
  };
  
  // 检查前左侧图片是否有变化
  if (hasImageChanged(frontLeft.value, originalFrontLeft.value)) {
    result.frontLeft = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, frontLeft.value.map(img => img.url));
  } else {
    // 如果没有变化，使用原始数据
    const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
    result.frontLeft = data.frontLeft || [];
  }
  
  // 检查前右侧图片是否有变化
  if (hasImageChanged(frontRight.value, originalFrontRight.value)) {
    result.frontRight = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, frontRight.value.map(img => img.url));
  } else {
    // 如果没有变化，使用原始数据
    const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
    result.frontRight = data.frontRight || [];
  }
  
  // 检查侧左侧图片是否有变化
  if (hasImageChanged(sideLeft.value, originalSideLeft.value)) {
    result.sideLeft = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, sideLeft.value.map(img => img.url));
  } else {
    // 如果没有变化，使用原始数据
    const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
    result.sideLeft = data.sideLeft || [];
  }
  
  // 检查侧右侧图片是否有变化
  if (hasImageChanged(sideRight.value, originalSideRight.value)) {
    result.sideRight = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, sideRight.value.map(img => img.url));
  } else {
    // 如果没有变化，使用原始数据
    const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
    result.sideRight = data.sideRight || [];
  }
  
  return result;
};

// 检查图片是否有变化
const hasImageChanged = (currentImages, originalImages) => {
  // 如果长度不同，说明有变化
  if (currentImages.length !== originalImages.length) {
    return true;
  }
  
  // 比较每个图片的URL
  for (let i = 0; i < currentImages.length; i++) {
    if (currentImages[i].url !== originalImages[i].url) {
      return true;
    }
  }
  
  // 没有变化
  return false;
};

const savePhoto = async () => {
  const savePhotoData = await createPhotoDate();
  console.log('保存的图片json数据:', savePhotoData)
  await setFrontPhoto(userInfo.username, idStorageInfo.buildingId, savePhotoData);
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  });
  isSubmit.value = true; // 设置为已提交状态
};

const readBridgeImageByJson  = async () => {
  try {
    const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
    console.log('获取正立面照数据成功:', data);
    // 处理图片数据
    if (data.frontLeft && Array.isArray(data.frontLeft)) {
      const imagesPaths =  readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.frontLeft);
      frontLeft.value = imagesPaths.map((url, index) => ({
        name: `图片${index + 1}`,
        url: url,
        extname: 'jpg',
      }));
      // 保存原始图片数据
      originalFrontLeft.value = JSON.parse(JSON.stringify(frontLeft.value));
    }
    if (data.frontRight && Array.isArray(data.frontRight)) {
      const imagesPaths =  readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.frontRight);
      frontRight.value = imagesPaths.map((url, index) => ({
        name: `图片${index + 1}`,
        url: url,
        extname: 'jpg',
      }));
      // 保存原始图片数据
      originalFrontRight.value = JSON.parse(JSON.stringify(frontRight.value));
    }
    if (data.sideLeft && Array.isArray(data.sideLeft)) {
      const imagesPaths =  readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.sideLeft);
      sideLeft.value = imagesPaths.map((url, index) => ({
        name: `图片${index + 1}`,
        url: url,
        extname: 'jpg',
      }));
      // 保存原始图片数据
      originalSideLeft.value = JSON.parse(JSON.stringify(sideLeft.value));
    }
    if (data.sideRight && Array.isArray(data.sideRight)) {
      const imagesPaths =  readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.sideRight);
      sideRight.value = imagesPaths.map((url, index) => ({
        name: `图片${index + 1}`,
        url: url,
        extname: 'jpg',
      }));
      // 保存原始图片数据
      originalSideRight.value = JSON.parse(JSON.stringify(sideRight.value));
    }

  } catch (error) {
    console.error('读取正立面照失败:', error);
  }
};


// 组件挂载时
onMounted(async () => {
  // 只有当数据加载完成时才读取图片数据
  if (props.isDataLoaded) {
    await readBridgeImageByJson();
  }
});
</script>

<style scoped>
.title{
  display: flex;
  flex-direction: row;
  background-color: #BDCBE0;
  align-items: center;
  font-size: 20rpx;
  padding: 10rpx;
  justify-content: space-between;
}

.status-text {
  display: flex;
  align-items: center;
}

.save{
  height: 36rpx;
  font-size: 16px;
  background-color: #0F4687;
  color: #ffffff;
  margin-left: 0;
  margin-right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.photo-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.photo-item {
  width: 50%;
}
.file-picker {
  margin-top: 20rpx;
  margin-left: 20rpx;
}

.photo-item image {
	width: 100%;
	height: 200rpx;
	border-radius: 6rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}
.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200rpx;
}

.loading-text {
	color: #999;
	font-size: 28rpx;
}
.head {
  background-color: #BDCBE0;
}

.head-text {
  padding: 4rpx 10rpx;
  font-size: 20rpx;
}

.not-submitted {
  color: red;
}
</style>
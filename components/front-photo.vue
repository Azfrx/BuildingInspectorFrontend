<template>
	<view class="photo-container" v-if="isDataLoaded">
		<view class="section">
			<view class="title">桥梁正面立照</view>
			<view class="photos-list">
				<view v-if="front && front.length > 0" class="photo-grid">
					<view v-for="(url, index) in front" :key="index" class="photo-item">
						<image :src="url" mode="aspectFill" @click="previewImage(url, index, 'front')" />
					</view>
				</view>
				<view v-else class="empty-data">
					暂无桥梁正面立照数据
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="title">桥梁侧面立照</view>
			<view class="photos-list">
				<view v-if="side && side.length > 0" class="photo-grid">
					<view v-for="(url, index) in side" :key="index" class="photo-item">
						<image :src="url" mode="aspectFill" @click="previewImage(url, index, 'side')" />
					</view>
				</view>
				<view v-else class="empty-data">
					暂无桥梁侧面立照数据
				</view>
			</view>
		</view>
	</view>
	<view v-else class="loading-container">
		<text class="loading-text">正在加载桥梁数据...</text>
	</view>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import {getProperty, readBridgeImage} from "@/utils/readJsonNew";

// 接收父组件传递的数据加载状态
const props = defineProps({
  isDataLoaded: {
    type: Boolean,
    default: false
  }
});

const side = ref([]);
const front = ref([]);

const userId = ref(20);
const buildingId = ref(0);
// 是否从json中读取数据
const isJson = ref(1);

// 通过计算属性获取URL中的bridgeId参数
const bridgeIdFromURL = computed(() => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const options = currentPage.$page?.options;

    if (options && options.bridgeId) {
      return options.bridgeId;
    }
  }
  return 0; // 默认值
});


// 监听bridgeIdFromURL的变化
watch(bridgeIdFromURL, (newVal) => {
  if (newVal) {
    buildingId.value = newVal;
  }
});

// 监听isDataLoaded属性变化
watch(() => props.isDataLoaded, (newVal) => {
  console.log('front-photo组件检测到isDataLoaded变化:', newVal);
  if (newVal === true) {
    readBridgeImageByJson();
  }
}, { immediate: true });

const readBridgeImageByJson  = async () => {
  if (!props.isDataLoaded) {
    console.log('数据未加载完成，不读取图片数据');
    return;
  }

  if (bridgeIdFromURL.value) {
    buildingId.value = bridgeIdFromURL.value;
  }
  try {
    // 直接调用getProperty方法获取数据，传入userId和buildingId
    const data = await getProperty(userId.value, buildingId.value);
    console.log('获取到桥梁正立面照数据:', data.images);

    // 将获取的数据赋值给本地状态
    if (data.images && data.images.side) {
      side.value = await readBridgeImage(userId.value, buildingId.value, data.images.side);
    }
    if (data.images && data.images.front) {
      front.value = await readBridgeImage(userId.value, buildingId.value, data.images.front);
    }
  } catch (error) {
    console.error('本地json获取桥梁档案数据失败:', error);
    isJson.value = 0;
  }
};

// 预览图片
const previewImage = (url, index, type) => {
	const urls = type === 'front' ? front.value : side.value;
	uni.previewImage({
		current: index,
		urls: urls,
		indicator: 'number',
		loop: true
	});
};

// 组件挂载时
onMounted(async () => {
  console.log('front-photo组件挂载.......isDataLoaded:', props.isDataLoaded);
  // 只有当数据加载完成时才读取图片数据
  if (props.isDataLoaded) {
    await readBridgeImageByJson();
  }
});
</script>

<style scoped>
.photo-container {
	padding: 20rpx;
}

.section {
	margin-bottom: 30rpx;
}

.title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #0F4687;
}

.photos-list {
	background-color: #fff;
	border-radius: 8rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.photo-grid {
	display: flex;
	flex-wrap: wrap;
}

.photo-item {
	width: 33.33%;
	padding: 10rpx;
	box-sizing: border-box;
}

.photo-item image {
	width: 100%;
	height: 200rpx;
	border-radius: 6rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.empty-data {
	text-align: center;
	color: #999;
	padding: 40rpx 0;
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
</style>
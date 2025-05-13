<template>
	<view class="photo-container">
		<view class="title">桥梁正面立照</view>
		<view class="photos-list">
			<view v-if="data && data.length > 0" class="photo-grid">
				<view v-for="(photo, index) in data" :key="index" class="photo-item">
					<image :src="photo.imageUrl" mode="aspectFill" @click="previewImage(photo.imageUrl, index)" />
				</view>
			</view>
			<view v-else class="empty-data">
				暂无桥梁正面立照数据
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// 定义接收的props
const props = defineProps({
	data: {
		type: Array,
		default: () => []
	}
});

// 本地数据
const photoList = ref([]);

// 监听props变化
watch(() => props.data, (newData) => {
	if (newData && newData.length > 0) {
		console.log('接收到桥梁正面立照数据:', newData);
		photoList.value = newData;
	}
}, { immediate: true, deep: true });

// 预览图片
const previewImage = (url, index) => {
	const urls = props.data.map(item => item.imageUrl);
	uni.previewImage({
		current: index,
		urls: urls,
		indicator: 'number',
		loop: true
	});
};

// 组件挂载时
onMounted(() => {
	console.log('front-photo组件挂载，接收到的数据:', props.data);
});
</script>

<style scoped>
.photo-container {
	padding: 20rpx;
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
}

.empty-data {
	text-align: center;
	color: #999;
	padding: 40rpx 0;
}
</style>
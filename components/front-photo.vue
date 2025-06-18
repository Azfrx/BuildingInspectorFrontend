<template>

	<view>

		<view>

			<view class="title">
				<view class="status-text">
					正立面照状态:
					<text :class="{ 'not-submitted': !isSubmit }">{{ isSubmit ? '已提交' : '未提交' }}</text>
				</view>
			</view>

			<view class="photo-container">
				<view class="photo-item">
					<view class="head">
						<view class="head-text">
							左正面照
						</view>
					</view>
					<uni-file-picker class="file-picker" limit="1" :image-styles="imageStyles" v-model="frontLeft"
						file-mediatype="image" mode="grid" @select="frontLeftSelect" :auto-upload="false"
						@success="onUploadSuccess('frontLeft')"></uni-file-picker>
				</view>

				<view class="photo-item">
					<view class="head">
						<view class="head-text">
							右正面照
						</view>
					</view>
					<uni-file-picker class="file-picker" limit="1" :image-styles="imageStyles" v-model="frontRight"
						file-mediatype="image" mode="grid" @select="frontRightSelect" :auto-upload="false"
						@success="onUploadSuccess('frontRight')"></uni-file-picker>
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
						file-mediatype="image" mode="grid" @select="sideLeftSelect" :auto-upload="false"
						@success="onUploadSuccess('sideLeft')"></uni-file-picker>
				</view>

				<view class="photo-item">
					<view class="head">
						<view class="head-text">
							右侧面照
						</view>
					</view>
					<uni-file-picker class="file-picker" limit="1" :image-styles="imageStyles" v-model="sideRight"
						file-mediatype="image" mode="grid" @select="sideRightSelect" :auto-upload="false"
						@success="onUploadSuccess('sideRight')"></uni-file-picker>
				</view>
			</view>

		</view>

	</view>

</template>

<script setup>
	import {
		computed,
		onMounted,
		reactive,
		ref,
		watch
	} from 'vue';
	import {
		getFrontPhoto,
		getProperty,
		readBridgeImage
	} from "@/utils/readJsonNew";
	import {
		idStore
	} from "@/store/idStorage";
	import {
		userStore
	} from "@/store";
	import {
		saveBridgeImages,
		setFrontPhoto
	} from "@/utils/writeNew";

	// 接收父组件传递的数据加载状态
	const props = defineProps({
		activeTabTop: {
			type: Number,
			default: 0
		}
	});

	// 是否从json中读取数据
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

	watch(() => props.activeTabTop, (newval, oldval) => {
		if (newval == 3) {
			console.log('当前activeTabTop为：', newval) // 使用newval而不是activeTabTop
			readBridgeImageByJson();
		}
	})

	// 图片上传样式
	const imageStyles = reactive({
		width: '200rpx',
		height: '200rpx'
	});

	const frontLeftSelect = async (e) => {
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

			// 选择图片后自动保存
			await autoSavePhotos();
		}
	};

	const frontRightSelect = async (e) => {
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

			// 选择图片后自动保存
			await autoSavePhotos();
		}
	};

	const sideLeftSelect = async (e) => {
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

			// 选择图片后自动保存
			await autoSavePhotos();
		}
	};

	const sideRightSelect = async (e) => {
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

			// 选择图片后自动保存
			await autoSavePhotos();
		}
	};

	// 自动保存图片的方法
	const autoSavePhotos = async () => {
		try {
			// 检查是否有图片需要保存
			const hasImages = frontLeft.value.length > 0 ||
				frontRight.value.length > 0 ||
				sideLeft.value.length > 0 ||
				sideRight.value.length > 0;

			if (!hasImages) {
				console.log('没有图片需要保存');
				return;
			}

			// 显示加载提示
			uni.showLoading({
				title: '保存中...',
				mask: true
			});

			const savePhotoData = await createPhotoDate();
			console.log('保存的图片json数据:', savePhotoData);

			await setFrontPhoto(userInfo.username, idStorageInfo.buildingId, savePhotoData);

			// 隐藏加载提示
			uni.hideLoading();

			uni.showToast({
				title: '保存成功',
				icon: 'success',
				duration: 1500
			});

			isSubmit.value = true; // 设置为已提交状态
		} catch (error) {
			// 隐藏加载提示
			uni.hideLoading();

			console.error('保存图片失败:', error);
			uni.showToast({
				title: '保存失败，请重试',
				icon: 'none',
				duration: 1500
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

		try {
			// 检查前左侧图片是否有变化
			if (hasImageChanged(frontLeft.value, originalFrontLeft.value)) {
				result.frontLeft = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, frontLeft
					.value.map(img => img.url));
			} else {
				// 如果没有变化，尝试使用原始数据
				try {
					const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
					result.frontLeft = data.frontLeft || [];
				} catch (error) {
					console.error('获取原始frontLeft数据失败:', error);
					result.frontLeft = [];
				}
			}

			// 检查前右侧图片是否有变化
			if (hasImageChanged(frontRight.value, originalFrontRight.value)) {
				result.frontRight = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, frontRight
					.value.map(img => img.url));
			} else {
				// 如果没有变化，尝试使用原始数据
				try {
					const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
					result.frontRight = data.frontRight || [];
				} catch (error) {
					console.error('获取原始frontRight数据失败:', error);
					result.frontRight = [];
				}
			}

			// 检查侧左侧图片是否有变化
			if (hasImageChanged(sideLeft.value, originalSideLeft.value)) {
				result.sideLeft = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, sideLeft
					.value.map(img => img.url));
			} else {
				// 如果没有变化，尝试使用原始数据
				try {
					const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
					result.sideLeft = data.sideLeft || [];
				} catch (error) {
					console.error('获取原始sideLeft数据失败:', error);
					result.sideLeft = [];
				}
			}

			// 检查侧右侧图片是否有变化
			if (hasImageChanged(sideRight.value, originalSideRight.value)) {
				result.sideRight = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, sideRight
					.value.map(img => img.url));
			} else {
				// 如果没有变化，尝试使用原始数据
				try {
					const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
					result.sideRight = data.sideRight || [];
				} catch (error) {
					console.error('获取原始sideRight数据失败:', error);
					result.sideRight = [];
				}
			}
		} catch (error) {
			console.error('创建照片数据失败:', error);
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

	const onUploadSuccess = async (type) => {
		console.log(`${type} 上传成功`);

		// 根据不同类型保存对应的图片数据
		const savePhotoData = await createPhotoDate();
		console.log('保存的图片json数据:', savePhotoData);
		await setFrontPhoto(userInfo.username, idStorageInfo.buildingId, savePhotoData);

		uni.showToast({
			title: '保存成功',
			icon: 'success',
			duration: 1500
		});

		isSubmit.value = true; // 设置为已提交状态
	};

	const readBridgeImageByJson = async () => {
		try {
			const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
			console.log('获取正立面照数据成功:', data);
			// 处理图片数据
			if (data.frontLeft && Array.isArray(data.frontLeft)) {
				const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.frontLeft);
				frontLeft.value = imagesPaths.map((url, index) => ({
					name: `图片${index + 1}`,
					url: url,
					extname: 'jpg',
				}));
				// 保存原始图片数据
				originalFrontLeft.value = JSON.parse(JSON.stringify(frontLeft.value));
			}
			if (data.frontRight && Array.isArray(data.frontRight)) {
				const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.frontRight);
				frontRight.value = imagesPaths.map((url, index) => ({
					name: `图片${index + 1}`,
					url: url,
					extname: 'jpg',
				}));
				// 保存原始图片数据
				originalFrontRight.value = JSON.parse(JSON.stringify(frontRight.value));
			}
			if (data.sideLeft && Array.isArray(data.sideLeft)) {
				const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.sideLeft);
				sideLeft.value = imagesPaths.map((url, index) => ({
					name: `图片${index + 1}`,
					url: url,
					extname: 'jpg',
				}));
				// 保存原始图片数据
				originalSideLeft.value = JSON.parse(JSON.stringify(sideLeft.value));
			}
			if (data.sideRight && Array.isArray(data.sideRight)) {
				const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.sideRight);
				sideRight.value = imagesPaths.map((url, index) => ({
					name: `图片${index + 1}`,
					url: url,
					extname: 'jpg',
				}));
				// 保存原始图片数据
				originalSideRight.value = JSON.parse(JSON.stringify(sideRight.value));
			}

			// 如果有数据，设置为已提交状态
			if (data.frontLeft?.length || data.frontRight?.length || data.sideLeft?.length || data.sideRight
				?.length) {
				isSubmit.value = true;
			}

		} catch (error) {
			console.error('读取正立面照失败:', error);
			// 初始化为空数组，不影响用户新上传图片
			frontLeft.value = [];
			frontRight.value = [];
			sideLeft.value = [];
			sideRight.value = [];
			originalFrontLeft.value = [];
			originalFrontRight.value = [];
			originalSideLeft.value = [];
			originalSideRight.value = [];
			isSubmit.value = false;
		}
	};

	// 组件挂载时
	onMounted(async () => {
		// 只有当数据加载完成时才读取图片数据
		await readBridgeImageByJson();
	});
</script>

<style scoped>
	.title {
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

	.save {
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
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.file-picker {
		margin-top: 20rpx;
		margin-left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
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
		width: 100%;
		text-align: center;
	}

	.head-text {
		padding: 4rpx 10rpx;
		font-size: 20rpx;
		text-align: center;
	}

	.not-submitted {
		color: red;
	}
</style>
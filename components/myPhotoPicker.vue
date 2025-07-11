<template>
	<view class="photo-picker">
		<!-- 预览区域（点击触发弹窗） -->
		<view class="preview-list">
			<view v-for="(img, idx) in modelValue" :key="idx" class="preview-container">
				<!-- 添加点击事件预览图片 -->
				<image :src="img" class="preview-image" mode="aspectFill" @click="previewImage(idx)" />
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
					<input class="photo-number-input" v-model="photoNumber" placeholder="请输入照片序号" type="text" />
				</view>
				<view class="popup-buttons">
					<view class="btn cancel-btn" @click="cancelPhotoNumber">取消</view>
					<view class="btn confirm-btn" @click="confirmPhotoNumber">确定</view>
				</view>
			</view>
			<view class="popup-mask" @click="cancelPhotoNumber"></view>
		</view>

		<!-- 隐藏的canvas，用于生成带数字的图片 -->
		<canvas canvas-id="numberCanvas" class="hidden-canvas"
			style="position: absolute; left: -9999px; top: -9999px; width: 200px; height: 200px;"></canvas>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';

	const props = defineProps({
		modelValue: {
			type: Array,
			default: () => []
		},
		maxCount: {
			type: Number,
			default: 9
		}
	});

	const emit = defineEmits(['select', 'update:modelValue', 'delete']);

	const actionSheetVisible = ref(false);
	const photoNumberVisible = ref(false);
	const photoNumber = ref('');
	// 预览图片
	const previewImage = (index) => {
		uni.previewImage({
			current: index,
			urls: props.modelValue,
			indicator: 'number',
			loop: true
		});
	};

	// 显示底部弹出层
	const showActionSheet = () => {
		if (props.modelValue.length >= props.maxCount) {
			uni.showToast({
				title: `最多只能上传${props.maxCount}张图片`,
				icon: 'none'
			});
			return;
		}
		actionSheetVisible.value = true;
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

	// 生成带数字的图片
	const generateNumberedImage = (number) => {
		return new Promise((resolve) => {
			// 创建画布上下文
			const context = uni.createCanvasContext('numberCanvas');
			const size = 200;

			// 绘制背景
			context.setFillStyle('#f0f0f0');
			context.fillRect(0, 0, size, size);

			// 绘制数字
			context.setFillStyle('#333');
			context.setFontSize(80);
			context.setTextAlign('center');
			context.setTextBaseline('middle');
			context.fillText(number, size / 2, size / 2);

			// 绘制边框
			context.setStrokeStyle('#ccc');
			context.setLineWidth(2);
			context.strokeRect(0, 0, size, size);

			// 将画布内容转为图片
			context.draw(false, () => {
				uni.canvasToTempFilePath({
					canvasId: 'numberCanvas',
					success: (res) => {
						resolve(res.tempFilePath);
					},
					fail: (err) => {
						console.error('生成数字图片失败:', err);
						resolve(null);
					}
				});
			});
		});
	};
	// 确认照片序号输入
	const confirmPhotoNumber = async () => {
		if (photoNumber.value.trim()) {
			try {
				// 生成带数字的图片
				const numberedImagePath = await generateNumberedImage(photoNumber.value);

				if (numberedImagePath) {
					// 将生成的图片添加到图片列表中
					const newImages = [...props.modelValue, numberedImagePath];
					emit('update:modelValue', newImages);
					emit('select');

					uni.showToast({
						title: `已生成序号${photoNumber.value}的图片`,
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: '生成图片失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('生成数字图片失败:', error);
				uni.showToast({
					title: '生成图片失败',
					icon: 'none'
				});
			}

			photoNumberVisible.value = false;
			photoNumber.value = '';
		} else {
			uni.showToast({
				title: '请输入照片序号',
				icon: 'none'
			});
		}
	};

	// 处理图片选择成功
	const handleImageSuccess = (filePath) => {
		const newImages = [...props.modelValue, filePath];
		emit('update:modelValue', newImages);
		emit('select'); // 不传递参数，只触发事件
		uni.showToast({
			title: '图片已选择',
			icon: 'success'
		});
	};

	const deleteImage = (idx) => {
		const deletedImage = props.modelValue[idx];
		const newImages = [...props.modelValue];
		newImages.splice(idx, 1);
		emit('update:modelValue', newImages);
		emit('delete', {
			index: idx,
			image: deletedImage
		});
		uni.showToast({
			title: '图片已删除',
			icon: 'success'
		});
	};
</script>

<style scoped>
	.photo-picker {
		padding: 10rpx;
		box-sizing: border-box;
		position: relative;
		width: 100%;
	}

	.preview-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap; /* 改回换行 */
		gap: 10rpx;
		justify-content: flex-start;
		width: 100%; /* 固定宽度 */
		margin-top: 10rpx;
	}

	.preview-container {
		border: none;
		border-radius: 8rpx;
		padding: 0;
		width: calc(50% - 10rpx); /* 一行两个，考虑间距 */
		height: 220rpx;
		min-width: calc(50% - 10rpx);
		min-height: 220rpx;
		max-width: calc(50% - 10rpx);
		max-height: 220rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f9f9f9;
		cursor: pointer;
		box-sizing: border-box;
		position: relative;
		margin-bottom: 10rpx;
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
		top: -15px;
		right: -15px;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
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

	/* 修改图片预览模式为填充 */
	.preview-image {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
		object-fit: cover;
	}

	/* 调整预览容器尺寸 */
	.preview-container {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		min-width: 200rpx;
		min-height: 200rpx;
		max-width: 200rpx;
		max-height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f9f9f9;
		cursor: pointer;
		box-sizing: border-box;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.image-index {
		position: absolute;
		top: 8rpx;
		left: 8rpx;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 4rpx 10rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		z-index: 2;
	}
</style>
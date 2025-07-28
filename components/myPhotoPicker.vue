<template>
	<view class="photo-picker">
		<!-- 预览区域（点击触发弹窗） -->
		<view class="preview-list">
			<view v-for="(img, idx) in modelValue" :key="idx" class="photo-item-container">
				<!-- 图片预览容器 -->
				<view class="preview-container">
					<!-- 添加点击事件预览图片 -->
					<image :src="img" class="preview-image" mode="aspectFill" @click="previewImage(idx)" />
					<view class="delete-icon" @click.stop="deleteImage(idx)">×</view>
				</view>
				<!-- 对应的图片信息按钮 - 恢复v-if条件 -->
				<view class="info-button-wrapper" v-if="buttonInfo.show">
					<button class="info-button" @click="showPhotoInfo(idx)">图片信息</button>
				</view>
			</view>
			<!-- 添加按钮，仅在未达到上限时显示 -->
			<view v-if="modelValue.length < limit" class="preview-container" @click="showActionSheet">
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
		
		<!-- 画线编辑弹窗 -->
		<view class="drawing-popup" v-if="drawingVisible">
			<view class="drawing-content">
				<view class="popup-title">在图片上标记</view>
				<view class="canvas-container" :style="{ height: canvasContainerHeight }">
					<canvas canvas-id="drawingCanvas" class="drawing-canvas"
						@touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"></canvas>
				</view>
				<view class="popup-buttons">
					<view class="btn cancel-btn" @click="cancelDrawing">取消</view>
					<view class="btn undo-btn" :class="{ 'btn-disabled': strokeHistory.length === 0 }" @click="undoLastStroke">
						撤销
					</view>
					<view class="btn confirm-btn" :class="{ 'btn-disabled': isProcessing }" @click="confirmDrawing">
						{{ isProcessing ? '处理中...' : '确定' }}
					</view>
				</view>
			</view>
		</view>

		<!-- 隐藏的canvas，用于生成带数字的图片 -->
		<canvas :canvas-id="canvasId" class="hidden-canvas"
			style="position: absolute; left: -9999px; top: -9999px; width: 200px; height: 200px;"></canvas>
		<!-- 备用canvas -->
		<canvas canvas-id="fallbackCanvas" class="hidden-canvas"
			style="position: absolute; left: -9999px; top: -9999px; width: 100px; height: 100px;"></canvas>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
import {ButtonStore} from '@/store/button.js'
	const props = defineProps({
		modelValue: {
			type: Array,
			default: () => []
		},
		limit: {
			type: Number,
			default: 20
		}
	});
	const buttonInfo = ButtonStore()
	const emit = defineEmits(['select', 'update:modelValue', 'delete', 'showPhotoInfo']);

	const actionSheetVisible = ref(false);
	const photoNumberVisible = ref(false);
	const photoNumber = ref('');
	
	// 绘画相关变量
	const drawingVisible = ref(false);
	const currentEditingImage = ref('');
	const lastPoint = ref({ x: 0, y: 0 });
	const isDrawing = ref(false);
	const imageInfo = ref(null);
	const drawingPoints = ref([]);
	const canvasContainerHeight = ref('600rpx');
	const isProcessing = ref(false); // 防重复点击标志
	const lastDrawTime = ref(0); // 上次绘制时间，用于节流
	let drawingContext = null; // 全局画布上下文，避免重复创建

	// 撤销功能相关变量
	const strokeHistory = ref([]); // 存储每一笔的历史记录
	const currentStroke = ref([]); // 当前正在绘制的笔画
	
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
		if (props.modelValue.length >= props.limit) {
			uni.showToast({
				title: `最多只能上传${props.limit}张图片`,
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
	
	// 显示图片信息
	const showPhotoInfo = (index) => {
		emit('showPhotoInfo', index);
		buttonInfo.reback();
	};
	
	// 拍摄照片
	const takePhoto = () => {
		closeActionSheet();
		uni.chooseImage({
			count: 1,
			sourceType: ['camera'],
			sizeType: ['original'],
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
			sizeType: ['original'],
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
	const confirmPhotoNumber = async () => {
		if (photoNumber.value.trim()) {
			try {
				uni.showLoading({
					title: '正在生成图片...'
				});
				
				// 生成带数字的图片
				const numberedImagePath = await generateNumberedImage(photoNumber.value);
				console.log('numberedImagePath', numberedImagePath);

				uni.hideLoading();
				
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
				uni.hideLoading();
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
	
	// 为每个组件实例生成唯一的Canvas ID
	const canvasId = ref(`numberCanvas_${Date.now()}_${Math.floor(Math.random() * 1000)}`);

	// 生成带数字的图片
	const generateNumberedImage = (number) => {
		return new Promise((resolve) => {
			try {
				// 创建画布上下文
				const context = uni.createCanvasContext(canvasId.value);
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
						canvasId: canvasId.value,
						success: (res) => {
							console.log('生成图片成功', res.tempFilePath);
							resolve(res.tempFilePath);
						},
						fail: (err) => {
							console.error('生成数字图片失败:', err);
							// 失败时尝试创建一个备用的纯色图片
							createFallbackImage(number).then(fallbackPath => {
								resolve(fallbackPath);
							});
						}
					});
				});
			} catch (error) {
				console.error('Canvas创建失败:', error);
				// 出错时创建备用图片
				createFallbackImage(number).then(fallbackPath => {
					resolve(fallbackPath);
				});
			}
		});
	};

	// 创建备用图片（当Canvas方法失败时使用）
	const createFallbackImage = (number) => {
		return new Promise((resolve) => {
			// 使用uni-app提供的绘制API创建一个简单的带数字的图片
			const context = uni.createCanvasContext('fallbackCanvas');
			const size = 100;
			
			context.setFillStyle('#f0f0f0');
			context.fillRect(0, 0, size, size);
			
			context.setFillStyle('#333');
			context.setFontSize(40);
			context.setTextAlign('center');
			context.setTextBaseline('middle');
			context.fillText(number, size/2, size/2);
			
			context.draw(true, () => {
				uni.canvasToTempFilePath({
					canvasId: 'fallbackCanvas',
					success: (res) => {
						console.log('备用图片生成成功', res.tempFilePath);
						resolve(res.tempFilePath);
					},
					fail: () => {
						// 如果备用方法也失败，返回null
						console.error('备用图片也生成失败');
						resolve(null);
					}
				});
			});
		});
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
	
	// 删除图片
	const deleteImage = (idx) => {
		const deletedImage = props.modelValue[idx];
		const newImages = [...props.modelValue];
		newImages.splice(idx, 1);
		emit('update:modelValue', newImages);
		emit('delete', {
			index: idx,
			image: deletedImage
		});
	};
</script>

<style scoped>
	.photo-picker {
		box-sizing: border-box;
		position: relative;
	}

	.preview-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		justify-content: flex-start;
		/* 关键：左对齐 */
	}

	.photo-item-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 200rpx;
		margin-bottom: 20rpx;
	}

	.preview-container {
		border: none;
		border-radius: 0;
		padding: 0;
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
		position: relative;
		/* Added for delete icon positioning */
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
		width: 100%;
		height: 100%;
	}

	.plus-icon {
		width: 60rpx;
		height: 60rpx;
		position: relative;
		margin: 0 auto;
		margin-bottom: 30rpx;
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
	
	/* 图片信息按钮包装器 */
	.info-button-wrapper {
		width: 200rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10rpx;
	}
	
	.info-text {
		font-size: 24rpx;
		color: #333;
	}

	.delete-icon {
		position: absolute;
		top: -5%;
		right: -5%;
		background-color:#999;
		color: white;
		width: 22rpx;
		height: 22rpx;
		border-radius: 50%;
		display: 	flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
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
		padding: 27rpx;
		width: 53%;
		max-width: 400rpx;
	}

	.popup-title {
		font-size: 20rpx;
		text-align: center;
		color: #0F4687;
		background-color: #BDCBE0;
		padding: 15rpx 0;
		margin: 0;
		font-weight: bold;
		letter-spacing: 1rpx;
	}

	.input-container {
		margin-bottom: 27rpx;
	}

	.photo-number-input {
		width: 100%;
		height: 53rpx;
		border: 2rpx solid #ddd;
		border-radius: 8rpx;
		padding: 0 13rpx;
		font-size: 21rpx;
		box-sizing: border-box;
	}

	.popup-buttons {
		display: flex;
		justify-content: center;
		gap: 20rpx;
		padding: 30rpx 20rpx;
		background-color: white;
		border-top: 1rpx solid #eee;
	}

	.btn {
		width: 160rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
		font-size: 20rpx;
	}

	.cancel-btn {
		background-color: #F5F5f5;
		color: #1677FF;
	}

	.confirm-btn {
		background-color: #007aff;
		color: white;
	}

	.undo-btn {
		background-color: #ff9500;
		color: white;
	}

	.btn-disabled {
		background-color: #ccc !important;
		color: #999 !important;
		pointer-events: none;
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
	
	/* 绘画编辑弹窗样式 */
	.drawing-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2000;
		display: flex;
		flex-direction: column;
		background-color: white;
	}

	.drawing-content {
		background-color: white;
		padding: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.canvas-container {
		position: relative;
		width: 100%;
		flex: 1;
		margin: 0;
		border: none;
		display: flex;
		align-items: stretch;
		justify-content: stretch;
		background-color: #000;
	}

	.drawing-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
	}
</style>
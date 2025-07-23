<template>
	<view class="photo-picker">
		<!-- 预览区域（点击触发弹窗） -->
		<view class="preview-list">
			<view v-for="(img, idx) in modelValue" :key="idx" class="preview-container">
				<!-- 添加点击事件预览图片 -->
				<image :src="img" class="preview-image" mode="aspectFill" @click="previewImage(idx)" />
				<view class="delete-icon" @click.stop="deleteImage(idx)">×</view>
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

	const emit = defineEmits(['select', 'update:modelValue', 'delete']);

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

	// 拍摄照片
	const takePhoto = () => {
		closeActionSheet();
		uni.chooseImage({
			count: 1,
			sourceType: ['camera'],
			sizeType: ['original'],
			success: (res) => {
				// 显示绘画编辑界面
				currentEditingImage.value = res.tempFilePaths[0];
				// 获取图片信息
				uni.getImageInfo({
					src: currentEditingImage.value,
					success: (info) => {
						imageInfo.value = info;
						showDrawingEditor();
					},
					fail: (err) => {
						console.error('获取图片信息失败:', err);
						handleImageSuccess(currentEditingImage.value);
					}
				});
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
				// 显示绘画编辑界面
				currentEditingImage.value = res.tempFilePaths[0];
				// 获取图片信息
				uni.getImageInfo({
					src: currentEditingImage.value,
					success: (info) => {
						imageInfo.value = info;
						showDrawingEditor();
					},
					fail: (err) => {
						console.error('获取图片信息失败:', err);
						handleImageSuccess(currentEditingImage.value);
					}
				});
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
	
	// 显示绘画编辑器
	const showDrawingEditor = () => {
		drawingVisible.value = true;
		drawingPoints.value = [];
		// 确保DOM渲染完成后再初始化画布
		setTimeout(() => {
			setupCanvasSize();
		}, 150);
	};

	// 设置画布尺寸以适应原图
	const setupCanvasSize = () => {
		if (!imageInfo.value) return;

		// 获取系统信息来计算合适的画布尺寸
		uni.getSystemInfo({
			success: (sysInfo) => {
				const screenWidth = sysInfo.screenWidth;
				const screenHeight = sysInfo.screenHeight;
				const imageWidth = imageInfo.value.width;
				const imageHeight = imageInfo.value.height;

				// 计算图片的宽高比
				const imageAspectRatio = imageWidth / imageHeight;
				const screenAspectRatio = screenWidth / screenHeight;

				let containerWidth, containerHeight;

				// 根据图片方向和屏幕比例智能计算容器尺寸
				if (imageHeight > imageWidth) {
					// 竖屏图片：以高度为准，限制最大高度为屏幕高度的85%
					const maxHeight = screenHeight * 0.85;
					containerHeight = Math.min(imageHeight * (screenWidth * 0.9) / imageWidth, maxHeight);
					containerWidth = containerHeight * imageAspectRatio;
				} else {
					// 横屏图片：以宽度为准
					containerWidth = screenWidth * 0.9;
					containerHeight = containerWidth / imageAspectRatio;

					// 如果计算出的高度超过屏幕高度的80%，则重新计算
					const maxHeight = screenHeight * 0.8;
					if (containerHeight > maxHeight) {
						containerHeight = maxHeight;
						containerWidth = containerHeight * imageAspectRatio;
					}
				}

				console.log('图片尺寸:', imageWidth, 'x', imageHeight);
				console.log('屏幕尺寸:', screenWidth, 'x', screenHeight);
				console.log('容器尺寸:', containerWidth, 'x', containerHeight);

				// 设置画布容器高度
				canvasContainerHeight.value = containerHeight + 'px';

				// 等待DOM更新后再初始化画布
				setTimeout(() => {
					initDrawingCanvas();
				}, 200);
			}
		});
	};

	// 初始化绘画画布
	const initDrawingCanvas = (retryCount = 0) => {
		if (!imageInfo.value) return;

		// 创建全局画布上下文
		drawingContext = uni.createCanvasContext('drawingCanvas');

		// 获取画布容器尺寸
		const query = uni.createSelectorQuery();
		query.select('.canvas-container').boundingClientRect((rect) => {
			if (rect && rect.width > 0 && rect.height > 0) {
				const containerWidth = rect.width;
				const containerHeight = rect.height;

				console.log('画布容器尺寸:', containerWidth, 'x', containerHeight);
				console.log('原图尺寸:', imageInfo.value.width, 'x', imageInfo.value.height);

				// 按容器尺寸绘制原图，保持原图比例
				drawingContext.drawImage(currentEditingImage.value, 0, 0, containerWidth, containerHeight);

				// 预设置线条样式，确保第一次绘制时样式正确
				setCanvasLineStyle(drawingContext);

				drawingContext.draw(true); // 强制立即绘制

				// 进行一次隐形的样式测试绘制，确保上下文状态稳定
				setTimeout(() => {
					if (drawingContext) {
						setCanvasLineStyle(drawingContext);
						// 在画布外绘制一个不可见的点，激活样式设置
						drawingContext.beginPath();
						drawingContext.moveTo(-1, -1);
						drawingContext.lineTo(-1, -1);
						drawingContext.stroke();
						drawingContext.draw(true);
						console.log('画布样式初始化完成');
					}
				}, 100);
			} else if (retryCount < 3) {
				// 如果获取不到容器尺寸，重试
				console.log('画布容器尺寸获取失败，重试中...', retryCount + 1);
				setTimeout(() => {
					initDrawingCanvas(retryCount + 1);
				}, 300);
			} else {
				console.error('画布初始化失败：无法获取容器尺寸');
			}
		}).exec();
	};

	// 设置画布线条样式的统一方法
	const setCanvasLineStyle = (context) => {
		context.setStrokeStyle('#FF0000');
		context.setLineWidth(3);
		context.setLineCap('round');
		context.setLineJoin('round');
	};

	// 触摸开始事件
	const touchStart = (e) => {
		isDrawing.value = true;
		lastPoint.value = {
			x: e.touches[0].x,
			y: e.touches[0].y
		};

		// 开始新的笔画记录
		currentStroke.value = [{
			type: 'start',
			x: lastPoint.value.x,
			y: lastPoint.value.y
		}];

		// 记录起始点（保持原有逻辑）
		drawingPoints.value.push({
			type: 'start',
			x: lastPoint.value.x,
			y: lastPoint.value.y
		});

		// 确保画布上下文存在
		if (!drawingContext) {
			drawingContext = uni.createCanvasContext('drawingCanvas');
		}

		// 每次绘制前都重新设置线条样式，确保样式生效
		setCanvasLineStyle(drawingContext);

		// 绘制起始点（小圆点）
		drawingContext.setFillStyle('#FF0000');
		drawingContext.beginPath();
		drawingContext.arc(lastPoint.value.x, lastPoint.value.y, 1.5, 0, 2 * Math.PI);
		drawingContext.fill();
		drawingContext.draw(true);
	};

	// 触摸移动事件
	const touchMove = (e) => {
		if (!isDrawing.value) return;

		const currentTime = Date.now();
		const currentPoint = {
			x: e.touches[0].x,
			y: e.touches[0].y
		};

		// 计算距离，避免绘制过于密集的点
		const distance = Math.sqrt(
			Math.pow(currentPoint.x - lastPoint.value.x, 2) +
			Math.pow(currentPoint.y - lastPoint.value.y, 2)
		);

		// 节流：距离太小或时间间隔太短则跳过
		if (distance < 2 && currentTime - lastDrawTime.value < 16) {
			return;
		}

		// 记录移动点到当前笔画
		currentStroke.value.push({
			type: 'move',
			x: currentPoint.x,
			y: currentPoint.y
		});

		// 记录移动点（保持原有逻辑）
		drawingPoints.value.push({
			type: 'move',
			x: currentPoint.x,
			y: currentPoint.y
		});

		// 使用增量绘制，只绘制新的线段
		drawIncrementalLine(lastPoint.value, currentPoint);

		// 更新上一点位置和绘制时间
		lastPoint.value = currentPoint;
		lastDrawTime.value = currentTime;
	};

	// 增量绘制线条（性能优化）
	const drawIncrementalLine = (fromPoint, toPoint) => {
		// 确保画布上下文存在
		if (!drawingContext) {
			drawingContext = uni.createCanvasContext('drawingCanvas');
		}

		// 每次绘制前都重新设置线条样式，确保曲线效果
		setCanvasLineStyle(drawingContext);

		// 绘制从上一点到当前点的线段
		drawingContext.beginPath();
		drawingContext.moveTo(fromPoint.x, fromPoint.y);
		drawingContext.lineTo(toPoint.x, toPoint.y);
		drawingContext.stroke();

		// 立即绘制，不清除之前的内容
		drawingContext.draw(true);
	};

	// 重新绘制画布（用于撤销等需要完整重绘的场景）
	const redrawCanvas = () => {
		if (!imageInfo.value) return;

		const context = uni.createCanvasContext('drawingCanvas');

		// 获取画布容器尺寸
		const query = uni.createSelectorQuery();
		query.select('.canvas-container').boundingClientRect((rect) => {
			if (rect) {
				const containerWidth = rect.width;
				const containerHeight = rect.height;

				// 按容器尺寸绘制原图，保持原图比例
				context.drawImage(currentEditingImage.value, 0, 0, containerWidth, containerHeight);

				// 设置线条样式
				context.setStrokeStyle('#FF0000');
				context.setLineWidth(3);
				context.setLineCap('round');
				context.setLineJoin('round');

				// 绘制所有记录的线条
				let startPoint = null;

				for (const point of drawingPoints.value) {
					if (point.type === 'start') {
						startPoint = point;
						context.beginPath();
						context.moveTo(point.x, point.y);
					} else if (point.type === 'move' && startPoint) {
						context.lineTo(point.x, point.y);
						context.stroke();
						context.beginPath();
						context.moveTo(point.x, point.y);
					}
				}

				context.draw(true); // 强制立即绘制
			}
		}).exec();
	};

	// 触摸结束事件
	const touchEnd = () => {
		isDrawing.value = false;

		// 保存完成的笔画到历史记录
		if (currentStroke.value.length > 0) {
			strokeHistory.value.push([...currentStroke.value]);
			currentStroke.value = [];
			console.log('保存笔画，当前历史记录数量:', strokeHistory.value.length);
		}
	};

	// 撤销最后一笔
	const undoLastStroke = () => {
		if (strokeHistory.value.length === 0) {
			uni.showToast({
				title: '没有可撤销的操作',
				icon: 'none'
			});
			return;
		}

		// 移除最后一笔
		strokeHistory.value.pop();
		console.log('撤销一笔，剩余历史记录数量:', strokeHistory.value.length);

		// 重新绘制画布
		redrawCanvasFromHistory();
	};

	// 从历史记录重新绘制画布
	const redrawCanvasFromHistory = () => {
		if (!imageInfo.value || !drawingContext) return;

		// 获取画布容器尺寸
		const query = uni.createSelectorQuery();
		query.select('.canvas-container').boundingClientRect((rect) => {
			if (rect && rect.width > 0 && rect.height > 0) {
				const containerWidth = rect.width;
				const containerHeight = rect.height;

				// 清空画布并重新绘制背景图片
				drawingContext.clearRect(0, 0, containerWidth, containerHeight);
				drawingContext.drawImage(currentEditingImage.value, 0, 0, containerWidth, containerHeight);

				// 设置线条样式
				drawingContext.setStrokeStyle('#FF0000');
				drawingContext.setLineWidth(3);
				drawingContext.setLineCap('round');
				drawingContext.setLineJoin('round');

				// 重新绘制所有保存的笔画
				strokeHistory.value.forEach(stroke => {
					let startPoint = null;
					stroke.forEach(point => {
						if (point.type === 'start') {
							startPoint = point;
							// 绘制起始点
							drawingContext.setFillStyle('#FF0000');
							drawingContext.beginPath();
							drawingContext.arc(point.x, point.y, 1.5, 0, 2 * Math.PI);
							drawingContext.fill();
						} else if (point.type === 'move' && startPoint) {
							// 绘制线段
							drawingContext.beginPath();
							drawingContext.moveTo(startPoint.x, startPoint.y);
							drawingContext.lineTo(point.x, point.y);
							drawingContext.stroke();
							startPoint = point;
						}
					});
				});

				drawingContext.draw(true);

				// 同步更新 drawingPoints（用于最终保存）
				drawingPoints.value = [];
				strokeHistory.value.forEach(stroke => {
					drawingPoints.value.push(...stroke);
				});
			}
		}).exec();
	};

	// 取消绘画
	const cancelDrawing = () => {
		// 如果正在处理，先隐藏加载提示
		if (isProcessing.value) {
			uni.hideLoading();
			isProcessing.value = false;
		}

		// 重置画布上下文
		drawingContext = null;

		// 清空撤销历史记录
		strokeHistory.value = [];
		currentStroke.value = [];

		drawingVisible.value = false;
		currentEditingImage.value = '';
		imageInfo.value = null;
		drawingPoints.value = [];
	};

	// 确认绘画
	const confirmDrawing = () => {
		// 防重复点击
		if (isProcessing.value) {
			return;
		}

		isProcessing.value = true;
		uni.showLoading({
			title: '正在保存图片...'
		});

		// 计算合适的输出尺寸，目标1MB以内
		const maxWidth = 2000; // 提高最大宽度以保持清晰度
		const maxHeight = 2000; // 提高最大高度以保持清晰度
		let outputWidth = imageInfo.value ? imageInfo.value.width : maxWidth;
		let outputHeight = imageInfo.value ? imageInfo.value.height : maxHeight;

		// 如果图片过大，按比例缩小
		if (outputWidth > maxWidth || outputHeight > maxHeight) {
			const ratio = Math.min(maxWidth / outputWidth, maxHeight / outputHeight);
			outputWidth = Math.floor(outputWidth * ratio);
			outputHeight = Math.floor(outputHeight * ratio);
		}

		// 将画布内容转为图片，控制尺寸
		uni.canvasToTempFilePath({
			canvasId: 'drawingCanvas',
			width: imageInfo.value ? imageInfo.value.width : undefined,
			height: imageInfo.value ? imageInfo.value.height : undefined,
			destWidth: outputWidth,
			destHeight: outputHeight,
			fileType: 'jpg',
			quality: 0.95, // 设置初始质量为95%，优先保证清晰度
			success: (res) => {
				uni.hideLoading();
				isProcessing.value = false;

				// 检查文件大小，如果还是太大就进一步压缩
				checkAndCompressImage(res.tempFilePath);
			},
			fail: (err) => {
				console.error('保存绘画失败:', err);
				uni.hideLoading();
				isProcessing.value = false;

				// 如果转换失败，使用原图
				handleImageSuccess(currentEditingImage.value);
				drawingVisible.value = false;
				currentEditingImage.value = '';
				imageInfo.value = null;
				drawingPoints.value = [];
			}
		});
	};

	// 智能压缩图片到1MB以内，优先保证清晰度
	const checkAndCompressImage = (filePath) => {
		uni.getFileInfo({
			filePath: filePath,
			success: (fileInfo) => {
				const fileSizeKB = fileInfo.size / 1024;
				console.log('图片大小:', fileSizeKB.toFixed(2) + 'KB');

				if (fileSizeKB <= 1024) {
					// 文件大小在1MB以内，直接使用
					console.log('图片大小符合要求(≤1MB)，直接使用');
					finishImageProcessing(filePath);
				} else if (fileSizeKB <= 1500) {
					// 文件稍大，轻度压缩到1MB左右
					console.log('轻度压缩到1MB以内');
					compressImage(filePath, 0.9);
				} else if (fileSizeKB <= 2048) {
					// 文件较大，中度压缩
					console.log('中度压缩到1MB以内');
					compressImage(filePath, 0.8);
				} else {
					// 文件很大，需要较强压缩
					console.log('强度压缩到1MB以内');
					compressImage(filePath, 0.7);
				}
			},
			fail: (err) => {
				console.error('获取文件信息失败:', err);
				// 获取失败也直接使用
				finishImageProcessing(filePath);
			}
		});
	};

	// 压缩图片（只压缩一次，避免过度压缩）
	const compressImage = (filePath, quality = 0.75) => {
		uni.compressImage({
			src: filePath,
			quality: quality, // 使用传入的质量参数
			success: (res) => {
				// 检查压缩后的文件大小
				uni.getFileInfo({
					filePath: res.tempFilePath,
					success: (fileInfo) => {
						const fileSizeKB = fileInfo.size / 1024;
						console.log('压缩后图片大小:', fileSizeKB.toFixed(2) + 'KB');
						// 不管大小如何，都直接使用压缩后的图片
						finishImageProcessing(res.tempFilePath);
					},
					fail: () => {
						finishImageProcessing(res.tempFilePath);
					}
				});
			},
			fail: (err) => {
				console.error('压缩图片失败:', err);
				// 压缩失败，使用原图
				finishImageProcessing(filePath);
			}
		});
	};

	// 完成图片处理
	const finishImageProcessing = (finalPath) => {
		// 将绘制好的图片添加到图片列表
		handleImageSuccess(finalPath);
		drawingVisible.value = false;
		currentEditingImage.value = '';
		imageInfo.value = null;
		drawingPoints.value = [];
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
<template>
	<view class="popup-container" v-if="visible">
		<view class="popup-mask" @click="closeModal"></view>
		<view class="popup-content">
			<view class="popup-header">
				<text class="popup-title">{{ isEditMode ? '编辑病害' : '新增病害' }}</text>
				<text class="popup-close" @click="closeModal">×</text>
			</view>
			<view class="popup-body">
				<!-- 构件和位置 -->
				<view class="form-row">
					<view class="form-item form-item-half">
						<text class="form-label">构件:</text>
						<picker @change="bindComponentChange" :value="componentIndex" :range="componentOptions">
							<view class="form-picker">
								<view class="picker-text">
									{{componentOptions[componentIndex]}}
								</view>
							</view>
						</picker>
					</view>
					<view class="form-item form-item-half">
						<text class="form-label">位置:</text>
						<picker @change="bindPositionChange" :value="positionIndex" :range="positionOptions">
							<view class="form-picker">
								<view class="picker-text">
									{{positionOptions[positionIndex]}}
								</view>
							</view>
						</picker>
					</view>
				</view>
				
				<!-- 跨号和梁号 -->
				<view class="form-row">
					<view class="form-item form-item-half">
						<text class="form-label">跨号:</text>
						<picker @change="bindSpanChange" :value="spanIndex" :range="spanOptions">
							<view class="form-picker">
								<view class="picker-text">
									{{spanOptions[spanIndex]}}
								</view>
							</view>
						</picker>
					</view>
					<view class="form-item form-item-half">
						<text class="form-label">梁号:</text>
						<picker @change="bindBeamChange" :value="beamIndex" :range="beamOptions">
							<view class="form-picker">
								<view class="picker-text">
									{{beamOptions[beamIndex]}}
								</view>
							</view>
						</picker>
					</view>
				</view>
				
				<!-- 病害类型和标度 -->
				<view class="form-row">
					<view class="form-item form-item-half">
						<text class="form-label">病害类型:</text>
						<picker @change="bindSubclassChange" :value="subclassIndex" :range="subclassOptions">
							<view class="form-picker">
								<view class="picker-text">
									{{subclassOptions[subclassIndex]}}
								</view>
							</view>
						</picker>
					</view>
					<view class="form-item form-item-half">
						<text class="form-label">标度:</text>
						<picker @change="bindRatingChange" :value="ratingIndex" :range="ratingOptions">
							<view class="form-picker">
								<view class="picker-text">
									{{ratingOptions[ratingIndex]}}类
								</view>
							</view>
						</picker>
					</view>
				</view>
				
				<!-- 数量和范围坐标放在同一行 -->
				<view class="form-row">
					<view class="form-item form-item-quantity">
						<text class="form-label">数量:</text>
						<view class="form-input">
							<input type="number" v-model="formData.quantity" placeholder="数量" value="1" />
						</view>
					</view>
					<view class="form-item form-item-coordinates">
						<text class="form-label">范围:</text>
						<view class="coordinate-inputs">
							<input type="text" v-model="formData.rangeX1" class="coordinate-input" placeholder="X1">
							<text class="coordinate-separator">-</text>
							<input type="text" v-model="formData.rangeY1" class="coordinate-input" placeholder="Y1">
							<text class="coordinate-separator">-</text>
							<input type="text" v-model="formData.rangeX2" class="coordinate-input" placeholder="X2">
							<text class="coordinate-separator">-</text>
							<input type="text" v-model="formData.rangeY2" class="coordinate-input" placeholder="Y2">
						</view>
					</view>
				</view>
				
				<!-- 长度和Δ值 -->
				<view class="form-row">
					<view class="form-item form-item-half">
						<text class="form-label">长度 L(m):</text>
						<view class="form-input">
							<input type="digit" v-model="formData.length" placeholder="请输入长度" />
						</view>
					</view>
					<view class="form-item form-item-half">
						<text class="form-label">Δ值 (mm):</text>
						<view class="form-input">
							<input type="digit" v-model="formData.delta" placeholder="请输入Δ值" />
						</view>
					</view>
				</view>
				
				<!-- 添加图片上传区域 -->
				<view class="form-item">
					<text class="form-label">病害图片:</text>
					<view class="image-upload-area">
						<view class="image-list">
							<view v-if="formData.imageUrl" class="image-item">
								<image :src="formData.imageUrl" mode="aspectFill" class="preview-image"></image>
								<text class="delete-icon" @click="deleteImage">×</text>
							</view>
							<view class="image-add-btn" @click="chooseImage" v-if="!formData.imageUrl">
								<text class="add-icon">+</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 备注 -->
				<view class="form-item">
					<text class="form-label">备注:</text>
					<view class="form-input textarea-box">
						<input type="text" v-model="formData.remark" placeholder="请输入备注信息" />
					</view>
				</view>
			</view>
			<view class="popup-footer">
				<button class="btn-cancel" @click="closeModal">关闭</button>
				<button class="btn-middle" @click="pasteDiseaseInfo">粘贴病害</button>
				<button class="btn-confirm" @click="confirmAdd">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"add-disease",
		data() {
			return {
				visible: false,
				// 构件选项
				componentOptions: ['小箱梁', '大箱梁', '桥墩', '桥台', '支座', '横梁'],
				componentIndex: 0,
				
				// 跨号选项
				spanOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
				spanIndex: 0,
				
				// 梁号选项
				beamOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
				beamIndex: 0,
				
				// 位置选项
				positionOptions: ['左腹板', '右腹板', '底板', '顶板', '内侧', '外侧'],
				positionIndex: 0,
				
				// 病害类型选项
				subclassOptions: ['斜向裂缝', '竖向裂缝', '水平裂缝', '网状裂缝', '剥落', '麻面', '锈蚀'],
				subclassIndex: 0,
				
				// 标度选项
				ratingOptions: ['1', '2', '3', '4', '5'],
				ratingIndex: 2,
				
				// 表单数据
				formData: {
					component: '小箱梁',
					spanNumber: '1',
					beamNumber: '1',
					position: '左腹板',
					subclass: '斜向裂缝',
					rating: '3',
					quantity: '1',
					length: '',
					delta: '',
					remark: '',
					rangeX1: '',
					rangeY1: '',
					rangeX2: '',
					rangeY2: '',
					imageUrl: '',
					imageInfo: null
				},
				
				// 编辑模式标记
				isEditMode: false,
				// 原病害ID
				originalId: null
			};
		},
		methods: {
			// 选择器改变事件
			bindComponentChange(e) {
				this.componentIndex = e.detail.value;
				this.formData.component = this.componentOptions[this.componentIndex];
			},
			bindSpanChange(e) {
				this.spanIndex = e.detail.value;
				this.formData.spanNumber = this.spanOptions[this.spanIndex];
			},
			bindBeamChange(e) {
				this.beamIndex = e.detail.value;
				this.formData.beamNumber = this.beamOptions[this.beamIndex];
			},
			bindPositionChange(e) {
				this.positionIndex = e.detail.value;
				this.formData.position = this.positionOptions[this.positionIndex];
			},
			bindSubclassChange(e) {
				this.subclassIndex = e.detail.value;
				this.formData.subclass = this.subclassOptions[this.subclassIndex];
			},
			bindRatingChange(e) {
				this.ratingIndex = e.detail.value;
				this.formData.rating = this.ratingOptions[this.ratingIndex];
			},
			
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1, // 只能选择1张图片
					sizeType: ['compressed'], // 压缩图片
					sourceType: ['album', 'camera'], // 相册或相机
					success: (res) => {
						// 获取图片路径
						const tempFilePath = res.tempFilePaths[0];
						// 获取图片信息
						uni.getImageInfo({
							src: tempFilePath,
							success: (imageInfo) => {
								// 保存图片路径和信息
								this.formData.imageUrl = tempFilePath;
								this.formData.imageInfo = {
									path: tempFilePath,
									width: imageInfo.width,
									height: imageInfo.height,
									size: res.tempFiles[0].size,
									type: res.tempFiles[0].type || 'image/jpeg'
								};
							}
						});
					}
				});
			},
			
			// 删除图片
			deleteImage() {
				this.formData.imageUrl = '';
				this.formData.imageInfo = null;
			},
			
			// 打开弹窗 - 可接收现有病害数据进行编辑
			openModal(existingDisease = null) {
				if (existingDisease) {
					// 编辑模式 - 设置现有数据
					this.isEditMode = true;
					this.originalId = existingDisease.id;
					
					// 设置表单值
					this.formData = {
						component: existingDisease.component || '小箱梁',
						spanNumber: existingDisease.spanNumber || '1',
						beamNumber: existingDisease.beamNumber || '1',
						position: existingDisease.position || '左腹板',
						subclass: existingDisease.subclass || '斜向裂缝',
						rating: existingDisease.rating || '3',
						quantity: existingDisease.quantity || '1',
						length: existingDisease.length || '',
						delta: existingDisease.delta || '',
						remark: existingDisease.remark || '',
						rangeX1: existingDisease.rangeX1 || '',
						rangeY1: existingDisease.rangeY1 || '',
						rangeX2: existingDisease.rangeX2 || '',
						rangeY2: existingDisease.rangeY2 || '',
						imageUrl: existingDisease.imageUrl || '',
						imageInfo: existingDisease.imageInfo || null
					};
					
					// 设置选择器索引
					this.componentIndex = this.componentOptions.indexOf(this.formData.component);
					if (this.componentIndex === -1) this.componentIndex = 0;
					
					this.spanIndex = this.spanOptions.indexOf(this.formData.spanNumber);
					if (this.spanIndex === -1) this.spanIndex = 0;
					
					this.beamIndex = this.beamOptions.indexOf(this.formData.beamNumber);
					if (this.beamIndex === -1) this.beamIndex = 0;
					
					this.positionIndex = this.positionOptions.indexOf(this.formData.position);
					if (this.positionIndex === -1) this.positionIndex = 0;
					
					this.subclassIndex = this.subclassOptions.indexOf(this.formData.subclass);
					if (this.subclassIndex === -1) this.subclassIndex = 0;
					
					this.ratingIndex = this.ratingOptions.indexOf(this.formData.rating);
					if (this.ratingIndex === -1) this.ratingIndex = 2;
				} else {
					// 新增模式 - 重置数据
					this.isEditMode = false;
					this.originalId = null;
					
					// 重置表单数据
					this.formData = {
						component: this.componentOptions[this.componentIndex],
						spanNumber: this.spanOptions[this.spanIndex],
						beamNumber: this.beamOptions[this.beamIndex],
						position: this.positionOptions[this.positionIndex],
						subclass: this.subclassOptions[this.subclassIndex],
						rating: this.ratingOptions[this.ratingIndex],
						quantity: '1',
						length: '',
						delta: '',
						remark: '',
						rangeX1: '',
						rangeY1: '',
						rangeX2: '',
						rangeY2: '',
						imageUrl: '',
						imageInfo: null
					};
				}
				
				// 显示弹窗
				this.visible = true;
			},
			
			// 关闭弹窗
			closeModal() {
				this.visible = false;
			},
			
			// 粘贴病害信息
			pasteDiseaseInfo() {
				// 实现粘贴病害信息的逻辑
				uni.showToast({
					title: '粘贴病害功能待实现',
					icon: 'none'
				});
			},
			
			// 确认添加或编辑
			confirmAdd() {
				// 生成当前时间
				const now = new Date();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				const currentTime = `${month}-${day} ${hours}:${minutes}:${seconds}`;
				
				// 构建提交数据
				const submitData = {
					...this.formData,
					time: currentTime
				};
				
				// 编辑模式下传递原ID
				if (this.isEditMode && this.originalId !== null) {
					submitData.id = this.originalId;
				}
				
				// 向父组件发送事件
				this.$emit('add-disease', submitData);
				
				// 关闭弹窗
				this.closeModal();
			}
		}
	}
</script>

<style>
	.popup-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.popup-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.popup-content {
		width: 90vw;
		max-width: 90%;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0;
		overflow: hidden;
		max-height: 92vh;
		position: relative;
		z-index: 1000;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
	}
	
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8rpx 16rpx;
		border-bottom: 1rpx solid #eee;
		background-color: #f0f9ff;
	}
	
	.popup-title {
		font-size: 20rpx;
		font-weight: 500;
		color: #333; 
	}
	
	.popup-close {
		font-size: 24rpx;
		color: #999;
		line-height: 1;
	}
	
	.popup-body {
		padding: 6rpx 2vw;
		overflow-y: visible;
		background-color: #f9fcff;
	}
	
	.form-item {
		margin-bottom: 4rpx;
	}
	
	/* 行布局样式 */
	.form-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 4rpx;
		width: 100%;
	}
	
	/* 半宽表单项 */
	.form-item-half {
		width: 48%;
		margin-bottom: 0;
	}
	
	.form-label {
		font-size: 18rpx;
		margin-bottom: 2rpx;
		font-weight: 500;
		color: #333;
		display: block;
	}
	
	.form-picker, .form-input {
		height: 48rpx;
		padding: 0 8rpx;
		display: flex;
		align-items: center;
		border-radius: 4rpx;
		position: relative;
		background-color: #fff;
		border: 1rpx solid #ddd;
	}
	
	/* 区分选择器与输入框 */
	.form-picker {
		height: 48rpx;
		padding: 0 8rpx;
		display: flex;
		align-items: center;
		border-radius: 4rpx;
		position: relative;
		background-color: #fff;
		border: 1rpx solid #ddd;
		cursor: pointer;
	}
	
	.form-picker::after {
		content: '▼';
		position: absolute;
		right: 8rpx;
		color: #666;
		font-size: 14rpx;
		pointer-events: none;
	}
	
	.picker-text {
		flex: 1;
		font-size: 18rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 16rpx;
	}
	
	.form-input input {
		width: 100%;
		height: 100%;
		font-size: 18rpx;
	}
	
	.popup-footer {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 2vw;
		border-top: 1rpx solid #eee;
		background-color: #f9f9f9;
	}
	
	.btn-cancel, .btn-confirm {
		min-width: 28%;
		height: 48rpx;
		border-radius: 4rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18rpx;
		margin: 0;
		font-weight: 500;
	}
	
	.btn-cancel {
		background-color: #f5f5f5;
		color: #666;
		border: 1rpx solid #ddd;
	}
	
	.btn-confirm {
		background-color: #2979ff;
		color: #fff;
	}
	
	/* 响应式调整 */
	@media screen and (max-width: 375px) {
		.popup-content {
			width: 90vw;
			max-width: 90%;
		}
		
		.popup-body {
			padding: 20rpx 3vw;
		}
	}
	
	@media screen and (min-width: 768px) {
		.popup-content {
			width: 90vw;
			max-width: 90%;
		}
		
		.popup-body {
			padding: 30rpx 4vw;
			max-height: 75vh;
		}
	}
	
	.textarea-box {
		height: 48rpx;
		align-items: flex-start;
		padding-top: 4rpx;
	}
	
	.btn-middle {
		min-width: 28%;
		height: 48rpx;
		border-radius: 4rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18rpx;
		margin: 0;
		font-weight: 500;
		background-color: #4a90e2;
		color: #fff;
	}
	
	/* 添加范围坐标显示样式 */
	.coordinate-row {
		display: flex;
		align-items: center;
		margin-bottom: 4rpx;
	}
	
	.coordinate-label {
		width: 80rpx;
		font-size: 18rpx;
		font-weight: 500;
		color: #333;
		margin-right: 4rpx;
	}
	
	.coordinate-inputs {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.coordinate-input {
		width: 18%;
		height: 40rpx;
		border: 1rpx solid #ddd;
		border-radius: 6rpx;
		padding: 0 4rpx;
		margin: 0 2rpx;
		background-color: #fff;
		font-size: 16rpx;
	}
	
	.coordinate-separator {
		margin: 0 2rpx;
		font-size: 14rpx;
	}
	
	/* 数量和坐标布局 */
	.form-item-quantity {
		width: 25%;
	}
	
	.form-item-coordinates {
		width: 73%;
	}
	
	.coordinate-inputs {
		display: flex;
		align-items: center;
		width: 100%;
		height: 48rpx;
		background-color: #fff;
		border: 1rpx solid #ddd;
		border-radius: 4rpx;
		padding: 0 4rpx;
	}
	
	.coordinate-input {
		width: 23%;
		height: 40rpx;
		border: none;
		padding: 0 2rpx;
		margin: 0 1rpx;
		font-size: 16rpx;
		text-align: center;
	}
	
	/* 图片上传区域样式 */
	.image-upload-area {
		margin-top: 4rpx;
	}
	
	.image-list {
		display: flex;
		flex-wrap: wrap;
	}
	
	.image-item {
		width: 100rpx;
		height: 100rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		position: relative;
	}
	
	.preview-image {
		width: 100%;
		height: 100%;
		border-radius: 4rpx;
		border: 1rpx solid #ddd;
	}
	
	.delete-icon {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 50%;
		font-size: 20rpx;
	}
	
	.image-add-btn {
		width: 100rpx;
		height: 100rpx;
		border: 1rpx dashed #ccc;
		border-radius: 4rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
	}
	
	.add-icon {
		font-size: 36rpx;
		color: #999;
	}
</style>
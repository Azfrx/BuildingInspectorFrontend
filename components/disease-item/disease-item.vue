<template>
	<view class="swipe-container" @touchstart.stop="touchStart" @touchmove.stop="touchMove" @touchend.stop="touchEnd">
		<!-- 主内容区域 -->
		<view class="disease-item" :style="{ transform: `translateX(${translateX}px)` }">
			<view class="disease-content">
				<!-- 左侧图片 -->
				<view class="disease-left">
					<image :src="disease.imageUrl || disease.imageSrc || '/static/image/zjl.png'" mode="aspectFill" class="disease-image"></image>
				</view>

				<!-- 左侧内容区 -->
				<view class="disease-info">
					<view class="disease-time">本次采集(时间:{{ disease.time }})</view>
					<view class="disease-components">
						构件:{{ disease.component }}{{disease.spanNumber}}-{{disease.beamNumber}}({{disease.position}})
					</view>
					<view class="disease-type">病害:{{ disease.subclass }}</view>
					<view class="disease-description">描述:{{formattedDescription}}</view>
				</view>
			</view>

			<!-- 右侧属性区（使用绝对定位） -->
			<view class="disease-attributes">
				<view class="disease-rating">标度:{{ disease.rating }}类</view>
				<view class="disease-range">
					范围:({{ disease.rangeX1 }},{{disease.rangeY1}})~({{ disease.rangeX2 }},{{disease.rangeY2}})</view>
				<view class="disease-quantity">数量:{{ disease.quantity }}</view>
			</view>

			<!-- 最右侧箭头图标 -->
			<view class="disease-actions">
				<text class="action-icon">《</text>
			</view>
		</view>

		<!-- 滑动显示的操作按钮 -->
		<view class="swipe-actions" :style="buttonsStyle">
			<view class="action-btn edit-btn" @click.stop="handleEdit">编辑</view>
			<view class="action-btn delete-btn" @click.stop="handleDelete">删除</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "disease-item",
		props: {
			disease: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				startX: 0,
				moveX: 0,
				translateX: 0,
				isSwiping: false,
				actionWidth: 160, // 操作按钮总宽度
				buttonsTranslateX: 100, // 按钮位置的初始状态是100%（完全隐藏）
			};
		},
		computed: {
			formattedTime() {
				// 生成当前时间格式: (MM-DD HH:MM:SS)
				const now = new Date();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				return `(${month}-${day} ${hours}:${minutes}:${seconds})`;
			},
			formattedDescription() {
				const {
					length,
					delta,
					remark
				} = this.disease;
				const parts = [];
				if (length) parts.push(`长度:${length}m`);
				if (delta) parts.push(`Δ=${delta}mm`);
				if (remark) parts.push(`(${remark})`);
				return parts.join('/');
			},
			buttonsStyle() {
				// 计算按钮的样式，使用transform来控制位置
				return {
					transform: `translateX(${this.buttonsTranslateX}%)`
				};
			}
		},
		methods: {
			// 触摸开始事件
			touchStart(e) {
				e.stopPropagation(); // 阻止事件冒泡
				this.startX = e.touches[0].clientX;
				this.isSwiping = true;
			},

			// 触摸移动事件
			touchMove(e) {
				e.stopPropagation(); // 阻止事件冒泡
				if (!this.isSwiping) return;

				this.moveX = e.touches[0].clientX;
				let offsetX = this.moveX - this.startX;

				// 只允许向左滑动（显示右侧按钮）
				if (offsetX < 0) {
					// 限制最大滑动距离为按钮宽度
					if (Math.abs(offsetX) > this.actionWidth) {
						offsetX = -this.actionWidth;
					}
					this.translateX = offsetX;
					
					// 更新按钮位置 - 随着滑动逐渐显示
					this.buttonsTranslateX = 100 + (offsetX / this.actionWidth) * 100;
				} else {
					// 如果已经滑开，则允许向右滑动来关闭
					if (this.translateX < 0) {
						// 限制不能向右滑动超过初始位置
						offsetX = Math.min(offsetX, Math.abs(this.translateX));
						this.translateX = this.translateX + offsetX;
						
						// 更新按钮位置
						this.buttonsTranslateX = 100 + (this.translateX / this.actionWidth) * 100;
					}
				}
			},

			// 触摸结束事件
			touchEnd(e) {
				e.stopPropagation(); // 阻止事件冒泡
				this.isSwiping = false;

				// 根据滑动距离判断是否显示操作按钮
				if (Math.abs(this.translateX) > this.actionWidth / 2) {
					// 如果滑动距离超过操作按钮宽度的一半，完全显示按钮
					this.translateX = -this.actionWidth;
					this.buttonsTranslateX = 0; // 完全显示按钮
				} else {
					// 否则恢复初始状态
					this.translateX = 0;
					this.buttonsTranslateX = 100; // 完全隐藏按钮
				}
			},

			// 编辑操作
			handleEdit(e) {
				e.stopPropagation(); // 阻止事件冒泡
				this.$emit('edit', this.disease);
				this.translateX = 0; // 操作后复位
				this.buttonsTranslateX = 100; // 隐藏按钮
			},

			// 删除操作
			handleDelete(e) {
				e.stopPropagation(); // 阻止事件冒泡
				this.$emit('delete', this.disease);
				this.translateX = 0; // 操作后复位
				this.buttonsTranslateX = 100; // 隐藏按钮
			}
		}
	}
</script>

<style>
	.swipe-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		z-index: 1;
		touch-action: pan-x;
	}

	.disease-item {
		margin-bottom: 0.5%;
		background-color: #ffffff;
		position: relative;
		padding: 2%;
		padding-right: 5%;
		border-radius: 0;
		box-shadow: none;
		border-bottom: 1rpx solid #eee;
		display: flex;
		flex-wrap: nowrap;
		width: 100%;
		box-sizing: border-box;
		transition: transform 0.2s ease;
	}

	.disease-content {
		display: flex;
		flex: 1;
		min-width: 0;
		max-width: 75%;
	}

	/* 左侧图片区域 */
	.disease-left {
		width: 12%;
		min-width: 100rpx;
		height: 120rpx;
		margin-right: 2%;
		flex-shrink: 0;
	}

	.disease-image {
		width: 100%;
		height: 100%;
		border-radius: 4rpx;
	}

	/* 左侧信息区域 */
	.disease-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-width: 0;
		overflow: hidden;
	}

	.disease-info>view {
		margin-bottom: 1.5%;
		font-size: calc(12px + 0.3vw);
		color: #333;
		line-height: 1.5;
		white-space: normal;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		text-overflow: ellipsis;
	}

	.disease-time {
		color: #3366cc;
	}

	/* 右侧属性区域 */
	.disease-attributes {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-left: auto;
		padding-right: 1%;
		min-width: 16%;
		max-width: 25%;
		flex-shrink: 0;
	}

	.disease-attributes>view {
		margin-bottom: 1.5%;
		font-size: calc(12px + 0.3vw);
		line-height: 1.5;
		text-align: right;
		white-space: nowrap;
	}

	.disease-rating {
		color: #ff6666;
	}

	.disease-range {
		color: #32CD32;
	}

	.disease-quantity {
		color: #666;
	}

	/* 最右侧操作区 */
	.disease-actions {
		width: 4%;
		min-width: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.action-icon {
		font-size: calc(16px + 0.3vw);
		color: #999;
		font-weight: bold;
	}

	/* 滑动操作按钮 */
	.swipe-actions {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		display: flex;
		z-index: 0;
		width: 160px;
		transition: transform 0.2s ease; /* 添加过渡效果 */
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 100%;
		color: white;
		font-size: 28rpx;
	}

	.edit-btn {
		background-color: #4a90e2;
	}

	.delete-btn {
		background-color: #ff5a5a;
	}

	/* 响应式调整 - 小屏幕 */
	@media screen and (max-width: 375px) {
		.disease-item {
			padding: 1.5%;
			padding-right: 4%;
		}

		.disease-left {
			min-width: 80rpx;
			height: 100rpx;
			margin-right: 1.5%;
		}

		.disease-info>view,
		.disease-attributes>view {
			font-size: calc(11px + 0.2vw);
			margin-bottom: 1%;
		}

		.disease-content {
			max-width: 68%;
		}

		.disease-attributes {
			min-width: 15%;
		}
	}

	/* iPad - 平板设备通用 */
	@media screen and (min-width: 768px) and (max-width: 1024px) {
		.disease-item {
			padding: 2.5% 6% 2.5% 2.5%;
		}

		.disease-content {
			max-width: 76%;
		}

		.disease-left {
			min-width: 110rpx;
			max-width: 10%;
			height: auto;
			aspect-ratio: 1/1;
		}

		.disease-attributes {
			min-width: 16%;
			padding-right: 1.5%;
		}

		.disease-info>view,
		.disease-attributes>view {
			font-size: calc(12px + 0.25vw);
			margin-bottom: 5px;
		}
	}

	/* 标准iPad特定调整 */
	@media screen and (min-width: 768px) and (max-width: 834px) {
		.disease-info>view {
			overflow: visible;
			/* 允许内容超出容器 */
			text-overflow: initial;
			-webkit-line-clamp: initial;
			/* 不限制行数 */
			white-space: normal;
		}

		.disease-content {
			max-width: 78%;
		}

		.disease-attributes {
			min-width: 18%;
		}
	}

	/* iPad Pro和大屏设备 */
	@media screen and (min-width: 1024px) {
		.disease-item {
			padding: 25rpx 70rpx 25rpx 25rpx;
		}

		.disease-left {
			width: 140rpx;
			height: 140rpx;
			margin-right: 25rpx;
		}

		.disease-info>view,
		.disease-attributes>view {
			font-size: calc(13px + 0.3vw);
			margin-bottom: 10rpx;
		}

		.disease-content {
			max-width: 75%;
		}

		.disease-attributes {
			min-width: 200rpx;
			padding-right: 20rpx;
		}

		.action-icon {
			font-size: calc(18px + 0.3vw);
		}
	}
</style>
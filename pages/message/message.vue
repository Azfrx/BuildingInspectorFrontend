<template>
	<view class="message">
		<view class="message-none">
			<image class="message-none-icon" :src="noMessage"></image>
			<view class="message-none-text">没有相关数据哦</view>
		</view>

	</view>
</template>

<script setup>
	import noMessage from '@/static/image/noMessage.svg';
</script>

<style>
	.message {
		height: calc(100vh - var(--window-top));
		/* 剩余可用高度 */
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.message-none {
		width: 100%;
		height: 20%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.message-none-icon {
		width: 80rpx;
		height: 80rpx;
	}

	.message-none-text {
		font-size: 16rpx;
		color: #69817d;
	}

	/* 适配 iPad（768px 以上） */
	@media screen and (min-width: 768px) {}

	/* 适配 iPad Pro（1024px 以上） */
	@media screen and (min-width: 1024px) {
		.message-none {
		}
		.message-none-icon {
			width: 180rpx;
			height: 180rpx;
		}

		.message-none-text {
			font-size: 34rpx;
			color: #69817d;
		}
	}
</style>
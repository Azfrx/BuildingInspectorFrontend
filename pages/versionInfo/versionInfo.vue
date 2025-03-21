<template>
	<view class="versionInfo">
		<view class="versionInfo-version">
			<image class="versionInfo-version-icon" src="/static/image/bridge.svg"></image>
			<view class="versionInfo-version-text">当前版本: v3.1</view>
		</view>
		<view class="versionInfo-check" @click="togglePopup">检查版本更新</view>
		<view class="versionInfo-company">©2023~2025 陕西交控工程技术有限公司</view>
	</view>
	<uni-popup ref="versionPopup" type="dialog">
		<uni-popup-dialog title="更新提示" content="已经是最新版本" :showClose="false" confirmText="确定" @confirm="handleConfirm"
			@close="handleClose">
		</uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	// 使用ref来获取popup的引用
	const versionPopup = ref(null);

	// 显示弹出框
	const togglePopup = () => {
		versionPopup.value.open();
	}

	// 确认按钮点击事件
	const handleConfirm = () => {
		versionPopup.value.close();
	}

	// 弹出框关闭事件
	const handleClose = () => {
	}
</script>

<style>
	.versionInfo {
		width: 100%;
		height: calc(100vh - var(--window-top)); /* 剩余可用高度 */
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: #f4f4f4;
		position: relative;
	}

	.versionInfo-version {
		height: 30vw;
		width: 30vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.versionInfo-version-icon {
		height: 30%;
		width: 30%;
		border-radius: 50%;
		background-color: #01ff01;
	}

	.versionInfo-version-text {
		font-size: 16px;
		color: #8b8b8b;
		margin-top: 10%;
	}

	.versionInfo-check {
		width: 100%;
		height: 50rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 16rpx;
		padding-left: 30rpx;
	}

	.versionInfo-company {
		position: absolute;
		bottom: 5%;
		font-size: 16rpx;
	}
	/* 适配 iPad（768px 以上） */
	@media screen and (min-width: 768px) {}
	
	/* 适配 iPad Pro（1024px 以上） */
	@media screen and (min-width: 1024px) {
		.versionInfo-version-icon{
			height: 35%;
			width: 35%;
		}
		.versionInfo-version-text {
			font-size: 18px;
		}
		.versionInfo-check {
			height: 100rpx;
			font-size: 32rpx;
			padding-left: 80rpx;
		}
		
		.versionInfo-company {
			font-size: 32rpx;
		}
	}
</style>
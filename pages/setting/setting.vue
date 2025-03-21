<template>
	<view class="setting">
		<view class="setting-versionInfo" @click="toVersionInfo">
			<view class="setting-versionInfo-left">
				<image class="setting-versionInfo-left-icon" src="/static/image/exclamation.svg"></image>
				<view class="setting-versionInfo-left-text">版本信息</view>
			</view>
			<image class="setting-versionInfo-rightArrow" src="/static/image/rightArrow.svg"></image>
		</view>
		<view class="setting-logout" @click="logout">
			注销登录
		</view>
	</view>
</template>

<script setup>
	const toVersionInfo = () => {
		uni.navigateTo({
			url: '/pages/versionInfo/versionInfo'
		})
	}
	const logout = () => {
		uni.removeStorageSync('isLoggedIn');
		uni.removeStorageSync('autoLogin'); // 清除自动登录
		uni.redirectTo({ url: '/pages/login/login' });
	};
</script>

<style>
	.setting {
		height: calc(100vh - var(--window-top)); /* 剩余可用高度 */
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: #f4f4f4;
	}

	.setting-versionInfo {
		width: 100%;
		height: 50rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
		border-top: 1rpx solid #f4f4f4;
		border-bottom: 1rpx solid #f4f4f4;
		margin-top: 10rpx;
	}

	.setting-versionInfo-left {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 20%;
	}

	.setting-versionInfo-left-icon {
		width: 30rpx;
		height: 30rpx;
	}

	.setting-versionInfo-left-text {
		height: 100%;
		width: 60%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16rpx;
	}

	.setting-versionInfo-rightArrow {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.setting-logout {
		width: 100%;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		border-top: 1rpx solid #f4f4f4;
		border-bottom: 1rpx solid #f4f4f4;
		margin-top: 10rpx;
		font-size: 16rpx;
	}
	/* 适配 iPad（768px 以上） */
	@media screen and (min-width: 768px) {}
	
	/* 适配 iPad Pro（1024px 以上） */
	@media screen and (min-width: 1024px) {
		.setting-versionInfo{
			height: 100rpx;
			margin-top: 20rpx;
		}
		.setting-versionInfo-left-icon {
			width: 60rpx;
			height: 60rpx;
		}
		
		.setting-versionInfo-left-text {
			font-size: 32rpx;
		}
		
		.setting-versionInfo-rightArrow {
			width: 50rpx;
			height: 50rpx;
			margin-right: 40rpx;
		}
		.setting-logout{
			height: 100rpx;
			margin-top: 20rpx;
			font-size: 32rpx;
		}
	}
</style>
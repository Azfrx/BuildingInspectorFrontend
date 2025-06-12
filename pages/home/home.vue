<!-- 桥梁定检/系统设置页面
 author:ykx
 date:2025 . 6 .3
 -->

<template>
	<view id="homePage">
		<view class="logo">
			<image src="@/static/image/loginLogo.png" mode="widthFix" style="width: 100%"></image>
		</view>
		<view class="container">
			<view class="content">
				<view class="section" :class="{ 'active': activeSection === 'bridge' }" @click="handleClick('bridge')">
					<view class="icon-item">
						<view class="icon-box">
							<image src="@/static/image/bridgeTrue.png" mode="widthFix" class="home-icon"></image>
						</view>
						<text class="leftText">桥梁定检</text>
					</view>
				</view>
				<view class="section" :class="{ 'active': activeSection === 'setting' }" @click="handleClick('setting')">
					<view class="icon-item">
						<view class="icon-box">
							<image src="@/static/image/settingTrue.png" mode="widthFix" class="home-icon"></image>
						</view>
						<text class="leftText">系统设置</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const activeSection = ref('');

const handleClick = (section) => {
    activeSection.value = section;
    if (section === 'bridge') {
        uni.navigateTo({
            url: '/pages/bridge/bridge'
        });
    } else if (section === 'setting') {
        uni.navigateTo({
            url: '/pages/SystemSetting/SystemSetting'
        });
    }
};
</script>

<style lang="scss" scoped>
.container {
	// ... existing code ...
}

.content {
	display: flex;
	width: 100%;
	height: 300px;
	margin-top: -20rpx;
}

.section {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background-color 0.3s;
	
	&.active {
		background-color: #EEEEEE;
	}
}

.icon-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	margin-top: 30rpx;
}

.icon-box {
	width: 60rpx;
	height: 60rpx;
	background-color: #0F4687;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8rpx;
}

.home-icon {
	width: 40rpx !important;
	height: 40rpx;
}

.leftText {
	font-size: 16px;
	color: #333;
}
</style>
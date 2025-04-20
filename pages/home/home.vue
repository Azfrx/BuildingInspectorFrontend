<template>
	<view class="home">
		<view class="home-box" v-for="(item, index) in buildingInspector" :key="index" @click="clickCard(item.name)">
			<image :src="item.iconSrc" class="home-box-image"></image>
			<view class="home-box-text">{{ item.name }}</view>
		</view>
	</view>
	
	<!-- 侧边栏 -->
	<uni-popup ref="popup" type="left" @maskClick="hideSidebar">
		<view class="sidebar">
			<view class="sidebar-userinfo" @click="toUserInfo">
				<image class="sidebar-userinfo-photo" src="/static/image/zjl.png"></image>
				<view class="sidebar-userinfo-info">
					<view class="sidebar-userinfo-info-nameAndStatus">
						<view class="sidebar-userinfo-info-nameAndStatus-name">西工院检测05</view>
						<view class="sidebar-userinfo-info-nameAndStatus-status">{{isOnline?"在线":"离线"}}</view>
					</view>
					<view class="sidebar-userinfo-info-number">编号:xigy05</view>
				</view>
			</view>
			<view class="sidebar-message" @click="toMessage">
				<image class="sidebar-message-icon" :src="message"></image>
				<view class="sidebar-message-text">消息管理</view>
			</view>
			<view class="sidebar-setting" @click="toSetting">
				<image class="sidebar-setting-icon" :src="setting"></image>
				<view class="sidebar-setting-text">设置</view>
			</view>
		</view>
	</uni-popup>

	
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import message from '@/static/image/message.svg';
	import setting from '@/static/image/setting.svg';
	import {
		onNavigationBarButtonTap
	} from '@dcloudio/uni-app'
	const popup = ref(null);
	const isOnline = ref(false);
	const buildingInspector = ref([{
		name: "桥梁病害采集",
		iconSrc: "../../static/image/bridge.svg",
	}, {
		name: "隧道病害采集",
		iconSrc: "../../static/image/tunnel.svg",
	}])

	const toUserInfo = () => {
		uni.navigateTo({
			url: '/pages/userinfo/userinfo'
		})
	}
	const toMessage = () => {
		uni.navigateTo({
			url: '/pages/message/message'
		})
	}
	const toSetting = () => {
		uni.navigateTo({
			url: '/pages/setting/setting'
		})
	}
	onLoad(() => {
		// 页面加载完成后的操作
		// document.querySelector('.uni-page-head-hd').style.display = 'none';
		isOnline.value = uni.getStorageSync('isOnline');
	})
	// 显示侧边栏
	const showSidebar = () => {
		popup.value.open();
	};
	// 隐藏侧边栏
	const hideSidebar = () => {
		popup.value.close();
	};
	onNavigationBarButtonTap(function(e) {
		if (e.index === 0) {
			showSidebar()
		}
	})

	//跳转至病害采集
	const clickCard = (name) => {
		console.log("点击的卡片的名称为:" + name);
		if (name === "桥梁病害采集") {
			uni.navigateTo({
				url: '/pages/bridge/bridge'
			})
		} else if (name === "隧道病害采集") {
			// 隧道页面路由可以在后续添加
			console.log("隧道病害采集功能待开发");
			uni.navigateTo({
				url: '/pages/detail/detail'
			})
		}
	}
</script>

<style>
	.home {
		width: 100%;
		height: calc(100vh - var(--window-top));
		/* 剩余可用高度 */
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: flex-start;
		gap: 5vw;
		/* padding-top: 20rpx; */
		/* padding-bottom: 20rpx; */
	}

	.home-box {
		width: 40vw;
		height: 40vw;
		border-radius: 10rpx;
		border: 1.5rpx solid #3d655f;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		margin-bottom: -20rpx;
	}

	::-webkit-scrollbar {
		/* 隐藏滚动条 */
		display: none;
	}

	.home-box-image {
		width: 20%;
		height: 20%;
		margin-top: 30%;
	}

	.home-box-text {
		font-size: 18rpx;
		font-weight: 600;
		margin-top: 30%;
		color: #3d655f;
	}

	/* 侧边栏样式 */
	.sidebar {
		width: 40vw;
		height: 100%;
		background-color: #fff;
		padding: 20px;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
	}

	.sidebar-userinfo {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 10%;
	}

	.sidebar-userinfo-photo {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background-color: #3d655f;
	}

	.sidebar-userinfo-info {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 80%;
		width: 60%;
		padding-left: 5%;
	}

	.sidebar-userinfo-info-nameAndStatus {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.sidebar-userinfo-info-nameAndStatus-name {
		font-size: 16rpx;
		font-weight: bold;
	}

	.sidebar-userinfo-info-nameAndStatus-status {
		font-size: 12rpx;
		width: 20%;
		border: 1px solid #526b66;
		color: #526b66;
		border-radius: 30rpx;
		margin-left: 10rpx;
		text-align: center;
	}

	.sidebar-userinfo-info-number {
		font-size: 16rpx;
		color: #a0a0a0;
	}

	.sidebar-message {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 7%;
		margin-top: 10%;
	}

	.sidebar-message-icon {
		width: 30rpx;
		height: 30rpx;
		margin-left: 5%;
	}

	.sidebar-message-text {
		font-size: 16rpx;
		color: #787878;
		margin-left: 5%;
	}

	.sidebar-setting {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 7%;
	}

	.sidebar-setting-icon {
		width: 30rpx;
		height: 30rpx;
		margin-left: 5%;
	}

	.sidebar-setting-text {
		font-size: 16rpx;
		color: #787878;
		margin-left: 5%;
	}

	/* 适配 iPad（768px 以上） */
	@media screen and (min-width: 768px) {}

	/* 适配 iPad Pro（1024px 以上） */
	@media screen and (min-width: 1024px) {
		.home-box {
			margin-top: 50rpx;
			margin-bottom: -50rpx;
		}

		.home-box-image {
			width: 30%;
			height: 30%;
			margin-top: 20%;
		}

		.home-box-text {
			font-size: 36rpx;
			margin-top: 20%;
		}

		.sidebar-userinfo-photo {
			width: 180rpx;
			height: 180rpx;
		}

		.sidebar-userinfo-info-nameAndStatus-name {
			font-size: 33rpx;
		}

		.sidebar-userinfo-info-nameAndStatus-status {
			font-size: 24rpx;
			margin-left: 20rpx;
		}

		.sidebar-userinfo-info-number {
			font-size: 33rpx;
		}

		.sidebar-message,
		.sidebar-setting {
			margin-top: 0;
			height: 5%;
		}

		.sidebar-message-icon,
		.sidebar-setting-icon {
			width: 60rpx;
			height: 60rpx;
		}

		.sidebar-message-text,
		.sidebar-setting-text {
			font-size: 32rpx;
		}
	}
</style>
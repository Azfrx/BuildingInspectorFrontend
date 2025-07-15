<!-- 桥梁定检/系统设置页面
 author:ykx
 date:2025 . 6 .3
 -->

<template>
	<view class="navbar">湖北交投桥梁定检现场检测</view>
	<view id="homePage" class="homePage">
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
				<view class="section" :class="{ 'active': activeSection === 'setting' }"
					@click="handleClick('setting')">
					<view class="icon-item">
						<view class="icon-box">
							<image src="@/static/image/settingTrue.png" mode="widthFix" class="home-icon"></image>
						</view>
						<text class="leftText">系统设置</text>
					</view>
				</view>
			</view>
			
			<!-- 测试按钮 -->
<!--			<view class="test-button-container">-->
<!--				<button class="test-button" @click="testWriteObjectJson">测试创建桥梁对象</button>-->
<!--			</view>-->
<!--		</view>-->
<!--	</view>-->
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import checkUpdate from '../../uni_modules/uni-upgrade-center-app/utils/check-update';
	import { writeObjectJson } from '../../utils/write';
	import { userStore } from '@/store/index.js';

	const activeSection = ref('');
	const userInfo = userStore();

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
	
	// 测试writeObjectJson函数
	const testWriteObjectJson = async () => {
		try {
			console.log('开始测试创建桥梁对象文件');
			console.log('当前用户名:', userInfo.username);
			
			if (!userInfo.username) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			// 显示加载提示
			uni.showLoading({
				title: '创建桥梁对象中...',
				mask: true  // 添加遮罩，防止用户多次点击
			});
			
			// 添加超时处理
			const timeout = setTimeout(() => {
				uni.hideLoading();
				uni.showModal({
					title: '操作超时',
					content: '文件创建操作超时，请检查控制台日志',
					showCancel: false
				});
				console.error('创建桥梁对象操作超时');
			}, 30000); // 30秒超时
			
			const buildingId = 'B001'; // 测试用建筑ID
			const testData = {
				"name": "测试桥梁",
				"type": "公路桥",
				"location": "湖北省武汉市",
				"details": {
					"length": 100,
					"width": 15,
					"height": 25,
					"lanes": 4,
					"material": "混凝土"
				},
				"status": "正常",
				"lastInspection": new Date().toISOString()
			};
			
			console.log('调用writeObjectJson，参数:', { buildingId, testData });
			const result = await writeObjectJson(buildingId, testData);
			
			// 清除超时
			clearTimeout(timeout);
			
			// 隐藏加载提示
			uni.hideLoading();
			
			// 显示成功提示
			uni.showModal({
				title: '创建成功',
				content: `桥梁对象文件创建成功！\n路径: ${result.fullPath}`,
				confirmText: '查看文件',
				cancelText: '关闭',
				success: (res) => {
					if (res.confirm) {
						// 尝试打开文件
						console.log('尝试打开文件:', result.fullPath);
						plus.runtime.openFile(result.fullPath, {}, (error) => {
							if (error) {
								uni.showToast({
									title: '无法打开文件',
									icon: 'none'
								});
								console.error('打开文件失败:', error);
							}
						});
					}
				}
			});
			
			console.log('桥梁对象文件创建成功:', result.fullPath);
		} catch (error) {
			// 隐藏加载提示
			uni.hideLoading();
			
			// 显示错误提示
			uni.showModal({
				title: '创建失败',
				content: error.message || '未知错误',
				showCancel: false
			});
			
			console.error('创建桥梁对象文件失败:', error);
			if (error.message) {
				console.error('错误信息:', error.message);
			}
			if (error.stack) {
				console.error('错误堆栈:', error.stack);
			}
		}
	};
	
	onMounted(() => {
		checkUpdate();   
	});
</script>

<style lang="scss" scoped>
	.navbar {
		width: 100vw;
		height: 6.5vh;
		background-color: #0F4687;
		color: #FFFFFF;
		font-size: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 3vh;
		box-sizing: border-box;
	}

	.homePage {
		// height: calc(95vh - var(--window-top));
	}

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
	
	.test-button-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 30rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	
	.test-button {
		width: 80%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #0F4687;
		color: #FFFFFF;
		font-size: 28rpx;
		border-radius: 10rpx;
	}
</style>
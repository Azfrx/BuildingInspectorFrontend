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
			<!--
			<view class="test-button-container">
				<button class="test-button" @click="testWriteObjectJson">测试创建桥梁对象</button>
			</view>
			-->
		</view>
		<div id="chat-agent-container" @click="toChatBot">
		    <div id="chat-agent-button" class="chat-agent-button">
          <uni-icons type="chat-filled" size="16" color="#FFFFFF"></uni-icons>
		        <span>智能助手</span>
		    </div>
		</div>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import checkUpdate from '../../uni_modules/uni-upgrade-center-app/utils/check-update';
	import { writeObjectJson } from '../../utils/write';
	import { userStore } from '@/store/index.js';
	import {useObject} from'@/store/object.js'
  import ChatBot from "../ChatBot/ChatBot.vue";
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
  const toChatBot = () => {
    uni.navigateTo({
      url: '/pages/ChatBot/ChatBot'
    });
  }
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
	
	
/* --- chat-agent-main.css --- */
#chat-agent-container {
    /* 定义组件级别的CSS变量，方便维护和统一风格 */
    --agent-color-primary: #2563eb;
    --agent-color-primary-hover: #1d4ed8;
    --agent-color-success: #22c55e;
    --agent-color-success-bg: #f0fdf4;
    --agent-color-success-border: #bbf7d0;
    --agent-color-success-text: #166534;
    --agent-color-error: #dc2626;
    --agent-color-error-light: #ef4444;
    --agent-color-white: #ffffff;

    --agent-color-text-dark: #374151;
    --agent-color-text-body: #111827;
    --agent-color-text-muted: #6b7280;
    --agent-color-text-light: #9ca3af;

    --agent-color-border: #e5e7eb;
    --agent-color-border-muted: #d1d5db;
    --agent-color-border-primary: #bfdbfe;

    --agent-color-bg-lightest: #f8fafc;
    --agent-color-bg-lighter: #f9fafb;
    --agent-color-bg-muted: #f3f4f6;
    --agent-color-bg-primary-light: #eff6ff;

    --agent-font-size-xs: 10px;
    --agent-font-size-sm: 12px;
    --agent-font-size-md: 14px;
    --agent-font-size-lg: 15px;
    --agent-font-size-xl: 16px;

    --agent-radius-sm: 4px;
    --agent-radius-md: 6px;
    --agent-radius-lg: 8px;
    --agent-radius-xl: 12px;
    --agent-radius-xxl: 25px;
    --agent-radius-full: 50%;

    --agent-shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
    --agent-shadow-md: 0 4px 14px 0 rgba(37, 99, 235, 0.3);
    --agent-shadow-lg: 0 6px 20px 0 rgba(37, 99, 235, 0.4);
    --agent-shadow-xl: 0 10px 40px rgba(0, 0, 0, 0.1);
    --agent-shadow-focus: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* --- 基础布局与按钮 --- */
#chat-agent-container .chat-agent-button {
    position: fixed;
    right: 25px;
    bottom: 30px;
    width: 130px;
    height: 50px;
    background: var(--agent-color-primary);
    color: var(--agent-color-white);
    border: none;
    border-radius: var(--agent-radius-xxl);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--agent-font-size-lg);
    font-weight: 500;
    cursor: pointer;
    box-shadow: var(--agent-shadow-md);
    z-index: 9999;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

#chat-agent-container .chat-agent-button:hover {
    background: var(--agent-color-primary-hover);
    box-shadow: var(--agent-shadow-lg);
    -webkit-transform: translateY(-1px);
    transform: translateY(-1px);
}

#chat-agent-container .chat-agent-button:active {
    -webkit-transform: translateY(0);
    transform: translateY(0);
}

#chat-agent-container .chat-agent-button i {
    margin-right: 8px;
    font-size: var(--agent-font-size-xl);
}

#chat-agent-container .chat-agent-window {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 70vw;
    height: 95vh;
    background: var(--agent-color-white);
    border-radius: var(--agent-radius-xl);
    box-shadow: var(--agent-shadow-xl);
    border: 1px solid var(--agent-color-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1000;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

#chat-agent-container .chat-agent-header {
    padding: 12px;
    background: var(--agent-color-bg-lightest);
    border-bottom: 1px solid var(--agent-color-border);
    color: var(--agent-color-text-dark);
    font-weight: 600;
    font-size: var(--agent-font-size-sm);
    position: relative;
}

#chat-agent-container .chat-agent-close-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    width: 28px;
    height: 28px;
    background: var(--agent-color-bg-muted);
    color: var(--agent-color-text-muted);
    border: none;
    border-radius: var(--agent-radius-full);
    font-size: var(--agent-font-size-md);
    cursor: pointer;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

#chat-agent-container .chat-agent-close-btn:hover {
    background: var(--agent-color-border);
    color: var(--agent-color-text-dark);
}

/* --- Logo --- */
#chat-agent-container .chat-agent-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
}
#chat-agent-container .chat-agent-logo > *:not(:last-child) {
    margin-bottom: 12px; /* 替代 gap */
}
#chat-agent-container .chat-agent-logo-img {
    width: fit-content;
    max-height: 70px;
    object-fit: cover;
}


/* --- 输入区域 --- */
#chat-agent-container .chat-agent-input-area {
    display: flex;
    padding: 8px;
    border-top: 1px solid var(--agent-color-border);
    background: var(--agent-color-bg-lightest);
    align-items: flex-end;
}

#chat-agent-container .chat-agent-input-area textarea {
    flex-grow: 1;
    border: 1px solid var(--agent-color-border-muted);
    border-radius: 20px;
    padding: 10px 16px;
    resize: none;
    min-height: 80px;
    font-size: var(--agent-font-size-md);
    line-height: 1.4;
    background: var(--agent-color-white);
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

#chat-agent-container .chat-agent-input-area textarea:focus {
    outline: none;
    border-color: var(--agent-color-primary);
    box-shadow: var(--agent-shadow-focus);
}

#chat-agent-container .chat-agent-input-area .chat-agent-send-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: var(--agent-color-primary);
    color: var(--agent-color-white);
    border-radius: var(--agent-radius-full);
    margin-left: 10px;
    cursor: pointer;
    font-size: var(--agent-font-size-md);
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}

#chat-agent-container .chat-agent-input-area .chat-agent-send-btn:hover:not(:disabled) {
    background: var(--agent-color-primary-hover);
}

#chat-agent-container .chat-agent-input-area .chat-agent-send-btn:active:not(:disabled) {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
}

#chat-agent-container .chat-agent-input-area .chat-agent-send-btn:disabled {
    background: var(--agent-color-text-light);
    cursor: not-allowed;
}

/* --- 文件上传与页脚 --- */
#chat-agent-container .chat-agent-upload-area {
    padding: 8px 16px;
    border-top: 1px solid var(--agent-color-border);
    background: var(--agent-color-bg-lightest);
    display: flex;
    align-items: center;
}
#chat-agent-container .chat-agent-upload-area > *:not(:last-child) { margin-right: 8px; /* 替代 gap */ }
#chat-agent-container .chat-agent-upload-btn {
    background: var(--agent-color-bg-muted);
    border: 1px solid var(--agent-color-border-muted);
    border-radius: var(--agent-radius-md);
    padding: 6px 12px;
    font-size: var(--agent-font-size-sm);
    color: var(--agent-color-text-dark);
    cursor: pointer;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
}
#chat-agent-container .chat-agent-upload-btn:hover {
    background: var(--agent-color-border);
    border-color: var(--agent-color-text-light);
}
#chat-agent-container .chat-agent-upload-info {
    font-size: var(--agent-font-size-sm);
    color: var(--agent-color-text-light);
}

#chat-agent-container .chat-agent-footer {
    padding: 8px;
    background: var(--agent-color-bg-lightest);
    border-top: 1px solid var(--agent-color-border);
    text-align: center;
    font-size: var(--agent-font-size-sm);
    color: var(--agent-color-text-muted);
}

/* --- 动画 --- */
@-webkit-keyframes fadeInUp {
    from { opacity: 0; -webkit-transform: translateY(10px); transform: translateY(10px); }
    to { opacity: 1; -webkit-transform: translateY(0); transform: translateY(0); }
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@-webkit-keyframes pulse {
    0% { box-shadow: 0 0 0 1px var(--agent-color-primary), 0 0 0 3px rgba(37, 99, 235, 0.3); }
    50% { box-shadow: 0 0 0 1px var(--agent-color-primary), 0 0 0 6px rgba(37, 99, 235, 0.1); }
    100% { box-shadow: 0 0 0 1px var(--agent-color-primary), 0 0 0 3px rgba(37, 99, 235, 0.3); }
}
@keyframes pulse {
    0% { box-shadow: 0 0 0 1px var(--agent-color-primary), 0 0 0 3px rgba(37, 99, 235, 0.3); }
    50% { box-shadow: 0 0 0 1px var(--agent-color-primary), 0 0 0 6px rgba(37, 99, 235, 0.1); }
    100% { box-shadow: 0 0 0 1px var(--agent-color-primary), 0 0 0 3px rgba(37, 99, 235, 0.3); }
}

#chat-agent-container .message {
    border: none;
}
</style>
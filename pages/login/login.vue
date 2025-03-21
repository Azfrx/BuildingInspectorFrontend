<template>
	<view class="login">
		<view class="login-box">
			<view class="login-box-title">登录</view>
			<input class="login-box-username" placeholder="请输入账号" v-model="username" />
			<input class="login-box-password" placeholder="请输入密码" password v-model="password" />
			<view class="login-box-option">
				<checkbox-group @change="toggleRememberPassword">
					<label class="login-box-option-rememberPassword">
						<checkbox :checked="rememberPassword"></checkbox>
						<text>记住密码</text>
					</label>
				</checkbox-group>
				<checkbox-group @change="toggleAutoLogin">
					<label class="login-box-option-autoLogin">
						<checkbox :checked="autoLogin"></checkbox>
						<text>自动登录</text>
					</label>
				</checkbox-group>
			</view>
			<view class="login-box-button" @click="login()">登录</view>
			<view class="login-box-offline">
				<view class="login-box-offline-box" @click="offlineLogin">离线登录</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';

	// 定义响应式变量
	const username = ref('');
	const password = ref('');
	const rememberPassword = ref(false);
	const autoLogin = ref(false);
	// 在页面加载时检查登录状态，防止已登录用户重复访问登录页
	onLoad(() => {
		const isLoggedIn = uni.getStorageSync('isLoggedIn');
		if (isLoggedIn) {
			uni.redirectTo({
				url: '/pages/home/home'
			});
		}
		// 读取存储数据
		rememberPassword.value = uni.getStorageSync('rememberPassword') || false;
		autoLogin.value = uni.getStorageSync('autoLogin') || false;

		if (rememberPassword.value) {
			username.value = uni.getStorageSync('username') || '';
			password.value = uni.getStorageSync('password') || '';
		}

		// 如果启用了自动登录且用户名密码存在，则直接登录
		if (autoLogin.value && username.value && password.value) {
			login();
		}
	});

	// 账号密码校验
	const login = () => {
		if (!username.value || !password.value) {
			uni.showToast({
				title: '请输入用户名和密码',
				icon: 'none'
			});
			return;
		}

		//模拟正确的账号密码
		const correctUsername = 'admin';
		const correctPassword = '123456';

		if (username.value === correctUsername && password.value === correctPassword) {
			uni.showToast({
				title: '登录成功',
				icon: 'success'
			});
			// 存储登录状态
			uni.setStorageSync('isLoggedIn', true);

			// 处理记住密码
			if (rememberPassword.value) {
				uni.setStorageSync('username', username.value);
				uni.setStorageSync('password', password.value);
			} else {
				uni.removeStorageSync('username');
				uni.removeStorageSync('password');
			}

			// 处理自动登录
			uni.setStorageSync('rememberPassword', rememberPassword.value);
			uni.setStorageSync('autoLogin', autoLogin.value);

			//记录是在线登录
			uni.setStorageSync('isOnline', true);
			
			// 跳转到主页
			uni.redirectTo({
				url: '/pages/home/home'
			});
		} else {
			uni.showToast({
				title: '用户名或密码错误',
				icon: 'none'
			});
		}
	};
	// 记住密码切换
	const toggleRememberPassword = (event) => {
		rememberPassword.value = event.detail.value.length > 0;
		uni.setStorageSync('rememberPassword', rememberPassword.value);

		// 取消记住密码时，也要取消自动登录
		if (!rememberPassword.value) {
			autoLogin.value = false;
			uni.setStorageSync('autoLogin', false);
		}
	};

	// 自动登录切换
	const toggleAutoLogin = (event) => {
		autoLogin.value = event.detail.value.length > 0;
		uni.setStorageSync('autoLogin', autoLogin.value);

		// 如果启用了自动登录，必须同时记住密码
		if (autoLogin.value) {
			rememberPassword.value = true;
			uni.setStorageSync('rememberPassword', true);
		}
	};
	const offlineLogin = () => {
		uni.showToast({
			title: '离线登录成功',
			icon: 'success'
		});
		uni.setStorageSync('isLoggedIn', true);
		uni.setStorageSync('isOnline', false);
		uni.redirectTo({
			url: '/pages/home/home'
		});
	};
</script>

<style scoped>
	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
	}

	.login-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		height: 30%;
		margin-bottom: 10%;
	}

	.login-box-title {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20rpx;
		letter-spacing: 10rpx;
		/* 设置文字间距 */
		padding-left: 5rpx;
		/* 补偿左移的效果 */
		color: #69817d;
		border-bottom: 1px solid #69817d;
		width: 100%;
		height: 14%;
	}

	.login-box-username {
		width: calc(100% - 10rpx);
		height: 14%;
		background-color: #f5f5f5;
		border-radius: 5rpx;
		padding-left: 10rpx;
	}

	.login-box-password {
		width: calc(100% - 10rpx);
		height: 14%;
		background-color: #f5f5f5;
		border-radius: 5rpx;
		padding-left: 10rpx;
	}

	.login-box-option {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		height: 14%;
	}

	.login-box-option-rememberPassword checkbox {
		transform: scale(0.8);
	}

	.login-box-option-autoLogin checkbox {
		transform: scale(0.8);
	}

	.login-box-option-rememberPassword,
	.login-box-option-autoLogin text {
		font-size: 16rpx;
		color: #7f7f7f;
	}

	.login-box-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 14%;
		background-color: #2e665f;
		color: white;
		font-size: 16rpx;
		letter-spacing: 10rpx;
		padding-left: 5rpx;
		border-radius: 5rpx;
	}

	.login-box-offline {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 10%;
	}

	.login-box-offline-box {
		width: 10%;
		height: 70%;
		border-bottom: 1px solid #2e665f;
		color: #2e665f;
		font-size: 14rpx;
		letter-spacing: 2rpx;
		text-align: center;
	}

	/* 适配 iPad（768px 以上） */
	@media screen and (min-width: 768px) {}

	/* 适配 iPad Pro（1024px 以上） */
	@media screen and (min-width: 1024px) {
		.login-box-title {
			font-size: 40rpx;
		}

		.login-box-option-rememberPassword,
		.login-box-option-autoLogin text {
			font-size: 30rpx;
		}

		.login-box-button {
			font-size: 35rpx;
		}

		.login-box-offline-box {
			font-size: 32rpx;
			letter-spacing: 5rpx;
		}
	}
</style>
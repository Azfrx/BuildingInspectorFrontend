<template>
	<view class = 'System'>
		<view class="main">
			<view class="titleBar">
				<image src="/static/image/user1.png" class="avatar"></image>
				<view class="textContainer">
					<view class="code">zs@znjc</view>
					<view class="name">张三</view>
				</view>
				<view class="button">
					<button size="default" type="default"
						style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:40rpx;font-size: 15rpx"
						hover-class="is-hover"
						@click="openPasswordModal">修改密码</button>
					<button size="default" type="default"
						style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:40rpx;font-size: 15rpx"
						hover-class="is-hover"
						@click="handleLogout">退出登录</button>
				</view>
			</view>
		</view>
		<view class="model">
			<view class="modelTitle">运行模式</view>
			<view class="switchContainer">
				<view class="title">离线</view>
				<view>
					<switch name="switch" />
				</view>	
				<view class="title">在线</view>
			</view>
		</view>
		<view class="divider"></view>
		<view class="versionData">
			<view class="versionTitle">当前数据包版本</view>
			<view class="versionNumber">v25-05-20-zs@znjc</view>
		</view>
		<view class="divider"></view>
		<view class="inData">
			<view class="inDataTitle">本地数据导入</view>
			<button size="default" type="default"
				style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:40rpx;font-size: 15rpx;margin-right: 0"
				hover-class="is-hover"
				@click="handleLogin">数据导入</button>
		</view>
		<view class="divider"></view>
		<view class="outData">
			<view class="outDataTitle">本地数据导出</view>
			<button size="default" type="default"
				style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:40rpx;font-size: 15rpx;margin-right: 0"
				hover-class="is-hover"
				@click="handleLogin">数据导出</button>
		</view>
		<view class="divider"></view>
		<view class="versionApp">
			<view class="appTitle">当前应用版本</view>
			<view>v25-050-20</view>
			<button size="default" type="default"
				style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:40rpx;font-size: 15rpx;margin-right: 0"
				hover-class="is-hover"
				@click="handleLogin">版本更新</button>
		</view>
		
		<!-- 添加修改密码弹窗 -->
		<uni-popup ref="passwordPopup" type="center">
			<view class="password-popup-content">
				<view class="popup-title">修改密码</view>
				<view class="password-form">
					<view class="password-row">
						<text class="password-label">旧密码</text>
						<input type="password" v-model="oldPassword" placeholder="请输入旧密码" class="password-input" />
					</view>
					<view class="password-row">
						<text class="password-label">新密码</text>
						<input type="password" v-model="newPassword" placeholder="请输入新密码" class="password-input" />
					</view>
					<view class="password-row">
						<text class="password-label">确认新密码</text>
						<input type="password" v-model="confirmPassword" placeholder="请再次输入新密码" class="password-input" />
					</view>
				</view>
				<view class="popup-buttons">
					<button class="popup-btn cancel-btn" @click="closePasswordModal">取消</button>
					<button class="popup-btn confirm-btn" @click="changePassword">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { userStore } from '@/store/index.js';

// 获取用户信息
const userInfo = userStore();

// 密码相关变量
const passwordPopup = ref(null);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 打开修改密码弹窗
const openPasswordModal = () => {
	// 清空输入框
	oldPassword.value = '';
	newPassword.value = '';
	confirmPassword.value = '';
	// 打开弹窗
	passwordPopup.value.open();
};

// 关闭修改密码弹窗
const closePasswordModal = () => {
	passwordPopup.value.close();
};

// 退出登录
const handleLogout = async () => {
	try {
		// 显示加载中
		uni.showLoading({
			title: '退出中...'
		});
		
		// 先获取token
		const responseLogin = await uni.request({
			url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
			method: 'POST'
		});
		
		if (!responseLogin.data || !responseLogin.data.token) {
			uni.hideLoading();
			// 如果无法获取token，直接跳转到登录页面
			uni.reLaunch({
				url: '/pages/LoginPage/LoginPage'
			});
			return;
		}
		
		const token = responseLogin.data.token;
		
		// 向后端发送退出登录请求
		const response = await uni.request({
			url: 'http://60.205.13.156:8090/api/user/logOut',
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': `${token}`
			}
		});
		
		uni.hideLoading();
		
		console.log('退出登录响应:', response.data);
		
		// 根据返回的code判断是否成功退出
		if (response.data && response.data.code === 0) {
			// 退出成功
			uni.showToast({
				title: '已退出登录',
				icon: 'success',
				duration: 1500,
				success: () => {
					// 跳转到登录页面
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/LoginPage/LoginPage'
						});
					}, 1500);
				}
			});
		} else {
			// 退出失败
			uni.showToast({
				title: response.data?.msg || '退出登录失败',
				icon: 'none',
				duration: 1500
			});
		}
		
	} catch (error) {
		uni.hideLoading();
		console.error('退出登录出错:', error);
		
		// 出错时也跳转到登录页面
		uni.showToast({
			title: '退出登录中出现错误',
			icon: 'none',
			duration: 1500,
			success: () => {
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/LoginPage/LoginPage'
					});
				}, 1500);
			}
		});
	}
};

// 修改密码
const changePassword = async () => {
	// 验证输入
	if (!oldPassword.value) {
		uni.showToast({
			title: '请输入旧密码',
			icon: 'none'
		});
		return;
	}
	if (!newPassword.value) {
		uni.showToast({
			title: '请输入新密码',
			icon: 'none'
		});
		return;
	}
	if (newPassword.value !== confirmPassword.value) {
		uni.showToast({
			title: '两次输入的新密码不一致',
			icon: 'none'
		});
		return;
	}
	
	// 显示加载中
	uni.showLoading({
		title: '修改中...'
	});
	
	try {
		// 先获取token
		const responseLogin = await uni.request({
			url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${oldPassword.value}`,
			method: 'POST'
		});
		
		console.log('登录响应:', responseLogin.data);
		
		// 检查是否获取到token
		if (!responseLogin.data || !responseLogin.data.token) {
			uni.hideLoading();
			uni.showToast({
				title: '旧密码验证失败',
				icon: 'none'
			});
			return;
		}
		
		const token = responseLogin.data.token;
		
		// 向后端发送修改密码请求
		const response = await uni.request({
			url: `http://60.205.13.156:8090/api/user/resetPassword?oldPassword=${oldPassword.value}&newPassword=${newPassword.value}`,
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': `${token}` 
			}
		});
		
		// 隐藏加载中
		uni.hideLoading();
		
		console.log('修改密码响应:', response.data);
		
		// 检查响应状态
		if (response.data && response.data.code === 0) {
			// 关闭弹窗
			passwordPopup.value.close();
			
			// 显示成功提示
			uni.showToast({
				title: '密码修改成功，请重新登录',
				icon: 'success',
				duration: 2000,
				success: () => {
					// 延迟跳转到登录页面，让用户看到提示
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/LoginPage/LoginPage'
						});
					}, 2000);
				}
			});
		} else {
			// 显示错误信息
			uni.showToast({
				title: response.data?.msg || '修改密码失败',
				icon: 'none'
			});
		}
	} catch (error) {
		// 隐藏加载中
		uni.hideLoading();
		
		console.error('修改密码出错:', error);
		uni.showToast({
			title: '网络错误，请稍后重试',
			icon: 'none'
		});
	}
};
</script>

<style lang="scss" scoped>
.System {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.main {
	height: 20vh;
	background-color: #BDCBE0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 20rpx;
}

.titleBar {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 20rpx;
	margin-left: 30px;
}

.avatar {
	width: 70px;
	height: 70px;
	background-color: #ffffff !important;
	display: block;
	position: relative;
	z-index: 1;
}

.textContainer {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.code {
	font-size: 14px;
	color: #333333;
}

.name {
	font-size: 14px;
	color: #999999;
}

.button {
	display: flex;
	gap: 20rpx;
	margin-left: auto;
}

.button button {
	padding: 0 15px;
}

.model {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-left: 10px;
	height: 48px;
}

.switchContainer {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-left: auto;
	margin-right: 10px;
}

.modelTitle {
	font-size: 20rpx;
	color: #666666;
}

.title {
	font-size: 20rpx;
	color: #333333;
}

.divider {
	height: 1px;
	background-color: #EEEEEE;
	margin: 0 10px;
}

.versionData {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-left: 10px;
	margin-right: 10px;
	height: 48px;
}

.versionTitle {
	font-size: 20rpx;
	color: #666666;
}

.versionNumber {
	font-size: 20px;
	color: #333333;
	margin-left: auto;
	margin-right: 0;
}

.versionApp {
	display: flex;
	align-items: center;
	margin-right: 10px;
	height: 48px;
}

.appTitle {
	font-size: 20rpx;
	color: #666666;
	margin-left: 10px;
}

.versionApp view:nth-child(2) {
	font-size: 20rpx;
	color: #333333;
	margin-left: auto;
	margin-right: 20px;
}

.versionApp button {
	margin-left: 0 !important;
}

.inData {
	display: flex;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	height: 48px;
}

.inDataTitle {
	font-size: 20rpx;
	color: #666666;
}

.inData button {
	margin-left: auto !important;
	margin-right: 0;
}

.outData {
	display: flex;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	height: 48px;
}

.outDataTitle {
	font-size: 20px;
	color: #666666;
}

.outData button {
	margin-left: auto !important;
}

// 修改密码弹窗样式
.password-popup-content {
	background-color: #fff;
	padding: 0;
	width: 500rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.popup-title {
	font-size: 20rpx;
	text-align: center;
	color: #333;
	background-color: #BDCBE0;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.password-form {
	padding: 20rpx;
}

.password-row {
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: column;
}

.password-label {
	font-size: 20rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.password-input {
	border: 1px solid #ddd;
	border-radius: 5rpx;
	height: 60rpx;
	padding: 0 10rpx;
	font-size: 20rpx;
}

.popup-buttons {
	display: flex;
	border-top: 1px solid #eee;
}

.popup-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 0;
	font-size: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cancel-btn {
	background-color: #f5f5f5;
	color: #333;
}

.confirm-btn {
	background-color: #1677ff;
	color: #fff;
}
</style>

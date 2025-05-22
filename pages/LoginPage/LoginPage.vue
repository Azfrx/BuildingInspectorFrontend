<template>
	<view class = 'loginPage'>
		<view class="logo">
			<view class="logo-container">
				<image src="@/static/image/loginLogo.jpg" mode="widthFix" style="width: 100%; background-color: #ffffff;"></image>
			</view>
		</view>
		<view class="form">
			<view class="item_1">
				<view class="name">用户名</view>
				<input class="uni-input" v-model="username" placeholder="请输入用户名" />
			</view>
			<view class="item_2">
				<view class="name">密码</view>
				<view class="container">
					<view class="container_1">
						<input class="uni-input" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码"/>
						<view class="password-icons">
							<image :src="showPassword ? '/static/image/EyeOutline.png' : '/static/image/open.png'" 
								mode="widthFix" 
								style="width:5%" 
								class="password-icon"
								@click="togglePasswordVisibility">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="item_3">
				<radio-group name="radio">
					<label @click="toggleRememberPassword">
						<radio :checked="rememberPassword" />记住密码
					</label>
					<label @click="toggleOfflineLogin">
						<radio :checked="offlineLogin" />离线登录
					</label>
				</radio-group>
			</view>
			<view class="item_4">
				<button size="default" type="default"
					style="color:#ffffff;backgroundColor:#0F4687;borderColor:#1AAD19"
					hover-class="is-hover"
					@click="handleLogin">登录</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const rememberPassword = ref(false);
const offlineLogin = ref(false);
const showPassword = ref(false);

const toggleRememberPassword = () => {
    rememberPassword.value = !rememberPassword.value;
};

const toggleOfflineLogin = () => {
    offlineLogin.value = !offlineLogin.value;
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const handleLogin = () => {
    if (username.value === 'admin' && password.value === '123456') {
        uni.navigateTo({
            url: '/pages/home/home'
        });
    } else {
        uni.showToast({
            title: '用户名或密码错误',
            icon: 'none'
        });
    }
};
</script>

<style lang="scss" scoped>
.loginPage{
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	.logo{
		height:508px;
		background-color: #ffffff;
		.logo-container {
			background-color: #ffffff;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			position: relative;
			padding-top: 0;
			
			image {
				background: #ffffff !important;
				display: block;
				position: relative;
				z-index: 1;
			}
		}
	}
	.form{
		display: flex;
		flex-direction: column;
		align-items: center;
		.item_1, .item_2{
			width: 400rpx;
			height: auto;
			margin-bottom: 20rpx;
			.name{
				font-size: 20px;
				color: #666666;
				margin-bottom: 5px;
			}
			.uni-input{
				font-size: 22px;
				color:#333333;
				width: 100%;
				border-bottom: 1px solid #333333;
				padding-bottom: 10rpx;
			}
		}
		.item_2 {
			margin-bottom: 0;
		}
		.item_3 {
			width: 400rpx;
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
			
			radio-group {
				width: 100%;
				display: flex;
				justify-content: space-between;
				
				label {
					display: flex;
					align-items: flex-end;
					height: 22px;
					font-size: 23px;
					color: #333333;
					line-height: 22px;
					
					radio {
						position: relative;
						top: 0;
						margin-right: 5rpx;
					}
				}
			}
		}
		.item_4 {
			width: 400rpx;
			margin-top: 40rpx;
			
			button {
				width: 100%;
				height: 60px;
				line-height: 60px;
				font-size: 22px;
			}
		}
	}
}

.container_1 {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
}

.password-icons {
	position: absolute;
	right: 10rpx;
	bottom: 10rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.password-icon {
	cursor: pointer;
	width: 22px !important;
	height: 22px;
	padding: 0;
	margin-bottom: 2px;
}
</style>

<template>
	<view class = 'container'>
		<!-- 图片区域 -->
		<view class="image-container">
			<image class="image" src="@/static/image/loginLogo.jpg" mode="widthFix"></image>
		</view>
		
		<!-- 登录输入框 -->
		<view class="login-container">
			<!-- 用户名 -->
			<view class="username-container">
				<view class="title">用户名</view>
				<input class="value" v-model="username" placeholder="请输入用户名" placeholder-style="color: #cccccc" />
			</view>
			
			<!-- 密码 -->
			<view class="password-container">
				<view class="title">密码</view>
				<view class="password-eye">
					<input class="value" v-model="password" placeholder="请输入密码" placeholder-style="color: #cccccc" 
					:type="showPassword ? 'text' : 'password'"/>
					<!--眼睛区域  -->
					<image :src="showPassword ? '/static/image/EyeOutline.png' : '/static/image/open.png'"
							class="eye"
							@click="ShowPassword"
						mode="widthFix"/>
				</view>
			</view>
			
			<!-- 记住密码 -->
			<view class="remember-container">
				<label>
					<radio :checked="rememberPassword" @click.stop="RememberPassword()" class="circle"/>
					<span class="remember-text" @click.stop="RememberPassword()">记住密码</span>
				</label>
			</view>
		</view>
		
		<!-- 登录按钮 -->
		<view class="button">
			<view class="login-button" @click="login()">登录</view>
		</view>
	<!--图片区域/end  -->
	</view>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import apiConfig from '../../config/api';
import { userStore2 } from '../../store/userStorage';
import {idStore} from '../../store/idStorage';
import { createUserDirectory,createSubDirectory,offLineLogin,hasUserDir,setRootDir,rememberUser,saveCredentials} from '../../utils/login/Login';
import checkUpdate from '../../uni_modules/uni-upgrade-center-app/utils/check-update';
//控制密码是否显示的变量
const showPassword = ref(false);
//控制记住密码是否勾选的变量,默认勾选
const rememberPassword = ref(true)
const username = ref('');
const password = ref('');
// 添加网络状态检测
const isOnline = ref(true); 
const userInformation = userStore2();
const idInfo = idStore();
//登录事件
const login = async () =>{
	
	//1.数据规范性检查
	if(!username.value || !password.value){
		 uni.showToast({ title: '用户名和密码不能为空', icon: 'none' });
		 return;
	}
	
	//2.检查网络状态 
	checkNetworkStatus();//通过isOnline 确定走在线还是离线
	
	try{
		//在线登录逻辑
		if(isOnline.value){
			const response = await apiConfig.login(username.value,password.value) 
			if(response.data.code === 0){
				//登录成功将用户存在storage中
				rememberUser(username.value,password.value)
				
				//将记住密码的标识存入storage
				saveCredentials(username.value,password.value,rememberPassword.value)
				
				//生成本地UL目录
				 await setRootDir(username.value)
				//返回的有用信息存在pinia中
				userInformation.setUserInfo({
					username:username.value, //用户账号
					password:password.value, //用户密码
					token:response.data.token, //返回的token
					userName:response.data.userName, //返回的部门人员
					userDept:response.data.userDept, //返回的部门名称
				})
				//用户id
				idInfo.setUserId(response.data.userId)
				//跳转页面
				uni.navigateTo({
					url: '/pages/home/home'
				});
			}else{ //返回其余的错误码 抛出服务器的报错
				uni.showToast({ title: response.data.msg || '登录失败', icon: 'none' });
			}
			
			
		//离线登录逻辑
		}else{ // isOnline.value === false
			offLineLogin(username.value,password.value);
			//离线登录也要设置记住密码状态 决定下次是否填充
			saveCredentials(username.value,password.value,rememberPassword.value)
		}
	}catch{
		
	}
}
// 检测网络状态
const checkNetworkStatus = async () => {
  try {
    const networkType = await uni.getNetworkType();
    if (networkType.networkType === 'none') {
      isOnline.value = false;
    } else {
      isOnline.value = true;
    }
    console.log('当前网络状态:', isOnline.value ? '在线' : '离线');
  } catch (err) {
    console.error('获取网络状态失败:', err);
    isOnline.value = false; // 默认离线
  }
};
//切换密码可见状态
const ShowPassword = () =>{
	showPassword.value = ! showPassword.value;
}
//切换单选框勾选状态
const RememberPassword = () =>{
	console.log("勾选了");
	rememberPassword.value = ! rememberPassword.value;
}
//记住密码填充功能
const fillPassword = () =>{
	//1.获取storage中的值 
	const isValid  = uni.getStorageSync('rememberStatus');
	const userAccounts = uni.getStorageSync('userAccount') || [];
	if(isValid){
		username.value = uni.getStorageSync('lastUsername')
		console.log("username",username.value);
		password.value = uni.getStorageSync('lastPassword')
		console.log("password",password.value);
	}
}
onMounted(() => {
  //检测是否需要版本更新
  checkUpdate();
  
  //检测当前网络状态
  checkNetworkStatus();
  
  //密码填充
  fillPassword();
});
</script>

<style scope>
.image{
	width: 100%;
}
.login-container{
	width: 750rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 180rpx;
}
.username-container{
	margin-bottom: 20rpx;
}
.title{
	font-size: 20rpx;
	color: #666;
	margin-bottom: 5px;
}
.value{
	width: 400rpx;
	font-size: 22px;
	color:#333 ;
	border-bottom: 1px solid #333;
	padding-bottom: 10rpx;
}
.eye{
	cursor: pointer;
	width: 22px !important;
	height: 22px;
	padding: 0;
	margin-bottom: 2px;
	position: absolute;
	right: 10rpx;
	bottom: 14rpx;
}
.password-eye{
	display: flex;
	flex-direction: row;
	position: relative;
}
.remember-container{
	width: 400rpx;
	margin-top: 20rpx;
	font-size: 22px;
	display: flex;
	align-items: center;      /* 垂直居中对齐 */
}
.circle{
	transform: translateY(-4rpx); /* 向上微调4rpx */
}
.remember-text{
	margin-left: 6rpx;
	line-height: 32rpx;
}
.button{
	background-color: #0F4687;
	color: #fff;
	font-size: 22px;
	width: 400rpx;
	height: 60px;
	line-height: 60px;
	text-align: center; 
	margin: 30rpx auto 0;
	border-radius: 6rpx;  /* 可选，圆角 */
}
</style>

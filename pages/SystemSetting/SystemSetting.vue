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
						style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:38px;line-height:38px"
						hover-class="is-hover"
						@click="handleLogin">修改密码</button>
					<button size="default" type="default"
						style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:38px;line-height:38px"
						hover-class="is-hover"
						@click="handleLogin">退出登录</button>
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
				style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:38px;line-height:38px"
				hover-class="is-hover"
				@click="handleLogin">数据导入</button>
		</view>
		<view class="divider"></view>
		<view class="outData">
			<view class="outDataTitle">本地数据导出</view>
			<button size="default" type="default"
				style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:38px;line-height:38px;margin-right:0"
				hover-class="is-hover"
				@click="handleLogin">数据导出</button>
		</view>
		<view class="divider"></view>
		<view class="versionApp">
			<view class="appTitle">当前应用版本</view>
			<view>v25-050-20</view>
			<button size="default" type="default"
				style="color:#ffffff;backgroundColor:#1677ff;borderColor:#1AAD19;height:38px;line-height:38px;margin-right:0"
				hover-class="is-hover"
				@click="handleLogin">版本更新</button>
		</view>
	</view>
</template>

<script setup>
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
	font-size: 14px;
	color: #666666;
}

.title {
	font-size: 14px;
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
	font-size: 14px;
	color: #666666;
}

.versionNumber {
	font-size: 14px;
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
	font-size: 14px;
	color: #666666;
	margin-left: 10px;
}

.versionApp view:nth-child(2) {
	font-size: 14px;
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
	font-size: 14px;
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
	font-size: 14px;
	color: #666666;
}

.outData button {
	margin-left: auto !important;
}
</style>

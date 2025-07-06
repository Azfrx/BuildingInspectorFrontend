<template>
	<view class = 'container'>
		<!-- 状态栏 -->
		<view class="confirm-row">
			<span class="confirm-text">结构信息状态：</span>
			<span class="confirm-status"
				:style="{color: Number(structureData?.Iscommit) === true ? '#f56c6c': '#333'}">
				{{ Number(structureData?.Iscommit) === 3 ? '已提交': '未提交'}}
			</span>
		</view>
		
		<view class="content-layout">
			<!-- 第一级目录 -->
			<view class="sidebar">
				<view v-for="(item, index) in structureData?.children || []" :key="index"
					:class="['sidebar-item', selectedIndex === index ? 'active' : '']" @click="changeTab(index)">
					<view class="treeName sidebar-item-content">
						<image src="@/static/image/yes.png" class="menu-icon"></image>
						{{item.name || '未命名'}}
					</view>
				</view>
			</view>
			
			<!-- 第二级目录 -->
			<view class="sidebar second-sidebar">
				<view v-if="secondLevelItems.length > 0">
					<view v-for="(item, index) in secondLevelItems" :key="index"
						:class="['sidebar-item', selectedSecondIndex === index ? 'active' : '']"
						@click="changeSecondTab(index)">
						<view class="treeName sidebar-item-content">
							<image src="@/static/image/yes.png" class="menu-icon"></image>
							{{item.name || '未命名'}}
						</view>
					</view>
				</view>
				<view v-else class="no-data-tip">
					不存在第二层数据
				</view>
			</view>
			
			<button @click="dowindow">触发弹窗</button>
		</view>
		
		<!-- 弹窗 -->
		<view v-if="show" class="popup-overlay">
		    <view class="edit-popup-content">
		      <view class="popup-title">照片序号</view>
		
		      <view class="edit-row">
		        <text class="edit-label">结构部位</text>
		        <text class="edit-value">{{ structureData?.children?.[selectedIndex]?.name || '未选中' }}</text>
		      </view>
		
		      <view class="edit-row">
		        <text class="edit-label">结构名称</text>
		        <text class="edit-value">{{ secondLevelItems?.[selectedSecondIndex]?.name || '未选中' }}</text>
		      </view>
		
		      <view class="edit-row">
		        <text class="edit-label">照片序号</text>
		        <view class="input-container">
		          <textarea
		            class="hand-input"
		            v-model="photoNumber"
		            :placeholder="'请输入照片序号'"
		            auto-height
		          />
		          <image src="@/static/image/No.png" class="input-icon" @click.stop="clearInput"></image>
		        </view>
		      </view>
		
		      <view class="popup-buttons">
		        <view class="btn cancel-btn" @click="cancel">取消</view>
		        <view class="btn confirm-btn" @click="confirm">确定</view>
		      </view>
		    </view>
		  </view>
	</view>
</template>

<script setup>
import {
		ref,
		computed,
		onMounted,
	} from 'vue';
import { getObject } from '../../utils/readJsonNew';
import {
	userStore
} from '@/store/index.js'
import {setObject}  from '../../utils/writeNew'
//桥梁id
const TaskBridgeId = ref(0)
const structureData = ref(null);
const userInfo = userStore()
const selectedIndex = ref(0);
const selectedSecondIndex = ref(0);
// 弹窗相关状态
const show = ref(false);
const photoNumber = ref('');

// 通过计算属性获取URL中的bridgeId参数
const bridgeIdFromURL = computed(() => {
	const pages = getCurrentPages();
	if (pages.length > 0) {
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;

		if (options && options.bridgeId) {
			return options.bridgeId;
		}
	}
	return 0; // 默认值
});
const init = async () => {
		console.log('=== init 函数开始执行 ===');
		
		// 确保TaskBridgeId已经从URL参数中获取
		if (bridgeIdFromURL.value) {
			TaskBridgeId.value = bridgeIdFromURL.value;
		}
		structureData.value = await getObject(userInfo.username,1863)
		structureData.value.Iscommit = false;
		console.log("现状照数据 ",structureData.value);
	};
const changeTab = (index) => {
	selectedIndex.value = index;
	selectedSecondIndex.value = 0; // 重置第二个侧边栏的选中状态

	// 添加防御性检查
	const firstLevelItem = structureData.value?.data?.children?.[index];
	if (firstLevelItem) {
		console.log('选中的第一层结构:', firstLevelItem.name);
	} else {
		console.log('选中的第一层结构不存在或数据结构有问题');
	}
};
// 计算第二个侧边栏的数据
	const secondLevelItems = computed(() => {
		if (!structureData.value?.children?.[selectedIndex.value]?.children) {
			return [];
		}
		return structureData.value.children[selectedIndex.value].children;
	});

	// 计算第三个侧边栏的数据
	const thirdLevelItems = computed(() => {
		// 检查第二层选中项是否存在且有children属性
		if (!secondLevelItems.value?.[selectedSecondIndex.value]?.children) {
			return [];
		}
		return secondLevelItems.value[selectedSecondIndex.value].children;
	});
	const changeSecondTab = (index) => {
		selectedSecondIndex.value = index;
	
		// 添加防御性检查
		const secondLevelItem = secondLevelItems.value?.[index];
		if (secondLevelItem) {
			console.log('选中的第二层结构:', secondLevelItem.name);
			// 检查是否有第三层数据
			if (!secondLevelItem.children || secondLevelItem.children.length === 0) {
				console.log('该第二层结构没有第三层数据');
			}
		} else {
			console.log('选中的第二层结构不存在或数据结构有问题');
		}
	};
onMounted(async () => {
	console.log('初始bridgeId:', bridgeIdFromURL.value);
	// 先确认URL参数是否已获取
	if (bridgeIdFromURL.value) {
		TaskBridgeId.value = bridgeIdFromURL.value;
	}
	 await init();
});

// 打开弹窗
const dowindow = () => {
  show.value = true;
  photoNumber.value = ''; // 清空输入
};

// 取消弹窗
const cancel = () => {
  show.value = false;
};

// 确认弹窗
const confirm = () => {
  if (photoNumber.value.trim()) {
    console.log('确认照片序号:', photoNumber.value);
    // 这里可以添加保存序号的逻辑
  }
  show.value = false;
};

// 清空输入框
const clearInput = () => {
  photoNumber.value = ''; // 清空数据
};
</script>

<style lang="scss" scope>
.active {
		position: relative;
	}
	
	.active::before {
		content: '';
		position: absolute;
		left: 0;
		top: 17%; /* 从上往下1/3处开始 */
		height: 66%; /* 高度为总高度的1/3 */
		width: 3rpx;
		background-color: #0F4687;
	}
	
	.active .treeName {
		color: #0F4687 !important; /* 选中项文字颜色 */
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	.content-layout {
		height: 100%;
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	.confirm-row {
		width: 100%;
		background-color: #BDCBE0;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 10rpx;
		box-sizing: border-box;
	}
	
	.confirm-text {
		text-align: center;
		font-size: 20px;
		color: #333;
	}
	
	.confirm-status {
		text-align: center;
		font-size: 20px;
	}
	.sidebar-item {
		padding: 24rpx 0;
		text-align: left;
		color: #666;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 40rpx;
		justify-content: center;
		position: relative;
	}
	
	.sidebar-item-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 12rpx;
		width: 100%; /* 增加宽度，避免内容被挤压 */
		overflow: hidden; /* 超出部分隐藏 */
	}
	/* 侧边栏样式 */
	.sidebar {
		width: 127rpx; /* 从原来的190rpx缩短为2/3 */
		background-color: #f5f5f5;
		border-right: 1rpx solid #eeeeee;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.second-sidebar {
		background-color: #fafafa;
		width: 127rpx; /* 从原来的190rpx缩短为2/3 */
	}
	
	.treeName {
		margin-left: 5rpx;
		font-size: 15rpx;
		white-space: nowrap; /* 防止文本换行 */
		overflow: hidden; /* 超出部分隐藏 */
		text-overflow: ellipsis; /* 超出部分显示省略号 */
		flex: 1; /* 占据剩余空间 */
	}
	/* 添加无数据提示样式 */
	.no-data-tip {
		padding: 30rpx;
		text-align: center;
		color: #999;
		font-size: 24rpx;
	}
	
	/* 菜单图标样式 */
	.menu-icon {
		width: 15rpx;
		height: 15rpx;
		margin-right: 5rpx;
		flex-shrink: 0; /* 防止图标被压缩 */
	}
	
	/* 弹窗样式 */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
	
	.edit-popup-content {
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
	
	.edit-row {
		display: flex;
		align-items: center;
		margin: 20rpx 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #eee;
	}
	
	.edit-row:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}
	
	.edit-label {
		font-size: 20rpx;
		color: #666;
		width: 150rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}
	
	.edit-value {
		font-size: 20rpx;
		color: #333;
		flex: 1;
		margin-left: 10rpx;
	}
	
	.hand-input {
		flex: 1;
		border: 1px solid #ddd;
		border-radius: 0; /* 去掉圆角 */
		padding: 5rpx;
		height: 20rpx; /* 字体大小的一倍 */
		line-height: 20rpx; /* 行高与高度一致，文字垂直居中 */
		font-size: 20rpx;
		box-sizing: border-box;
		min-height: 20rpx;
		width: 100%;
	}
	
	.input-text {
		display: inline-block;
		width: 100%;
	}
	
	.input-container {
		display: flex;
		align-items: center;
		flex: 1;
		margin-left: 10rpx;
		position: relative; /* 相对定位容器 */
	}
	
	.input-icon {
		width: 20rpx;
		height: 20rpx;
		position: absolute; /* 绝对定位 */
		right: 5rpx; /* 靠右放置 */
		top: 50%; /* 垂直居中 */
		transform: translateY(-50%); /* 垂直居中微调 */
		z-index: 1; /* 确保图标显示在上层 */
		cursor: pointer; /* 鼠标指针变为手型 */
	}
	
	.popup-buttons {
		display: flex;
		justify-content: center; /* 改为居中 */
		gap: 40rpx; /* 增加间距 */
		margin-top: 20rpx;
		padding: 0 30rpx 20rpx;
	}
	
	.btn {
		width: 100rpx; /* 设置固定宽度而不是flex:1 */
		height: 50rpx; /* 恢复原来的高度 */
		font-size: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
		margin: 0;
	}
	
	.cancel-btn {
		background-color: #fff;
		color: #1677FF;
		border: 1px solid #1677FF;
	}
	
	.confirm-btn {
		background-color: #1677FF;
		color: #fff;
		border: none;
	}
</style>

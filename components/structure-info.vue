<!-- 
 桥梁结构树
 author:ykx
 date:2025.6.3
 Bug  1
 -->
<template>
	<view class="container">
		<view class="confirm-row">
			<span class="confirm-text">结构信息状态：</span>
			<span class="confirm-status"
				:style="{color: confirmed ? '#00dd00': '#f56c6c'}">{{ confirmed ? '已确认': '未确认'}}</span>
			<view class="confirm-button-container">
				<button @click="confirmStructure" class="confirm-button">确定构件信息</button>
			</view>
		</view>
		<uni-popup ref="confirmPopup" type="center">
			<view class="confirmPopup-content">
				<text class="confirmPopup-text">确定当前结构信息状态吗？</text>
				<view class="confirmPopup-buttons">
					<button class="confirmPopup-buttons-cancel" @click="closeConfirmPopup">取消</button>
					<button class="confirmPopup-buttons-confirm" @click="confirmConfirm">确定</button>
				</view>
			</view>
		</uni-popup>

		<!-- 添加侧边栏 -->
		<view class="content-layout">
			<!-- 第一个侧边栏 -->
			<view class="sidebar">
				<view v-for="(item, index) in structureData.data.children" 
					:key="index"
					:class="['sidebar-item', selectedIndex === index ? 'active' : '']" 
					@click="changeTab(index)">
					<view class="sidebar-item-content">
						{{item.name}}
					</view>
				</view>
			</view>

			<!-- 第二个侧边栏 -->
			<view class="sidebar second-sidebar">
				<view v-for="(item, index) in secondLevelItems" 
					:key="index"
					:class="['sidebar-item', selectedSecondIndex === index ? 'active' : '']" 
					@click="changeSecondTab(index)">
					<view class="sidebar-item-content">
						{{item.name}}
					</view>
				</view>
			</view>

			<!-- 第三个侧边栏 -->
			<view class="sidebar third-sidebar">
				<view v-for="(item, index) in thirdLevelItems" 
					:key="index"
					:class="['sidebar-item', selectedThirdIndex === index ? 'active' : '']" 
					@click="changeThirdTab(index)">
					<view class="sidebar-item-content">
						<text class="item-name" :class="{ 'disabled-text': !item.status }">{{item.name}}</text>
						<view class="item-info-right">
							<text v-if="item.status" class="item-quantity">数量 {{ item.quantity || 0 }}</text>
							<view v-else class="disabled-button">已停用</view>
							<image src="/static/image/RightOutline.svg" class="rightarrow"/>
						</view>
					</view>
					<view class="action-buttons" v-if="item.showActions">
						<button @click.stop="handleCancel(index)">取消</button>
						<button @click.stop="handleEdit(index)">编辑</button>
						<button @click.stop="handleDisable(index)" :data-status="item.status ? 'disabled' : 'enabled'">{{ item.status ? '停用' : '启用' }}</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加编辑弹窗 -->
		<uni-popup ref="editPopup" type="center">
			<view class="edit-popup-content">
				<view class="popup-title">构件信息编辑</view>
				<view class="edit-row">
					<text class="edit-label">构件名称</text>
					<text class="edit-value">{{currentEditItem?.name}}</text>
				</view>
				<view class="edit-row">
					<text class="edit-label">构件状态</text>
					<view class="status-toggle">
						<text class="status-text">停用</text>
						<CustomSwitch 
							v-model="currentEditItem.status" 
							@change="setStatus"
							:active-color="'#409EFF'"
							:inactive-color="'#ff3141'"
						/>
						<text class="status-text">启用</text>
					</view>
				</view>
				<view class="edit-row">
					<text class="edit-label">构件数量</text>
					<!-- Using uni-easyinput for the input field -->
					<uni-easyinput 
						v-model="currentEditItem.quantity" 
						type="number" 
						placeholder="请输入数量" 
						clearSize="40"
						class="quantity-input"
						:inputStyle="{ fontSize: '18rpx' }"
						:placeholderStyle="'font-size: 18rpx;'">
					</uni-easyinput>
				</view>
				<view class="popup-buttons">
					<button class="popup-btn cancel-btn" @click="closeEditPopup">取消</button>
					<button class="popup-btn confirm-btn" @click="saveEdit">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CustomSwitch from './CustomSwitch.vue';
import { setObject } from '../utils/writeNew';
import { getUser } from '../utils/readJsonNew';
const confirmed = ref(false);
const confirmPopup = ref(null);
const structureData = ref(null);
const selectedIndex = ref(0);
const selectedSecondIndex = ref(0);
const selectedThirdIndex = ref(0);
const editPopup = ref(null);
const currentEditItem = ref(null);
//桥梁id
const bridgeId = ref(2)
//初始化数据
const init = async () => {
  // 获取全局文件
  let AllUserInfo = await getUser(1);
  // 获取全局文件中的属性
  console.log('AllUserInfo', AllUserInfo);
  let token = AllUserInfo.token;
  console.log('Cleaned token:', token); // 确认处理后的格式
  const getData = async () => {
    try {
      const response = await uni.request({
		url: `http://60.205.13.156:8090/api/project/${bridgeId.value}/task`,
        method: 'GET',
        header: {
          'Authorization': `${token}` 
        }
      });
      console.log('获取到的桥梁构件数据:', response.data);
      if (response.data.code === 0) {
        structureData.value = response.data;
		//调用接口将数据存在本地
		//参数是写死的 如何动态生成
		setObject(1,bridgeId.value,structureData.value)
      } else {
        uni.showToast({
          title: response.data.msg || '获取数据失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取桥梁构件数据失败:', error);
      uni.showToast({
        title: '获取数据失败，请稍后重试',
        icon: 'none'
      });
    }
  };

  await getData();
};
// 计算第二个侧边栏的数据
const secondLevelItems = computed(() => {
	if (!structureData.value?.children?.[selectedIndex.value]?.children?.[0]?.children) {
		return [];
	}
	return structureData.value.children[selectedIndex.value].children[0].children;
});

// 计算第三个侧边栏的数据
const thirdLevelItems = computed(() => {
	if (!secondLevelItems.value?.[selectedSecondIndex.value]?.children) {
		return [];
	}
	return secondLevelItems.value[selectedSecondIndex.value].children;
});

const confirmStructure = () => {
	confirmPopup.value.open();
};

const confirmConfirm = () => {
	confirmed.value = true;
	confirmPopup.value.close();
};

const closeConfirmPopup = () => {
	confirmPopup.value.close();
};

const changeTab = (index) => {
	selectedIndex.value = index;
	selectedSecondIndex.value = 0; // 重置第二个侧边栏的选中状态
	selectedThirdIndex.value = 0; // 重置第三个侧边栏的选中状态
	console.log('选中的第一层结构:', structureData.value?.children[index]);
	};

const changeSecondTab = (index) => {
	selectedSecondIndex.value = index;
	selectedThirdIndex.value = 0; // 重置第三个侧边栏的选中状态
	console.log('选中的第二层结构:', secondLevelItems.value[index]);
};

const changeThirdTab = (index) => {
	selectedThirdIndex.value = index;
	// 切换显示操作按钮
	thirdLevelItems.value.forEach((item, i) => {
		item.showActions = i === index;
	});
	console.log('选中的第三层结构:', thirdLevelItems.value[index]);
	};

const handleCancel = (index) => {
	thirdLevelItems.value[index].showActions = false;
	};

const handleEdit = (index) => {
	currentEditItem.value = JSON.parse(JSON.stringify(thirdLevelItems.value[index]));
	if (currentEditItem.value) {
		if (currentEditItem.value.status === undefined) {
			currentEditItem.value.status = true; 
		}
		if (currentEditItem.value.quantity === undefined) {
			currentEditItem.value.quantity = 0;
	}
	}
	editPopup.value.open();
	};

const handleDisable = (index) => {
	console.log('切换状态前:', thirdLevelItems.value[index].status);
	// 切换状态
	thirdLevelItems.value[index].status = !thirdLevelItems.value[index].status;
	console.log('切换状态后:', thirdLevelItems.value[index].status);
	// 关闭操作按钮
	thirdLevelItems.value[index].showActions = false;
};

const setStatus = (e) => {
	if (currentEditItem.value) {
		currentEditItem.value.status = e.detail.value;
		console.log('Switch toggled, new status:', currentEditItem.value.status);
	}
};

const saveEdit = () => {
	const originalItem = thirdLevelItems.value.find(item => item.name === currentEditItem.value.name);
	if (originalItem) {
		originalItem.status = currentEditItem.value.status;
		originalItem.quantity = Number(currentEditItem.value.quantity);
	}
	closeEditPopup();
};

const closeEditPopup = () => {
	editPopup.value.close();
	thirdLevelItems.value.forEach(item => {
		item.showActions = false;
	});
	};
onMounted(async() => {
  await init();
});
</script>

<style scoped>
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

	/* 侧边栏样式 */
	.sidebar {
	width: 190rpx; /* 修改为190rpx */
		background-color: #f5f5f5;
		border-right: 1rpx solid #eeeeee;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

.second-sidebar {
	background-color: #fafafa;
	width: 190rpx; /* 修改为190rpx */
}

.third-sidebar {
	width: 100%;
}

.third-sidebar .sidebar-item {
	height: auto;
	padding: 15.5rpx 20rpx; /* 将上下内边距减小2.5rpx */
	border-bottom: 1px solid #eee; /* 将下方实线变粗 */
}

.third-sidebar .sidebar-item-content {
	width: 100%;
	font-size: 20rpx;
	color: #333;
	padding-left: 0;
	display: flex;
	justify-content: space-between; /* 使内容两端对齐 */
	align-items: center; /* 垂直居中 */
}

.item-name {
	flex-shrink: 0; /* 防止名字被压缩 */
	margin-right: 10rpx; /* 添加右侧间距 */
	color: #333;
}

.item-info-right {
	display: flex;
	align-items: center;
	color: #333;
	font-size: 18rpx;
	margin-left: auto; 
}

.item-quantity {
	font-size: 20rpx;
	margin-right: 10rpx;
}

.rightarrow {
	height: 20rpx;
	width: 20rpx;
}

.third-sidebar .sidebar-item.active .sidebar-item-content {
	border-left: none;
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
		width: 60%;
		font-size: 18rpx;
	}

	.sidebar-item.active {
		background-color: #ffffff;
	}

/* 修改活动项样式，使用伪元素创建蓝色线 */
.sidebar-item.active::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 0;
	width: 4rpx;
	height: 48rpx;
	background-color: #0F4687;
	transform: translateY(-50%);
}

	.sidebar-item.active .sidebar-item-content {
		background-color: #ffffff;
		color: #0F4687;
	border-left: none;
	}

/* 移除第三个侧边栏活动项的左侧竖线 */
.third-sidebar .sidebar-item.active .sidebar-item-content {
	border-left: none;
}

/* 确保第三个侧边栏活动项文字颜色为黑色 */
.third-sidebar .sidebar-item.active .sidebar-item-content {
	color: #000;
	font-weight: normal;
	border-left: none;
	}

/* 隐藏第三个侧边栏活动项的蓝色竖线伪元素 */
.third-sidebar .sidebar-item.active::before {
	display: none;
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

.confirm-button-container {
	margin-left: auto;
}

.confirm-button {
	background-color: #0F4687;
	color: #fff;
	font-size: 15px;
	border-radius: 5rpx;
	}

.confirmPopup-content {
	padding: 20rpx 10rpx;
	background-color: #fff;
	border-radius: 15rpx;
	width: 300rpx;
	text-align: center;
	}

.confirmPopup-text {
		font-size: 20rpx;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
	}

.confirmPopup-buttons {
		display: flex;
	justify-content: space-around;
	}

.confirmPopup-buttons-cancel {
	background: #ffffff;
	border: 1px solid #0F4687;
	color: #0F4687;
	}

.confirmPopup-buttons-confirm {
	background-color: #0F4687;
	color: #fff;
	}

.action-buttons {
	position: absolute;
	right: 0;
	top: 0;
	height: 100%;
	display: flex;
}

.action-buttons button {
	width: 80rpx;
	height: 100%;
	border: none;
	padding: 0;
		font-size: 20rpx;
	border-radius: 0;
	display: flex;
	align-items: center;
	justify-content: center;
		color: #fff;
	}

.action-buttons button:nth-child(1) {
	background-color: #cccccc;
	}

.action-buttons button:nth-child(2) {
	background-color: #1677ff;
}

.action-buttons button:nth-child(3) {
	background-color: #ff3141;
	}

.action-buttons button:nth-child(3)[data-status="enabled"] {
	background-color: #00b578;
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
	margin-left: -45rpx;
	}

.status-toggle {
		display: flex;
		align-items: center;
	flex: 1;
	margin-left: -55rpx;
	}

.status-text {
		font-size: 20rpx;
	color: #333;
	margin: 0 10rpx;
	}

.quantity-input {
	flex: 1;
		font-size: 20rpx;
	margin-left: -50rpx;
	height: 24rpx;
	align-self: center;
	margin-bottom: 16rpx; 
	}


.quantity-input ::v-deep .uni-easyinput__content {
	padding: 0 10rpx !important;
	font-size: 20rpx !important; 
		display: flex;
		align-items: center;
	border-radius: 0 !important;
	min-height: 24rpx; 
	}

/* Style for the placeholder text */
.quantity-input ::v-deep .uni-easyinput__placeholder {
	font-size: 20rpx !important;
	color: #999;
	}

.popup-buttons {
		display: flex;
		justify-content: center;
	gap: 20rpx; 
	margin-top: 30rpx;
	padding: 0 30rpx 30rpx;
	}

.popup-btn {
	width: 70rpx;
	height: 50rpx;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	border-radius: 10rpx;
}


.popup-buttons .popup-btn:first-child {
	margin-left: 120rpx;
	}


.popup-buttons .popup-btn:nth-child(2) {
	margin-left: -80rpx;
}

.cancel-btn {
	background-color: #fff;
	color: #0F4687;
	border: 1px solid #0F4687;
	}

.confirm-btn {
	background-color: #0F4687;
	color: #fff;
	border: none;
	}

.disabled-button {
	background-color: #ff3141;
	color: #fff;
	font-size: 13rpx;
	padding: 0 12rpx;
	border-radius: 20rpx;
	margin-right: 5rpx;
	height: 30rpx;
	line-height: 30rpx;
	display: inline-block;
	width: 43rpx;
	text-align: center;
	}

.disabled-text {
	color: #999;
	}
</style>
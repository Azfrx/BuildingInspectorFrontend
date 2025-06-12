<!-- 
 桥梁结构树
 author:ykx
 date:2025.6.3
 Bug  2 +
 Q json没有 无法处理2个按钮的功能
 构件数量存在哪个字段 
 确定构件信息需要处理哪些逻辑
 -->
<template>
	<view class="container">
		<view class="confirm-row">
			<span class="confirm-text">结构信息状态：</span>
			<span class="confirm-status"
				:style="{color: confirmed ? '#00dd00': '#f56c6c'}">{{ confirmed ? '已确认': '未确认'}}</span>
			<view class="confirm-button-container">
				<button @click="confirmStructure" class="confirm-button" :disabled="confirmed">保存构件信息</button>
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
				<!-- Bug 后端接口json文件对不上 还是旧版本 -->
				<view v-for="(item, index) in structureData?.data.children || []" 
					:key="index"
					:class="['sidebar-item', selectedIndex === index ? 'active' : '']" 
					@click="changeTab(index)">
					<view class="sidebar-item-content">
						{{item.name || '未命名'}}
					</view>
				</view>
			</view>

			<!-- 第二个侧边栏 -->
			<view class="sidebar second-sidebar">
				<view v-if="secondLevelItems.length > 0">
					<view v-for="(item, index) in secondLevelItems" 
						:key="index"
						:class="['sidebar-item', selectedSecondIndex === index ? 'active' : '']" 
						@click="changeSecondTab(index)">
						<view class="sidebar-item-content">
							{{item.name || '未命名'}}
						</view>
					</view>
				</view>
				<view v-else class="no-data-tip">
					不存在第二层数据
				</view>
			</view>

			<!-- 第三个侧边栏 -->
			<view class="sidebar third-sidebar" v-if="thirdLevelItems.length > 0">
				<view v-for="(item, index) in thirdLevelItems" 
					:key="index"
					:class="['sidebar-item', selectedThirdIndex === index ? 'active' : '']" 
					@click="changeThirdTab(index)">
					<view class="sidebar-item-content">
						<text class="item-name" :class="{ 'disabled-text': item.status === '1' }">{{item.name || '未命名'}}</text>
						<view class="item-info-right">
							<text v-if="item.status === '0'" class="item-quantity">数量 {{ item.quantity || 0 }}</text>
							<view v-else class="disabled-button">已停用</view>
							<image src="/static/image/RightOutline.svg" class="rightarrow"/>
						</view>
					</view>
					<view class="action-buttons" v-if="selectedThirdIndex === index">
						<button @click.stop="handleCancel()">取消</button>
						<button @click.stop="handleEdit(index)">编辑</button>
						<button @click.stop="handleDisable(index)" :data-status="item.status === '0' ? 'disabled' : 'enabled'">{{ item.status === '0' ? '停用' : '启用' }}</button>
					</view>
				</view>
			</view>
			<!-- 当没有第三层数据时显示提示 -->
			<view class="sidebar third-sidebar" v-else>
				<view class="no-data-tip">
					不存在構件
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
import { ref, computed, onMounted, watch } from 'vue';
import CustomSwitch from './CustomSwitch.vue';
import { setObject } from '../utils/writeNew';
import {userStore} from '@/store/index.js'
const confirmed = ref(false);
const confirmPopup = ref(null);
const structureData = ref(null);
const selectedIndex = ref(0);
const selectedSecondIndex = ref(0);
const selectedThirdIndex = ref(-1);
const editPopup = ref(null);
const currentEditItem = ref(null);
//桥梁id
const TaskBridgeId = ref(0)
//去除msg和code字段的数据
const resultData = ref(null);
const userInfo = userStore()

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

// 监听bridgeIdFromURL的变化
watch(bridgeIdFromURL, (newVal) => {
  if (newVal) {
    TaskBridgeId.value = newVal;
    console.log('接收到的桥梁ID:', TaskBridgeId.value);
  }
});

//初始化数据
const init = async () => {
  // 确保TaskBridgeId已经从URL参数中获取
  if (bridgeIdFromURL.value) {
    TaskBridgeId.value = bridgeIdFromURL.value;
  }
  const responseLogin = await uni.request({
    	url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
    	method: 'POST'
    });
  console.log('用户信息:', responseLogin.data);
  const token = responseLogin.data.token
  const getData = async () => {
    try {
      const response = await uni.request({
		//寫死 因爲只有55是最新數據
		 url: `http://60.205.13.156:8090/api/building/${TaskBridgeId.value}/object`,
        method: 'GET',
        header: {
          'Authorization': `${token}` 
        }
      });
      console.log('获取到的桥梁构件数据:', response.data);
      if (response.data.code === 0) {
        structureData.value = response.data;
		resultData.value = response.data.data
		//将数据存在本地 提交前初始化数据
		setObject(responseLogin.data.userName, TaskBridgeId.value, resultData.value);
		console.log('structureData:',structureData.value)
		console.log('resultData:',resultData.value)
		// 打印第一层结构数据，检查是否完整
		console.log('第一层结构数据:', structureData.value.children)
		if (structureData.value.children) {
			structureData.value.children.forEach((item, index) => {
				console.log(`第一层结构 ${index+1}:`, item.name);
			});
		}
		//调用接口将数据存在本地
		//参数是写死的 如何动态生成
		
		// 确保所有项的status字段使用"0"/"1"
		normalizeStatusFields(resultData.value);
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
	if (!structureData.value?.data.children?.[selectedIndex.value]?.children) {
		return [];
	}
	return structureData.value.data.children[selectedIndex.value].children;
});

// 计算第三个侧边栏的数据
const thirdLevelItems = computed(() => {
	// 检查第二层选中项是否存在且有children属性
	if (!secondLevelItems.value?.[selectedSecondIndex.value]?.children) {
		return [];
	}
	return secondLevelItems.value[selectedSecondIndex.value].children;
});

const confirmStructure = () => {
	// 打开确认弹窗前，准备提交数据
	console.log('准备提交的数据:', resultData.value);
	confirmPopup.value.open();
};

const confirmConfirm = () => {
	// 计算并更新各级count总和
	calculateAndUpdateCounts();
	
	// 不再设置确认状态为true，允许多次提交
	// confirmed.value = true;
	
	// 不再提交数据到后端
	// submitDataToBackend();
	
	// 直接存储数据到本地
	storeDataLocally();
	
	confirmPopup.value.close();
	
	// 显示确认成功提示
	uni.showToast({
		title: '构件信息已保存',
		icon: 'success',
		duration: 2000
	});
};

// 添加计算并更新各级count总和的函数
const calculateAndUpdateCounts = () => {
	if (!resultData.value || !resultData.value.children) {
		console.warn('resultData结构不完整，无法计算count总和');
		return;
	}
	
	// 遍历第一层
	resultData.value.children.forEach(firstLevel => {
		if (!firstLevel || !firstLevel.children) return;
		
		let firstLevelTotal = 0; // 第一层节点的count总和
		
		// 遍历第二层
		firstLevel.children.forEach(secondLevel => {
			if (!secondLevel || !secondLevel.children) return;
			
			let secondLevelTotal = 0; // 第二层节点的count总和
			
			// 遍历第三层，计算第二层的count总和
			secondLevel.children.forEach(thirdLevel => {
				if (!thirdLevel) return;
				
				// 确保count是数字
				const count = Number(thirdLevel.count || 0);
				secondLevelTotal += count;
				
				console.log(`第三层节点 ${thirdLevel.name || '未命名'} 的count: ${count}`);
			});
			
			// 更新第二层节点的count
			secondLevel.count = secondLevelTotal;
			firstLevelTotal += secondLevelTotal;
			
			console.log(`第二层节点 ${secondLevel.name || '未命名'} 的count总和: ${secondLevelTotal}`);
		});
		
		// 更新第一层节点的count
		firstLevel.count = firstLevelTotal;
		
		console.log(`第一层节点 ${firstLevel.name || '未命名'} 的count总和: ${firstLevelTotal}`);
	});
	
	// 计算所有第一层节点的count总和
	let totalCount = 0;
	resultData.value.children.forEach(firstLevel => {
		totalCount += Number(firstLevel.count || 0);
	});
	
	// 更新根节点的count
	resultData.value.count = totalCount;
	
	console.log(`所有节点的count总和: ${totalCount}`);
	console.log('更新后的resultData:', resultData.value);
};

const closeConfirmPopup = () => {
	confirmPopup.value.close();
};

const changeTab = (index) => {
	selectedIndex.value = index;
	selectedSecondIndex.value = 0; // 重置第二个侧边栏的选中状态
	selectedThirdIndex.value = -1; // 重置第三个侧边栏的选中状态
	
	// 添加防御性检查
	const firstLevelItem = structureData.value?.data?.children?.[index];
	if (firstLevelItem) {
		console.log('选中的第一层结构:', firstLevelItem.name);
	} else {
		console.log('选中的第一层结构不存在或数据结构有问题');
	}
};

const changeSecondTab = (index) => {
	selectedSecondIndex.value = index;
	selectedThirdIndex.value = -1; // 重置第三个侧边栏的选中状态
	
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

const changeThirdTab = (index) => {
	// 如果点击的是当前选中的项，则取消选中
	if (selectedThirdIndex.value === index) {
		selectedThirdIndex.value = -1;
	} else {
		selectedThirdIndex.value = index;
	}
	console.log('选中的第三层结构:', thirdLevelItems.value[index]);
};

const handleCancel = () => {
	// 不再需要index参数，直接重置selectedThirdIndex
	selectedThirdIndex.value = -1; // 使用-1表示没有选中项
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
	const currentStatus = thirdLevelItems.value[index].status;
	// 将布尔值转换为字符串"0"/"1"，"0"表示启用，"1"表示停用
	thirdLevelItems.value[index].status = currentStatus === "0" ? "1" : "0";
	console.log('切换状态后:', thirdLevelItems.value[index].status);
	
	// 直接更新count字段
	const item = thirdLevelItems.value[index];
	item.count = item.status === "0" ? Number(item.quantity || 0) : 0;
	
	// 不再设置delFlag字段，直接使用status字段
	console.log(`已更新${item.name}的count为${item.count}, status为${item.status}`);
	
	// 更新resultData中对应的count字段和status字段
	updateResultData(item);
	
	// 打印所有第三层构件的name和count
	console.log('所有第三层构件信息:');
	thirdLevelItems.value.forEach(item => {
		console.log(`构件名称: ${item.name}, 构件数量: ${item.count || 0}, 状态标志: ${item.status || '0'}`);
	});
	
	// 隐藏操作按钮
	selectedThirdIndex.value = -1;
};

const setStatus = (e) => {
	if (currentEditItem.value) {
		// 将布尔值转换为字符串"0"/"1"，"0"表示启用，"1"表示停用
		currentEditItem.value.status = e.detail.value ? "0" : "1";
		console.log('Switch toggled, new status:', currentEditItem.value.status);
		
		// 如果状态改为停用("1")，则将数量直接置为0
		if (currentEditItem.value.status === "1") {
			currentEditItem.value.quantity = 0;
			console.log('状态改为停用，数量自动置为0');
		}
	}
};

const saveEdit = () => {
	const originalItem = thirdLevelItems.value.find(item => item.name === currentEditItem.value.name);
	if (originalItem) {
		originalItem.status = currentEditItem.value.status;
		
		// 如果状态为停用，确保数量为0
		if (originalItem.status === "1") {
			originalItem.quantity = 0;
		} else {
			originalItem.quantity = Number(currentEditItem.value.quantity);
		}
		
		// 直接更新count字段
		originalItem.count = originalItem.status === "0" ? originalItem.quantity : 0;
		console.log(`已更新${originalItem.name}的count为${originalItem.count}`);
		
		// 更新resultData中对应的count字段
		updateResultData(originalItem);
		
		// 打印所有第三层构件的name和count
		console.log('所有第三层构件信息:');
		thirdLevelItems.value.forEach(item => {
			console.log(`构件名称: ${item.name}, 构件数量: ${item.count || 0}, 状态标志: ${item.status || '0'}`);
		});
	}
	closeEditPopup();
};

const closeEditPopup = () => {
	editPopup.value.close();
	// 隐藏操作按钮
	selectedThirdIndex.value = -1;
};

// 添加更新resultData的函数
const updateResultData = (updatedItem) => {
	if (!resultData.value || !resultData.value.children) {
		console.error('resultData未正确初始化');
		return;
	}
	
	// 获取当前选中的第一层索引
	const firstLevelIndex = selectedIndex.value;
	// 获取当前选中的第二层索引
	const secondLevelIndex = selectedSecondIndex.value;
	// 获取当前第三层项目的名称
	const itemName = updatedItem.name;
	
	// 确保resultData中有对应的层级结构
	if (resultData.value.children[firstLevelIndex] && 
		resultData.value.children[firstLevelIndex].children[secondLevelIndex]) {
		
		// 获取第三层数据
		const thirdLevelItems = resultData.value.children[firstLevelIndex].children[secondLevelIndex].children;
		
		if (thirdLevelItems) {
			// 查找对应名称的项
			const targetItem = thirdLevelItems.find(item => item.name === itemName);
			
			if (targetItem) {
				// 创建一个不包含showActions的更新对象
				const updateData = {
					count: updatedItem.count,
					status: updatedItem.status,
					name: updatedItem.name,
					quantity: updatedItem.quantity
				};
				
				// 将更新对象的属性复制到目标对象
				Object.assign(targetItem, updateData);
				
				console.log(`已更新resultData中${itemName}的count为${updatedItem.count}, status为${targetItem.status}`);
			} else {
				console.warn(`未在resultData中找到名称为${itemName}的项`);
			}
		} else {
			console.warn('resultData中没有第三层数据');
		}
	} else {
		console.warn('resultData中的层级结构不完整');
	}
	
	// 打印更新后的resultData结构
	console.log('更新后的resultData:', resultData.value);
};

// 添加本地存储数据的函数
const storeDataLocally = async () => {
	try {
		const responseLogin = await uni.request({
			url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
			method: 'POST'
		});
		
		if (!responseLogin.data) {
			uni.showToast({
				title: '获取用户信息失败',
				icon: 'none'
			});
			return;
		}
		
		// 将数据存储到本地
		setObject(responseLogin.data.userName, TaskBridgeId.value, resultData.value);
		console.log('已将数据存储到本地:', resultData.value);
		
	} catch (error) {
		console.error('存储数据错误:', error);
		uni.showToast({
			title: '存储数据出错，请稍后重试',
			icon: 'none'
		});
	}
};

// 添加一个函数来规范化status字段
const normalizeStatusFields = (data) => {
  if (!data || !data.children) return;
  
  // 处理第一层
  data.children.forEach(firstLevel => {
    if (!firstLevel) return;
    
    // 规范化第一层status
    if (typeof firstLevel.status === 'boolean') {
      firstLevel.status = firstLevel.status ? "0" : "1"; // true转为"0"(启用)，false转为"1"(停用)
    }
    
    // 处理第二层
    if (firstLevel.children) {
      firstLevel.children.forEach(secondLevel => {
        if (!secondLevel) return;
        
        // 规范化第二层status
        if (typeof secondLevel.status === 'boolean') {
          secondLevel.status = secondLevel.status ? "0" : "1"; // true转为"0"(启用)，false转为"1"(停用)
        }
        
        // 处理第三层
        if (secondLevel.children) {
          secondLevel.children.forEach(thirdLevel => {
            if (!thirdLevel) return;
            
            // 规范化第三层status
            if (typeof thirdLevel.status === 'boolean') {
              thirdLevel.status = thirdLevel.status ? "0" : "1"; // true转为"0"(启用)，false转为"1"(停用)
            }
          });
        }
      });
    }
  });
  
  console.log('已规范化所有status字段为"0"/"1"格式，"0"表示启用，"1"表示停用');
};

onMounted(async() => {
  console.log('初始bridgeId:', bridgeIdFromURL.value);
  // 先确认URL参数是否已获取
  if (bridgeIdFromURL.value) {
    TaskBridgeId.value = bridgeIdFromURL.value;
  }
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

/* 添加无数据提示样式 */
.no-data-tip {
	padding: 30rpx;
	text-align: center;
	color: #999;
	font-size: 24rpx;
}
</style>
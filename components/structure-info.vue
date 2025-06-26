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
				:style="{color: Number(structureData?.status) === 3 ? '#333': '#f56c6c'}">
				{{ Number(structureData?.status) === 3 ? '未锁定': '已锁定'}}
			</span>
		</view>
		<!-- 添加侧边栏 -->
		<view class="content-layout">
			<!-- 第一个侧边栏 -->
			<view class="sidebar">
				<view v-for="(item, index) in structureData?.children || []" :key="index"
					:class="['sidebar-item', selectedIndex === index ? 'active' : '']" @click="changeTab(index)">
					<image v-if="hasWarningInChildren(item)" src="@/static/image/warning.png" class="flagImage"
						style="width: 13rpx; height: 13rpx; margin-right: 5rpx;" />
					<view class="treeName sidebar-item-content">
						{{item.name || '未命名'}}
					</view>
				</view>
			</view>

			<!-- 第二个侧边栏 -->
			<view class="sidebar second-sidebar">
				<view v-if="secondLevelItems.length > 0">
					<view v-for="(item, index) in secondLevelItems" :key="index"
						:class="['sidebar-item', selectedSecondIndex === index ? 'active' : '']"
						@click="changeSecondTab(index)">
						<image v-if="hasWarningInChildren(item)" src="@/static/image/warning.png" class="flagImage"
							style="width: 13rpx; height: 13rpx; margin-right: 5rpx;" />
						<view class="treeName sidebar-item-content">
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
				<view v-for="(item, index) in thirdLevelItems" :key="index"
					:class="['sidebar-item', selectedThirdIndex === index ? 'active' : '']"
					@click="changeThirdTab(index)">
					<view class="sidebar-item-content">
						<text class="item-name"
							:class="{ 'disabled-text': item.status === '1' }">{{item.name || '未命名'}}</text>
						<view class="item-info-right">
							<view class="counterNumber">
								<text class="item-quantity">
									<span class="rightcount">病害构件数量</span>{{item.diseaseNumber||0}}</text>
								<text v-if="item.status === '0'" class="item-quantity">
									<image v-if="item.diseaseNumber>item.count" src="@/static/image/warning.png"
										style="width: 13rpx; height: 13rpx; margin-right: 5rpx;" />
									<span class="rightcount2">构件数量</span>
									{{ item.count || 0 }}
								</text>
							</view>
							<image src="/static/image/RightOutline.svg" class="rightarrow" />
						</view>
					</view>
					<view class="action-buttons" v-if="selectedThirdIndex === index">
						<button @click.stop="handleCancel()">取消</button>
						<button @click.stop="handleEdit(index, item)">编辑</button>
					</view>
				</view>
			</view>
			<!-- 当没有第三层数据时显示提示 -->
			<view class="sidebar third-sidebar" v-else>
				<view class="no-data-tip">
					数据为空
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
					<text class="edit-label">病害构件数量</text>
					<view>
						<text class="desease">{{diseaseNumber}}</text>
					</view>
				</view>
				<view class="edit-row">
					<text class="edit-label">构件数量</text>
					<uni-easyinput v-model="currentEditItem.quantity" type="number" placeholder="请输入数量" clearSize="40"
						class="quantity-input" :inputStyle="{ fontSize: '18rpx' }"
						:placeholderStyle="'font-size: 20rpx;'">
					</uni-easyinput>
				</view>
				<view class="popup-buttons">
					<button class="popup-btn cancel-btn" @click="closeEditPopup">取消</button>
					<!-- <button class="popup-btn confirm-btn" @click="saveEdit">确定</button> -->
					<button class="popup-btn confirm-btn" @click="confirmConfirm">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		watch,
		nextTick
	} from 'vue';
	import CustomSwitch from './CustomSwitch.vue';
		
	import {
		userStore
	} from '@/store/index.js'
	import {
		structureStore
	} from '../store/structureNumberStorage';
	import { getObject,readDiseaseComponent } from '../utils/readJsonNew';
	import {setObject}  from '../utils/writeNew'
	import {addFlagsAndDiseaseNumber} from'../utils/addFlag.js'
	import{incrementDiseaseNumber} from'../utils/diseaseNumber.js'
import { async } from 'rxjs';
	const structureData = ref(null);
	const selectedIndex = ref(0);
	const selectedSecondIndex = ref(0);
	const selectedThirdIndex = ref(-1);
	const editPopup = ref(null);
	const currentEditItem = ref(null);
	const currentEditItemBoolean = computed(() => {
		return currentEditItem.value.status === '0' ? true : false
	})
	//病害构件数量
	const diseaseNumber = ref(0)
	//桥梁id
	const TaskBridgeId = ref(0)
	//去除msg和code字段的数据
	const resultData = ref(null);
	const userInfo = userStore()
	const structureNumberInfo = structureStore()
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
	// const warningTwoFlag = warningThree(resultData.value)
	// 监听bridgeIdFromURL的变化
	watch(bridgeIdFromURL, (newVal) => {
		if (newVal) {
			TaskBridgeId.value = newVal;
			console.log('接收到的桥梁ID:', TaskBridgeId.value);
			
		}
	});

	//初始化数据
	const init = async () => {
		console.log('=== init 函数开始执行 ===');
		
		// 确保TaskBridgeId已经从URL参数中获取
		if (bridgeIdFromURL.value) {
			TaskBridgeId.value = bridgeIdFromURL.value;
		}

		structureData.value = await getObject(userInfo.username,TaskBridgeId.value)
		console.log("structureData.value ",structureData.value);
		const modifiedData = await addFlagsAndDiseaseNumber(structureData.value,userInfo.username,TaskBridgeId.value);
		console.log("添加字段后的数据",modifiedData);
		setObject(userInfo.username,TaskBridgeId.value,modifiedData)
		// incrementDiseaseNumber(modifiedData,4490)
		// incrementDiseaseNumber(modifiedData,4491)
		// incrementDiseaseNumber(modifiedData,4491)
		// incrementDiseaseNumber(modifiedData,4492)
		// incrementDiseaseNumber(modifiedData,4492)
		// incrementDiseaseNumber(modifiedData,4492)
		// console.log("add后的数据",modifiedData);
		//读取完整数据
		structureData.value = await getObject(userInfo.username,TaskBridgeId.value)
		console.log("最终读取的structureData.value:", structureData.value);
		
		// 初始化resultData
		resultData.value = structureData.value;
		console.log("初始化后的resultData.value:", resultData.value);
		
		// 检查初始警告状态
		console.log('准备调用 checkAllWarnings...');
		checkAllWarnings();
		console.log('checkAllWarnings 调用完成');
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

// 刷新数据的函数
const refreshData = async () => {
  // 重新获取最新数据
  structureData.value = await getObject(userInfo.username, TaskBridgeId.value);
  console.log('新数据structureData.value', structureData.value)
  
  // 同步更新resultData
  resultData.value = structureData.value;
  
  // 重新执行警告标志检查
  warningFlag();
  
  // 检查所有警告状态
  checkAllWarnings();
  
  // 重置选中状态
  selectedIndex.value = 0;
  selectedSecondIndex.value = 0;
  selectedThirdIndex.value = -1;
  
  console.log('数据已刷新');
};

// 监听版本号变化
watch(() => structureNumberInfo.dataVersion, (newVal) => {
  if (newVal > 0) {
    refreshData();
  }
});
	const confirmConfirm = () => {
		// currentEditDisease.value.flag = currentEditDisease.value.diseaseNumber <= currentEditDisease.value.count ? false : true
		saveEdit()

		// handleDisable(Number(currentEditItem.value))
		// 计算并更新各级count总和
		calculateAndUpdateCounts();

		// 不再设置确认状态为true，允许多次提交
		// confirmed.value = true;

		// 不再提交数据到后端
		// submitDataToBackend();

		// 直接存储数据到本地
		setObject(userInfo.username, TaskBridgeId.value, resultData.value);
		console.log('确认后数据已保存到本地:', resultData.value);


		// 显示确认成功提示
		uni.showToast({
			title: '构件信息已保存',
			icon: 'success',
			duration: 2000
		});

		// 执行warningFlag检查
		warningFlag();
		
		// 检查所有警告状态
		checkAllWarnings();
	};
	const warningFlag = () => {
		const data = getObject(userInfo.username, TaskBridgeId.value)
		if (!data || !data.children) return

		console.log('开始检查前的数据:', data)

		// 递归函数，返回是否设置了flag
		const traverse = (node, level) => {
			if (!node) return false
			
			let hasWarning = false
			
			// 如果是第三层，检查diseaseNumber和count
			if (level === 3) {
				console.log('第三层节点:', node.name, 'diseaseNumber:', node.diseaseNumber, 'count:', node.count)
				if (node.diseaseNumber > node.count) {
					node.flag = true
					console.log('设置警告:', node.name, 'flag:', node.flag)
					return true
				} else {
					node.flag = false
					return false
				}
			}
			
			// 遍历子节点
			if (node.children) {
				for (const child of node.children) {
					if (traverse(child, level + 1)) {
						hasWarning = true
					}
				}
			}
			
			// 如果子节点有warning，当前节点也设置flag
			if (hasWarning) {
				node.flag = true
				console.log('父节点设置警告:', node.name, 'flag:', node.flag)
			} else {
				node.flag = false
			}
			
			return hasWarning
		}
		
		// 从第一层开始遍历
		for (const firstLevel of data.children) {
			traverse(firstLevel, 1)
		}
		
		// 更新数据
		setObject(userInfo.username, TaskBridgeId.value, data)
		
		// 强制更新视图 - 直接使用data而不是嵌套结构
		structureData.value = data;
		
		// 同步更新resultData
		resultData.value = structureData.value;
		
		console.log('更新后的数据:', structureData.value)
		
		// 强制更新视图
		nextTick(() => {
			console.log('视图更新后的数据:', structureData.value)
		})
	}
	//判断第三层数据是否有warning
	const warningThree = (obj) => {
		for (let i = 0; i < obj.children.length; i++) {
			for (let j = 0; j < obj.children[i].children.length; j++) {
				for (let k = 0; k < obj.children[i].children[j].children.length; k++) {
					if (obj.children[i].children[j].children[k].flag === false) {
						return false;
					}
				}
			}
		}
		return true
	}


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
	
	const currentEditDisease = ref()
	const handleEdit = (index, diseaseItem) => {
		diseaseNumber.value = diseaseItem.diseaseNumber
		currentEditDisease.value = diseaseItem
		
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

	// const handleDisable = (index) => {
	// 	console.log('切换状态前:', thirdLevelItems.value[index].status);
	// 	// 切换状态
	// 	const currentStatus = thirdLevelItems.value[index].status;
	// 	// 将布尔值转换为字符串"0"/"1"，"0"表示启用，"1"表示停用
	// 	thirdLevelItems.value[index].status = currentStatus === "0" ? "1" : "0";
	// 	console.log('切换状态后:', thirdLevelItems.value[index].status);

	// 	// 直接更新count字段
	// 	const item = thirdLevelItems.value[index];
	// 	item.count = item.status === "0" ? Number(item.quantity || 0) : 0;

	// 	// 不再设置delFlag字段，直接使用status字段
	// 	console.log(`已更新${item.name}的count为${item.count}, status为${item.status}`);

	// 	// 更新resultData中对应的count字段和status字段
	// 	updateResultData(item);

	// 	// 打印所有第三层构件的name和count
	// 	console.log('所有第三层构件信息:');
	// 	thirdLevelItems.value.forEach(item => {
	// 		console.log(`构件名称: ${item.name}, 构件数量: ${item.count || 0}, 状态标志: ${item.status || '0'}`);
	// 	});

	// 	// 隐藏操作按钮
	// 	selectedThirdIndex.value = -1;
	// 	console.log('最终存的resultData.value', resultData.value);
	// 	// 将数据存储到本地
	// 	setObject(userInfo.username, TaskBridgeId.value, resultData.value);
	// };

	const setStatus = (e) => {
		if (currentEditItem.value) {
			// 将布尔值转换为字符串"0"/"1"，"0"表示启用，"1"表示停用
			currentEditItem.value.status = e ? "0" : "1";
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
			
			// 保存更新后的数据到本地存储
			setObject(userInfo.username, TaskBridgeId.value, resultData.value);
			console.log('数据已保存到本地存储:', resultData.value);
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
	// const storeDataLocally = async () => {
	// 	try {
	// 		const responseLogin = await uni.request({
	// 			url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
	// 			method: 'POST'
	// 		});

	// 		if (!responseLogin.data) {
	// 			uni.showToast({
	// 				title: '获取用户信息失败',
	// 				icon: 'none'
	// 			});
	// 			return;
	// 		}

	// 		// 将数据存储到本地
	// 		setObject(userInfo.username, TaskBridgeId.value, resultData.value);
	// 		console.log('已将数据存储到本地:', resultData.value);

	// 	} catch (error) {
	// 		console.error('存储数据错误:', error);
	// 		uni.showToast({
	// 			title: '存储数据出错，请稍后重试',
	// 			icon: 'none'
	// 		});
	// 	}
	// };

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
						secondLevel.status = secondLevel.status ? "0" :
							"1"; // true转为"0"(启用)，false转为"1"(停用)
					}

					// 处理第三层
					if (secondLevel.children) {
						secondLevel.children.forEach(thirdLevel => {
							if (!thirdLevel) return;

							// 规范化第三层status
							if (typeof thirdLevel.status === 'boolean') {
								thirdLevel.status = thirdLevel.status ? "0" :
									"1"; // true转为"0"(启用)，false转为"1"(停用)
							}
						});
					}
				});
			}
		});

		console.log('已规范化所有status字段为"0"/"1"格式，"0"表示启用，"1"表示停用');
	};

	// 添加检查子节点是否有警告的函数
	const hasWarningInChildren = (node) => {
		if (!node) return false;
		
		let hasWarning = false;
		
		// 如果是第三层节点
		if (node.diseaseNumber !== undefined && node.count !== undefined) {
			hasWarning = node.diseaseNumber > node.count;
			console.log(`第三层节点 ${node.name}: diseaseNumber=${node.diseaseNumber}, count=${node.count}, hasWarning=${hasWarning}`);
		}
		// 如果是第一层或第二层节点
		else if (node.children) {
			hasWarning = node.children.some(child => hasWarningInChildren(child));
			console.log(`父节点 ${node.name}: 子节点检查完成, hasWarning=${hasWarning}`);
		}
		
		return hasWarning;
	};

	// 添加一个函数来检查整个数据结构是否有警告
	const checkAllWarnings = () => {
		console.log('=== checkAllWarnings 函数被调用 ===');
		// 尝试不同的数据结构路径
		let childrenData = null;
		if (structureData.value?.children) {
			childrenData = structureData.value.children;
			console.log('使用 structureData.value.children');
		} else if (structureData.value?.data?.children) {
			childrenData = structureData.value.data.children;
			console.log('使用 structureData.value.data.children');
		} else {
			console.log('checkAllWarnings: 找不到 children 数据');
			return;
		}
		
		console.log('开始检查警告状态，当前structureNumberInfo.status:', structureNumberInfo.status);
		
		// 重置状态
		structureNumberInfo.status = false;
		
		// 检查所有第一层节点
		const hasAnyWarning = childrenData.some(node => {
			const hasWarning = hasWarningInChildren(node);
			console.log(`检查节点 ${node.name}: hasWarning = ${hasWarning}`);
			return hasWarning;
		});
		
		// 设置最终状态
		structureNumberInfo.status = hasAnyWarning;
		
		console.log(`警告检查完成: hasAnyWarning = ${hasAnyWarning}, 最终structureNumberInfo.status = ${structureNumberInfo.status}`);
	};

	onMounted(async () => {
		console.log('初始bridgeId:', bridgeIdFromURL.value);
		// 先确认URL参数是否已获取
		if (bridgeIdFromURL.value) {
			TaskBridgeId.value = bridgeIdFromURL.value;
		}
		 await init();
	});
</script>

<style scoped>
	.active {
		background-color: #0F4687;
		/* 选中项背景色 */
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
	
	.flagImage{
		position: absolute;
		top: 10rpx;
		left: 10rpx;
	}

	/* 侧边栏样式 */
	.sidebar {
		width: 190rpx;
		/* 修改为190rpx */
		background-color: #f5f5f5;
		border-right: 1rpx solid #eeeeee;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.second-sidebar {
		background-color: #fafafa;
		width: 190rpx;
		/* 修改为190rpx */
	}

	.treeName {
		margin-left: 20rpx;
		font-size: 15rpx;
	}

	.third-sidebar {
		width: 100%;
	}

	.rightcount {
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}

	.third-sidebar .sidebar-item {
		height: auto;
		padding: 15.5rpx 20rpx;
		/* 将上下内边距减小2.5rpx */
		border-bottom: 1px solid #eee;
		/* 将下方实线变粗 */
	}

	.third-sidebar .sidebar-item-content {
		width: 100%;
		font-size: 20rpx;
		color: #333;
		padding-left: 0;
		display: flex;
		justify-content: space-between;
		/* 使内容两端对齐 */
		align-items: center;
		/* 垂直居中 */
	}

	.item-name {
		flex-shrink: 0;
		/* 防止名字被压缩 */
		margin-right: 10rpx;
		/* 添加右侧间距 */
		color: #333;
	}

	.item-info-right {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 18rpx;
		margin-left: auto;
	}

	.counterNumber {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		min-width: 120rpx;
	}

	.item-quantity {
		font-size: 15rpx;
		margin-right: 10rpx;
		text-align: right;
		width: 100%;
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
		margin-left: 10rpx;
	}

	.desease {
		margin-left: 10rpx;
		font-size: 20rpx;
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
		margin-left: 10rpx;
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
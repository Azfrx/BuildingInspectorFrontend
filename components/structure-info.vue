<template>
	<view class="container">
		<!-- 结构信息状态栏 -->
		<view class="Title">
			<span class="text">结构信息状态 : </span>
			<span :style="{color: Number(safeTreeData?.status) === 3 ? '#f56c6c': '#333'}">
				{{ Number(safeTreeData?.status) === 3 ? '已锁定': '未锁定'}}
			</span>
		</view>
		
		<!-- 加载状态 -->
		<view v-if="isLoading" class="loading">
			<text>加载中...</text>
		</view>
		
		<!-- 三个侧边栏 -->
		<view v-else-if="isReady" class = "sidebar">
			<!-- 第一级侧边栏 -->
			<view class = 'sidebar-level1'>
				<!-- 遍历展示第一层的数据 -->
				<view v-for="(item1,index1) in (safeTreeData?.children || [])" :key="item1.id" @click = "changeTab(index1)" :class = "{active: safeMenuIndex[0] === index1}">
					<!-- menuIndex[0]记录了当前选中的菜单项索引 index1 是当前循环渲染菜单项的索引 你每次修改后menuIndex会变会触发遍历 index会找到更新的index然后高亮-->
					<!-- 给每个容器设置宽高 -->
					<view class = "box">
						<!-- 第一级菜单项的警告图片 -->
						<image v-if="item1.warnNumber > 0" src="@/static/image/warning.png"
							   class="warning-icon"  />
						{{item1.name}}
					</view>
				</view>
			</view>
			
			<!-- 第二级侧边栏 -->
			<view class = "sidebar-level2">
				<!-- 遍历展示第2层的数据 -->
				<view v-for="(item2,index2) in (safeTreeData?.children?.[safeMenuIndex[0]]?.children || [])" :key="item2.id" 
				@click = "changeTab(safeMenuIndex[0],index2)" :class = "{active: safeMenuIndex[1] === index2}">
					<!-- menuIndex[1]记录了第二级的菜单项索引 index2 是当前循环渲染菜单项的索引 你每次修改后menuIndex会变会触发遍历 index会找到更新的index然后高亮-->
					<!-- 给每个容器设置宽高 -->
					<view class = "box">
						<!-- 第二级菜单项的警告图片 -->
						<image v-if="item2.warnNumber > 0" src="@/static/image/warning.png"
							   class="warning-icon"  />
						{{item2.name}}
					</view>
				</view>
			</view>
			
			<!-- 第三级侧边栏 -->
			<view class = "sidebar-level3">
				<!-- 遍历展示第3层的数据 -->
				<view v-for="(item3,index3) in (safeTreeData?.children?.[safeMenuIndex[0]]?.children?.[safeMenuIndex[1]]?.children || [])" :key="item3.id"
				@click = "changeTab(safeMenuIndex[0],safeMenuIndex[1],index3)" :class = "{active2: safeMenuIndex[2] === index3}" class="fathercontentandbutton">
					<!-- menuIndex[2]记录了第3级的菜单项索引 index3 是当前循环渲染菜单项的索引 你每次修改后menuIndex会变会触发遍历 index会找到更新的index然后高亮-->
					<view class="content">
						
						<!-- 给每个容器设置宽高 -->
						<view class = "box3">
							<!-- 第三级菜单项的警告图片 -->
							<image v-if="(item3?.diseaseNumber || 0) > (item3?.count || 0)" src="@/static/image/warning.png"
								   class="warning-icon"  />
							{{item3.name}}
						</view>
						
						<!-- 右侧信息区 -->
						<view class="right">
							<!-- 内容 -->
							<view class="content-container">
								<text class="disease">
									<span class="dissease-count">病害构件数量</span>
									{{item3?.diseaseNumber ?? 0}}
								</text>
								<text class="component-count">
									<span class="count">构件数量</span>
									{{item3.count}}
								</text>
							</view>
							
							<!-- 图标 -->
							<view class="image-container">
								<image src="/static/image/RightOutline.svg" class="rightarrow" />
							</view>
							
						</view>
					</view>
						
					<!-- 第三级菜单项的按钮 -->
					<view class = "button" :class="{show: safeMenuIndex[2] === index3 && Number(safeTreeData?.status) !== 3}">
						<view class = "cancle" @click.stop="closeButton">取消</view>
						<view class = "confirm" @click = "open">编辑</view>
					</view>
				</view>
			</view>
			
			
			
		</view>
		
		<!-- 数据未准备好时的提示 -->
		<view v-else class="loading">
			<text>数据加载中，请稍候...</text>
		</view>
		
		<!-- 编辑弹窗 -->
		<!-- 通过ref属性实现对弹窗的启用或者关闭 -->
		<uni-popup ref="windowPopup" type="center">
			<view class="edit-container">
			<!-- 弹窗标题栏 -->	
				<view class="edit-title">构件信息编辑</view>
			<!-- 弹窗内容区 -->
				<view class="edit-content">
					<!-- 第一行构件名称 -->
					<view class="edit-content-first">
						<text class="edit-key">构件名称</text>
						<text class="edit-value1">{{componentName}}</text>
					</view>
					
					<!-- 第二行病害构件数量 -->
					<view class="edit-content-second">
						<text class="edit-key">病害构件数量</text>
						<text class="edit-value2">{{diseaseNumber}}</text>
					</view>
					
					<!-- 第三行构件数量 -->
					<view class="edit-content-third">
						<text class="edit-key">构件数量</text>
						<!--输入框 -->
						<view class="input-wrapper">
						    <input
						      class="input-text"
						      v-model="componentCount"
						      type="number"
						      placeholder="请输入数量"
						      placeholder-style="color: #CCCCCC;"
						    />
						    <image
						      src="/static/image/clear.png"
						      class="clear-icon"
						      @click="componentCount = ''"
						    />
						  </view>
					</view>
					
				</view>
			<!-- 按钮区域 -->
				<view class="edit-button">
					<button class="edit-button-cancel" @click = "close">取消</button>
					<button class="edit-button-confirm" @click = "setComponentCount()">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
//1.引入结构数据全局变量
import { onMounted, ref, watch, computed } from "vue";
import { useObject } from "@/store/object.js";
import { setObject } from "../utils/writeNew.js";
import { userStore } from '../store/index.js';
import { idStore } from '../store/idStorage.js';
import {getObjectUL} from "@/utils/readUL";
import {
		getObject
	} from '@/utils/readJsonNew.js'
//2.创建实例对象
const objectData = useObject();
const userInfo = userStore();
const idInfo = idStore();

// // 使用计算属性来响应式获取数据
// const treeData = computed(() => {
// 	const data = objectData.getData();
// 	// 每次获取数据时都重新计算警告状态
// 	if (data.children) {
// 		data.children.forEach(item1 => {
// 			if (item1.children) {
// 				item1.children.forEach(item2 => {
// 					checkSecondLevelWarning(item2);
// 				});
// 			}
// 			checkFirstLevelWarning(item1);
// 		});
// 	}
	
// 	// 检查页面警告状态并设置全局标志
// 	checkPageWarning();
	
// 	return data;
// })
  
const treeData = ref();
watch(
  () => treeData.value, // 监听 treeData 的变化
  (newData) => {
    // 当 treeData 变化时执行警告检查
    if (newData.children) {
      newData.children.forEach(item1 => {
        if (item1.children) {
          item1.children.forEach(item2 => {
            checkSecondLevelWarning(item2);
          });
        }
        checkFirstLevelWarning(item1);
      });
    }
    
    // 检查页面警告状态
    checkPageWarning();
  },
  { deep: true } // 深度监听，确保嵌套对象变化也能触发
);
//用数组存储索引下标,默认只选中前2项
const menuIndex = ref([0,0,-1])

// 确保menuIndex有安全的值
const safeMenuIndex = computed(() => {
  return menuIndex.value || [0, 0, -1]
})
//构件名称
const componentName = ref("")
//病害构件数量
const diseaseNumber = ref(0)
//构件数量
const componentCount = ref(0)
//通过这个变量控制第三级菜单项的按钮的显示
const buttonVisible = ref({})

// 添加加载状态
const isLoading = ref(true)

// 确保treeData有默认值
const safeTreeData = computed(() => {
  return treeData.value || { children: [], status: 0 }
})

// 检查组件是否准备好渲染
const isReady = computed(() => {
  return !isLoading.value && treeData.value && safeMenuIndex.value
})
//检查一级菜单下的三级菜单警告状态，并统计数量
const checkFirstLevelWarning = (item1) => {
	  if (!item1.children) {
	    item1.warnNumber = 0; // 初始化
	    return false;
	  }
	
	  // 统计有问题的二级菜单项数量
	  item1.warnNumber = item1.children.reduce((count, item2) => {
	    return count + (item2.warnNumber > 0 ? 1 : 0);
	  }, 0);
	
	  // 返回是否存在警告（warnNumber > 0）
	  return item1.warnNumber > 0;	
}
// 检查二级菜单下的三级菜单警告状态，并统计数量
const checkSecondLevelWarning = (item2) => {
  // 统计警告数量和判断是否有警告
  let warningCount = 0;        
  const hasWarning = item2.children.some(item3 => {
    const isWarning = (item3.diseaseNumber || 0) > (item3.count || 0);
    if (isWarning) warningCount++;
    return isWarning;
  });

  // 将统计结果赋值给二级菜单
  item2.warnNumber = warningCount;
  
  return hasWarning;
};

// 检查整个页面是否存在警告，并设置全局标志warning
const checkPageWarning = async () => {
  const data = objectData.getData();
  
  // 只遍历第一级菜单项
  if (data.children) {
    for (let item1 of data.children) {
      // 如果发现第一级菜单项的warnNumber > 0，直接设置标志并返回
      if (item1.warnNumber > 0) {
        data.warning = true;
        objectData.setData(data);
        return true;
      }
    }
  }
  
  // 没有找到警告，设置标志为false
  data.warning = false;
  await setObject(userInfo.username, idInfo.buildingId, data);
  return false;
};
//changeTab 动态更新索引值
const changeTab = (index1, index2, index3) => {
	// 如果系统处于锁定状态，提示用户并不进行任何操作
	if (Number(treeData.value?.status) === 3) {
		uni.showToast({
			title: '系统已锁定，无法编辑',
			icon: 'none',
			duration: 2000
		});
		return;
	}
  //有值就取index 没值就取默认值
  const currentMenuIndex = menuIndex.value || [0, 0, -1];
  menuIndex.value = [
    index1 !== undefined ? index1 : currentMenuIndex[0],
    index2 !== undefined ? index2 : currentMenuIndex[1],
    index3 !== undefined ? index3 : currentMenuIndex[2],
  ];
  // 当点击三级菜单时，设置该菜单按钮可见
    if (index3 !== undefined) {
      const key = `${index1}-${index2}-${index3}`;
      buttonVisible.value = { [key]: true }; // 只显示当前点击的按钮
    }
}
//初始化函数
const initData = ()=>{
//3.赋值结构树
treeData.value = objectData.getData();

// 初始化所有层级的警告状态
if (treeData.value?.children) {
  // 遍历所有第一级菜单项
  treeData.value.children.forEach(item1 => {
    // 先遍历所有第二级菜单项，计算它们的警告状态
    if (item1.children) {
      item1.children.forEach(item2 => {
        // 计算第二级菜单项的警告状态
        checkSecondLevelWarning(item2);
      });
    }
    
    // 再计算第一级菜单项的警告状态（基于已计算的第二级菜单项状态）
    checkFirstLevelWarning(item1);
  });
}
}

//控制弹窗的引用
const windowPopup = ref(null)

//打开弹窗的方法
const open = ()=>{
  //1.打开弹窗前先获取弹窗中的内容
  //根据menuIndex获取最新索引
  //获取数据
  const currentMenuIndex = menuIndex.value || [0, 0, -1];
  const data = treeData.value?.children?.[currentMenuIndex[0]]?.children?.[currentMenuIndex[1]]?.children?.[currentMenuIndex[2]]
  if (!data) {
    uni.showToast({
      title: '数据加载中，请稍后重试',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  //更新构件名称
  componentName.value = data.name;
  //更新病害构件数量
  diseaseNumber.value = data.diseaseNumber ?? 0;
  //更新构件数量
  componentCount.value = data.count;
  windowPopup.value.open();
}

// 关闭弹窗的方法
const close = () => {
 windowPopup.value.close()
}
// 添加关闭按钮的方法
const closeButton = () => {
  // 重置第三级菜单的选中状态
  const currentMenuIndex = menuIndex.value || [0, 0, -1];
  menuIndex.value = [currentMenuIndex[0], currentMenuIndex[1], -1];
}
//更新构件数量
const setComponentCount = async () =>{
	
	const currentData = objectData.getData();
	const currentMenuIndex = menuIndex.value || [0, 0, -1];
	if (!currentData?.children?.[currentMenuIndex[0]]?.children?.[currentMenuIndex[1]]?.children?.[currentMenuIndex[2]]) {
		uni.showToast({
			title: '数据加载中，请稍后重试',
			icon: 'none',
			duration: 2000
		});
		return;
	}
	
	currentData.children[currentMenuIndex[0]].children[currentMenuIndex[1]].children[currentMenuIndex[2]].count = componentCount.value;
	
	// 重新计算第二级菜单项的警告状态
	const currentItem2 = currentData.children[currentMenuIndex[0]].children[currentMenuIndex[1]];
	checkSecondLevelWarning(currentItem2);
	
	// 重新计算第一级菜单项的警告状态
	const currentItem1 = currentData.children[currentMenuIndex[0]];
	checkFirstLevelWarning(currentItem1);
	
	// 同时更新全局store中的数据
	objectData.setData(currentData);
	
	// 保存到本地文件系统
	await setObject(userInfo.username, idInfo.buildingId, currentData);
	
	// 最后检查整个页面的警告状态
	checkPageWarning();
	
	// 关闭弹窗
	close();
	//关闭按钮
	closeButton();
}
onMounted(async () => {
  try {
    uni.showLoading({
      title: '加载结构信息',
      mask: true
    });

    // 尝试从UL目录读取object.json
    console.log('尝试从UL目录读取object.json，参数:', userInfo.username, idInfo.buildingId);
    let structureData = await getObjectUL(userInfo.username, idInfo.buildingId);

    // 如果UL目录中没有有效数据，尝试从UD目录复制
    if (!structureData || !structureData.children || structureData.children.length === 0) {
      console.log("UL目录中没有找到有效的object.json数据，尝试从UD目录复制");
      
      const udData = await getObject(userInfo.username, idInfo.buildingId);
      console.log("udData0:", udData);
      
      if (udData && udData.children && udData.children.length > 0) {
        console.log("从UD目录读取到有效的object.json数据，准备复制到UL目录");
        
        udData.warning = false;
        udData.commit = 2;
        await setObject(userInfo.username, idInfo.buildingId, udData);
        console.log("udData:", udData);
        
        // 重新从UL目录读取数据
        structureData = await getObjectUL(userInfo.username, idInfo.buildingId);
      }
    }

    // 设置数据并计算警告状态
    objectData.setData(structureData);
    const data = objectData.getData();
    
    if (data?.children) {
      data.children.forEach(item1 => {
        if (item1.children) {
          item1.children.forEach(item2 => {
            checkSecondLevelWarning(item2);
          });
        }
        checkFirstLevelWarning(item1);
      });
    }

    // 检查页面警告状态
    await checkPageWarning();

    treeData.value = objectData.getData();
    isLoading.value = false;
    uni.hideLoading();
    uni.showToast({
      title: '加载完成',
      icon: 'success',
      duration: 1000
    });
    console.log("组件挂载完成");
    
  } catch (error) {
    console.error("加载数据失败:", error);
    isLoading.value = false;
    uni.hideLoading();
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none',
      duration: 1000
    });
  }
});
// onMounted(async () => {
// 	let structureData = null;
//     uni.showLoading({
//       title: '加载结构信息',
//       mask: true
//     });// 在跳转前，检查并复制数据从UD到UL目录
// 		try {
// 			console.log('尝试从UL目录读取object.json，参数:', userInfo.username, bridge.buildingId);
// 			// 尝试从UL目录读取数据
// 			structureData = await getObjectUL(userInfo.username, idInfo.buildingId);
// 			// 如果从UL目录读不到数据（没有数据或只有默认空数据）
// 			if (!structureData || !structureData.children || structureData.children.length === 0) {
// 				console.log("UL目录中没有找到有效的object.json数据，尝试从UD目录复制");

// 				// 从UD目录读取数据
// 				console.log('尝试从UD目录读取object.json，参数:', userInfo.username, idInfo.buildingId);
// 				const udData = await getObject(userInfo.username, idInfo.buildingId);
// 				console.log("udData0:", udData);
// 				if (udData && udData.children && udData.children.length > 0) {
// 					console.log("从UD目录读取到有效的object.json数据，准备复制到UL目录");

// 					// 将UD目录的数据保存到UL目录
// 					console.log('将object.json数据保存到UL目录，参数:', userInfo.username,idInfo.buildingId);
// 					udData.warning = false;
// 					udData.commit = 2
// 					await setObject(userInfo.username, idInfo.buildingId, udData);
// 					console.log("udData:", udData);
// 					console.log("object.json数据已从UD目录复制到UL目录");

// 					// 验证数据是否成功保存
// 					const verifyData = await getObjectUL(userInfo.username, idInfo.buildingId);
// 					if (verifyData && verifyData.children && verifyData.children.length > 0) {
// 						console.log("验证成功：object.json数据已正确保存到UL目录");
// 					} else {
// 						console.error("验证失败：object.json数据未能正确保存到UL目录");
// 					}
// 				} else {
// 					console.log("UD目录中也没有有效的object.json数据");
// 				}
// 			} else {
// 				  uni.showLoading({
// 				    title: '加载结构信息',
// 				    mask: true
// 				  });
// 				  objectData.setData(structureData);
// 				  console.log("objectData", objectData.getData());
// 				  const data = objectData.getData();
// 				  uni.showLoading({
// 				    title: '加载结构信息',
// 				    mask: true
// 				  });
// 				  // 每次获取数据时都重新计算警告状态
// 				 if (data?.children) {
// 				    data.children.forEach(item1 => {
// 				      if (item1.children) {
// 				        item1.children.forEach(item2 => {
// 				          checkSecondLevelWarning(item2);
// 				        });
// 				      }
// 				      checkFirstLevelWarning(item1);
// 				    });
// 				  }
// 				  uni.showLoading({
// 				    title: '加载结构信息',
// 				    mask: true
// 				  });
				
// 				  // 检查页面警告状态并设置全局标志
// 				  await checkPageWarning();
				
// 				  treeData.value = objectData.getData();
// 				  isLoading.value = false;
// 				  uni.showToast({
// 				    title: '加载完成',
// 				    icon: 'success',
// 				    duration: 2000
// 				  });
// 				  console.log("组件挂载完成");
// 				} catch (error) {
// 				  console.error("加载数据失败:", error);
// 				  isLoading.value = false;
// 				  uni.showToast({
// 				    title: '加载失败，请重试',
// 				    icon: 'none',
// 				    duration: 2000
// 				  });
// 				}
// 			}

//  //    const newData = await getObjectUL(userInfo.username, idInfo.buildingId);
// 	// console.log("结构信息数据",newData);
//  //    uni.showLoading({
//  //      title: '加载结构信息',
//  //      mask: true
//  //    });
//  //    objectData.setData(newData);
//  //    console.log("objectData", objectData.getData());
//  //    const data = objectData.getData();
//  //    uni.showLoading({
//  //      title: '加载结构信息',
//  //      mask: true
//  //    });
//  //    // 每次获取数据时都重新计算警告状态
//  //   if (data?.children) {
//  //      data.children.forEach(item1 => {
//  //        if (item1.children) {
//  //          item1.children.forEach(item2 => {
//  //            checkSecondLevelWarning(item2);
//  //          });
//  //        }
//  //        checkFirstLevelWarning(item1);
//  //      });
//  //    }
//  //    uni.showLoading({
//  //      title: '加载结构信息',
//  //      mask: true
//  //    });

//  //    // 检查页面警告状态并设置全局标志
//  //    await checkPageWarning();

//  //    treeData.value = objectData.getData();
//  //    isLoading.value = false;
//  //    uni.showToast({
//  //      title: '加载完成',
//  //      icon: 'success',
//  //      duration: 2000
//  //    });
//  //    console.log("组件挂载完成");
//  //  } catch (error) {
//  //    console.error("加载数据失败:", error);
//  //    isLoading.value = false;
//  //    uni.showToast({
//  //      title: '加载失败，请重试',
//  //      icon: 'none',
//  //      duration: 2000
//  //    });
//  //  }
//   // 初始化时计算属性会自动处理数据获取和警告状态计算
//   // 如果需要额外的初始化操作，可以在这里添加
// })
</script>

<style>
/*激活后的背景色 */
.active {
	background-color: #FFF;
	color:#0F4687;
	position: relative; 
}
/*使用伪元素添加竖线 */
.active::before {
    content: "";                /* 必需属性，定义伪元素的内容 */
    position: absolute;         
    top: 50%;                   /* 线的顶部对齐盒子中心 */
	transform: translateY(-50%); /* 将线移动一半 使两者中心对齐 */
    left: 0;                    
    width: 4rpx;                /* 线宽*/
    height: 48rpx;              /* 线高 - 调整为与容器匹配 */
    background-color: #0F4687;  /* 线色*/
}
/*第三个菜单项激活 文字不变色*/
.active2{
	background-color: #FFF;
	position: relative;
}
.container{
	width: 100%;
	display: flex;
	flex-direction: column;
}
.Title{
	padding: 20rpx 0;
	background-color: #BDCBE0;
	font-size: 20rpx;
}
.text{
	padding-left: 20rpx;
}
.sidebar{
	height:100%;
	/*菜单项中的元素 横向排列*/
	display: flex;
	flex-direction: row; 
	color:#333;
}
.sidebar-level1 {
  width: 140rpx; 
  background-color: #f5f5f5; 
  font-size: 15rpx;
  white-space:nowrap;/* 强制文本不换行*/
  text-align: center; /* 添加水平居中 */
  color:#333;
}
.sidebar-level2 {
	  width: 140rpx; 
	  font-size: 15rpx;
	  background-color: #fafafa; 
	  text-align: center;
	  white-space:normal;/* 允许换行*/
	  word-break: break-all;
}
.sidebar-level3 {
  flex: 1; position: relative; /* 为按钮提供定位参考 */
  background-color: #f5f5f5; 
  font-size: 20rpx;
}
.fathercontentandbutton{
	position: relative; /* 为按钮提供定位参考 */
	display: flex;           /* 新增：让容器成为flex容器 */
	align-items: stretch;     /* 新增：让子元素拉伸到父容器高度 */
}
.box{
  height: 90rpx; /* 固定高度 */
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding-left: 20rpx; /* 为图标预留空间 */
  position: relative; /* 为警告图标提供定位参考 */
}

/* 第一级菜单项的特殊样式 */
.sidebar-level1 .box {
  padding-left: 20rpx; /* 与第二级保持一致 */
}

/* 第一级菜单项文字左移 */
.sidebar-level1 .box {
  transform: translateX(-20rpx);
}
.box3{
  height:auto;
  padding:22rpx 20rpx;
  border-bottom:1px solid #eee;
  position: relative;
  padding-left: 20rpx; /* 确保与第一级和第二级保持一致 */
  transform: translateX(10rpx); /* 第三级菜单项文字整体右移 */
}
.button{
	position: absolute;
	top: 0;
	bottom: 0;
	right: -200rpx;
	transition: right 0.3s ease;
	display: flex;
	flex-direction: row;
	font-size: 20rpx;
	color: #fff;
	width: 160rpx;
	align-items: stretch;     /* 修改：从 center 改为 stretch */
}
/*将right设置为0 让按钮显示出来 */
.button.show {
  right: 0; 
}
.cancle{
	display: flex;
	width: 80rpx;
	background: #CCC;
	align-items: center;/*交叉轴对齐*/
	justify-content: center;/*主轴对齐 */
}
.confirm{
	display:flex;
	width: 80rpx;
	background: #1677ff;
	align-items: center;/*交叉轴对齐*/
	justify-content: center;/*主轴对齐 */
}
.content{
	display: flex;
	flex-direction: row;
	align-items: center;
	flex: 1;                
}
.content-container{
	font-size:15rpx ;
	display:flex;
	flex-direction: column;
	align-items: flex-end;
}
.right{
	display: flex;
	flex-direction: row;
	margin-left:auto;/*优先从右边找位置 */
}
.image-container{
	margin-left: 8rpx;
}
.rightarrow {
	height: 20rpx;
	width: 20rpx;
	align-items: center;/*相对于父容器的交叉轴垂直居中*/
	transform: translate(0, 6rpx); /* 微调箭头的位置 */
}
.edit-container{
	width: 500rpx;
	background-color: #fff;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
	overflow: hidden
}
.edit-title{
	font-size: 20rpx;
	text-align: center;
	background-color: #BDCBE0;
	height: 60rpx;
	color: #333;
	display: flex;   /*只有该容器为flex容器 下面的属性才会生效*/
	align-items: center;/*交叉轴对齐*/
	justify-content: center;/*主轴对齐 */
}
.edit-content{
	font-size: 20rpx;
	margin: 30rpx 30rpx;
	display: flex;
	flex-direction: column;
}
.edit-content-first{
	margin: 20rpx 30rpx;
	padding-bottom: 20rpx;
	
}
.edit-content-second{
	margin: 20rpx 30rpx;
	padding-bottom: 20rpx;
	
}
.edit-content-third{
	margin: 20rpx 30rpx;
	padding-bottom: 20rpx;
	display: flex;
	flex-direction: row;
	
}
.edit-key{
	color: #666;
	width: 150rpx;	
}
.edit-value1{
	flex: 1;
	margin-left:90rpx;
}
.edit-value2{
	flex: 1;
	margin-left:50rpx;
}
.input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.input-text {
  width: 100%;
  padding-right: 40rpx; /* 为图标预留空间 */
  padding-left: 20rpx;
  height: 40rpx;
  border: 1rpx solid #ccc;
  border-radius: 8rpx;
  box-sizing: border-box;
  font-size: 20rpx;
  transform: translateY(-10rpx);
}

.clear-icon {
  position: absolute;
  right: 10rpx;
  top: 50%;
  transform: translateY(-25rpx);
  width: 28rpx;
  height: 28rpx;
  opacity: 0.6;
}
.edit-button{
  display: flex;
  min-width: 80rpx;
  flex-direction: row;
  font-size:20rpx;
  height: 50rpx;
  padding: 0 30rpx 30rpx;
  margin-top: 10rpx;
  justify-content: space-between;
}
.edit-button-cancel{
	flex: 1;
	background-color: #fff;
	color: #0F4687;
	border: 1px solid #0F4687;
	margin-right: 20rpx;
	display: flex;
	align-items: center;     /* 垂直居中 */
	justify-content: center; /* 水平居中 */
	transform: translateY(-30rpx);  
}
.edit-button-confirm{
	flex: 1;
	background-color: #0F4687;
	color: #fff;
	display: flex;
	align-items: center;     /* 垂直居中 */
	justify-content: center; /* 水平居中 */
	transform: translateY(-30rpx);   
}
.warning-icon {
  position: absolute;
  left: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 13rpx;
  height: 13rpx;
}

/* 第三级菜单项的警告图标特殊样式 */
.box3 .warning-icon {
  left: 10rpx;
  transform: translateX(-10rpx) translateY(-7rpx); /* 抵消文字的右移并上移，与文字中心对齐 */
}

/* 第一级菜单项的警告图标左移 */
.sidebar-level1 .warning-icon {
  left: 30rpx;
}

/* 加载状态样式 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  font-size: 28rpx;
  color: #666;
}
</style>
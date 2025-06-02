<template>
	<view class="disease-container">
		<view class="search-add-container">
      <view class="view-search-bar">
        <uni-search-bar class="search-bar"  placeholder="搜索词" clearButton="none" cancelButton="none"
                            @confirm="search" />
      </view>

			<button class="add-button" @click="addNewDisease">新增病害</button>
		</view>

		<view class="content-layout">
			<!-- 左侧边栏 -->
			<view class="sidebar">
				<view 
					v-for="(item, index) in tabItems" 
					:key="index" 
					:class="['sidebar-item', activeTab === index ? 'active' : '']"
					@click="changeTab(index)"
				>
          <view class="sidebar-item-content">
            <text class="sidebar-item-text">{{item}}</text>
            <text class="sidebar-item-count">({{getTpyeItemCount(item)}})</text>
          </view>
				</view>
			</view>
			
			<!-- 右侧内容区 -->
			<view class="content">
				<disease-item 
					v-for="(item, index) in filteredDiseases" 
					:key="index" 
					:item="item"
					@delete="deleteDisease" 
				/>
				<view v-if="filteredDiseases.length === 0" class="placeholder">
					暂无数据
				</view>
			</view>
		</view>


	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { getDisease } from '../utils/readJsonNew.js';
import { setDisease } from '../utils/reviseNew.js';

// 数据
const tabItems = ref(['上部结构', '下部结构', '桥面系', '附属设施']);
const activeTab = ref(0);
const searchText = ref('');
const showAddPopup = ref(false);
const diseaseList = ref([]);

// 加载当前年份病害数据
const loadCurrentYearDiseaseData = async () => {
  try {
    const userId = '3';
    const buildingId = '39';
    const currentYear = new Date().getFullYear().toString();
    
    // 调用getDisease获取当前年份数据
    const yearData = await getDisease(userId, buildingId, currentYear);
    console.log(`获取到${currentYear}年病害数据:`, yearData);
    
    // 直接使用diseases数组
    if (yearData && yearData.diseases && yearData.diseases.length > 0) {
      diseaseList.value = yearData.diseases;
    } else {
      diseaseList.value = [];
    }
    
    console.log('病害数据加载完成:', diseaseList.value);
  } catch (error) {
    console.error('读取病害数据失败:', error);
    uni.showToast({
      title: '读取数据失败',
      icon: 'none'
    });
  }
};

// 添加新增病害数据的方法
const addNewDiseaseData = async (newDisease) => {
  try {
    console.log('接收到新增病害数据:', newDisease);
    // 将新病害数据添加到列表中
    diseaseList.value.push(newDisease);
    
    // 准备要保存的数据
    const userId = '3';
    const buildingId = '39';
    const currentYear = new Date().getFullYear().toString();
    
    // 构建要保存的数据对象
    const saveData = {
      year: parseInt(currentYear),
      buildingId: parseInt(buildingId),
      diseases: diseaseList.value
    };
    
    console.log('准备保存的数据:', saveData);
    
    // 调用setDisease方法保存数据
    await setDisease(userId, buildingId, currentYear, saveData);
    
    console.log('新增病害数据保存成功');
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('保存新增病害数据失败:', error);
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    });
  }
};

// 处理删除病害事件的方法
const handleDeleteDisease = async (deleteData) => {
  try {
    console.log('接收到删除病害事件:', deleteData);
    
    if (!deleteData || !deleteData.id) {
      console.error('删除数据无效');
      return;
    }
    
    // 在列表中查找病害数据
    const index = diseaseList.value.findIndex(item => item.id == deleteData.id);
    if (index === -1) {
      console.error('未找到要删除的病害数据:', deleteData.id);
      return;
    }
    
    // 标记为删除而不是从数组中移除
    diseaseList.value[index].isDelete = true;
    console.log(`病害ID:${deleteData.id}已标记为删除`);
    
    // 准备要保存的数据
    const userId = '3';
    const buildingId = '39';
    const currentYear = new Date().getFullYear().toString();
    
    // 构建要保存的数据对象
    const saveData = {
      year: parseInt(currentYear),
      buildingId: parseInt(buildingId),
      diseases: diseaseList.value
    };
    
    console.log('准备保存删除后的数据:', saveData);
    
    // 调用setDisease方法保存数据
    await setDisease(userId, buildingId, currentYear, saveData);
    
    console.log('删除标记保存成功');
  } catch (error) {
    console.error('保存删除标记失败:', error);
    uni.showToast({
      title: '删除失败',
      icon: 'none'
    });
  }
};

// 处理更新病害事件的方法
const handleUpdateDisease = async (updatedDisease) => {
  try {
    console.log('接收到更新病害事件:', updatedDisease);
    
    if (!updatedDisease || !updatedDisease.id) {
      console.error('更新数据无效');
      return;
    }
    
    // 在列表中查找病害数据
    const index = diseaseList.value.findIndex(item => item.id == updatedDisease.id);
    if (index === -1) {
      console.error('未找到要更新的病害数据:', updatedDisease.id);
      return;
    }
    
    // 更新病害数据
    diseaseList.value[index] = updatedDisease;
    console.log(`病害ID:${updatedDisease.id}已更新`);
    
    // 准备要保存的数据
    const userId = '3';
    const buildingId = '39';
    const currentYear = new Date().getFullYear().toString();
    
    // 构建要保存的数据对象
    const saveData = {
      year: parseInt(currentYear),
      buildingId: parseInt(buildingId),
      diseases: diseaseList.value
    };
    
    console.log('准备保存更新后的数据:', saveData);
    
    // 调用setDisease方法保存数据
    await setDisease(userId, buildingId, currentYear, saveData);
    
    console.log('更新数据保存成功');
  } catch (error) {
    console.error('保存更新数据失败:', error);
    uni.showToast({
      title: '更新失败',
      icon: 'none'
    });
  }
};

// 计算属性
const filteredDiseases = computed(() => {
	// 根据activeTab和searchText过滤disease列表
	const selectedType = tabItems.value[activeTab.value];
	
	return diseaseList.value.filter(item => {
		// 过滤掉已删除的记录
		if (item.isDelete === true) {
			return false;
		}
		
		// 按类型过滤 - 使用component.parentObjectName
		if (item.component?.parentObjectName !== selectedType) {
			return false;
		}
		
		// 如果有搜索关键词，再按关键词过滤
		if (searchText.value) {
			return item.description?.includes(searchText.value) || 
				   item.type?.includes(searchText.value);
		}
		
		return true;
	});
});

// 方法
const search = (e) => {
	// 搜索逻辑
	searchText.value = e.value;
	console.log('搜索内容:', e);
};

const changeTab = (index) => {
	activeTab.value = index;
};

const getTpyeItemCount = (type) => {
	// 根据type获取该类型的病害数量，排除已删除的项目
	return diseaseList.value.filter(item => 
    item.component?.parentObjectName === type && 
    item.isDelete !== true
  ).length;
};

const addNewDisease = () => {
	// 打开新增病害页面，不再传递类型参数
	uni.navigateTo({
		url: `/pages/add-disease/add-disease`
	});
};

const deleteDisease = (itemId) => {
	// 确认删除
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这条病害记录吗？',
		success: (res) => {
			if (res.confirm) {
				// 查找病害数据
				const index = diseaseList.value.findIndex(item => item.id === itemId);
				if (index !== -1) {
					// 标记为删除而不是直接从数组中移除
					diseaseList.value[index].isDelete = true;
					
					// 准备要保存的数据
					const userId = '3';
					const buildingId = '39';
					const currentYear = new Date().getFullYear().toString();
					
					// 构建要保存的数据对象
					const saveData = {
						year: parseInt(currentYear),
						buildingId: parseInt(buildingId),
						diseases: diseaseList.value
					};
					
					// 调用setDisease方法保存数据
					setDisease(userId, buildingId, currentYear, saveData)
						.then(() => {
							// 删除成功提示
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						})
						.catch(error => {
							console.error('保存删除标记失败:', error);
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							});
						});
				}
			}
		}
	});
};

// 组件挂载时
onMounted(() => {
  console.log('current-disease组件挂载，准备加载数据');
  // 加载数据
  loadCurrentYearDiseaseData();
  
  // 添加新增病害事件监听
  uni.$on('addNewDisease', addNewDiseaseData);
  
  // 添加删除病害事件监听
  uni.$on('deleteDisease', handleDeleteDisease);
  
  // 添加更新病害事件监听
  uni.$on('updateDisease', handleUpdateDisease);
});

// 组件卸载时
onUnmounted(() => {
  // 移除事件监听
  uni.$off('addNewDisease');
  uni.$off('deleteDisease');
  uni.$off('updateDisease');
});
</script>

<style scoped>
.disease-container {
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

.search-add-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0rpx;
	background-color: #BDCBE0;
	z-index: 1;
}

.view-search-bar{
  width: 63%;
}

.search-bar {
	flex: 1;
}

.add-button {
	margin-right: 24rpx;
	background-color: #0F4687;
	color: white;
	font-size: 15rpx;
	height: 40rpx;
	line-height: 30rpx;
	padding: 5rpx 10rpx;
}

/* 内容布局 */
.content-layout {
	display: flex;
	flex: 1;
	overflow: hidden;
}

/* 侧边栏样式 */

.sidebar {
  width: 16.67%;
  background-color: #f5f5f5;

  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  padding: 24rpx 0;
  text-align: center;
  color: #666;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 修改为 flex-start */

}
.sidebar-item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 修改为 flex-start */
  padding-left: 16rpx; /* 添加左内边距 */

}
.sidebar-item-text {
  font-size: 18rpx;
}
.sidebar-item-count {
  font-size: 15rpx;
  color: #999;
}

.sidebar-item.active {
  background-color: #ffffff;
}
.sidebar-item.active .sidebar-item-content{
  background-color: #ffffff;
  color: #0F4687;
  font-weight: bold;
  border-left: 4rpx solid #0F4687;
}



/* 内容区样式 */
.content {
	flex: 1;
	padding: 5rpx;
	overflow-y: auto;
	height: 100%;
	background-color: #ffffff;
}

.placeholder {
	text-align: center;
	color: #999;
	font-size: 28rpx;
	margin-top: 30rpx;
}

</style>
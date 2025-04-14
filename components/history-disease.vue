<template>
	<view class="disease-container">
		<view class="search-add-container">
      <view class="view-search-bar">
        <uni-search-bar class="search-bar"  placeholder="搜索词" clearButton="none" cancelButton="none"
                                                    @confirm="search" />
      </view>

      <view class="button-group">
        <button v-if="showCopyButton" class="copy-button" @click="copyDisease">复制为新病害</button>
        <button class="select-button" @click="toggleSelectMode">{{ isSelectMode ? '取消' : '选择' }}</button>
      </view>

		</view>
		
		<!-- 侧边栏布局 -->
		<view class="content-layout">
      <!--左侧边栏-->
      <view class="sidebar">
        <view
            v-for="(item, index) in tabItems"
            :key="index"
            :class="['sidebar-item', activeTab === index ? 'active' : '']"
            @click="changeTab(index)"
        >
          <view class="sidebar-item-content">
            <text class="sidebar-item-text">{{item}}年度</text>
            <text class="sidebar-item-count">({{getYearItemCount(item)}})</text>
          </view>
        </view>
      </view>
			
			<!-- 右侧内容区 -->
			<view class="content">
				<!-- 按结构类型分组显示 -->
				<view v-for="type in ['上部结构', '下部结构', '桥面系']" :key="type" class="type-group">
					<!-- 只有该类型有数据时才显示分组 -->
					<template v-if="getFilteredDiseasesByType(type).length > 0">
						<view class="type-header" @click="toggleTypeExpand(type)">
							<text>{{type}}</text>
							<text class="expand-icon">{{ expandedTypes[type] ? '▼' : '▶' }}</text>
						</view>
						<view v-show="expandedTypes[type]">
							<disease-item 
								v-for="(item, itemIndex) in getFilteredDiseasesByType(type)" 
								:key="itemIndex" 
								:item="item"
								:selectMode="isSelectMode"
								:selected="selectedItems.includes(item.id)"
								@select="handleItemSelect"
								@delete="deleteDisease"
								@swipe-opened="handleSwipeOpened"
								ref="diseaseItems"
							/>
						</view>
					</template>
				</view>
				
				<view v-if="filteredDiseases.length === 0" class="placeholder">
					暂无数据
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue';

// 组件名称 
defineOptions({
  name: "history-disease"
});

// 响应式状态
const tabItems = ref(['2024', '2023', '2022']);
const activeTab = ref(0);
const searchText = ref('');
const isSelectMode = ref(false);
const showCopyButton = ref(false);
const selectedItems = ref([]); // 存储选中项的ID
const currentOpenSwipe = ref(null);
const diseaseItems = ref(null);

// 病害列表数据
const diseaseList = ref([
  {
    id: '1',
    partType: 'T梁',
    partNumber: '3-2',
    disease: '剥落、掉角',
    description: '上部结构的T梁出现剥落情况',
    count: '2',
    collectTime: '2024-04-25 14:25:25',
    grade: '2',
    reference: '是',
    type: '上部结构'
  },
  {
    id: '2',
    partType: '墩柱',
    partNumber: '2-1',
    disease: '裂缝',
    description: '下部结构的墩柱出现裂缝',
    count: '2',
    collectTime: '2024-04-25 14:25:25',
    grade: '2',
    reference: '是',
    type: '下部结构'
  },
  {
    id: '3',
    partType: '桥面',
    partNumber: '1-3',
    disease: '破损',
    description: '桥面系出现破损',
    count: '3',
    collectTime: '2024-04-23 16:45:10',
    grade: '1',
    reference: '否',
    type: '桥面系'
  },
  {
    id: '4',
    partType: '墩柱',
    partNumber: '2-1',
    disease: '裂缝',
    description: '下部结构的墩柱出现裂缝',
    count: '1',
    collectTime: '2023-04-24 09:15:30',
    grade: '3',
    reference: '是',
    type: '下部结构'
  },
  {
    id: '5',
    partType: '桥面',
    partNumber: '1-3',
    disease: '破损',
    description: '桥面系出现破损',
    count: '3',
    collectTime: '2023-04-23 16:45:10',
    grade: '1',
    reference: '否',
    type: '桥面系'
  },
  {
    id: '6',
    partType: 'T梁',
    partNumber: '4-1',
    disease: '锈蚀',
    description: '上部结构的T梁出现锈蚀',
    count: '1',
    collectTime: '2022-04-22 11:30:45',
    grade: '2',
    reference: '是',
    type: '上部结构'
  },
  {
    id: '7',
    partType: 'T梁',
    partNumber: '3-3',
    disease: '剥落、掉角',
    description: '上部结构的T梁出现掉角情况',
    count: '2',
    collectTime: '2024-04-26 14:25:25',
    grade: '2',
    reference: '是',
    type: '上部结构'
  },
]);

// 展开状态
const expandedTypes = reactive({});

// 计算属性 - 过滤后的病害列表
const filteredDiseases = computed(() => {
  // 根据侧边栏选择的年份和搜索文本过滤disease列表
  const selectedYear = tabItems.value[activeTab.value];
  
  return diseaseList.value.filter(item => {
    // 先按年份过滤
    const itemYear = item.collectTime.substring(0, 4);
    if (itemYear !== selectedYear) {
      return false;
    }
    
    // 如果有搜索关键词，再按关键词过滤
    if (searchText.value) {
      return (item.title?.includes(searchText.value) || 
             item.description?.includes(searchText.value));
    }
    
    return true;
  });
});

// 删除病害
const deleteDisease = (itemId) => {
  // 确认删除
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条病害记录吗？',
    success: (res) => {
      if (res.confirm) {
        // 从列表中移除
        const index = diseaseList.value.findIndex(item => item.id === itemId);
        if (index !== -1) {
          diseaseList.value.splice(index, 1);
          
          // 删除成功提示
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    }
  });
};

// 切换选择模式
const toggleSelectMode = () => {
  isSelectMode.value = !isSelectMode.value;
  showCopyButton.value = isSelectMode.value;
  
  // 退出选择模式时清空选中项
  if (!isSelectMode.value) {
    selectedItems.value = [];
  }
};

// 处理项目选择
const handleItemSelect = (event) => {
  const { item, selected } = event;
  
  if (selected) {
    // 添加到选中数组
    if (!selectedItems.value.includes(item.id)) {
      selectedItems.value.push(item.id);
    }
  } else {
    // 从选中数组中移除
    const index = selectedItems.value.indexOf(item.id);
    if (index !== -1) {
      selectedItems.value.splice(index, 1);
    }
  }
  
  console.log('当前选中项:', selectedItems.value);
};

// 复制病害
const copyDisease = () => {
  if (selectedItems.value.length === 0) {
    uni.showToast({
      title: '请先选择要复制的病害',
      icon: 'none'
    });
    return;
  }
  
  // 这里实现复制逻辑
  uni.showToast({
    title: `复制了${selectedItems.value.length}个病害`,
    icon: 'none'
  });
};

// 搜索
const search = (e) => {
  // 搜索逻辑
  searchText.value = e.value;
  console.log('搜索内容:', e);
  closeAllSwipeActions();
  expandAllTypes();
};

// 切换选项卡
const changeTab = (index) => {
  activeTab.value = index;
  closeAllSwipeActions();
  expandAllTypes();
};

// 获取指定年份的项目数量
const getYearItemCount = (year) => {
  return diseaseList.value.filter(item => item.collectTime.substring(0, 4) === year).length;
};

// 按类型获取过滤后的病害列表
const getFilteredDiseasesByType = (type) => {
  const selectedYear = tabItems.value[activeTab.value];
  return diseaseList.value.filter(item => {
    const itemYear = item.collectTime.substring(0, 4);
    
    // 按年份和类型过滤
    if (itemYear !== selectedYear || item.type !== type) {
      return false;
    }
    
    // 如果有搜索关键词，还需按关键词过滤
    if (searchText.value) {
      return (item.title?.includes(searchText.value) || 
             item.description?.includes(searchText.value));
    }
    
    return true;
  });
};

// 处理滑动打开
const handleSwipeOpened = (itemId) => {
  // 关闭之前打开的swipe（如果有的话）
  closeSwipeExcept(itemId);
  // 更新当前打开的swipe
  currentOpenSwipe.value = itemId;
};

// 关闭所有滑动操作
const closeAllSwipeActions = () => {
  diseaseItems.value?.forEach(item => {
    item.closeSwipe && item.closeSwipe();
  });
  currentOpenSwipe.value = null;
};

// 关闭除特定项外的所有滑动操作
const closeSwipeExcept = (itemId) => {
  diseaseItems.value?.forEach(item => {
    if (item.item.id !== itemId && item.closeSwipe) {
      item.closeSwipe();
    }
  });
};

// 切换类型展开
const toggleTypeExpand = (type) => {
  expandedTypes[type] = !expandedTypes[type];
  closeAllSwipeActions();
};

// 展开所有类型
const expandAllTypes = () => {
  // 展开所有类型
  ['上部结构', '下部结构', '桥面系'].forEach(type => {
    expandedTypes[type] = true;
  });
};

// 初始化
// 相当于 created 生命周期
// Initialize all type groups as expanded
['上部结构', '下部结构', '桥面系'].forEach(type => {
  expandedTypes[type] = true;
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
  background-color: #BDCBE0;
  z-index: 1;
}
.view-search-bar{
  width: 63%;
}

.search-bar {
  flex: 1;
}

.button-group {
  display: flex;
  gap: 10rpx; /* 按钮间距 */
  margin-left: auto; /* 靠右对齐 */
}

.select-button {
  margin-right: 24rpx;
  background-color: #0F4687;
  color: white;
  font-size: 15rpx;
  height: 40rpx;
  line-height: 30rpx;
  padding: 5rpx 10rpx;
}


.copy-button {
  margin-right: 24rpx;
  background-color: #0F4687;
  color: white;
  font-size: 15rpx;
  height: 40rpx;
  line-height: 40rpx;
  padding: 0 10rpx;
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
  border-right: 1rpx solid #eeeeee;
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

.type-group {
  margin-bottom: 0rpx;
}

.type-header {
  height: 30rpx;
  font-size: 15rpx;
  font-weight: bold;
  background-color: #BDCBE0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rpx 10rpx;
  border-radius: 2rpx;
  color: #0F4687;
  border-bottom: 1rpx solid #0F4687;
  border-top: 1rpx solid #0F4687;
}

.expand-icon {
  margin-left: 5rpx;
  font-size: 12rpx;
  color: #666;
}
</style>
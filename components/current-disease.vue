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
import { ref, computed } from 'vue';

// 数据
const tabItems = ref(['上部结构', '下部结构', '桥面系']);
const activeTab = ref(0);
const searchText = ref('');
const showAddPopup = ref(false);
const diseaseList = ref([
	{
		id: '1',
    partType:'T梁',
    partNumber:'3-2',
    disease:'剥落、掉角',
		description: '上部结构的T梁出现剥落情况',
		count: '2',
		collectTime: '2024-04-25 14:25:25',
		length: 50,
		width: 20,
		grade: '2',
		reference: '是',
		type: '上部结构'
	},
	{
		id: '2',
    partType: '墩柱',
    partNumber:'2-1',
    disease: '裂缝',
		description: '下部结构的墩柱出现裂缝',
		count: '1',
		collectTime: '2024-04-24 09:15:30',
		grade: '3',
		reference: '是',
		type: '下部结构'
	},
	{
		id: '3',
    partType: '桥面',
    partNumber:'1-3',
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
    partType: 'T梁',
    partNumber:'2-1',
    disease: '锈蚀',
		description: '上部结构的T梁出现锈蚀',
		count: '1',
		collectTime: '2024-04-22 11:30:45',
		grade: '2',
		reference: '是',
		type: '上部结构'
	},
  {
    id: '5',
    partType: '墩身',
    partNumber:'2-1',
    disease: '空洞、孔洞',
    position: 'R21-1#桥墩,距墩顶0cm',
    area: '120×10cm²',
    description: '桥墩破损一处，距墩顶0cm，S=120×10cm²',
    count: '1',
    collectTime: '2024-04-23 11:30:45',
    grade: '1',
    reference: '是',
    type: '上部结构',
    imageUrl: '/static/image/disease.png'
  }
]);

// 计算属性
const filteredDiseases = computed(() => {
	// 根据activeTab和searchText过滤disease列表
	const selectedType = tabItems.value[activeTab.value];
	
	return diseaseList.value.filter(item => {
		// 先按类型过滤
		if (item.type !== selectedType) {
			return false;
		}
		
		// 如果有搜索关键词，再按关键词过滤
		if (searchText.value) {
			return item.title.includes(searchText.value) || 
				   item.description.includes(searchText.value);
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
	// 根据type获取该类型的病害数量
	return diseaseList.value.filter(item => item.type === type).length;
};

const addNewDisease = () => {
	// 打开新增病害页面
	uni.navigateTo({
		url: '/pages/add-disease/add-disease'
	});
};

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
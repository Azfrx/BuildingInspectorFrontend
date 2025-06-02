<template>
	<view class="container">
		<view class="content-layout">
			<!--左侧边栏-->
			<view class="sidebar">
				<view v-for="(item, index) in tabItems" :key="index"
					:class="['sidebar-item', activeTab === index ? 'active' : '']" @click="changeTab(index)">
					<view class="sidebar-item-content">
						{{item}}
					</view>
				</view>
			</view>

			<!-- 右侧内容区 -->
			<view class="content">
				<!--使用条件渲染显示不同组件 -->
				<!--行政识别数据 -->
				<administrative-identification-data
					v-if="activeTab === 0"
					:data="bridgeArchive.children[0].children">
				</administrative-identification-data>
				<!--桥梁技术指标-->
				<bridge-tech v-else-if="activeTab === 1" :data="bridgeArchive.children[1].children"></bridge-tech>
				<!--桥梁结构信息-->
				<bridge-structure v-else-if="activeTab === 2" :data="bridgeArchive.children[2].children"></bridge-structure>
				<!--桥梁档案资料-->
				<bridge-files v-else-if="activeTab === 3" :data="bridgeArchive.children[3].children"></bridge-files>
				<!--桥梁检测评定历史-->
				<bridge-inspection-history v-else-if="activeTab === 4" :data="bridgeArchive.children[4].children"></bridge-inspection-history>
				<!--养护处置记录-->
				<maintenance-records v-else-if="activeTab === 5" :data="bridgeArchive.children[5].children"></maintenance-records>
				<!--需要说明的事项-->
				<notes v-else-if="activeTab === 6" :data="bridgeArchive.children[6]"></notes>
				<!--其他-->
				<other-info v-else-if="activeTab === 7" :data="bridgeArchive.children[7]"></other-info>
			</view>
		</view>
	</view>
</template>


<script setup>
import {
  ref,
  watch, 
  onMounted
} from 'vue';
import { getProperty } from '../utils/readJsonNew.js';

// 本地状态，用于组件内部使用
const bridgeArchive = ref({
  children: [{}, {}, {}, {}, {}, {}, {}, {}]  // 初始化8个空对象，对应8个标签页
});
const tabItems = ref(['行政识别数据', '桥梁技术指标', '桥梁结构信息', '桥梁档案资料', '桥梁检测评定历史', '养护处置记录', '需要说明的事项', '其他']);
const activeTab = ref(0);

// 左侧导航栏选择
const changeTab = (index) => {
	activeTab.value = index;
};

// 组件挂载时直接获取数据
onMounted(async () => {
  try {
    // 直接调用getProperty方法获取数据，传入userId=3和buildingId=39
    const data = await getProperty('3', '39');
    console.log('获取到桥梁档案数据:', data);
    
    // 将获取的数据赋值给本地状态
    if (data && Object.keys(data).length > 0) {
      bridgeArchive.value = data;
    }
  } catch (error) {
    console.error('获取桥梁档案数据失败:', error);
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    });
  }
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
		text-align: left;
		color: #666;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 40rpx;
		/* 设置固定高度 */
		justify-content: center;
		/* 垂直居中内容 */
	}

	.sidebar-item-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-left: 12rpx;
		width: 60%;
		/* 占满整个宽度 */
		font-size: 18rpx;
		/* 统一字体大小 */
	}

	.sidebar-item.active {
		background-color: #ffffff;
	}

	.sidebar-item.active .sidebar-item-content {
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
</style>
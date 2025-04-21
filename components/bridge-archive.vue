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
					:data="bridgeArchive.administrativeIdentificationData">
				</administrative-identification-data>
				<!--桥梁技术指标-->
				<bridge-tech v-else-if="activeTab === 1" :data="bridgeArchive.bridgeTechnicalIndicators"></bridge-tech>
				<!--桥梁结构信息-->
				<bridge-structure v-else-if="activeTab === 2" :data="bridgeArchive.bridgeStructuralInfo"></bridge-structure>
				<!--桥梁档案资料-->
				<bridge-files v-else-if="activeTab === 3" :data="bridgeArchive.bridgeArchiveRecords"></bridge-files>
				<!--桥梁检测评定历史-->
				<bridge-inspection-history v-else-if="activeTab === 4" :data="bridgeArchive.bridgeInspectionHistory"></bridge-inspection-history>
				<!--养护处置记录-->
				<maintenance-records v-else-if="activeTab === 5" :data="bridgeArchive.maintenanceRecords"></maintenance-records>
				<!--需要说明的事项-->
				<notes v-else-if="activeTab === 6" :data="bridgeArchive.additionalNotes"></notes>
				<!--其他-->
				<other-info v-else-if="activeTab === 7" :data="bridgeArchive.additionalInfo"></other-info>
			</view>
		</view>
	</view>
</template>


<script setup>
import {
  ref,
  computed, onMounted
} from 'vue';
	// 数据
	const tabItems = ref(['行政识别数据', '桥梁技术指标', '桥梁结构信息', '桥梁档案资料', '桥梁检测评定历史', '养护处置记录', '需要说明的事项', '其他']);
	const activeTab = ref(0);
	//左侧导航栏选择
	const changeTab = (index) => {
		activeTab.value = index;
	};

const bridgeArchive = ref({
  administrativeIdentificationData: {},
  bridgeTechnicalIndicators: {},
  bridgeStructuralInfo: {},
  bridgeArchiveRecords: {},
  bridgeInspectionHistory: [],
  maintenanceRecords: [],
  additionalNotes:'',
  additionalInfo: {}
})

// 获取数据
const getData = () => {
  uni.request({
    url: '/static/data/bridgeArchive.json',
    method: 'GET',
    success: (res) => {
      console.log('获取数据成功:', res.data)
      bridgeArchive.value = res.data
    },
    fail: (err) => {
      console.error('获取数据失败:', err)
    }
  })
}

// 页面加载时获取数据
onMounted(() => {
  getData()
})


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
		border-right: 1rpx solid #eeeeee;
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
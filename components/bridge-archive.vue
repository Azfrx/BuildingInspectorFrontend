<!--桥梁卡片页面-->
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
				<administrative-identification-data v-if="activeTab === 0" :data="getComponentData('行政识别数据')">
				</administrative-identification-data>
				<!--桥梁技术指标-->
				<bridge-tech v-else-if="activeTab === 1" :data="getComponentData('桥梁技术指标')"></bridge-tech>
				<!--桥梁结构信息-->
				<bridge-structure v-else-if="activeTab === 2" :data="getComponentData('结构信息')"></bridge-structure>
				<!--桥梁档案资料-->
				<bridge-files v-else-if="activeTab === 3" :data="getComponentData('档案资料')"></bridge-files>
				<!--桥梁检测评定历史-->
				<bridge-inspection-history v-else-if="activeTab === 4"
					:data="getComponentData('检测评定历史')"></bridge-inspection-history>
				<!--养护处置记录-->
				<maintenance-records v-else-if="activeTab === 5"
					:data="getComponentData('养护处治记录')"></maintenance-records>
				<!--需要说明的事项-->
				<notes v-else-if="activeTab === 6" :data="getComponentData('需要说明的事项')"></notes>
				<!--其他-->
				<other-info v-else-if="activeTab === 7" :data="getComponentData('其他')"></other-info>
			</view>
		</view>
	</view>
</template>


<script setup>
	import {
		ref,
		watch,
		onMounted,
		computed
	} from 'vue';
	import {
		getDisease,
		getHistoryYear,
		getProperty
	} from '../utils/readJsonNew.js';
	import {
		saveBridgeImages,
		setProperty,
		saveBridgeImage
	} from "@/utils/writeNew";
	import {
		userStore
	} from "@/store";
	import {
		idStore
	} from "@/store/idStorage";

	const props = defineProps({
		activeTabTop: {
			type: Number,
			default: 0
		}
	})

	const userInfo = userStore()

	// 本地状态，用于组件内部使用
	const bridgeArchive = ref({
		children: [] // 初始化为空数组
	});
	const tabItems = ref(['行政识别数据', '桥梁技术指标', '桥梁结构信息', '桥梁档案资料', '桥梁检测评定历史', '养护处置记录', '需要说明的事项', '其他']);
	const activeTab = ref(0);

	const idStorageInfo = idStore();

	/*	watch(() => props.activeTabTop, (newval, oldval) => {
			if (newval == 5) {
				console.log('当前activeTabTop为：', newval) // 使用newval而不是activeTabTop
				loadDiseaseData();
			}
		})*/

	// 左侧导航栏选择
	const changeTab = (index) => {
		activeTab.value = index;
	};

	// 根据name获取对应的数据
	const getComponentData = (name) => {
		if (!bridgeArchive.value || !bridgeArchive.value.children) {
			return [];
		}

		// 特殊处理"桥梁所处行政区划代码"，将其归入"行政识别数据"的最前面
		if (name === '行政识别数据') {
			const adminData = bridgeArchive.value.children.find(item => item.name === '行政识别数据');
			const regionCode = bridgeArchive.value.children.find(item => item.name === '桥梁所处行政区划代码');

			if (adminData && adminData.children) {
				// 如果找到了行政识别数据和区划代码，返回合并后的数据（区划代码放在最前面）
				return regionCode ? [regionCode, ...adminData.children] : adminData.children;
			} else if (regionCode) {
				// 如果只找到了区划代码，返回包含区划代码的数组
				return [regionCode];
			}
		}

		// 对于其他组件，直接按name查找
		const item = bridgeArchive.value.children.find(item => item.name === name);
		return item && item.children ? item.children : [];
	};

	const readPropetryDataByJson = async () => {
		try {
			// 直接调用getProperty方法获取数据，传入username和buildingId
			const data = await getProperty(userInfo.username, idStorageInfo.buildingId);
			console.log('获取到桥梁档案数据:', data);

			// 将获取的数据赋值给本地状态
			if (data && Object.keys(data).length > 0) {
				bridgeArchive.value = data.property;
			}

		} catch (error) {
			console.error('本地json获取桥梁档案数据失败:', error);
		}
	};

	const loadDiseaseData = async () => {
		await readPropetryDataByJson();
	};

	// 组件挂载时直接获取数据
	onMounted(async () => {
		await loadDiseaseData();
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

	/* 手机端适配 */
	@media (max-width: 599px) {
		.sidebar {
			width: 18%;
		}

		.sidebar-item {
			height: 50rpx;
		}

		.sidebar-item-content {
			padding-left: 16rpx;
			font-size: 24rpx;
			width: auto;
		}
	}
</style>
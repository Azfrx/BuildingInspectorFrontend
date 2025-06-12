<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="tabs">
			<view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', activeTab === index ? 'active' : '']"
				@click="switchTab(index)">
				<view class="tab-item-text">
					{{ tab.name }}
				</view>
			</view>
			<!-- 滑动指示器 -->
			<view class="tab-indicator" :style="indicatorStyle"></view>
		</view>

		<!-- 内容区域 -->
		<view class="content">
			<view v-show="activeTab === 0">
				<!-- 当前病害内容 -->
				<current-disease></current-disease>
			</view>
			<view v-show="activeTab === 1">
				<!-- 历史病害内容 -->
				<history-disease></history-disease>
			</view>
      <view v-show="activeTab === 2">
        <!-- 桥梁卡片内容 -->
        <bridge-archive ref="bridgeArchiveRef" @dataLoaded="handleDataLoaded"></bridge-archive>
      </view>
			<view v-show="activeTab === 3">
				<!-- 正面立照内容 -->
				<front-photo :isDataLoaded="bridgeDataLoaded"></front-photo>
			</view>
			<view v-show="activeTab === 4">
				<!-- 结构信息内容 -->
				<structure-info></structure-info>
			</view>
		</view>
	</view>
</template>

<script setup>
	import currentDisease from '../../components/current-disease.vue';
	import historyDisease from '../../components/history-disease.vue';
	import bridgeArchive from '../../components/bridge-archive.vue';
	import structureInfo from '../../components/structure-info.vue';
	import frontPhoto from "@/components/front-photo.vue";
	import {
		ref,
		computed,
		onMounted,
		onUnmounted
	} from 'vue';

	// 定义导航标签
	const tabs = ref([{
			name: '当前病害',
		},
		{
			name: '历史病害',
		},
		{
			name: '桥梁卡片',
		},
		{
			name: '正立面照',
		},
		{
			name: '结构信息',
		}
	]);

	// 当前活动标签
	const activeTab = ref(0);
	// 桥梁数据是否已加载完成
	const bridgeDataLoaded = ref(false);
	// 桥梁卡片组件引用
	const bridgeArchiveRef = ref(null);

	// 切换标签的方法
	const switchTab = (index) => {
		activeTab.value = index;
	};

	// 处理桥梁卡片数据加载完成事件
	const handleDataLoaded = (loaded) => {
		console.log('接收到桥梁卡片数据加载完成事件:', loaded);
		bridgeDataLoaded.value = loaded;
	};

	// 计算滑动指示器的样式
	const indicatorStyle = computed(() => {
		const width = 100 / tabs.value.length;
		return {
			width: '50rpx', // 固定指示器宽度
			left: `calc(${width * activeTab.value}% + ${width/2}% - 25px)`, // 将指示器居中
			transform: 'none' // 移除transform
		};
	});

	// 组件挂载时
	onMounted(() => {
		console.log('bridge-disease页面挂载');
		
		// 如果直接切换到正立面照标签，需要确保桥梁卡片组件已经加载
		if (activeTab.value === 3) {
			// 先切换到桥梁卡片标签，触发数据加载
			activeTab.value = 2;
			// 延迟后再切回正立面照标签
			setTimeout(() => {
				activeTab.value = 3;
			}, 100);
		}
	});
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		/* height: 100vh; */
		height: calc(100vh - var(--window-top));
	}

	.tabs {
		display: flex;
		position: relative;
		height: 4.37%;
		background-color: #BDCBE0;
	}

	.tab-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #333333;
		font-size: 20rpx;
		position: relative;
		z-index: 1;
	}

	.tab-item.active {
		color: #0F4687;
		font-weight: 600;
	}

	.tab-item-text {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-item.active .tab-item-text {}

	.tab-indicator {
		position: absolute;
		bottom: 0;
		height: 3rpx;
		background-color: #0F4687;
		transition: all 0.3s;
	}

	.content {
		flex: 1;
		position: relative;
	}

	.placeholder {
		padding: 30rpx;
		text-align: center;
		color: #666;
		font-size: 28rpx;
	}
</style>
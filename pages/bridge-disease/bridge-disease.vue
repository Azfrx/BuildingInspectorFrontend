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
				<!-- 正面立照内容 -->
				<front-photo></front-photo>
			</view>
			<view v-show="activeTab === 3">
				<!-- 桥梁档案内容 -->
				<bridge-archive></bridge-archive>
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
		getBridge
	} from "@/utils/readJson.js";
	import {
		saveData,
		trackPath
	} from "@/utils/reviseJson.js";
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
			name: '正面立照',
		},
		{
			name: '桥梁卡片',
		},
		{
			name: '结构信息',
		}
	]);

	// 当前活动标签
	const activeTab = ref(0);

/*	// 存储桥梁数据 - 初始化为空对象
	const bridgeData = ref({
		currentDisease: [],
		historyDisease: [],
		frontFhoto: [],
		bridgeArchive: {},
		structureInfo: {}
	});*/

/*	// 组件引用
	const currentDiseaseRef = ref(null);

	// 加载数据函数
	const loadBridgeData = async () => {
		try {
			// 使用工具函数加载数据
			const data = await getBridge('3', '1', "G6911428222L1160");
			console.log('桥梁数据加载成功:', data);
			bridgeData.value = data;
		} catch (err) {
			console.error('桥梁数据加载失败:', err);
			uni.showToast({
				title: '数据加载失败',
				icon: 'none'
			});
		}
	};

	// 更新和保存数据函数
	const updateBridgeData = async (updatedDisease) => {
		try {
			console.log('更新单个病害数据:', updatedDisease);

			// 查找是否已存在该ID的病害
			const index = bridgeData.value.currentDisease.findIndex(item => item.id === updatedDisease.id);

			if (index !== -1) {
				// 更新已存在的病害
				console.log('更新已存在的病害，索引:', index);
				bridgeData.value.currentDisease.splice(index, 1, updatedDisease);
			} else {
				// 添加新病害
				console.log('添加新病害');
				bridgeData.value.currentDisease.push(updatedDisease);
			}

			// 保存更新后的数据
			const result = await saveData(bridgeData.value);

			console.log('桥梁数据保存成功, 结果:', result);
			return true;
		} catch (err) {
			console.error('桥梁数据保存失败:', err);
			uni.showToast({
				title: '数据保存失败',
				icon: 'none'
			});
			return false;
		}
	};

	// 处理删除病害
	const handleDeleteDisease = async (deleteData) => {
		try {
			console.log('接收到deleteDisease事件，数据：', deleteData);

			if (!deleteData || !deleteData.id) {
				console.error('删除数据无效');
				return false;
			}

			// 查找要删除的病害索引
			const index = bridgeData.value.currentDisease.findIndex(item => item.id === deleteData.id);

			if (index !== -1) {
				// 设置isDelete字段而不是真正删除
				bridgeData.value.currentDisease[index].isDelete = true;
				console.log('病害已标记为删除, ID:', deleteData.id);

				// 保存更新后的数据
				const result = await saveData(bridgeData.value);
				console.log('删除标记保存成功, 结果:', result);

				// 从视图中移除删除项
				// 这里可以通过更新视图或刷新数据来实现
				return true;
			} else {
				console.error('未找到要删除的病害, ID:', deleteData.id);
				return false;
			}
		} catch (err) {
			console.error('处理删除失败:', err);
			return false;
		}
	};

	// 处理添加新病害的方法
	const handleAddNewDisease = async (newDisease) => {
		try {
			console.log('接收到新病害数据:', newDisease);
			
			// 添加到当前病害数组
			bridgeData.value.currentDisease.push(newDisease);
			console.log('已添加病害到数组，当前长度:', bridgeData.value.currentDisease.length);
			
			// 保存更新后的数据
			const result = await saveData(bridgeData.value);
			
			console.log('新病害添加成功，保存结果:', result);
			return true;
		} catch (err) {
			console.error('添加新病害失败:', err);
			uni.showToast({
				title: '添加失败',
				icon: 'none'
			});
			return false;
		}
	};

	// 组件挂载时加载数据
	onMounted(() => {
		loadBridgeData();
		
		// 添加全局事件监听
		uni.$on('updateDisease', handleUpdateDisease);
		uni.$on('deleteDisease', handleDeleteDisease);
		uni.$on('addNewDisease', handleAddNewDisease);
		console.log('事件监听已设置');
	});
	
	// 组件卸载时移除事件监听器
	onUnmounted(() => {
		// 移除全局事件监听
		uni.$off('updateDisease', handleUpdateDisease);
		uni.$off('deleteDisease', handleDeleteDisease);
		uni.$off('addNewDisease', handleAddNewDisease);
		console.log('事件监听已移除');
	});*/

/*	// 处理病害更新事件
	const handleUpdateDisease = (diseaseData) => {
		console.log('接收到updateDisease事件，数据：', diseaseData);

		// 调用更新函数
		updateBridgeData(diseaseData).then(success => {
			if (success) {
				console.log('病害数据更新成功');
			} else {
				console.error('病害数据更新失败');
			}
		});
	};*/

	// 切换标签的方法
	const switchTab = (index) => {
		activeTab.value = index;
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
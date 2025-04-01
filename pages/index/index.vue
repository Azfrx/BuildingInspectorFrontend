<template>
	<view class="container">
		<!-- 顶部选择区域 -->
		<view class="header">
			<view class="select-row">
				<text class="label">任务名称:</text>
				<picker class="picker" :range="taskOptions" :value="taskIndex" @change="handleTaskChange">
					<view class="picker-text">{{ currentTask.center }}</view>
				</picker>
			</view>
			<view class="select-row">
				<text class="label">养护单位:</text>
				<picker class="picker" :range="unitOptions" :value="unitIndex" @change="handleUnitChange">
					<view class="picker-text">{{ currentTask.unit }}</view>
				</picker>
			</view>
		</view>

		<!-- 任务信息 -->
		<view class="task-info">
			<text class="task-title">{{ currentTask.center }}</text>
			<text class="task-date">{{ currentTask.dateRange }}</text>
			<text class="task-progress">未完成: {{ currentTask.unfinished }} / 任务数: {{ currentTask.total }}</text>
		</view>

		<!-- 桥梁列表 -->
		<view class="bridge-list">
			<view class="bridge-item" v-for="(bridge, index) in bridges" :key="index"
				@click="handleBridgeClick(bridge)">
				<view class="bridge-info">
					<text class="bridge-name">{{ bridge.name }}</text>
					<text class="bridge-code">桥梁编号：{{ bridge.code }}</text>
					<text class="bridge-range">桩号范围：{{ bridge.range }}</text>
					<text class="bridge-combination">跨径组合：{{ bridge.combination }}</text>
					<text class="bridge-length">桥梁长度：{{ bridge.length }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	// 响应式状态
	const taskIndex = ref(0)
	const unitIndex = ref(0)

	const taskData = [{
			center: '安塞养护中心',
			unit: '安塞管理所',
			dateRange: '2024-07-01 12:00:00 ~ 2024-10-01 12:00:00',
			unfinished: 20,
			total: 217,
			bridges: [{
					name: '蟠龙湾立交（E匝道桥EK0+130.755)左幅',
					code: 'G65610603Z1098(8615)',
					range: 'K469+104 ~ K469+192',
					combination: '18+26+20+18',
					length: '89m'
				},
				{
					name: '蟠龙湾1号中桥左幅',
					code: 'G65610603L1850(8609)',
					range: 'K469+494 ~ K469+560',
					combination: '3*20',
					length: '67m'
				},
				{
					name: '蟠龙湾1号中桥右幅',
					code: 'G65610603R1850(8610)',
					range: 'K469+511 ~ K469+577',
					combination: '3*20',
					length: '67m'
				}
			]
		},
		{
			center: '延川养护中心',
			unit: '延川管理所',
			dateRange: '2024-07-01 12:00:00 ~ 2024-10-01 12:00:00',
			unfinished: 15,
			total: 180,
			bridges: [{
				name: '延川特大桥',
				code: 'G65610604L1860(8620)',
				range: 'K470+100 ~ K470+300',
				combination: '30+5*40+30',
				length: '260m'
			}]
		},
		{
			center: '延长养护中心',
			unit: '延长管理所',
			dateRange: '2024-07-01 12:00:00 ~ 2024-10-01 12:00:00',
			unfinished: 18,
			total: 195,
			bridges: [{
				name: '延长1号大桥',
				code: 'G65610605L1870(8630)',
				range: 'K471+200 ~ K471+400',
				combination: '40+60+40',
				length: '140m'
			}]
		}
	]

	// 计算属性
	const currentTask = computed(() => {
		return taskData[taskIndex.value] || taskData[0]
	})

	const taskOptions = computed(() => {
		return taskData.map(item => item.center)
	})

	const unitOptions = computed(() => {
		return taskData.map(item => item.unit)
	})

	const bridges = computed(() => {
		return currentTask.value.bridges
	})

	// 方法
	const handleTaskChange = (e) => {
		const index = e.detail.value
		taskIndex.value = index
		unitIndex.value = index // 同步更新单位选择
	}

	const handleUnitChange = (e) => {
		const index = e.detail.value
		unitIndex.value = index
		taskIndex.value = index // 同步更新任务选择
	}

	const handleBridgeClick = (bridge) => {
		// 提取桥梁基本名称（去除左幅/右幅）
		let baseName = bridge.name
		if (baseName.includes('左幅') || baseName.includes('右幅')) {
			baseName = baseName.replace('左幅', '').replace('右幅', '')
		}

		const bridgeInfo = {
			...bridge,
			baseName: baseName.trim() // 添加基本名称用于标识同一座桥
		}

		uni.navigateTo({
			// url: `/pages/detail/detail?tab=1&bridgeInfo=${encodeURIComponent(JSON.stringify(bridgeInfo))}`
			url: '/pages/bridge-diseases/bridge-diseases'
		})
	}

	// 导出方法供模板使用
	defineExpose({
		handleTaskChange,
		handleUnitChange,
		handleBridgeClick
	})
</script>

<style>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		background-color: #2e8b57;
		padding: 20rpx;
		border-radius: 8rpx;
	}

	.select-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.select-row:last-child {
		margin-bottom: 0;
	}

	.label {
		color: white;
		font-size: 28rpx;
		margin-right: 20rpx;
	}

	.picker {
		flex: 1;
		background-color: white;
		padding: 10rpx 20rpx;
		border-radius: 4rpx;
	}

	.picker-text {
		font-size: 28rpx;
		color: #333;
	}

	.task-info {
		background-color: white;
		margin-top: 20rpx;
		padding: 20rpx;
		border-radius: 8rpx;
	}

	.task-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}

	.task-date {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 10rpx;
		display: block;
	}

	.task-progress {
		font-size: 26rpx;
		color: #2e8b57;
		display: block;
	}

	.bridge-list {
		margin-top: 20rpx;
	}

	.bridge-item {
		background-color: white;
		padding: 20rpx;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
	}

	.bridge-item:active {
		background-color: #f8f8f8;
	}

	.bridge-name {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.bridge-code,
	.bridge-range,
	.bridge-combination,
	.bridge-length {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 6rpx;
		display: block;
	}
</style>
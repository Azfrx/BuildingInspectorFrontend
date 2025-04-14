<template>
	<view class="container">
		<!-- 顶部信息卡片 -->
		<view class="info-card">
			<view class="content-box">
				<view class="title">{{projectInfo.projectName || '项目名称'}}</view>
				<view class="info-row">
					<text>项目编号: {{projectInfo.code}}</text>
					<text>检测状态: {{projectInfo.status}}</text>
				</view>
				<view class="info-row">
					<text>项目单位: {{projectInfo.company}}</text>
					<text>检测数量: {{projectInfo.progress}}</text>
				</view>
				<view class="info-row">
					<text>检测年度: {{projectInfo.year}}</text>
					<text>起止时间: {{projectInfo.timeRange}}</text>
				</view>
				<view class="info-row">
					<text>检测单位: {{projectInfo.detectionUnit}}</text>
				</view>
				<view class="info-row">
					<text>检测人员: {{projectInfo.inspector}}</text>
				</view>
			</view>
		</view>

		<!-- 搜索框 -->
		<view class="search-box">
			<text class="search-icon">&#xe654;</text>
			<input type="text" placeholder="搜索桥梁名称/编号/位置" v-model="searchText" @input="handleSearch"/>
		</view>

		<!-- 桥梁列表 -->
		<view class="bridge-list">
			<view class="bridge-item" v-for="bridge in filteredBridges" :key="bridge.id" @click="goToDetail(bridge)">
				<view class="bridge-icon">
					<image :src="getBridgeIcon(bridge.type)" mode="aspectFit"></image>
				</view>
				<view class="bridge-info">
					<view class="bridge-code">{{bridge.code}}</view>
					<view class="bridge-name">{{bridge.name}}</view>
					<view class="bridge-location">{{bridge.location}}</view>
				</view>
				<view class="bridge-meta">
					<text class="bridge-length">{{bridge.length}}</text>
					<text class="bridge-class">{{bridge.class}}类</text>
					<text class="arrow">></text>
				</view>
			</view>
			<!-- 无搜索结果提示 -->
			<view class="no-result" v-if="filteredBridges.length === 0">
				<text>未找到匹配的桥梁</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 项目信息
const projectInfo = ref({})
// 搜索文本
const searchText = ref('')
// 桥梁列表数据
const bridges = ref([])

// 获取当前页面参数
const getProjectId = () => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	return currentPage.$page?.options?.id || 'BG(YH)-2024004-MQI-02/53' // 默认项目编号
}

// 获取项目数据
const getProjectData = () => {
	const projectCode = getProjectId()
	console.log('当前项目编号:', projectCode)
	
	// 先尝试获取项目基本信息
	uni.request({
		url: '/static/data/1.json',
		success: (res1) => {
			console.log('获取到的项目列表:', res1.data)
			const projectBasic = res1.data.bridgeInspectionList.find(p => p.projectCode === projectCode)
			
			if (projectBasic) {
				// 更新项目基本信息
				projectInfo.value = {
					projectName: projectBasic.projectName,
					code: projectBasic.projectCode,
					status: projectBasic.status,
					company: projectBasic.company,
					progress: projectBasic.progress,
					year: res1.data.detectionYear,
					timeRange: '0000-00-00 至 0000-00-00',
					detectionUnit: res1.data.unit,
					inspector: res1.data.person
				}
				
				// 获取桥梁详细信息
				uni.request({
					url: '/static/data/list.json',
					success: (res2) => {
						console.log('获取到的桥梁数据:', res2.data)
						const project = res2.data.projects.find(p => p.code === projectCode)
						if (project) {
							bridges.value = project.bridges
							console.log('桥梁列表已更新:', bridges.value)
						} else {
							bridges.value = []
							console.error('未找到桥梁信息')
						}
					},
					fail: (err) => {
						console.error('获取桥梁数据失败:', err)
						uni.showToast({
							title: '获取桥梁数据失败',
							icon: 'none'
						})
					}
				})
			} else {
				console.error('未找到项目信息，projectCode:', projectCode)
				uni.showToast({
					title: '未找到项目信息',
					icon: 'none'
				})
			}
		},
		fail: (err) => {
			console.error('获取项目数据失败:', err)
			uni.showToast({
				title: '获取项目数据失败',
				icon: 'none'
			})
		}
	})
}

// 页面加载时获取数据
onMounted(() => {
	getProjectData()
})

// 根据桥梁类型获取对应图标
const getBridgeIcon = (type) => {
	const icons = {
		'small': '/static/image/bridge-small.png',
		'cross': '/static/image/bridge-cross.png',
		'arch': '/static/image/bridge-arch.png',
		'suspension': '/static/images/bridge-suspension.png',
		'main': '/static/image/bridge-arch.png',    // 暂时使用拱桥图标代替主线桥图标
		'ramp': '/static/image/bridge-cross.png'    // 暂时使用立交桥图标代替匝道桥图标
	}
	return icons[type] || icons['small']
}

// 跳转到详情页
const goToDetail = (bridge) => {
	uni.navigateTo({
		url: `/pages/bridge-disease/bridge-disease`
	})
}

// 根据搜索文本过滤桥梁列表
const filteredBridges = computed(() => {
	if (!searchText.value) {
		return bridges.value
	}
	const searchLower = searchText.value.toLowerCase()
	return bridges.value.filter(bridge => {
		return bridge.name.toLowerCase().includes(searchLower) ||
			   bridge.code.toLowerCase().includes(searchLower) ||
			   bridge.location.toLowerCase().includes(searchLower)
	})
})

// 处理搜索输入
const handleSearch = () => {
	console.log('搜索关键词:', searchText.value)
}
</script>

<style lang="scss">
@font-face {
	font-family: 'uniicons';
	src: url('/static/fonts/uniicons.ttf') format('truetype');
}

.container {
	min-height: 100vh;
	background-color: #f1f0ff;
	padding-bottom: 20px;
}

.info-card {
	background-color: #bdcbe0;
	padding: 12px;
	margin: 0;
	border-radius: 0;
	box-shadow: none;

	.content-box {
		background-color: transparent;
		border: 1px solid #0f4687;
		border-radius: 4px;
		padding: 10px;

		.title, .info-row {
			color: #333;
		}
	}

	.title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 8px;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		margin-top: 6px;
		font-size: 14px;

		text {
			line-height: 1.4;
		}
	}
}

.search-box {
	margin: 0;
	padding: 10px;
	background-color: #bdcbe0;
	border-radius: 0;
	border-top: 1px solid rgba(255,255,255,0.2);
	position: relative;
	
	.search-icon {
		position: absolute;
		left: 20px;
		top: 50%;
		transform: translateY(-50%);
		font-family: 'uniicons';
		color: #999;
		font-size: 16px;
		z-index: 1;
		height: 16px;
		line-height: 1;
	}
	
	input {
		width: 100%;
		height: 36px;
		padding: 0 10px 0 35px;
		border: 1px solid rgba(0,0,0,0.1);
		border-radius: 4px;
		font-size: 14px;
		background-color: #fff;
	}
}

.bridge-list {
	.bridge-item {
		display: flex;
		align-items: center;
		padding: 15px;
		background-color: #fff;
		margin-bottom: 1px;

		.bridge-icon {
			width: 50px;
			height: 50px;
			margin-right: 15px;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.bridge-info {
			flex: 1;
			
			.bridge-code {
				font-size: 14px;
				color: #666;
				margin-bottom: 4px;
			}

			.bridge-name {
				font-size: 16px;
				color: #333;
				margin-bottom: 4px;
			}

			.bridge-location {
				font-size: 14px;
				color: #999;
			}
		}

		.bridge-meta {
			text-align: right;
			margin-left: 10px;

			.bridge-length {
				font-size: 16px;
				color: #333;
				display: block;
			}

			.bridge-class {
				font-size: 14px;
				color: #666;
				display: block;
			}

			.arrow {
				color: #999;
				margin-left: 5px;
			}
		}
	}
}

.no-result {
	padding: 20px;
	text-align: center;
	color: #999;
	font-size: 14px;
}

.search-box {
	margin: 0;
	padding: 10px;
	background-color: #bdcbe0;
	border-radius: 0;
	border-top: 1px solid rgba(255,255,255,0.2);
	position: relative;
	
	input {
		background-color: #fff;
		border-radius: 4px;
		padding: 8px 10px 8px 35px;
		font-size: 14px;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #0f4687;
		
		&::placeholder {
			color: #999;
		}
	}
	
	.search-icon {
		position: absolute;
		left: 20px;
		top: 50%;
		transform: translateY(-50%);
		font-family: 'uniicons';
		color: #999;
		font-size: 16px;
		z-index: 1;
		height: 16px;
		line-height: 1;
	}
}
</style>

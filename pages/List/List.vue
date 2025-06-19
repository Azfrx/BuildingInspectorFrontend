<!-- 
 任务列表
 author:ykx
 date：2025.6.3
 Bug 6
 -->
<template>
	 <view class="container">
	   <!-- 顶部信息卡片 -->
	    <view class="info-card">
			 <view class="content-box">
				  <view class="title">{{currentProject.name || '项目名称'}}</view>
				  <view class="info-row">
				    <text>项目编号: {{currentProject.code || ''}}</text>
				    <text>检测状态: {{currentProject.status === '0' ? '未完成' : currentProject.status === '1' ? '已完成' : ''}}</text>
				  </view>
				  <view class="info-row">
				    <text>项目单位: {{currentProject.ownerDept?.deptName || ''}}</text>
				    <text>检测数量: {{initTaskData?.data?.tasks?.length || 0}}</text>
				  </view>
				  <view class="info-row">
				    <text>检测年度: {{currentProject.year || ''}}年度</text>
				    <text>起止时间: {{currentProject.createTime || ''}}</text>
				  </view>
				  <view class="info-row">
				    <text>检测单位: {{currentProject.dept?.deptName || ''}}</text>
				  </view>
				  <view class="info-row">
				    <text>检测人员: {{currentProject.inspectors ? currentProject.inspectors.map(inspector => inspector.userName).join('/') : ''}}</text>
				  </view>
			 </view>
		</view>
		
		<!-- 搜索框 -->
			<view class="search-box">
			    <text class="search-icon">&#xe654;</text>
			    <input type="text" placeholder="搜索桥梁名称/编号/位置" v-model="searchText" @input="handleSearch"/>
			</view>
		<!-- 桥梁任务列表 -->
		<view class="bridge-list">
			<view class="bridge-item" v-for="bridge in filteredBridges" :key="bridge.id" @click="goToDetail(bridge)">
				<view class="bridge-icon">
				    <image :src="getBridgeIcon(bridge.building.bridgeType)" mode="aspectFit"></image>
				</view>
				<view class="bridge-info">
				    <view class="bridge-code">{{bridge.building.buildingCode}}</view>
				    <view class="bridge-name">{{bridge.building.name}}</view>
				    <view class="bridge-location">  {{ 
				        (bridge?.building?.routeCode || '') + '/' + 
				        (bridge?.building?.routeName || '') + '/' + 
				        (bridge?.building?.bridgePileNumber || '') 
				            }}
					</view>
				</view>
				<view class="bridge-meta">
					<view class="text-group">
						 <text class="bridge-length">{{bridge.building.bridgeLength}}m</text>
						 <text class="bridge-class">{{bridge.building?.bridgeRank||'/'}}类</text>
					</view>
					<image src="/static/image/RightOutline.svg"/>
				</view>
			</view>
		</view>
		 <!-- 无搜索结果提示 -->
		    <view class="no-result" v-if="filteredBridges.length === 0">
		        <text>未找到匹配的桥梁</text>
		    </view>
	 </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getProject, getTask,} from '@/utils/readJsonNew.js'
import { setTask } from '../../utils/writeNew'
import {userStore} from '@/store/index.js'
import { idStore } from '../../store/idStorage'
// 返回上一页
const back = () => {
	uni.navigateBack()
}

// 项目信息
const projectInfo = ref({})
// 搜索文本
const searchText = ref('')
// 桥梁列表数据
const bridges = ref([])
const projectId = ref(2)
const initData = ref(null);
const initTaskData= ref(null)
const taskBridgeId = ref(0);
const userInfo = userStore()
const idInfo = idStore()
const projects = ref(null)
 const tasks = ref([])
// 初始化时获取projectId参数
const getURLParams = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const options = currentPage.$page?.options;
    
    if (options && options.projectId) {
      projectId.value = options.projectId;
      console.log('接收到的项目ID:', projectId.value);
    } else {
      console.log('未接收到项目ID，使用默认值:', projectId.value);
    }
  }
};

//初始化数据
const init = async () => {
  // 先确保已经获取了URL参数
  getURLParams();
   projectInfo.value = await getProject(userInfo.username)
   initTaskData.value = await getTask(userInfo.username,projectId.value)
  console.log("project",projects.value);
  console.log("task",tasks.value)
};

// 页面加载时获取数据
onMounted(() => {
  getURLParams();
  // 然后再调用init或其他初始化函数
  init();
})
// 添加计算属性来获取当前项目
const currentProject = computed(() => {
  if (!projectInfo.value || !projectInfo.value.data || !projectInfo.value.data.projects) {
    return {};
  }
  
  // 查找与当前projectId匹配的项目
  const project = projectInfo.value.data.projects.find(p => p.id == projectId.value);
  return project || projectInfo.value.data.projects[0] || {}; // 如果找不到，返回第一个项目或空对象
});
// 根据桥梁类型获取对应图标
//Bug3 ---图标的对应规则未知
const getBridgeIcon = (type) => {
	const icons = {
		'2': '/static/image/bridge1.png', //拱桥
		'1': '/static/image/bridge2.png', //梁式桥
		'4': '/static/image/bridge3.png',//斜拉桥
		'3': '/static/images/bridge4.png', //悬索桥
	}
	return icons[type] || icons['arch']
}

// 跳转到详情页
const goToDetail = (bridge) => {
	// 将buildingId存储到store中
	idInfo.setBuildingId({value: bridge.buildingId});
	
	// 导航到桥梁疾病页面
	uni.navigateTo({
		url: `/pages/bridge-disease/bridge-disease?bridgeId=${bridge.buildingId}`
	});
}

// 根据搜索文本过滤桥梁列表
const filteredBridges = computed(() => {
	if (!initTaskData.value || !initTaskData.value.data || !initTaskData.value.data.tasks) {
		return [];
	}
	
	if (!searchText.value) {
		return initTaskData.value.data.tasks;
	}
	
	const searchLower = searchText.value.toLowerCase();
	return initTaskData.value.data.tasks.filter(bridge => {
		return (bridge.building?.name && bridge.building.name.toLowerCase().includes(searchLower)) ||
			   (bridge.building?.buildingCode && bridge.building.buildingCode.toLowerCase().includes(searchLower)) ||
			   (bridge.building?.routeName && bridge.building.routeName.toLowerCase().includes(searchLower)) ||
			   (bridge.building?.bridgePileNumber && bridge.building.bridgePileNumber.toLowerCase().includes(searchLower));
	});
})

// 处理搜索输入
const handleSearch = () => {
	console.log('搜索关键词:', searchText.value);
	// 由于使用了计算属性filteredBridges，无需在这里手动过滤
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background-color: #f1f0ff;
	padding: 0;
	margin: 0;
}

.uni-nav-bar {
	height: 88px;
	font-size: 34px;
	font-weight: bold;
	margin-bottom: 0;
}

::v-deep .uni-nav-bar__content {
	font-size: 34px;
	font-weight: bold;
}

::v-deep .uni-nav-bar__header-container-inner {
	font-size: 34px;
	font-weight: bold;
}

.info-card {
	background-color: #bdcbe0;
	padding: 12px;
	margin: 0;
	border-radius: 0;
	box-shadow: none;
	margin-top: 0px;

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
@font-face {
  font-family: 'uniicons';
  src: url('/static/fonts/uniicons.ttf') format('truetype');
}

.uniicons {
  font-family: 'uniicons';
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
				font-size: 15rpx;
				color: #666;
				margin-bottom: 4px;
			}

			.bridge-name {
				font-size: 20rpx;
				color: #333;
				margin-bottom: 4px;
			}

			.bridge-location {
				font-size: 15rpx;
				color: #999;
			}
		}

		.bridge-meta {
			text-align: right;
			margin-left: 10px;
			display: flex;
			align-items: center;

			.text-group {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				margin-right: 8px;
			}

			.bridge-length {
				font-size: 18rpx;
				color: #333;
				display: block;
				margin-bottom: 4px;
			}

			.bridge-class {
				font-size: 14px;
				color: #666;
				display: block;
			}

			image {
				width: 20rpx;
				height: 20rpx;
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

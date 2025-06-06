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
				<view class="title">{{projectInfo.data.projects[0].name || '项目名称'}}</view>
				<view class="info-row">
					<text>项目编号: {{projectInfo.data.projects[0].code}}</text>
					<text>检测状态: {{projectInfo.data.projects[0].status}}</text>
				</view>
				<view class="info-row">
					<text>项目单位: {{projectInfo.data.projects[0].ownerDept.deptName}}</text>
					<!-- Bug4  向后端要求增加字段number 接口为：根据用户id查询项目id-->
					<!-- <text>检测数量: {{projectInfo.data.projects[0].number}}</text> -->
					<!-- 这里逻辑还没处理 -->
					<text>检测数量: {{26}}</text>
				</view>
				<view class="info-row">
					<text>检测年度: {{projectInfo.data.projects[0].year}}年度</text>
					<text>起止时间: {{projectInfo.data.projects[0].createTime}}</text>
				</view>
				<view class="info-row">
					<text>检测单位: {{projectInfo.data.projects[0].dept.deptName}}</text>
				</view>
				<view class="info-row">
					<!-- Bug5 这里检测人员怎么填 -->
					<!-- <text>检测人员: {{projectInfo.inspector}}</text> -->
					<text>检测人员: {{'zhang闪闪/李四四/王五五/赵六六'}}</text>
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
			<view class="bridge-item" v-for="bridge in initData.data.tasks" :key="bridge.id" @click="goToDetail(bridge)">
				<view class="bridge-icon">
					<image :src="getBridgeIcon(bridge.type)" mode="aspectFit"></image>
				</view>
				<view class="bridge-info">
					<view class="bridge-code">{{bridge.building.buildingCode}}</view>
					<view class="bridge-name">{{bridge.building.name}}</view>
					<view class="bridge-location">  {{ 
						(bridge?.building?.routeCode || '') + '/' + 
						(bridge?.building?.routeName || '') + '/' + 
						(bridge?.building?.bridgePileNumber || '') 
					}}</view>
				</view>
				<view class="bridge-meta">
					<view class="text-group">
						<text class="bridge-length">{{bridge.building.bridgeLength}}</text>
						<!-- Bug 6 这个类前面的数字是哪个字段-->
						<!--<text class="bridge-class">{{bridge.class}}类</text> -->
						<text class="bridge-class">{{2}}类</text>
					</view>
					<image src="/static/image/RightOutline.svg"/>
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
import { getProject, getTask,getUser } from '@/utils/readJsonNew.js'
import { setTask } from '../../utils/writeNew'

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
//项目id Bug
const projectId = ref(2)

const initData = ref(null);
//初始化数据
const init = async () => {
  // 获取全局文件
  let AllUserInfo = await getUser(1);
  // 获取全局文件中的属性
  console.log('AllUserInfo', AllUserInfo);
  let token = AllUserInfo.token;
  console.log('Cleaned token:', token); // 确认处理后的格式
  const getData = async () => {
    try {
      const response = await uni.request({
		  //Bug1 这里的项目id是写死的
        url: `http://60.205.13.156:8090/api/project/${projectId.value}/task`,
        method: 'GET',
        header: {
          'Authorization': `${token}` 
        }
      });
      console.log('获取到的任务数据:', response.data);
      if (response.data.code === 0) {
        initData.value = response.data;
		//调用接口将数据存在本地(Task)
		//Bug2  projectId的问题同上
		setTask(1,projectId.value,initData)
      } else {
        uni.showToast({
          title: response.data.msg || '获取数据失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取任务数据失败:', error);
      uni.showToast({
        title: '获取数据失败，请稍后重试',
        icon: 'none'
      });
    }
  };

  await getData();
  //Bug3 userId写死的
  projectInfo.value = await getProject(1);
  console.log('项目数据111',projectInfo.value)
};

// 页面加载时获取数据
onMounted(async () => {
  await init();
})

// 根据桥梁类型获取对应图标
//Bug3 ---图标的对应规则未知
const getBridgeIcon = (type) => {
	const icons = {
		'small': '/static/image/bridge1.png',
		'cross': '/static/image/bridge2.png',
		'arch': '/static/image/bridge3.png',
		'suspension': '/static/images/bridge4.png',
		'main': '/static/image/bridge1.png',    // 暂时使用拱桥图标代替主线桥图标
		'ramp': '/static/image/bridge2.png'    // 暂时使用立交桥图标代替匝道桥图标
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

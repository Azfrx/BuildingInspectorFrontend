<template>
	<view class="container">

		<view class="bridge-info">
			<view class="bridge-info-content">
				<view class="bridge-info-content-left">
					<view class="bridge-info-content-left-title">{{bridgeName}}</view>
					<view class="bridge-info-content-left-content">
						{{bridgeCode}}/{{routeCode}}/{{routeName}}/{{bridgePileNumber}}
					</view>
				</view>
				<view class="bridge-info-content-right">
					<button class="submit-button" @click="submitZip" :disabled="!submitButtonEnabled">提交检测按钮</button>
				</view>
			</view>
		</view>
		<!-- 顶部导航栏 -->
		<view class="tabs">
			<view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', activeTab === index ? 'active' : '']"
				@click="switchTab(index)">
				<view class="tab-item-text">
					{{ tab.name }}
					<image v-if="(index === 0 && diseaseSubmitStatus === 0)" src="/static/image/red.png"
						class="red-icon"></image>
					<image v-if="(index === 0 && diseaseSubmitStatus === 2)" src="/static/image/yellow.png"
						class="yellow-icon"></image>
					<image v-if="(index === 2 && frontPhotoSubmitStatus === 0)" src="/static/image/red.png"
						class="red-icon"></image>
					<image v-if="(index === 3 && currentPhotoSubmitStatus === 0)" src="/static/image/red.png"
						class="red-icon"></image>
				</view>
			</view>
			<!-- 滑动指示器 -->
			<view class="tab-indicator" :style="indicatorStyle"></view>
		</view>

		<!-- 内容区域 -->
		<view class="content">
			<view v-show="activeTab === 0">
				<!-- 当前病害内容 -->
				<current-disease :activeTabTop="activeTab"></current-disease>
			</view>
			<view v-show="activeTab === 1">
				<!-- 历史病害内容 -->
				<history-disease :activeTabTop="activeTab"></history-disease>
			</view>
			<view v-show="activeTab === 2">
				<!-- 正面立照内容 -->
				<front-photo :activeTabTop="activeTab"></front-photo>
			</view>
			<view v-show="activeTab === 3">
				<!-- 现状照 -->
				<current-photo :activeTabTop="activeTab"></current-photo>
			</view>
			<view v-show="activeTab === 4">
				<!-- 结构信息内容 -->
				<structure-info :activeTabTop="activeTab"></structure-info>
			</view>
			<view v-show="activeTab === 5">
				<!-- 桥梁卡片内容 -->
				<bridge-archive :activeTabTop="activeTab"></bridge-archive>
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
	import CurrentPhoto from "@/components/current-photo.vue";
	import {
		getTask,
		isUnFinishDisease,
		getFrontPhoto,
		readDiseaseCommit
	} from "@/utils/readJsonNew";
	import {
		readWarning
	} from "@/utils/warning";
  import {
    saveBridgeZip,
  } from "@/utils/writeNew";
	import {
		setFrontPhotoCommited
	} from "@/utils/frontPhoto";
	import {
		readCommit,
		setCommit1
	} from "@/utils/CurrentPhoto";
	import {
		isBuildingCommited,
		setBuildingCommitted
	} from "@/utils/isBuildingCommited";
	import {
		userStore
	} from "@/store";
	import {
		idStore
	} from "@/store/idStorage";
  import {getObjectUL} from "@/utils/readUL";
  import {useObject} from "@/store/object";

	const idStorageInfo = idStore();
	const userInfo = userStore();
  const objectInfo = useObject();

	// 控制提交按钮是否可点击
	const submitButtonEnabled = ref(false);

	const bridgeName = ref('');
	const bridgeCode = ref('');
	const bridgePileNumber = ref('');
	const routeCode = ref('');
	const routeName = ref('');

	// 定义导航标签
	const tabs = ref([{
			name: '当前病害',
		},
		{
			name: '历史病害',
		},

		{
			name: '正立面照',
		},
		{
			name: '现状照'
		},
		{
			name: '结构信息',
		},
		{
			name: '桥梁卡片',
		}
	]);

	// 跟踪各个部分的提交状态
	const frontPhotoSubmitStatus = ref(1); // 0表示未提交，1表示已提交

	const diseaseSubmitStatus = ref(1) //0表未提交，1表示已提交,2表示存在未完成

	const currentPhotoSubmitStatus = ref(1) //0表未提交，1表示已提交

	// 当前活动标签
	const activeTab = ref(0);

	// 切换标签的方法
	const switchTab = (index) => {
		activeTab.value = index;

		// 当切换到结构信息标签时，发送页面显示事件
		if (index === 4) {
			setTimeout(() => {
				uni.$emit('pageShow');
			}, 100);
		}
	};

	// 计算滑动指示器的样式
	const indicatorStyle = computed(() => {
		const width = 100 / tabs.value.length;
		return {
			width: `${width * 0.6}%`, // 设置为标签宽度的60%
			left: `calc(${width * activeTab.value}% + ${width/2}% - ${width * 0.3}%)`, // 将指示器居中
			transform: 'none' // 移除transform
		};
	});

	const readBridgeInfo = () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const params = currentPage.$page?.options;
		bridgeName.value = params.bridgeName || '';
		bridgeCode.value = params.bridgeCode || '';
		bridgePileNumber.value = params.bridgePileNumber || '';
		routeName.value = params.routeName || '';
		routeCode.value = params.routeCode || '';
	};

	const setButtonUnCommited = () => {
		submitButtonEnabled.value = true;
	};
	const setButtonCommited = () => {
		submitButtonEnabled.value = false;
	};

	// 组件挂载时
	onMounted(async () => {
    readBridgeInfo();
    checkUncommitted();
    checkDiseaseStatus();
    checkFrontPhotoStatus();
    checkCurrentPhotoStatus();
    uni.$on('setButtonUnCommited', setButtonUnCommited)
    uni.$on('setButtonCommited', setButtonCommited)
    uni.$on('frontPhotoStatusChanged', checkFrontPhotoStatus)
    uni.$on('diseaseStatusChanged', checkDiseaseStatus)
    uni.$on('currentPhotoStatusChanged', checkCurrentPhotoStatus)
  });

	onUnmounted(() => {
		uni.$off('setButtonUnCommited')
		uni.$off('setButtonCommited')
		uni.$off('frontPhotoStatusChanged')
		uni.$off('diseaseStatusChanged')
		uni.$off('currentPhotoStatusChanged')
	})


	// 检查当前病害状态
	const checkDiseaseStatus = async () => {
		const currentYear = new Date().getFullYear().toString();
		const hasUnFinishDisease = await isUnFinishDisease(userInfo.username, idStorageInfo.buildingId,
			currentYear)
		if (hasUnFinishDisease) {
			diseaseSubmitStatus.value = 2;
			return;
		}
		const hasUncommittedDiseases = await readDiseaseCommit(userInfo.username, idStorageInfo.buildingId,
			currentYear)
		if (hasUncommittedDiseases) {
			diseaseSubmitStatus.value = 0;
			return;
		}
		diseaseSubmitStatus.value = 1;
	};

	// 检查正立面照提交状态
	const checkFrontPhotoStatus = async () => {
		try {
			const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
			if (data && typeof data.commitType !== 'undefined') {
				frontPhotoSubmitStatus.value = data.commitType;
			} else {
				frontPhotoSubmitStatus.value = 1; // 未知状态
			}
		} catch (error) {
			console.error('获取正立面照状态失败:', error);
			frontPhotoSubmitStatus.value = 1; // 发生错误，设为未知状态
		}
	};

	// 检查现状照提交状态
	const checkCurrentPhotoStatus = async () => {
		currentPhotoSubmitStatus.value = await readCommit(userInfo.username, idStorageInfo.buildingId);
	}

	// 检查提交按钮的显示状态
	const checkUncommitted = async () => {
		try {
			const isBuildingCommit = await isBuildingCommited(userInfo.username, idStorageInfo.projectId,
				idStorageInfo.buildingId);
			if (isBuildingCommit === 0) submitButtonEnabled.value = true;
			else submitButtonEnabled.value = false;
		} catch (error) {
			console.error('检查未提交病害出错:', error);
			submitButtonEnabled.value = false;
		}
	};

	const submitZip = async () => {
		console.log('提交压缩文件,buildingId', idStorageInfo.buildingId);
		const currentYear = new Date().getFullYear().toString();
		uni.showLoading({
			title: '正在提交',
			mask: true
		});
		const hasUnFinishDisease = await isUnFinishDisease(userInfo.username, idStorageInfo.buildingId,
			currentYear)
		if (hasUnFinishDisease) {
			uni.showToast({
				title: '有未完成的病害',
				icon: 'none'
			});
			return;
		}
		uni.showLoading({
			title: '正在提交',
			mask: true
		});
		const warning = await readWarning(userInfo.username, idStorageInfo.buildingId);
		if (warning === true) {
			uni.showToast({
				title: '结构信息错误',
				icon: 'none'
			});
			return;
		}
		try {
			// 显示压缩中的加载提示
			uni.showLoading({
				title: '正在提交',
				mask: true
			});

			// 等待压缩完成
			const zipFilePath = await saveBridgeZip(userInfo.username, idStorageInfo.buildingId);
			console.log('压缩完成，文件路径:', zipFilePath);

			// 更新加载提示为登录中
			uni.showLoading({
				title: '正在提交',
				mask: true
			});

			const responseLogin = await uni.request({
				url: `http://59.110.81.142:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
				method: 'POST'
			});

			if (!responseLogin.data || !responseLogin.data.token) {
				uni.hideLoading();
				uni.showToast({
					title: '获取授权失败',
					icon: 'none'
				});
				return;
			}

			const token = responseLogin.data.token;
			console.log('授权成功，开始上传文件', zipFilePath);

			// 更新加载提示为上传中
			uni.showLoading({
				title: '正在提交',
				mask: true
			});

			// 调用文件上传API
			const response = await uni.uploadFile({
				url: `http://59.110.81.142:8090/api/upload/bridgeData`,
				filePath: zipFilePath,
				name: 'file', // 后端接收文件的参数名（根据后端API文档确定）
				header: {
					'Authorization': token
				},
			});

			// 隐藏加载提示
			uni.hideLoading();

			console.log('后端响应:', response.data);

			// 解析响应数据
			let responseData;
			try {
				responseData = JSON.parse(response.data);
			} catch (e) {
				responseData = response.data;
			}

			if (responseData && responseData.code === 0) {
				uni.$emit('submitSuccess');
				await setFrontPhotoCommited(userInfo.username, idStorageInfo.buildingId);
				// 更新加载提示为上传中
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				// await markObjectAsCommitted(userInfo.username, idStorageInfo.buildingId);
				// 更新加载提示为上传中
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				await setCommit1(userInfo.username, idStorageInfo.buildingId)
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				await setBuildingCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId);
				uni.$emit('setBuildingCommit', idStorageInfo.buildingId)
				submitButtonEnabled.value = false;
				diseaseSubmitStatus.value = 1;
				frontPhotoSubmitStatus.value = 1;
				currentPhotoSubmitStatus.value = 1;

				uni.showToast({
					title: '提交成功',
					icon: 'success',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: responseData?.msg || '提交失败',
					icon: 'none'
				});
			}

		} catch (error) {
			// 发生错误时隐藏加载提示
			uni.hideLoading();
      console.error('提交数据错误:', error);
      if(error.errMsg.includes('Failed to connect')){
        uni.showToast({
          title: '当前无网络连接',
          icon: 'none'
        });
      }
			else{
        uni.showToast({
          title: '提交数据出错，请稍后重试',
          icon: 'none'
        });
      }
		}
	};
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
		position: relative;
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

	.bridge-info {
		background-color: #BDCBE0;
		padding: 10rpx;
	}

	.bridge-info-content {
		padding: 10rpx;
		border: 1rpx solid #0F4687;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bridge-info-content-left {}

	.bridge-info-content-left-title {
		font-size: 20rpx;
		font-weight: 700;
		color: #333333;
	}

	.bridge-info-content-left-content {
		font-size: 16rpx;
		color: #666666;
	}

	.submit-button {
		background-color: #0F4687;
		color: white;
		font-size: 15rpx;
		height: 36rpx;
		line-height: 26rpx;
		padding: 5rpx 10rpx;
	}

	.red-icon {
		width: 8rpx;
		height: 8rpx;
		position: absolute;
		top: -2rpx;
		right: -8rpx;
	}

	.yellow-icon {
		width: 8rpx;
		height: 8rpx;
		position: absolute;
		top: -2rpx;
		right: -8rpx;
	}
</style>
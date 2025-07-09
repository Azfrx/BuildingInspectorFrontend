<!--当前病害页面-->
<template>
	<view class="disease-container">
		<view class="search-add-container">
			<view class="view-search-bar">
				<uni-search-bar class="search-bar" placeholder="搜索词" clearButton="none" cancelButton="none"
					@confirm="search" @input="handleSearchInput" />
			</view>

			<button class="submit-button" @click="submitZip" :disabled="!submitButtonEnabled"> 提交检测结果</button>
			<button class="add-button" @click="addNewDisease">新增病害</button>
		</view>

		<view class="content-layout">
			<!-- 左侧边栏 -->
			<view class="sidebar">
				<view v-for="(item, index) in tabItems" :key="index"
					:class="['sidebar-item', activeTab === index ? 'active' : '']" @click="changeTab(index)">
					<view class="sidebar-item-content">
						<text class="sidebar-item-text">{{item}}</text>
						<text class="sidebar-item-count">({{getTpyeItemCount(item)}})</text>
					</view>
				</view>
			</view>

			<!-- 右侧内容区 -->
			<view class="content">
				<disease-item v-for="(item, index) in filteredDiseases" :key="index" :item="item" :editMode="'edit'" />
				<view v-if="filteredDiseases.length === 0" class="placeholder">
					暂无数据
				</view>
			</view>
		</view>


	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		watch,
		onUnmounted
	} from 'vue';
  import {
    getDisease,
    isCommit,
    isExistDisease,
    isOnlyDisease, isUnFinishDisease,
    readDiseaseCommit
  } from '../utils/readJsonNew.js';
	import {
		addDiseaseNumber,
		decreaseDiseaseNumber,
		markObjectAsCommitted,
		saveBridgeZip,
		saveDiseaseImages,
		setDisease,
		setObject
	} from '../utils/writeNew.js';
	import {
		isPhotoCommmitted,
		setFrontPhotoCommited
	} from '../utils/frontPhoto.js';
	import {
		userStore
	} from "@/store";
	import {
		idStore
	} from "@/store/idStorage";
	import {
		decrementDiseaseNumber,
		incrementDiseaseNumber
	} from "@/utils/diseaseNumber";
	import {
		structureStore
	} from "@/store/structureNumberStorage";
  import {isBuildingCommited, setBuildingCommitted, setBuildingUnCommitted} from "@/utils/isBuildingCommited";

	const props = defineProps({
		activeTabTop: {
			type: Number,
			default: 0
		}
	})

	// 数据
	const tabItems = ref(['上部结构', '下部结构', '桥面系', '附属设施']);
	const activeTab = ref(0);
	const searchText = ref('');
	const diseaseList = ref([]);
	const userInfo = userStore();
	// 控制提交按钮是否可点击
	const submitButtonEnabled = ref(false);

	const idStorageInfo = idStore();

	const structureStoreInfo = structureStore();

	watch(() => props.activeTabTop, async (newval, oldval) => {
		if (newval == 0) {
			console.log('当前activeTabTop为：', newval) // 使用newval而不是activeTabTop
			await readCurrentYearDiseaseDataByJson()
			await checkUncommitted()
		}
	})

	//
	const readCurrentYearDiseaseDataByJson = async () => {
		try {
			const currentYear = new Date().getFullYear().toString();

			// 调用getDisease获取当前年份数据
			const yearData = await getDisease(userInfo.username, idStorageInfo.buildingId, currentYear);
			console.log(`获取到${currentYear}年病害数据:`, yearData);

			// 直接使用diseases数组
			if (yearData && yearData.diseases && yearData.diseases.length > 0) {
				diseaseList.value = yearData.diseases;
			} else {
				diseaseList.value = [];
			}

			console.log('病害数据加载完成:', diseaseList.value);
		} catch (error) {
			console.error('读取当前病害数据失败,创建当前病害json:', error);
      const currentYear = new Date().getFullYear().toString();
      await setDisease(userInfo.username, idStorageInfo.buildingId, currentYear, {
        year: parseInt(currentYear),
        buildingId: parseInt(idStorageInfo.buildingId),
        diseases: []
      });
		}
	};

	// 加载当前年份病害数据
	const loadCurrentYearDiseaseData = async () => {
		await readCurrentYearDiseaseDataByJson();
	};

	// 添加新增病害数据的方法
	const addNewDiseaseData = async (newDisease) => {
		try {
			console.log('接收到新增病害数据:', newDisease);
			// 将新病害数据添加到列表中
			diseaseList.value.push(newDisease);

			// 准备要保存的数据
			const currentYear = new Date().getFullYear().toString();

			// 构建要保存的数据对象
			const saveData = {
				year: parseInt(currentYear),
				buildingId: parseInt(idStorageInfo.buildingId),
				diseases: diseaseList.value
			};

			console.log('准备保存的数据:', saveData);
			const isExist = await isExistDisease(userInfo.username, idStorageInfo.buildingId, newDisease.component
				.name);
			if (isExist === false) {
				console.log('该构件下不存在该病害类型，需要增加病害构件数量')
				await incrementDiseaseNumber(userInfo.username, idStorageInfo.buildingId, newDisease.biObjectId);
				structureStoreInfo.incrementDataVersion();
			}

			// 调用setDisease方法保存数据
			await setDisease(userInfo.username, idStorageInfo.buildingId, currentYear, saveData);

			console.log('新增病害数据保存成功');
			/*uni.showToast({
				title: '保存成功',
				icon: 'success'
			});*/
			// await checkUncommittedDiseases();
      const hasUncommittedDiseases = await readDiseaseCommit(userInfo.username, idStorageInfo.buildingId, currentYear);
      if(hasUncommittedDiseases) {
        await setBuildingUnCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId)
        uni.$emit('setBuildingUnCommit', idStorageInfo.buildingId)
      }else{
        await setBuildingCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId)
        uni.$emit('setBuildingCommit', idStorageInfo.buildingId)
      }
      await checkUncommitted();
		} catch (error) {
			console.error('保存新增病害数据失败:', error);
			uni.showToast({
				title: '保存失败',
				icon: 'none'
			});
		}
	};

	// 处理删除病害事件的方法
	const handleDeleteDisease = async (deleteData) => {
		try {
			console.log('接收到删除病害事件:', deleteData);

			if (!deleteData || !deleteData.id) {
				console.error('删除数据无效');
				return;
			}

			// 在列表中查找病害数据
			const index = diseaseList.value.findIndex(item => item.id == deleteData.id);
			if (index === -1) {
				console.error('未找到要删除的病害数据:', deleteData.id);
				return;
			}

			const isExist = await isOnlyDisease(userInfo.username, idStorageInfo.buildingId, diseaseList.value[
				index].component.name);
			if (isExist === true) {
				console.log('该构件只有这一个病害，需要减少病害构件数量,deleteData', diseaseList.value[index])
				await decrementDiseaseNumber(userInfo.username, idStorageInfo.buildingId, diseaseList.value[index]
					.biObjectId);
				structureStoreInfo.incrementDataVersion();
			}

			// 检查是否有历史病害引用，如果有则发送事件通知 history-disease 组件
			const diseaseToDelete = diseaseList.value[index];
			if (diseaseToDelete.historyDiseaseId && diseaseToDelete.localId) {
				console.log('发送删除历史病害引用事件:', {
					historyDiseaseId: diseaseToDelete.historyDiseaseId,
					localId: diseaseToDelete.localId || diseaseToDelete.id
				});

				// 发送事件给 history-disease 组件
				uni.$emit('deleteHistoryDiseaseReference', {
					historyDiseaseId: diseaseToDelete.historyDiseaseId,
					localId: diseaseToDelete.localId || diseaseToDelete.id
				});
			}

			// 将commit_type置为2表示已删除，而不是直接从数组中移除
			diseaseList.value[index].commitType = 2;
			console.log(`病害ID:${deleteData.id}已标记为删除(commitType=2)`);

			// 准备要保存的数据
			const currentYear = new Date().getFullYear().toString();

			// 构建要保存的数据对象
			const saveData = {
				year: parseInt(currentYear),
				buildingId: parseInt(idStorageInfo.buildingId),
				diseases: diseaseList.value
			};

			console.log('准备保存更新后的数据:', saveData);

			// 调用setDisease方法保存数据
			await setDisease(userInfo.username, idStorageInfo.buildingId, currentYear, saveData);

			console.log('删除标记保存成功');
      const hasUncommittedDiseases = await readDiseaseCommit(userInfo.username, idStorageInfo.buildingId, currentYear);
      if(hasUncommittedDiseases) {
        await setBuildingUnCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId)
        uni.$emit('setBuildingUnCommit', idStorageInfo.buildingId)
      }else{
        await setBuildingCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId)
        uni.$emit('setBuildingCommit', idStorageInfo.buildingId)
      }
      await checkUncommitted();
		} catch (error) {
			console.error('保存删除失败:', error);
			uni.showToast({
				title: '删除失败',
				icon: 'none'
			});
		}
	};

	// 处理更新病害事件的方法
	const handleUpdateDisease = async (updatedDisease) => {
		try {
			console.log('接收到更新病害事件:', updatedDisease);

			if (!updatedDisease || !updatedDisease.id) {
				console.error('更新数据无效');
				return;
			}

			// 在列表中查找病害数据
			const index = diseaseList.value.findIndex(item => item.id == updatedDisease.id);
			if (index === -1) {
				console.error('未找到要更新的病害数据:', updatedDisease.id);
				return;
			}

			if (diseaseList.value[index].component.name !== updatedDisease.component.name) {
				const isOnly = await isOnlyDisease(userInfo.username, idStorageInfo.buildingId, diseaseList.value[
					index].component.name);
				if (isOnly === true) {
					console.log('该构件只有这一个病害，需要减少病害构件数量')
					await decrementDiseaseNumber(userInfo.username, idStorageInfo.buildingId, diseaseList.value[
						index].component.biObjectId);
					structureStoreInfo.incrementDataVersion();
				}
				const isExist = await isExistDisease(userInfo.username, idStorageInfo.buildingId, updatedDisease
					.component.name);
				if (isExist === false) {
					console.log('该构件下不存在该病害类型，需要增加病害构件数量')
					await incrementDiseaseNumber(userInfo.username, idStorageInfo.buildingId, updatedDisease
						.component.biObjectId);
					structureStoreInfo.incrementDataVersion();
				}
			}

			// 更新病害数据
			diseaseList.value[index] = updatedDisease;
			console.log(`病害ID:${updatedDisease.id}已更新`);

			// 准备要保存的数据
			const currentYear = new Date().getFullYear().toString();

			// 构建要保存的数据对象
			const saveData = {
				year: parseInt(currentYear),
				buildingId: parseInt(idStorageInfo.buildingId),
				diseases: diseaseList.value
			};

			console.log('准备保存更新后的数据:', saveData);

			// 调用setDisease方法保存数据
			await setDisease(userInfo.username, idStorageInfo.buildingId, currentYear, saveData);

			console.log('更新数据保存成功');
			// await checkUncommittedDiseases();
      const hasUncommittedDiseases = await readDiseaseCommit(userInfo.username, idStorageInfo.buildingId, currentYear);
      if(hasUncommittedDiseases) {
        await setBuildingUnCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId)
        uni.$emit('setBuildingUnCommit', idStorageInfo.buildingId)
      }else{
        await setBuildingCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId)
        uni.$emit('setBuildingCommit', idStorageInfo.buildingId)
      }
      await checkUncommitted();
		} catch (error) {
			console.error('保存更新数据失败:', error);
			uni.showToast({
				title: '更新失败',
				icon: 'none'
			});
		}
	};

	// 计算属性
	const filteredDiseases = computed(() => {
		// 根据activeTab和searchText过滤disease列表
		const selectedType = tabItems.value[activeTab.value];

		return diseaseList.value.filter(item => {
			// 过滤掉已删除的数据（commit_type=2）
			if (item.commitType === 2) {
				return false;
			}
			// 按类型过滤 - 使用component.grandObjectName
			if (item.component?.grandObjectName !== selectedType) {
				return false;
			}
			// 如果有搜索关键词，再按关键词过滤
			if (searchText.value) {
				// 将搜索文本按空格分词
				const keywords = searchText.value.trim().split(/\s+/);
				return keywords.some(keyword => 
					(item.description?.includes(keyword) || 
					item.type?.includes(keyword) || 
					item.biObjectName?.includes(keyword) || 
					item.position?.includes(keyword))
				);
			}

			return true;
		});
	});

	// 方法
	const search = (e) => {
		// 搜索逻辑
		searchText.value = e.value;
		console.log('搜索内容:', e);
	};

	// 处理搜索输入，实时筛选
	const handleSearchInput = (e) => {
		searchText.value = e;
		console.log('实时搜索内容:', e);
	};

	const changeTab = (index) => {
		activeTab.value = index;
	};

	const getTpyeItemCount = (type) => {
		// 根据type获取该类型的病害数量，排除已删除的数据(commit_type=2)
		return diseaseList.value.filter(item =>
			item.component?.grandObjectName === type && item.commitType !== 2
		).length;
	};

	const addNewDisease = () => {
		// 打开新增病害页面，不再传递类型参数
		uni.navigateTo({
			url: `/pages/add-disease/add-disease`
		});
	};

	const submitZip = async () => {
		console.log('提交压缩文件,buildingId', idStorageInfo.buildingId);
    const currentYear = new Date().getFullYear().toString();
    const hasUnFinishDisease = await isUnFinishDisease(userInfo.username, idStorageInfo.buildingId, currentYear)
    if(hasUnFinishDisease){
      uni.showToast({
        title: '有未完成的病害',
        icon: 'none'
      });
      return;
    }
/*		if (structureStoreInfo.status == true) {
			uni.showToast({
				title: '结构信息错误',
				icon: 'none'
			});
			return;
		}*/
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
				url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
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
				url: `http://60.205.13.156:8090/api/upload/bridgeData`,
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
				// 提交成功，将所有commit_type为1的病害记录更新为0，删除commit_type为2的记录
				let hasChanges = false;
				const filteredDiseaseList = diseaseList.value.filter(disease => disease.commitType !== 2);
				// 如果有记录被过滤掉，标记为有变化
				if (filteredDiseaseList.length !== diseaseList.value.length) {
					hasChanges = true;
				}

				filteredDiseaseList.forEach(disease => {
					if (disease.commitType === 1) {
						disease.commitType = 0;
						hasChanges = true;
					}
				});
				diseaseList.value = filteredDiseaseList;

				// 如果有更改，保存更新后的数据
				if (hasChanges) {
					const currentYear = new Date().getFullYear().toString();

					// 构建要保存的数据对象
					const saveData = {
						year: parseInt(currentYear),
						buildingId: parseInt(idStorageInfo.buildingId),
						diseases: diseaseList.value
					};

					try {
						// 保存更新后的数据
						await setDisease(userInfo.username, idStorageInfo.buildingId, currentYear, saveData);
						console.log('成功更新病害提交状态');
					} catch (error) {
						console.error('更新病害提交状态失败:', error);
					}
				}
				await setFrontPhotoCommited(userInfo.username, idStorageInfo.buildingId);
				await markObjectAsCommitted(userInfo.username, idStorageInfo.buildingId);
				submitButtonEnabled.value = false;
        await setBuildingCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId);
        uni.$emit('setBuildingCommit', idStorageInfo.buildingId)

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
			uni.showToast({
				title: '提交数据出错，请稍后重试',
				icon: 'none'
			});
		}
	};

	// 检查是否有未提交的病害记录
	const checkUncommitted = async () => {
		try {
			/*const currentYear = new Date().getFullYear().toString();
			const hasUncommittedDiseases = await readDiseaseCommit(userInfo.username, idStorageInfo.buildingId,
				currentYear);
			const isPhotoCommited = await isPhotoCommmitted(userInfo.username, idStorageInfo.buildingId);
			const hasUncommmittedPhoto = isPhotoCommited ? false : true;
			const isStructureCommited = await isCommit(userInfo.username, idStorageInfo.buildingId);
			const hasUnCommitStructure = !isStructureCommited;
			console.log('检查未提交病害结果:', hasUncommittedDiseases);
			console.log('检查未提交图片结果:', hasUncommmittedPhoto);
			console.log('检查未提交结构信息结果:', hasUnCommitStructure)*/
      const isBuildingCommit = await isBuildingCommited(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId);
			submitButtonEnabled.value = !isBuildingCommit;
      /*if(submitButtonEnabled.value) {
        await setBuildingUnCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId);
        uni.$emit('setBuildingUnCommit', idStorageInfo.buildingId)
      }else{
        await setBuildingCommitted(userInfo.username, idStorageInfo.projectId, idStorageInfo.buildingId);
        uni.$emit('setBuildingCommit', idStorageInfo.buildingId)
      }*/
		} catch (error) {
			console.error('检查未提交病害出错:', error);
			submitButtonEnabled.value = false;
		}
	};

	// 监听diseaseList的变化
	watch(diseaseList, async () => {
		console.log('diseaseList发生变化，检查未提交病害');
		await checkUncommitted();
	}, {
		deep: true
	}); // 使用deep: true确保监听对象内部属性的变化

	// 组件挂载时
	onMounted(() => {
		console.log('current-disease组件挂载，准备加载数据');
		// 加载数据
		loadCurrentYearDiseaseData();

		// 添加新增病害事件监听
		uni.$on('addNewDisease', addNewDiseaseData);

		// 添加删除病害事件监听
		uni.$on('deleteDisease', handleDeleteDisease);

		// 添加更新病害事件监听
		uni.$on('updateDisease', handleUpdateDisease);

		// 添加获取同类型病害列表的事件监听
		uni.$on('getDiseasesOfType', (data) => {
			if (!data || !data.grandObjectName || !data.callback) {
				console.error('获取同类型病害列表参数不完整');
				return;
			}

			// 过滤出同类型的病害列表
			const filteredList = diseaseList.value.filter(item =>
				item.component?.grandObjectName === data.grandObjectName
			);

			console.log(`获取${data.grandObjectName}类型的病害列表，共${filteredList.length}条`);

			// 通过回调函数返回结果
			data.callback(filteredList);
		});

		// 初始检查未提交病害
		checkUncommitted();
	});

	// 组件卸载时
	onUnmounted(() => {
		// 移除事件监听
		uni.$off('addNewDisease');
		uni.$off('deleteDisease');
		uni.$off('updateDisease');
		uni.$off('getDiseasesOfType');
	});
</script>

<style scoped>
	.disease-container {
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

	.search-add-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0rpx;
		background-color: #BDCBE0;
		z-index: 1;
	}

	.view-search-bar {
		width: 63%;
	}

	.search-bar {
		flex: 1;
	}

	.add-button {
		margin-right: 24rpx;
		background-color: #0F4687;
		color: white;
		font-size: 15rpx;
		height: 36rpx;
		line-height: 26rpx;
		padding: 5rpx 10rpx;
	}

	.submit-button {
		margin-left: 50rpx;
		background-color: #0F4687;
		color: white;
		font-size: 15rpx;
		height: 36rpx;
		line-height: 26rpx;
		padding: 5rpx 10rpx;
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
		text-align: center;
		color: #666;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		/* 修改为 flex-start */

	}

	.sidebar-item-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		/* 修改为 flex-start */
		padding-left: 16rpx;
		/* 添加左内边距 */

	}

	.sidebar-item-text {
		font-size: 18rpx;
	}

	.sidebar-item-count {
		font-size: 15rpx;
		color: #999;
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
		padding: 5rpx;
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
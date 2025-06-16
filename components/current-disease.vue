<!--当前病害页面-->
<template>
	<view class="disease-container">
		<view class="search-add-container">
      <view class="view-search-bar">
        <uni-search-bar class="search-bar"  placeholder="搜索词" clearButton="none" cancelButton="none"
                            @confirm="search" />
      </view>

      <button class="submit-button" @click="submitZip" :disabled="!submitButtonEnabled"> 提交</button>
			<button class="add-button" @click="addNewDisease">新增病害</button>
		</view>

		<view class="content-layout">
			<!-- 左侧边栏 -->
			<view class="sidebar">
				<view 
					v-for="(item, index) in tabItems" 
					:key="index" 
					:class="['sidebar-item', activeTab === index ? 'active' : '']"
					@click="changeTab(index)"
				>
          <view class="sidebar-item-content">
            <text class="sidebar-item-text">{{item}}</text>
            <text class="sidebar-item-count">({{getTpyeItemCount(item)}})</text>
          </view>
				</view>
			</view>
			
			<!-- 右侧内容区 -->
			<view class="content">
				<disease-item 
					v-for="(item, index) in filteredDiseases" 
					:key="index" 
					:item="item"
          :editMode="'edit'"
					@delete="deleteDisease" 
				/>
				<view v-if="filteredDiseases.length === 0" class="placeholder">
					暂无数据
				</view>
			</view>
		</view>


	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { getDisease, readDiseaseCommit } from '../utils/readJsonNew.js';
import {saveBridgeZip, saveDiseaseImages, setDisease, setObject} from '../utils/writeNew.js';
import {userStore} from "@/store";
import {idStore} from "@/store/idStorage";

// 数据
const tabItems = ref(['上部结构', '下部结构', '桥面系', '附属设施']);
const activeTab = ref(0);
const searchText = ref('');
const showAddPopup = ref(false);
const diseaseList = ref([]);
const isJson = ref(1);//1为有json数据，0为无json数据
const userInfo = userStore();
// 控制提交按钮是否可点击
const submitButtonEnabled = ref(false);

//用户id
const userId = ref(20);


const idStorageInfo = idStore();

//桥梁id
const buildingId = ref(idStorageInfo.buildingId);

// 通过计算属性获取URL中的bridgeId参数
const bridgeIdFromURL = computed(() => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const options = currentPage.$page?.options;

    if (options && options.bridgeId) {
      return options.bridgeId;
    }
  }
  return 0; // 默认值
});

// 监听bridgeIdFromURL的变化
watch(bridgeIdFromURL, (newVal) => {
  if (newVal) {
    buildingId.value = newVal;
  }
});

//
const readCurrentYearDiseaseDataByJson = async () => {
  try {
    const currentYear = new Date().getFullYear().toString();

    // 调用getDisease获取当前年份数据
    const yearData = await getDisease(userInfo.username, buildingId.value, currentYear);
    console.log(`获取到${currentYear}年病害数据:`, yearData);

    // 直接使用diseases数组
    if (yearData && yearData.diseases && yearData.diseases.length > 0) {
      diseaseList.value = yearData.diseases;
    } else {
      diseaseList.value = [];
    }

    console.log('病害数据加载完成:', diseaseList.value);
  } catch (error) {
    isJson.value = 0;
    console.error('读取当前病害数据失败:', error);
  }
};

// 加载当前年份病害数据
const loadCurrentYearDiseaseData = async () => {
  if (bridgeIdFromURL.value) {
    buildingId.value = bridgeIdFromURL.value;
  }
  await readCurrentYearDiseaseDataByJson();
  if(isJson.value === 0){
    const responseLogin = await uni.request({
      url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
      method: 'POST'
    });
    console.log('用户信息:', responseLogin.data);
    const token = responseLogin.data.token
    const currentYear = new Date().getFullYear().toString();
    const getData = async () => {
      console.log('开始从后端获取当前病害数据...........');
      try {
        const response = await uni.request({
          //桥梁id改为全局
          url: `http://60.205.13.156:8090/api/building/${buildingId.value}/disease?year=${currentYear}`,
          method: 'GET',
          header: {
            'Authorization': `${token}`
          }
        });
        if (response.data.code === 0) {
          console.log('后端接口返回当前病害数据:', response.data.data);
          //调用接口将数据存在本地(disease)
          /*const saveData = {
            year: parseInt(currentYear),
            buildingId: parseInt(buildingId.value),
            diseases: response.data.data.diseases || []
          };*/
          const saveData = response.data.data[0];
          console.log('准备保存的当前病害数据:', saveData)

          // 遍历diseases数组
          for (const disease of saveData.diseases) {
            // 处理images列表
            if (disease.images && Array.isArray(disease.images)) {
              disease.images = await saveDiseaseImages( userInfo.username, buildingId.value, disease.images);
            }

            // 处理ADImgs列表
            if (disease.ADImgs && Array.isArray(disease.ADImgs)) {
              disease.ADImgs = await saveDiseaseImages( userInfo.username, buildingId.value, disease.ADImgs);
            }
          }

          await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
        } else {
          uni.showToast({
            title: response.data.msg || '获取数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取当前病害数据失败:', error);
        uni.showToast({
          title: '获取数据失败，请稍后重试',
          icon: 'none'
        });
      }
    };
    await getData();
  }
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
      buildingId: parseInt(buildingId.value),
      diseases: diseaseList.value
    };
    
    console.log('准备保存的数据:', saveData);
    
    // 调用setDisease方法保存数据
    await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
    
    console.log('新增病害数据保存成功');
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    });
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
    
    // 将commit_type置为2表示已删除，而不是直接从数组中移除
    diseaseList.value[index].commit_type = 2;
    console.log(`病害ID:${deleteData.id}已标记为删除(commit_type=2)`);
  
    // 准备要保存的数据
    const currentYear = new Date().getFullYear().toString();
    
    // 构建要保存的数据对象
    const saveData = {
      year: parseInt(currentYear),
      buildingId: parseInt(buildingId.value),
      diseases: diseaseList.value
    };
    
    console.log('准备保存更新后的数据:', saveData);
    
    // 调用setDisease方法保存数据
    await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
    
    console.log('删除标记保存成功');
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
    
    // 更新病害数据
    diseaseList.value[index] = updatedDisease;
    console.log(`病害ID:${updatedDisease.id}已更新`);
    
    // 准备要保存的数据
    const currentYear = new Date().getFullYear().toString();
    
    // 构建要保存的数据对象
    const saveData = {
      year: parseInt(currentYear),
      buildingId: parseInt(buildingId),
      diseases: diseaseList.value
    };
    
    console.log('准备保存更新后的数据:', saveData);
    
    // 调用setDisease方法保存数据
    await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
    
    console.log('更新数据保存成功');
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
		if (item.commit_type === 2) {
			return false;
		}
		// 按类型过滤 - 使用component.grandObjectName
		if (item.component?.grandObjectName !== selectedType) {
			return false;
		}
		// 如果有搜索关键词，再按关键词过滤
		if (searchText.value) {
			return item.description?.includes(searchText.value) || 
				   item.type?.includes(searchText.value);
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

const changeTab = (index) => {
	activeTab.value = index;
};

const getTpyeItemCount = (type) => {
	// 根据type获取该类型的病害数量，排除已删除的数据(commit_type=2)
	return diseaseList.value.filter(item => 
    item.component?.grandObjectName === type && item.commit_type !== 2
  ).length;
};

const addNewDisease = () => {
	// 打开新增病害页面，不再传递类型参数
	uni.navigateTo({
		url: `/pages/add-disease/add-disease`
	});
};

const deleteDisease = (itemId) => {
	// 确认删除
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这条病害记录吗？',
		success: (res) => {
			if (res.confirm) {
				// 查找病害数据
				const index = diseaseList.value.findIndex(item => item.id === itemId);
				if (index !== -1) {
					// 将commit_type置为2表示已删除，而不是直接从数组中移除
					diseaseList.value[index].commit_type = 2;

					const currentYear = new Date().getFullYear().toString();
					
					// 构建要保存的数据对象
					const saveData = {
						year: parseInt(currentYear),
						buildingId: parseInt(buildingId.value),
						diseases: diseaseList.value
					};
					
					// 调用setDisease方法保存数据
					setDisease(userInfo.username, buildingId.value, currentYear, saveData)
						.then(() => {
							// 删除成功提示
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						})
						.catch(error => {
							console.error('保存删除失败:', error);
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							});
						});
				}
			}
		}
	});
};

const submitZip = async () => {
  console.log('提交压缩文件,buildingId', buildingId.value);
  try {
    // 显示压缩中的加载提示
    uni.showLoading({
      title: '正在提交',
      mask: true
    });
    
    // 等待压缩完成
    const zipFilePath = await saveBridgeZip(userInfo.username, buildingId.value);
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
    console.log('授权成功，开始上传文件',  zipFilePath);
    
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
      // 提交成功，将所有commit_type为1的病害记录更新为0
      let hasChanges = false;
      
      // 遍历diseaseList，将commit_type为1的记录更新为0
      diseaseList.value.forEach(disease => {
        if (disease.commit_type === 1) {
          disease.commit_type = 0;
          hasChanges = true;
        }
      });
      
      // 如果有更改，保存更新后的数据
      if (hasChanges) {
        const currentYear = new Date().getFullYear().toString();
        
        // 构建要保存的数据对象
        const saveData = {
          year: parseInt(currentYear),
          buildingId: parseInt(buildingId.value),
          diseases: diseaseList.value
        };
        
        try {
          // 保存更新后的数据
          await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
          console.log('成功更新病害提交状态');
        } catch (error) {
          console.error('更新病害提交状态失败:', error);
        }
      }
      
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
const checkUncommittedDiseases = async () => {
  try {
    const currentYear = new Date().getFullYear().toString();
    const hasUncommittedDiseases = await readDiseaseCommit(userInfo.username, buildingId.value, currentYear);
    console.log('检查未提交病害结果:', hasUncommittedDiseases);
    submitButtonEnabled.value = hasUncommittedDiseases;
  } catch (error) {
    console.error('检查未提交病害出错:', error);
    submitButtonEnabled.value = false;
  }
};

// 监听diseaseList的变化
watch(diseaseList, async () => {
  console.log('diseaseList发生变化，检查未提交病害');
  await checkUncommittedDiseases();
}, { deep: true }); // 使用deep: true确保监听对象内部属性的变化

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
    if (!data || !data.type || !data.callback) {
      console.error('获取同类型病害列表参数不完整');
      return;
    }
    
    // 过滤出同类型的病害列表
    const filteredList = diseaseList.value.filter(item => 
      item.component?.grandObjectName === data.type
    );
    
    console.log(`获取${data.type}类型的病害列表，共${filteredList.length}条`);
    
    // 通过回调函数返回结果
    data.callback(filteredList);
  });
  
  // 初始检查未提交病害
  checkUncommittedDiseases();
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

.view-search-bar{
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
  margin-left:100rpx;
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
  align-items: flex-start; /* 修改为 flex-start */

}
.sidebar-item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 修改为 flex-start */
  padding-left: 16rpx; /* 添加左内边距 */

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
.sidebar-item.active .sidebar-item-content{
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
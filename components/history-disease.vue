<!--历史病害页面-->
<template>
	<view class="disease-container">
		<view class="search-add-container">
      <view class="view-search-bar">
        <uni-search-bar class="search-bar"  placeholder="搜索词" clearButton="none" cancelButton="none"
                                                    @confirm="search" />
      </view>

      <view class="button-group">
        <button v-if="showCopyButton" class="copy-button" @click="copyDisease">复制为新病害</button>
        <button class="select-button" @click="toggleSelectMode">{{ isSelectMode ? '取消' : '选择' }}</button>
      </view>

		</view>
		
		<!-- 侧边栏布局 -->
		<view class="content-layout">
      <!--左侧边栏-->
      <view class="sidebar">
        <view
            v-for="(item, index) in tabItems"
            :key="index"
            :class="['sidebar-item', activeTab === index ? 'active' : '']"
            @click="changeTab(index)"
        >
          <view class="sidebar-item-content">
            <text class="sidebar-item-text">{{item}}年度</text>
            <text class="sidebar-item-count">({{getYearItemCount(item)}})</text>
          </view>
        </view>
      </view>
			
			<!-- 右侧内容区 -->
			<view class="content">
				<!-- 按结构类型分组显示 -->
				<view v-for="type in ['上部结构', '下部结构', '桥面系', '附属设施']" :key="type" class="type-group">
					<!-- 只有该类型有数据时才显示分组 -->
					<template v-if="getFilteredDiseasesByType(type).length > 0">
						<view class="type-header" @click="toggleTypeExpand(type)">
							<text>{{type}}</text>
							<text class="expand-icon">{{ expandedTypes[type] ? '▼' : '▶' }}</text>
						</view>
						<view v-show="expandedTypes[type]">
							<disease-item 
								v-for="(item, itemIndex) in getFilteredDiseasesByType(type)" 
								:key="itemIndex" 
								:item="item"
                :editMode="'history'"
								:selectMode="isSelectMode"
								:selected="selectedItems.includes(item.id)"
								@select="handleItemSelect"
								@delete="deleteDisease"
								@swipe-opened="handleSwipeOpened"
								ref="diseaseItems"
							/>
						</view>
					</template>
				</view>
				
				<view v-if="filteredDiseases.length === 0" class="placeholder">
					暂无数据
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch, onMounted } from 'vue';
import { getDisease , getHistoryYear} from '../utils/readJsonNew.js';
import {saveDiseaseImages, setDisease} from "@/utils/writeNew";
import {userStore} from "@/store";
import {idStore} from "@/store/idStorage";

// 组件名称 
defineOptions({
  name: "history-disease"
});

const userInfo = userStore()

// 响应式状态
const tabItems = ref([]);
const activeTab = ref(0);
const searchText = ref('');
const isSelectMode = ref(false);
const showCopyButton = ref(false);
const selectedItems = ref([]); // 存储选中项的ID
const currentOpenSwipe = ref(null);
const diseaseItems = ref(null);

// 病害列表数据
const diseaseMap = ref({}); // 用于按年份存储病害

//是否从json中获取数据 1为是，0为否
const isJson = ref(1);

//用户id
const userId = ref(20);


const idStorageInfo = idStore();

//桥梁id
const buildingId = ref(0);

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

// 读取json文件中的数据
const readHistoryDiseaseData = async () => {
  try {
    //  获取所有历史病害年份
    const years = await getHistoryYear(userInfo.username, buildingId.value);

    tabItems.value = years;

    // 清空现有数据
    diseaseMap.value = {};

    // 依次读取各年份数据
    for (const year of years) {
      try {
        const yearData = await getDisease(userInfo.username, buildingId.value, year);
        console.log(`获取到${year}年病害数据:`, yearData);

        // 直接按年份存储
        if (yearData && yearData.diseases && yearData.diseases.length > 0) {
          diseaseMap.value[yearData.year] = yearData.diseases;
        } else {
          diseaseMap.value[year] = [];
        }
      } catch (yearError) {
        console.warn(`获取${year}年数据失败:`, yearError);
        diseaseMap.value[year] = [];
      }
    }

  } catch (error) {
    console.error('读取病害数据失败:', error);
    isJson.value = 0;
  }
};

// 加载数据
const loadDiseaseData = async () => {
  if (bridgeIdFromURL.value) {
    buildingId.value = bridgeIdFromURL.value;
  }
  await readHistoryDiseaseData();
  //如果diseaseList为空，则从接口获取数据并写入json中
  if (isJson.value === 0) {
    const responseLogin = await uni.request({
      url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
      method: 'POST'
    });
    const token = responseLogin.data.token
    const getData = async () => {
      console.log('开始从后端获取历史病害数据...........');
      try {
        const response = await uni.request({
          //桥梁id改为全局
          url: `http://60.205.13.156:8090/api/building/${buildingId.value}/disease`,
          method: 'GET',
          header: {
            'Authorization': `${token}`
          }
        });
        console.log('从后端接口获取到的历史病害数据:', response.data.data);
        if (response.data.code === 0) {
          for(const yearDisease of response.data.data){
            const year = yearDisease.year;

            // 遍历diseases数组
            for (const disease of yearDisease.diseases) {
              // 处理images列表
              if (disease.images && Array.isArray(disease.images)) {
                disease.images = await saveDiseaseImages( userInfo.username, buildingId.value, disease.images);
              }

              // 处理ADImgs列表
              if (disease.ADImgs && Array.isArray(disease.ADImgs)) {
                disease.ADImgs = await saveDiseaseImages( userInfo.username, buildingId.value, disease.ADImgs);
              }
            }
            //调用接口将数据存在本地(disease)
            await setDisease(userInfo.username, buildingId.value, year, yearDisease)
          }
        } else {
          uni.showToast({
            title: response.data.msg || '获取数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取历史病害数据失败:', error);
      }
    };
    await getData();
    await readHistoryDiseaseData();
  }

  console.log('历史病害数据',  diseaseMap.value);
};

// 展开状态
const expandedTypes = reactive({
  '上部结构': true,
  '下部结构': true,
  '桥面系': true,
  '附属设施': true
});

// 计算属性 - 过滤后的病害列表
const filteredDiseases = computed(() => {
  // 根据侧边栏选择的年份和搜索文本过滤disease列表
  const selectedYear = tabItems.value[activeTab.value];
  let list = diseaseMap.value[selectedYear] || [];
  if (searchText.value) {
    list = list.filter(item =>
      (item.description?.includes(searchText.value) || 
       item.type?.includes(searchText.value) ||
       item.component?.grandObjectName?.includes(searchText.value))
    );
  }
  return list;
});

// 删除病害
const deleteDisease = (itemId) => {
  // 确认删除
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条病害记录吗？',
    success: (res) => {
      if (res.confirm) {
        const selectedYear = tabItems.value[activeTab.value];
        const list = diseaseMap.value[selectedYear] || [];
        const index = list.findIndex(item => item.id === itemId);
        if (index !== -1) {
          list.splice(index, 1);
          // 触发响应式
          diseaseMap.value[selectedYear] = [...list];
          // 删除成功提示
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    }
  });
};

// 切换选择模式
const
    toggleSelectMode = () => {
  isSelectMode.value = !isSelectMode.value;
  showCopyButton.value = isSelectMode.value;
  
  // 退出选择模式时清空选中项
  if (!isSelectMode.value) {
    selectedItems.value = [];
  }
};

// 处理项目选择
const handleItemSelect = (event) => {
  const { item, selected } = event;
  
  if (selected) {
    // 添加到选中数组
    if (!selectedItems.value.includes(item.id)) {
      selectedItems.value.push(item.id);
    }
  } else {
    // 从选中数组中移除
    const index = selectedItems.value.indexOf(item.id);
    if (index !== -1) {
      selectedItems.value.splice(index, 1);
    }
  }
  
  console.log('当前选中项:', selectedItems.value);
};

// 复制病害
const copyDisease = () => {
  if (selectedItems.value.length === 0) {
    uni.showToast({
      title: '请先选择要复制的病害',
      icon: 'none'
    });
    return;
  }
  // 获取所有年份中选中的病害Add commentMore actions
  const selectedDiseases = [];
  Object.keys(diseaseMap.value).forEach(year => {
    const yearDiseases = diseaseMap.value[year] || [];
    const selected = yearDiseases.filter(item => selectedItems.value.includes(item.id));
    selectedDiseases.push(...selected);
  });
  if (selectedDiseases.length === 0) {
    uni.showToast({
      title: '获取选中病害数据失败',
      icon: 'none'
    });
    return;
  }
  // 处理选中的病害，更新时间戳等信息
  const currentTime = new Date();
  const currentYear = currentTime.getFullYear().toString();
  const copiedDiseases = selectedDiseases.map(disease => {
    // 创建病害的深拷贝，避免修改原始数据
    const newDisease = JSON.parse(JSON.stringify(disease));
    // 生成新的ID
    newDisease.id = new Date().getTime() + Math.floor(Math.random() * 1000);
    // 更新创建时间和更新时间为当前时间
    const formattedTime = formatDateTime(currentTime);
    newDisease.createTime = formattedTime;
    newDisease.updateTime = formattedTime;
    // 确保病害没有删除标记
    delete newDisease.isDelete;
    return newDisease;
  });
  // 一次性添加所有选中的病害
  Promise.all(copiedDiseases.map(disease => {
    return new Promise((resolve) => {
      // 发送添加新病害事件给current-disease组件
      console.log('发送添加新病害事件给current-disease组件:', disease);
      uni.$emit('addNewDisease', disease);
      resolve();
    });
  }))
  .then(() => {
    // 显示成功提示
    uni.showToast({
      title: `成功复制${copiedDiseases.length}条病害到当前病害`,
      icon: 'success'
    });
    // 退出选择模式
    toggleSelectMode();
  })
  .catch(error => {
    console.error('复制病害失败:', error);
    uni.showToast({
      title: '复制失败，请重试',
      icon: 'none'
    });
  });
};

// 添加格式化日期时间的辅助函数
const formatDateTime = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${mm}:${s}`;
};

// 搜索
const search = (e) => {
  // 搜索逻辑
  searchText.value = e.value;
  console.log('搜索内容:', e);
  closeAllSwipeActions();
  expandAllTypes();
};

// 切换选项卡
const changeTab = (index) => {
  activeTab.value = index;
  closeAllSwipeActions();
  expandAllTypes();
};

// 获取指定年份的项目数量
const getYearItemCount = (year) => {
  return diseaseMap.value[year]?.length || 0;
};

// 按类型获取过滤后的病害列表
const getFilteredDiseasesByType = (type) => {
  const selectedYear = tabItems.value[activeTab.value];
  let list = diseaseMap.value[selectedYear] || [];
  list = list.filter(item => {
    const grandObjectName = item.component?.grandObjectName;
    // 按类型过滤
    if (grandObjectName !== type) {
      return false;
    }
    // 如果有搜索关键词，还需按关键词过滤
    if (searchText.value) {
      return (item.description?.includes(searchText.value) || 
             item.type?.includes(searchText.value));
    }
    return true;
  });
  return list;
};

// 处理滑动打开
const handleSwipeOpened = (itemId) => {
  // 关闭之前打开的swipe（如果有的话）
  closeSwipeExcept(itemId);
  // 更新当前打开的swipe
  currentOpenSwipe.value = itemId;
};

// 关闭所有滑动操作
const closeAllSwipeActions = () => {
  diseaseItems.value?.forEach(item => {
    item.closeSwipe && item.closeSwipe();
  });
  currentOpenSwipe.value = null;
};

// 关闭除特定项外的所有滑动操作
const closeSwipeExcept = (itemId) => {
  diseaseItems.value?.forEach(item => {
    if (item.item.id !== itemId && item.closeSwipe) {
      item.closeSwipe();
    }
  });
};

// 切换类型展开
const toggleTypeExpand = (type) => {
  expandedTypes[type] = !expandedTypes[type];
  closeAllSwipeActions();
};

// 展开所有类型
const expandAllTypes = () => {
  // 展开所有类型
  ['上部结构', '下部结构', '桥面系', '附属设施'].forEach(type => {
    expandedTypes[type] = true;
  });
};

// 组件挂载时
onMounted(() => {
  console.log('history-disease组件挂载，准备加载数据');
  // 加载数据
  loadDiseaseData();
  // 初始化所有类型为展开状态
  expandAllTypes();
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
  background-color: #BDCBE0;
  z-index: 1;
}
.view-search-bar{
  width: 63%;
}

.search-bar {
  flex: 1;
}

.button-group {
  display: flex;
  gap: 10rpx; /* 按钮间距 */
  margin-left: auto; /* 靠右对齐 */
}

.select-button {
  margin-right: 24rpx;
  background-color: #0F4687;
  color: white;
  font-size: 15rpx;
  height: 40rpx;
  line-height: 30rpx;
  padding: 5rpx 10rpx;
}


.copy-button {
  margin-right: 24rpx;
  background-color: #0F4687;
  color: white;
  font-size: 15rpx;
  height: 40rpx;
  line-height: 40rpx;
  padding: 0 10rpx;
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

.type-group {
  margin-bottom: 0rpx;
}

.type-header {
  height: 30rpx;
  font-size: 15rpx;
  font-weight: bold;
  background-color: #BDCBE0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rpx 10rpx;
  border-radius: 2rpx;
  color: #0F4687;
  border-bottom: 1rpx solid #0F4687;
}

.expand-icon {
  margin-left: 5rpx;
  font-size: 12rpx;
  color: #666;
}
</style>
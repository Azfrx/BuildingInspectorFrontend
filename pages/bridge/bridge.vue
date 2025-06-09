<!-- 
 项目列表
 author:ykx
 date:2025.6.3
 Bug：4
 -->
<template>
  <!-- 内容区 -->
  <view class="container">
    <!-- 信息卡片 -->
    <view class="info-card">
      <view class="info-boxes">
        <view class="info-box">
          <text class="label">检测单位</text>
          <text class="value">{{ infoData.userDept|| '暂无数据' }}</text>
        </view>
        <view class="info-box">
          <text class="label">检测人员</text>
          <text class="value">{{ infoData.userName || '暂无数据' }}</text>
		    </view>
        <view class="info-box">
          <text class="label">检测年度</text>
          <picker class="year-picker" :value="selectedYearIndex" :range="years" @change="changeYear">
				<view class="picker-content">
              <text class="value">{{ currentYear }}年度</text>
              <image
                src="/static/image/RightOutline.svg"
                mode="scaleToFill"
              />
				</view>
			</picker>
        </view>
		</view>
	</view>
	
    <!-- 项目列表 -->
    <view class="bridge-list">
      <view class="bridge-item" v-for="(item, index) in filteredProjects" :key="index" @click="goToList(item)">
        <view class="bridge-info">
          <view class="bridge-code">{{ item.code || '暂无编号' }}</view>
          <view class="bridge-name">{{ item.name || '暂无名称' }}</view>
          <view class="bridge-location">{{ item.ownerDept.deptName || '暂无公司' }}</view>
        </view>
        <view class="bridge-meta">
          <view class="text-group">
            <text class="bridge-status" :class="{ 'completed': item.status === '1' }">{{ getStatusText(item.status) }}</text>
            <text class="bridge-progress">{{item.number||'0/0' }}</text>
          </view>
          <image
            src="/static/image/RightOutline.svg"
            mode="scaleToFill"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAllUserInfo, getProject } from '../../utils/readJsonNew';
import { setProject } from '../../utils/writeNew';
import {userStore} from '@/store/index.js'

// 检测年度选项
const years = ref([2025,2024, 2023, 2022,2021,2020]);

// 获取当前年份
const currentYear = ref(new Date().getFullYear());

const initData = ref(null);
const infoData = ref({});
// const username = ref("admin")
// const password = ref(123456);
const userInfo = userStore()

const selectedYearIndex = ref(0);
//初始化数据
const init = async () => {
  try {
	  // 在线登录逻辑
	  //待处理 Bug Bug 1
	  const responseLogin = await uni.request({
	  	url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
	  	method: 'POST'
	  });
    console.log('用户信息:', responseLogin.data);
	//模拟的假数据
	const token = responseLogin.data.token
	infoData.value = responseLogin.data ;
    if (token) {
      const getData = async () => {
        try {
          const projectResponse = await uni.request({
            url: 'http://60.205.13.156:8090/api/project',
            method: 'GET',
            header: {
              'Authorization': `${token}` 
            }
          });
          console.log('获取到的项目数据:', projectResponse.data);
          if (projectResponse.data.code === 0) {
            initData.value = projectResponse.data;
            //调用接口将数据存在本地
            if (responseLogin.data.userId) {
              setProject(responseLogin.data.userId, initData.value);
            }
          } else {
            uni.showToast({
              title: projectResponse.data.msg || '获取数据失败',
              icon: 'none'
            });
          }
        } catch (error) {
          console.error('获取项目数据失败:', error);
          uni.showToast({
            title: '获取数据失败，请稍后重试',
            icon: 'none'
          });
        }
      };

      await getData();
    } else {
      console.error('未获取到有效token');
      uni.showToast({
        title: '登录信息无效，请重新登录',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
};

// 添加计算属性
const filteredProjects = computed(() => {
  if (!initData.value || !initData.value.data || !initData.value.data.projects) {
    return [];
  }
  return initData.value.data.projects.filter(project => {
    return project.year == currentYear.value;
  });
});

// 修改changeYear函数
const changeYear = (e) => {
  selectedYearIndex.value = e.detail.value;
  currentYear.value = years.value[selectedYearIndex.value];
  console.log(`已选择${currentYear.value}年度，筛选出${filteredProjects.value.length}个项目`);
};

const back = () => {
  uni.navigateBack();
};

// Bug4  跳转后如何获取任务id
const goToList = (item) => {
    uni.navigateTo({
    url: `/pages/List/List?projectId=${item.id}`,
  });
};


// 获取状态文本
const getStatusText = (status) => {
  switch(status) {
    case '0':
      return '未完成';
    case '1':
      return '已完成';
    default:
      return '未知状态';
  }
};

// 添加一个计算属性来获取当前项目
const currentProject = computed(() => {
  if (!initData.value || !initData.value.data || !initData.value.data.projects) {
    return null;
  }
  
  // 查找匹配当前projectId的项目
  const project = initData.value.data.projects.find(p => p.id == projectId.value);
  
  // 如果找不到匹配的项目，则返回第一个项目（作为后备）
  return project || initData.value.data.projects[0];
});

onMounted(async() => {
  await init();
});

const handleRadioChange = (e) => {
  const value = e.detail.value;
  if (value === 'remember') {
    rememberPassword.value = true;
    offlineLogin.value = false;
  } else if (value === 'offline') {
    offlineLogin.value = true;
    rememberPassword.value = false;
  }
};
</script>

<style lang="scss">
.container {
    min-height: 100vh;
  background-color: #fff;
  padding: 0;
  margin: 0;
}

.uni-nav-bar {
  height: 88px;
  font-size: 34px;
  font-weight: bold;
  margin-bottom: 0;
  background-color: #0F4687 !important;
}

::v-deep .uni-nav-bar__content {
  font-size: 34px;
  font-weight: bold;
  background-color: #0F4687 !important;
	}

::v-deep .uni-nav-bar__header-container-inner {
  font-size: 34px;
  font-weight: bold;
	}

.info-card {
  background-color: #bdcbe0;
  padding: 22px 12px 10px 12px;
  margin: 0;
  margin-top: -14px;
  display: flex;
  align-items: center;

  .info-boxes {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 0 12px 0 10px;
    width: 100%;

    .info-box {
      border: 1px solid #0f4687;
      border-radius: 4px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      background-color: #bdcbe0;
      min-height: 62px;
      justify-content: center;

      &:first-child {
        width: 42%;
        margin-left: 0px;
        .value {
          font-size: 20rpx;
        }
      }

      &:nth-child(2) {
        width: 19%;
        .value {
          font-size: 20rpx;
        }
      }

      &:last-child {
        width: 19%;
        margin-right: 0px;
        .value {
          font-size: 20rpx;
        }
      }

      .label {
        font-size: 15rpx;
        color: #666;
        line-height: 1.2;
        margin-bottom: 3px;
      }

      .value {
        color: #333;
        font-weight: 500;
        line-height: 1.2;
        font-size: 20rpx;
      }
    }
  }
}

.year-picker {
    width: 100%;
  
  .picker-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .value {
      font-size: 20rpx;
      color: #333;
      font-weight: 500;
      line-height: 1.2;
    }
    
    image {
      width: 20rpx;
      height: 20rpx;
    }
  }
}

.bridge-list {
  .bridge-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    margin-bottom: 0px;
    border: 1px solid #d0d0d0;
    border-radius: 0px;

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
      gap: 10px;
        
      .text-group {
        text-align: right;
        
        .bridge-status {
          font-size: 18rpx;
          color: #333;
          display: block;
          
          &.completed {
            color: #00B578;
          }
        }
          
        .bridge-progress {
          font-size: 15rpx;
          color: #666;
          display: block;
          margin: 4px 0;
        }
      }

      image {
        width: 20rpx;
        height: 20rpx;
      }
    }
}
}

.loading, .no-data {
    display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
  font-size: 16px;
}

.appTitle {
  font-size: 20rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
}
</style>
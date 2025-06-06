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
          <text class="value">{{ initData.data.projects[0].dept.deptName|| '暂无数据' }}</text>
        </view>
        <view class="info-box">
          <text class="label">检测人员</text>
		  <!-- Todo   Bug1 
		    这里检测人员的字段是否为leader?
			Bug2 多任务列表中是否要用project[0]-->
          <text class="value">{{ initData.data.projects[0].dept.leader || '暂无数据' }}</text>
		    </view>
        <view class="info-box">
          <text class="label">检测年度</text>
          <picker class="year-picker" :value="selectedYearIndex" :range="years" @change="changeYear">
				<view class="picker-content">
					<!-- Bug3 年份切换回的逻辑还没处理 -->
              <text class="value">{{initData.data.projects[0].year }}年度</text>
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
      <view class="bridge-item" v-for="(item, index) in initData.data.projects" :key="index" @click="goToList(item)">
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
import { ref, onMounted } from 'vue';
import { getProject,getUser } from '../../utils/readJsonNew';
import { setProject } from '../../utils/writeNew';

// 检测年度选项
const years = ref([2024, 2023, 2022,2021,2020]);
//控制年份的初始值
const selectedYearIndex = ref(0);

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
        url: 'http://60.205.13.156:8090/api/project',
        method: 'GET',
        header: {
          'Authorization': `${token}` 
        }
      });
      console.log('获取到的项目数据:', response.data);
      if (response.data.code === 0) {
        initData.value = response.data;
		//调用接口将数据存在本地
		setProject(1,initData.value);
      } else {
        uni.showToast({
          title: response.data.msg || '获取数据失败',
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
};

const changeYear = (e) => {
  selectedYearIndex.value = e.detail.value;
  // 这里可以添加年份切换后的数据刷新逻辑
};

const back = () => {
  uni.navigateBack();
};

// Bug4  跳转后如何获取任务id
const goToList = (item) => {
    uni.navigateTo({
    url: `/pages/List/List`,
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

onMounted(async() => {
  await init();
});
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
    margin-bottom: 1px;
    border: 1px solid #0f4687;
    border-radius: 4px;

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
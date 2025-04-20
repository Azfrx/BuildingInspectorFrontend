<template>
  <!-- 导航栏 -->
  <uni-nav-bar class="uni-nav-bar" dark :fixed="true" shadow background-color="#0F4687" status-bar left-icon="left"
    title="桥梁定期检查项目列表" @clickLeft="back" />
  <!-- 内容区 -->
  <view class="container">
    <view class="info-container" v-if="fileData">
      <view class="info-box">
        <text class="label">检测单位</text>
        <text class="value">{{ fileData.unit || '暂无数据' }}</text>
      </view>
      <view class="info-box">
        <text class="label">检测人员</text>
        <text class="value">{{ fileData.person || '暂无数据' }}</text>
      </view>
      <view class="info-box">
        <text class="label">检测年度</text>
        <picker class="year-picker" :value="selectedYearIndex" :range="years" @change="changeYear">
          <view class="picker-content">
            <text class="value">{{ years[selectedYearIndex] }}</text>
            <view class="arrows">
              <text class="arrow up">▲</text>
              <text class="arrow down">▼</text>
            </view>
          </view>
        </picker>
      </view>
    </view>

    <view class="list-container" v-if="fileData && fileData.bridgeInspectionList">
      <view class="list-item" v-for="(item, index) in fileData.bridgeInspectionList" :key="index" @click="goToList(item)">
        <view class="item-left">
          <text class="project-code">{{ item.code || '暂无编号' }}</text>
          <text class="project-name">{{ item.projectName || '暂无名称' }}</text>
          <text class="project-company">{{ item.company || '暂无公司' }}</text>
        </view>
        <view class="item-right">
          <text class="status" :class="{ 'completed': item.status === '已完成' }">{{ item.status || '未知状态' }}</text>
          <view class="progress-wrapper">
            <text class="progress">{{ item.progress || '0/0' }}</text>
            <text class="arrow-right">></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTaskList } from '@/utils/readJson.js';

// 检测单位
const detectUnit = ref('');
// 检测人员
const detectPerson = ref('');
// 检测年度选项
const years = ref(['2024年度', '2025年度', '2026年度']);
const selectedYearIndex = ref(0);

const fileData = ref(null);

const getData = async () => {
  try {
    const data = await getTaskList(3);
    console.log('获取到的数据:', data);
    if (data) {
      fileData.value = data;
      console.log('处理后的数据:', fileData.value);
    } else {
      console.error('获取数据为空');
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const changeYear = (e) => {
  selectedYearIndex.value = e.detail.value;
  // 这里可以添加年份切换后的数据刷新逻辑
};

const back = () => {
  uni.navigateBack();
};

const goToList = (item) => {
  uni.navigateTo({
    url: `/pages/List/List?projectId=${item.code || ''}&projectName=${encodeURIComponent(item.projectName || '')}&company=${encodeURIComponent(item.company || '')}&status=${encodeURIComponent(item.status || '')}&progress=${encodeURIComponent(item.progress || '')}`
  });
};

onMounted(() => {
  getData();
});
</script>

<style scoped>
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

.container {
  padding: 0;
  margin: 0;
}

.info-container {
  background-color: #BDCBE0;
  display: flex;
  justify-content: flex-start;
  padding: 24px;
  height: 188px;
  width: 1200px;
  box-sizing: border-box;
  margin-top: -14px;
}

.info-box {
  border: 1px solid #0F4687;
  border-radius: 8rpx;
  padding: 0;
  margin: 0 10rpx;
  background-color: #BDCBE0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 140px;
  position: relative;
}

.info-box:first-child {
  width: 600px;
  flex: none;
}

.info-box:nth-child(2),
.info-box:last-child {
  width: 252px;
  flex: none;
}

.info-box .label {
  font-size: 26px;
  color: #666666;
  margin-top: 18px;
  margin-left: 24px;
  height: 26px;
  line-height: 26px;
  margin-bottom: 24px;
  position: absolute;
  top: 0;
  left: 0;
}

.info-box .value {
  font-size: 34px;
  color: #333333;
  font-weight: bold;
  height: 34px;
  line-height: 34px;
  margin-left: 24px;
  margin-top: calc(68px - 26px - 24px - 18px);
  position: absolute;
  top: 68px;
  left: 0;
}

.list-container {
  margin-top: 20rpx;
  padding: 0;
  width: 1200px;
  background: #FFFFFF;
}

.list-item {
  padding: 24px;
  border-bottom: 1px solid #E5E5E5;
  display: flex;
  justify-content: space-between;
  width: 1200px;
  min-height: 184px;
  box-sizing: border-box;
  position: relative;
  background: #FFFFFF;
  transition: all 0.3s ease;
}

.list-item:hover {
  background: #F8F9FA;
}

.item-left {
  width: calc(100% - 200px);
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 136px; /* 184px - 48px(padding) */
}

.item-right {
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 24px;
  padding-right: 0;
}

.status {
  color: #333333;
  font-size: 32px;
  margin-bottom: 8px;
  width: 96px;
}

.status.completed {
  color: #00B578;
}

.progress-wrapper {
  display: flex;
  align-items: center;
}

.progress {
  color: #666666;
  font-size: 28px;
  width: 96px;
}

.arrow-right {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 32px;
  color: #666666;
  font-weight: bold;
}

.project-code {
  font-size: 26px;
  display: block;
  color: #666666;
  margin: 24px 0 18px 24px;
}

.project-name {
  font-size: 34px;
  font-weight: bold;
  display: block;
  color: #333333;
  margin: 0 0 18px 24px;
  line-height: 1.4;
  word-break: break-all;
  flex: 1;
}

.project-company {
  color: #666666;
  font-size: 26px;
  display: block;
  margin-left: 24px;
  position: relative;
  margin-top: auto;
  padding-top: 18px;
}

.year-picker {
  position: absolute;
  top: 68px;
  left: 24px;
  height: 34px;
  line-height: 34px;
  width: calc(100% - 48px);
}

.picker-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  padding-right: 10px;
}

.picker-content .value {
  font-size: 34px;
  color: #333333;
  font-weight: bold;
  height: 34px;
  line-height: 34px;
  margin: 0;
  padding: 0;
  position: static;
}

.picker-content .arrows {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.picker-content .arrow {
  font-size: 17px;
  color: #333333;
  line-height: 12px;
  display: inline-block;
  font-weight: bold;
}

.picker-content .arrow.up {
  margin-bottom: -1px;
}

.picker-content .arrow.down {
  margin-top: -1px;
}

.year-picker .value {
  font-size: 34px;
  color: #333333;
  font-weight: bold;
  display: inline-block;
}
</style> 
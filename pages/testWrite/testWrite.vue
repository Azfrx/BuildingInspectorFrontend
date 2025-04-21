<template>
  <view class="content">
    <!-- 测试任务列表写入 -->
    <view class="test-section">
      <text class="section-title">任务列表测试</text>
      <input class="input" v-model="taskData.userId" placeholder="输入用户ID" />
      <button class="btn" @click="testTaskList">写入任务列表</button>
    </view>

    <!-- 测试桥梁列表写入 -->
    <view class="test-section">
      <text class="section-title">桥梁列表测试</text>
      <input class="input" v-model="bridgeListData.userId" placeholder="用户ID" />
      <input class="input" v-model="bridgeListData.bridgeListId" placeholder="桥梁列表ID" />
      <button class="btn" @click="testBridgeList">写入桥梁列表</button>
    </view>

    <!-- 测试单个桥梁写入 -->
    <view class="test-section">
      <text class="section-title">单个桥梁测试</text>
      <input class="input" v-model="bridgeData.userId" placeholder="用户ID" />
      <input class="input" v-model="bridgeData.bridgeListId" placeholder="桥梁列表ID" />
      <input class="input" v-model="bridgeData.bridgeId" placeholder="桥梁ID" />
      <button class="btn" @click="testBridge">写入桥梁数据</button>
    </view>

    <!-- 操作结果展示 -->
    <view class="result-box">
      <text class="result-title">操作日志：</text>
      <scroll-view scroll-y class="log-container">
        <text class="log-item" v-for="(log, index) in logs" :key="index">{{ log }}</text>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { 
  setTaskList, 
  setBridgeList, 
  setBridge 
} from '@/utils/writeJson.js';

// 定义响应式数据
const taskData = reactive({
  userId: '4',
  data: {
    tasks: ['任务1', '任务2', '任务3'],
    createTime: new Date().toISOString()
  }
});

const bridgeListData = reactive({
  userId: '4',
  bridgeListId: '2',
  data: {
    bridges: ['桥梁A', '桥梁B'],
    location: '北京市'
  }
});

const bridgeData = reactive({
  userId: '4',
  bridgeListId: '2',
  bridgeId: '1',
  data: {
    length: 150,
    width: 20,
    material: '混凝土'
  }
});

const logs = ref([]);

// 定义方法
const testTaskList = async () => {
  try {
    await setTaskList(taskData.userId, taskData.data);
    addLog(`任务列表写入成功！路径：${taskData.userId}/taskList.json`);
    uni.showToast({ title: '任务列表写入成功', icon: 'success' });
  } catch (e) {
    addLog(`任务列表写入失败：${e.message}`);
    uni.showToast({ title: '写入失败', icon: 'none' });
  }
};

const testBridgeList = async () => {
  try {
    const { userId, bridgeListId, data } = bridgeListData;
    await setBridgeList(userId, bridgeListId, data);
    addLog(`桥梁列表写入成功！路径：${userId}/${bridgeListId}/bridgeList.json`);
    uni.showToast({ title: '桥梁列表写入成功', icon: 'success' });
  } catch (e) {
    addLog(`桥梁列表写入失败：${e.message}`);
    uni.showToast({ title: '写入失败', icon: 'none' });
  }
};

const testBridge = async () => {
  try {
    const { userId, bridgeListId, bridgeId, data } = bridgeData;
    await setBridge(userId, bridgeListId, bridgeId, data);
    addLog(`桥梁数据写入成功！路径：${userId}/${bridgeListId}/${bridgeId}/bridge.json`);
    uni.showToast({ title: '桥梁数据写入成功', icon: 'success' });
  } catch (e) {
    addLog(`桥梁数据写入失败：${e.message}`);
    uni.showToast({ title: '写入失败', icon: 'none' });
  }
};

const addLog = (message) => {
  logs.value = [`[${new Date().toLocaleTimeString()}] ${message}`, ...logs.value];
};

// 生命周期钩子函数（如果需要）
// onMounted(() => {
//   // 组件挂载后的操作
// });
</script>

<style lang="scss">
.content {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.test-section {
  background: white;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}

.section-title {
  display: block;
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.input {
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

.btn {
  background-color: #007AFF;
  color: white;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 8rpx;
  font-size: 30rpx;
}

.result-box {
  background: white;
  padding: 20rpx;
  border-radius: 12rpx;
}

.result-title {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
}

.log-container {
  max-height: 400rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 10rpx;
}

.log-item {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  padding: 8rpx 0;
  border-bottom: 1rpx dashed #eee;
}
</style>
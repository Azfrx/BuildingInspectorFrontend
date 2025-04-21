<template>
  <view class="container">
    <view class="input-group">
      <text class="label">用户 ID:</text>
      <input v-model="userId" placeholder="请输入用户 ID" />
    </view>
    <view class="input-group">
      <text class="label">桥梁列表 ID:</text>
      <input v-model="bridgeListId" placeholder="请输入桥梁列表 ID" />
    </view>
    <view class="input-group">
      <text class="label">桥梁 ID:</text>
      <input v-model="bridgeId" placeholder="请输入桥梁 ID" />
    </view>
    <view class="button-group">
      <button @click="handleGetTaskList">获取任务列表</button>
      <button @click="handleGetBridgeList">获取桥梁列表</button>
      <button @click="handleGetBridge">获取桥梁信息</button>
      <button @click="handleSaveTest" type="primary">修改并保存</button>
    </view>
    <view class="result">
      <text>{{ result }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { getTaskList, getBridgeList, getBridge } from '@/utils/readJson.js';
import { saveData, trackPath } from '@/utils/reviseJson.js';

const userId = ref('');
const bridgeListId = ref('');
const bridgeId = ref('');
const result = ref('');
const currentData = ref(null);

const handleGetTaskList = async () => {
  const idToUse = userId.value || '3';  // 如果没有输入ID，默认使用3
  try {
    const data = await getTaskList(idToUse);
    result.value = JSON.stringify(data, null, 2);
    currentData.value = data;
    uni.showToast({
      title: '获取任务列表成功',
      icon: 'success'
    });
  } catch (error) {
    result.value = `错误: ${error.message}`;
    uni.showToast({
      title: '获取任务列表失败',
      icon: 'none'
    });
  }
};

const handleGetBridgeList = async () => {
  if (!userId.value || !bridgeListId.value) {
    uni.showToast({
      title: '请输入用户 ID 和桥梁列表 ID',
      icon: 'none'
    });
    return;
  }
  try {
    const data = await getBridgeList(userId.value, bridgeListId.value);
    result.value = JSON.stringify(data, null, 2);
    currentData.value = data;
  } catch (error) {
    result.value = `错误: ${error.message}`;
    uni.showToast({
      title: '获取桥梁列表失败',
      icon: 'none'
    });
  }
};

const handleGetBridge = async () => {
  if (!userId.value || !bridgeId.value) {
    uni.showToast({
      title: '请输入用户 ID 和桥梁 ID',
      icon: 'none'
    });
    return;
  }
  try {
    // 获取任务列表数据
    const taskListData = await getTaskList(userId.value);
    if (!taskListData || !taskListData.bridgeInspectionList) {
      throw new Error('未找到任务列表数据');
    }

    // 在 bridgeInspectionList 中查找对应的桥梁
    const bridge = taskListData.bridgeInspectionList.find(
      item => item.id === bridgeId.value
    );

    if (!bridge) {
      throw new Error('未找到对应的桥梁信息');
    }

    // 显示桥梁信息
    result.value = JSON.stringify(bridge, null, 2);
    currentData.value = bridge;
    
    uni.showToast({
      title: '获取成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('获取桥梁数据失败:', error);
    result.value = `错误: ${error.message}`;
    uni.showToast({
      title: '获取桥梁信息失败',
      icon: 'none'
    });
  }
};

const handleSaveTest = async () => {
  if (!currentData.value) {
    uni.showToast({
      title: '请先获取数据',
      icon: 'none'
    });
    return;
  }

  try {
    // 修改 person 字段
    const updatedData = {
      ...currentData.value,
      person: 'ykx'
    };
    
    // 保存更新后的数据
    await saveData(updatedData);
    
    // 更新显示
    result.value = JSON.stringify(updatedData, null, 2);
    currentData.value = updatedData;
    
    uni.showToast({
      title: '更新保存成功',
      icon: 'success'
    });
  } catch (error) {
    result.value = `更新保存错误: ${error.message}`;
    uni.showToast({
      title: '更新保存失败',
      icon: 'none'
    });
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.input-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}
.label {
  width: 100px;
  margin-right: 10px;
}
.input-group input {
  flex: 1;
  height: 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 10px;
}
.button-group {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
  gap: 10px;
}
.button-group button {
  flex: 1;
}
.result {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 100px;
  border-radius: 4px;
  background: #f9f9f9;
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
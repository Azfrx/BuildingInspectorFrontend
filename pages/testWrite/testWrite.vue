<template>
  <view class="container">
    <view class="button-group">
      <button @click="testProject">测试项目文件</button>
      <button @click="testTask">测试任务文件</button>
      <button @click="testProperty">测试属性文件</button>
      <button @click="testDisease">测试病害文件</button>
    </view>
    <view v-if="writeResult">
      <text>写入结果: </text>
      <text>{{ writeResult }}</text>
    </view>
    <view v-if="readResult">
      <text>读取结果: </text>
      <text>{{ JSON.stringify(readResult, null, 2) }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { getProject, getTask, getProperty, getDisease } from '@/utils/readJsonNew.js';
import { saveData, trackPath } from '@/utils/reviseNew.js';

const writeResult = ref(null);
const readResult = ref(null);

// 测试数据
const testData = {
  test: {
    name: '测试项目',
    description: '这是一个测试项目'
  }
};

// 测试项目文件
const testProject = async () => {
  try {
    const userId = '1';
    const path = `_doc/${userId}/project/projects.json`;
    // 先设置文件路径
    trackPath(path);
    // 先读取
    const data = await getProject(userId);
    readResult.value = data;
    // 再写入
    await saveData(testData.test);
    writeResult.value = '项目文件操作成功';
  } catch (error) {
    writeResult.value = '项目文件操作失败: ' + error.message;
  }
};

// 测试任务文件
const testTask = async () => {
  try {
    const userId = '1';
    const projectId = '1';
    const path = `_doc/${userId}/project/${projectId}/task.json`;
    // 先设置文件路径
    trackPath(path);
    // 先读取
    const data = await getTask(userId, projectId);
    readResult.value = data;
    // 再写入
    await saveData(testData.test);
    writeResult.value = '任务文件操作成功';
  } catch (error) {
    writeResult.value = '任务文件操作失败: ' + error.message;
  }
};

// 测试属性文件
const testProperty = async () => {
  try {
    const userId = '1';
    const buildingId = '5';
    const path = `_doc/${userId}/building/${buildingId}/property.json`;
    // 先设置文件路径
    trackPath(path);
    // 先读取
    const data = await getProperty(userId, buildingId);
    readResult.value = data;
    // 再写入
    await saveData(testData.test);
    writeResult.value = '属性文件操作成功';
  } catch (error) {
    writeResult.value = '属性文件操作失败: ' + error.message;
  }
};

// 测试病害文件
const testDisease = async () => {
  try {
    const userId = '1';
    const buildingId = '5';
    const yearId = '2023';
    const path = `_doc/${userId}/building/${buildingId}/disease/${yearId}.json`;
    // 先设置文件路径
    trackPath(path);
    // 先读取
    const data = await getDisease(userId, buildingId, yearId);
    readResult.value = data;
    // 再写入
    await saveData(testData.test);
    writeResult.value = '病害文件操作成功';
  } catch (error) {
    writeResult.value = '病害文件操作失败: ' + error.message;
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  margin: 5px 0;
  background-color: #0F4687;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
}

button:active {
  background-color: #0a3461;
}
</style>
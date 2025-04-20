<template>
  <view class="page">
    <view class="input-section">
      <view class="input-item">
        <label>文件路径:</label>
        <input v-model="filePath" placeholder="请输入文件路径" />
      </view>
      <view class="input-item">
        <label>保存数据:</label>
        <input v-model="saveDataInput" placeholder="请输入要保存的数据（简单文本）" />
      </view>
    </view>
    <view class="button-section">
      <button @click="recordFilePath">记录路径</button>
      <button @click="saveUserData">保存数据</button>
    </view>
    <view class="result-section">
      <text>{{ resultMsg }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { saveData, trackReadPath } from '@/utils/reviseJson.js'; // 请根据实际路径修改

const filePath = ref('');
const saveDataInput = ref('');
const resultMsg = ref('');

const recordFilePath = () => {
  if (filePath.value) {
    trackReadPath(filePath.value);
    resultMsg.value = `文件路径已记录: ${filePath.value}`;
  } else {
    resultMsg.value = '请先输入文件路径';
    uni.showToast({
      title: '请先输入文件路径',
      icon: 'none'
    });
  }
};

const saveUserData = async () => {
  if (!filePath.value) {
    resultMsg.value = '请先记录文件路径';
    uni.showToast({
      title: '请先记录文件路径',
      icon: 'none'
    });
    return;
  }
  if (!saveDataInput.value) {
    resultMsg.value = '请先输入要保存的数据';
    uni.showToast({
      title: '请先输入要保存的数据',
      icon: 'none'
    });
    return;
  }
  try {
    const dataToSave = { data: saveDataInput.value };
    await saveData(dataToSave);
    resultMsg.value = '数据保存成功';
    uni.showToast({
      title: '数据保存成功',
      icon: 'success'
    });
  } catch (error) {
    resultMsg.value = `保存数据失败: ${error.message}`;
    uni.showToast({
      title: '保存数据失败',
      icon: 'none'
    });
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
}

.input-section {
  margin-bottom: 20px;
}

.input-item {
  margin-bottom: 10px;
}

.button-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.result-section {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>

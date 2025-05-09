<template>
  <view class="container">
    <view class="tree-list">
      <view class="header">
        <text class="header-name">名称</text>
        <text class="header-order">显示顺序</text>
        <text class="header-status">状态</text>
        <text class="header-action">操作</text>
      </view>
      <template v-for="(item, index) in treeData" :key="index">
        <view class="tree-item" v-if="shouldShowItem(item)">
          <view class="item-content" :style="{ paddingLeft: getLevel(item.ancestors) * 20 + 'px' }" @click="handleNodeClick(item)">
            <view class="item-left">
              <view v-if="hasChildren(item)" class="expand-icon" @click.stop="toggleExpand(item)">
                {{ isExpanded(item.id) ? '▼' : '▶' }}
              </view>
              <view v-else class="expand-icon-placeholder"></view>
              <text class="item-name">{{item.name}}</text>
            </view>
            <view class="item-middle">
              <text class="order-num">{{item.orderNum}}</text>
            </view>
            <view class="item-right">
              <view class="status-tag">{{getStatus(item.status)}}</view>
              <button type="default" size="mini" class="number-btn" @click.stop="numberItem(item)">构件编号</button>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 修改构件列表显示 -->
    <view class="components-list" v-if="filteredComponentsList.length > 0">
      <view class="list-header">
        <text class="header-cell index">序号</text>
        <text class="header-cell number">编号</text>
        <text class="header-cell component">所属部件</text>
        <text class="header-cell action">操作</text>
      </view>
      <scroll-view class="list-content" scroll-y>
        <view v-for="(item, index) in filteredComponentsList" :key="index" class="list-row">
          <text class="list-cell index">{{index + 1}}</text>
          <text class="list-cell number">{{item.number}}</text>
          <text class="list-cell component">{{item.component}}</text>
          <view class="list-cell action">
            <button class="list-btn" size="mini" type="primary" @click="handleEdit(item, index)">编辑</button>
            <button class="list-btn" size="mini" type="primary" @click="handleDelete(index)">删除</button>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="empty-tip" v-else>
      暂无构件数据
    </view>

    <uni-popup ref="popup" type="center" :maskClick="false">
      <view class="popup-box">
        <view class="popup-content">
          <view class="input-container">
            <view class="select-container">
              <view class="type-wrapper">
                <view class="type-picker">
                  <picker :range="typeOptions" @change="handleTypeChange">
                    <view class="picker-text">
                      <text>{{typeOptions[selectedTypeIndex]}}</text>
                      <text class="dropdown-icon">▼</text>
                    </view>
                  </picker>
                </view>
                <input v-if="selectedTypeIndex === 0" type="text" class="single-input" v-model="fixedValue" placeholder="请输入固定值" />
                <template v-else>
                  <view class="range-inputs">
                    <input type="number" class="range-input" v-model="startNum" placeholder="起始值" />
                    <text class="separator">-</text>
                    <input type="number" class="range-input" v-model="endNum" placeholder="结束值" />
                  </view>
                </template>
              </view>
              <view class="action-buttons">
                <button class="action-btn cancel" @click="cancelInput">取消</button>
                <button class="action-btn confirm" type="primary" @click="confirmInput">确定</button>
              </view>
            </view>

            <!-- 添加记录显示区域 -->
            <view class="records-container">
              <view class="records-title">已添加片段：</view>
              <view class="records-header">
                <text class="header-item">序号</text>
                <text class="header-item">类型</text>
                <text class="header-item">值</text>
                <text class="header-item">操作</text>
              </view>
              <scroll-view class="records-list" scroll-y>
                <view v-for="(record, index) in inputRecords" :key="index" class="record-item">
                  <text class="record-index">{{index + 1}}</text>
                  <text class="record-type">{{record.type}}</text>
                  <text class="record-value">{{record.value}}</text>
                  <button class="delete-btn" size="mini" @click="deleteRecord(index)">删除</button>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
        <!-- 添加关闭按钮 -->
        <view class="popup-footer">
          <button class="close-btn" type="primary" @click="closePopup">完成</button>
        </view>
      </view>
    </uni-popup>

    <!-- 添加编辑弹窗 -->
    <uni-popup ref="editPopup" type="center">
      <view class="edit-popup-box">
        <view class="edit-popup-header">
          <text class="edit-title">编辑构件</text>
        </view>
        <view class="edit-popup-content">
          <view class="edit-form-item">
            <text class="edit-label">编号</text>
            <input type="text" class="edit-input" v-model="editingComponent.number" placeholder="请输入编号" />
          </view>
          <view class="edit-form-item">
            <text class="edit-label">所属部件</text>
            <input type="text" class="edit-input" v-model="editingComponent.component" placeholder="请输入所属部件" />
          </view>
        </view>
        <view class="edit-popup-footer">
          <button class="edit-btn cancel" @click="cancelEdit">取消</button>
          <button class="edit-btn confirm" type="primary" @click="confirmEdit">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import {getBridge}from '@/utils/readJson.js'

// 展开的节点ID集合
const expandedItems = ref(new Set());

// 所有树节点数据
const treeData = ref([]);

const popup = ref(null);
const showInputs = ref(false);
const typeOptions = ['固定值', '序号'];
const selectedTypeIndex = ref(0);
const fixedValue = ref('');
const startNum = ref('');
const endNum = ref('');

// 初始化记录存储
const allInputRecords = ref([]); // 存储所有构件的记录
const inputRecords = ref([]); // 当前显示的记录

const currentEditItem = ref(null);

// 计算当前项的记录
const currentItemRecords = computed(() => {
  if (!currentEditItem.value) return [];
  return inputRecords.value.filter(record => record.itemId === currentEditItem.value.id);
});

// 删除记录
const deleteRecord = (index) => {
  // 获取要删除的记录
  const recordToDelete = inputRecords.value[index];
  
  // 从当前记录中删除
  inputRecords.value.splice(index, 1);
  
  // 从所有记录中删除
  const allRecordIndex = allInputRecords.value.findIndex(
    record => record.itemId === recordToDelete.itemId && 
    record.timestamp === recordToDelete.timestamp
  );
  if (allRecordIndex > -1) {
    allInputRecords.value.splice(allRecordIndex, 1);
  }
  
  uni.showToast({
    title: '删除成功',
    icon: 'success'
  });
};

// 添加当前选中节点
const selectedNode = ref(null);

// 判断是否是第三层节点
const isThirdLevel = (ancestors) => {
  if (!ancestors) return false;
  const levels = ancestors.split(',');
  return levels.length === 4; // 0,501,549,550 表示第三层
};

// 处理节点点击
const handleNodeClick = (item) => {
  if (!isThirdLevel(item.ancestors)) return;
  
  console.log('点击节点:', item);
  selectedNode.value = item;
};

// 添加计算属性来过滤构件列表
const filteredComponentsList = computed(() => {
  console.log('过滤构件列表 - 当前节点:', selectedNode.value?.name);
  console.log('总构件列表长度:', componentsList.value.length);
  
  if (!selectedNode.value) {
    console.log('返回所有构件');
    return componentsList.value;
  }
  
  const filtered = componentsList.value.filter(item => item.component === selectedNode.value.name);
  console.log('过滤后构件数量:', filtered.length);
  return filtered;
});

// 修改删除构件的方法
const handleDelete = (index) => {
  const itemToDelete = filteredComponentsList.value[index];
  const originalIndex = componentsList.value.findIndex(
    item => item.number === itemToDelete.number && 
    item.component === itemToDelete.component
  );
  
  if (originalIndex > -1) {
    componentsList.value.splice(originalIndex, 1);
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    });
  }
};

const response = ref({
	currentDisease:[],
	historyDisease:[],
	frontFhoto:[],
	bridgeArchive:{},
	structureInfo:{}
})
const jsonData = ref({})

// 初始化数据
onMounted(async () => {
  try {
    // 等待异步数据
    const result = await getBridge(3, 1, 'G6911428222L1160');
    console.log('原始返回数据:', result);

    // 处理可能的数组返回
    const data = Array.isArray(result) ? result[0] : result;
    console.log('处理后的数据:', data);
    
    // 更新响应数据
    response.value = data;
    console.log('response.value 更新后:', response.value);
    
    // 获取结构信息
    if (data && data.structureInfo) {
      jsonData.value = data.structureInfo;
      console.log('structureInfo 数据:', jsonData.value);
      
      if (jsonData.value.data) {
        console.log('找到树形数据:', jsonData.value.data);
        
        // 递归展平树结构
        const flattenTree = (node) => {
          if (!node) return [];
          let result = [node];
          if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach(child => {
              result = result.concat(flattenTree(child));
            });
          }
          return result;
        };

        // 展平树结构
        treeData.value = flattenTree(jsonData.value.data);
        console.log('展平后的树形数据:', treeData.value);
        console.log('树形数据长度:', treeData.value.length);

        // 默认展开根节点和主要节点
        if (treeData.value.length > 0) {
          expandedItems.value.add(549); // 根节点
          expandedItems.value.add(550); // 上部结构
          expandedItems.value.add(551); // 下部结构
          expandedItems.value.add(552); // 桥面系
          console.log('已展开的节点:', Array.from(expandedItems.value));
        }
      } else {
        console.error('structureInfo.data 不存在');
        console.log('完整的 structureInfo:', jsonData.value);
      }
    } else {
      console.error('API返回数据中没有 structureInfo');
      console.log('完整的API返回数据:', data);
    }
  } catch (error) {
    console.error('数据加载出错:', error);
  }
});

// 获取节点层级
const getLevel = (ancestors) => {
  if (!ancestors) return 0;
  const levels = ancestors.split(',');
  // 从 "0,501,549" 这样的格式中计算实际层级
  return levels.length - 1; // 减1是因为包含了"0"
};

// 判断节点是否有子节点
const hasChildren = (item) => {
  return treeData.value.some(node => node.parentId === item.id);
};

// 判断节点是否已展开
const isExpanded = (id) => {
  return expandedItems.value.has(id);
};

// 判断节点是否应该显示
const shouldShowItem = (item) => {
  // 如果是根节点（id=549），始终显示
  if (item.id === 549) return true;
  
  // 检查父节点是否展开
  return isExpanded(item.parentId);
};

// 切换展开/收起状态
const toggleExpand = (item) => {
  if (expandedItems.value.has(item.id)) {
    expandedItems.value.delete(item.id);
  } else {
    expandedItems.value.add(item.id);
  }
};

// 获取状态显示文本
const getStatus = (status) => {
  return status === '0' ? '正常' : '异常';
};

// 显示输入表单
const showInputForm = () => {
  showInputs.value = true;
};

// 处理类型选择变化
const handleTypeChange = (e) => {
  selectedTypeIndex.value = e.detail.value;
  // 清空输入值
  fixedValue.value = '';
  startNum.value = '';
  endNum.value = '';
};

// 取消输入
const cancelInput = () => {
  showInputs.value = false;
  // 清空所有输入
  fixedValue.value = '';
  startNum.value = '';
  endNum.value = '';
  selectedTypeIndex.value = 0;
  // 关闭弹窗
  popup.value.close();
};

// 确认输入
const confirmInput = () => {
  if (selectedTypeIndex.value === 0) {
    if (!fixedValue.value) {
      uni.showToast({
        title: '请输入固定值',
        icon: 'none'
      });
      return;
    }
    
    // 创建新记录
    const newRecord = {
      itemId: currentEditItem.value.id,
      itemName: currentEditItem.value.name,
      type: '固定值',
      value: fixedValue.value,
      timestamp: new Date().toISOString()
    };
    
    // 添加到当前记录和所有记录中
    inputRecords.value.push(newRecord);
    allInputRecords.value.push(newRecord);
    
    console.log('添加固定值记录:', fixedValue.value);
    
    // 清空输入值
    fixedValue.value = '';
  } else {
    if (!startNum.value || !endNum.value) {
      uni.showToast({
        title: '请输入完整的序号范围',
        icon: 'none'
      });
      return;
    }
    
    const start = parseInt(startNum.value);
    const end = parseInt(endNum.value);
    
    if (start > end) {
      uni.showToast({
        title: '起始值不能大于结束值',
        icon: 'none'
      });
      return;
    }
    
    // 创建新记录
    const newRecord = {
      itemId: currentEditItem.value.id,
      itemName: currentEditItem.value.name,
      type: '序号',
      value: `${start}-${end}`,
      timestamp: new Date().toISOString()
    };
    
    // 添加到当前记录和所有记录中
    inputRecords.value.push(newRecord);
    allInputRecords.value.push(newRecord);
    
    console.log('添加序号范围记录:', `${start}-${end}`);
    
    // 清空输入值
    startNum.value = '';
    endNum.value = '';
  }
  
  // 显示保存成功提示
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  });
};

// 生成构件编号
const generateComponents = () => {
  console.log('开始生成构件，当前记录数:', inputRecords.value.length);
  if (inputRecords.value.length === 0) {
    console.log('没有记录，跳过生成');
    return;
  }

  // 按时间戳排序，确保按添加顺序处理
  const sortedRecords = [...inputRecords.value].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  console.log('排序后的记录:', sortedRecords);
  
  // 递归生成组合
  const generateCombinations = (records, currentIndex = 0, prefix = '') => {
    if (currentIndex >= records.length) {
      return [prefix];
    }

    const record = records[currentIndex];
    let combinations = [];

    if (record.type === '固定值') {
      const newPrefix = prefix ? `${prefix}-${record.value}` : record.value;
      combinations = generateCombinations(records, currentIndex + 1, newPrefix);
    } else {
      const [start, end] = record.value.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        const newPrefix = prefix ? `${prefix}-${i}` : `${i}`;
        combinations = combinations.concat(generateCombinations(records, currentIndex + 1, newPrefix));
      }
    }

    return combinations;
  };

  // 生成所有组合
  const combinations = generateCombinations(sortedRecords);
  console.log('生成的组合:', combinations);

  // 生成构件列表
  const newComponents = combinations.map(number => ({
    number: `${number}#${currentEditItem.value.name}`,
    component: currentEditItem.value.name,
    status: '',
    originalNumber: number
  }));

  // 更新构件列表
  componentsList.value = [...componentsList.value, ...newComponents];
  console.log('生成完成，当前构件列表:', componentsList.value);
};

// 构件编号按钮点击事件
const numberItem = (item) => {
  console.log('点击构件:', item);
  currentEditItem.value = item; // 保存当前正在编辑的项
  
  // 从所有记录中过滤出当前构件的记录
  inputRecords.value = allInputRecords.value.filter(record => record.itemId === item.id);
  console.log('当前构件的记录:', inputRecords.value);
  
  showInputs.value = true; // 显示输入表单
  popup.value.open('center');  // 确保使用正确的打开方式
};

// 关闭弹窗
const closePopup = () => {
  console.log('点击关闭按钮');
  if (inputRecords.value.length > 0) {
    generateComponents();
  }
  popup.value.close();
  showInputs.value = false;
  // 只清空输入框的值，不清空记录
  fixedValue.value = '';
  startNum.value = '';
  endNum.value = '';
  selectedTypeIndex.value = 0;
};

// 监听弹窗关闭事件
const handlePopupClose = () => {
  console.log('弹窗关闭事件触发');
  showInputs.value = false;
  // 只清空输入框的值，不清空记录
  fixedValue.value = '';
  startNum.value = '';
  endNum.value = '';
  selectedTypeIndex.value = 0;
};

// 编辑相关的变量
const editPopup = ref(null);
const editingComponent = ref({
  index: -1,
  number: '',
  component: '',
  originalNumber: '',
  originalComponent: ''
});

// 编辑构件
const handleEdit = (item, index) => {
  console.log('开始编辑构件:', item);
  // 从构件编号中分离出编号和名称
  const [number] = item.number.split('#');
  
  // 保存当前编辑的构件信息
  editingComponent.value = {
    index: index,
    number: number,
    component: selectedNode.value ? selectedNode.value.name : item.component,
    originalNumber: number,
    originalComponent: item.component
  };
  
  console.log('当前编辑的构件信息:', editingComponent.value);
  console.log('当前选中的节点:', selectedNode.value?.name);
  
  // 打开编辑弹窗
  editPopup.value.open('center');
};

// 确认编辑
const confirmEdit = () => {
  console.log('确认编辑:', editingComponent.value);
  // 验证输入
  if (!editingComponent.value.number) {
    uni.showToast({
      title: '请填写构件编号',
      icon: 'none'
    });
    return;
  }

  // 更新构件列表中的数据
  if (editingComponent.value.index > -1) {
    const targetComponent = filteredComponentsList.value[editingComponent.value.index];
    if (!targetComponent) {
      uni.showToast({
        title: '未找到要编辑的构件',
        icon: 'none'
      });
      return;
    }

    // 在原始列表中查找并更新
    const originalIndex = componentsList.value.findIndex(
      item => item.number === targetComponent.number &&
      item.component === targetComponent.component
    );

    if (originalIndex > -1) {
      // 创建新的数组以触发响应式更新
      const updatedList = [...componentsList.value];
      
      // 保持组件名称与当前选中节点一致
      const componentName = selectedNode.value ? selectedNode.value.name : targetComponent.component;
      
      // 更新构件信息
      updatedList[originalIndex] = {
        ...componentsList.value[originalIndex],
        number: `${editingComponent.value.number}#${componentName}`,
        component: componentName,
        originalNumber: editingComponent.value.number
      };
      
      // 使用新数组更新 componentsList
      componentsList.value = updatedList;

      console.log('更新成功，新的构件信息:', updatedList[originalIndex]);
      console.log('当前构件列表长度:', updatedList.length);
      console.log('当前选中节点:', selectedNode.value?.name);

      // 显示成功提示
      uni.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      });

      // 关闭弹窗
      editPopup.value.close();
      
      // 重置编辑状态
      editingComponent.value = {
        index: -1,
        number: '',
        component: '',
        originalNumber: '',
        originalComponent: ''
      };
    } else {
      uni.showToast({
        title: '未找到原始构件',
        icon: 'none'
      });
    }
  }
};

// 取消编辑
const cancelEdit = () => {
  console.log('取消编辑');
  // 关闭弹窗
  editPopup.value.close();
  // 重置编辑状态
  editingComponent.value = {
    index: -1,
    number: '',
    component: '',
    originalNumber: '',
    originalComponent: ''
  };
};

// 初始化空的构件列表
const componentsList = ref([]);

// 添加监听器以确保数据更新
watch(componentsList, (newVal) => {
  console.log('构件列表发生变化');
  console.log('新的构件列表长度:', newVal.length);
  console.log('构件列表内容:', JSON.stringify(newVal, null, 2));
}, { deep: true, immediate: true });

// 添加监听器以确保记录更新
watch(inputRecords, (newVal) => {
  console.log('输入记录更新，新的长度:', newVal.length);
  console.log('输入记录内容:', newVal);
}, { deep: true });

// 添加监听器以确保所有输入记录更新
watch(allInputRecords, (newVal) => {
  console.log('所有输入记录更新，新的长度:', newVal.length);
  console.log('所有输入记录内容:', newVal);
}, { deep: true });
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
}

.tree-list {
  background-color: #fff;
  border-radius: 4px;
}

.header {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  background-color: #fafafa;
}

.header-name {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.header-order {
  width: 100px;
  text-align: center;
  color: #333;
  font-size: 14px;
}

.header-status {
  width: 80px;
  text-align: center;
  color: #333;
  font-size: 14px;
}

.header-action {
  width: 100px;
  text-align: center;
  color: #333;
  font-size: 14px;
}

.tree-item {
  border-bottom: 1px solid #eee;
}

.item-content {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  min-height: 44px;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.expand-icon {
  margin: 0 8px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.expand-icon-placeholder {
  width: 20px;
  margin: 0 8px;
}

.item-name {
  color: #333;
  font-size: 14px;
}

.item-middle {
  width: 100px;
  text-align: center;
}

.order-num {
  color: #666;
  font-size: 14px;
}

.item-right {
  width: 180px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-tag {
  display: inline-block;
  padding: 2px 10px;
  background-color: #2d8cf0;
  color: #fff;
  border-radius: 4px;
  font-size: 13px;
  min-width: 60px;
}

.number-btn {
  font-size: 13px !important;
  padding: 0 10px !important;
  height: 24px !important;
  line-height: 24px !important;
  background-color: #19be6b !important;
  border: 1px solid #19be6b !important;
  color: #fff !important;
  border-radius: 4px !important;
}

.number-btn:active {
  opacity: 0.8;
}

/* 弹窗样式 */
.popup-box {
  background-color: #fff;
  width: 100vw;
  height: 50vh;
  position: fixed;
  bottom: 0;
  left: 0;
  transform: none;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 70px; // 为底部按钮留出空间
}

.input-container {
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  position: relative;
  padding: 20px;
}

.select-container {
  width: 100%;
  display: flex;
  align-items: center;
}

.type-wrapper {
  display: inline-flex;
  align-items: stretch;
}

.type-picker {
  width: 100px;
  height: 45px;
  background-color: #f5f5f5;
  border-radius: 4px 0 0 4px;
  border: 1px solid #dcdfe6;
  border-right: none;
  overflow: hidden;

  picker {
    width: 100%;
    height: 100%;
  }
}

.picker-text {
  height: 100%;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.dropdown-icon {
  font-size: 12px;
  color: #666;
}

.single-input {
  width: 120px !important;
  height: 45px !important;
  font-size: 14px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 0 4px 4px 0;
  margin: 0;
  outline: none;
  display: inline-block;
  vertical-align: top;
}

.range-inputs {
  display: inline-flex;
  align-items: center;
  gap: 15px;
}

.range-input {
  width: 80px;
  height: 45px;
  font-size: 14px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin: 0;
  outline: none;
}

.separator {
  font-size: 18px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-left: auto;
  margin-right: 30px;
  flex-shrink: 0;
}

.action-btn {
  width: 80px !important;
  height: 45px !important;
  line-height: 45px !important;
  font-size: 14px !important;
  margin: 0 !important;
  padding: 0 !important;
}

.btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #fff;
  padding: 15px;
  border-top: 1px solid #eee;
}

.btn-container.with-form {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-top: auto;
  padding: 15px;
  background-color: #fff;
  z-index: 1;
}

.add-fragment-btn {
  width: 200px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
}

.records-container {
  width: 100%;
  margin-top: 20px;
  padding: 0 30px;
  position: relative;
}

.records-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.records-header {
  display: flex;
  align-items: center;
  padding: 10px;
  padding-right: 50px;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 5px;
}

.header-item {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.header-item:nth-child(1) {
  width: 60px;
}

.header-item:nth-child(2) {
  width: 80px;
}

.header-item:nth-child(3) {
  flex: 1;
}

.header-item:nth-child(4) {
  width: 80px;
  text-align: center;
}

.records-list {
  height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}

.record-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  height: 45px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.record-item:last-child {
  border-bottom: none;
}

.record-index {
  width: 60px;
  font-size: 14px;
  color: #606266;
}

.record-type {
  width: 80px;
  font-size: 14px;
  color: #606266;
}

.record-value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.delete-btn {
  position: absolute;
  right: 50px;
  width: 80px !important;
  height: 45px !important;
  line-height: 45px !important;
  font-size: 14px !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: #fff !important;
  color: #ff4d4f !important;
  border: 1px solid #ff4d4f !important;
  border-radius: 4px !important;
}

.delete-btn:active {
  opacity: 0.8;
}

/* 添加新的表格样式 */
.components-list {
  margin: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .list-header {
    display: flex;
    align-items: center;
    padding: 12px 0;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    
    .header-cell {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #333;
      font-weight: 500;
      
      &.index {
        flex: 0.5;
      }
      
      &.number {
        flex: 1.5;
      }
      
      &.component {
        flex: 1.5;
      }
      
      &.action {
        flex: 1;
      }
    }
  }
  
  .list-content {
    max-height: 400px;
  }
  
  .list-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e9ecef;
    
    &:hover {
      background-color: #f8f9fa;
    }
    
    .list-cell {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #666;
      
      &.index {
        flex: 0.5;
      }
      
      &.number {
        flex: 1.5;
      }
      
      &.component {
        flex: 1.5;
      }
      
      &.action {
        flex: 1;
        display: flex;
        justify-content: center;
        gap: 8px;
      }
    }
  }
  
  .list-btn {
    font-size: 12px !important;
    padding: 0 12px !important;
    height: 28px !important;
    line-height: 28px !important;
    
    &:nth-child(2) {
      background-color: #ff4d4f !important;
      border-color: #ff4d4f !important;
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
  background-color: #fff;
  margin: 20px;
  border-radius: 8px;
}

.popup-footer {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #eee;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.close-btn {
  width: 200px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
  background-color: #2d8cf0 !important;
}

/* 编辑弹窗样式 */
.edit-popup-box {
  background-color: #fff;
  width: 80vw;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
}

.edit-popup-header {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.edit-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.edit-popup-content {
  padding: 20px;
}

.edit-form-item {
  margin-bottom: 16px;
}

.edit-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.edit-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.edit-popup-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}

.edit-btn {
  width: 80px !important;
  height: 36px !important;
  line-height: 36px !important;
  font-size: 14px !important;
  margin: 0 !important;
  
  &.cancel {
    background-color: #fff !important;
    color: #666 !important;
    border: 1px solid #dcdfe6 !important;
  }
  
  &.confirm {
    background-color: #2d8cf0 !important;
    color: #fff !important;
  }
}
</style>
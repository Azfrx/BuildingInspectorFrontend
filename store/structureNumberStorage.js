import { defineStore } from 'pinia'
import { ref } from 'vue'

export const structureStore = defineStore('count', () => {
  // 构件数量是否合法 字段为true表示存在异常
  const status = ref(false)
  // 添加数据版本号 - 用于追踪数据变化
  const dataVersion = ref(0)
  
  const setStatus = (bool) => {
    status.value = bool
  }
  
  // 增加版本号 - 当diseaseNumber被修改时调用
  const incrementDataVersion = () => {
    dataVersion.value++
  }
  
  return {
    status,
    dataVersion, // 导出版本号
    setStatus,
    incrementDataVersion // 导出增加版本号的方法
  }
})
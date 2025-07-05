<template>
	<view>
		现状照
	</view>
</template>

<script setup>
// 接收父组件传递的数据加载状态
import {watch} from "vue";

const props = defineProps({
  activeTabTop: {
    type: Number,
    default: 0
  }
});

watch(() => props.activeTabTop, (newval, oldval) => {
  if (newval == 5) {
    console.log('当前activeTabTop为：', newval) // 使用newval而不是activeTabTop
    //Todo 调用初始化方法

  }
})
</script>

<style>

</style>
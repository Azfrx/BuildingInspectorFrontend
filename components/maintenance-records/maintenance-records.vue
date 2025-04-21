<template>
	<view>

    <view v-for="(item , index) in data" :key="index" class="type-group">
      <view class="type-header" @click="toggleTypeExpand(item.timePeriod)">
        <text>时间（段）：{{item.timePeriod || '/'}}</text>
        <text class="expand-icon">{{ expandedTypes[item.timePeriod] ? '▼' : '▶' }}</text>
      </view>

      <view v-if="expandedTypes[item.timePeriod]">
        <view class="line">
          <view class="line-title">
            处治类别（维修、加固、改造）
          </view>
          <view class="line-content">
            {{ item.treatmentType || '/'}}
          </view>
        </view>

        <view class="line">
          <view class="line-title">
            处置原因
          </view>
          <view class="line-content">
            {{ item.treatmentReason || '/'}}
          </view>
        </view>

        <view class="line">
          <view class="line-title">
            工程费用（万元）
          </view>
          <view class="line-content">
            {{ item.treatmentScope || '/'}}
          </view>
        </view>

        <view class="line">
          <view class="line-title">
            经费来源
          </view>
          <view class="line-content">
            {{ item.fundingSource || '/'}}
          </view>
        </view>

         <view class="line">
            <view class="line-title">
              处治质量评定
            </view>
            <view class="line-content">
              {{ item.treatmentQualityAssessment || '/'}}
            </view>
        </view>

        <view class="line">
          <view class="line-title">
            建设单位
          </view>
          <view class="line-content">
            {{ item.constructionUnit || '/'}}
          </view>
        </view>

        <view class="line">
          <view class="line-title">
            设计单位
          </view>
          <view class="line-content">
            {{ item.designUnit || '/'}}
          </view>
        </view>

        <view class="line">
          <view class="line-title">
            施工单位
          </view>
          <view class="line-content">
            {{ item.constructionOrganization || '/'}}
          </view>
        </view>

        <view class="line">
          <view class="line-title">
            监理单位
          </view>
          <view class="line-content">
            {{ item.supervisionUnit || '/'}}
          </view>
        </view>

      </view>

    </view>


	</view>
</template>

<script setup>

import {
  reactive,
  ref
} from 'vue'

/*const data = ref([
    {
      timePeriod: '',//时间（段）
      treatmentType: '',//处治类别（维修、加固、改造）
      treatmentReasonL: '',//处置原因
      treatmentScope: '',//处置范围
      projectCost: '',//工程费用（万元）
      fundingSource: '',//经费来源
      qualityAssessment: '',//处治质量评定
      constructionUnit:'',//建设单位
      designUnit: '',//设计单位
      constructionCompany: '',//施工单位
      supervisionUnit: '',//监理单位
    }
]);*/

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

// 展开状态
const expandedTypes = reactive({});

// 初始化默认展开
props.data.forEach(item => {
  expandedTypes[item.timePeriod] = true; // 或使用 index
});

// 切换类型展开
const toggleTypeExpand = (type) => {
  expandedTypes[type] = !expandedTypes[type];
};

</script>

<style scoped>
/* 下拉收缩 */
.type-header {
  height: 30rpx;
  font-size: 15rpx;
  font-weight: bold;
  background-color: #BDCBE0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rpx 10rpx;
  border-radius: 2rpx;
  color: #0F4687;
  border-bottom: 1rpx solid #0F4687;
  border-top: 1rpx solid #0F4687;
}

.expand-icon {
  margin-left: 5rpx;
  font-size: 12rpx;
  color: #666;
}

.line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14rpx 12rpx;
  border-bottom: 1rpx solid #eee;
}

.line-title {
  color: #666666;
  font-size: 20rpx;
}

.line-content {
  color: #333333;
  font-size: 20rpx;
}
.line-content-middle{
  margin-left: 10rpx;
  margin-right: 10rpx;
  color: #BDCBE0;
}
</style>
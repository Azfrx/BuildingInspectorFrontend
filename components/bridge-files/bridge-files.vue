<template>
	<view>

    <view class="line">
      <view class="line-title">
        设计图纸
      </view>
      <view class="line-content">
        {{ data.designDrawings || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        设计文件
      </view>
      <view class="line-content">
        {{ data.designDocuments || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        竣工图纸
      </view>
      <view class="line-content">
        {{ data.asBuiltDrawings || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        施工文件（含施工缺陷文件）
      </view>
      <view class="line-content">
        {{ data.constructionDocuments || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        验收文件
      </view>
      <view class="line-content">
        {{ data.acceptanceDocuments || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        行政审批文件
      </view>
      <view class="line-content">
        {{ data.administrativeApprovalDocuments || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        定期检查资料
      </view>
      <view class="line-content">
        {{ data.regularInspectionRecords || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        特殊检查资料
      </view>
      <view class="line-content">
        {{ data.specialInspectionRecords || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        历次维修、加固资料
      </view>
      <view class="line-content">
        {{ data.maintenanceHistory || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        其他档案
      </view>
      <view class="line-content">
        {{ data.otherArchives || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        档案形式
      </view>
      <view class="line-content">
        {{ data.archiveFormats || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        建档时间
      </view>
      <view class="line-content">
        {{ data.archiveDate || '/'}}
      </view>
    </view>

	</view>
</template>

<script setup>
  import {ref} from "vue";

/*  const data = ref({
    designDrawings: '全',//设计图纸
    designDocuments: '全',//设计文件
    asBuiltDrawings: '全',//竣工图纸
    constructionDocuments: '全',//施工文件（含施工缺陷文件）
    acceptanceDocuments: '全',//验收文件
    administrativeApprovalDocuments: '全',//行政审批文件
    regularInspectionRecords: '全',//定期检查资料
    specialInspectionRecords: '全',//特殊检查资料
    maintenanceAndReinforcementRecords: '全',//历次维修、加固资料
    otherArchives: '无',//其他档案
    archiveFormats:'纸质、电子',//档案形式
    archiveCreationTime: '',//建档时间（年/月）
  })*/

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    }
  })


</script>

<style scoped>

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
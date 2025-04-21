<template>
	<view>
		<view class="line">
			<view class="line-title">
				桥梁所处行政区划代码
			</view>
			<view class="line-content">
				{{ data.administrativeDivisionCode || '/' }}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				路线编号
			</view>
			<view class="line-content">
				{{ data.routeNumber || '/' }}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				路线名称
			</view>
			<view class="line-content">
				{{ data.routeName  || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				路线等级
			</view>
			<view class="line-content">
				{{ data.routeGrade || '/' }}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				桥梁编号
			</view>
			<view class="line-content">
				{{ data.bridgeNumber  || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				桥梁名称
			</view>
			<view class="line-content">
				{{ data.bridgeName || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				桥位桩号
			</view>
			<view class="line-content">
				{{ data.bridgeStakeNumber || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				功能类型
			</view>
			<view class="line-content">
				{{ data.functionalType  ||  '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				被跨越道路（通道）类型
			</view>
			<view class="line-content">
				{{ data.crossedFacilityName || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				被跨越道路（通道）桩号
			</view>
			<view class="line-content">
				{{ data.crossedFacilityStakeNumber || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				设计荷载
			</view>
			<view class="line-content">
				{{ data.designLoad || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				桥梁坡度
			</view>
			<view class="line-content">
				{{ data.bridgeSlope || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				桥梁平曲线半径
			</view>
			<view class="line-content">
				{{ data.bridgeHorizontalCurveRadius || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				建成时间
			</view>
			<view class="line-content">
				{{ data.completionYear || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				设计单位
			</view>
			<view class="line-content">
				{{ data.designOrganization || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				施工单位
			</view>
			<view class="line-content">
				{{ data.constructionOrganization || '/'}}
			</view>
		</view>

		<view class="line">
			<view class="line-title">
				监理单位
			</view>
			<view class="line-content">
				{{ data.supervisionOrganization || '/'}}
			</view>
		</view>

    <view class="line">
      <view class="line-title">
        业主单位
      </view>
      <view class="line-content">
        {{ data.ownerOrganization || '/'}}
      </view>
    </view>

    <view class="line">
      <view class="line-title">
        管养单位
      </view>
      <view class="line-content">
        {{ data.maintenanceOrganization || '/'}}
      </view>
    </view>

	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({})
		}
	})

/*	const data = ref({
		code: '420302',
		route: {
			number: 'G70',
			name: '福州至银川高速公路',
			level: '国道、高度公路'
		},
		bridge: {
			number: 'G70420302R1020',
			name: '徐家棚大桥-上行',
			station: '1373.765',
			slope: '2',
			radius: '-1'
		},
		typeFeature: '0',
		road: {
			type: '道路',
			station: 'K1373+765'
		},
		load: '公路I级',
		creatTime: '2007-12-13',
		designUnit: '湖北省交通规划设计院',
		constructionUnit: '湖北省路桥有限公司',
		supervisionUnit: ''
	})*/
</script>

<style>
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
</style>
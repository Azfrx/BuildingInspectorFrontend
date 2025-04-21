<template>
	<view>

		<view class="image-line">
			<view class="image-line-part">
				<view class="image-line-part-title">
					桥梁正面照
				</view>
				<view class="image-line-part-image">
					<image src="/static/image/zjl.png" mode="aspectFill" class="image"></image>
				</view>
			</view>

			<view class="image-line-part">
				<view class="image-line-part-title">
					桥梁立面照
				</view>
				<view class="image-line-part-image">
					<image src="/static/image/zjl.png" mode="aspectFill" class="image"></image>
				</view>

			</view>
		</view>

		<view class="image-line">
			<view class="image-line-part">
				<view class="image-line-part-title">
					桥梁正面照
				</view>
				<view class="image-line-part-image">
					<image src="/static/image/zjl.png" mode="aspectFill" class="image"></image>
				</view>
			</view>

			<view class="image-line-part">
				<view class="image-line-part-title">
					桥梁立面照
				</view>
				<view class="image-line-part-image">
					<image src="/static/image/zjl.png" mode="aspectFill" class="image"></image>
				</view>

			</view>
		</view>


		<view class="line">
			<view class="line-title">
				桥梁工程师
			</view>
			<view class="line-content">
				{{data.engineer}}
			</view>

		</view>

		<view class="line">
			<view class="line-title">
				填卡人
			</view>
			<view class="line-content">
				{{data.filler}}
			</view>

		</view>

		<view class="line">
			<view class="line-title">
				填卡时间
			</view>
			<view class="line-content">
				{{data.date}}
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";

	const data = ref({
		engineer: '张三', //桥梁工程师
		filler: '李四', //填卡人
		date: '2024-11', //填卡时间
	})
</script>

<style scoped>
	.image-line {
		display: flex;
		border-bottom: 1rpx solid #eee;
	}

	.image-line-part {
		width: 50%;
		padding: 20rpx;
	}

	.image-line-part-title {
		font-size: 18px;
		color: #666666;
	}

	.image-line-part-image {
		margin-top: 12rpx;
	}

	.image {
		width: 120rpx;
		height: 120rpx;
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

	.line-content-middle {
		margin-left: 10rpx;
		margin-right: 10rpx;
		color: #BDCBE0;
	}
</style>
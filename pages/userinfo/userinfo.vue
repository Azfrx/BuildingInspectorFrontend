<template>
	<view class="userinfo">
		<view class="userinfo-photoBox">
			<image class="userinfo-photoBox-photo" :src="photoSrc" @click="changePhoto"></image>
		</view>
		<infoItem v-for="(item, index) in userinfo" :key="index" :infoKey="item.key" :infoValue="item.value"></infoItem>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import infoItem from '@/components/infoItem.vue';
	const userinfo = ref([{
		key: "姓名",
		value: "西工院检测05"
	}, {
		key: "编号",
		value: "xigy05",
	}, {
		key: "手机号码",
		value: "12345678901",
	}, {
		key: "权属单位",
		value: "陕西交控工程技术有限公司",
	}]);
	const photoSrc = ref("/static/image/zjl.png");
	const changePhoto = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				photoSrc.value = res.tempFilePaths[0];
			},
			fail: (err) => {
				console.error('头像选择失败', err);
			}
		});
	}
</script>

<style>
	.userinfo {
		width: 100%;
		height: calc(100vh - var(--window-top)); /* 剩余可用高度 */
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: #f4f4f4;
	}

	.userinfo-photoBox {
		width: 100%;
		height: 15%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.userinfo-photoBox-photo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}
	/* 适配 iPad（768px 以上） */
	@media screen and (min-width: 768px) {}
	
	/* 适配 iPad Pro（1024px 以上） */
	@media screen and (min-width: 1024px) {
		.userinfo-photoBox-photo{
			width: 200rpx;
			height: 200rpx;
		}
	}
</style>
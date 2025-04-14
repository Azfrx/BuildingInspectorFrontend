<template>
	<uni-swipe-action :ref="el => swipeAction = el">
		<uni-swipe-action-item :right-options="swipeOptions" @click="handleSwipeClick" @change="swipeChange">
			<view class="disease-item" @click="handleItemClick">
				<!-- 选择框区域 -->
				<view v-if="selectMode" class="select-area">
					<view :class="['select-circle', isSelected ? 'selected' : '']">
						<view v-if="isSelected" class="select-inner"></view>
					</view>
				</view>
				
				<view :class="['disease-content', selectMode ? 'with-select' : '']">
					<view class="item-header">
						<text class="title">{{item.partType}}/{{item.partNumber}}/{{item.disease}}</text>
					</view>
					<view class="description-row">
						<view class="description">
							<text class="label">病害描述：</text>
							<text>{{item.description}}</text>
<!--              <text>{{item.disease}}</text>-->
<!--						  <text v-if="item.length != null && item.width !=null">,S={{item.length}}*{{item.width}}cm²</text>-->
						</view>
						<view class="count">
							<text class="label">缺损数量：</text>
							<text>{{item.count}}</text>
						</view>
					</view>
					<view class="item-footer">
						<view class="collect-time">
							<text class="label">采集时间：</text>
							<text>{{item.collectTime}}</text>
						</view>
						<!-- <view class="grade">
							<text class="label">评定标度：</text>
							<text>{{item.grade}}</text>
						</view> -->
						<view class="grade-reference">
							<text class="label">评定标度/参考评定：</text>
							<text>{{item.grade}}/{{item.reference}}</text>
						</view>
					</view>
					<image class="image-icon" src="/static/image/disease.png" mode="aspectFit"></image>
				</view>
			</view>
		</uni-swipe-action-item>
	</uni-swipe-action>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// 声明props
const props = defineProps({
	item: {
		type: Object,
		default: () => ({
      id: '',
      partType: '',
      partNumber: '',
      disease: '',
			title: '',
			description: '',
			count: '',
			collectTime: '',
			grade: '',
			reference: '',
			type: ''
		})
	},
	selectMode: {
		type: Boolean,
		default: false
	},
	selected: {
		type: Boolean,
		default: false
	}
});

// 声明emit
const emit = defineEmits(['delete', 'select', 'swipe-opened']);

// 数据部分
const isSelected = ref(false);
const swipeAction = ref(null);
const swipeOptions = [
	{
		text: '取消',
		style: {
			backgroundColor: '#909399'
		}
	},
	{
		text: '编辑',
		style: {
			backgroundColor: '#409EFF'
		}
	},
	{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}
];

// 监听selected属性变化
watch(() => props.selected, (val) => {
	isSelected.value = val;
});

// 创建时初始化
onMounted(() => {
	isSelected.value = props.selected;
});

// 方法
const handleSwipeClick = (e) => {
	// 按钮点击事件，后续可实现功能
	if(e.index === 0){
		closeSwipe();
	}
	if(e.index === 1){
    // 打开编辑病害页面，并通过URL参数传递病害数据
    const itemData = encodeURIComponent(JSON.stringify(props.item));
    uni.navigateTo({
      url: `/pages/add-disease/add-disease?mode=edit&id=${props.item.id}&data=${itemData}`
    });
	}
	if(e.index === 2){
		emit('delete', props.item.id);
		closeSwipe();
	}
};

const handleItemClick = () => {
	if (props.selectMode) {
		isSelected.value = !isSelected.value;
		emit('select', {
			item: props.item,
			selected: isSelected.value
		});
	}
};

const closeSwipe = () => {
	if (swipeAction.value) {
		swipeAction.value.closeAll();
	}
};

const swipeChange = (e) => {
	if (e.open) {
		emit('swipe-opened', props.item.id);
	}
};
</script>

<style scoped>
.disease-item {
	position: relative;
	padding: 10rpx;
	background-color: #FFFFFF;
	border-bottom: 1rpx solid #EEEEEE;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.select-area {
	width: 40rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 8rpx;
}

.select-circle {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	border: 1px solid #cccccc;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.selected {
	background-color: #0F4687;
	border-color: #0F4687;
}

.select-inner {
	position: absolute;
	width: 12rpx;
	height: 6rpx;
	border-left: 2rpx solid #ffffff;
	border-bottom: 2rpx solid #ffffff;
	transform: rotate(-45deg);
	top: 6rpx;
}

.disease-content {
	flex: 1;
}

.item-header {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.title {
	font-size: 20rpx;
	color: #333333;
	font-weight: 600;
}

.description-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 6rpx;
}

.description {
	font-size: 15rpx;
	color: #666666;
	line-height: 1.5;
	flex: 3;
}

.count {
	font-size: 15rpx;
	color: #666666;
  margin-right: 8rpx;
	flex: 1;
	text-align: right;
}

.item-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.collect-time {
	font-size: 15rpx;
	color: #666666;
	flex: 2;
	padding-right: 10rpx;
}

.grade {
	font-size: 15rpx;
	color: #666666;
	flex: 0.8;
	text-align: center;
}

.reference {
	font-size: 15rpx;
	color: #666666;
	flex: 0.8;
	text-align: right;
}
.grade-reference{
  font-size: 15rpx;
  color: #666666;
  flex: 1;
  text-align: right;
  margin-right: 8rpx;
}

.label {
	color: #999999;
}

.image-icon {
	position: absolute;
	top: 10rpx;
  right: 16rpx;
	width: 25rpx;
	height: 25rpx;
}
</style>
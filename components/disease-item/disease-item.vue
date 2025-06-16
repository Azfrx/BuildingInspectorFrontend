<template>
  <uni-swipe-action :ref="el => swipeAction = el" v-if="editMode !== 'history'">
		<uni-swipe-action-item :right-options="swipeOptions" @click="handleSwipeClick" @change="swipeChange">
			<view class="disease-item" @click="handleItemClick">
				<!-- 选择框区域 -->
				<view v-if="selectMode" class="select-area">
					<view :class="['select-circle', isSelected ? 'selected' : '']">
						<view v-if="isSelected" class="select-inner"></view>
					</view>
				</view>

        <view class="disease-content" @click="selectMode ? null : editDisease()">
					<view class="item-header">
						<text class="title">{{item.component.name}}/{{item.type}}</text>
					</view>
					<view class="content-container">
						<view class="left-column">
							<view class="info-row">
								<text class="label">病害描述：</text>
								<text class="description-text">{{item.description}}</text>
							</view>
							<view class="info-row">
								<text class="label">采集时间：</text>
								<text>{{item.createTime}}</text>
							</view>
						</view>
						<view class="right-column">
							<view class="info-row">
								<text class="label">缺损数量：</text>
								<text>{{item.quantity}}</text>
							</view>
							<view class="info-row">
								<text class="label">评定标度/参考评定：</text>
								<text>{{item.participateAssess === '1' ? '是' : '否'}}/{{item.participateAssess === '1' ? item.level : '-'}}</text>
							</view>
						</view>
					</view>
					<image class="image-icon" src="/static/image/disease.png" mode="aspectFit"></image>
				</view>
			</view>
		</uni-swipe-action-item>
	</uni-swipe-action>

  <!-- 历史病害模式下不可滑动的版本 -->
  <view v-else class="disease-item" @click="handleItemClick">
    <!-- 选择框区域 -->
    <view v-if="selectMode" class="select-area">
      <view :class="['select-circle', isSelected ? 'selected' : '']">
        <view v-if="isSelected" class="select-inner"></view>
      </view>
    </view>

    <view class="disease-content" @click="selectMode ? null : editDisease()">
      <view class="item-header">
        <text class="title">{{item.component.name}}/{{item.type}}</text>
      </view>
      <view class="content-container">
        <view class="left-column">
          <view class="info-row">
            <text class="label">病害描述：</text>
            <text class="description-text">{{item.description}}</text>
          </view>
          <view class="info-row">
            <text class="label">采集时间：</text>
            <text>{{item.createTime}}</text>
          </view>
        </view>
        <view class="right-column">
          <view class="info-row">
            <text class="label">缺损数量：</text>
            <text>{{item.quantity}}</text>
          </view>
          <view class="info-row">
            <text class="label">评定标度/参考评定：</text>
            <text>{{item.participateAssess === '1' ? '是' : '否'}}/{{item.participateAssess === '1' ? item.level : '-'}}</text>
          </view>
        </view>
      </view>
      <image class="image-icon" src="/static/image/disease.png" mode="aspectFit"></image>
    </view>
  </view>

</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// 声明props
const props = defineProps({
	item: {
		type: Object,
		default: () => ({
      "createBy": "crh@znjc",
      "createTime": "2023-05-02 16:52:18",
      "updateTime": "2023-05-02 16:52:17",
      "id": 54,
      "diseaseType": {
        "id": 17,
        "code": "5.2.1-3",
        "name": "焊缝开裂",
        "maxScale": 5,
        "minScale": 1,
        "status": "0"
      },
      "diseaseTypeId": 17,
      "description": "焊缝部位涂层有大量裂纹，受拉翼缘边焊缝存在裂缝，其他部位焊缝无裂缝，主梁、纵横梁受拉翼缘边焊缝开裂长度≤5mm",
      "developmentTrend": "稳定",
      "level": 2,
      "quantity": 1,
      "type": "焊缝开裂",
      "participateAssess": "0",
      "deductPoints": 35,
      "biObjectId": 709,
      "projectId": 2,
      "component": {
        "createBy": "admin",
        "createTime": "2025-04-21 16:53:39",
        "updateTime": "2025-04-21 16:53:38",
        "id": 244,
        "code": "R-1-1#上部承重构件（主梁、挂梁）",
        "name": "上部承重构件（主梁、挂梁）1",
        "biObjectId": 709,
        "status": "0",
        "delFlag": "0",
        "biObject": {
          "id": 709,
          "name": "上部承重构件（主梁、挂梁）",
          "count": 0
        },
        "parentObjectName": "上部结构"
      },
      "componentId": 244,
      "buildingId": 37
    })
	},
	selectMode: {
		type: Boolean,
		default: false
	},
	selected: {
		type: Boolean,
		default: false
	},
  editMode: {
    type: String,
    default: 'history'
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

const editDisease = () => {
  // 打开编辑病害页面，并通过URL参数传递病害数据
  const itemData = encodeURIComponent(JSON.stringify(props.item));
  uni.navigateTo({
    url: `/pages/add-disease/add-disease?mode=${props.editMode}&id=${props.item.id}&data=${itemData}`
  });
};

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
		// 确认删除
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这条病害记录吗？',
			success: (res) => {
				if (res.confirm) {
					// 创建删除数据对象
					const deleteData = {
						id: props.item.id,
					};
					
					// 使用事件发送删除请求
					console.log('准备发送deleteDisease事件，ID:', props.item.id);
					uni.$emit('deleteDisease', deleteData);
					
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
				}
			}
		});
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
	padding: 10rpx 10rpx 2rpx 10rpx;
	background-color: #FFFFFF;
	border-bottom: 1rpx solid #EEEEEE;
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	box-sizing: border-box;
	overflow: hidden;
}

.select-area {
	flex-shrink: 0;
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
	position: relative;
	min-width: 0;
}

.item-header {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
	width: 100%;
}

.title {
	font-size: 20rpx;
	color: #333333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 70%;
	display: inline-block;
}

.content-container {
	display: flex;
	width: 100%;
}

.left-column {
	flex: 0 0 65%;
	max-width: 65%;
	overflow: hidden;
}

.right-column {
	flex: 0 0 35%;
	max-width: 35%;
	overflow: hidden;
}

.info-row {
	display: flex;
	font-size: 15rpx;
	color: #666666;
	margin-bottom: 8rpx;
	align-items: flex-start;
	min-width: 0;
}

.left-column .info-row {
	width: 100%;
}

.right-column .info-row {
	justify-content: flex-end;
	text-align: right;
	width: 100%;
}

.label {
	color: #999999;
	flex-shrink: 0;
}

.description-text {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 65%;
	display: inline-block;
}

.image-icon {
	position: absolute;
	top: 0;
	right: 10rpx;
	width: 25rpx;
	height: 25rpx;
}
</style>
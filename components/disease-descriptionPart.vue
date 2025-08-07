<template>
	<view>
		<view class="head">
			<view class="head-text">
				病害定性数据
			</view>
		</view>

		<view class="input-area">
			<view class="input-area-title">
				<text style="color: red;">*</text>
				<view>病害描述</view>
				<view class="input-right-button" @click="createDescription()">生成病害描述</view>
			</view>
			<textarea class="input-area-content" v-model="description" placeholder="请填写病害信息" auto-height="" />
		</view>

		<view class="line-select">
			<view class="line-select-left">
				<text style="color: red;">*</text>
				<view>发展趋势</view>
			</view>
			<view class="line-select-right">
				<uni-data-checkbox mode="tag" v-model="developmentTrendIndex"
					:localdata="developmentTrend"></uni-data-checkbox>
			</view>
		</view>

		<view class="line-select">
			<view class="line-select-left">
				<text style="color: red;">*</text>
				<view>参与评定</view>
			</view>
			<view class="line-select-right">
				<uni-data-checkbox mode="tag" v-model="participateAssessindex"
					:localdata="participateAssess"></uni-data-checkbox>
			</view>
		</view>

		<view class="line-select" v-show="participateAssessindex == 1">
			<view class="line-select-left">
				<text style="color: red;">*</text>
				<view>评定标度</view>
        <image src="/static/image/diseaseHelp.png" @click="showDiseaseHelp" class="disease-help"></image>
			</view>
			<view class="line-select-right">
				<uni-data-checkbox mode="tag" v-model="levelindex" :localdata="level"></uni-data-checkbox>
			</view>
		</view>

		<view class="line-select">
			<view class="line-select-left">
				<text style="color: red;">*</text>
				<view>病害性质</view>
			</view>
			<view class="line-select-right">
				<uni-data-checkbox mode="tag" v-model="natureindex" :localdata="nature"></uni-data-checkbox>
			</view>
		</view>

    <uni-popup ref="diseaseHelpPopup" type="center">
      <view class="diseaseHelp-popup-content">
        <view class="popup-title">病害标度信息</view>
        <view class="popup-input1">
          <text class="popup-input1-title">病害标度</text>
          <view class="popup-input1-content">
            定性描述
          </view>
          <view class="popup-input1-content">
            定量描述
          </view>
        </view>
        <view class="popup-input1" v-for="item in diseaseHelpList">
          <text class="popup-input1-title">{{ item.scale }}</text>
          <view class="popup-input1-content">
            {{ item.qualitative_description }}
          </view>
          <view class="popup-input1-content">
            {{item.quantitative_description}}
          </view>
        </view>
        <view class="popup-button">
          <button class="popup-button-confirm" @click="confirmDiseaseHelp">确定</button>
        </view>
      </view>
    </uni-popup>

	</view>
</template>

<script setup>
import {
  computed,
  onMounted, onUnmounted,
  ref
} from 'vue';
	import {
		generateDiseaseDescription
	} from '@/utils/diseaseDescriptionCreate.js'
import { getDiseaseScale } from '@/utils/diseaseHelp.js';

	//病害描述
	const description = ref('');

	//病害性质
	const natureindex = ref(0);
	const nature = ref([{
		text: '非结构病害',
		value: 0
	}, {
		text: '结构病害',
		value: 1
	}]);
	const participateAssessindex = ref(1);
	//参与评定
	const participateAssess = ref([{
		text: '是',
		value: 1
	}, {
		text: '否',
		value: 0
	}]);

	//评定标度
	const level = ref([{
		text: '1',
		value: 1
	}, {
		text: '2',
		value: 2
	}, {
		text: '3',
		value: 3
	}, {
		text: '4',
		value: 4
	}, {
		text: '5',
		value: 5
	}]);
	const levelindex = ref(1);
	const scale = ref({
		min: 1,
		max: 5
	});

	const developmentTrend = ref([{
			text: '新增',
			value: 0
		},
		{
			text: '稳定',
			value: 1
		},
		{
			text: '发展',
			value: 2
		},
		{
			text: '已维修',
			value: 3
		},
		{
			text: '部分维修',
			value: 4
		}, {
			text: '未找到',
			value: 5
		}
	])
	const developmentTrendIndex = ref(0);

  const diseaseHelpList = ref([])

  const diseaseHelpPopup = ref();
  const confirmDiseaseHelp = () => {
    diseaseHelpPopup.value.close();
  }
  const showDiseaseHelp = () => {
    diseaseHelpPopup.value.open();
  }

	onMounted(() => {
		uni.$on('changeScale', changeScale);

		uni.$on('setDescription1', setDescription1);
		uni.$on('setDescription2', setDescription2);
		uni.$on('setDescriptionByEmit', setDescriptionByEmit);
		uni.$on('setLevel', setLevel);
		uni.$on('setNature', setNature);
		uni.$on('setParticipateAssess', setParticipateAssess);
		uni.$on('setDevelopmentTrend', setDevelopmentTrend)
    uni.$on('setDiseaseHelp', setDiseaseHelp)
	})

  onUnmounted(() => {
    uni.$off('changeScale');
    uni.$off('setDescription1');
    uni.$off('setDescription2');
    uni.$off('setDescriptionByEmit');
    uni.$off('setLevel');
    uni.$off('setNature');
    uni.$off('setParticipateAssess');
    uni.$off('setDevelopmentTrend');
    uni.$off('setDiseaseHelp');
  })
  const setDiseaseHelp = (emitDiseaseCode) => {
    const parts = emitDiseaseCode.split('-'); // 按 '-' 分割成数组
    const formattedCode = parts.slice(0, 2).join('-'); // 取前两部分并用 '-' 重新连接
    diseaseHelpList.value = getDiseaseScale(formattedCode);
  }
	const setDevelopmentTrend = (emitDevelopmentTrend) => {
		developmentTrendIndex.value = developmentTrend.value.findIndex(item => item.text === emitDevelopmentTrend);
	}

	const setParticipateAssess = (emitParticipateAssess) => {
		participateAssessindex.value = emitParticipateAssess === "0" ? 0 : 1;
	}

	const setNature = (emitNature) => {
		const natureItem = nature.value.find(item => item.text === emitNature);
		if (natureItem) {
			natureindex.value = natureItem.value;
		}
	}

	const setLevel = (emitLevel) => {
		levelindex.value = emitLevel
	}

	const setDescriptionByEmit = (emitDescription) => {
		description.value = emitDescription
	}

	const changeScale = (props) => {
		if (props) {
			scale.value.min = props.minScale;
			scale.value.max = props.maxScale;
			// 更新评定标度
			level.value = [];
			for (let i = scale.value.min; i <= scale.value.max; i++) {
				level.value.push({
					text: i.toString(),
					value: i
				});
			}
			levelindex.value = scale.value.min;
		}
	}
	const description1 = ref({});
	const setDescription1 = (description) => {
		description1.value = description
	}
	const description2 = ref({});
	const setDescription2 = (description) => {
		description2.value = description
	}

	const createDescription = () => {
		uni.$emit('getDescription');
		console.log("description1.value", description1.value);
		console.log("description2.value", description2.value);
		const createDescription = generateDiseaseDescription({
			componentName: description1.value.componentName, // 构件名称
			componentCode: description1.value.componentCode, // 构件编号
			diseaseType: description1.value.type, // 病害类型
			diseasePosition: description1.value.position, // 病害位置
      showColumns: description2.value.showColumns, // 是否显示裂缝特征
      crackType: description2.value.crackType, // 裂缝特征
			defects: description2.value.defects, // 病害定量数据数组
			counts: description2.value.counts, // 缺损数量
      units: description2.value.units,// 单位
      threshold: description2.value.threshold,// 阈值
		})
		description.value = createDescription
	}

	const participateAssessindexToString = computed(() => {
		return participateAssessindex.value.toString()
	})
	const natureSeletedText = computed(() => {
		return nature.value[natureindex.value].text
	})
	const parseIntLevel = computed(() => {
		return parseInt(levelindex.value) || 1
	})
	const developmentTrendSeletedText = computed(() => {
		return developmentTrend.value[developmentTrendIndex.value].text
	})

	defineExpose({
		description: description,
		participateAssess: participateAssessindexToString,
		nature: natureSeletedText,
		level: parseIntLevel,
		developmentTrend: developmentTrendSeletedText,
	});
</script>

<style scoped>
	.head {
		background-color: #BDCBE0;
	}

	.head-text {
		padding: 4rpx 10rpx;
		font-size: 18rpx;
	}

	.input-area {
		padding: 12rpx 16rpx;
		border-bottom: 1rpx solid #eee;
	}

	.input-area-title {
		font-size: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #666666;
	}

	.input-area-content {
		margin-top: 10rpx;
		font-size: 20rpx;
		width: 100%;
	}

	.input-right-button {
		background-color: #0F4687;
		border-radius: 5rpx;
		color: #fff;
		margin-left: auto;
		padding: 8rpx 14rpx;
		font-size: 16rpx;
	}

	.line-select {
		font-size: 18rpx;
		padding: 8rpx 14rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #eee;
	}

	.line-select-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 20rpx;
		color: #666666;
	}

	.line-select-right {}



	/* 深度穿透组件样式 */
	::v-deep .uni-data-checklist .checklist-box {
		min-height: 20rpx !important;
		min-width: 60rpx !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
	}

	/* 单独处理文本容器 */
	::v-deep .uni-data-checklist .checklist-box .checklist-content {
		line-height: 1 !important;
		/* 重置行高 */
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		width: 100% !important;
		/* 确保文本容器占满父级 */
	}

	/* 确保外部容器不滚动 */
	view {
		box-sizing: border-box;
	}
  .disease-help {
    height: 20rpx;
    width: 20rpx;
  }
  .diseaseHelp-popup-content {
    background-color: #fff;
    width: 700rpx;
    max-height: 80vh;
    min-height: 200rpx;
    border-radius: 8rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .popup-title {
    background-color: #BDCBE0;
    font-size: 20rpx;
    padding: 8rpx 0rpx;
    text-align: center;
    flex-shrink: 0;
  }
  .popup-input1 {
    display: flex;
    align-items: flex-start;
    padding: 10px 10rpx;
    border-bottom: 1rpx solid #eee;
    flex-shrink: 0;
  }
  .popup-input1-title {
    font-size: 20rpx;
    min-width: 80rpx;
    text-align: center;
  }
  .popup-input1-content {
    flex: 1;
    margin-left: 30rpx;
    font-size: 20rpx;
    word-wrap: break-word;
    line-height: 1.4;
  }
  .popup-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30rpx;
	margin-bottom: 10rpx;
    flex-shrink: 0;
  }
  .popup-button-confirm {
    background-color: #1677FF;
    color: #fff;
  }

</style>
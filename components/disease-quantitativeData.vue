<template>
	<view>
		<view class="head">
			<view class="head-text">
				病害定量数据
			</view>
		</view>

		<view class="quantitative-data">
			<view class="quantitative-data-left">
				<text class="picker-must">*</text>
				<view>缺损数量</view>
			</view>
			<view class="quantitative-data-right">
				<view class="quantitative-data-right-value">
					<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
						v-model="quantity">
					<view class="clear-input" @click="clearQuantity">×</view>
				</view>
				<view class="quantitative-data-right-unit">
					<view class="quantitative-data-right-unit-input"> 个
					</view>
				</view>
			</view>
		</view>

		<view class="line-select" v-show="showColumns[0] == 1" >
			<view class="line-select-left">
				<text style="color: red;">*</text>
				<view>裂缝特征</view>
			</view>
			<view class="line-select-right">
				<uni-data-checkbox mode="tag" v-model="crackTypeIndex"
					:localdata="crackTypeOptions"></uni-data-checkbox>
			</view>
		</view>

		<!-- 使用v-for循环生成多组定量数据输入框 -->
		<view v-for="(diseaseData, index) in diseaseDataList" :key="index" class="">
			<!-- 如果缺损数量大于1，显示缺损编号 -->
			<view v-if="diseaseDataList.length > 1" class="disease-index-title">
				缺损-{{index + 1}}
			</view>


			<view class="location-description">
				<view class="location-description-left">
					据参考面1位置
				</view>
				<view class="location-description-right">
					距
					<view class="location-description-right-position" @click="openReferenceSurfacePopup(1, index)">
						<view class="location-description-right-position-input"
							:style="!diseaseData.reference1Location ? 'color: #CCCCCC;' : ''">
							{{ diseaseData.reference1Location || "请选择" }}
						</view>
						<view class="right-icon">&gt;</view>
					</view>
					<view class="reference-start">
						<input type="number" placeholder="起点位置" v-model="diseaseData.reference1LocationStart">
						<view class="clear-input" @click="clearReferenceSurfaceStart(index, 1)">×</view>
					</view>
					<view class="reference-end">
						<input type="number" placeholder="终点位置" v-model="diseaseData.reference1LocationEnd">
						<view class="clear-input" @click="clearReferenceSurfaceEnd(index, 1)">×</view>
					</view>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> m
						</view>
					</view>
				</view>
			</view>

			<view class="location-description">
				<view class="location-description-left">
					据参考面2位置
				</view>
				<view class="location-description-right">
					距
					<view class="location-description-right-position" @click="openReferenceSurfacePopup(2, index)">
						<view class="location-description-right-position-input"
							:style="!diseaseData.reference2Location ? 'color: #CCCCCC;' : ''">
							{{ diseaseData.reference2Location || "请选择" }}
						</view>
						<view class="right-icon">&gt;</view>
					</view>
					<view class="reference-start">
						<input type="number" placeholder="起点位置" v-model="diseaseData.reference2LocationStart">
						<view class="clear-input" @click="clearReferenceSurfaceStart(index, 2)">×</view>
					</view>
					<view class="reference-end">
						<input type="number" placeholder="终点位置" v-model="diseaseData.reference2LocationEnd">
						<view class="clear-input" @click="clearReferenceSurfaceEnd(index, 2)">×</view>
					</view>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> m
						</view>
					</view>
				</view>
			</view>

			<!-- 长度 - 根据模式显示不同的输入框 -->
			<view class="quantitative-data" v-show = "showColumns[1] == 1">
				<view class="quantitative-data-left">
					长度
				</view>
				<view class="quantitative-data-right">
					<!-- 范围模式 -->
					<template v-if="diseaseData.useRangeMode">
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最小值" type="number"
									v-model="diseaseData.lengthRangeStart">
								<view class="clear-input" @click="diseaseData.lengthRangeStart = ''">×</view>
							</view>
							<view class="range-separator">-</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最大值" type="number"
									v-model="diseaseData.lengthRangeEnd">
								<view class="clear-input" @click="diseaseData.lengthRangeEnd = ''">×</view>
							</view>
						</view>
					</template>
					<!-- 普通模式 -->
					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.length1">
							<view class="clear-input" @click="diseaseData.length1 = ''">×</view>
						</view>
					</template>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> m
						</view>
					</view>
				</view>
			</view>

			<!-- 宽度 - 根据模式显示不同的输入框 -->
<!--			<view class="quantitative-data">
				<view class="quantitative-data-left">
					宽度
				</view>
				<view class="quantitative-data-right">
					&lt;!&ndash; 范围模式 &ndash;&gt;
					<template v-if="diseaseData.useRangeMode">
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最小值" type="number"
									v-model="diseaseData.widthRangeStart">
								<view class="clear-input" @click="diseaseData.widthRangeStart = ''">×</view>
							</view>
							<view class="range-separator">-</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最大值" type="number"
									v-model="diseaseData.widthRangeEnd">
								<view class="clear-input" @click="diseaseData.widthRangeEnd = ''">×</view>
							</view>
						</view>
					</template>
					&lt;!&ndash; 普通模式 &ndash;&gt;
					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.width">
							<view class="clear-input" @click="diseaseData.width = ''">×</view>
						</view>
					</template>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> m</view>
					</view>
				</view>
			</view>-->

			<!-- 高度/深度 - 根据模式显示不同的输入框 -->
			<view class="quantitative-data" v-show="showColumns[5] == 1">
				<view class="quantitative-data-left">
					高度/深度
				</view>
				<view class="quantitative-data-right">
					<!-- 范围模式 -->
					<template v-if="diseaseData.useRangeMode">
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最小值" type="number"
									v-model="diseaseData.heightDepthRangeStart">
								<view class="clear-input" @click="diseaseData.heightDepthRangeStart = ''">×
								</view>
							</view>
							<view class="range-separator">-</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最大值" type="number"
									v-model="diseaseData.heightDepthRangeEnd">
								<view class="clear-input" @click="diseaseData.heightDepthRangeEnd = ''">×</view>
							</view>
						</view>
					</template>
					<!-- 普通模式 -->
					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.heightDepth">
							<view class="clear-input" @click="diseaseData.heightDepth = ''">×</view>
						</view>
					</template>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> m
						</view>
					</view>
				</view>
			</view>

			<!-- 缝宽 - 根据模式显示不同的输入框 -->
			<view class="quantitative-data" v-show="showColumns[4] == 1">
				<view class="quantitative-data-left">
					缝宽
				</view>
				<view class="quantitative-data-right">
					<!-- 范围模式 -->
					<template v-if="diseaseData.useRangeMode">
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最小值" type="number"
									v-model="diseaseData.crackWidthRangeStart">
								<view class="clear-input" @click="diseaseData.crackWidthRangeStart = ''">×
								</view>
							</view>
							<view class="range-separator">-</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最大值" type="number"
									v-model="diseaseData.crackWidthRangeEnd">
								<view class="clear-input" @click="diseaseData.crackWidthRangeEnd = ''">×</view>
							</view>
						</view>
					</template>
					<!-- 普通模式 -->
					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.crackWidth">
							<view class="clear-input" @click="diseaseData.crackWidth = ''">×</view>
						</view>
					</template>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input">
							mm
						</view>
					</view>
				</view>
			</view>

			<!-- 面积 - 根据模式显示不同的输入框 -->
			<view class="quantitative-data" v-show="showColumns[6] == 1">
				<view class="quantitative-data-left">
					面积
				</view>
				<view class="quantitative-data-right">
					<!-- 范围模式 -->
<!--					<template v-if="diseaseData.useRangeMode">-->
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
									v-model="diseaseData.areaLength">
								<view class="clear-input" @click="diseaseData.areaLength = ''">×</view>
							</view>
							<view class="range-separator">×</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
									v-model="diseaseData.areaWidth">
								<view class="clear-input" @click="diseaseData.areaWidth = ''">×</view>
							</view>
						</view>
<!--					</template>-->
					<!-- 普通模式 -->
<!--					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.area">
							<view class="clear-input" @click="diseaseData.area = ''">×</view>
						</view>
					</template>-->
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> m² </view>
					</view>
				</view>
			</view>

			<!-- 体积 - 根据模式显示不同的输入框 -->
			<view class="quantitative-data" v-show="showColumns[7] == 1">
				<view class="quantitative-data-left">
					变形/位移
				</view>
				<view class="quantitative-data-right">
					<!-- 范围模式 -->
					<template v-if="diseaseData.useRangeMode">
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最小值" type="number"
									v-model="diseaseData.deformationRangeStart">
								<view class="clear-input" @click="diseaseData.deformationRangeStart = ''">×</view>
							</view>
							<view class="range-separator">-</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最大值" type="number"
									v-model="diseaseData.deformationRangeEnd">
								<view class="clear-input" @click="diseaseData.deformationRangeEnd = ''">×</view>
							</view>
						</view>
					</template>
					<!-- 普通模式 -->
					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.deformation">
							<view class="clear-input" @click="diseaseData.deformation = ''">×</view>
						</view>
					</template>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> mm
						</view>
					</view>
				</view>
			</view>

			<!-- 角度 - 根据模式显示不同的输入框 -->
			<view class="quantitative-data" v-show="showColumns[8] == 1">
				<view class="quantitative-data-left">
					角度
				</view>
				<view class="quantitative-data-right">
					<!-- 范围模式 -->
					<template v-if="diseaseData.useRangeMode">
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最小值" type="number"
									v-model="diseaseData.angleRangeStart">
								<view class="clear-input" @click="diseaseData.angleRangeStart = ''">×</view>
							</view>
							<view class="range-separator">-</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="最大值" type="number"
									v-model="diseaseData.angleRangeEnd">
								<view class="clear-input" @click="diseaseData.angleRangeEnd = ''">×</view>
							</view>
						</view>
					</template>
					<!-- 普通模式 -->
					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.angle">
							<view class="clear-input" @click="diseaseData.angle = ''">×</view>
						</view>
					</template>
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> 度
						</view>
					</view>
				</view>
			</view>

			<!-- 百分比 - 根据模式显示不同的输入框 -->
			<view class="quantitative-data" v-show="showColumns[9] == 1">
				<view class="quantitative-data-left">
					比例
				</view>
				<view class="quantitative-data-right">
					<!-- 范围模式 -->
<!--					<template v-if="diseaseData.useRangeMode">-->
						<view class="quantitative-data-right-range">
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
									v-model="diseaseData.numeratorRatio">
								<view class="clear-input" @click="diseaseData.numeratorRatio = ''">×
								</view>
							</view>
							<view class="range-separator">/</view>
							<view class="quantitative-data-right-value">
								<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
									v-model="diseaseData.denominatorRatio">
								<view class="clear-input" @click="diseaseData.denominatorRatio = ''">×</view>
							</view>
						</view>
<!--					</template>-->
					<!-- 普通模式 -->
<!--					<template v-else>
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="diseaseData.percentage">
							<view class="clear-input" @click="diseaseData.percentage = ''">×</view>
						</view>
					</template>-->
					<view class="quantitative-data-right-unit">
						<view class="quantitative-data-right-unit-input"> %
						</view>
					</view>
				</view>
			</view>

			<!--			<view class="line-select">
				<view class="line-select-left">
					<text style="color: red;">*</text>
					<view>发展趋势</view>
				</view>
				<view class="line-select-right">
					<uni-data-checkbox mode="tag" v-model="diseaseData.developmentTrendIndex"
						:localdata="developmentTrend"></uni-data-checkbox>
				</view>
			</view>
		</view>-->

			<uni-popup ref="referenceSurfacePopup" type="center">
				<view class="location-description-position-popup-content">
					<view class="location-description-position-popup-title">参考面选择</view>
					<view class="location-description-position-popup-input1">
						<input type="text" placeholder="请填写" class="location-description-popup-input"
							v-model="referenceSurfaceInput" />
						<button class="location-description-popup-button"
							@click="confirmreferenceSurfaceInput">确定</button>
					</view>
					<view class="location-description-position-popup-input3">
						<view v-for="(item, index) in referenceSurfaceOptions" :key="index"
							class="location-description-position-popup-input3-item"
							@click="selectReferenceSurfaceItem(item)">
							{{item}}
						</view>
					</view>
				</view>
			</uni-popup>

		</view>

	</view>
</template>

<script setup>
	// 添加一个数组来存储多个缺损的数据
  import {
    computed,
    onMounted,
    ref,
    watch
  } from "vue";

	const diseaseDataList = ref([]);

	// 缺损数量
	const quantity = ref(1);

	const crackTypeOptions = ref([{
			text: '纵向',
			value: 0
		},
		{
			text: '横向',
			value: 1
		},
		{
			text: '斜向',
			value: 2
		},
		{
			text: 'L型',
			value: 3
		},
		{
			text: 'U型',
			value: 4
		},{
    text: '网状',
    value: 5
    }
	])
	const crackTypeIndex = ref(0);

	/*	const developmentTrend = ref([{
				text: '稳定',
				value: 0
			},
			{
				text: '发展',
				value: 1
			},
			{
				text: '新增',
				value: 2
			},
			{
				text: '已维修',
				value: 3
			}
		])*/

	// 添加当前编辑的缺损索引
	const currentDiseaseIndex = ref(0);

	// 参考面弹窗引用
	const referenceSurfacePopup = ref(null);

	// 当前选择的是参考面1还是参考面2
	const currentReferenceSurface = ref(1);

	// 参考面输入框的值
	const referenceSurfaceInput = ref('');

	// 参考面选项列表
	const referenceSurfaceOptions = ref([]);

	const positionProps = ref('')

  const selectedColumn = ref(0)

  const showColumns = ref([])

	// 添加onMounted处理可能的初始值
	onMounted(() => {
    updateDiseaseDataList(1);
    uni.$on('setPositionProps', setPositionProps)
    uni.$on('getDescription', getDescription);
    uni.$on('setQuantity', setQuantity);
    uni.$on('setDiseaseDataList', setDiseaseDataList);
    uni.$on('setCrackType', setCrackType);
    uni.$on('setSelectColumn', setSelectColumn)
  })
  const setSelectColumn = (emitSelectColumn) => {
    console.log('setSelectColumn:', emitSelectColumn)
    selectedColumn.value = emitSelectColumn || 0
    showColumns.value = selectedColumn.value.toString(2).padStart(10, '0').split('').reverse();
    console.log('showColumns:', showColumns.value)
  }

	const setCrackType = (crack) => {
		crackTypeIndex.value = crackTypeOptions.value.findIndex(item => item.text === crack)
	}

	const setQuantity = (num) => {
		quantity.value = num
	}

	const setDiseaseDataList = (list) => {
		diseaseDataList.value = list
	}

	const setPositionProps = (props) => {
		console.log('设置positionProps:', props)
		positionProps.value = props
	}

	//传递病害描述所需数据
	const getDescription = () => {
		const description = {
      crackType: crackType.value, // 裂缝特征
      showColumns: showColumns.value, //判断是否显示裂缝特征
			defects: diseaseDataList.value, // 病害定量数据数组
			counts: quantity.value, // 病害数量
		};
		uni.$emit('setDescription2', description);
	}

	// 监听缺损数量变化，动态更新diseaseDataList
	watch(quantity, (newValue) => {
		const numValue = parseInt(newValue);
		if (isNaN(numValue) || numValue <= 0) {
			// 如果输入无效，设为默认值1
			updateDiseaseDataList(1);
		} else if (numValue >= 10) {
			// 限制最大数量为10，并且使用范围输入模式
			quantity.value = numValue;
			updateDiseaseDataList(numValue);
		} else {
			updateDiseaseDataList(numValue);
		}
	});

	// 更新缺损数据列表
	const updateDiseaseDataList = (count) => {
		// 保存现有数据
		const existingData = [...diseaseDataList.value];

		// 创建新的数据列表
		const newList = [];

		// 自动判断是否使用范围模式
		const useRangeMode = count >= 10;
		console.log(`数量: ${count}, 使用范围模式: ${useRangeMode}`);

		// 如果数量大于等于10，只创建一条记录，使用范围模式
		if (useRangeMode) {
			// 如果已有数据，尝试保留第一条的值作为范围的起始值
			const firstItem = existingData.length > 0 ? existingData[0] : null;
			console.log('范围模式，使用第一条记录作为基础:', firstItem ? firstItem : 'null');

			newList.push({
				reference1Location: firstItem?.reference1Location || '',
				reference1LocationStart: firstItem?.reference1LocationStart || '',
				reference1LocationEnd: firstItem?.reference1LocationEnd || '',
				reference2Location: firstItem?.reference2Location || '',
				reference2LocationStart: firstItem?.reference2LocationStart || '',
				reference2LocationEnd: firstItem?.reference2LocationEnd || '',
				// 范围输入字段 - 保留现有的范围数据
				lengthRangeStart: firstItem?.lengthRangeStart || firstItem?.length || '',
				lengthRangeEnd: firstItem?.lengthRangeEnd || '',
/*				widthRangeStart: firstItem?.widthRangeStart || firstItem?.width || '',
				widthRangeEnd: firstItem?.widthRangeEnd || '',*/
				heightDepthRangeStart: firstItem?.heightDepthRangeStart || firstItem?.heightDepth || '',
				heightDepthRangeEnd: firstItem?.heightDepthRangeEnd || '',
				crackWidthRangeStart: firstItem?.crackWidthRangeStart || firstItem?.crackWidth || '',
				crackWidthRangeEnd: firstItem?.crackWidthRangeEnd || '',
				areaLength: firstItem?.areaLength ||  '',
				areaWidth: firstItem?.areaWidth || '',
				deformationRangeStart: firstItem?.deformationRangeStart || firstItem?.deformation || '',
				deformationRangeEnd: firstItem?.deformationRangeEnd || '',
				angleRangeStart: firstItem?.angleRangeStart || firstItem?.angle || '',
				angleRangeEnd: firstItem?.angleRangeEnd || '',
				numeratorRatio: firstItem?.numeratorRatio || firstItem?.percentage || '',
				denominatorRatio: firstItem?.denominatorRatio || '',
				// 保留原有字段为空
				length1: '',
				// width: '',
				heightDepth: '',
				crackWidth: '',
				// area: '',
				deformation: '',
				angle: '',
				// percentage: '',
				// crackTypeIndex: firstItem?.crackTypeIndex || 0,
				// developmentTrendIndex: firstItem?.developmentTrendIndex || 0,
				useRangeMode: true
			});

			console.log('更新后的范围模式数据:', newList[0]);
		} else {
			// 正常模式，为每个缺损创建一条记录
			for (let i = 0; i < count; i++) {
				// 如果有现有数据，保留它
				if (i < existingData.length) {
					// 如果之前是范围模式，需要转换回普通模式
					if (existingData[i].useRangeMode) {
						newList.push({
							reference1Location: existingData[i].reference1Location || '',
							reference1LocationStart: existingData[i].reference1LocationStart || '',
							reference1LocationEnd: existingData[i].reference1LocationEnd || '',
							reference2Location: existingData[i].reference2Location || '',
							reference2LocationStart: existingData[i].reference2LocationStart || '',
							reference2LocationEnd: existingData[i].reference2LocationEnd || '',
							// 使用Min值作为普通模式的值
							length1: existingData[i].lengthRangeStart || '',
							// width: existingData[i].widthRangeStart || '',
							heightDepth: existingData[i].heightDepthRangeStart || '',
							crackWidth: existingData[i].crackWidthRangeStart || '',
							areaLength: existingData[i].areaLength || '',
              areaWidth: existingData[i].areaWidth || '',
							deformation: existingData[i].deformationRangeStart || '',
							angle: existingData[i].angleRangeStart || '',
							// percentage: existingData[i].numeratorRatio || '',
							// crackTypeIndex: existingData[i].crackTypeIndex || 0,
							// developmentTrendIndex: existingData[i].developmentTrendIndex || 0,
              numeratorRatio: existingData[i].numeratorRatio || '',
              denominatorRatio: existingData[i].denominatorRatio || '',
							useRangeMode: false
						});
					} else {
						// 保持原有数据不变
						newList.push(existingData[i]);
					}
				} else {
					// 创建新的数据对象
					newList.push({
						reference1Location: '',
						reference1LocationStart: '',
						reference1LocationEnd: '',
						reference2Location: '',
						reference2LocationStart: '',
						reference2LocationEnd: '',
						length1: '',
						// width: '',
						crackWidth: '',
						heightDepth: '',
						areaLength: '',
            areaWidth: '',
						deformation: '',
						angle: '',
            numeratorRatio: '',
            denominatorRatio: '',
						// percentage: '',
						// crackTypeIndex: 0,
						// developmentTrendIndex: 0,
						useRangeMode: false
					});
				}
			}
		}

		diseaseDataList.value = newList;
	};

	// 根据文本查找索引的工具函数
	const findIndexByText = (optionsArray, targetText) => {
		if (!optionsArray || !Array.isArray(optionsArray) || !targetText) return 0;

		const index = optionsArray.findIndex(item =>
			(item.text && item.text === targetText) || item === targetText
		);

		return index !== -1 ? index : 0;
	};

	// 打开参考面选择弹窗
	const openReferenceSurfacePopup = (surfaceNumber = 1, diseaseIndex = 0) => {
		console.log('打开参考面选择弹窗:', surfaceNumber, diseaseIndex)
		// 设置当前正在编辑的是参考面1还是参考面2，以及缺损索引
		currentReferenceSurface.value = surfaceNumber;
		currentDiseaseIndex.value = diseaseIndex;

		// 清空输入框
		referenceSurfaceInput.value = '';

		// 解析props中的参考面选项
		if (positionProps.value !== '') {
			const options = parsePropsForRef(positionProps.value, `ref${surfaceNumber}`);
			if (options && options.length > 0) {
				referenceSurfaceOptions.value = options;
				console.log(`解析到参考面${surfaceNumber}选项:`, options);
			} else {
				// 如果没有找到对应的参考面选项，使用默认选项
				setDefaultReferenceSurfaceOptions(surfaceNumber);
			}
		} else {
			// 如果没有找到props，使用默认选项
			setDefaultReferenceSurfaceOptions(surfaceNumber);
		}

		// 打开弹窗
		referenceSurfacePopup.value[0].open();
	};

	// 设置默认参考面选项
	const setDefaultReferenceSurfaceOptions = (surfaceNumber) => {
		if (surfaceNumber === 1) {
			referenceSurfaceOptions.value = [];
		} else {
			referenceSurfaceOptions.value = [];
		}
		console.log(`使用默认参考面${surfaceNumber}选项:`, referenceSurfaceOptions.value);
	};

	// 解析props字符串中指定ref的选项
	const parsePropsForRef = (propsString, refKey) => {
		console.log('解析props字符串中指定ref的选项:', propsString, refKey)
		if (!propsString) return [];

		// 尝试解析格式为 "ref1:=小桩号面、大桩号面&&ref2:=左腹板、右腹板、内腹板、外腹板" 的字符串
		const refParts = propsString.split('&&');

		for (const refPart of refParts) {
			if (refPart.startsWith(refKey + ':=')) {
				const parts = refPart.split(':=');
				if (parts.length === 2) {
					const values = parts[1].split('、');
					return values.filter(value => value.trim() !== '');
				}
			}
		}
		return [];
	};

	// 确认参考面输入框的值
	const confirmreferenceSurfaceInput = () => {
		if (!referenceSurfaceInput.value.trim()) {
			uni.showToast({
				title: '请输入参考面',
				icon: 'none'
			});
			return;
		}

		// 根据当前编辑的是参考面1还是参考面2，设置相应的值
		if (currentReferenceSurface.value === 1) {
			diseaseDataList.value[currentDiseaseIndex.value].reference1Location = referenceSurfaceInput.value.trim();
		} else {
			diseaseDataList.value[currentDiseaseIndex.value].reference2Location = referenceSurfaceInput.value.trim();
		}

		// 关闭弹窗
		referenceSurfacePopup.value[0].close();
	};

	// 选择参考面列表中的项
	const selectReferenceSurfaceItem = (item) => {
		// 根据当前编辑的是参考面1还是参考面2，设置相应的值
		if (currentReferenceSurface.value === 1) {
			diseaseDataList.value[currentDiseaseIndex.value].reference1Location = item;
		} else {
			diseaseDataList.value[currentDiseaseIndex.value].reference2Location = item;
		}

		// 关闭弹窗
		referenceSurfacePopup.value[0].close();
	};

  const crackType = computed(() => {
    return crackTypeOptions.value[crackTypeIndex.value].text;
  })

	defineExpose({
		quantity: quantity,
		crackType: crackType,
		diseaseDataList: diseaseDataList,
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
	.picker-must {
		color: #FF0000;
	}
	.location-description {
		font-size: 20rpx;
		padding: 12rpx 16rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #eee;
	}

	.location-description-left {
		color: #666666;
		font-size: 20rpx;
	}

	.location-description-right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.location-description-right-position {
		margin-left: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border: 1rpx solid #EEEEEE;
		padding: 4rpx 4rpx;
	}

	.reference-start {
		width: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 20rpx;
		border: 1rpx solid #EEEEEE;
		padding: 4rpx 4rpx;
	}

	.reference-end {
		width: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 20rpx;
		border: 1rpx solid #EEEEEE;
		padding: 4rpx 4rpx;
	}
	.right-icon {
		margin-left: 20rpx;
		color: #CCCCCC;
	}
	.quantitative-data {
		font-size: 18rpx;
		padding: 12rpx 14rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #eee;
	}

	.quantitative-data-left {
		font-size: 20rpx;
		color: #666666;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.quantitative-data-right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.quantitative-data-right-value {
		display: flex;
		flex-direction: row;
		align-items: center;
		border: 1rpx solid #EEEEEE;
		padding: 4rpx 4rpx;
	}

	.quantitative-data-right-value-input {
		width: 100rpx;
	}

	.quantitative-data-right-unit {
		width: 35rpx;
		margin-left: 20rpx;
		padding: 4rpx 4rpx;
	}

	.quantitative-data-right-unit-input {
		font-size: 20rpx;
		color: #333333;
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



	/*位置描述弹窗*/
	/*位置描述中位置弹窗样式*/
	.location-description-position-popup-content {
		background-color: #fff;
		width: 600rpx;
		height: 300rpx;
		border-radius: 8rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.location-description-position-popup-input1 {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: space-between;
	}

	.location-description-popup-input {
		border-bottom: 1rpx solid #eee;
		flex: 1;
		margin-right: 10rpx;
	}


	.location-description-popup-button {
		background-color: #0F4687;
		color: white;
		width: 60rpx;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 12rpx;
		text-align: center;
		border-radius: 4rpx;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		/* 防止按钮被压缩 */
	}


	.location-description-position-popup-input3 {
		margin-top: 10rpx;
		font-size: 20rpx;
	}

	.location-description-position-popup-input3-item {
		margin-bottom: 10rpx;
	}

	.disease-index-title {
		padding: 8rpx 16rpx;
		font-size: 20rpx;
		color: #333333;
		background-color: #f5f5f5;
		text-align: center;
	}

	/* 范围输入相关样式 */
	.quantitative-data-right-range {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.range-separator {
		margin: 0 5rpx;
		color: #333333;
		font-size: 20rpx;
		font-weight: bold;
	}

  .clear-input{
    opacity: 0.5;
  }
</style>
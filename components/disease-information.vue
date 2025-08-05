<template>
	<view>
		<view class="head">
			<view class="head-text">
				病害基础信息
			</view>
		</view>

		<!-- 将原来的部件类型picker改为multiSelector -->
		<view class="component-name">
			<picker class="picker" mode="multiSelector" @change="typeMultiPickerChange" @columnchange="typeColumnChange"
				:value="typeMultiIndex" :range="typeMultiArray">
				<view class="picker-titleAndContent">
					<view class="picker-left">
						<text class="picker-must">*</text>
						<view class="picker-title">
							构件名称
						</view>
					</view>
					<view class="picker-right">
						<view class="picker-content" :style="componentNamePicker === '' ? 'color: #CCCCCC;' : ''">
							{{ componentNamePicker || '请选择构件名称'}}
						</view>
						<text class="picker-icon">&gt;</text>

						<view class="component-name-input" v-show="componentNamePicker === '其他'">
							<input class="component-code-input" v-model="componentNameInput" placeholder="请输入构件名称"
								placeholder-style="color: #CCCCCC;" @click.stop />
							<!--							<view class="clear-input" @click.stop="componentNameInput = '' ">×</view>-->
							<image src="/static/image/clear.png" class="clear-icon"
								@click.stop="componentNameInput = '' "></image>
						</view>

					</view>
				</view>
			</picker>
		</view>

		<view class="picker" @click="openComponentCodePopup">
			<view class="picker-titleAndContent">
				<view class="picker-left">
					<text class="picker-must">*</text>
					<view class="picker-title">
						构件编号
					</view>
				</view>
				<view class="picker-right">
					<view class="picker-content" :style="componentCodeInput === '' ? 'color: #CCCCCC;' : ''" @click="">
						{{ componentCodeInput || '请输入构件编号'}}
					</view>
					<text class="picker-icon">&gt;</text>
				</view>
			</view>
		</view>

		<!-- 修改病害类型选择器 -->
		<view class="picker">
			<view class="picker-titleAndContent">
				<view class="picker-left">
					<text class="picker-must">*</text>
					<view class="picker-title">
						病害类型
					</view>
				</view>
				<view class="picker-right">
					<picker class="picker" :range="diseaseTypeMultiArray" @change="onDiseaseTypeChange"
						mode="multiSelector" @columnchange="diseaseTypeColumnChange" :value="diseaseTypeMultiIndex">
						<view class="picker-content" :style="!typePicker ? 'color: #CCCCCC;' : ''">
							{{typePicker || '请选择病害类型'}}
						</view>
					</picker>
					<text class="picker-icon">&gt;</text>

					<view class="component-name-input" v-show="typePicker.split('#')[1]?.includes('其他')">
						<input class="component-code-input" v-model="typeInput" placeholder="请输入病害类型"
							placeholder-style="color: #CCCCCC;" @click.stop />
						<!--						<view class="clear-input" @click.stop="typeInput = '' ">×</view>-->
						<image src="/static/image/clear.png" class="clear-icon" @click.stop="typeInput = '' "></image>
					</view>
				</view>
			</view>
		</view>

		<view class="picker" @click="openComponentPositionPopup">
			<view class="picker-titleAndContent">
				<view class="picker-left">
					<text class="picker-must">*</text>
					<view class="picker-title">
						病害位置
					</view>
				</view>
				<view class="picker-right">
					<view class="picker-content" :style="position === '' ? 'color: #CCCCCC;' : ''" @click="">
            {{position === '' ? '请输入病害位置' : `${positionNumber !== '' ? `第${positionNumber}号` : ''}${position}`}}
					</view>
					<text class="picker-icon">&gt;</text>
				</view>
			</view>
		</view>

		<uni-popup ref="componentCodePopup" type="center" @change="handlePopupChange">
			<view class="componentCode-popup-content">
				<view class="popup-title">编辑构件编号</view>
				<view class="popup-input1">
					<text class="popup-input1-title">当前编号</text>
					<view class="popup-input1-input">
						<input type="text" placeholder="请填写" class="" v-model="componentCodePopupInput"
							placeholder-style="color: #CCCCCC;" />
						<image src="/static/image/clear.png" class="clear-icon"
							@click.stop="componentCodePopupInput = '' "></image>
					</view>
				</view>
				<view class="popup-input2">
					<text class="popup-input2-title">格式输入</text>
					<view class="popup-input2-input">
						<picker class="popup-input2-firstPart" :range="codePicker" @change="onCodeChange">
							<view class="popup-input2-firstPart-picker"
								:style="!codeFirstPart ? 'color: #CCCCCC;' : ''">{{codeFirstPart || 'L'}}</view>
							<text class="picker-icon">&gt;</text>
						</picker>
						<text>-</text>
						<view class="popup-input2-secondPart">
							<input type="number" v-model="codeSecondPart" placeholder="0"
								placeholder-style="color: #CCCCCC;">
							<image src="/static/image/clear.png" class="clear-icon" @click.stop="codeSecondPart = '' ">
							</image>
						</view>
						<text>-</text>
						<view class="popup-input2-thirdPart">
							<input type="number" v-model="codeThirdPart" placeholder="0"
								placeholder-style="color: #CCCCCC;">
							<image src="/static/image/clear.png" class="clear-icon" @click.stop="codeThirdPart = '' ">
							</image>
						</view>
						<text>-</text>
						<view class="popup-input2-forthPart">
							<input type="number" v-model="codeFourthPart" placeholder="0"
								placeholder-style="color: #CCCCCC;"></input>
							<image src="/static/image/clear.png" class="clear-icon" @click.stop="codeFourthPart = '' ">
							</image>
						</view>
						<text>-</text>
						<view class="popup-input2-fifthPart">
							<input type="number" v-model="codeFifthPart" placeholder="0"
								placeholder-style="color: #CCCCCC;"></input>
							<image src="/static/image/clear.png" class="clear-icon" @click.stop="codeFifthPart = '' ">
							</image>
						</view>
					</view>
				</view>
				<view class="popup-button">
					<button class="popup-button-cancel" @click="closeComponentCodePopup">取消</button>
					<button class="popup-button-confirm" @click="confirmComponentCode">确定</button>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="positionPopup" type="center" @change="handlePositionPopupChange">
			<view class="position-popup-content">
				<view class="popup-title">编辑病害位置</view>
				<view class="popup-input1">
					<text class="popup-input1-title">病害位置</text>
					<view class="position-popup-combined">
						<!--            <input type="text" placeholder="请填写" class="" v-model="componentCodePopupInput" placeholder-style="color: #CCCCCC;" />-->
						{{combinedPosition}}
					</view>
				</view>
				<view class="popup-input2">
					<text class="popup-input2-title">位置序号</text>
					<view class="popup-input2-input">
						<text>第</text>
						<view class="popup-input2-secondPart">
							<input type="number" class="position-number-input" v-model="positionNumberPopup"
								placeholder="请填写" placeholder-style="color: #CCCCCC;">
							<image src="/static/image/clear.png" class="clear-icon"
								@click.stop="positionNumberPopup = '' "></image>
						</view>
						<text>号</text>
					</view>
				</view>
				<view class="popup-input2">
					<text class="popup-input2-title">位置名称</text>
					<view class="popup-input2-input">
						<picker class="popup-input2-firstPart" :range="diseasePosition"
							@change="positionPickerPopupChange">
							<view class="popup-input2-firstPart-picker"
								:style="!positionPickerPopup ? 'color: #CCCCCC;' : ''">
								{{positionPickerPopup || '请选择病害位置'}}
							</view>
							<text class="picker-icon">&gt;</text>
						</picker>
						<view class="popup-input2-secondPart" v-show="positionPickerPopup === '其他'">
							<input type="text" v-model="positionInputPopup" placeholder="0"
								placeholder-style="color: #CCCCCC;">
							<image src="/static/image/clear.png" class="clear-icon"
								@click.stop="positionInputPopup = '' "></image>
						</view>
					</view>
				</view>
				<view class="popup-button">
					<button class="popup-button-cancel" @click="closePositionPopup">取消</button>
					<button class="popup-button-confirm" @click="confirmPositionCode">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	// 保存结构数据
	import {
		computed,
		onMounted,
		onUnmounted,
		ref,
		watch
	} from "vue";

	const props = defineProps({
		structureData: {
			type: Object,
		},
		selectedGrandObject: {
			type: String,
		}
	});



	// 直接赋值（静态副本）
	const structureData = ref(null)

	const selectedGrandObject = ref('')

	// 保存构件名称的父亲，即picker的第二级
	const parentObjectName = ref(''); // 默认值
	// 保存构件名称的第一级，即picker的第一级 //上部结构、下部结构、桥面系、附属设施
	const grandObjectName = ref('');
	// 部件类型列表picker中的第二级 - 动态生成
	const biObjectNameOptions = ref([]);
	// 缺损类型列表 - 动态生成
	const diseaseTypeOptions = ref([]);

	// 构件名称picker选择的值
	const componentNamePicker = ref('');
	// 部件类型索引
	const biObjectindex = ref(-1);

	// 构件名称input输入框
	const componentNameInput = ref('');

	// 构件编号 - 改为输入框
	const componentCodeInput = ref('');

	// 病害类型二级picker
	const diseaseTypeMultiArray = ref([
		[],
		[]
	]);
	const diseaseTypeMultiIndex = ref([0, 0]);
	// 创建一个数组来存储所有的病害类型一级选项
	let groupNamesArray = [];
	// 创建一个数组来存储所有病害类型二级选项
	let allDiseaseTypes = [];

	// 缺损类型
	const type = ref('');
	const typeindex = ref(-1);
	// 添加病害类型picker和input变量
	const typePicker = ref('');
	const typeInput = ref('');

	// 病害位置
	const position = ref('');
	// 病害位置序号
	const positionNumber = ref('');

	// 添加病害位置picker和input变量
	const positionPicker = ref('');
	const positionInput = ref('');

	const diseasePosition = ref([]);

	const diseasePositionItems = ref([]);
	const diseasePositionSelectedItem = ref(null);

	// 为三级选择器添加的数据和方法
	const structureTypes = ref([]);
	const typeMultiArray = ref([
		structureTypes.value,
		[],
		[]
	]);
	const typeMultiIndex = ref([0, 0, 0]);

	//构件编号弹窗里的输入框
	const componentCodePopupInput = ref('');
	const codePicker = ref(['L', 'R', '无前缀']);
	const codeFirstPart = ref('');
	const codeSecondPart = ref('');
	const codeThirdPart = ref('');
	const codeFourthPart = ref('');
	const codeFifthPart = ref('');
	//构件编号弹窗
	const componentCodePopup = ref(null);
	// 病害位置弹窗
	const positionPopup = ref(null);

	//病害位置弹窗的输入项
	const positionNumberPopup = ref('');
	const positionInputPopup = ref('');
	const positionPickerPopup = ref('');
	const combinedPosition = ref('')

	const openComponentPositionPopup = () => {
		positionPopup.value.open();
		if (position.value && positionNumber.value) combinedPosition.value = '第' + positionNumber.value + '号' + position.value;
    else if(position.value) combinedPosition.value = position.value;
    if(positionNumber.value) positionNumberPopup.value = positionNumber.value;
    if(position.value) positionPickerPopup.value = position.value;
	}

	const positionPickerPopupChange = (e) => {
		const index = e.detail.value;
		positionPickerPopup.value = diseasePosition.value[index];
	}
	const handlePositionPopupChange = () => {
		positionNumberPopup.value = '';
		positionInputPopup.value = '';
		positionPickerPopup.value = '';
		combinedPosition.value = '';
	}
	const closePositionPopup = () => {
		positionPopup.value.close();
		handlePositionPopupChange();
	}
	const confirmPositionCode = () => {
		if (positionPickerPopup.value === '其他') {
			position.value = positionInputPopup.value;
		} else {
			position.value = positionPickerPopup.value;
		}
		positionNumber.value = positionNumberPopup.value;
		positionPopup.value.close();
		onDiseasePositionChange();
		handlePositionPopupChange();
	}
	watch(
		[positionNumberPopup, positionPickerPopup, positionInputPopup],
		() => {
			if (positionPickerPopup.value === '其他') {
        if(positionNumberPopup.value){
          combinedPosition.value = '第' + positionNumberPopup.value + '号' + positionInputPopup.value;
        }else{
          combinedPosition.value = positionInputPopup.value;
        }
			} else {
        if(positionNumberPopup.value){
          combinedPosition.value = '第' + positionNumberPopup.value + '号' + positionPickerPopup.value;
        }else{
          combinedPosition.value = positionPickerPopup.value;
        }
			}
		}
	)

	// 使用watch监听prop变化
	watch(() => props.structureData, (newVal) => {
		console.log('structureData 更新:', newVal)
		if (newVal) {
			structureData.value = JSON.parse(JSON.stringify(newVal))
			if (structureData.value && structureData.value.children) {
				// 更新第一列数据为structureData中的children的name数组
				const firstColumnData = structureData.value.children.map(item => item.name);
				structureTypes.value = firstColumnData;
				typeMultiArray.value[0] = firstColumnData;

				// 如果第一列索引超出范围，重置为0
				if (typeMultiIndex.value[0] >= typeMultiArray.value[0].length) {
					typeMultiIndex.value[0] = 0;
				}
			}
			if (props.selectedGrandObject) {
				typeMultiIndex.value[0] = structureTypes.value.findIndex(item => item === props
					.selectedGrandObject);
			} // 深拷贝避免引用问题
			initMultiPickerColumns()
		}
	}, {
		immediate: true,
		deep: true
	})

	//打开构件编号弹窗
	const openComponentCodePopup = () => {
		componentCodePopup.value.open();
		componentCodePopupInput.value = componentCodeInput.value;
	}
	//关闭构件编号弹窗
	const handlePopupChange = () => {
		codeFirstPart.value = '';
		codeSecondPart.value = '';
		codeThirdPart.value = '';
		codeFourthPart.value = '';
		componentCodePopupInput.value = '';
	}
	// 构件编号弹窗选择L R
	const onCodeChange = (e) => {
		const index = e.detail.value;
		codeFirstPart.value = codePicker.value[index];
	}
	// 构件编号弹窗确定
	const confirmComponentCode = () => {
		componentCodeInput.value = componentCodePopupInput.value;
		closeComponentCodePopup();
		codeFirstPart.value = '';
		codeSecondPart.value = '';
		codeThirdPart.value = '';
		codeFourthPart.value = '';
		componentCodePopupInput.value = '';
	}
	// 构件编号弹窗取消
	const closeComponentCodePopup = () => {
		componentCodePopup.value.close();
		codeFirstPart.value = '';
		codeSecondPart.value = '';
		codeThirdPart.value = '';
		codeFourthPart.value = '';
		componentCodePopupInput.value = '';
	}
	// 监听 input2 的四个部分，只要有变化就自动拼接
	watch(
		[codeFirstPart, codeSecondPart, codeThirdPart, codeFourthPart, codeFifthPart],
		() => {
			console.log('input2变化:', codeFirstPart.value, codeSecondPart.value, codeThirdPart.value, codeFourthPart
				.value)

			// 构建各部分并根据前置条件添加分隔符
			const parts = [];

			// 处理第二部分（codeSecondPart），如果前面有有效部分则加'-'
			if (codeSecondPart.value !== '') {
				if ((codeFirstPart.value !== '无前缀' && codeFirstPart.value !== '')) {
					parts.push('-' + codeSecondPart.value);
				} else {
					parts.push(codeSecondPart.value);
				}
			}

			// 处理第三部分（codeThirdPart），如果前面有有效部分则加'-'
			if (codeThirdPart.value !== '') {
				if ((codeFirstPart.value !== '无前缀' && codeFirstPart.value !== '') || codeSecondPart.value !== '') {
					parts.push('-' + codeThirdPart.value);
				} else {
					parts.push(codeThirdPart.value);
				}
			}

			// 处理第四部分（codeFourthPart），如果前面有有效部分则加'-'
			if (codeFourthPart.value !== '') {
				if ((codeFirstPart.value !== '无前缀' && codeFirstPart.value !== '') || codeSecondPart.value !== '' ||
					codeThirdPart.value !== '') {
					parts.push('-' + codeFourthPart.value);
				} else {
					parts.push(codeFourthPart.value);
				}
			}

			// 处理第五部分（codeFifthPart），如果前面有有效部分则加'-'
			if (codeFifthPart.value !== '') {
				if ((codeFirstPart.value !== '无前缀' && codeFirstPart.value !== '') || codeSecondPart.value !== '' ||
					codeThirdPart.value !== '' || codeFourthPart.value !== '') {
					parts.push('-' + codeFifthPart.value);
				} else {
					parts.push(codeFifthPart.value);
				}
			}

			// 拼接格式化部分
			const formattedParts = parts.join('');
			console.log('formattedParts', formattedParts)

			// 设置最终的输入框值
			componentCodePopupInput.value =
				(codeFirstPart.value === '无前缀' ? '' : codeFirstPart.value) +
				(formattedParts ? formattedParts : '');
		}
	)

	// 添加onMounted处理可能的初始值
	onMounted(() => {
		console.log('组件挂载完成，当前structureData:', props.structureData)
		// 如果父组件在挂载前已传递数据
		if (props.structureData) {
			structureData.value = JSON.parse(JSON.stringify(props.structureData))
			if (structureData.value && structureData.value.children) {
				// 更新第一列数据为structureData中的children的name数组
				const firstColumnData = structureData.value.children.map(item => item.name);
				structureTypes.value = firstColumnData;
				typeMultiArray.value[0] = firstColumnData;

				// 如果第一列索引超出范围，重置为0
				if (typeMultiIndex.value[0] >= typeMultiArray.value[0].length) {
					typeMultiIndex.value[0] = 0;
				}
			}
			if (props.selectedGrandObject) {
				typeMultiIndex.value[0] = structureTypes.value.findIndex(item => item === props
					.selectedGrandObject);
			}
			initMultiPickerColumns()
		}
		/*if(props.selectedGrandObject){
		  typeMultiIndex.value[0] = structureTypes.value.findIndex(item => item === grandObjectName.value);
		}*/
		// uni.$on('setComponentName', (emitParam) => {
		// 	componentNamePicker.value = emitParam
		// });
		uni.$on('setComponentName', onComponentNameChangeByEmit);
		uni.$on('setComponentCode', (emitParam) => {
			componentCodeInput.value = emitParam
		});
		uni.$on('setDiseaseType', onDiseaseTypeChangeByEmit);
		uni.$on('setDiseasePosition', setDiseasePosition);
		uni.$on('setPositionNumber', (emitParam) => {
			positionNumber.value = emitParam;
		})


		uni.$on('getDescription', getDescription);
		// 如果父组件在挂载前已传递数据
		/*if (props.structureData) {
			structureData.value = JSON.parse(JSON.stringify(props.structureData))
			initMultiPickerColumns()
		}*/
	})

	onUnmounted(() => {
		// 移除监听事件
		uni.$off('setComponentName')
		uni.$off('setComponentCode')
		uni.$off('setDiseaseType')
		uni.$off('setDiseasePosition')
		uni.$off('setPositionNumber')
		uni.$off('getDescription')
	})

	const onComponentNameChangeByEmit = (emitComponent) => {
		grandObjectName.value = emitComponent.grandObjectName;
		console.log('设置病害所属大类:', grandObjectName.value);

		// 初始化typeMultiIndex的第一维
		const parentIndex = structureTypes.value.findIndex(item => item === grandObjectName.value);
		if (parentIndex !== -1) {
			typeMultiIndex.value[0] = parentIndex;

			// 初始化第二维数据
			initMultiPickerColumns();

			// 确保第二维数据已经初始化完成
			if (typeMultiArray.value[1] && typeMultiArray.value[1].length > 0) {
				// 如果有parentObjectName（第二级），设置它
				if (emitComponent.parentObjectName) {
					parentObjectName.value = emitComponent.parentObjectName;
					console.log('设置部件父级名称:', parentObjectName.value);

					// 查找第二级索引
					const secondLevelIndex = typeMultiArray.value[1].findIndex(item => item ===
						parentObjectName.value);
					console.log('第二级索引:', secondLevelIndex);
					if (secondLevelIndex !== -1) {
						typeMultiIndex.value[1] = secondLevelIndex;

						// 更新第三列
						updateThirdColumn();

						// 如果有构件名称（第三级），设置它
						if (emitComponent.biObjectName) {
							const biObjectName = emitComponent.biObjectName;
							const biObjectNameInput = emitComponent.biObjectInput;

							// 先设置componentNamePicker，这是我们用来显示的值
							componentNamePicker.value = emitComponent.biObjectName;

							// 尝试在第三级列表中找到匹配项
							if (typeMultiArray.value[2] && typeMultiArray.value[2].length > 0) {
								const thirdLevelIndex = typeMultiArray.value[2].findIndex(item =>
									item === componentNamePicker.value);
								if (thirdLevelIndex !== -1 && componentNamePicker.value !== '其他') {
									typeMultiIndex.value[2] = thirdLevelIndex;
									console.log('成功设置构件名称(第三级):', componentNamePicker.value);

									// 更新biObjectindex
									if (typeMultiIndex.value[1] >= 0 && typeMultiIndex.value[1] <
										biObjectNameOptions.value.length) {
										biObjectindex.value = typeMultiIndex.value[1];
										console.log('成功设置biObjectindex:', biObjectindex.value);
									}
								} else if (componentNamePicker.value === '其他') {
									// 如果在第三级中找不到匹配项，可能是自定义名称
									componentNameInput.value = biObjectNameInput;
									console.log('设置自定义构件名称:', biObjectName);
								}
							} else {
								// 第三级列表为空，设置为自定义名称
								componentNameInput.value = biObjectNameInput;
								console.log('第三级列表为空，设置自定义构件名称:', biObjectName);
							}
						}
					}
				}
			}
		}
		updateDiseaseTypeOptions();
		updateDiseasePositionOptions();
	}

	const setDiseasePosition = (emitPosition) => {
		/*		const {
					positionPicker: emitPositionPicker,
					positionInput: emitPositionInput,
					diseasePosition: emitDiseasePosition
				} = emitObj;
				positionPicker.value = emitPositionPicker || '';
				positionInput.value = emitPositionInput || '';
				diseasePosition.value = emitDiseasePosition || [];
				diseasePositionItems.value = emitDiseasePosition || [];

				uni.$emit('setPositionProps', positionPicker.value !== '' ? positionPicker.value : positionInput
				.value);*/

		const index = diseasePositionItems.value.findIndex(item => item.name === emitPosition)
		if (index >= 0 && index < diseasePosition.value.length) {
			positionPicker.value = diseasePosition.value[index];

			// 如果选择了"其他"，清空positionInput，等待用户输入
			if (positionPicker.value === '其他') {
				positionInput.value = emitPosition;
			} else {
				// 否则直接更新position值
				position.value = positionPicker.value;
			}

			// 更新diseasePositionSelectedItem为diseasePositionItems中对应的项
			diseasePositionSelectedItem.value = diseasePositionItems.value[index];
			console.log('病害位置选择变更为:', positionPicker.value);
			console.log('更新病害位置选中item为:', diseasePositionSelectedItem.value);
			uni.$emit('setPositionProps', diseasePositionSelectedItem.value.props);
		} else {
			positionPicker.value = '其他';
			positionInput.value = emitPosition;
		}
	}

	//传递病害描述所需数据
	const getDescription = () => {
		const description = {
			componentName: getComponentName(), // 获取当前选择的构件名称
			componentCode: componentCodeInput.value, // 构件编号
			type: type.value, // 病害类型
			position: position.value // 病害位置
		};
		uni.$emit('setDescription1', description);
	}

	// 添加一个函数来获取当前选择的构件名称,可能为picker中直接选取，也可能为其他时自行输入
	const getComponentName = () => {
		let componentName = '';
		if (componentNamePicker.value === '其他') {
			// 如果选择了"其他"并且输入了自定义名称
			componentName = componentNameInput.value;
		} else if (typeMultiIndex.value[2] >= 0 && typeMultiIndex.value[2] < typeMultiArray.value[2].length) {
			componentName = typeMultiArray.value[2][typeMultiIndex.value[2]];
		} else {
			// 如果没有第三级选择，使用第二级作为备选
			componentName = parentObjectName.value;
		}
		return componentName;
	}

	// 初始化三级选择器的列数据
	const initMultiPickerColumns = () => {
		// 首先从structureData中获取第一列数据
		/*if (structureData.value && structureData.value.children) {
			// 更新第一列数据为structureData中的children的name数组
			const firstColumnData = structureData.value.children.map(item => item.name);
			structureTypes.value = firstColumnData;
			typeMultiArray.value[0] = firstColumnData;

			// 如果第一列索引超出范围，重置为0
			if (typeMultiIndex.value[0] >= typeMultiArray.value[0].length) {
				typeMultiIndex.value[0] = 0;
			}
		}
    if(props.selectedGrandObject){
      console.log('props.selectedGrandObject',props.selectedGrandObject)
      typeMultiIndex.value[0] = structureTypes.value.findIndex(item => item === props.selectedGrandObject);
      console.log('typeMultiIndex.value[0]',typeMultiIndex.value[0])
    }*/

		// 根据第一列当前选中项更新第二列的数据
		const structureType = typeMultiArray.value[0][typeMultiIndex.value[0]];

		// 设置grandObjectName以便获取对应的部件类型列表
		grandObjectName.value = structureType;

		// 如果结构数据已加载，则初始化部件类型列表
		if (structureData.value && structureData.value.children) {
			// 找到对应的结构部分（上部结构、下部结构、桥面系）
			const structurePart = structureData.value.children.find(
				item => item.name === grandObjectName.value
			);

			if (structurePart && structurePart.children) {
				// 提取部件类型名称列表
				biObjectNameOptions.value = structurePart.children;

				// 更新二列数据
				typeMultiArray.value[1] = [...structurePart.children.map(item => item.name)];

				// 如果第二列已经有值且索引超出范围，重置为0
				if (typeMultiIndex.value[1] >= typeMultiArray.value[1].length) {
					typeMultiIndex.value[1] = 0;
				}

				// 更新第三列数据
				updateThirdColumn();
			} else {
				console.log('未找到对应的结构部分或其子项');
				typeMultiArray.value[1] = [];
				typeMultiArray.value[2] = [];
			}
		} else {
			console.log('结构数据尚未加载完成');
		}
	}

	// 更新第三列数据
	const updateThirdColumn = () => {
		// 检查是否有第二列选择
		if (typeMultiIndex.value[1] < 0 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
			typeMultiArray.value[2] = [];
			return;
		}

		// 检查是否选择了超出范围的选项
		if (typeMultiIndex.value[1] >= biObjectNameOptions.value.length) {
			typeMultiArray.value[2] = [];
			return;
		}

		// 获取选中的第二级对象
		const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
		if (!selectedSecondLevel || !selectedSecondLevel.children || !Array.isArray(selectedSecondLevel.children)) {
			typeMultiArray.value[2] = [];
			return;
		}

		// 提取第三级名称列表
		const thirdLevelNames = selectedSecondLevel.children
			.filter(item => item.status === '0')
			.map(item => item.name);
		typeMultiArray.value[2] = [...thirdLevelNames];

		// 如果第三列索引超出范围，重置为0
		if (typeMultiIndex.value[2] >= typeMultiArray.value[2].length) {
			typeMultiIndex.value[2] = 0;
		}
	}

	// 多列选择器列变化处理
	const typeColumnChange = (e) => {
		const {
			column,
			value
		} = e.detail;
		typeMultiIndex.value[column] = value;

		// 如果第一列变化，则更新第二列和第三列数据
		if (column === 0) {
			// 设置grandObjectName为新选择的值
			grandObjectName.value = structureTypes.value[value];

			// 重置第二列和第三列索引
			typeMultiIndex.value[1] = 0;
			typeMultiIndex.value[2] = 0;

			// 初始化第二列和第三列数据
			initMultiPickerColumns();
		}
		// 如果第二列变化，则更新第三列数据
		else if (column === 1) {
			// 更新第三列数据
			updateThirdColumn();
		}
	}

	// 添加一个新函数来更新构件名称相关的值
	const updateComponentNameValues = () => {
		// 更新grandObjectName
		grandObjectName.value = structureTypes.value[typeMultiIndex.value[0]];

		// 如果第二级索引有效，设置parentObjectName
		if (typeMultiIndex.value[1] >= 0 && typeMultiIndex.value[1] < typeMultiArray.value[1].length) {
			parentObjectName.value = typeMultiArray.value[1][typeMultiIndex.value[1]];
		}
	}

	// 确认选择事件
	const typeMultiPickerChange = (e) => {
		typeMultiIndex.value = e.detail.value;

		// 更新grandObjectName和parentObjectName
		updateComponentNameValues();

		// 获取选择的构件名称
		let selectedComponentName = '';

		// 如果有选择第三级
		if (typeMultiIndex.value[2] >= 0 && typeMultiArray.value[2].length > 0) {
			selectedComponentName = typeMultiArray.value[2][typeMultiIndex.value[2]];
		}
		// 如果只选择了第二级
		else if (typeMultiIndex.value[1] >= 0 && typeMultiArray.value[1].length > 0) {
			selectedComponentName = typeMultiArray.value[1][typeMultiIndex.value[1]];
		}

		// 更新确认选择的构件名称
		componentNamePicker.value = selectedComponentName;

		// 更新biObjectindex
		if (typeMultiIndex.value[1] >= 0 && typeMultiIndex.value[1] < biObjectNameOptions.value.length) {
			biObjectindex.value = typeMultiIndex.value[1];
		} else {
			biObjectindex.value = -1;
		}

		// 更新缺损类型和构件编号
		updateDiseaseTypeOptions();

		// 更新病害位置选项 - 在确认选择后更新
		updateDiseasePositionOptions();
		typePicker.value = '';
		positionPicker.value = '';
		typeInput.value = '';
		positionInput.value = '';
	}

	// 根据选择的部件类型更新缺损类型选项
	const updateDiseaseTypeOptions = () => {
		// 检查是否有有效的部件类型选择
		if (typeMultiIndex.value[1] < 0 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
			console.log('无效的部件类型选择');
			diseaseTypeOptions.value = [];
			return;
		}

		// 检查是否选择了超出范围的选项
		if (typeMultiIndex.value[1] >= biObjectNameOptions.value.length) {
			console.log('部件类型选择超出范围');
			diseaseTypeOptions.value = [];
			return;
		}

		// 获取第二级选中的对象
		const selectedBiObject = biObjectNameOptions.value[typeMultiIndex.value[1]];
		if (!selectedBiObject) {
			console.log('选中的部件类型不存在');
			diseaseTypeOptions.value = [];
			return;
		}

		// 存储完整的病害类型一级对象
		groupNamesArray = [];

		// 存储完整的病害类型二级对象
		allDiseaseTypes = [];

		if (componentNamePicker.value === '其他') {
			// 当选择"其他"时，通过grandObjectName查找对应的第一级结构
			if (structureData.value && structureData.value.children) {
				const structurePart = structureData.value.children.find(
					item => item.name === grandObjectName.value
				);

				if (structurePart && structurePart.children) {
					// 遍历第二级children
					structurePart.children.forEach(secondLevel => {
						if (secondLevel.diseaseTypes && Array.isArray(secondLevel.diseaseTypes)) {
							secondLevel.diseaseTypes.forEach(item => {
								/*if (!allDiseaseTypes.some(existing => existing.id === item.id)) {
									allDiseaseTypes.push(item);
								}*/
								// 添加groupName到第一列
								if (!groupNamesArray.some(existing => existing === item.groupName)) {
									groupNamesArray.push(item.groupName);
								}
							});
						}

						// 遍历第三级children并添加其病害类型
						if (secondLevel.children && Array.isArray(secondLevel.children)) {
							secondLevel.children.forEach(thirdLevel => {
								if (thirdLevel.diseaseTypes && Array.isArray(thirdLevel
										.diseaseTypes)) {
									thirdLevel.diseaseTypes.forEach(item => {
										/*if (!allDiseaseTypes.some(existing => existing.id === item.id)) {
											allDiseaseTypes.push(item);
										}*/
										// 添加groupName到第一列
										if (!groupNamesArray.some(existing => existing === item
												.groupName)) {
											groupNamesArray.push(item.groupName);
										}
									});
								}
							});
						}
					});
				}
			}
		} else {
			if (selectedBiObject.diseaseTypes && Array.isArray(selectedBiObject.diseaseTypes)) {
				/*allDiseaseTypes = [...selectedBiObject.diseaseTypes];
				console.log('第二级病害类型:', allDiseaseTypes);*/
				selectedBiObject.diseaseTypes.forEach(item => {
					if (!groupNamesArray.some(existing => existing === item.groupName)) {
						groupNamesArray.push(item.groupName);
					}
				});
			}

			// 检查是否有第三级选择并添加其病害类型
			if (typeMultiIndex.value[2] >= 0 && selectedBiObject.children &&
				Array.isArray(selectedBiObject.children) &&
				typeMultiIndex.value[2] < selectedBiObject.children.length) {

				const selectedThirdLevel = selectedBiObject.children[typeMultiIndex.value[2]];
				if (selectedThirdLevel && selectedThirdLevel.diseaseTypes && Array.isArray(selectedThirdLevel
						.diseaseTypes)) {
					selectedThirdLevel.diseaseTypes.forEach(item => {
						/*if (!allDiseaseTypes.some(existing => existing.id === item.id)) {
							allDiseaseTypes.push(item);
						}*/
						// 添加groupName到第一列
						if (!groupNamesArray.some(existing => existing === item.groupName)) {
							groupNamesArray.push(item.groupName);
						}
					});
				}
			}
		}
		// 更新第一列 groupName
		diseaseTypeMultiArray.value[0] = groupNamesArray;

		const selectedGroupName = groupNamesArray[diseaseTypeMultiIndex.value[0]];

		if (componentNamePicker.value === '其他') {
			// 当选择"其他"时，通过grandObjectName查找对应的第一级结构
			if (structureData.value && structureData.value.children) {
				const structurePart = structureData.value.children.find(
					item => item.name === grandObjectName.value
				);

				if (structurePart && structurePart.children) {
					// 遍历第二级children
					structurePart.children.forEach(secondLevel => {
						// 添加第二级的病害类型（如果有）
						if (secondLevel.diseaseTypes && Array.isArray(secondLevel.diseaseTypes)) {
							secondLevel.diseaseTypes.forEach(item => {
								if (!allDiseaseTypes.some(existing => existing.id === item.id) && item
									.groupName === selectedGroupName) {
									allDiseaseTypes.push(item);
								}
							});
						}

						// 遍历第三级children并添加其病害类型
						if (secondLevel.children && Array.isArray(secondLevel.children)) {
							secondLevel.children.forEach(thirdLevel => {
								if (thirdLevel.diseaseTypes && Array.isArray(thirdLevel
										.diseaseTypes)) {
									thirdLevel.diseaseTypes.forEach(item => {
										if (!allDiseaseTypes.some(existing => existing.id ===
												item.id) && item.groupName ===
											selectedGroupName) {
											allDiseaseTypes.push(item);
										}
									});
								}
							});
						}
					});
				}
			}
		} else {
			// 添加第二级的病害类型（如果有）
			if (selectedBiObject.diseaseTypes && Array.isArray(selectedBiObject.diseaseTypes)) {
				// allDiseaseTypes = [...selectedBiObject.diseaseTypes];
				selectedBiObject.diseaseTypes.forEach(item => {
					if (!allDiseaseTypes.some(existing => existing.id === item.id) && item.groupName ===
						selectedGroupName) {
						allDiseaseTypes.push(item);
					}
				});
			}

			// 检查是否有第三级选择并添加其病害类型
			if (typeMultiIndex.value[2] >= 0 && selectedBiObject.children &&
				Array.isArray(selectedBiObject.children) &&
				typeMultiIndex.value[2] < selectedBiObject.children.length) {

				const selectedThirdLevel = selectedBiObject.children[typeMultiIndex.value[2]];
				if (selectedThirdLevel && selectedThirdLevel.diseaseTypes && Array.isArray(selectedThirdLevel
						.diseaseTypes)) {
					// 添加第三级的病害类型，避免重复（通过id判断）
					selectedThirdLevel.diseaseTypes.forEach(item => {
						if (!allDiseaseTypes.some(existing => existing.id === item.id) && item.groupName ===
							selectedGroupName) {
							allDiseaseTypes.push(item);
						}
					});
				}
			}
		}

		// 更新缺损类型选项 - 只提取名称用于显示
		diseaseTypeOptions.value = allDiseaseTypes.map(item => `${item.code}#${item.name}`);
		diseaseTypeMultiArray.value[1] = diseaseTypeOptions.value;

		console.log('groupNamesArray', groupNamesArray)
		console.log('最终缺损类型第二列选项更新为:', diseaseTypeOptions.value);

		// 如果已经设置了病害类型，尝试在新的选项中找到对应的索引
		/*if (type.value) {
			const index = diseaseTypeOptions.value.findIndex(item => item === type.value);
			if (index !== -1) {
				typeindex.value = index;
				typePicker.value = diseaseTypeOptions.value[index];
				console.log('成功设置病害类型索引:', index);
			} else {
				// 如果在新选项中找不到当前病害类型，可能是自定义输入的
				typePicker.value = '其他';
				typeInput.value = type.value;
				console.log('当前病害类型不在选项中，设为自定义输入:', type.value);
			}
		}*/
	}

	// 更新病害位置选项
	const updateDiseasePositionOptions = () => {
		console.log('开始更新病害位置选项');
		// 检查是否选择了构件
		if (typeMultiIndex.value[1] < 0 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
			diseasePosition.value = [];
			return;
		}

		// 获取选中的第二级对象
		const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
		if (!selectedSecondLevel) {
			diseasePosition.value = [];
			return;
		}

		// 如果有第三级选择，使用第三级对象
		if (typeMultiArray.value[2].length > 0 && typeMultiIndex.value[2] >= 0) {
			// 获取选中的第三级对象
			if (selectedSecondLevel.children && Array.isArray(selectedSecondLevel.children) &&
				typeMultiIndex.value[2] < selectedSecondLevel.children.length) {

				const selectedThirdLevel = selectedSecondLevel.children[typeMultiIndex.value[2]];

				// 检查是否有子组件
				if (selectedThirdLevel && selectedThirdLevel.children && Array.isArray(selectedThirdLevel.children)) {
					// 提取子组件名称
					diseasePosition.value = selectedThirdLevel.children.map(item => item.name);
					diseasePositionItems.value = selectedThirdLevel.children;
					console.log('更新病害位置item选项', diseasePositionItems.value);
					console.log('更新病害位置选项为第三级子组件:', diseasePosition.value);
					return;
				}
			}
		}

		// 如果都没有，使用默认值为空
		diseasePosition.value = [];
		console.log('使用默认病害位置选项');
	};

	// 确认病害位置选择
	const onDiseasePositionChange = () => {
		const index = diseasePositionItems.value.findIndex(item => item.name === position.value)
		if (index >= 0 && index < diseasePosition.value.length) {
			positionPicker.value = diseasePosition.value[index];

			// 如果选择了"其他"，清空positionInput，等待用户输入
			if (positionPicker.value === '其他') {
				positionInput.value = '';
			} else {
				// 否则直接更新position值
				position.value = positionPicker.value;
			}

			// 更新diseasePositionSelectedItem为diseasePositionItems中对应的项
			diseasePositionSelectedItem.value = diseasePositionItems.value[index];
			console.log('病害位置选择变更为:', positionPicker.value);
			console.log('更新病害位置选中item为:', diseasePositionSelectedItem.value);
			uni.$emit('setPositionProps', diseasePositionSelectedItem.value.props);
		}
	}

	// 编辑模式填充病害类型处理方法
	const onDiseaseTypeChangeByEmit = (diseaseObj) => {
		const {
			diseaseTypeInput: diseaseTypeInput,
			diseaseType: diseaseType,
			diseaseTypeCode: diseaseTypeCode,
			diseaseTypeId: diseaseTypeId,
			diseaseTypeGroupName: diseaseTypeGroupName,
		} = diseaseObj;
		// diseaseTypeOptions.value = typeOptions || [];
		// const index = diseaseTypeOptions.value.findIndex(item => item === diseaseType);
		diseaseTypeMultiIndex.value[0] = groupNamesArray.indexOf(diseaseTypeGroupName);
		updateDiseaseTypeOptions();
		diseaseTypeMultiIndex.value[1] = allDiseaseTypes.findIndex(item => item.id === diseaseTypeId);
		typePicker.value = diseaseTypeCode + '#' + diseaseType;
		typeindex.value = diseaseTypeMultiIndex.value[1];
		// 如果选择了"其他"，清空typeInput，等待用户输入
		if (typePicker.value.split('#')[1]?.includes('其他')) {
			typeInput.value = diseaseTypeInput;
		} else {
			// 否则直接更新type值
			type.value = typePicker.value;
		}
		// 获取选中的病害类型对象
		// const selectedDiseaseType = allDiseaseTypes.find(item => item.name === typePicker.value);
		const selectedDiseaseType = allDiseaseTypes.find(item => item.id === diseaseTypeId);
		if (selectedDiseaseType && selectedDiseaseType.threshold) {
			uni.$emit('setThreshold', selectedDiseaseType.threshold)
		}
		if (selectedDiseaseType && selectedDiseaseType.maxScale && selectedDiseaseType.minScale) {
			// 根据maxScale和minScale更新评定标度选项
			const minScale = parseInt(selectedDiseaseType.minScale) || 1;
			const maxScale = parseInt(selectedDiseaseType.maxScale) || 4;

			uni.$emit('changeScale', {
				minScale: minScale,
				maxScale: maxScale
			});
			console.log('更新评定标度范围:', minScale, '至', maxScale);
			uni.$emit('setSelectColumn', selectedDiseaseType.selectColumn)
		}
		console.log('病害类型选择变更为:', typePicker.value);
	}

	// 添加病害类型picker变化处理方法
	const onDiseaseTypeChange = (e) => {
		diseaseTypeMultiIndex.value = e.detail.value;
		const index = diseaseTypeMultiIndex.value[1]
		if (index >= 0 && index < diseaseTypeOptions.value.length) {
			typePicker.value = diseaseTypeOptions.value[index];
			typeindex.value = index;

			console.log('病害类型选择变更为:', typePicker.value)
			// 如果选择了"其他"，清空typeInput，等待用户输入
			if (typePicker.value.split('#')[1].includes('其他')) {
				console.log('进入病害类型其他分支')
				typeInput.value = '';
			} else {
				// 否则直接更新type值
				type.value = typePicker.value;

				/*// 获取选中的病害类型对象
				const selectedDiseaseType = allDiseaseTypes[typeindex.value];
				console.log('selectedDiseaseType获取选中的病害类型对象:', selectedDiseaseType);
				if (selectedDiseaseType && selectedDiseaseType.maxScale && selectedDiseaseType.minScale) {
					// 根据maxScale和minScale更新评定标度选项
					const minScale = parseInt(selectedDiseaseType.minScale) || 1;
					const maxScale = parseInt(selectedDiseaseType.maxScale) || 4;

					uni.$emit('changeScale', {
						minScale: minScale,
						maxScale: maxScale
					});
					uni.$emit('setSelectColumn', selectedDiseaseType.selectColumn)
					console.log('更新评定标度范围:', minScale, '至', maxScale);
				}*/
			}
			// 获取选中的病害类型对象
			const selectedDiseaseType = allDiseaseTypes[typeindex.value];
			console.log('selectedDiseaseType获取选中的病害类型对象:', selectedDiseaseType);
			if (selectedDiseaseType.threshold) {
				uni.$emit('setThreshold', selectedDiseaseType.threshold)
			}
			if (selectedDiseaseType && selectedDiseaseType.maxScale && selectedDiseaseType.minScale) {
				// 根据maxScale和minScale更新评定标度选项
				const minScale = parseInt(selectedDiseaseType.minScale) || 1;
				const maxScale = parseInt(selectedDiseaseType.maxScale) || 4;

				uni.$emit('changeScale', {
					minScale: minScale,
					maxScale: maxScale
				});
				uni.$emit('setSelectColumn', selectedDiseaseType.selectColumn)
				console.log('更新评定标度范围:', minScale, '至', maxScale);
			}
			console.log('病害类型选择变更为:', typePicker.value);
			uni.$emit('clearDiseaseData')
		}
		console.log('确定病害类型 diseaseTypeMultiIndex:', diseaseTypeMultiIndex.value[0])
		// updateDiseaseTypeOptions();
	}

	// 病害类型滑动时列表变动
	const diseaseTypeColumnChange = (e) => {
		const {
			column,
			value
		} = e.detail;
		diseaseTypeMultiIndex.value[column] = value;
		console.log('diseaseTypeColumnChange病害类型列变化切换:', value)
		if (column === 0) {
			updateDiseaseTypeOptions();
		}
		diseaseTypeMultiIndex.value[1] = 0;
	}

	// 监听typePicker和typeInput的变化，更新type
	watch([typePicker, typeInput], ([newTypePicker, newTypeInput]) => {
		if (newTypePicker.split('#')[1] && newTypePicker.split('#')[1].includes('其他') && newTypeInput) {
			type.value = newTypeInput;
		} else {
			type.value = newTypePicker;
		}
	}, {
		deep: true
	});

	// 监听positionPicker和positionInput的变化，更新position
	watch([positionPicker, positionInput], ([newPositionPicker, newPositionInput]) => {
		if (newPositionPicker === '其他' && newPositionInput) {
			position.value = newPositionInput;
		} else if (newPositionPicker !== '其他') {
			position.value = newPositionPicker;
		}
	}, {
		deep: true
	});

	// 添加获取第三级组件ID的方法
	const getThirdLevelComponentId = () => {
		let thirdLevelComponentId = null;
		if (typeMultiIndex.value[2] >= 0 && !isThirdLevelOther()) {
			const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
			if (selectedSecondLevel && selectedSecondLevel.children &&
				Array.isArray(selectedSecondLevel.children) &&
				typeMultiIndex.value[2] < selectedSecondLevel.children.length) {

				const selectedThirdLevel = selectedSecondLevel.children[typeMultiIndex.value[2]];
				if (selectedThirdLevel && selectedThirdLevel.id) {
					thirdLevelComponentId = selectedThirdLevel.id;
					console.log('找到第三级组件ID:', thirdLevelComponentId);
				}
			}
		}
		return thirdLevelComponentId;
	};

	const getThirdLevelComponentName = () => {
		let thirdLevelComponentName = null;
		if (typeMultiIndex.value[2] >= 0 && !isThirdLevelOther()) {
			const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
			if (selectedSecondLevel && selectedSecondLevel.children &&
				Array.isArray(selectedSecondLevel.children) &&
				typeMultiIndex.value[2] < selectedSecondLevel.children.length) {

				const selectedThirdLevel = selectedSecondLevel.children[typeMultiIndex.value[2]];
				if (selectedThirdLevel && selectedThirdLevel.name) {
					thirdLevelComponentName = selectedThirdLevel.name;
					console.log('找到第三级组件Name:', thirdLevelComponentName);
				}
			}
		}
		return thirdLevelComponentName;
	}

	const getAncestors = () => {
		let ancestors = null;
		if (typeMultiIndex.value[2] >= 0 && !isThirdLevelOther()) {
			const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
			if (selectedSecondLevel && selectedSecondLevel.children &&
				Array.isArray(selectedSecondLevel.children) &&
				typeMultiIndex.value[2] < selectedSecondLevel.children.length) {

				const selectedThirdLevel = selectedSecondLevel.children[typeMultiIndex.value[2]];
				if (selectedThirdLevel && selectedThirdLevel.name) {
					ancestors = selectedThirdLevel.ancestors;
					console.log('找到第三级组件ancestors:', ancestors);
				}
			}
		}
		return ancestors;
	}

	// 添加isThirdLevelOther辅助函数，用于判断是否选择了"其他"选项
	const isThirdLevelOther = () => {
		if (typeMultiIndex.value[1] < 0 || typeMultiIndex.value[2] < 0) {
			return true;
		}

		const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
		if (!selectedSecondLevel || !selectedSecondLevel.children || !Array.isArray(selectedSecondLevel.children)) {
			return true;
		}

		return typeMultiIndex.value[2] >= selectedSecondLevel.children.length;
	};

	const diseaseTypeObj = computed(() => {
		return allDiseaseTypes[typeindex.value];
	});

	const component = computed(() => {
		// 获取构件名称
		const componentName = getComponentName();

		// 获取第三级组件ID和Name（空心板、实心板那一级）
		const thirdLevelComponentId = getThirdLevelComponentId();
		const thirdLevelComponentName = getThirdLevelComponentName();
		const ancestors = getAncestors();
		return {
			createBy: "",
			createTime: '',
			updateTime: '',
			id: null, // 第一级id设为null
			code: componentCodeInput.value, // 使用输入的构件编号
			name: componentCodeInput.value + '#' + componentName, // 使用第三级选择的值或输入框中的值#构件编号
			biObjectId: thirdLevelComponentId,
			status: "0",
			delFlag: "0",
			biObject: {
				id: thirdLevelComponentId,
				name: thirdLevelComponentName, // 使用第三级选择的值
				count: 0,
				ancestors: ancestors
			},
			parentObjectName: parentObjectName.value, // 使用第二级选择的值
			grandObjectName: grandObjectName.value // 使用第一级选择的值
		}
	});

	const getBiObjctName = computed(() => {
		return getComponentName()
	});

	defineExpose({
		getBiObjctName,
		diseaseTypeObj,
		component,
		componentCodeInput,
		position,
		type,
		positionNumber,
	});
</script>

<style scoped>
	/*picker公用*/
	.picker-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.head {
		background-color: #BDCBE0;
	}

	.head-text {
		padding: 4rpx 10rpx;
		font-size: 18rpx;
	}

	.component-name {}

	.picker {
		font-size: 20rpx;
	}

	.picker-titleAndContent {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 14rpx 12rpx;
		border-bottom: 1rpx solid #eee;
	}

	.picker-title {
		color: #666666;
		font-size: 20rpx;
	}

	.picker-right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.picker-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.picker-content {
		color: #333333;
		font-size: 20rpx;
		margin-right: 10rpx;
	}

	.picker-icon {
		color: #CCCCCC;
		font-size: 20rpx;
	}

	.picker-must {
		color: #FF0000;
	}

	.component-name-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 180rpx;
		border: 1rpx solid #eee;
		padding: 0 4rpx;
	}

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

	/* 构件编号输入框样式 */
	.input-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 180rpx;
		border: 1rpx solid #eee;
		padding: 0 4rpx;
	}

	.component-code-input {
		font-size: 20rpx;
		text-align: right;
		padding-right: 10rpx;
	}

	.clear-input {
		opacity: 0.5;
	}

	.clear-icon {
		width: 16rpx;
		height: 14rpx;
		opacity: 0.5;
		flex-shrink: 0;
	}

	.componentCode-popup-content {
		background-color: #fff;
		width: 500rpx;
		height: 250rpx;
		border-radius: 8rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.popup-title {
		background-color: #BDCBE0;
		font-size: 20rpx;
		padding: 8rpx 0rpx;
		text-align: center;
		/* 添加水平居中 */
	}

	.popup-input1 {
		display: flex;
		align-items: center;
		padding: 10px 10rpx;
	}

	.popup-input1-title {
		font-size: 20rpx;
	}

	.popup-input1-input {
		display: flex;
		flex: 1;
		align-items: center;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-left: 10rpx;
	}

	.popup-input1-input input {
		flex: 1;
		padding: 5px;
	}

	.popup-input2 {
		display: flex;
		align-items: center;
		padding: 10px 10rpx;
	}

	.popup-input2-title {
		font-size: 20rpx;
	}

	.popup-input2-input {
		display: flex;
		flex: 1;
		align-items: center;
		margin-left: 10rpx;
		font-size: 20rpx;
	}

	.popup-input2-firstPart {
		border: 1px solid #ccc;
		display: flex;
		margin-right: 5rpx;
		padding: 4rpx 5px;
		align-items: center;
	}

	.popup-input2-firstPart-picker {
		flex: 1;
		margin-right: 20rpx;
		white-space: nowrap;
		/* 不换行 */
	}

	.popup-input2-secondPart {
		border: 1px solid #ccc;
		display: flex;
		margin: 0 5rpx;
		padding: 5rpx 5px;
		align-items: center;
	}

	.popup-input2-thirdPart {
		border: 1px solid #ccc;
		display: flex;
		margin: 0 5rpx;
		padding: 5rpx 5px;
		align-items: center;
	}

	.popup-input2-forthPart {
		border: 1px solid #ccc;
		display: flex;
		margin: 0 5rpx;
		padding: 5rpx 5px;
		align-items: center;
	}

	.popup-input2-fifthPart {
		border: 1px solid #ccc;
		display: flex;
		margin-left: 5rpx;
		padding: 5rpx 5px;
		align-items: center;
	}

	.popup-button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 30rpx;
	}

	.popup-button button {
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 20rpx;
		padding: 8rpx 8rpx;
		line-height: normal;
		/* 避免行高影响字体样式 */
	}

	.popup-button-cancel {
		background-color: #fff;
		color: #1677FF;
		border: 1px solid #1677FF;
		font-size: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10rpx;
	}

	.popup-button-confirm {
		background-color: #1677FF;
		color: #fff;
		margin-left: 10rpx;
	}

	.position-popup-content {
		background-color: #fff;
		width: 500rpx;
		height: 300rpx;
		border-radius: 8rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.position-popup-combined {
		font-size: 20rpx;
		margin-left: 10rpx;
	}

	.position-number-input {
		width: 60rpx;
		font-size: 20rpx;
	}

	.clear-icon {
		width: 18rpx;
		height: 18rpx;
	}
</style>
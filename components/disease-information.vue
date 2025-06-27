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
							<view class="clear-input" @click.stop="componentNameInput = '' ">×</view>
						</view>

					</view>
				</view>
			</picker>
		</view>


		<!-- 替换原来的构件编号picker为input输入框 -->
		<view class="picker">
			<view class="picker-titleAndContent">
				<view class="picker-left">
					<text class="picker-must">*</text>
					<view class="picker-title">
						构件编号
					</view>
				</view>
				<view class="input-right">
					<input class="component-code-input" v-model="componentCodeInput" placeholder="请输入构件编号"
						placeholder-style="color: #CCCCCC;" />
					<view class="clear-input" @click=" componentCodeInput = ''">×</view>
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
					<picker class="picker" :range="diseaseTypeOptions" @change="onDiseaseTypeChange">
						<view class="picker-content" :style="!typePicker ? 'color: #CCCCCC;' : ''">
							{{typePicker || '请选择病害类型'}}
						</view>
					</picker>
					<text class="picker-icon">&gt;</text>

					<view class="component-name-input" v-show="typePicker.split('#')[1] === '其他'">
						<input class="component-code-input" v-model="typeInput" placeholder="请输入病害类型"
							placeholder-style="color: #CCCCCC;" @click.stop />
						<view class="clear-input" @click.stop="typeInput = '' ">×</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 修改病害位置区域 - 从弹窗改为picker和input组合 -->
		<view class="picker">
			<view class="picker-titleAndContent">
				<view class="picker-left">
					<text class="picker-must">*</text>
					<view class="picker-title">
						病害位置
					</view>
				</view>
				<view class="picker-right">
					<picker class="picker" :range="diseasePosition" @change="onDiseasePositionChange">
						<view class="picker-content" :style="!positionPicker ? 'color: #CCCCCC;' : ''">
							{{positionPicker || '请选择病害位置'}}
						</view>
					</picker>
					<text class="picker-icon">&gt;</text>

					<view class="component-name-input" v-show="positionPicker === '其他'">
						<input class="component-code-input" v-model="positionInput" placeholder="请输入病害位置"
							placeholder-style="color: #CCCCCC;" @click.stop />
						<view class="clear-input" @click.stop="positionInput = '' ">×</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	// 保存结构数据
  import {
    computed,
    onMounted,
    ref,
    watch
  } from "vue";

	const props = defineProps({
		structureData: {
			type: Object,
		}
	});



	// 直接赋值（静态副本）
	const structureData = ref(null)

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

	// 创建一个数组来存储所有病害类型选项
	let allDiseaseTypes = [];

	// 缺损类型
	const type = ref('');
	const typeindex = ref(-1);
	// 添加病害类型picker和input变量
	const typePicker = ref('');
	const typeInput = ref('');

	// 缺损位置
	const position = ref('');
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

	// 使用watch监听prop变化
	watch(() => props.structureData, (newVal) => {
		console.log('structureData 更新:', newVal)
		if (newVal) {
			structureData.value = JSON.parse(JSON.stringify(newVal)) // 深拷贝避免引用问题
			initMultiPickerColumns()
		}
	}, {
		immediate: true,
		deep: true
	})

	// 添加onMounted处理可能的初始值
	onMounted(() => {
		console.log('组件挂载完成，当前structureData:', props.structureData)
    // 如果父组件在挂载前已传递数据
    if (props.structureData) {
      structureData.value = JSON.parse(JSON.stringify(props.structureData))
      initMultiPickerColumns()
    }
		// uni.$on('setComponentName', (emitParam) => {
		// 	componentNamePicker.value = emitParam
		// });
    uni.$on('setComponentName', onComponentNameChangeByEmit);
		uni.$on('setComponentCode', (emitParam) => {
			componentCodeInput.value = emitParam
		});
		uni.$on('setDiseaseType', onDiseaseTypeChangeByEmit);
		uni.$on('setDiseasePosition', setDiseasePosition);


		uni.$on('getDescription', getDescription);
		// 如果父组件在挂载前已传递数据
		/*if (props.structureData) {
			structureData.value = JSON.parse(JSON.stringify(props.structureData))
			initMultiPickerColumns()
		}*/
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
    }else{
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

		// 存储完整的diseaseTypes对象
		allDiseaseTypes = [];

		if(componentNamePicker.value === '其他'){
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
								if (!allDiseaseTypes.some(existing => existing.id === item.id)) {
									allDiseaseTypes.push(item);
								}
							});
						}
						
						// 遍历第三级children并添加其病害类型
						if (secondLevel.children && Array.isArray(secondLevel.children)) {
							secondLevel.children.forEach(thirdLevel => {
								if (thirdLevel.diseaseTypes && Array.isArray(thirdLevel.diseaseTypes)) {
									thirdLevel.diseaseTypes.forEach(item => {
										if (!allDiseaseTypes.some(existing => existing.id === item.id)) {
											allDiseaseTypes.push(item);
										}
									});
								}
							});
						}
					});
					
					console.log('其他选项 - 合并所有病害类型:', allDiseaseTypes);
				}
			}
		} else {
			// 添加第二级的病害类型（如果有）
			if (selectedBiObject.diseaseTypes && Array.isArray(selectedBiObject.diseaseTypes)) {
				allDiseaseTypes = [...selectedBiObject.diseaseTypes];
				console.log('第二级病害类型:', allDiseaseTypes);
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
						if (!allDiseaseTypes.some(existing => existing.id === item.id)) {
							allDiseaseTypes.push(item);
						}
					});
					console.log('添加第三级后的病害类型:', allDiseaseTypes);
				}
			}
		}

		// 更新缺损类型选项 - 只提取名称用于显示
		diseaseTypeOptions.value = allDiseaseTypes.map(item => `${item.code}#${item.name}`);

		console.log('最终缺损类型选项更新为:', diseaseTypeOptions.value);

		// 如果已经设置了病害类型，尝试在新的选项中找到对应的索引
		if (type.value) {
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
		}
    console.log('allDiseaseType',allDiseaseTypes)
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
	const onDiseasePositionChange = (e) => {
		const index = e.detail.value;
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
      diseaseTypeId: diseaseTypeId
		} = diseaseObj;
		// diseaseTypeOptions.value = typeOptions || [];
		// const index = diseaseTypeOptions.value.findIndex(item => item === diseaseType);
    const index = allDiseaseTypes.findIndex(item => item.id === diseaseTypeId);
		typePicker.value = diseaseTypeCode + '#' + diseaseType;
		typeindex.value = index;
		// 如果选择了"其他"，清空typeInput，等待用户输入
		if (typePicker.value.split('#')[1] == '其他') {
			typeInput.value = diseaseTypeInput;
		} else {
			// 否则直接更新type值
			type.value = typePicker.value;
		}
    // 获取选中的病害类型对象
    // const selectedDiseaseType = allDiseaseTypes.find(item => item.name === typePicker.value);
    const selectedDiseaseType = allDiseaseTypes.find(item => item.id === diseaseTypeId);
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
		const index = e.detail.value;
		if (index >= 0 && index < diseaseTypeOptions.value.length) {
			typePicker.value = diseaseTypeOptions.value[index];
			typeindex.value = index;

			// 如果选择了"其他"，清空typeInput，等待用户输入
			if (typePicker.value.split('#')[1] == '其他') {
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
		}
	}

	// 监听typePicker和typeInput的变化，更新type
	watch([typePicker, typeInput], ([newTypePicker, newTypeInput]) => {
		if (newTypePicker.split('#')[1] && newTypePicker.split('#')[1].trim() === '其他' && newTypeInput) {
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
          name: componentName + '#' + componentCodeInput.value, // 使用第三级选择的值或输入框中的值#构件编号
          biObjectId: thirdLevelComponentId,
          status: "0",
          delFlag: "0",
          biObject: {
            id: thirdLevelComponentId,
            name: thirdLevelComponentName, // 使用第三级选择的值
            count: 0,
            ancestors:ancestors
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
    type
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
  .clear-input{
    opacity: 0.5;
  }
</style>
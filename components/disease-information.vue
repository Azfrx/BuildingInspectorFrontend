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

					<view class="component-name-input" v-show="typePicker === '其他'">
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
              const componentName = emitComponent.biObjectName;

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
                  componentNameInput.value = componentName;
                  console.log('设置自定义构件名称:', componentName);
                }
              } else {
                // 第三级列表为空，设置为自定义名称
                componentNameInput.value = componentName;
                console.log('第三级列表为空，设置自定义构件名称:', componentName);
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

		// 更新缺损类型选项 - 只提取名称用于显示
		diseaseTypeOptions.value = allDiseaseTypes.map(item => item.name);

		console.log('最终缺损类型选项更新为:', diseaseTypeOptions.value);

		// 如果已经设置了病害类型，尝试在新的选项中找到对应的索引
		if (type.value) {
			const index = diseaseTypeOptions.value.findIndex(item => item === type.value);
			if (index !== -1) {
				typeindex.value = index;
				typePicker.value = type.value;
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
			diseaseType: diseaseType
		} = diseaseObj;
		// diseaseTypeOptions.value = typeOptions || [];
		const index = diseaseTypeOptions.value.findIndex(item => item === diseaseType);
		typePicker.value = diseaseType;
		typeindex.value = index;
		// 如果选择了"其他"，清空typeInput，等待用户输入
		if (typePicker.value === '其他') {
			typeInput.value = diseaseTypeInput;
		} else {
			// 否则直接更新type值
			type.value = typePicker.value;
			// 获取选中的病害类型对象
			const selectedDiseaseType = allDiseaseTypes.find(item => item.name === typePicker.value);
			if (selectedDiseaseType && selectedDiseaseType.maxScale && selectedDiseaseType.minScale) {
				// 根据maxScale和minScale更新评定标度选项
				const minScale = parseInt(selectedDiseaseType.minScale) || 1;
				const maxScale = parseInt(selectedDiseaseType.maxScale) || 4;

				uni.$emit('changeScale', {
					minScale: minScale,
					maxScale: maxScale
				});
				console.log('更新评定标度范围:', minScale, '至', maxScale);
			}
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
			if (typePicker.value === '其他') {
				typeInput.value = '';
			} else {
				// 否则直接更新type值
				type.value = typePicker.value;

				// 获取选中的病害类型对象
				const selectedDiseaseType = allDiseaseTypes.find(item => item.name === typePicker.value);
				if (selectedDiseaseType && selectedDiseaseType.maxScale && selectedDiseaseType.minScale) {
					// 根据maxScale和minScale更新评定标度选项
					const minScale = parseInt(selectedDiseaseType.minScale) || 1;
					const maxScale = parseInt(selectedDiseaseType.maxScale) || 4;

          uni.$emit('changeScale', {
            minScale: minScale,
            maxScale: maxScale
          });

					console.log('更新评定标度范围:', minScale, '至', maxScale);
				}
			}

			console.log('病害类型选择变更为:', typePicker.value);
		}
	}

	// 监听typePicker和typeInput的变化，更新type
	watch([typePicker, typeInput], ([newTypePicker, newTypeInput]) => {
		if (newTypePicker === '其他' && newTypeInput) {
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
    return allDiseaseTypes.find(item => item.name === typePicker.value)
  });

  const component = computed(() => {
    // 获取构件名称
    const componentName = getComponentName();

    // 获取第三级组件ID和Name（空心板、实心板那一级）
    const thirdLevelComponentId = getThirdLevelComponentId();
    const thirdLevelComponentName = getThirdLevelComponentName();
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
            count: 0
      },
      parentObjectName: parentObjectName.value, // 使用第二级选择的值
          grandObjectName: grandObjectName.value // 使用第一级选择的值
    }
  });

	defineExpose({
    diseaseTypeObj,
    component,
    componentCodeInput,
    position
	});
</script>

<style scoped>
	/* 编辑病害顶部按钮 */
	.button-group-edit {
		display: flex;
		flex-direction: row;
		background-color: #BDCBE0;
		align-items: center;
		/* 垂直居中按钮 */
		padding: 10rpx 0;
	}

	.button-delete {
		height: 36rpx;
		font-size: 16px;
		background-color: #FF3141;
		color: #ffffff;
		margin-right: 10rpx;
		display: flex;
		/* 设置为 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.button-edit {
		height: 36rpx;
		font-size: 16px;
		color: #ffffff;
		background-color: #0F4687;
		margin: 0 10rpx;
		display: flex;
		/* 设置为 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	/* 新增病害顶部按钮 */
	.button-group-add {
		display: flex;
		flex-direction: row;
		background-color: #BDCBE0;
		align-items: center;
		/* 垂直居中按钮 */
		padding: 10rpx 0;
	}

	.button-before,
	.button-next {
		height: 36rpx;
		font-size: 16px;
		margin: 0 10rpx;
		background-color: #0F4687;
		color: #ffffff;
		display: flex;
		/* 设置为 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.button-savetonext {
		height: 36rpx;
		font-size: 16px;
		background-color: #0F4687;
		color: #ffffff;
		margin-right: 10rpx;
		display: flex;
		/* 设置为 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.button-save {
		height: 36rpx;
		font-size: 16px;
		background-color: #0F4687;
		color: #ffffff;
		margin-left: 0;
		margin-right: 0;
		display: flex;
		/* 设置为 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.button-cancle {
		height: 36rpx;
		font-size: 16px;
		border: 1px solid #1677FF;
		margin: 0 10rpx;
		display: flex;
		/* 设置为 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	/*picker公用*/
	.picker-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}



	/* 上传图片 */
	.part-UploadImage {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #EEEEEE;
		padding: 12rpx 16rpx;
		height: 200rpx;
	}

	.part-title {
		font-size: 20rpx;
	}

	.upload-view {
		width: 100%;
		margin-top: 10rpx;
	}

	.file-picker {}

	.part-ADImages {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #EEEEEE;
		padding: 12rpx 16rpx;
	}


	.ADImages {
		width: 100%;
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.img-wrapper {
		width: 140rpx;
		height: 140rpx;
		position: relative;
		display: inline-block;
		margin: 0 10rpx;
		border: 1px solid #EEEEEE;
		border-radius: 5rpx;
	}

	.ADImage {
		height: 140rpx;
		width: 140rpx;
		object-fit: cover;
		/* 保持比例裁剪填充 */
		border-radius: 8rpx;
	}

	/* 右上角的删除按钮 */
	.close-btn {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		width: 20rpx;
		height: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.6);
		color: #fff;
		font-size: 24rpx;
		z-index: 1;
	}

	.ADImage-container {
		height: 140rpx;
		width: 140rpx;
		border: 1px solid #eeeeee;
		border-radius: 5rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ADImageButton {
		height: 100rpx;
		width: 100rpx;
	}

	.popup-content {
		background-color: #fff;
		height: 70vh;
		/* padding: 10rpx; */
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	.template-row {
		width: 100%;
		border-bottom: 1px solid #eeeeee;
	}

	.template-type {
		font-size: 18rpx;
		padding: 16rpx;
		box-sizing: border-box;
	}

	.template-image {
		width: 100%;
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		row-gap: 10rpx;
		border-bottom: 1px solid #eeeeee;
		gap: 20rpx;
	}

	.template-image-card {
		height: 200rpx;
		width: 200rpx;
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


	/* 病害位置弹窗样式 */
	.position-popup-content {
		background-color: #fff;
		width: 600rpx;
		height: 250rpx;
		border-radius: 8rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}

	.position-popup-title {
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.position-combox {
		margin-bottom: 20rpx;
	}

	.position-popup-buttons {
		display: flex;
		justify-content: center;
		gap: 30rpx;
	}

	.position-popup-button {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 6rpx;
		font-size: 26rpx;
		padding: 0;
	}

	.position-popup-button.cancel {
		border: 1rpx solid #ddd;
		color: #666;
	}

	.position-popup-button.confirm {
		background-color: #0F4687;
		color: #fff;
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


	.clear {
		margin-left: 10rpx;
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


	.input-area {
		padding: 12rpx 16rpx;
		border-bottom: 1rpx solid #eee;
	}

	.input-area-title {
		font-size: 18rpx;
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
		background-color: #2979FF;
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


	.form-container {
		height: calc(100vh - 80rpx);
		/* 减去顶部按钮组的高度 */
		overflow-y: auto;
		/* 垂直方向可滚动 */
		box-sizing: border-box;
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
</style>
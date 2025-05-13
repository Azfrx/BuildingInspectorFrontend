<template>
	<view>
		<!-- 新增病害时显示 -->
		<view class="button-group-add" v-if="!isEdit">
			<button class="button-savetonext" @click="savetonextdisease">保存并复制到下一条</button>
			<button class="button-save" @click="savedisease">保存</button>
			<button class="button-cancle" @click="canceldisease">取消</button>
		</view>

		<!-- 编辑病害时显示 -->
		<view class="button-group-edit" v-else>
			<button class="button-before" @click="beforedisease">上一条</button>
			<button class="button-next" @click="nextdisease">下一条</button>
			<button class="button-delete" @click="deleteDisease">删除</button>
			<button class="button-save" @click="copyAndAddDisease">复制并新增</button>
			<button class="button-edit" @click="editDisease">编辑</button>

		</view>

		<!-- 表单内容容器 - 添加form-container类以便横屏时调整布局 -->
		<view class="form-container">
			<view class="part-typeandnumber">

				<picker class="picker-type" @change="typePickerChange" :value="biObjectindex" :range="biObjectName">
					<view class="picker-content">
						<view class="part-titleandcontent">
							<view class="part-title" style="position: relative;">
								<text style="position: absolute; left: -10px; color: red;">*</text>部件类型
							</view>
							<view class="part-content" :style="biObjectindex === -1 ? 'color: #CCCCCC;' : ''">
								{{ biObjectName[biObjectindex] || '请选择部件类型'}}
							</view>
						</view>
						<view class="part-icon">&gt;</view>
					</view>
				</picker>


				<picker class="picker-number" @change="numberPickerChange" :value="componentCodeindex" :range="componentCode">
					<view class="picker-content">
						<view class="part-titleandcontent">
							<view class="part-title" style="position: relative;">
								<text style="position: absolute; left: -10px; color: red;">*</text>构件编号
							</view>
							<view class="part-content" :style="componentCodeindex === -1 ? 'color: #CCCCCC;' : ''">
								{{ componentCode[componentCodeindex] || '请选择构件编号'}}
							</view>
						</view>
						<view class="part-icon">&gt;</view>
					</view>
				</picker>

			</view>

			<view class="part-Typeofdefect">
				<picker class="picker-Typeofdefect" @change="TypeofdefectPickerChange" :value="typeindex"
					:range="type">
					<view class="picker-content">
						<view class="part-titleandcontent">
							<view class="part-title" style="position: relative;">
								<text style="position: absolute; left: -10px; color: red;">*</text>缺损类型
							</view>
							<view class="part-content" :style="typeindex === -1 ? 'color: #CCCCCC;' : ''">
								{{type[typeindex] || '请选择缺损类型'}}
							</view>
						</view>

						<view class="part-icon">&gt;</view>
					</view>
				</picker>
			</view>

			<view class="part-Positionofdefect">
				<view class="input-content">
					<view class="part-titleandcontent">
						<view class="part-title" style="position: relative;">
							<text style="position: absolute; left: -10px; color: red;">*</text>缺损位置
						</view>
						<input type="text" placeholder="请填写缺损位置信息" class="input-text"
							placeholder-class="input-text-placeholder" v-model="position">
					</view>
				</view>
			</view>

			<view class="part-NumAndWayofDefect">

				<view class="part-NumofDefect">
					<view class="picker-content">
						<view class="part-titleandcontent">
							<view class="part-title" style="position: relative;">
								<text style="position: absolute; left: -10px; color: red;">*</text>缺损数量
							</view>
							<uni-number-box class="NumofDefect" v-model="quantity" />
						</view>

					</view>
				</view>

				<picker class="part-WayofDefect" @change="WayofDefectPickerChange" :value="WayofDefectindex"
					:range="WayofDefect">
					<view class="picker-content">
						<view class="part-titleandcontent">
							<view class="part-title">数据记载方式</view>
							<view class="part-content" :style="WayofDefectindex === -1 ? 'color: #CCCCCC;' : ''">
								{{WayofDefect[WayofDefectindex] || '请选择数据记载方式'}}
							</view>
						</view>
						<view class="part-icon">&gt;</view>
					</view>
				</picker>

			</view>

			<view class="part-LengthAndWidth">
				<view class="part-Length">
					<view class="input-content">
						<view class="part-titleandcontent">
							<view class="part-title">长度(m)</view>
							<input type="text" placeholder="长度数据" class="input-text"
								placeholder-class="input-text-placeholder" v-model="length">
						</view>
					</view>
				</view>

				<view class="part-Width">
					<view class="input-content">
						<view class="part-titleandcontent">
							<view class="part-title">宽度(m)</view>
							<input type="text" placeholder="宽度数据" class="input-text"
								placeholder-class="input-text-placeholder" v-model="width">
						</view>
					</view>
				</view>

			</view>

			<view class="part-SeamWidth-height-area">
				<view class="part-SeamWidth">
					<view class="input-content">
						<view class="part-titleandcontent">
							<view class="part-title">缝宽(mm)</view>
							<input type="text" placeholder="缝宽数据" class="input-text"
								placeholder-class="input-text-placeholder" v-model="slitWidth">
						</view>
					</view>
				</view>

				<view class="part-height">
					<view class="input-content">
						<view class="part-titleandcontent">
							<view class="part-title">高度/深度(m)</view>
							<input type="text" placeholder="高度/深度数据" class="input-text"
								placeholder-class="input-text-placeholder" v-model="heightOrDepth">
						</view>
					</view>
				</view>

				<view class="part-area">
					<view class="input-content">
						<view class="part-titleandcontent">
							<view class="part-title">面积(m²)</view>
							<input type="text" placeholder="面积数据" class="input-text"
								placeholder-class="input-text-placeholder" v-model="area">
						</view>
					</view>
				</view>
			</view>

			<view class="part-descriptionofDefect">
				<view class="input-content">
					<view class="part-titleandcontent">
						<view class="part-title" style="position: relative;">
							<text style="position: absolute; left: -10px; color: red;">*</text>病害描述(性质、范围、程度等)
						</view>
						<input type="text" placeholder="请填写病害描述信息" class="input-text"
							placeholder-class="input-text-placeholder" v-model="description">
					</view>
				</view>
			</view>

			<view class="part-ScalesandRatings">
				<view class="part-Scales">
					<view class="radio-title" style="position: relative;">
						<text style="position: absolute; left: -10px; color: red;">*</text>评定标度
					</view>
					<radio-group @change="ScalesRadioChange" class="radio-group">
						<label class="radio-group-label" v-for="(item, index) in scalesItems" :key="item.value">
							<view class="radio-item">
								<radio style="transform:scale(1.2)" :value="item.value"
									:checked="index === scalesCurrent" />
							</view>
							<view class="radio-item-name">{{item.name}}</view>
						</label>
					</radio-group>
					<view class="part-prompt">
						最大标度：4
					</view>

				</view>

				<view class="part-Ratings">
					<view class="radio-title" style="position: relative;">
						<text style="position: absolute; left: -10px; color: red;">*</text>参与评定
					</view>
					<radio-group @change="RatingsRadioChange" class="radio-group">
						<label class="radio-group-label" v-for="(item, index) in ratingItems" :key="item.value">
							<view class="radio-item">
								<radio style="transform:scale(1.2)" :value="item.value"
									:checked="index === ratingCurrent" />
							</view>
							<view class="radio-item-name">{{item.name}}</view>
						</label>
					</radio-group>
					<view class="part-prompt">
						构件扣分：25
					</view>
				</view>

			</view>

			<view class="part-UploadImage">
				<view class="part-title">上传图片或视频</view>
				<view class="upload-view">
					<uni-file-picker class="file-picker" limit="9" :image-styles="imageStyles" v-model="fileList"
						file-mediatype="image" mode="grid" @select="handleFileSelect" @delete="handleFileDelete"
						:auto-upload="false"></uni-file-picker>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
		watch
	} from 'vue';
	import { getObject } from '../../utils/readJsonNew.js';
	import { saveDiseaseImages } from '../../utils/reviseNew.js';


	const userId = '3';
	const buildingId = '39';
	// 判断是编辑模式还是新增模式
	const isEdit = ref(false);

	// 保存结构数据
	const structureData = ref(null);
	// 保存原始病害类型部位（上部结构、下部结构、桥面系）
	const parentObjectName = ref('上部结构'); // 默认值
	// 部件类型列表 - 动态生成
	const biObjectNameOptions = ref([]);
	// 缺损类型列表 - 动态生成
	const diseaseTypeOptions = ref([]);

	// 部件类型
	const biObjectName = ref([]);
	const biObjectindex = ref(-1);

	// 构件编号
	const componentCode = ref(['1', '2', '3']);
	const componentCodeindex = ref(-1);

	// 缺损类型
	const type = ref([]);
	const typeindex = ref(-1);

	// 缺损位置
	const position = ref('');

	// 缺损数量
	const quantity = ref(1);

	// 数据记载方式
	const WayofDefect = ref(['数值', '记载方式2', '记载方式3']);
	const WayofDefectindex = ref(0);

	// 长度
	const length = ref('');

	//宽度
	const width = ref('');

	//缝宽
	const slitWidth = ref('');

	//高度/深度
	const heightOrDepth = ref('');

	//面积
	const area = ref('');

	//病害描述
	const description = ref('');

	// 图片文件列表
	const fileList = ref([]);

	//标度
	const scalesItems = reactive([{
		name: '1级',
		value: '1'
	}, {
		name: '2级',
		value: '2'
	}, {
		name: '3级',
		value: '3'
	}, {
		name: '4级',
		value: '4'
	}]);
	const scalesCurrent = ref(0);

	// 参与评定
	const ratingItems = reactive([{
		name: '否',
		value: '0'
	}, {
		name: '是',
		value: '1'
	}]);
	const ratingCurrent = ref(0);

	// 获取结构数据
	const fetchStructureData = async () => {
		try {
			// 用户ID和建筑ID
			const userId = "3";
			const buildingId = "39";
			
			// 在实际应用中，这些可能来自于路由参数或全局状态
			const data = await getObject(userId, buildingId);
			console.log('结构数据获取成功:', data);
			structureData.value = data;
			
			// 初始化部件类型列表
			updateBiObjectOptions();
		} catch (error) {
			console.error('获取结构数据失败:', error);
			uni.showToast({
				title: '获取结构数据失败',
				icon: 'none'
			});
		}
	};

	// 根据当前选择的parentObjectName更新部件类型选项
	const updateBiObjectOptions = () => {
		if (!structureData.value || !structureData.value.children) {
			console.log('结构数据不完整');
			return;
		}
		
		console.log('更新部件类型选项，当前选择:', parentObjectName.value);
		
		// 找到对应的结构部分（上部结构、下部结构、桥面系）
		const structurePart = structureData.value.children.find(
			item => item.name === parentObjectName.value
		);
		
		if (!structurePart || !structurePart.children) {
			console.log('未找到对应的结构部分或其子项');
			biObjectName.value = [];
			return;
		}
		
		// 提取部件类型名称列表
		biObjectNameOptions.value = structurePart.children;
		biObjectName.value = structurePart.children.map(item => item.name);
		console.log('部件类型选项更新为:', biObjectName.value);
		
		// 重置部件类型选择
		biObjectindex.value = -1;
		// 重置缺损类型选择
		type.value = [];
		typeindex.value = -1;
		// 重置构件编号
		componentCode.value = [];
		componentCodeindex.value = -1;
	};

	// 更新构件编号下拉列表
	const updateComponentNumbers = () => {
		if (biObjectindex.value === -1 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
			console.log('无效的部件类型选择');
			componentCode.value = [];
			return;
		}
		
		const selectedBiObject = biObjectNameOptions.value[biObjectindex.value];
		if (!selectedBiObject) {
			console.log('选中的部件类型不存在');
			componentCode.value = [];
			return;
		}
		
		// 检查是否有comments字段
		if (!selectedBiObject.comments || !Array.isArray(selectedBiObject.comments) || selectedBiObject.comments.length === 0) {
			console.log('当前部件类型没有构件编号信息');
			componentCode.value = ['1', '2', '3']; // 使用默认值
			return;
		}
		
		// 从comments中提取code字段作为构件编号
		componentCode.value = selectedBiObject.comments.map(item => item.code);
		console.log('构件编号选项更新为:', componentCode.value);
		
		// 重置构件编号选择
		componentCodeindex.value = -1;
	};

	// 根据选择的部件类型更新缺损类型选项
	const updateDiseaseTypeOptions = () => {
		if (biObjectindex.value === -1 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
			console.log('无效的部件类型选择');
			type.value = [];
			return;
		}
		
		const selectedBiObject = biObjectNameOptions.value[biObjectindex.value];
		if (!selectedBiObject || !selectedBiObject.diseaseTypes) {
			console.log('选中的部件类型没有缺损类型定义');
			type.value = [];
			return;
		}
		
		// 提取缺损类型名称列表
		diseaseTypeOptions.value = selectedBiObject.diseaseTypes;
		type.value = selectedBiObject.diseaseTypes.map(item => item.name);
		console.log('缺损类型选项更新为:', type.value);
		
		// 重置缺损类型选择
		typeindex.value = -1;
	};

	// 监听parentObjectName变化
	watch(parentObjectName, (newVal) => {
		console.log('parentObjectName变化为:', newVal);
		updateBiObjectOptions();
	});

	// 监听部件类型选择变化
	watch(biObjectindex, (newVal) => {
		console.log('部件类型选择变化为索引:', newVal);
		if (newVal !== -1) {
			updateDiseaseTypeOptions();
			updateComponentNumbers();
		}
	});

	// 页面加载时，根据参数判断是新增还是编辑模式
	onMounted(() => {
		// 获取结构数据
		fetchStructureData();
		
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;

		// 如果有mode参数且值为edit，则设为编辑模式
		if (options && options.mode === 'edit') {
			isEdit.value = true;

			// 如果传递了数据，则解析并填充表单
			if (options.data) {
				try {
					const diseaseData = JSON.parse(decodeURIComponent(options.data));
					console.log('接收到的编辑数据:', diseaseData);

					// 填充表单数据
					fillFormWithData(diseaseData);
				} catch (error) {
					console.error('解析编辑数据失败:', error);
					uni.showToast({
						title: '加载编辑数据失败',
						icon: 'none'
					});
				}
			}
		}
		// 新增模式下，获取传递的type参数
		else {
			console.log('新增模式');
			// 设置病害类型
			if (options && options.type) {
				try {
					const typeVal = decodeURIComponent(options.type);
					console.log('接收到的病害类型位置:', typeVal);
					parentObjectName.value = typeVal;
				} catch (error) {
					console.error('解析type参数失败:', error);
					// 如果解析失败，设置默认值
					parentObjectName.value = '上部结构';
				}
			} else {
				console.log('未接收到type参数，使用默认值: 上部结构');
				parentObjectName.value = '上部结构'; // 设置默认值
			}
		}
	});

	// 根据接收的数据填充表单
	const fillFormWithData = (data) => {
		console.log('开始填充表单数据:', data);
		
		// 保存病害所属类型（上部结构/下部结构/桥面系）
		if (data.component?.parentObjectName) {
			parentObjectName.value = data.component.parentObjectName;
			console.log('设置病害类型:', parentObjectName.value);
		}
		
		// 等待biObjectName更新后再设置其他值
		setTimeout(() => {
			// 设置部件类型
			if (data.component?.biObject?.name) {
				const index = biObjectName.value.findIndex(item => item === data.component.biObject.name);
				if (index !== -1) {
					biObjectindex.value = index;
					console.log('设置部件类型:', data.component.biObject.name);
					
					// 等待构件编号列表更新后设置构件编号
					setTimeout(() => {
						// 设置构件编号
						if (data.component?.code) {
							const codeIndex = componentCode.value.findIndex(item => item === data.component.code);
							if (codeIndex !== -1) {
								componentCodeindex.value = codeIndex;
								console.log('设置构件编号:', data.component.code);
							}
						}
					}, 50);
				}
			}
			
			// 等待type更新后再设置
			setTimeout(() => {
				// 设置缺损类型
				if (data.type) {
					const index = type.value.findIndex(item => item === data.type);
					if (index !== -1) {
						typeindex.value = index;
						console.log('设置缺损类型:', data.type);
					}
				}
			}, 50);
		}, 100);

		// 设置缺损位置
		if (data.position) {
			position.value = data.position;
		}

		// 设置缺损数量
		if (data.quantity) {
			quantity.value = parseInt(data.quantity) || 1;
		}

		// 设置评定标度
		if (data.level) {
			const index = scalesItems.findIndex(item => item.value === data.level.toString());
			if (index !== -1) {
				scalesCurrent.value = index;
			}
		}

		// 设置参与评定
		if (data.participateAssess !== undefined) {
			const index = ratingItems.findIndex(item => item.value === data.participateAssess);
			if (index !== -1) {
				ratingCurrent.value = index;
			}
		}

		// 设置长度
		if (data.length) {
			length.value = data.length;
		}

		// 设置宽度
		if (data.width) {
			width.value = data.width;
		}

		// 设置缝宽
		if (data.slitWidth) {
			slitWidth.value = data.slitWidth;
		}

		// 设置高度/深度
		if (data.heightOrDepth) {
			heightOrDepth.value = data.heightOrDepth;
		}

		// 设置面积
		if (data.area) {
			area.value = data.area;
		}

		// 设置病害描述
		if (data.description) {
			description.value = data.description;
		}

		// 处理图片数据
		if (data.images && Array.isArray(data.images)) {
			fileList.value = data.images.map((url, index) => ({
				name: `图片${index + 1}`,
				url: url,
				extname: 'jpg',
				size: 0
			}));
		}
		
		console.log('表单数据填充完成');
	};

	// 图片上传样式
	const imageStyles = reactive({
		width: '150rpx',
		height: '150rpx'
	});

	const beforedisease = () => {
		console.log('上一条');
		// 获取当前病害ID和类型
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;
		const currentId = options?.id;

		if (!currentId || !parentObjectName.value) {
			uni.showToast({
				title: '无法获取当前病害信息',
				icon: 'none'
			});
			return;
		}

		// 使用uni.$emit发送获取同类型病害列表的请求
		uni.$emit('getDiseasesOfType', {
			type: parentObjectName.value,
			currentId: currentId,
			callback: (diseaseList) => {
				if (!diseaseList || diseaseList.length === 0) {
					uni.showToast({
						title: '没有可用的病害记录',
						icon: 'none'
					});
					return;
				}

				// 过滤掉已删除的病害
				const validDiseases = diseaseList.filter(item => !item.isDelete);

				// 找到当前病害的索引
				const currentIndex = validDiseases.findIndex(item => item.id === currentId);
				if (currentIndex === -1) {
					uni.showToast({
						title: '无法找到当前病害',
						icon: 'none'
					});
					return;
				}

				// 计算上一个病害的索引（循环到最后一个）
				const prevIndex = currentIndex === 0 ? validDiseases.length - 1 : currentIndex - 1;
				const prevDisease = validDiseases[prevIndex];

				// 跳转到上一个病害的编辑页面
				navigateToEditDisease(prevDisease);
			}
		});
	}

	const nextdisease = () => {
		console.log('下一条');
		// 获取当前病害ID和类型
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;
		const currentId = options?.id;

		if (!currentId || !parentObjectName.value) {
			uni.showToast({
				title: '无法获取当前病害信息',
				icon: 'none'
			});
			return;
		}

		// 使用uni.$emit发送获取同类型病害列表的请求
		uni.$emit('getDiseasesOfType', {
			type: parentObjectName.value,
			currentId: currentId,
			callback: (diseaseList) => {
				if (!diseaseList || diseaseList.length === 0) {
					uni.showToast({
						title: '没有可用的病害记录',
						icon: 'none'
					});
					return;
				}

				// 过滤掉已删除的病害
				const validDiseases = diseaseList.filter(item => !item.isDelete);

				// 找到当前病害的索引
				const currentIndex = validDiseases.findIndex(item => item.id === currentId);
				if (currentIndex === -1) {
					uni.showToast({
						title: '无法找到当前病害',
						icon: 'none'
					});
					return;
				}

				// 计算下一个病害的索引（循环到第一个）
				const nextIndex = currentIndex === validDiseases.length - 1 ? 0 : currentIndex + 1;
				const nextDisease = validDiseases[nextIndex];

				// 跳转到下一个病害的编辑页面
				navigateToEditDisease(nextDisease);
			}
		});
	}

	// 导航到编辑病害页面的辅助函数
	const navigateToEditDisease = (disease) => {
		if (!disease || !disease.id) {
			uni.showToast({
				title: '无效的病害数据',
				icon: 'none'
			});
			return;
		}

		// 将病害数据编码为URL参数
		const diseaseData = encodeURIComponent(JSON.stringify(disease));

		// 重定向到编辑页面并传递必要参数
		uni.redirectTo({
			url: `/pages/add-disease/add-disease?mode=edit&id=${disease.id}&data=${diseaseData}`,
			success: () => {
				console.log('成功导航到病害:', disease.id);
			},
			fail: (error) => {
				console.error('导航失败:', error);
				uni.showToast({
					title: '切换失败，请重试',
					icon: 'none'
				});
			}
		});
	}

	const savetonextdisease = () => {
		console.log('保存并复制到下一条');
		// 调用创建标准数据结构的函数，然后进行保存
		const diseaseData = createDiseaseData();
		if (diseaseData) {
			saveWithoutNavigateBack(diseaseData);
		}
	}

	// 创建标准病害数据对象的函数
	const createDiseaseData = () => {
		// 获取选中的缺损类型对象（如果有）
		let diseaseTypeObj = null;
		if (typeindex.value !== -1 && diseaseTypeOptions.value && diseaseTypeOptions.value[typeindex.value]) {
			diseaseTypeObj = diseaseTypeOptions.value[typeindex.value];
		}
		
		// 获取选中的部件对象（如果有）
		let biObjectObj = null;
		if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex.value]) {
			biObjectObj = biObjectNameOptions.value[biObjectindex.value];
		}
		
		// 获取选中的构件对象（如果有）
		let componentObj = null;
		if (componentCodeindex.value !== -1 && biObjectObj && biObjectObj.comments) {
			componentObj = biObjectObj.comments[componentCodeindex.value];
		}
		
		// 创建符合要求的病害数据对象
		const diseaseData = {
			createBy: "crh@znjc",
			createTime: formatDateTime(),
			updateTime: formatDateTime(),
			id: getCurrentPages()[getCurrentPages().length - 1].$page?.options?.id || new Date().getTime(),
			diseaseType: diseaseTypeObj ? {
				id: diseaseTypeObj.id,
				code: diseaseTypeObj.code || '',
				name: diseaseTypeObj.name,
				maxScale: diseaseTypeObj.maxScale || 5,
				minScale: diseaseTypeObj.minScale || 1,
				status: "0"
			} : null,
			diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
			description: description.value,
			position: position.value,
			trend: "稳定",
			level: parseInt(scalesItems[scalesCurrent.value].value),
			quantity: parseInt(quantity.value),
			length: length.value,
			width: width.value,
			slitWidth: slitWidth.value,
			heightOrDepth: heightOrDepth.value,
			area: area.value,
			type: type.value[typeindex.value],
			participateAssess: ratingItems[ratingCurrent.value].value,
			deductPoints: 35,
			biObjectId: biObjectObj ? biObjectObj.id : null,
			projectId: 2,
			component: componentObj ? {
				createBy: "admin",
				createTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				updateTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				id: componentObj.id,
				code: componentObj.code,
				name: componentObj.name || `${biObjectObj.name}${componentCodeindex.value + 1}`,
				biObjectId: biObjectObj ? biObjectObj.id : null,
				status: "0",
				delFlag: "0",
				biObject: {
					id: biObjectObj ? biObjectObj.id : null,
					name: biObjectObj ? biObjectObj.name : '',
					count: 0
				},
				parentObjectName: parentObjectName.value
			} : null,
			componentId: componentObj ? componentObj.id : null,
			buildingId: 37,
			images: [] // 初始化为空数组，等待图片保存后更新
		};

		// 验证数据完整性
		if (!diseaseData.type || !diseaseData.component || !diseaseData.diseaseType) {
			console.log('数据不完整，请确保选择了部件类型、构件编号和缺损类型');
			uni.hideLoading();
			uni.showToast({
				title: '请填写必填项',
				icon: 'none'
			});
			return null;
		}
		
		return diseaseData;
	}

	// 保存但不返回上一页的方法
	const saveWithoutNavigateBack = (diseaseData) => {
		console.log('保存但不返回');
		
		// 显示加载提示
		uni.showLoading({
			title: '保存中...'
		});
		
		// 使用公共方法保存图片和更新病害数据
		saveImagesAndUpdateDisease(diseaseData, false)
			.then(() => {
				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
				
				// 只清空图片列表，保留其他表单数据
				setTimeout(() => {
					// 清空图片列表
					fileList.value = [];
					console.log('已清空图片列表，保留其他表单数据');
					
					// 显示提示
					uni.showToast({
						title: '已保存，可继续添加下一条',
						icon: 'none',
						duration: 1500
					});
				}, 500);
			})
			.catch(error => {
				console.error('保存失败:', error);
				uni.hideLoading();
				uni.showToast({
					title: '保存失败，请重试',
					icon: 'none'
				});
			});
	}

	// 保存图片的公共方法
	const saveImagesAndUpdateDisease = (diseaseData, isEditMode) => {
		return new Promise((resolve, reject) => {
			// 获取当前页面选项
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			const options = currentPage.$page?.options;
			
			// 如果是编辑模式，获取原始数据中的图片
			let originalImages = [];
			if (isEditMode && options && options.data) {
				try {
					const originalData = JSON.parse(decodeURIComponent(options.data));
					originalImages = originalData.images || [];
				} catch (error) {
					console.error('解析原始数据失败:', error);
				}
			}
			
			// 获取当前文件列表中的图片URL
			const currentImageUrls = fileList.value.map(img => img.url);
			
			// 找出需要保留的原有图片（没有被删除的）
			const imagesToKeep = originalImages.filter(img => 
				currentImageUrls.includes(img)
			);
			
			// 找出需要删除的原有图片（被删除的）
			const imagesToDelete = originalImages.filter(img => 
				!currentImageUrls.includes(img)
			);
			
			// 找出新增的图片（不在原有图片列表中的）
			const newImages = currentImageUrls.filter(url => 
				!originalImages.includes(url)
			);
			
			// 如果有需要删除的图片，删除它们
			if (imagesToDelete.length > 0) {
				imagesToDelete.forEach(imgPath => {
					plus.io.resolveLocalFileSystemURL(imgPath, fileEntry => {
						fileEntry.remove(() => {
							console.log('删除原有图片成功:', imgPath);
						}, error => {
							console.error('删除原有图片失败:', error);
						});
					}, error => {
						console.error('无法访问原有图片:', error);
					});
				});
			}
			
			// 如果有新增图片，保存它们
			if (newImages.length > 0) {
				saveDiseaseImages(userId, buildingId, newImages)
					.then(savedPaths => {
						// 合并保留的原有图片和新保存的图片
						diseaseData.images = [...imagesToKeep, ...savedPaths];
						
						// 根据模式发送不同的事件
						if (isEditMode) {
							uni.$emit('updateDisease', diseaseData);
						} else {
							uni.$emit('addNewDisease', diseaseData);
						}
						
						resolve();
					})
					.catch(error => {
						console.error('保存新图片失败:', error);
						reject(error);
					});
			} else {
				// 如果没有新增图片，直接使用保留的原有图片
				diseaseData.images = imagesToKeep;
				
				// 根据模式发送不同的事件
				if (isEditMode) {
					uni.$emit('updateDisease', diseaseData);
				} else {
					uni.$emit('addNewDisease', diseaseData);
				}
				
				resolve();
			}
		});
	};

	const savedisease = () => {
		console.log('保存按钮点击');

		// 获取选中的缺损类型对象（如果有）
		let diseaseTypeObj = null;
		if (typeindex.value !== -1 && diseaseTypeOptions.value && diseaseTypeOptions.value[typeindex.value]) {
			diseaseTypeObj = diseaseTypeOptions.value[typeindex.value];
		}
		
		// 获取选中的部件对象（如果有）
		let biObjectObj = null;
		if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex.value]) {
			biObjectObj = biObjectNameOptions.value[biObjectindex.value];
		}
		
		// 获取选中的构件对象（如果有）
		let componentObj = null;
		if (componentCodeindex.value !== -1 && biObjectObj && biObjectObj.comments) {
			componentObj = biObjectObj.comments[componentCodeindex.value];
		}
		
		// 创建符合要求的病害数据对象
		const diseaseData = {
			createBy: "crh@znjc",
			createTime: formatDateTime(),
			updateTime: formatDateTime(),
			id: getCurrentPages()[getCurrentPages().length - 1].$page?.options?.id || new Date().getTime(),
			diseaseType: diseaseTypeObj ? {
				id: diseaseTypeObj.id,
				code: diseaseTypeObj.code || '',
				name: diseaseTypeObj.name,
				maxScale: diseaseTypeObj.maxScale || 5,
				minScale: diseaseTypeObj.minScale || 1,
				status: "0"
			} : null,
			diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
			description: description.value,
			position: position.value,
			trend: "稳定",
			level: parseInt(scalesItems[scalesCurrent.value].value),
			quantity: parseInt(quantity.value),
			length: length.value,
			width: width.value,
			slitWidth: slitWidth.value,
			heightOrDepth: heightOrDepth.value,
			area: area.value,
			type: type.value[typeindex.value],
			participateAssess: ratingItems[ratingCurrent.value].value,
			deductPoints: 35,
			biObjectId: biObjectObj ? biObjectObj.id : null,
			projectId: 2,
			component: componentObj ? {
				createBy: "admin",
				createTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				updateTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				id: componentObj.id,
				code: componentObj.code,
				name: componentObj.name || `${biObjectObj.name}${componentCodeindex.value + 1}`,
				biObjectId: biObjectObj ? biObjectObj.id : null,
				status: "0",
				delFlag: "0",
				biObject: {
					id: biObjectObj ? biObjectObj.id : null,
					name: biObjectObj ? biObjectObj.name : '',
					count: 0
				},
				parentObjectName: parentObjectName.value
			} : null,
			componentId: componentObj ? componentObj.id : null,
			buildingId: 37,
			images: [] // 初始化为空数组，等待图片保存后更新
		};

		// 验证数据完整性
		if (!diseaseData.type || !diseaseData.component || !diseaseData.diseaseType) {
			console.log('数据不完整，请确保选择了部件类型、构件编号和缺损类型');
			uni.hideLoading();
			uni.showToast({
				title: '请填写必填项',
				icon: 'none'
			});
			return;
		}

		// 显示加载提示
		uni.showLoading({
			title: '保存中...'
		});

		// 使用公共方法保存图片和更新病害数据
		saveImagesAndUpdateDisease(diseaseData, isEdit.value)
			.then(() => {
				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 500);
			})
			.catch(error => {
				uni.hideLoading();
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				});
			});
	};

	const canceldisease = () => {
		uni.navigateBack({
			delta: 1 // 返回上一页
		});
	}
	// 选择器选择事件
	// 部件类型选择事件
	const typePickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		const index = parseInt(e.detail.value)
		biObjectindex.value = index
		console.log('biObjectindex设置为:', index, '对应的值为:', biObjectName.value[index])
		
		// 更新缺损类型选项
		updateDiseaseTypeOptions()
		// 更新构件编号选项
		updateComponentNumbers()
	}
	// 部件编号选择事件
	const numberPickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		const index = parseInt(e.detail.value)
		componentCodeindex.value = index
		console.log('componentCodeindex设置为:', index, '对应的值为:', componentCode.value[index])
	}
	// 缺损类型选择事件
	const TypeofdefectPickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		const index = parseInt(e.detail.value)
		typeindex.value = index
		console.log('typeindex设置为:', index, '对应的值为:', type.value[index])
	}
	// 数据记载方式选择事件
	const WayofDefectPickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		const index = parseInt(e.detail.value)
		WayofDefectindex.value = index
		console.log('WayofDefectindex设置为:', index, '对应的值为:', WayofDefect.value[index])
	}

	// 评定标度单选框选择事件
	const ScalesRadioChange = (e) => {
		console.log('radio发送选择改变，携带值为', e.detail.value);
		// 根据value找到对应的索引
		const index = scalesItems.findIndex(item => item.value === e.detail.value);
		if (index !== -1) {
			scalesCurrent.value = index;
		}
	}

	// 参与评定单选框选择事件
	const RatingsRadioChange = (e) => {
		console.log('radio发送选择改变，携带值为', e.detail.value);
		// 根据value找到对应的索引
		const index = ratingItems.findIndex(item => item.value === e.detail.value);
		if (index !== -1) {
			ratingCurrent.value = index;
		}
	}

	// 定义格式化函数
	const formatDateTime = (date = new Date()) => {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		const h = String(date.getHours()).padStart(2, '0');
		const mm = String(date.getMinutes()).padStart(2, '0');
		const s = String(date.getSeconds()).padStart(2, '0');
		return `${y}-${m}-${d} ${h}:${mm}:${s}`;
	};


	// 编辑模式下的方法
	const deleteDisease = () => {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这条病害记录吗？',
			success: (res) => {
				if (res.confirm) {
					// 获取当前编辑的病害ID
					const currentId = getCurrentPages()[getCurrentPages().length - 1].$page?.options?.id;

					if (currentId) {
						// 创建带有isDelete标记的对象
						const deleteData = {
							id: currentId,
							isDelete: true
						};

						// 使用事件总线通知bridge-disease页面
						console.log('准备发送deleteDisease事件，标记删除ID:', currentId);
						uni.$emit('deleteDisease', deleteData);

						// 删除成功提示
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});

						// 返回上一页
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: '无法获取病害ID',
							icon: 'none'
						});
					}
				}
			}
		});
	}

	const copyAndAddDisease = () => {
		console.log('复制并新增');

		// 保存当前表单数据（除了图片）
		const formData = {
			partType: biObjectName.value[biObjectindex.value],
			partNumber: componentCode.value[componentCodeindex.value],
			disease: type.value[typeindex.value],
			position: position.value,
			quantity: quantity.value.toString(),
			length: length.value,
			width: width.value,
			slitWidth: slitWidth.value,
			heightOrDepth: heightOrDepth.value,
			area: area.value,
			description: description.value,
			level: scalesItems[scalesCurrent.value].value,
			participateAssess: ratingItems[ratingCurrent.value].value,
			parentObjectName: parentObjectName.value
		};

		// 清空图片列表
		fileList.value = [];

		// 将编辑模式切换为新增模式
		isEdit.value = false;

		// 简单提示
		uni.showToast({
			title: '已切换到新增模式',
			icon: 'none',
			duration: 500
		});
	}

	const editDisease = () => {
		console.log('编辑');

		// 获取选中的缺损类型对象（如果有）
		let diseaseTypeObj = null;
		if (typeindex.value !== -1 && diseaseTypeOptions.value && diseaseTypeOptions.value[typeindex.value]) {
			diseaseTypeObj = diseaseTypeOptions.value[typeindex.value];
		}
		
		// 获取选中的部件对象（如果有）
		let biObjectObj = null;
		if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex.value]) {
			biObjectObj = biObjectNameOptions.value[biObjectindex.value];
		}
		
		// 获取选中的构件对象（如果有）
		let componentObj = null;
		if (componentCodeindex.value !== -1 && biObjectObj && biObjectObj.comments) {
			componentObj = biObjectObj.comments[componentCodeindex.value];
		}
		
		// 创建符合要求的病害数据对象
		const diseaseData = {
			createBy: "crh@znjc",
			createTime: formatDateTime(),
			updateTime: formatDateTime(),
			id: getCurrentPages()[getCurrentPages().length - 1].$page?.options?.id || new Date().getTime(),
			diseaseType: diseaseTypeObj ? {
				id: diseaseTypeObj.id,
				code: diseaseTypeObj.code || '',
				name: diseaseTypeObj.name,
				maxScale: diseaseTypeObj.maxScale || 5,
				minScale: diseaseTypeObj.minScale || 1,
				status: "0"
			} : null,
			diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
			description: description.value,
			position: position.value,
			trend: "稳定",
			level: parseInt(scalesItems[scalesCurrent.value].value),
			quantity: parseInt(quantity.value),
			length: length.value,
			width: width.value,
			slitWidth: slitWidth.value,
			heightOrDepth: heightOrDepth.value,
			area: area.value,
			type: type.value[typeindex.value],
			participateAssess: ratingItems[ratingCurrent.value].value,
			deductPoints: 35,
			biObjectId: biObjectObj ? biObjectObj.id : null,
			projectId: 2,
			component: componentObj ? {
				createBy: "admin",
				createTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				updateTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				id: componentObj.id,
				code: componentObj.code,
				name: componentObj.name || `${biObjectObj.name}${componentCodeindex.value + 1}`,
				biObjectId: biObjectObj ? biObjectObj.id : null,
				status: "0",
				delFlag: "0",
				biObject: {
					id: biObjectObj ? biObjectObj.id : null,
					name: biObjectObj ? biObjectObj.name : '',
					count: 0
				},
				parentObjectName: parentObjectName.value
			} : null,
			componentId: componentObj ? componentObj.id : null,
			buildingId: 37,
			images: [] // 初始化为空数组，等待图片保存后更新
		};

		// 验证数据完整性
		if (!diseaseData.type || !diseaseData.component || !diseaseData.diseaseType) {
			console.log('数据不完整，请确保选择了部件类型、构件编号和缺损类型');
			uni.hideLoading();
			uni.showToast({
				title: '请填写必填项',
				icon: 'none'
			});
			return;
		}

		// 显示加载提示
		uni.showLoading({
			title: '保存中...'
		});

		// 使用公共方法保存图片和更新病害数据
		saveImagesAndUpdateDisease(diseaseData, true)
			.then(() => {
				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 500);
			})
			.catch(error => {
				uni.hideLoading();
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				});
			});
	};

	const handleFileSelect = (e) => {
		console.log('文件选择事件', e);
		// 确保fileList被正确更新
		if (e && e.tempFiles && e.tempFiles.length > 0) {
			console.log('选择的文件数量:', e.tempFiles.length);

			// 将tempFiles的信息直接更新到fileList
			const newFiles = e.tempFiles.map(file => {
				return {
					name: file.name,
					url: file.url || file.path || (file.file && file.file.path) ||
						(file.image && file.image.location) || file.tempFilePath,
					extname: file.extname || 'jpg',
					size: file.size || 0,
					// 保存原始文件信息，以备后用
					originalFile: file
				};
			});

			// 更新fileList，添加新选择的文件
			// 注意：这里我们假设每次选择都是添加新文件，而不是替换
			// 如果需要替换，请取消下面的注释，使用newFiles替换fileList
			// fileList.value = newFiles;

			newFiles.forEach(file => {
				// 检查是否已存在相同文件
				const existingIndex = fileList.value.findIndex(f =>
					f.name === file.name || f.url === file.url);
				if (existingIndex === -1) {
					fileList.value.push(file);
				} else {
					// 如果已存在，替换它
					fileList.value[existingIndex] = file;
				}
			});

			// 强制更新fileList引用，确保视图更新
			fileList.value = [...fileList.value];

			// 打印更新后的文件列表
			console.log('更新后的fileList:', fileList.value);

			// 检查路径
			const paths = getImagePaths(fileList.value);
			console.log('当前有效路径数:', paths.length);
		}
	}

	const handleFileDelete = (e) => {
		console.log('文件删除事件', e);

		// 如果uni-file-picker组件已经使用v-model绑定了fileList，它会自动处理删除
		// 下面的代码是为了保险起见，确保fileList正确更新

		if (e && e.tempFile && e.tempFile.name) {
			// 从fileList中移除被删除的文件
			const fileName = e.tempFile.name;
			fileList.value = fileList.value.filter(file => file.name !== fileName);
			console.log('删除后的文件列表:', fileList.value);
		} else if (e && e.index !== undefined && e.index >= 0) {
			// 如果提供了索引，根据索引删除
			fileList.value.splice(e.index, 1);
			console.log('删除后的文件列表:', fileList.value);
		}
	}

	// 处理并获取临时图片路径
	const getImagePaths = (fileListData) => {
		const paths = [];

		if (!fileListData || !Array.isArray(fileListData) || fileListData.length === 0) {
			console.log('文件列表为空');
			return paths;
		}

		console.log('处理文件列表:', fileListData);

		// 提取路径
		fileListData.forEach((file, index) => {
			// 尝试多种可能的属性获取路径
			let path = '';

			if (file.url) {
				path = file.url;
			} else if (file.path) {
				path = file.path;
			} else if (file.tempFilePath) {
				path = file.tempFilePath;
			} else if (file.file && file.file.path) {
				path = file.file.path;
			} else if (file.image && file.image.location) {
				path = file.image.location;
			}

			if (path) {
				console.log(`文件[${index}]有效路径:`, path);
				paths.push(path);
			} else {
				console.warn(`文件[${index}]没有有效路径:`, file);
			}
		});

		return paths;
	}
</script>

<style>
	.input-text-placeholder {
		color: #CCCCCC;
	}
</style>

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

	.button-next-add {
		height: 36rpx;
		font-size: 16px;
		margin: 0 10rpx;
		background-color: #0F4687;
		color: #ffffff;
		display: flex;
		opacity: 40%;
		/* 设置为 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
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
		width: 100%;
	}

	.part-titleandcontent {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.part-title {
		font-size: 17px;
	}

	.part-content {
		font-size: 20px;
		margin-top: 10rpx;
	}

	.part-icon {
		font-size: 20px;
		color: #CCCCCC;
	}

	/* 输入框 */
	.input-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 12rpx 16rpx;
		width: 100%;
	}

	.input-text {
		margin-top: 10rpx;
		font-size: 20px;

	}


	/* 部件类型和构件编号 */
	.part-typeandnumber {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	.picker-type {
		width: 50%;
		padding: 12rpx 16rpx;
	}

	.picker-number {
		width: 50%;
		padding: 12rpx 16rpx;
	}


	/* 缺损类型 */
	.part-Typeofdefect {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	.picker-Typeofdefect {
		width: 100%;
		padding: 12rpx 16rpx;
	}

	/* 缺损位置 */
	.part-Positionofdefect {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	/* 缺损数量和数据记载方式 */
	.part-NumAndWayofDefect {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	.part-NumofDefect {
		padding: 12rpx 16rpx;
		width: 50%;
	}

	.NumofDefect {
		margin-top: 8rpx;
		margin-left: 100rpx;
	}

	.part-WayofDefect {
		width: 50%;
		padding: 12rpx 16rpx;
	}

	/* 长度与宽度 */
	.part-LengthAndWidth {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	.part-Length {
		width: 50%;
	}

	.part-Width {
		width: 50%;
	}

	/* 缝宽、高度与面积 */
	.part-SeamWidth-height-area {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	.part-SeamWidth {
		width: 33.4%;
	}

	.part-height {
		width: 33.3%;
	}

	.part-area {
		width: 33.3%;
	}

	/* 病害描述 */
	.part-descriptionofDefect {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	/* 标度与评定 */
	.part-ScalesandRatings {
		height: 115rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #EEEEEE;
	}

	.part-Scales {
		width: 55%;
		padding: 12rpx 16rpx;

	}

	.radio-title {
		font-size: 17rpx;
	}

	.radio-group {
		display: flex;
	}

	.part-prompt {
		font-size: 15rpx;
		margin-top: 8rpx;
		color: #999999;
	}

	.radio-group-label {
		display: flex;
		margin-top: 8rpx;
		align-items: center;
		/* 垂直居中对齐 */
	}

	.radio-item-name {
		font-size: 18rpx;
		margin-left: 4rpx;
		margin-right: 20rpx;
	}

	.part-Ratings {
		width: 45%;
		padding: 12rpx 16rpx;

	}

	/* 上传图片 */
	.part-UploadImage {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #EEEEEE;
		padding: 12rpx 16rpx;
		height: 180rpx;
	}

	.upload-view {
		width: 100%;
		margin-top: 10rpx;
	}

	.file-picker {}

	/* 横屏适配 */
	@media screen and (orientation: landscape) {

		/* 顶部按钮栏 */
		.button-group-edit,
		.button-group-add {
			padding: 15rpx 20rpx;
		}

		.button-before,
		.button-next,
		.button-next-add,
		.button-savetonext,
		.button-save,
		.button-cancle,
		.button-delete,
		.button-edit {
			height: 60rpx;
			padding: 0 20rpx;
			font-size: 18px;
		}

		/* 调整表单项布局成两列 */
		view {
			box-sizing: border-box;
		}

		/* 表单布局容器 */
		.form-container {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
		}

		/* 分成两列布局 */
		.part-typeandnumber,
		.part-Typeofdefect,
		.part-Positionofdefect,
		.part-NumAndWayofDefect {
			padding: 8rpx 8rpx;
			width: 50%;
			height: auto;
			min-height: 100rpx;
			border-bottom: 1px solid #EEEEEE;
			border-right: 1px solid #EEEEEE;
		}

		.part-LengthAndWidth {
			padding: 8rpx 8rpx;
			width: 100%;
			height: auto;
			min-height: 100rpx;
			border-bottom: 1px solid #EEEEEE;
			border-right: 1px solid #EEEEEE;
		}

		.part-SeamWidth-height-area {
			padding: 8rpx 8rpx;
			width: 100%;
			height: auto;
			min-height: 100rpx;
		}

		.part-descriptionofDefect {
			padding: 8rpx 8rpx;
			width: 100%;
			height: auto;
			min-height: 100rpx;
		}

		/* 调整标度与评定区域 */
		.part-ScalesandRatings {
			padding: 8rpx 8rpx;
			width: 100%;
			height: auto;
			min-height: 150rpx;
		}

		/* 图片上传区域调整 */
		.part-UploadImage {
			width: 100%;
			height: auto;
			min-height: 220rpx;
		}

		/* 确保各类输入框在横屏时的宽度适当 */
		.picker-type,
		.picker-number {
			width: 50%;
		}

		.picker-Typeofdefect,
		.input-content,
		.part-NumofDefect,
		.part-WayofDefect {
			width: 100%;
		}

		/* 调整字体大小 */
		.part-title {
			font-size: 18px;
		}

		.part-content {
			font-size: 22px;
		}

		.input-text {
			font-size: 22px;
		}

		/* 调整单选按钮组 */
		.radio-group-label {
			margin-top: 12rpx;
		}

		.radio-title {
			font-size: 18px;
		}

		.part-prompt {
			font-size: 16px;
		}

		.radio-item-name {
			font-size: 20px;
			margin-right: 30rpx;
		}

		/* 确保按钮在横屏下也有足够的大小 */
		.button-group-edit button,
		.button-group-add button {
			padding: 0 30rpx;
			margin: 0 15rpx;
		}
	}
</style>
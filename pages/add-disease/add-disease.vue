<!--新增病害页面-->
<template>
	<view>
		<!-- 新增病害时显示 -->
		<view class="button-group-add" v-if="openMode === 'create'">
			<button class="button-savetonext" @click="savetonextdisease">保存并复制到下一条</button>
			<button class="button-save" @click="savedisease">保存</button>
			<button class="button-staging" @click="stagingDisease">暂存</button>
			<button class="button-cancle" @click="canceldisease">取消</button>
		</view>

		<!-- 编辑病害时显示 -->
		<view class="button-group-edit" v-else-if="openMode === 'edit'">
			<button class="button-before" @click="beforedisease">上一条</button>
			<button class="button-next" @click="nextdisease">下一条</button>
			<button class="button-delete" @click="deleteDisease">删除</button>
			<button class="button-copyAndTonext" @click="copyAndAddDisease">保存并复制到下一条</button>
			<button class="button-save" @click="editDisease">保存</button>
			<button class="button-staging" @click="stagingDisease">暂存</button>
			<button class="button-cancle" @click="canceldisease">取消</button>
		</view>

		<!-- 历史病害时显示 -->
		<view class="button-group-edit" v-else-if="openMode === 'history'">
			<button class="button-before" @click="beforeHistoryDisease">上一条</button>
			<button class="button-next" @click="nextHistoryDisease">下一条</button>
			<button class="button-copyHistoryDisease" @click="copyHistoryDisease">复制为新病害</button>
			<button class="button-cancle" @click="canceldisease">取消</button>
		</view>


		<!-- 表单内容容器 - 添加form-container类以便横屏时调整布局 -->
		<view class="form-container">

			<disease-information :structureData="structureData" :selectedGrandObject="selectedGrandObject" ref="diseaseInformationRef"> </disease-information>

			<disease-quantitative-data ref="diseaseQuantitativeDataRef">
			</disease-quantitative-data>

			<disease-description-part ref="diseaseDescriptionPart"></disease-description-part>

			<view>
				<view class="head">
					<view class="head-text">
						病害附件信息
					</view>
				</view>

				<view class="part-UploadImage">
          <view v-if="openMode === 'history'">
            <view class="part-title">图片</view>
            <image v-for="(url, index) in fileList" :key="index" :src="url" mode="aspectFill" @click="previewImage(url)" class="disease-image" />
          </view>
          <view v-else>
            <view class="part-title">上传图片</view>
            <view class="upload-view">
              <!-- <uni-file-picker class="file-picker" limit="9" :image-styles="imageStyles" v-model="fileList"
                file-mediatype="image" mode="grid" @select="handleFileSelect" @delete="handleFileDelete"
                :auto-upload="false"></uni-file-picker> -->
              <my-photo-picker class="photo-select" v-model="fileList" @select="handleFileSelect"
                               @delete="handleFileDelete" :limit="9"></my-photo-picker>
            </view>
          </view>
				</view>

				<view class="part-ADImages">
          <view v-if="openMode === 'history'">
            <view class="part-title">简图</view>
            <image v-for="(url, index) in ADImgs" :key="index" :src="url" mode="aspectFill" @click="previewImage(url)" class="disease-image" />
          </view>
          <view v-else>
            <view class="part-title">上传简图</view>
            <view class="ADImages">
              <view class="img-wrapper" v-for="(img, index) in ADImgs" :key="img.src">
                <image :src="img.src" class="ADImage"  @click="previewImage(img.src)" />
                <view class="close-btn" @click="removeImage(index)">×</view>
              </view>
              <view class="ADImage-container" @click="selectCanvasTemplate()">
                <image src="/static/image/AD.svg" class="ADImageButton"></image>
              </view>
            </view>
          </view>

				</view>
			</view>
		</view>


		<!-- 底部弹出层 -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup-content">
				<view class="template-row">
					<view class="template-type">
						空心板、实心板
					</view>
					<view class="template-image">
						<image src="/static/image/template_kxb1.png" class="template-image-card"
							@click="onClickTemplate('kxb1')"></image>
						<image src="/static/image/template_kxb2.png" class="template-image-card"
							@click="onClickTemplate('kxb2')"></image>
						<image src="/static/image/template_kxb3.png" class="template-image-card"
							@click="onClickTemplate('kxb3')"></image>
						<image src="/static/image/template_kxb4.png" class="template-image-card"
							@click="onClickTemplate('kxb4')"></image>
						<image src="/static/image/template_kxb5.png" class="template-image-card"
							@click="onClickTemplate('kxb5')"></image>
						<image src="/static/image/template_kxb6.png" class="template-image-card"
							@click="onClickTemplate('kxb6')"></image>
					</view>
					<view class="template-type">
						T梁
					</view>
					<view class="template-image">
						<image src="/static/image/template_tl1.png" class="template-image-card"
							@click="onClickTemplate('tl1')"></image>
					</view>

					<view class="template-type">
						箱梁
					</view>
					<view class="template-image">
						<image src="/static/image/template_xl1.png" class="template-image-card"
							@click="onClickTemplate('xl1')"></image>
					</view>

					<view class="template-type">
						变截面箱梁
					</view>
					<view class="template-image">
						<image src="/static/image/template_blmxl1.png" class="template-image-card"
							@click="onClickTemplate('blmxl1')"></image>
						<image src="/static/image/template_blmxl2.png" class="template-image-card"
							@click="onClickTemplate('blmxl2')"></image>
						<image src="/static/image/template_blmxl3.png" class="template-image-card"
							@click="onClickTemplate('blmxl3')"></image>
						<image src="/static/image/template_blmxl4.png" class="template-image-card"
							@click="onClickTemplate('blmxl4')"></image>
					</view>

					<view class="template-type">
						桥台、桥墩
					</view>
					<view class="template-image">
						<image src="/static/image/template_qt1.png" class="template-image-card"
							@click="onClickTemplate('qt1')"></image>
						<image src="/static/image/template_qt2.png" class="template-image-card"
							@click="onClickTemplate('qt2')"></image>
					</view>

					<view class="template-type">
						横隔板
					</view>
					<view class="template-image">
						<image src="/static/image/template_hgb1.png" class="template-image-card"
							@click="onClickTemplate('hgb1')"></image>
						<image src="/static/image/template_hgb2.png" class="template-image-card"
							@click="onClickTemplate('hgb2')"></image>
					</view>

					<view class="template-type">
						翼墙、耳墙
					</view>
					<view class="template-image">
						<image src="/static/image/template_yq1.png" class="template-image-card"
							@click="onClickTemplate('yq1')"></image>
					</view>
					<view class="template-type">
						盖梁
					</view>
					<view class="template-image">
						<image src="/static/image/template_gl1.png" class="template-image-card"
							@click="onClickTemplate('gl1')"></image>
					</view>
					<view class="template-type">
						圆桩墩
					</view>
					<view class="template-image">
						<image src="/static/image/template_yzd1.png" class="template-image-card"
							@click="onClickTemplate('yzd1')"></image>
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
		watch,
		computed,
		nextTick
	} from 'vue';
  import {
    getObject,
    readDiseaseImages, readDiseaseUDImages,
    removeDiseaseImage
  } from '../../utils/readJsonNew.js';
	import {
		saveDiseaseImages
	} from '../../utils/writeNew.js';
	import {
		userStore
	} from "@/store";
	import {
		idStore
	} from "@/store/idStorage";
	import {
		generateDiseaseDescription
	} from "@/utils/diseaseDescriptionCreate.js"
	import DiseaseInformation from "@/components/disease-information.vue";
	import DiseaseQuantitativeData from "@/components/disease-quantitativeData.vue";
	import DiseaseDescriptionPart from '@/components/disease-descriptionPart.vue';
	import myFilePicker from '@/components/myFilePicker/myFilePicker.vue';
	import MyPhotoPicker from '@/components/myPhotoPicker.vue';
	import { ButtonStore } from '@/store/button.js';
  import {useObject} from "@/store/object";

	const diseaseInformationRef = ref(null);
	const diseaseQuantitativeDataRef = ref(null);
	const diseaseDescriptionPart = ref(null);
	const buttonInfo = ButtonStore();

  const objectInfo = useObject();

	const userInfo = userStore()

	const idStorageInfo = idStore();

	const openMode = ref('create');

	const popup = ref(null);
	const ADImgs = ref([]);

  // 选择进入的构件（上部结构、下部结构、桥面系）
  const selectedGrandObject = ref('');

	// 保存结构数据
	const structureData = ref(null);
	// 保存构件名称的父亲，即picker的第二级
	const parentObjectName = ref(''); // 默认值
	// 保存构件名称的第一级，即picker的第一级 //上部结构、下部结构、桥面系、附属设施
	// const grandObjectName = ref('');
	// 部件类型列表picker中的第二级 - 动态生成
	const biObjectNameOptions = ref([]);
	// 缺损类型列表 - 动态生成
	const diseaseTypeOptions = ref([]);

	// 构件名称picker选择的值
	const componentNamePicker = ref('');
	// 部件类型索引
	const biObjectindex = ref(-1);

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

	// 添加一个数组来存储多个缺损的数据
	const diseaseDataList = ref([]);

	// 缺损数量
	const quantity = ref(1);

	// 长度
	const length = ref('');

	//宽度
	const width = ref('');

	//缝宽
	const crackWidth = ref('');

	//高度/深度
	const heightDepth = ref('');

	//面积
	const area = ref('');

	//病害描述
	const description = ref('');

	// 图片文件列表
	const fileList = ref([]);


	const diseasePosition = ref([]);


	const diseasePositionPopup = ref(null);
	const selectedPosition = ref('');

	// 为三级选择器添加的数据和方法
	const structureTypes = ref([]);
	const typeMultiArray = ref([
		structureTypes.value,
		[],
		[]
	]);
	const typeMultiIndex = ref([0, 0, 0]);



	//病害性质
	const natureindex = ref(0);

	const nature = ref([{
		text: '新病害',
		value: 0
	}, {
		text: '旧病害',
		value: 1
	}]);

	//参与评定
	const participateAssess = ref([{
		text: '是',
		value: 1
	}, {
		text: '否',
		value: 0
	}]);
	const participateAssessindex = ref(0);

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


	//裂缝特征
	const crackTypeIndex = ref(0);
	const crackType = ref([{
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
		}
	])

	const developmentTrend = ref([{
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
	])
	const developmentTrendindex = ref(0);

	//参考面1
	const reference1Location = ref('');

	//参考面2
	const reference2Location = ref('');

	// 参考面弹窗引用
	// const referenceSurfacePopup = ref(null);

	// 当前选择的是参考面1还是参考面2
	const currentReferenceSurface = ref(1);

	// 参考面输入框的值
	const referenceSurfaceInput = ref('');

	// 参考面选项列表
	const referenceSurfaceOptions = ref([]);

  const previewImage = (url) => {
    console.log('预览图片:', url)
		uni.previewImage({
			urls: [url],
		});
	}

	// 页面加载时初始化三级选择器
	onMounted(async () => {
		// 隐藏图片信息按钮，确保在新增病害页面不显示
		buttonInfo.reback();
		// 获取结构数据（先执行，并等待完成）

		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;
    selectedGrandObject.value = options.selectedGrandObject;
    console.log('设置grandObject', selectedGrandObject.value)

		// 初始化构件名称多级选择器
		// initMultiPickerColumns();
		// 如果有mode参数且值为edit，则设为编辑模式
		if (options && options.mode === 'edit') {
			openMode.value = 'edit';
			/*// 如果传递了数据，则解析并填充表单
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
			}*/
		} else if (options && options.mode === 'history') {
			openMode.value = 'history';
			/*// 如果传递了数据，则解析并填充表单
			if (options.data) {
				try {
					const diseaseData = JSON.parse(decodeURIComponent(options.data));
					console.log('接收到的历史病害数据:', diseaseData);

					// 填充表单数据
					fillFormWithData(diseaseData);
				} catch (error) {
					console.error('解析编辑数据失败:', error);
					uni.showToast({
						title: '加载编辑数据失败',
						icon: 'none'
					});
				}
			}*/
			// 非编辑模式，初始化三级选择器
			// initMultiPickerColumns();
		} else {
			openMode.value = 'create';
		}
    await fetchStructureData();
    // 如果传递了数据，则解析并填充表单
    if (options.data) {
      try {
        const diseaseData = JSON.parse(decodeURIComponent(options.data));
        console.log('接收到的历史病害数据:', diseaseData);

        // 填充表单数据
        await fillFormWithData(diseaseData);
      } catch (error) {
        console.error('解析编辑数据失败:', error);
        uni.showToast({
          title: '加载编辑数据失败',
          icon: 'none'
        });
      }
    }
		// 初始化缺损数据列表
		// updateDiseaseDataList(quantity.value);
	});

	// 根据接收的数据填充表单
	const fillFormWithData = async (data) => {
    console.log('开始填充表单数据:', data);

    //设置构建名称
    if (data.component?.biObject?.name) {
      // uni.$emit('setComponentName', data.component.biObject.name)
      uni.$emit('setComponentName', {
        biObjectName: data.component.biObject.name,
        parentObjectName: data.component.parentObjectName,
        grandObjectName: data.component.grandObjectName,
        biObjectInput: data.biObjectName,
      })
    }

    // 设置构件编号
    if (data.component?.code) {
      componentCodeInput.value = data.component.code;
      uni.$emit('setComponentCode', componentCodeInput.value)
      console.log('成功设置构件编号:', data.component.code);
    }

    // 设置病害类型
    if (data.type) {
      // 更新病害类型和位置选项
      type.value = data.type;
      // updateDiseaseTypeOptions();

      // 检查是否在预设选项中
      /*if (diseaseTypeOptions.value.includes(data.type)) {
        typePicker.value = data.type;
        typeInput.value = '';
      } else {
        typePicker.value = '其他';
        typeInput.value = data.type;
      }*/
      uni.$emit('setDiseaseType', {
        diseaseTypeInput: data.type,
        diseaseType: data.diseaseType.name,
        diseaseTypeCode: data.diseaseType.code,
        diseaseTypeId: data.diseaseType.id,
        diseaseTypeGroupName: data.diseaseType.groupName,
      })
      console.log('成功设置病害类型:', data.type);
    }

    if(data.diseaseType.threshold){
      uni.$emit('setThreshold', data.diseaseType.threshold)
    }

    // 设置病害位置
    if (data.position) {
      // updateDiseasePositionOptions();
      position.value = data.position;

      uni.$emit('setDiseasePosition', data.position)

      console.log('成功设置病害位置:', data.position);
    }
    if(data.positionNumber){
      uni.$emit('setPositionNumber', data.positionNumber)
    }

    // 设置缺损数量
    if (data.quantity) {
      quantity.value = parseInt(data.quantity) || 1;
      uni.$emit('setQuantity', data.quantity)
    }
    if(data.units){
      uni.$emit('setUnits', data.units)
    }

    // 设置参与评定值（uni-data-checkbox格式）
    if (data.participateAssess !== undefined) {
      participateAssessindex.value = data.participateAssess === "0" ? 0 : 1;
      uni.$emit('setParticipateAssess', data.participateAssess)
    }

    if (data.nature) {
      // 根据nature的值更新natureindex
      const natureItem = nature.value.find(item => item.text === data.nature);
      if (natureItem) {
        natureindex.value = natureItem.value;
      }
      uni.$emit('setNature', data.nature)
    }

    // 设置评定标度（uni-data-checkbox格式）
    if (data.level) {
      const levelVal = parseInt(data.level);

      // 检查是否有病害类型对象，并根据其maxScale和minScale设置评定标度选项
      if (data.diseaseType && data.diseaseType.maxScale && data.diseaseType.minScale) {
        const minScale = parseInt(data.diseaseType.minScale) || 1;
        const maxScale = parseInt(data.diseaseType.maxScale) || 4;

        // 创建新的评定标度选项
        const newLevelOptions = [];
        for (let i = minScale; i <= maxScale; i++) {
          newLevelOptions.push({
            text: String(i),
            value: i
          });
        }

        // 更新评定标度选项
        level.value = newLevelOptions;

        // 确保选中的值在范围内
        levelindex.value = Math.max(minScale, Math.min(maxScale, levelVal));
        console.log('根据病害类型设置评定标度范围:', minScale, '至', maxScale, '选中值:', levelindex.value);
      } else {
        // 如果没有病害类型信息，直接设置值
        levelindex.value = levelVal; // 索引从1开始，值从1开始
      }
      uni.$emit('setLevel', data.level)
    }

    // 设置病害描述
    if (data.description) {
      description.value = data.description;
      uni.$emit('setDescriptionByEmit', data.description)
    }

    if (data.crackType) {
      uni.$emit('setCrackType', data.crackType)
    }

    if (data.developmentTrend) {
      uni.$emit('setDevelopmentTrend', data.developmentTrend)
    }

    // 处理diseaseDetails数据
    if (data.diseaseDetails && Array.isArray(data.diseaseDetails) ) {

      // 判断是否为范围模式 - 直接使用quantity字段判断
      const quantity = parseInt(data.quantity) || 0;
      const isRangeMode = quantity >= data.diseaseType.threshold;
      console.log('根据quantity判断范围模式:', quantity, isRangeMode);

      // 根据模式创建对应的数据结构
      if (isRangeMode) {
        // 范围模式 - 缺损数量大于等于10时
        const detail = data.diseaseDetails[0];

        // 创建一个包含所有范围值的对象
        const rangeData = {
          useRangeMode: true,
          // 最小值
          lengthRangeStart: detail.lengthRangeStart || '',
          lengthRangeEnd: detail.lengthRangeEnd || '',
          /*					widthRangeStart: detail.widthRangeStart || '',
                    widthRangeEnd: detail.widthRangeEnd || '',*/
          heightDepthRangeStart: detail.heightDepthRangeStart || '',
          heightDepthRangeEnd: detail.heightDepthRangeEnd || '',
          crackWidthRangeStart: detail.crackWidthRangeStart || '',
          crackWidthRangeEnd: detail.crackWidthRangeEnd || '',
          areaLength: detail.areaLength || '',
          areaWidth: detail.areaWidth || '',
          areaIdentifier: detail.areaIdentifier || '',
          deformationRangeStart: detail.deformationRangeStart || '',
          deformationRangeEnd: detail.deformationRangeEnd || '',
          angleRangeStart: detail.angleRangeStart || '',
          angleRangeEnd: detail.angleRangeEnd || '',
          numeratorRatio: detail.numeratorRatio || '',
          denominatorRatio: detail.denominatorRatio || '',

          // 参考面信息
          reference1Location: detail.reference1Location || '',
          reference1LocationStart: detail.reference1LocationStart || '',
          reference1LocationEnd: detail.reference1LocationEnd || '',
          reference2Location: detail.reference2Location || '',
          reference2LocationStart: detail.reference2LocationStart || '',
          reference2LocationEnd: detail.reference2LocationEnd || '',

          // 裂缝特征和趋势 - 查找索引值
          /*					crackTypeIndex: findIndexByText(crackType.value, detail
                      .crackType) || 0,
                    developmentTrendIndex: findIndexByText(developmentTrend.value, detail.developmentTrend) || 0*/
        };

        // 更新数据列表
        diseaseDataList.value = [rangeData];
      } else {
        console.log('普通模式:', data.diseaseDetails)
        // 普通模式 - 为每个缺损创建一条记录
        const newList = data.diseaseDetails.map(detail => {
          return {
            useRangeMode: false,
            length1: detail.length1 || '',
            length2: detail.length2 || '',
            length3: detail.length3 || '',
            // width: detail.width || '',
            heightDepth: detail.heightDepth || '',
            crackWidth: detail.crackWidth || '',
            areaLength: detail.areaLength || '',
            areaWidth: detail.areaWidth || '',
            areaIdentifier: detail.areaIdentifier || '',
            deformation: detail.deformation || '',
            angle: detail.angle || '',
            // percentage: detail.percentage || '',
            numeratorRatio: detail.numeratorRatio || '',
            denominatorRatio: detail.denominatorRatio || '',


            // 参考面信息
            reference1Location: detail.reference1Location || '',
            reference1LocationStart: detail.reference1LocationStart || '',
            reference1LocationEnd: detail.reference1LocationEnd || '',
            reference2Location: detail.reference2Location || '',
            reference2LocationStart: detail.reference2LocationStart || '',
            reference2LocationEnd: detail.reference2LocationEnd || '',

            // 裂缝特征和趋势 - 查找索引值
            /*						crackTypeIndex: findIndexByText(crackType.value, detail
                          .crackType) || 0,
                        developmentTrendIndex: findIndexByText(developmentTrend.value, detail
                          .developmentTrend) || 0*/
          };
        });

        // 更新数据列表
        diseaseDataList.value = newList;
      }
      uni.$emit('setDiseaseDataList', diseaseDataList.value)
      console.log('成功设置diseaseDetails数据', diseaseDataList.value);
    }

    // 处理图片数据
    if (data.images && Array.isArray(data.images)) {
      console.log('开始处理图片数据......:', data.images);
      let imagesPaths = [];
      if (openMode.value == 'history') {
        imagesPaths = await readDiseaseUDImages(userInfo.username, idStorageInfo.buildingId, data.images);
      } else {
        imagesPaths = await readDiseaseImages(userInfo.username, idStorageInfo.buildingId, data.images);
      }
      // const imagesPaths = readDiseaseImages(userInfo.username, idStorageInfo.buildingId, data.images);
      console.log('处理后的图片路径:', imagesPaths);
      fileList.value = imagesPaths;
    }

    // AD图片
    if (data.ADImgs && Array.isArray(data.ADImgs)) {
      let ADImgsPaths = [];
      if (openMode.value == 'history') {
        ADImgsPaths = await readDiseaseUDImages(userInfo.username, idStorageInfo.buildingId, data.ADImgs);
      } else {
        ADImgsPaths = await readDiseaseImages(userInfo.username, idStorageInfo.buildingId, data.ADImgs);
      }
      // const ADImgsPaths = readDiseaseImages(userInfo.username, idStorageInfo.buildingId, data.ADImgs);
      ADImgs.value = ADImgsPaths.map((src, index) => ({
        src: src
      }));
    }

    console.log('表单数据填充完成');
  };

	// 根据文本查找索引的工具函数
	const findIndexByText = (optionsArray, targetText) => {
		if (!optionsArray || !Array.isArray(optionsArray) || !targetText) return 0;

		const index = optionsArray.findIndex(item =>
			(item.text && item.text === targetText) || item === targetText
		);

		return index !== -1 ? index : 0;
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
		const grandObjectName = diseaseInformationRef.value.component.grandObjectName

		if (!currentId || !grandObjectName) {
			uni.showToast({
				title: '无法获取当前病害信息',
				icon: 'none'
			});
			return;
		}

		// 使用uni.$emit发送获取同类型病害列表的请求
		uni.$emit('getDiseasesOfType', {
			grandObjectName: grandObjectName,
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
				const validDiseases = diseaseList.filter(item => item.commitType != 2);

				// 找到当前病害的索引
				const currentIndex = validDiseases.findIndex(item => String(item.id) === String(
					currentId));
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
		const grandObjectName = diseaseInformationRef.value.component.grandObjectName

		if (!currentId || !grandObjectName) {
			uni.showToast({
				title: '无法获取当前病害信息',
				icon: 'none'
			});
			return;
		}

		// 使用uni.$emit发送获取同类型病害列表的请求
		uni.$emit('getDiseasesOfType', {
			grandObjectName: grandObjectName,
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
				const validDiseases = diseaseList.filter(item => item.commitType != 2);

				// 找到当前病害的索引
				const currentIndex = validDiseases.findIndex(item => String(item.id) === String(
					currentId));
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
		diseaseData.id = new Date().getTime();
		diseaseData.localId = new Date().getTime();
	}

	// 创建病害数据对象的方法
	const createDiseaseData = () => {
		/*// 获取选中的缺损类型对象（如果有）
		let diseaseTypeObj = null;
		if (typePicker.value && allDiseaseTypes.length > 0) {
			// 在allDiseaseTypes中查找匹配的对象
			diseaseTypeObj = allDiseaseTypes.find(item => item.name === typePicker.value);
			console.log('找到的病害类型对象:', diseaseTypeObj ? diseaseTypeObj.name : '未找到');
		}

		// 获取选中的部件对象（如果有）
		let biObjectObj = null;
		if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex
				.value]) {
			biObjectObj = biObjectNameOptions.value[biObjectindex.value];
		}
		console.log('选中的第二级构件对象:', biObjectObj);*/

		// 处理diseaseDataList，构建病害详细数据
		let diseaseDetails = [];
		const numValue = diseaseQuantitativeDataRef.value.quantity;
		const isRangeMode = numValue >= 10;
		console.log('保存时使用的模式:', isRangeMode ? '范围模式' : '普通模式', '缺损数量:', numValue);

		if (isRangeMode) {
			// 当缺损数量大于等于10时，使用范围模式，只存储一条记录
			const rangeData = diseaseQuantitativeDataRef.value.diseaseDataList[0];

			// 创建一个包含范围值的记录
			diseaseDetails.push({
				// 普通模式字段设为空
				length1: '',
				length2: '',
				length3: '',
				// width: '',
				heightDepth: '',
				crackWidth: '',
				// area: '',
				deformation: '',
				angle: '',
				// percentage: '',

				// 范围模式字段
				lengthRangeStart: rangeData.lengthRangeStart || '',
				lengthRangeEnd: rangeData.lengthRangeEnd || '',
				/*				widthRangeStart: rangeData.widthRangeStart || '',
								widthRangeEnd: rangeData.widthRangeEnd || '',*/
				heightDepthRangeStart: rangeData.heightDepthRangeStart || '',
				heightDepthRangeEnd: rangeData.heightDepthRangeEnd || '',
				crackWidthRangeStart: rangeData.crackWidthRangeStart || '',
				crackWidthRangeEnd: rangeData.crackWidthRangeEnd || '',
				areaLength: rangeData.areaLength || '',
				areaWidth: rangeData.areaWidth || '',
        areaIdentifier: rangeData.areaIdentifier || '',
				deformationRangeStart: rangeData.deformationRangeStart || '',
				deformationRangeEnd: rangeData.deformationRangeEnd || '',
				angleRangeStart: rangeData.angleRangeStart || '',
				angleRangeEnd: rangeData.angleRangeEnd || '',
				numeratorRatio: rangeData.numeratorRatio || '',
				denominatorRatio: rangeData.denominatorRatio || '',

				// 公共字段
				/*crackType: crackType.value[rangeData.crackTypeIndex]?.text ||
					'纵向',*/
				// developmentTrend: developmentTrend.value[rangeData.developmentTrendIndex]?.text || '稳定',
				reference1Location: rangeData.reference1Location || '',
				reference1LocationStart: rangeData.reference1LocationStart || '',
				reference1LocationEnd: rangeData.reference1LocationEnd || '',
				reference2Location: rangeData.reference2Location || '',
				reference2LocationStart: rangeData.reference2LocationStart || '',
				reference2LocationEnd: rangeData.reference2LocationEnd || ''
			});

			console.log('保存时生成的范围模式数据结构:', JSON.stringify(diseaseDetails[0]));
		} else {
			// 当缺损数量小于10时，使用普通模式，为每个缺损创建一条记录
			diseaseQuantitativeDataRef.value.diseaseDataList.forEach(item => {
				diseaseDetails.push({
					// 普通模式字段
					length1: item.length1 || '',
					length2: item.length2 || '',
					length3: item.length3 || '',
					// width: item.width || '',
					heightDepth: item.heightDepth || '',
					crackWidth: item.crackWidth || '',
					// area: item.area || '',
					deformation: item.deformation || '',
					angle: item.angle || '',
					areaLength: item.areaLength,
					areaWidth: item.areaWidth,
          areaIdentifier: item.areaIdentifier,
					numeratorRatio: item.numeratorRatio,
					denominatorRatio: item.denominatorRatio,
					// percentage: item.percentage || '',

					// 范围模式字段设为空
					lengthRangeStart: '',
					lengthRangeEnd: '',
					// widthRangeStart: '',
					// widthRangeEnd: '',
					heightDepthRangeStart: '',
					heightDepthRangeEnd: '',
					crackWidthRangeStart: '',
					crackWidthRangeEnd: '',
					deformationRangeStart: '',
					deformationRangeEnd: '',
					angleRangeStart: '',
					angleRangeEnd: '',

					// 公共字段
					/*crackType: crackType.value[item.crackTypeIndex]
						?.text || '纵向',*/
					// developmentTrend: developmentTrend.value[item.developmentTrendIndex]?.text || '稳定',
					reference1Location: item.reference1Location || '',
					reference1LocationStart: item.reference1LocationStart || '',
					reference1LocationEnd: item.reference1LocationEnd || '',
					reference2Location: item.reference2Location || '',
					reference2LocationStart: item.reference2LocationStart || '',
					reference2LocationEnd: item.reference2LocationEnd || ''
				});
			});
		}

		/*// 获取构件名称
		const componentName = getComponentName();

		// 获取第三级组件ID和Name（空心板、实心板那一级）
		const thirdLevelComponentId = getThirdLevelComponentId();
		const thirdLevelComponentName = getThirdLevelComponentName();*/

		const diseaseTypeObj = diseaseInformationRef.value.diseaseTypeObj;

		// 创建符合要求的病害数据对象
		return {
			createBy: "",
			createTime: openMode.value === 'create' ? formatDateTime() : JSON.parse(decodeURIComponent(
				getCurrentPages()[getCurrentPages().length - 1].$page?.options.data))?.createTime,
			updateTime: formatDateTime(),
			id: openMode.value === 'create' ? new Date().getTime() : JSON.parse(decodeURIComponent(getCurrentPages()[
				getCurrentPages().length - 1].$page?.options.data))?.id,
			diseaseType: diseaseTypeObj ? {
				id: diseaseTypeObj.id,
				code: diseaseTypeObj.code || '',
				name: diseaseTypeObj.name,
				maxScale: diseaseTypeObj.maxScale || 5,
				minScale: diseaseTypeObj.minScale || 1,
        groupName: diseaseTypeObj.groupName || '',
				status: "0"
			} : null,
			diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
			description: diseaseDescriptionPart.value.description,
			position: diseaseInformationRef.value.position,
      positionNumber: diseaseInformationRef.value.positionNumber,
			level: diseaseDescriptionPart.value.level,
			quantity: diseaseQuantitativeDataRef.value.quantity,
      units:diseaseQuantitativeDataRef.value.units,
			// 直接存储详细数据
			diseaseDetails: diseaseDetails,
			type: diseaseInformationRef.value.type, // 直接使用type.value而不是通过索引获取
			nature: diseaseDescriptionPart.value.nature,
			participateAssess: diseaseDescriptionPart.value.participateAssess,
			biObjectId: diseaseInformationRef.value.component.biObject.id,
			projectId: idStorageInfo.projectId,
			crackType: diseaseQuantitativeDataRef.value.crackType,
			developmentTrend: diseaseDescriptionPart.value.developmentTrend,
			biObjectName: diseaseInformationRef.value.getBiObjctName, //使用三级选择或输入框中的值
			component: diseaseInformationRef.value.component,
			componentId: null, // 组件ID也设为null
			buildingId: idStorageInfo.buildingId,
			images: [], // 初始化为空数组，等待图片保存后更新
			ADImgs: [], // 添加AD图片字段
			commitType: 1, //0为已提交 1为未提交 2为删除
			localId: openMode.value === 'create' ? new Date().getTime() : JSON.parse(decodeURIComponent(
				getCurrentPages()[getCurrentPages().length - 1].$page?.options.data))?.localId,
			historyDiseaseId: openMode.value === 'create' ? null : JSON.parse(decodeURIComponent(
				getCurrentPages()[getCurrentPages().length - 1].$page?.options.data))?.historyDiseaseId,
		};
	}

	// 保存但不返回上一页的方法
	const saveWithoutNavigateBack = (diseaseData) => {
		console.log('保存但不返回');

		// 显示加载提示
		uni.showLoading({
			title: '保存中...'
		});

		// 使用公共方法保存图片和更新病害数据
		saveImagesAndUpdateDisease(diseaseData)
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
					ADImgs.value = [];
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
	const saveImagesAndUpdateDisease = async (diseaseData) => {
		// 获取当前页面选项
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;

		// 如果是编辑模式，获取原始数据中的图片和AD图片
		let originalImages = [];
		let originalADImages = [];
		if (openMode.value === 'edit') {
			if (options && options.data) {
				try {
					const originalData = JSON.parse(decodeURIComponent(options.data));
					// 将相对路径转为绝对路径
					originalImages = await readDiseaseImages(userInfo.username, idStorageInfo.buildingId, originalData
						.images) || [];
					originalADImages = await readDiseaseImages(userInfo.username, idStorageInfo.buildingId, originalData
						.ADImgs) || [];
				} catch (error) {
					console.error('解析原始数据失败:', error);
				}
			}
		}
		// 获取当前文件列表中的图片URL
		// myPhotoPicker组件的fileList直接存储图片路径字符串
		const currentImageUrls = fileList.value;
		const currentADImages = ADImgs.value.map(img => img.src);

		try {
			// 1. 先保存当前所有病害图片
			let imageRelativePaths = [];
			if (currentImageUrls.length > 0) {
				imageRelativePaths = await saveDiseaseImages(userInfo.username, idStorageInfo.buildingId,
					currentImageUrls);
				diseaseData.images = imageRelativePaths;
				console.log('保存当前所有病害图片，相对路径:', imageRelativePaths);
			} else {
				diseaseData.images = [];
			}

			// 2. 保存当前所有AD图片
			let adImageRelativePaths = [];
			if (currentADImages.length > 0) {
				adImageRelativePaths = await saveDiseaseImages(userInfo.username, idStorageInfo.buildingId,
					currentADImages);
				diseaseData.ADImgs = adImageRelativePaths;
				console.log('保存当前所有AD图片，相对路径:', adImageRelativePaths);
			} else {
				diseaseData.ADImgs = [];
			}

			// 3. 删除所有原有病害图片
			if (originalImages.length > 0) {
				await removeDiseaseImage(originalImages)
					.then(result => {
						console.log('删除原有病害图片成功:', result);
					})
					.catch(error => {
						console.error('删除原有病害图片失败:', error);
					});
			}

			// 4. 删除所有原有AD图片
			if (originalADImages.length > 0) {
				await removeDiseaseImage(originalADImages)
					.then(result => {
						console.log('删除原有AD图片成功:', result);
					})
					.catch(error => {
						console.error('删除原有AD图片失败:', error);
					});
			}

			console.log('已保存病害图片，更新病害数据...:', diseaseData);
			// 根据模式发送不同的事件
			if (openMode.value === 'create') {
				uni.$emit('addNewDisease', diseaseData);
			} else {
				uni.$emit('updateDisease', diseaseData);
			}
		} catch (error) {
			console.error('保存图片过程中发生错误:', error);
			plus.nativeUI.toast('保存图片失败');
			throw error; // 重新抛出错误，让调用者知道发生了错误
		}
	};

	const savedisease = () => {

		// 调用方法创建病害数据对象
		const diseaseData = createDiseaseData();

		console.log('将要保存的病害diseaseData', diseaseData);

		// 验证数据完整性
		if (!diseaseData.type || !diseaseData.component || !diseaseData.position || !diseaseData.description) {
			console.log('数据不完整，请确保选择了构件名称、构件编号、病害类型和病害位置');
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
		saveImagesAndUpdateDisease(diseaseData)
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

	const stagingDisease = () => {
		// 调用方法创建病害数据对象
		const diseaseData = createDiseaseData();

		console.log('将要暂存的病害diseaseData', diseaseData);

		// 验证数据完整性
		if (!diseaseData.type || !diseaseData.component || !diseaseData.position || !diseaseData.description) {
			console.log('数据不完整，请确保选择了构件名称、构件编号、病害类型和病害位置');
			uni.hideLoading();
			uni.showToast({
				title: '请填写必填项',
				icon: 'none'
			});
			return;
		}
		diseaseData.commitType = 3;

		// 显示加载提示
		uni.showLoading({
			title: '暂存中...'
		});

		// 使用公共方法保存图片和更新病害数据
		saveImagesAndUpdateDisease(diseaseData)
			.then(() => {
				uni.hideLoading();
				uni.showToast({
					title: '暂存成功',
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
					title: '暂存失败',
					icon: 'none'
				});
			});
	}

	const canceldisease = () => {
		uni.navigateBack({
			delta: 1 // 返回上一页
		});
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

	const copyAndAddDisease = async () => {
    const diseaseData = createDiseaseData();

    await saveImagesAndUpdateDisease(diseaseData)
    // 清空图片列表
    fileList.value = [];

    // 清空AD图片列表
    ADImgs.value = [];
    diseaseData.id = new Date().getTime();
    diseaseData.commitType = 1;
    diseaseData.localId = new Date().getTime();
    diseaseData.createTime = formatDateTime();
    diseaseData.updateTime = formatDateTime();
    diseaseData.historyDiseaseId = null;

    console.log('保存并复制到下一条');

    /*		// 清空图片列表
        fileList.value = [];

        // 清空AD图片列表
        ADImgs.value = [];*/

    // 将编辑模式切换为新增模式
    openMode.value = 'create';
    // saveImagesAndUpdateDisease(diseaseData)

    // 简单提示
    uni.showToast({
      title: '保存并复制成功',
      icon: 'success',
      duration: 500
    });
  }

	const editDisease = () => {
		console.log('编辑');

		// 调用方法创建病害数据对象
		const diseaseData = createDiseaseData();
		diseaseData.commitType = 1;

		// 验证数据完整性
		if (!diseaseData.type || !diseaseData.component || !diseaseData.position || !diseaseData.description) {
			console.log('数据不完整，请确保选择了构件名称、构件编号、病害类型和病害位置');
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
		saveImagesAndUpdateDisease(diseaseData)
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

	const copyHistoryDisease = () => {
		const diseaseData = createDiseaseData();
		uni.$emit('copyHistoryDisease', diseaseData);
		uni.navigateBack();
	}

	const beforeHistoryDisease = () => {
		// 获取当前病害的ID
		const currentDiseaseId = JSON.parse(decodeURIComponent(
			getCurrentPages()[getCurrentPages().length - 1].$page?.options.data))?.id;

		// 发送事件到history-disease组件，请求上一条病害
		uni.$emit('navigateHistoryDisease', {
			action: 'previous',
			currentId: currentDiseaseId
		});
	}

	const nextHistoryDisease = () => {
		// 获取当前病害的ID
		const currentDiseaseId = JSON.parse(decodeURIComponent(
			getCurrentPages()[getCurrentPages().length - 1].$page?.options.data))?.id;

		// 发送事件到history-disease组件，请求下一条病害
		uni.$emit('navigateHistoryDisease', {
			action: 'next',
			currentId: currentDiseaseId
		});
	}

	const handleFileSelect = () => {
		console.log('图片选择完成');
		// myPhotoPicker组件通过v-model直接更新了fileList数组
		// 这里不需要像之前那样从事件中提取数据
		console.log('当前图片列表:', fileList.value);
	}

	const handleFileDelete = (e) => {
		console.log('图片删除事件', e);
		// myPhotoPicker组件通过v-model直接更新了fileList数组
		// 这里可以进行一些额外的处理，如果需要的话
		console.log('删除后的图片列表:', fileList.value);
	}

	const onClickTemplate = (templateIndex) => {
		uni.navigateTo({
			url: `/pages/canvas/canvas?template=${templateIndex}`,
			success: (res) => {
				// 监听从 B 页面返回的数据
				res.eventChannel.once('returnData', (data) => {
					ADImgs.value.push({
						src: data.src
					});
				})
				popup.value.close();
			},
		})
	}
	const selectCanvasTemplate = () => {
		popup.value.open()
	}
	const removeImage = (index) => {
		ADImgs.value.splice(index, 1)
	}

	// 获取结构数据
	const fetchStructureData = async () => {
		try {

			// 在实际应用中，这些可能来自于路由参数或全局状态
			// const data = await getObject(userInfo.username, idStorageInfo.buildingId);
      const data = objectInfo.getData();
			console.log('结构数据获取成功:', data);
			structureData.value = data;

			// 返回成功
			return Promise.resolve(data);
		} catch (error) {
			console.error('获取结构数据失败:', error);
			uni.showToast({
				title: '获取结构数据失败',
				icon: 'none'
			});

			// 返回失败
			return Promise.reject(error);
		}
	};

	// 构件名称input输入框
	const componentNameInput = ref('');

	// 构件编号 - 改为输入框
	const componentCodeInput = ref('');

	watch(openMode, (newOpenMode) => {
		if (newOpenMode === 'edit') {
			uni.setNavigationBarTitle({
				title: '编辑病害', // 要设置的标题文字
			});
		}
		if (newOpenMode === 'create') {
			uni.setNavigationBarTitle({
				title: '新增病害', // 要设置的标题文字
			});
		}
		if (newOpenMode === 'history') {
			uni.setNavigationBarTitle({
				title: '历史病害', // 要设置的标题文字
			});
		}
	})
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
		font-size: 16rpx;
		background-color: #FF3141;
		color: #ffffff;
		margin-right: 10rpx;
		display: flex;
    padding: 0 10rpx;
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
		font-size: 16rpx;
		margin: 0 10rpx;
		background-color: #0F4687;
		color: #ffffff;
		display: flex;
    padding: 0 10rpx;
	}

	.button-copyAndTonext {
		font-size: 16rpx;
		background-color: #0F4687;
		color: #ffffff;
		margin-left: 0;
		margin-right: 10rpx;
		display: flex;
    padding: 0 10rpx;
	}

	.button-savetonext {
		font-size: 16rpx;
		background-color: #0F4687;
		color: #ffffff;
		margin-right: 10rpx;
		display: flex;
    padding: 0 10rpx;
	}

	.button-save {
		font-size: 16rpx;
		background-color: #0F4687;
		color: #ffffff;
		margin-left: 0;
		margin-right: 0;
		display: flex;
    padding: 0 10rpx;
	}

	.button-cancle {
		font-size: 16rpx;
		border: 1px solid #1677FF;
		margin: 0 10rpx;
		display: flex;
    padding: 0 10rpx;
	}

	.button-copyHistoryDisease {
		font-size: 16rpx;
		background-color: #0F4687;
		color: #ffffff;
		margin-right: 0;
		display: flex;
    padding: 0 10rpx;
	}

	.button-staging {
		font-size: 16rpx;
		background-color: #0F4687;
		color: #ffffff;
		margin-right: 0;
		margin-left: 10rpx;
		display: flex;
    padding: 0 10rpx;
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
		min-height: 200rpx;
		height: auto;
	}

	.part-title {
		font-size: 20rpx;
	}

	.upload-view {
		width: 100%;
		margin-top: 10rpx;
	}

	.photo-select {
		margin-top: 10rpx;
		height: auto;
		min-height: 100rpx;
		background-color: transparent;
	}
	
	/* 覆盖myPhotoPicker组件中的图片容器尺寸 */
	.photo-select::v-deep .preview-container {
		width: 160rpx;
		height: 160rpx;
		min-width: 160rpx;
		min-height: 160rpx;
		max-width: 160rpx;
		max-height: 160rpx;
	}

	.file-picker {
		width: 100%;
	}

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

	/* 调整图片列表的间距 */
	.photo-select::v-deep .preview-list {
		gap: 15rpx;
	}
  .disease-image{
    height: 140rpx;
    width: 140rpx;
    margin-top: 10rpx;
    margin-left: 10rpx;
    object-fit: cover;
  }
</style>
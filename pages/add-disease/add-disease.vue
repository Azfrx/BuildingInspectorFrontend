<!--新增病害页面-->
<template>
	<view>
		<!-- 新增病害时显示 -->
		<view class="button-group-add" v-if="openMode === 'create'">
			<button class="button-savetonext" @click="savetonextdisease">保存并复制到下一条</button>
			<button class="button-save" @click="savedisease">保存</button>
			<button class="button-cancle" @click="canceldisease">取消</button>
		</view>

		<!-- 编辑病害时显示 -->
		<view class="button-group-edit" v-else-if="openMode === 'edit'">
			<button class="button-before" @click="beforedisease">上一条</button>
			<button class="button-next" @click="nextdisease">下一条</button>
			<button class="button-delete" @click="deleteDisease">删除</button>
			<button class="button-save" @click="copyAndAddDisease">复制并新增</button>
			<button class="button-edit" @click="editDisease">编辑</button>
		</view>

		<!-- 历史病害时不显示 -->


		<!-- 表单内容容器 - 添加form-container类以便横屏时调整布局 -->
		<view class="form-container">

			<disease-information :structureData="structureData" ref="diseaseInformationRef"> </disease-information>

			<disease-quantitative-data ref="diseaseQuantitativeDataRef">
			</disease-quantitative-data>

			<disease-description-part ref="diseaseDescriptionPart"></disease-description-part>

			<!--			<view>
				<view class="head">
					<view class="head-text">
						病害基础信息
					</view>
				</view>

				&lt;!&ndash; 将原来的部件类型picker改为multiSelector &ndash;&gt;
				<view class="component-name">
					<picker class="picker" mode="multiSelector" @change="typeMultiPickerChange"
						@columnchange="typeColumnChange" :value="typeMultiIndex" :range="typeMultiArray">
						<view class="picker-titleAndContent">
							<view class="picker-left">
								<text class="picker-must">*</text>
								<view class="picker-title">
									构件名称
								</view>
							</view>
							<view class="picker-right">
								<view class="picker-content"
									:style="componentNamePicker === '' ? 'color: #CCCCCC;' : ''">
									{{ componentNamePicker || '请选择构件名称'}}
								</view>
								<text class="picker-icon">&gt;</text>

								<view class="component-name-input" v-show="componentNamePicker === '其他'">
									<input class="component-code-input" v-model="componentNameInput"
										placeholder="请输入构件名称" placeholder-style="color: #CCCCCC;" @click.stop />
									<view class="clear-input" @click.stop="componentNameInput = '' ">×</view>
								</view>

							</view>
						</view>
					</picker>
				</view>


				&lt;!&ndash; 替换原来的构件编号picker为input输入框 &ndash;&gt;
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

				&lt;!&ndash; 修改病害类型选择器 &ndash;&gt;
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

				&lt;!&ndash; 修改病害位置区域 - 从弹窗改为picker和input组合 &ndash;&gt;
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


			</view>-->

			<!--			<view>
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

				&lt;!&ndash; 使用v-for循环生成多组定量数据输入框 &ndash;&gt;
				<view v-for="(diseaseData, index) in diseaseDataList" :key="index" class="">
					&lt;!&ndash; 如果缺损数量大于1，显示缺损编号 &ndash;&gt;
					<view v-if="diseaseDataList.length > 1" class="disease-index-title">
						缺损-{{index + 1}}
					</view>

					<view class="line-select">
						<view class="line-select-left">
							<text style="color: red;">*</text>
							<view>裂缝特征</view>
						</view>
						<view class="line-select-right">
							<uni-data-checkbox mode="tag" v-model="diseaseData.crackTypeIndex"
								:localdata="crackType"></uni-data-checkbox>
						</view>
					</view>

					<view class="location-description">
						<view class="location-description-left">
							据参考面1位置
						</view>
						<view class="location-description-right">
							距
							<view class="location-description-right-position"
								@click="openReferenceSurfacePopup(1, index)">
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
							<view class="location-description-right-position"
								@click="openReferenceSurfacePopup(2, index)">
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

					&lt;!&ndash; 长度 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							长度
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.lengthRangeStart">
										<view class="clear-input" @click="diseaseData.lengthRangeStart = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.lengthRangeEnd">
										<view class="clear-input" @click="diseaseData.lengthRangeEnd = ''">×</view>
									</view>
								</view>
							</template>
							&lt;!&ndash; 普通模式 &ndash;&gt;
							<template v-else>
								<view class="quantitative-data-right-value">
									<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
										v-model="diseaseData.length">
									<view class="clear-input" @click="diseaseData.length = ''">×</view>
								</view>
							</template>
							<view class="quantitative-data-right-unit">
								<view class="quantitative-data-right-unit-input"> m
								</view>
							</view>
						</view>
					</view>

					&lt;!&ndash; 宽度 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							宽度
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.widthRangeStart">
										<view class="clear-input" @click="diseaseData.widthRangeStart = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.widthRangeEnd">
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
					</view>

					&lt;!&ndash; 高度/深度 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							高度/深度
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.heightDepthRangeStart">
										<view class="clear-input" @click="diseaseData.heightDepthRangeStart = ''">×
										</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.heightDepthRangeEnd">
										<view class="clear-input" @click="diseaseData.heightDepthRangeEnd = ''">×</view>
									</view>
								</view>
							</template>
							&lt;!&ndash; 普通模式 &ndash;&gt;
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

					&lt;!&ndash; 缝宽 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							缝宽
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.crackWidthRangeStart">
										<view class="clear-input" @click="diseaseData.crackWidthRangeStart = ''">×
										</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.crackWidthRangeEnd">
										<view class="clear-input" @click="diseaseData.crackWidthRangeEnd = ''">×</view>
									</view>
								</view>
							</template>
							&lt;!&ndash; 普通模式 &ndash;&gt;
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

					&lt;!&ndash; 面积 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							面积
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.areaLength">
										<view class="clear-input" @click="diseaseData.areaLength = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.areaWidth">
										<view class="clear-input" @click="diseaseData.areaWidth = ''">×</view>
									</view>
								</view>
							</template>
							&lt;!&ndash; 普通模式 &ndash;&gt;
							<template v-else>
								<view class="quantitative-data-right-value">
									<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
										v-model="diseaseData.area">
									<view class="clear-input" @click="diseaseData.area = ''">×</view>
								</view>
							</template>
							<view class="quantitative-data-right-unit">
								<view class="quantitative-data-right-unit-input"> m² </view>
							</view>
						</view>
					</view>

					&lt;!&ndash; 体积 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							体积
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.deformationRangeStart">
										<view class="clear-input" @click="diseaseData.deformationRangeStart = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.deformationRangeEnd">
										<view class="clear-input" @click="diseaseData.deformationRangeEnd = ''">×</view>
									</view>
								</view>
							</template>
							&lt;!&ndash; 普通模式 &ndash;&gt;
							<template v-else>
								<view class="quantitative-data-right-value">
									<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
										v-model="diseaseData.deformation">
									<view class="clear-input" @click="diseaseData.deformation = ''">×</view>
								</view>
							</template>
							<view class="quantitative-data-right-unit">
								<view class="quantitative-data-right-unit-input"> m³
								</view>
							</view>
						</view>
					</view>

					&lt;!&ndash; 角度 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							角度
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.angleRangeStart">
										<view class="clear-input" @click="diseaseData.angleRangeStart = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.angleRangeEnd">
										<view class="clear-input" @click="diseaseData.angleRangeEnd = ''">×</view>
									</view>
								</view>
							</template>
							&lt;!&ndash; 普通模式 &ndash;&gt;
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

					&lt;!&ndash; 百分比 - 根据模式显示不同的输入框 &ndash;&gt;
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							百分比
						</view>
						<view class="quantitative-data-right">
							&lt;!&ndash; 范围模式 &ndash;&gt;
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.numeratorRatio">
										<view class="clear-input" @click="diseaseData.numeratorRatio = ''">×
										</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.denominatorRatio">
										<view class="clear-input" @click="diseaseData.denominatorRatio = ''">×</view>
									</view>
								</view>
							</template>
							&lt;!&ndash; 普通模式 &ndash;&gt;
							<template v-else>
								<view class="quantitative-data-right-value">
									<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
										v-model="diseaseData.percentage">
									<view class="clear-input" @click="diseaseData.percentage = ''">×</view>
								</view>
							</template>
							<view class="quantitative-data-right-unit">
								<view class="quantitative-data-right-unit-input"> %
								</view>
							</view>
						</view>
					</view>

					<view class="line-select">
						<view class="line-select-left">
							<text style="color: red;">*</text>
							<view>发展趋势</view>
						</view>
						<view class="line-select-right">
							<uni-data-checkbox mode="tag" v-model="diseaseData.developmentTrendIndex"
								:localdata="developmentTrend"></uni-data-checkbox>
						</view>
					</view>
				</view>

			</view>-->

			<!-- <view>
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
						<view>病害性质</view>
					</view>
					<view class="line-select-right">
						<uni-data-checkbox mode="tag" v-model="natureindex" :localdata="nature"></uni-data-checkbox>
					</view>
				</view>

				<view class="line-select" v-show="typePicker !== '其他'">
					<view class="line-select-left">
						<text style="color: red;">*</text>
						<view>参与评定</view>
					</view>
					<view class="line-select-right">
						<uni-data-checkbox mode="tag" v-model="participateAssessindex"
							:localdata="participateAssess"></uni-data-checkbox>
					</view>
				</view>

				<view class="line-select" v-show="typePicker !== '其他'">
					<view class="line-select-left">
						<text style="color: red;">*</text>
						<view>评定标度</view>
					</view>
					<view class="line-select-right">
						<uni-data-checkbox mode="tag" v-model="levelindex" :localdata="level"></uni-data-checkbox>
					</view>
				</view>
			</view> -->

			<view>
				<view class="head">
					<view class="head-text">
						病害附件信息
					</view>
				</view>

				<view class="part-UploadImage">
					<view class="part-title">上传图片</view>
					<view class="upload-view">
						<uni-file-picker class="file-picker" limit="9" :image-styles="imageStyles" v-model="fileList"
							file-mediatype="image" mode="grid" @select="handleFileSelect" @delete="handleFileDelete"
							:auto-upload="false"></uni-file-picker>
					</view>
				</view>

				<view class="part-ADImages">
					<view class="part-title">上传简图</view>
					<view class="ADImages">
						<view class="img-wrapper" v-for="(img, index) in ADImgs" :key="img.src">
							<image :src="img.src" class="ADImage" />
							<view class="close-btn" @click="removeImage(index)">×</view>
						</view>
						<view class="ADImage-container" @click="selectCanvasTemplate()">
							<image src="/static/image/AD.svg" class="ADImageButton"></image>
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

		<!--		<uni-popup ref="referenceSurfacePopup" type="center">
			<view class="location-description-position-popup-content">
				<view class="location-description-position-popup-title">参考面选择</view>
				<view class="location-description-position-popup-input1">
					<input type="text" placeholder="请填写" class="location-description-popup-input"
						v-model="referenceSurfaceInput" />
					<button class="location-description-popup-button" @click="confirmreferenceSurfaceInput">确定</button>
				</view>
				<view class="location-description-position-popup-input3">
					<view v-for="(item, index) in referenceSurfaceOptions" :key="index"
						class="location-description-position-popup-input3-item"
						@click="selectReferenceSurfaceItem(item)">
						{{item}}
					</view>
				</view>
			</view>
		</uni-popup>-->


	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
		watch,
		computed
	} from 'vue';
	import {
		getObject,
		readDiseaseImages,
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

	const diseaseInformationRef = ref(null);
	const diseaseQuantitativeDataRef = ref(null);
	const diseaseDescriptionPart = ref(null);

	const userInfo = userStore()

	const idStorageInfo = idStore();

	const openMode = ref('create');

	const popup = ref(null);
	const ADImgs = ref([]);

	// 保存结构数据
	const structureData = ref(null);
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

	/*	// 监听缺损数量变化，动态更新diseaseDataList
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
		});*/

	/*	const createDescription = () => {
			console.log("diseaseDataList.value", diseaseDataList.value);
			const createDescription = generateDiseaseDescription({
				componentName: getComponentName(), // 构件名称
				diseaseType: type.value, // 病害类型
				diseasePosition: position.value, // 病害位置
				crackFeature: crackType.value, // 裂缝特征数组
				defects: diseaseDataList.value, // 病害定量数据数组
				counts: quantity.value, // 病害数量
			})
			description.value = createDescription
		}*/

	// 更新缺损数据列表
	/*	const updateDiseaseDataList = (count) => {
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
					widthRangeStart: firstItem?.widthRangeStart || firstItem?.width || '',
					widthRangeEnd: firstItem?.widthRangeEnd || '',
					heightDepthRangeStart: firstItem?.heightDepthRangeStart || firstItem?.heightDepth || '',
					heightDepthRangeEnd: firstItem?.heightDepthRangeEnd || '',
					crackWidthRangeStart: firstItem?.crackWidthRangeStart || firstItem?.crackWidth || '',
					crackWidthRangeEnd: firstItem?.crackWidthRangeEnd || '',
					areaLength: firstItem?.areaLength || firstItem?.area || '',
					areaWidth: firstItem?.areaWidth || '',
					deformationRangeStart: firstItem?.deformationRangeStart || firstItem?.deformation || '',
					deformationRangeEnd: firstItem?.deformationRangeEnd || '',
					angleRangeStart: firstItem?.angleRangeStart || firstItem?.angle || '',
					angleRangeEnd: firstItem?.angleRangeEnd || '',
					numeratorRatio: firstItem?.numeratorRatio || firstItem?.percentage || '',
					denominatorRatio: firstItem?.denominatorRatio || '',
					// 保留原有字段为空
					length: '',
					width: '',
					heightDepth: '',
					crackWidth: '',
					area: '',
					deformation: '',
					angle: '',
					percentage: '',
					crackTypeIndex: firstItem?.crackTypeIndex || 0,
					developmentTrendIndex: firstItem?.developmentTrendIndex || 0,
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
								length: existingData[i].lengthRangeStart || '',
								width: existingData[i].widthRangeStart || '',
								heightDepth: existingData[i].heightDepthRangeStart || '',
								crackWidth: existingData[i].crackWidthRangeStart || '',
								area: existingData[i].areaLength || '',
								deformation: existingData[i].deformationRangeStart || '',
								angle: existingData[i].angleRangeStart || '',
								percentage: existingData[i].numeratorRatio || '',
								crackTypeIndex: existingData[i].crackTypeIndex || 0,
								developmentTrendIndex: existingData[i].developmentTrendIndex || 0,
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
							length: '',
							width: '',
							crackWidth: '',
							heightDepth: '',
							area: '',
							deformation: '',
							angle: '',
							percentage: '',
							crackTypeIndex: 0,
							developmentTrendIndex: 0,
							useRangeMode: false
						});
					}
				}
			}

			diseaseDataList.value = newList;
		};*/


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

	// 初始化三级选择器的列数据
	/*	const initMultiPickerColumns = () => {
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
		}*/

	// 更新第三列数据
	/*	const updateThirdColumn = () => {
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
		}*/

	/*	// 多列选择器列变化处理
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
		}*/

	/*	// 添加一个新函数来更新构件名称相关的值
		const updateComponentNameValues = () => {
			// 更新grandObjectName
			grandObjectName.value = structureTypes.value[typeMultiIndex.value[0]];

			// 如果第二级索引有效，设置parentObjectName
			if (typeMultiIndex.value[1] >= 0 && typeMultiIndex.value[1] < typeMultiArray.value[1].length) {
				parentObjectName.value = typeMultiArray.value[1][typeMultiIndex.value[1]];
			}
		}*/

	/*	// 确认选择事件
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
		}*/

	/*	// 监听grandObjectName的变化，更新三级选择器的第一列选中项
		watch(grandObjectName, (newVal) => {
			const index = structureTypes.value.findIndex(item => item === newVal);
			if (index !== -1 && index !== typeMultiIndex.value[0]) {
				typeMultiIndex.value[0] = index;
				initMultiPickerColumns();
			}
		});*/

	// 页面加载时初始化三级选择器
	onMounted(async () => {
		// 获取结构数据（先执行，并等待完成）
		await fetchStructureData();

		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;

		// 初始化构件名称多级选择器
		// initMultiPickerColumns();
		// 如果有mode参数且值为edit，则设为编辑模式
		if (options && options.mode === 'edit') {
			openMode.value = 'edit';

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
		} else if (options && options.mode === 'history') {
			openMode.value = 'history';
			// 如果传递了数据，则解析并填充表单
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
			}
			// 非编辑模式，初始化三级选择器
			// initMultiPickerColumns();
		} else {
			openMode.value = 'create';
		}

		// 初始化缺损数据列表
		// updateDiseaseDataList(quantity.value);
	});

	// 根据接收的数据填充表单
	const fillFormWithData = (data) => {
		console.log('开始填充表单数据:', data);

		// 优先处理部件类型所属大类（上部结构/下部结构/桥面系）
		/*if (data.component?.grandObjectName) {
			grandObjectName.value = data.component.grandObjectName;
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
					if (data.component?.parentObjectName) {
						parentObjectName.value = data.component.parentObjectName;
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
							if (data.component.biObject.name) {
								const componentName = data.biObjectName;

								// 先设置componentNamePicker，这是我们用来显示的值
								componentNamePicker.value = data.component.biObject.name;

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
						} else {
							// 如果在第二级中找不到匹配项，可能是自定义名称
							// 直接设置构件名称
							if (data.component?.name) {
								componentNamePicker.value = data.component.name;
								componentNameInput.value = data.component.name;
								console.log('设置自定义构件名称:', data.component.name);
							}
						}
					} else if (data.component?.name) {
						// 如果没有parentObjectName但有name，直接设置构件名称
						componentNamePicker.value = data.component.name;
						componentNameInput.value = data.component.name;
						console.log('设置自定义构件名称:', data.component.name);
					}
				} else {
					console.log('第二维数据初始化失败，无法设置构件名称');
					// 直接设置构件名称
					if (data.component?.name) {
						componentNamePicker.value = data.component.name;
						componentNameInput.value = data.component.name;
						console.log('设置自定义构件名称:', data.component.name);
					}
				}
			}
		}*/

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
				diseaseType: data.diseaseType.name
			})
			console.log('成功设置病害类型:', data.type);
		}

		// 设置病害位置
		if (data.position) {
			// updateDiseasePositionOptions();
			position.value = data.position;

			uni.$emit('setDiseasePosition', data.position)

			// console.log('预设选项:', diseasePosition.value);
			// 检查是否在预设选项中
			/*if (diseasePosition.value.includes(data.position)) {
				console.log('在预设选项中:', data.position);
				positionPicker.value = data.position;
				positionInput.value = '';
				uni.$emit('setDiseasePosition', {
					positionPicker: data.position,
					positionInput: '',
					diseasePosition: diseasePosition.value
				})
			} else {
				console.log('不在预设选项中:', data.position);
				positionPicker.value = '其他';
				positionInput.value = data.position;
				uni.$emit('setDiseasePosition', {
					positionPicker: '其他',
					positionInput: data.position,
					diseasePosition: diseasePosition.value
				})
			}*/

			console.log('成功设置病害位置:', data.position);
		}

		// 设置缺损数量
		if (data.quantity) {
			quantity.value = parseInt(data.quantity) || 1;
			uni.$emit('setQuantity', data.quantity)
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

    if(data.crackType){
      uni.$emit('setCrackType', data.crackType)
    }

    if(data.developmentTrend){
      uni.$emit('setDevelopmentTrend', data.developmentTrend)
    }

		// 处理diseaseDetails数据
		if (data.diseaseDetails && Array.isArray(data.diseaseDetails) && data.diseaseDetails.length > 0) {

			// 判断是否为范围模式 - 直接使用quantity字段判断
			const quantity = parseInt(data.quantity) || 0;
			const isRangeMode = quantity >= 10;
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
				// 普通模式 - 为每个缺损创建一条记录
				const newList = data.diseaseDetails.map(detail => {
					return {
						useRangeMode: false,
						length1: detail.length1 || '',
						// width: detail.width || '',
						heightDepth: detail.heightDepth || '',
						crackWidth: detail.crackWidth || '',
						areaLength: detail.areaLength || '',
            areaWidth: detail.areaWidth || '',
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
			console.log('成功设置diseaseDetails数据, 条目数量:', diseaseDataList.value.length);
		}
    /*else {
			// 如果没有diseaseDetails数据，创建默认的单条记录
			// 检查老的数据格式并转换
			const defaultData = {
				useRangeMode: false,
				length: data.length || '',
				width: data.width || '',
				heightDepth: data.heightDepth || '',
				crackWidth: data.crackWidth || '',
				area: data.area || '',
				deformation: '',
				angle: '',
				percentage: '',
				reference1Location: '',
				reference1LocationStart: '',
				reference1LocationEnd: '',
				reference2Location: '',
				reference2LocationStart: '',
				reference2LocationEnd: '',
				crackTypeIndex: 0,
				developmentTrendIndex: findIndexByText(developmentTrend.value, data.developmentTrend) || 0
			};

			diseaseDataList.value = [defaultData];
			console.log('使用老格式数据创建默认记录');
		}*/

		// 处理图片数据
		if (data.images && Array.isArray(data.images)) {
			console.log('开始处理图片数据......:', data.images);
			const imagesPaths = readDiseaseImages(userInfo.username, idStorageInfo.buildingId, data.images);
			console.log('处理后的图片路径:', imagesPaths);
			fileList.value = imagesPaths.map((url, index) => ({
				name: `图片${index + 1}`,
				url: url,
				extname: 'jpg',
				size: 0
			}));
		}

		// AD图片
		if (data.ADImgs && Array.isArray(data.ADImgs)) {
			const ADImgsPaths = readDiseaseImages(userInfo.username, idStorageInfo.buildingId, data.ADImgs);
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

		if (!currentId || !grandObjectName.value) {
			uni.showToast({
				title: '无法获取当前病害信息',
				icon: 'none'
			});
			return;
		}

		// 使用uni.$emit发送获取同类型病害列表的请求
		uni.$emit('getDiseasesOfType', {
			type: grandObjectName.value,
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

		if (!currentId || !grandObjectName.value) {
			uni.showToast({
				title: '无法获取当前病害信息',
				icon: 'none'
			});
			return;
		}

		// 使用uni.$emit发送获取同类型病害列表的请求
		uni.$emit('getDiseasesOfType', {
			type: grandObjectName.value,
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
					// width: item.width || '',
					heightDepth: item.heightDepth || '',
					crackWidth: item.crackWidth || '',
					// area: item.area || '',
					deformation: item.deformation || '',
					angle: item.angle || '',
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
					areaLength: '',
					areaWidth: '',
					deformationRangeStart: '',
					deformationRangeEnd: '',
					angleRangeStart: '',
					angleRangeEnd: '',
					numeratorRatio: '',
					denominatorRatio: '',

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
			createTime: openMode.value === 'create' ? formatDateTime() : JSON.parse(decodeURIComponent(getCurrentPages()[getCurrentPages().length - 1].$page?.options.data))?.createTime,
			updateTime: formatDateTime(),
			id: openMode.value === 'create' ? new Date().getTime() : getCurrentPages()[getCurrentPages().length - 1]
				.$page?.options?.id,
			diseaseType: diseaseTypeObj ? {
				id: diseaseTypeObj.id,
				code: diseaseTypeObj.code || '',
				name: diseaseTypeObj.name,
				maxScale: diseaseTypeObj.maxScale || 5,
				minScale: diseaseTypeObj.minScale || 1,
				status: "0"
			} : null,
			diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
			description: diseaseDescriptionPart.value.description,
			position: diseaseInformationRef.value.position,
			level: diseaseDescriptionPart.value.level,
			quantity: diseaseQuantitativeDataRef.value.quantity,
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
			/*{
				createBy: "",
				createTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				updateTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				id: null, // 第一级id设为null
				code: componentCodeInput.value, // 使用输入的构件编号
				name: componentName + '#' + componentCodeInput.value, // 使用第三级选择的值或输入框中的值#构件编号
				biObjectId: thirdLevelComponentId || (biObjectObj ? biObjectObj.id : null),
				status: "0",
				delFlag: "0",
				biObject: {
					id: thirdLevelComponentId || (biObjectObj ? biObjectObj.id : null),
					name: thirdLevelComponentName || (biObjectObj ? biObjectObj.name : ''), // 使用第三级选择的值
					count: 0
				},
				parentObjectName: parentObjectName.value, // 使用第二级选择的值
				grandObjectName: grandObjectName.value // 使用第一级选择的值
			},*/
			componentId: null, // 组件ID也设为null
			buildingId: idStorageInfo.buildingId,
			images: [], // 初始化为空数组，等待图片保存后更新
			ADImgs: [], // 添加AD图片字段
			commitType: 1, //0为已提交 1为未提交 2为删除
			localId: new Date().getTime(),
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
		if (options && options.data) {
			try {
				const originalData = JSON.parse(decodeURIComponent(options.data));
				// 将相对路径转为绝对路径
				originalImages = readDiseaseImages(userInfo.username, idStorageInfo.buildingId, originalData
					.images) || [];
				originalADImages = readDiseaseImages(userInfo.username, idStorageInfo.buildingId, originalData
					.ADImgs) || [];
			} catch (error) {
				console.error('解析原始数据失败:', error);
			}
		}

		// 获取当前文件列表中的图片URL
		const currentImageUrls = fileList.value.map(img => img.url);
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

	// 添加一个函数来获取当前选择的构件名称,可能为picker中直接选取，也可能为其他时自行输入
	/*	const getComponentName = () => {
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
		}*/

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

	const copyAndAddDisease = () => {
		console.log('复制并新增');

		// 清空图片列表
		fileList.value = [];

		// 清空AD图片列表
		ADImgs.value = [];

		// 将编辑模式切换为新增模式
		openMode.value = 'create';

		// 简单提示
		uni.showToast({
			title: '复制成功',
			icon: 'none',
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
			const data = await getObject(userInfo.username, idStorageInfo.buildingId);
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

	// 根据选择的部件类型更新缺损类型选项
	/*	const updateDiseaseTypeOptions = () => {
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
		}*/

	/*	// 清空函数
		const clearQuantity = () => {
			quantity.value = '';
		};*/

	// 构件名称input输入框
	const componentNameInput = ref('');

	// 构件编号 - 改为输入框
	const componentCodeInput = ref('');

	// 更新病害位置选项
	/*	const updateDiseasePositionOptions = () => {
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
						console.log('更新病害位置选项为第三级子组件:', diseasePosition.value);
						return;
					}
				}
			}

			// 如果都没有，使用默认值为空
			diseasePosition.value = [];
			console.log('使用默认病害位置选项');
		};*/

	/*	// 打开参考面选择弹窗
		const openReferenceSurfacePopup = (surfaceNumber = 1, diseaseIndex = 0) => {
			// 设置当前正在编辑的是参考面1还是参考面2，以及缺损索引
			currentReferenceSurface.value = surfaceNumber;
			currentDiseaseIndex.value = diseaseIndex;

			// 清空输入框
			referenceSurfaceInput.value = '';

			// 检查是否已选择病害位置
			if (!position.value) {
				uni.showToast({
					title: '请先选择病害位置',
					icon: 'none'
				});
				return;
			}

			// 尝试找到与当前选择的病害位置匹配的组件
			let positionProps = '';

			// 获取当前选中的部件类型
			let selectedComponent = null;

			// 检查是否有选择第三级
			if (typeMultiIndex.value[2] >= 0 && typeMultiArray.value[2].length > 0 &&
				biObjectNameOptions.value && biObjectNameOptions.value[typeMultiIndex.value[1]] &&
				biObjectNameOptions.value[typeMultiIndex.value[1]].children) {
				selectedComponent = biObjectNameOptions.value[typeMultiIndex.value[1]].children[typeMultiIndex.value[2]];
			}
			// 如果没有第三级，使用第二级
			else if (typeMultiIndex.value[1] >= 0 && biObjectNameOptions.value && biObjectNameOptions.value.length > 0) {
				selectedComponent = biObjectNameOptions.value[typeMultiIndex.value[1]];
			}

			// 如果找到了组件，尝试在其children中查找与当前病害位置匹配的组件
			if (selectedComponent && selectedComponent.children && Array.isArray(selectedComponent.children)) {
				const matchingChild = selectedComponent.children.find(child => child.name === position.value);
				if (matchingChild && matchingChild.props) {
					positionProps = matchingChild.props;
					console.log('找到匹配的病害位置组件:', matchingChild.name, '其props:', positionProps);
				}
			}

			// 如果没有找到匹配的子组件props，使用当前选中组件的props
			if (!positionProps && selectedComponent && selectedComponent.props) {
				positionProps = selectedComponent.props;
				console.log('使用当前选中组件的props:', positionProps);
			}

			// 解析props中的参考面选项
			if (positionProps) {
				const options = parsePropsForRef(positionProps, `ref${surfaceNumber}`);
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
			referenceSurfacePopup.value.open();
		};*/

	/*	// 设置默认参考面选项
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
		};*/

	/*	// 确认参考面输入框的值
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
			referenceSurfacePopup.value.close();
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
			referenceSurfacePopup.value.close();
		};

		// 清除参考面起点终点的值
		const clearReferenceSurfaceStart = (diseaseIndex, surfaceNumber) => {
			if (surfaceNumber === 1) {
				diseaseDataList.value[diseaseIndex].reference1LocationStart = '';
			} else {
				diseaseDataList.value[diseaseIndex].reference2LocationStart = '';
			}
		};

		const clearReferenceSurfaceEnd = (diseaseIndex, surfaceNumber) => {
			if (surfaceNumber === 1) {
				diseaseDataList.value[diseaseIndex].reference1LocationEnd = '';
			} else {
				diseaseDataList.value[diseaseIndex].reference2LocationEnd = '';
			}
		};*/

	/*	// 添加当前编辑的缺损索引
		const currentDiseaseIndex = ref(0);

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
		}*/

	/*	// 添加isThirdLevelOther辅助函数，用于判断是否选择了"其他"选项
		const isThirdLevelOther = () => {
			if (typeMultiIndex.value[1] < 0 || typeMultiIndex.value[2] < 0) {
				return true;
			}

			const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
			if (!selectedSecondLevel || !selectedSecondLevel.children || !Array.isArray(selectedSecondLevel.children)) {
				return true;
			}

			return typeMultiIndex.value[2] >= selectedSecondLevel.children.length;
		};*/

	/*	// 监听typePicker和typeInput的变化，更新type
		watch([typePicker, typeInput], ([newTypePicker, newTypeInput]) => {
			if (newTypePicker === '其他' && newTypeInput) {
				type.value = newTypeInput;
			} else {
				type.value = newTypePicker;
			}
		}, {
			deep: true
		});*/

	/*	// 添加病害类型picker变化处理方法
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

						// 如果当前选择的评定标度不在新的范围内，则重置为最小值
						if (levelindex.value < minScale || levelindex.value > maxScale) {
							levelindex.value = minScale;
						}

						console.log('更新评定标度范围:', minScale, '至', maxScale);
					}
				}

				console.log('病害类型选择变更为:', typePicker.value);
			}
		}

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

				console.log('病害位置选择变更为:', positionPicker.value);
			}
		}*/

	// 监听positionPicker和positionInput的变化，更新position
	/*	watch([positionPicker, positionInput], ([newPositionPicker, newPositionInput]) => {
			if (newPositionPicker === '其他' && newPositionInput) {
				position.value = newPositionInput;
			} else if (newPositionPicker !== '其他') {
				position.value = newPositionPicker;
			}
		}, {
			deep: true
		});*/

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
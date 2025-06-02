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

			<view>
				<view class="head">
					<view class="head-text">
						病害基础信息
					</view>
				</view>

				<!-- 将原来的部件类型picker改为multiSelector -->
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
							<view class="picker-content" :style="biObjectindex === -1 ? 'color: #CCCCCC;' : ''">
								{{ getSelectedComponentName() || '请选择部件类型'}}
							</view>
							<text class="picker-icon">&gt;</text>
						</view>
					</view>
				</picker>


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

				<picker class="picker" @change="TypeofdefectPickerChange" :value="typeindex" :range="type">
					<view class="picker-titleAndContent">
						<view class="picker-left">
							<text class="picker-must">*</text>
							<view class="picker-title">
								病害类型
							</view>
						</view>
						<view class="picker-right">
							<view class="picker-content" :style="typeindex === -1 ? 'color: #CCCCCC;' : ''">
								{{type[typeindex] || '请选择缺损类型'}}
							</view>
							<text class="picker-icon">&gt;</text>
						</view>
					</view>
				</picker>

				<!-- 修改病害位置区域 - 添加点击事件 -->
				<view class="picker" @click="openPositionPopup">
					<view class="picker-titleAndContent">
						<view class="picker-left">
							<text class="picker-must">*</text>
							<view class="picker-title">
								病害位置
							</view>
						</view>
						<view class="picker-right">
							<view class="picker-content" :style="!position ? 'color: #CCCCCC;' : ''">
								{{position || '请选择病害位置'}}
							</view>
							<text class="picker-icon">&gt;</text>
						</view>
					</view>
				</view>






			</view>

			<!--			<view class="part-typeandnumber">

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


				<picker class="picker-number" @change="numberPickerChange" :value="componentCodeindex"
					:range="componentCode">
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
				<picker class="picker-Typeofdefect" @change="TypeofdefectPickerChange" :value="typeindex" :range="type">
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
			</view>-->

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

				<!-- 使用v-for循环生成多组定量数据输入框 -->
				<view v-for="(diseaseData, index) in diseaseDataList" :key="index" class="">
					<!-- 如果缺损数量大于1，显示缺损编号 -->
					<view v-if="diseaseDataList.length > 1" class="disease-index-title">
						缺损-{{index + 1}}
					</view>

					<view class="line-select">
						<view class="line-select-left">
							<text style="color: red;">*</text>
							<view>裂缝特征</view>
						</view>
						<view class="line-select-right">
							<uni-data-checkbox mode="tag" v-model="diseaseData.crackCharacteristicsIndex"
								:localdata="crackCharacteristics"></uni-data-checkbox>
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
									:style="!diseaseData.referenceSurface1 ? 'color: #CCCCCC;' : ''">
									{{ diseaseData.referenceSurface1 || "请选择" }}
								</view>
								<view class="right-icon">&gt;</view>
							</view>
							<view class="reference-start">
								<input type="text" placeholder="起点位置" v-model="diseaseData.referenceSurface1Start">
								<view class="clear-input" @click="clearReferenceSurfaceStart(index, 1)">×</view>
							</view>
							<view class="reference-end">
								<input type="text" placeholder="终点位置" v-model="diseaseData.referenceSurface1End">
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
									:style="!diseaseData.referenceSurface2 ? 'color: #CCCCCC;' : ''">
									{{ diseaseData.referenceSurface2 || "请选择" }}
								</view>
								<view class="right-icon">&gt;</view>
							</view>
							<view class="reference-start">
								<input type="text" placeholder="起点位置" v-model="diseaseData.referenceSurface2Start">
								<view class="clear-input" @click="clearReferenceSurfaceStart(index, 2)">×</view>
							</view>
							<view class="reference-end">
								<input type="text" placeholder="终点位置" v-model="diseaseData.referenceSurface2End">
								<view class="clear-input" @click="clearReferenceSurfaceEnd(index, 2)">×</view>
							</view>
							<view class="quantitative-data-right-unit">
								<view class="quantitative-data-right-unit-input"> m
								</view>
							</view>
						</view>
					</view>

					<!-- 长度 - 根据模式显示不同的输入框 -->
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							长度
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.lengthMin">
										<view class="clear-input" @click="diseaseData.lengthMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.lengthMax">
										<view class="clear-input" @click="diseaseData.lengthMax = ''">×</view>
									</view>
								</view>
							</template>
							<!-- 普通模式 -->
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

					<!-- 宽度 - 根据模式显示不同的输入框 -->
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							宽度
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.widthMin">
										<view class="clear-input" @click="diseaseData.widthMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.widthMax">
										<view class="clear-input" @click="diseaseData.widthMax = ''">×</view>
									</view>
								</view>
							</template>
							<!-- 普通模式 -->
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

					<!-- 高度/深度 - 根据模式显示不同的输入框 -->
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							高度/深度
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.heightOrDepthMin">
										<view class="clear-input" @click="diseaseData.heightOrDepthMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.heightOrDepthMax">
										<view class="clear-input" @click="diseaseData.heightOrDepthMax = ''">×</view>
									</view>
								</view>
							</template>
							<!-- 普通模式 -->
							<template v-else>
								<view class="quantitative-data-right-value">
									<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
										v-model="diseaseData.heightOrDepth">
									<view class="clear-input" @click="diseaseData.heightOrDepth = ''">×</view>
								</view>
							</template>
							<view class="quantitative-data-right-unit">
								<view class="quantitative-data-right-unit-input"> m
								</view>
							</view>
						</view>
					</view>

					<!-- 缝宽 - 根据模式显示不同的输入框 -->
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							缝宽
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.slitWidthMin">
										<view class="clear-input" @click="diseaseData.slitWidthMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.slitWidthMax">
										<view class="clear-input" @click="diseaseData.slitWidthMax = ''">×</view>
									</view>
								</view>
							</template>
							<!-- 普通模式 -->
							<template v-else>
								<view class="quantitative-data-right-value">
									<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
										v-model="diseaseData.slitWidth">
									<view class="clear-input" @click="diseaseData.slitWidth = ''">×</view>
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
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							面积
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.areaMin">
										<view class="clear-input" @click="diseaseData.areaMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.areaMax">
										<view class="clear-input" @click="diseaseData.areaMax = ''">×</view>
									</view>
								</view>
							</template>
							<!-- 普通模式 -->
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

					<!-- 体积 - 根据模式显示不同的输入框 -->
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							体积
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.volumeMin">
										<view class="clear-input" @click="diseaseData.volumeMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.volumeMax">
										<view class="clear-input" @click="diseaseData.volumeMax = ''">×</view>
									</view>
								</view>
							</template>
							<!-- 普通模式 -->
							<template v-else>
								<view class="quantitative-data-right-value">
									<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
										v-model="diseaseData.volume">
									<view class="clear-input" @click="diseaseData.volume = ''">×</view>
								</view>
							</template>
							<view class="quantitative-data-right-unit">
								<view class="quantitative-data-right-unit-input"> m³
								</view>
							</view>
						</view>
					</view>

					<!-- 角度 - 根据模式显示不同的输入框 -->
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							角度
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.angleMin">
										<view class="clear-input" @click="diseaseData.angleMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.angleMax">
										<view class="clear-input" @click="diseaseData.angleMax = ''">×</view>
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
					<view class="quantitative-data">
						<view class="quantitative-data-left">
							百分比
						</view>
						<view class="quantitative-data-right">
							<!-- 范围模式 -->
							<template v-if="diseaseData.useRangeMode">
								<view class="quantitative-data-right-range">
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最小值"
											type="number" v-model="diseaseData.percentageMin">
										<view class="clear-input" @click="diseaseData.percentageMin = ''">×</view>
									</view>
									<view class="range-separator">-</view>
									<view class="quantitative-data-right-value">
										<input class="quantitative-data-right-value-input" placeholder="最大值"
											type="number" v-model="diseaseData.percentageMax">
										<view class="clear-input" @click="diseaseData.percentageMax = ''">×</view>
									</view>
								</view>
							</template>
							<!-- 普通模式 -->
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
							<uni-data-checkbox mode="tag" v-model="diseaseData.trendIndex"
								:localdata="trend"></uni-data-checkbox>
						</view>
					</view>
				</view>

			</view>

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

				<view class="line-select">
					<view class="line-select-left">
						<text style="color: red;">*</text>
						<view>参与评定（构件扣分25）</view>
					</view>
					<view class="line-select-right">
						<uni-data-checkbox mode="tag" v-model="participateAssessindex"
							:localdata="participateAssess"></uni-data-checkbox>
					</view>
				</view>

				<view class="line-select">
					<view class="line-select-left">
						<text style="color: red;">*</text>
						<view>评定标度</view>
					</view>
					<view class="line-select-right">
						<uni-data-checkbox mode="tag" v-model="levelindex" :localdata="level"></uni-data-checkbox>
					</view>
				</view>


			</view>


			<!--			<view class="part-NumAndWayofDefect">

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
			</view>-->

			<!--			<view class="part-descriptionofDefect">
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

			</view>-->

			<view class="head">
				<view class="head-text">
					病害附件信息
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

		<!-- 底部弹出层 -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup-content">
				<view class="template-row">
					<view class="template-type">
						模板
					</view>
					<view class="template-image">
						<image src="/static/image/template1.png" class="template-image-card"
							@click="onClickTemplate(1)"></image>
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate(2)"></image>
						<image src="/static/image/template3.png" class="template-image-card"
							@click="onClickTemplate(3)"></image>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 添加病害位置选择弹窗 -->
		<uni-popup ref="diseasePositionPopup" type="center">
			<view class="position-popup-content">
				<view class="position-popup-title">选择病害位置</view>
				<uni-combox class="position-combox" :candidates="diseasePosition" v-model="selectedPosition"
					placeholder="请选择病害位置"></uni-combox>
				<view class="position-popup-buttons">
					<button class="position-popup-button cancel" @click="closeDiseasePositionPopup">取消</button>
					<button class="position-popup-button confirm" @click="confirmDiseasePosition">确认</button>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="referenceSurfacePopup" type="center">
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
		</uni-popup>


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
	import {
		getObject
	} from '../../utils/readJsonNew.js';
	import {
		saveDiseaseImages
	} from '../../utils/reviseNew.js';

	const popup = ref(null);
	const ADImgs = ref([]);
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
	const componentCodePopup = ref(null);
	// 存储过滤后的构件编号
	const filteredComponentCodes = ref([]);
	// 存储构件编号搜索框内容
	const componentCodeFilter = ref('');

	// 缺损类型
	const type = ref([]);
	const typeindex = ref(-1);

	// 缺损位置
	const position = ref('');

	// 添加一个数组来存储多个缺损的数据
	const diseaseDataList = ref([]);

	// 缺损数量
	const quantity = ref(1);

	// 监听缺损数量变化，动态更新diseaseDataList
	watch(quantity, (newValue) => {
		const numValue = parseInt(newValue);
		if (isNaN(numValue) || numValue <= 0) {
			// 如果输入无效，设为默认值1
			updateDiseaseDataList(1);
		} else if (numValue >= 10) {
			// 限制最大数量为10，并且使用范围输入模式
			quantity.value = 10;
			updateDiseaseDataList(10, true);
		} else {
			updateDiseaseDataList(numValue);
		}
	});

	// 更新缺损数据列表
	const updateDiseaseDataList = (count, useRangeMode = false) => {
		// 保存现有数据
		const existingData = [...diseaseDataList.value];

		// 创建新的数据列表
		const newList = [];

		// 如果数量大于等于10，只创建一条记录，使用范围模式
		if (useRangeMode) {
			// 如果已有数据，尝试保留第一条的值作为范围的起始值
			const firstItem = existingData.length > 0 ? existingData[0] : null;

			newList.push({
				referenceSurface1: firstItem?.referenceSurface1 || '',
				referenceSurface1Start: firstItem?.referenceSurface1Start || '',
				referenceSurface1End: firstItem?.referenceSurface1End || '',
				referenceSurface2: firstItem?.referenceSurface2 || '',
				referenceSurface2Start: firstItem?.referenceSurface2Start || '',
				referenceSurface2End: firstItem?.referenceSurface2End || '',
				// 范围输入字段
				lengthMin: firstItem?.length || '',
				lengthMax: '',
				widthMin: firstItem?.width || '',
				widthMax: '',
				heightOrDepthMin: firstItem?.heightOrDepth || '',
				heightOrDepthMax: '',
				slitWidthMin: firstItem?.slitWidth || '',
				slitWidthMax: '',
				areaMin: firstItem?.area || '',
				areaMax: '',
				volumeMin: firstItem?.volume || '',
				volumeMax: '',
				angleMin: firstItem?.angle || '',
				angleMax: '',
				percentageMin: firstItem?.percentage || '',
				percentageMax: '',
				// 保留原有字段为空
				length: '',
				width: '',
				heightOrDepth: '',
				slitWidth: '',
				area: '',
				volume: '',
				angle: '',
				percentage: '',
				crackCharacteristicsIndex: firstItem?.crackCharacteristicsIndex || 0,
				trendIndex: firstItem?.trendIndex || 0,
				useRangeMode: true
			});
		} else {
			// 正常模式，为每个缺损创建一条记录
			for (let i = 0; i < count; i++) {
				// 如果有现有数据，保留它
				if (i < existingData.length) {
					// 如果之前是范围模式，需要转换回普通模式
					if (existingData[i].useRangeMode) {
						newList.push({
							referenceSurface1: existingData[i].referenceSurface1 || '',
							referenceSurface1Start: existingData[i].referenceSurface1Start || '',
							referenceSurface1End: existingData[i].referenceSurface1End || '',
							referenceSurface2: existingData[i].referenceSurface2 || '',
							referenceSurface2Start: existingData[i].referenceSurface2Start || '',
							referenceSurface2End: existingData[i].referenceSurface2End || '',
							// 使用Min值作为普通模式的值
							length: existingData[i].lengthMin || '',
							width: existingData[i].widthMin || '',
							heightOrDepth: existingData[i].heightOrDepthMin || '',
							slitWidth: existingData[i].slitWidthMin || '',
							area: existingData[i].areaMin || '',
							volume: existingData[i].volumeMin || '',
							angle: existingData[i].angleMin || '',
							percentage: existingData[i].percentageMin || '',
							crackCharacteristicsIndex: existingData[i].crackCharacteristicsIndex || 0,
							trendIndex: existingData[i].trendIndex || 0,
							useRangeMode: false
						});
					} else {
						// 保持原有数据不变
						newList.push(existingData[i]);
					}
				} else {
					// 创建新的数据对象
					newList.push({
						referenceSurface1: '',
						referenceSurface1Start: '',
						referenceSurface1End: '',
						referenceSurface2: '',
						referenceSurface2Start: '',
						referenceSurface2End: '',
						length: '',
						width: '',
						slitWidth: '',
						heightOrDepth: '',
						area: '',
						volume: '',
						angle: '',
						percentage: '',
						crackCharacteristicsIndex: 0,
						trendIndex: 0,
						useRangeMode: false
					});
				}
			}
		}

		diseaseDataList.value = newList;
	};

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

	const diseasePosition = ref([]);


	const diseasePositionPopup = ref(null);
	const selectedPosition = ref('');

	// 为三级选择器添加的数据和方法
	const structureTypes = ref(['上部结构', '下部结构', '桥面系', '附属设施']);
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
	}]);
	const levelindex = ref(1);


	//裂缝特征
	const crackCharacteristicsIndex = ref(0);
	const crackCharacteristics = ref([{
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

	const trend = ref([{
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
	const trendindex = ref(0);

	//参考面1
	const referenceSurface1 = ref('');

	//参考面2
	const referenceSurface2 = ref('');

	// 参考面弹窗引用
	const referenceSurfacePopup = ref(null);

	// 当前选择的是参考面1还是参考面2
	const currentReferenceSurface = ref(1);

	// 参考面输入框的值
	const referenceSurfaceInput = ref('');

	// 参考面选项列表
	const referenceSurfaceOptions = ref([]);

	// 初始化三级选择器的列数据
	const initMultiPickerColumns = () => {
		// 根据第一列当前选中项更新第二列的数据
		const structureType = structureTypes.value[typeMultiIndex.value[0]];

		// 设置parentObjectName以便获取对应的部件类型列表
		parentObjectName.value = structureType;

		// 调用更新部件类型选项的方法
		updateBiObjectOptions();

		// 等待biObjectName更新后再设置第二列数据
		setTimeout(() => {
			typeMultiArray.value[1] = biObjectName.value;

			// 如果第二列已经有值且索引超出范围，重置为0
			if (typeMultiIndex.value[1] >= biObjectName.value.length) {
				typeMultiIndex.value[1] = 0;
			}

			// 更新第三列数据
			updateThirdColumn();
		}, 50);
	}

	// 更新第三列数据
	const updateThirdColumn = () => {
		// 检查是否有第二列选择
		if (typeMultiIndex.value[1] < 0 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
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
		const thirdLevelNames = selectedSecondLevel.children.map(item => item.name);
		typeMultiArray.value[2] = thirdLevelNames;

		// 如果第三列索引超出范围，重置为0
		if (typeMultiIndex.value[2] >= thirdLevelNames.length) {
			typeMultiIndex.value[2] = 0;
		}
	}

	// 列变化事件
	const typeColumnChange = (e) => {
		console.log('typeColumnChange:', e);
		const column = e.detail.column;
		const value = e.detail.value;

		// 记录变化的值
		typeMultiIndex.value[column] = value;

		// 如果第一列变化，则更新第二列数据
		if (column === 0) {
			// 设置parentObjectName为新选择的值
			parentObjectName.value = structureTypes.value[value];

			// 调用更新部件类型选项的方法
			updateBiObjectOptions();

			// 重置第二列和第三列索引
			typeMultiIndex.value[1] = 0;
			typeMultiIndex.value[2] = 0;

			// 更新第二列数据
			setTimeout(() => {
				typeMultiArray.value[1] = biObjectName.value;
				// 更新第三列数据
				updateThirdColumn();
			}, 100);
		}
		// 如果第二列变化，则更新第三列数据
		else if (column === 1) {
			// 更新第三列数据
			updateThirdColumn();
		}
	}

	// 确认选择事件
	const typeMultiPickerChange = (e) => {
		console.log('typeMultiPickerChange:', e);
		typeMultiIndex.value = e.detail.value;

		// 更新parentObjectName
		parentObjectName.value = structureTypes.value[typeMultiIndex.value[0]];

		// 更新biObjectindex
		biObjectindex.value = typeMultiIndex.value[1];

		// 如果有第三级选择，更新为第三级组件
		if (typeMultiArray.value[2].length > 0) {
			// 获取选中的第二级对象和第三级索引
			const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
			const thirdLevelIndex = typeMultiIndex.value[2];

			if (selectedSecondLevel && selectedSecondLevel.children &&
				Array.isArray(selectedSecondLevel.children) &&
				thirdLevelIndex < selectedSecondLevel.children.length) {

				// 使用第三级组件的信息
				const selectedThirdLevel = selectedSecondLevel.children[thirdLevelIndex];
				console.log('选择了第三级组件:', selectedThirdLevel.name);

				// 这里可以根据需要更新其他相关数据
			}
		}

		// 更新缺损类型和构件编号
		updateDiseaseTypeOptions();
		updateComponentNumbers();

		// 更新病害位置选项
		updateDiseasePositionOptions();
	}

	// 监听parentObjectName的变化，更新三级选择器的第一列选中项
	watch(parentObjectName, (newVal) => {
		const index = structureTypes.value.findIndex(item => item === newVal);
		if (index !== -1 && index !== typeMultiIndex.value[0]) {
			typeMultiIndex.value[0] = index;
			initMultiPickerColumns();
		}
	});

	// 页面加载时初始化三级选择器
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

		// 初始化三级选择器
		setTimeout(() => {
			initMultiPickerColumns();
		}, 200);

		// 初始化过滤后的构件编号列表
		filteredComponentCodes.value = [...componentCode.value];

		// 初始化病害位置选项
		setTimeout(() => {
			updateDiseasePositionOptions();
		}, 300);

		// 初始化缺损数据列表
		updateDiseaseDataList(quantity.value);
	});

	// 根据接收的数据填充表单
	const fillFormWithData = (data) => {
		console.log('开始填充表单数据:', data);

		// 保存一个临时标记，用于判断数据加载状态
		let dataLoaded = false;

		// 优先处理部件类型所属大类（上部结构/下部结构/桥面系）
		if (data.component?.parentObjectName) {
			parentObjectName.value = data.component.parentObjectName;
			console.log('设置病害所属大类:', parentObjectName.value);

			// 初始化typeMultiIndex的第一维
			const parentIndex = structureTypes.value.findIndex(item => item === parentObjectName.value);
			if (parentIndex !== -1) {
				typeMultiIndex.value[0] = parentIndex;
				// 异步初始化第二维数据
				setTimeout(() => {
					initMultiPickerColumns();

					// 处理部件类型（biObject）
					if (data.component?.biObject?.name) {
						const biObjectIdx = biObjectName.value.findIndex(item => item === data.component
							.biObject.name);
						console.log('尝试设置部件类型索引:', biObjectIdx, '对应值:', data.component.biObject.name);

						if (biObjectIdx !== -1) {
							// 更新部件类型索引和多选器
							biObjectindex.value = biObjectIdx;
							typeMultiIndex.value[1] = biObjectIdx;
							console.log('成功设置部件类型:', data.component.biObject.name);

							// 更新病害类型选项
							setTimeout(() => {
								updateDiseaseTypeOptions();

								// 设置构件编号
								if (data.component?.code) {
									componentCodeInput.value = data.component.code;
									console.log('成功设置构件编号:', data.component.code);
								}

								// 设置病害类型
								setTimeout(() => {
									if (data.type) {
										const diseaseTypeIdx = type.value.findIndex(item =>
											item === data.type);
										if (diseaseTypeIdx !== -1) {
											typeindex.value = diseaseTypeIdx;
											console.log('成功设置病害类型:', data.type);
											dataLoaded = true;
										} else {
											console.warn('未找到匹配的病害类型:', data.type);
										}
									}
								}, 10);
							}, 10);
						} else {
							console.warn('未找到匹配的部件类型:', data.component.biObject.name);
						}
					}
				}, 300);
			}
		}

		// 设置缺损位置
		if (data.position) {
			position.value = data.position;
		}

		// 设置缺损数量
		if (data.quantity) {
			quantity.value = parseInt(data.quantity) || 1;
		}

		// 设置参与评定值（uni-data-checkbox格式）
		if (data.participateAssess !== undefined) {
			participateAssessindex.value = data.participateAssess === "1" ? 1 : 0;
		}

		// 设置评定标度（uni-data-checkbox格式）
		if (data.level) {
			const levelVal = parseInt(data.level);
			levelindex.value = levelVal; // 索引从0开始，值从1开始
		}

		// 设置长度和其他数值
		if (data.length) {
			length.value = data.length;
		}

		if (data.width) {
			width.value = data.width;
		}

		if (data.slitWidth) {
			slitWidth.value = data.slitWidth;
		}

		if (data.heightOrDepth) {
			heightOrDepth.value = data.heightOrDepth;
		}

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
		if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex
				.value]) {
			biObjectObj = biObjectNameOptions.value[biObjectindex.value];
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
			component: biObjectObj ? {
				createBy: "admin",
				createTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				updateTime: formatDateTime(new Date(new Date().setFullYear(2025))),
				id: biObjectObj.id, // 使用部件对象ID
				code: componentCodeInput.value, // 使用输入的构件编号
				name: biObjectObj.name, // 使用部件对象名称
				biObjectId: biObjectObj.id,
				status: "0",
				delFlag: "0",
				biObject: {
					id: biObjectObj.id,
					name: biObjectObj.name,
					count: 0
				},
				parentObjectName: parentObjectName.value
			} : null,
			componentId: biObjectObj ? biObjectObj.id : null,
			buildingId: 37,
			images: [] // 初始化为空数组，等待图片保存后更新
		};

		// 验证数据完整性
		if (!diseaseData.type || !diseaseData.component || !diseaseData.diseaseType || !componentCodeInput.value) {
			console.log('数据不完整，请确保选择了部件类型、输入了构件编号和缺损类型');
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
		if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex
				.value]) {
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
		if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex
				.value]) {
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


	// 关闭病害位置选择弹窗
	const closeDiseasePositionPopup = () => {
		diseasePositionPopup.value.close();
	}

	// 确认病害位置选择
	const confirmDiseasePosition = () => {
		position.value = selectedPosition.value;
		closeDiseasePositionPopup();
	}

	// 恢复被删除的函数
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

		// 更新二级选择器的第二列数据
		if (typeMultiArray.value) {
			typeMultiArray.value[1] = biObjectName.value;
		}
	}

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
		if (!selectedBiObject.comments || !Array.isArray(selectedBiObject.comments) || selectedBiObject.comments
			.length === 0) {
			console.log('当前部件类型没有构件编号信息');
			componentCode.value = ['1', '2', '3']; // 使用默认值
			return;
		}

		// 从comments中提取code字段作为构件编号
		componentCode.value = selectedBiObject.comments.map(item => item.code);
		console.log('构件编号选项更新为:', componentCode.value);

		// 重置构件编号选择
		componentCodeindex.value = -1;
	}

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
	}

	// 打开构件编号选择弹窗
	const openComponentCodePopup = () => {
		// 初始化过滤后的构件编号列表
		filteredComponentCodes.value = [...componentCode.value];

		// 打开弹窗
		componentCodePopup.value.open();
	}





	// 检查部件类型是否已选择，然后打开构件编号弹窗
	const checkAndOpenComponentCodePopup = () => {
		if (biObjectindex.value === -1) {
			uni.showToast({
				title: '请先选择部件类型',
				icon: 'none'
			});
			return;
		}
		openComponentCodePopup();
	}

	// 检查构件编号是否已选择
	const checkComponentCodeSelected = () => {
		if (componentCodeindex.value === -1) {
			uni.showToast({
				title: '请先选择构件编号',
				icon: 'none'
			});
			return false;
		}
		return true;
	}

	// 检查构件编号是否已选择，然后打开病害位置弹窗
	const checkAndOpenDiseasePositionPopup = () => {
		openPositionPopup();
	}

	// 直接打开病害位置弹窗
	const openPositionPopup = () => {
		diseasePositionPopup.value.open();
	}

	// 在script setup部分，添加定量数据变量和清空函数
	// 体积
	const volume = ref('');

	// 角度
	const angle = ref('');

	// 百分比
	const percentage = ref('');

	// 清空函数
	const clearQuantity = () => {
		quantity.value = '';
	};

	const clearLength = () => {
		length.value = '';
	};

	const clearWidth = () => {
		width.value = '';
	};

	const clearHeight = () => {
		heightOrDepth.value = '';
	};

	const clearSeamsWidth = () => {
		slitWidth.value = '';
	};

	const clearArea = () => {
		area.value = '';
	};

	const clearVolume = () => {
		volume.value = '';
	};

	const clearAngle = () => {
		angle.value = '';
	};

	const clearPercentage = () => {
		percentage.value = '';
	};


	// 获取选择的组件名称显示
	const getSelectedComponentName = () => {
		if (biObjectindex.value === -1) return '';

		// 如果有选择第三级
		if (typeMultiIndex.value[2] >= 0 && typeMultiArray.value[2].length > 0) {
			return typeMultiArray.value[2][typeMultiIndex.value[2]];
		}

		// 如果只选择了第二级
		if (typeMultiIndex.value[1] >= 0 && typeMultiArray.value[1].length > 0) {
			return typeMultiArray.value[1][typeMultiIndex.value[1]];
		}

		return '';
	};

	// 构件编号 - 改为输入框
	const componentCodeInput = ref('');

	// 更新病害位置选项
	const updateDiseasePositionOptions = () => {
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

		// 如果都没有，使用默认值
		diseasePosition.value = ["底板", "左翼板", "右翼板", "顶板", "左腹板", "右腹板"];
		console.log('使用默认病害位置选项');
	};

	// 解析props字符串，提取可选值
	const parseProps = (propsString) => {
		if (!propsString) return [];

		// 尝试解析格式为 "ref1:=小桩号面、大桩号面&&ref2:=左腹板、右腹板、内腹板、外腹板" 的字符串
		const result = [];

		// 按&&分割多个引用
		const refParts = propsString.split('&&');

		refParts.forEach(refPart => {
			// 按:=分割引用名和值
			const parts = refPart.split(':=');
			if (parts.length === 2) {
				// 按、分割多个值
				const values = parts[1].split('、');
				values.forEach(value => {
					if (value && !result.includes(value)) {
						result.push(value);
					}
				});
			}
		});

		return result;
	};

	// 监听构件名称选择变化，更新病害位置选项
	watch([typeMultiIndex], () => {
		updateDiseasePositionOptions();
	}, {
		deep: true
	});

	// 打开参考面选择弹窗
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
	};

	// 设置默认参考面选项
	const setDefaultReferenceSurfaceOptions = (surfaceNumber) => {
		if (surfaceNumber === 1) {
			referenceSurfaceOptions.value = ['小桩号面', '大桩号面'];
		} else {
			referenceSurfaceOptions.value = ['左腹板', '右腹板', '内腹板', '外腹板'];
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
			diseaseDataList.value[currentDiseaseIndex.value].referenceSurface1 = referenceSurfaceInput.value.trim();
		} else {
			diseaseDataList.value[currentDiseaseIndex.value].referenceSurface2 = referenceSurfaceInput.value.trim();
		}

		// 关闭弹窗
		referenceSurfacePopup.value.close();
	};

	// 选择参考面列表中的项
	const selectReferenceSurfaceItem = (item) => {
		// 根据当前编辑的是参考面1还是参考面2，设置相应的值
		if (currentReferenceSurface.value === 1) {
			diseaseDataList.value[currentDiseaseIndex.value].referenceSurface1 = item;
		} else {
			diseaseDataList.value[currentDiseaseIndex.value].referenceSurface2 = item;
		}

		// 关闭弹窗
		referenceSurfacePopup.value.close();
	};

	// 清除参考面起点终点的值
	const clearReferenceSurfaceStart = (diseaseIndex, surfaceNumber) => {
		if (surfaceNumber === 1) {
			diseaseDataList.value[diseaseIndex].referenceSurface1Start = '';
		} else {
			diseaseDataList.value[diseaseIndex].referenceSurface2Start = '';
		}
	};

	const clearReferenceSurfaceEnd = (diseaseIndex, surfaceNumber) => {
		if (surfaceNumber === 1) {
			diseaseDataList.value[diseaseIndex].referenceSurface1End = '';
		} else {
			diseaseDataList.value[diseaseIndex].referenceSurface2End = '';
		}
	};

	// 添加当前编辑的缺损索引
	const currentDiseaseIndex = ref(0);
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



	/* 上传图片 */
	.part-UploadImage {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #EEEEEE;
		padding: 12rpx 16rpx;
		height: 200rpx;
	}
  .part-title{
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
		height: 300rpx;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		;
	}

	.template-type {
		height: 10%;
		font-size: 18rpx;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.template-image {
		height: 90%;
		width: 100%;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
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

	.quantitative-data-right-unit-fixed {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 20rpx;
		padding: 4rpx 4rpx;
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
  .input-right{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 180rpx;
    border: 1rpx solid #eee;
    padding: 4rpx 4rpx;
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
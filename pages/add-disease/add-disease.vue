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
								部件类型
							</view>
						</view>
						<view class="picker-right">
							<view class="picker-content" :style="biObjectindex === -1 ? 'color: #CCCCCC;' : ''">
								{{ biObjectName[biObjectindex] || '请选择部件类型'}}
							</view>
							<text class="picker-icon">&gt;</text>
						</view>
					</view>
				</picker>


				<!-- 替换原来的构件编号picker为view -->
				<view class="picker" @click="checkAndOpenComponentCodePopup">
					<view class="picker-titleAndContent">
						<view class="picker-left">
							<text class="picker-must">*</text>
							<view class="picker-title">
								构件编号
							</view>
						</view>
						<view class="picker-right">
							<view class="picker-content" :style="componentCodeindex === -1 ? 'color: #CCCCCC;' : ''">
								{{ componentCode[componentCodeindex] || '请选择构件编号'}}
							</view>
							<text class="picker-icon">&gt;</text>
						</view>
					</view>
				</view>

				<picker class="picker" @change="TypeofdefectPickerChange" :value="typeindex" :range="type"
					:disabled="componentCodeindex === -1" @click="checkComponentCodeSelected">
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
				<view class="picker" @click="checkAndOpenDiseasePositionPopup">
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
						<picker class="quantitative-data-right-unit" @change="quantityUnitChange"
							:value="quantityUnitIndex" :range="quantityUnitOptions">
							<view class="quantitative-data-right-unit-input"> {{quantityUnitOptions[quantityUnitIndex]}}
							</view>
							<view class="right-icon">&gt;</view>
						</picker>
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

				<view class="location-description">
					<view class="location-description-left">
						纵向起点位置描述
					</view>
					<view class="location-description-right">
						距
						<view class="location-description-right-position"
							@click="openLocationPositionPopup('longitudinal', 'start')">
							<view class="location-description-right-position-input"
								:style="!longitudinalStartPosition ? 'color: #CCCCCC;' : ''">
								{{ longitudinalStartPosition ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="location-description-right-distance"
							@click="openLocationDistancePopup('longitudinal', 'start')">
							<view class="location-description-right-distance-input"
								:style="!longitudinalStartDistance ? 'color: #CCCCCC;' : ''">
								{{ longitudinalStartDistance || "请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="clear" @click="clearLocationDescription('longitudinal', 'start')">
							×
						</view>
					</view>
				</view>

				<view class="location-description">
					<view class="location-description-left">
						横向起点位置描述
					</view>
					<view class="location-description-right">
						距
						<view class="location-description-right-position"
							@click="openLocationPositionPopup('lateral', 'start')">
							<view class="location-description-right-position-input"
								:style="!lateralStartPosition ? 'color: #CCCCCC;' : ''">
								{{ lateralStartPosition ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="location-description-right-distance"
							@click="openLocationDistancePopup('lateral', 'start')">
							<view class="location-description-right-distance-input"
								:style="!lateralStartDistance ? 'color: #CCCCCC;' : ''">
								{{ lateralStartDistance ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="clear" @click="clearLocationDescription('lateral', 'start')">
							×
						</view>
					</view>
				</view>

				<view class="location-description">
					<view class="location-description-left">
						竖向起点位置描述
					</view>
					<view class="location-description-right">
						距
						<view class="location-description-right-position"
							@click="openLocationPositionPopup('vertical', 'start')">
							<view class="location-description-right-distance-input"
								:style="!verticalStartPosition ? 'color: #CCCCCC;' : ''">
								{{ verticalStartPosition ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="location-description-right-distance"
							@click="openLocationDistancePopup('vertical', 'start')">
							<view class="location-description-right-distance-input"
								:style="!verticalStartDistance ? 'color: #CCCCCC;' : ''">
								{{ verticalStartDistance ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="clear" @click="clearLocationDescription('vertical', 'start')">
							×
						</view>
					</view>
				</view>

				<view class="location-description">
					<view class="location-description-left">
						纵向终点位置描述
					</view>
					<view class="location-description-right">
						距
						<view class="location-description-right-position"
							@click="openLocationPositionPopup('longitudinal', 'end')">
							<view class="location-description-right-position-input"
								:style="!longitudinalEndPosition ? 'color: #CCCCCC;' : ''">
								{{ longitudinalEndPosition ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="location-description-right-distance"
							@click="openLocationDistancePopup('longitudinal', 'end')">
							<view class="location-description-right-distance-input"
								:style="!longitudinalEndDistance ? 'color: #CCCCCC;' : ''">
								{{ longitudinalEndDistance || "请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="clear" @click="clearLocationDescription('longitudinal', 'end')">
							×
						</view>
					</view>
				</view>

				<view class="location-description">
					<view class="location-description-left">
						横向终点位置描述
					</view>
					<view class="location-description-right">
						距
						<view class="location-description-right-position"
							@click="openLocationPositionPopup('lateral', 'end')">
							<view class="location-description-right-position-input"
								:style="!lateralEndPosition ? 'color: #CCCCCC;' : ''">{{ lateralEndPosition ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="location-description-right-distance"
							@click="openLocationDistancePopup('lateral', 'end')">
							<view class="location-description-right-distance-input"
								:style="!lateralEndDistance ? 'color: #CCCCCC;' : ''">{{ lateralEndDistance ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="clear" @click="clearLocationDescription('lateral', 'end')">
							×
						</view>
					</view>
				</view>

				<view class="location-description">
					<view class="location-description-left">
						竖向终点位置描述
					</view>
					<view class="location-description-right">
						距
						<view class="location-description-right-position"
							@click="openLocationPositionPopup('vertical', 'end')">
							<view class="location-description-right-distance-input"
								:style="!verticalEndPosition ? 'color: #CCCCCC;' : ''">{{ verticalEndPosition ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="location-description-right-distance"
							@click="openLocationDistancePopup('vertical', 'end')">
							<view class="location-description-right-distance-input"
								:style="!verticalEndDistance ? 'color: #CCCCCC;' : ''">{{ verticalEndDistance ||"请选择" }}
							</view>
							<view class="right-icon">&gt;</view>
						</view>
						<view class="clear" @click="clearLocationDescription('vertical', 'end')">
							×
						</view>
					</view>
				</view>


				<view class="quantitative-data">
					<view class="quantitative-data-left">
						长度
					</view>
					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="length">
							<view class="clear-input" @click="clearLength">×</view>
						</view>
						<picker class="quantitative-data-right-unit" @change="lengthUnitChange" :value="lengthUnitIndex"
							:range="lengthUnitOptions">
							<view class="quantitative-data-right-unit-input"> {{lengthUnitOptions[lengthUnitIndex]}}
							</view>
							<view class="right-icon">&gt;</view>
						</picker>
					</view>
				</view>

				<view class="quantitative-data">
					<view class="quantitative-data-left">
						宽度
					</view>

					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="width">
							<view class="clear-input" @click="clearWidth">×</view>
						</view>
						<picker class="quantitative-data-right-unit" @change="widthUnitChange" :value="widthUnitIndex"
							:range="widthUnitOptions">
							<view class="quantitative-data-right-unit-input"> {{widthUnitOptions[widthUnitIndex]}}
							</view>
							<view class="right-icon">&gt;</view>
						</picker>
					</view>
				</view>

				<view class="quantitative-data">
					<view class="quantitative-data-left">
						高度/深度
					</view>

					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="heightOrDepth">
							<view class="clear-input" @click="clearHeight">×</view>
						</view>
						<picker class="quantitative-data-right-unit" @change="heightUnitChange" :value="heightUnitIndex"
							:range="heightUnitOptions">
							<view class="quantitative-data-right-unit-input"> {{heightUnitOptions[heightUnitIndex]}}
							</view>
							<view class="right-icon">&gt;</view>
						</picker>
					</view>
				</view>

				<view class="quantitative-data">
					<view class="quantitative-data-left">
						缝宽
					</view>

					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="slitWidth">
							<view class="clear-input" @click="clearSeamsWidth">×</view>
						</view>
						<picker class="quantitative-data-right-unit" @change="seamsWidthUnitChange"
							:value="seamsWidthUnitIndex" :range="seamsWidthUnitOptions">
							<view class="quantitative-data-right-unit-input">
								{{seamsWidthUnitOptions[seamsWidthUnitIndex]}}
							</view>
							<view class="right-icon">&gt;</view>
						</picker>
					</view>
				</view>

				<view class="quantitative-data">
					<view class="quantitative-data-left">
						面积
					</view>

					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="area">
							<view class="clear-input" @click="clearArea">×</view>
						</view>
						<picker class="quantitative-data-right-unit" @change="areaUnitChange" :value="areaUnitIndex"
							:range="areaUnitOptions">
							<view class="quantitative-data-right-unit-input"> {{areaUnitOptions[areaUnitIndex]}} </view>
							<view class="right-icon">&gt;</view>
						</picker>
					</view>
				</view>

				<view class="quantitative-data">
					<view class="quantitative-data-left">
						体积
					</view>

					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="volume">
							<view class="clear-input" @click="clearVolume">×</view>
						</view>
						<picker class="quantitative-data-right-unit" @change="volumeUnitChange" :value="volumeUnitIndex"
							:range="volumeUnitOptions">
							<view class="quantitative-data-right-unit-input"> {{volumeUnitOptions[volumeUnitIndex]}}
							</view>
							<view class="right-icon">&gt;</view>
						</picker>
					</view>
				</view>

				<view class="quantitative-data">
					<view class="quantitative-data-left">
						角度
					</view>

					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="angle">
							<view class="clear-input" @click="clearAngle">×</view>
						</view>
						<view class="quantitative-data-right-unit-fixed">
							<view class="quantitative-data-right-unit-input"> 度 </view>
							<view class="right-icon">&emsp;</view>
						</view>
					</view>
				</view>

				<view class="quantitative-data">
					<view class="quantitative-data-left">
						百分比
					</view>

					<view class="quantitative-data-right">
						<view class="quantitative-data-right-value">
							<input class="quantitative-data-right-value-input" placeholder="请填写" type="number"
								v-model="percentage">
							<view class="clear-input" @click="clearPercentage">×</view>
						</view>
						<view class="quantitative-data-right-unit-fixed">
							<view class="quantitative-data-right-unit-input"> % </view>
							<view class="right-icon">&emsp;</view>
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

				<view class="line-select">
					<view class="line-select-left">
						<text style="color: red;">*</text>
						<view>病害维护状态</view>
					</view>
					<view class="line-select-right">
						<uni-data-checkbox mode="tag" v-model="maintenanceStatusindex"
							:localdata="maintenanceStatus"></uni-data-checkbox>
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
						空心板、实心板
					</view>
					<view class="template-image">
						<image src="/static/image/template1.png" class="template-image-card"
							@click="onClickTemplate('kxb1')"></image>
						<image src="/static/image/template1.png" class="template-image-card"
							@click="onClickTemplate('kxb2')"></image>
						<image src="/static/image/template1.png" class="template-image-card"
							@click="onClickTemplate('kxb3')"></image>
						<image src="/static/image/template3.png" class="template-image-card"
							@click="onClickTemplate('kxb4')"></image>
						<image src="/static/image/template3.png" class="template-image-card"
							@click="onClickTemplate('kxb5')"></image>
						<image src="/static/image/template3.png" class="template-image-card"
							@click="onClickTemplate('kxb6')"></image>
					</view>
					<view class="template-type">
						T梁
					</view>
					<view class="template-image">
						<image src="/static/image/template3.png" class="template-image-card"
							@click="onClickTemplate('tl1')"></image>
					</view>

					<view class="template-type">
						箱梁
					</view>
					<view class="template-image">
						<image src="/static/image/template3.png" class="template-image-card"
							@click="onClickTemplate('xl1')"></image>
					</view>

					<view class="template-type">
						变截面箱梁
					</view>
					<view class="template-image">
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate('blmxl2')"></image>
					</view>

					<view class="template-type">
						桥台、桥墩
					</view>
					<view class="template-image">
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate('qt1')"></image>
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate('qt2')"></image>
					</view>

					<view class="template-type">
						横隔板
					</view>
					<view class="template-image">
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate('hgl1')"></image>
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate('hgl2')"></image>
					</view>

					<view class="template-type">
						翼墙、耳墙
					</view>
					<view class="template-image">
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate('yq1')"></image>
					</view>
					<view class="template-type">
						盖梁
					</view>
					<view class="template-image">
						<image src="/static/image/template2.png" class="template-image-card"
							@click="onClickTemplate('gl1')"></image>
					</view>
					<view class="template-type">
						圆桩墩
					</view>
					<view class="template-image">

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

		<!-- 添加构件编号选择弹窗 -->
		<uni-popup ref="componentCodePopup" type="center">
			<view class="component-popup-content">
				<view class="component-popup-title">选择构件编号</view>
				<view class="component-search-box">
					<input class="component-search-input" v-model="componentCodeFilter" placeholder="输入关键字筛选"
						@input="filterComponentCodes" />
					<text v-if="componentCodeFilter" class="component-search-clear"
						@click="clearComponentSearch">×</text>
				</view>
				<scroll-view class="component-code-list" scroll-y>
					<view v-for="(item, index) in filteredComponentCodes" :key="index" class="component-code-item"
						:class="{'component-code-item-active': componentCode[componentCodeindex] === item}"
						@click="selectComponentCode(index)">
						{{ item }}
					</view>
				</scroll-view>
				<view class="component-popup-buttons">
					<button class="component-popup-button cancel" @click="closeComponentCodePopup">取消</button>
					<button class="component-popup-button confirm" @click="confirmComponentCode">确认</button>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="LocationDescriptionPositionPopup" type="center">
			<view class="location-description-position-popup-content">
				<view class="location-description-position-popup-title">{{ currentPositionTitle }}</view>
				<view class="location-description-position-popup-input1">
					<input type="text" placeholder="请填写" class="location-description-popup-input"
						v-model="positionInput1Value" />
					<button class="location-description-popup-button" @click="confirmPositionInput1">确定</button>
				</view>
				<view class="location-description-position-popup-input2">
					<input type="text" placeholder="请填写" class="location-description-popup-input"
						v-model="positionInput2Value" />
					<view class="location-description-position-popup-input2-right">
						<view class="location-description-position-popup-input2-text">#墩侧</view>
						<button class="location-description-popup-button" @click="confirmPositionInput2">确定</button>
					</view>
				</view>
				<view class="location-description-position-popup-input3">
					<view v-for="(item, index) in currentPositionOptions" :key="index"
						class="location-description-position-popup-input3-item" @click="selectPositionItem(item)">
						{{item}}
					</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="LocationDescriptionDistancePopup" type="center">
			<view class="location-description-distance-popup-content">
				<view class="location-description-distance-popup-title">位置</view>
				<view class="location-description-distance-popup-input1">
					<input type="text" v-model="distanceInput1Value" placeholder="请填写"
						class="location-description-popup-input" />
					<view class="location-description-distance-popup-input1-right">
						<view class="location-description-distance-popup-input1-text">米</view>
						<button class="location-description-popup-button" @click="confirmDistanceInput1">确定</button>
					</view>
				</view>
				<view class="location-description-distance-popup-input2">
					<input type="text" v-model="distanceInput2Numerator" placeholder="请填写"
						class="location-description-popup-input" />
					<view class="location-description-distance-popup-input2-mid">分之</view>
					<input type="text" v-model="distanceInput2Denominator" placeholder="请填写"
						class="location-description-popup-input" />
					<button class="location-description-popup-button" @click="confirmDistanceInput2">确定</button>
				</view>
				<view class="location-description-distance-popup-input3">
					<view v-for="(item, index) in ['1/2','1/3','1/4']" :key="index"
						class="location-description-distance-popup-input3-item" @click="selectDistanceItem(item)">
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

	const diseasePosition = ref(["底板", "左翼板", "右翼板", "顶板", "左腹板", "右腹板"]);


	const diseasePositionPopup = ref(null);
	const selectedPosition = ref('');

	// 为二级选择器添加的数据和方法
	const structureTypes = ref(['上部结构', '下部结构', '桥面系', '附属设施']);
	const typeMultiArray = ref([
		structureTypes.value,
		[]
	]);
	const typeMultiIndex = ref([0, 0]);


	//数量单位picker
	const quantityUnitData = ref([{
			text: '个',
			value: 0
		},
		{
			text: '条',
			value: 1
		},
		{
			text: '台',
			value: 2
		},
		{
			text: '次',
			value: 3
		},
		{
			text: '月',
			value: 4
		},
		{
			text: '处',
			value: 5
		}
	]);
	// 创建一个字符串数组供picker使用
	const quantityUnitOptions = ref(quantityUnitData.value.map(item => item.text));
	const quantityUnitIndex = ref(0);
	// 修复change事件处理方法
	const quantityUnitChange = (e) => {
		quantityUnitIndex.value = e.detail.value;
	};

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

	//维护状态
	const maintenanceStatus = ref([{
			text: '待修复',
			value: 0
		}, {
			text: '修复中',
			value: 1
		},
		{
			text: '已修复',
			value: 2
		},
		{
			text: '修补不良',
			value: 3
		}
	]);
	const maintenanceStatusindex = ref(0);



	// 初始化二级选择器的第二列数据
	const initMultiPickerColumn2 = () => {
		// 根据第一列当前选中项更新第二列的数据
		const structureType = structureTypes.value[typeMultiIndex.value[0]];

		// 设置parentObjectName以便获取对应的部件类型列表
		parentObjectName.value = structureType;

		// 调用更新部件类型选项的方法
		updateBiObjectOptions();

		// 等待biObjectName更新后再设置第二列数据
		setTimeout(() => {
			typeMultiArray.value = [
				structureTypes.value,
				biObjectName.value
			];

			// 如果第二列已经有值且索引超出范围，重置为0
			if (typeMultiIndex.value[1] >= biObjectName.value.length) {
				typeMultiIndex.value[1] = 0;
			}
		}, 50);
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

			// 重置第二列索引
			typeMultiIndex.value[1] = 0;

			// 更新第二列数据
			setTimeout(() => {
				typeMultiArray.value = [
					structureTypes.value,
					biObjectName.value
				];
			}, 100);
		}
	}

	// 确认选择事件
	const typeMultiPickerChange = (e) => {
		console.log('typeMultiPickerChange:', e);
		typeMultiIndex.value = e.detail.value;

		// 更新parentObjectName和biObjectindex
		parentObjectName.value = structureTypes.value[typeMultiIndex.value[0]];
		biObjectindex.value = typeMultiIndex.value[1];

		// 更新缺损类型和构件编号
		updateDiseaseTypeOptions();
		updateComponentNumbers();
	}

	// 监听parentObjectName的变化，更新二级选择器的第一列选中项
	watch(parentObjectName, (newVal) => {
		const index = structureTypes.value.findIndex(item => item === newVal);
		if (index !== -1 && index !== typeMultiIndex.value[0]) {
			typeMultiIndex.value[0] = index;
			initMultiPickerColumn2();
		}
	});

	// 页面加载时初始化二级选择器
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

		// 初始化二级选择器
		setTimeout(() => {
			initMultiPickerColumn2();
		}, 200);

		// 初始化过滤后的构件编号列表
		filteredComponentCodes.value = [...componentCode.value];
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
					initMultiPickerColumn2();

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

							// 更新构件编号和病害类型选项
							setTimeout(() => {
								updateDiseaseTypeOptions();
								updateComponentNumbers();

								// 设置构件编号
								setTimeout(() => {
									if (data.component?.code) {
										const codeIndex = componentCode.value.findIndex(item =>
											item === data.component.code);
										if (codeIndex !== -1) {
											componentCodeindex.value = codeIndex;
											console.log('成功设置构件编号:', data.component.code);

											// 设置病害类型
											setTimeout(() => {
												if (data.type) {
													const diseaseTypeIdx = type.value
														.findIndex(item => item ===
															data.type);
													if (diseaseTypeIdx !== -1) {
														typeindex.value =
															diseaseTypeIdx;
														console.log('成功设置病害类型:', data
															.type);
														dataLoaded = true;
													} else {
														console.warn('未找到匹配的病害类型:',
															data.type);
													}
												}
											}, 10);
										} else {
											console.warn('未找到匹配的构件编号:', data.component.code);
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

	// 关闭构件编号选择弹窗
	const closeComponentCodePopup = () => {
		componentCodePopup.value.close();
	}

	// 确认构件编号选择
	const confirmComponentCode = () => {
		// 如果已选择编号，则关闭弹窗
		if (componentCodeindex.value !== -1) {
			closeComponentCodePopup();
		} else {
			uni.showToast({
				title: '请选择构件编号',
				icon: 'none'
			});
		}
	}

	// 清除构件编号搜索框内容
	const clearComponentSearch = () => {
		componentCodeFilter.value = '';
		// 重置过滤列表
		filteredComponentCodes.value = [...componentCode.value];
	}

	// 过滤构件编号
	const filterComponentCodes = () => {
		// 如果搜索框为空，显示全部
		if (!componentCodeFilter.value) {
			filteredComponentCodes.value = [...componentCode.value];
			return;
		}

		// 过滤匹配的构件编号
		filteredComponentCodes.value = componentCode.value.filter(code =>
			code.toString().includes(componentCodeFilter.value)
		);
	}

	// 选择构件编号
	const selectComponentCode = (index) => {
		// 获取在原始数组中的索引
		const selectedCode = filteredComponentCodes.value[index];
		const originalIndex = componentCode.value.findIndex(code => code === selectedCode);

		if (originalIndex !== -1) {
			componentCodeindex.value = originalIndex;
			closeComponentCodePopup();
		}
	}

	// 添加位置描述中位置相关的数据
	const longitudinalStartPosition = ref(''); // 纵向起点位置
	const longitudinalEndPosition = ref(''); // 纵向终点位置
	const lateralStartPosition = ref(''); // 横向起点位置
	const lateralEndPosition = ref(''); // 横向终点位置
	const verticalStartPosition = ref(''); // 竖向起点位置
	const verticalEndPosition = ref(''); // 竖向终点位置

	// 当前激活的方向类型和端点类型
	const activePositionType = ref('');
	const activeEndpointType = ref('');

	// 弹窗标题
	const currentPositionTitle = ref('位置');

	// 不同方向的选项
	const longitudinalPositionOptions = ref(['大桩号侧', '小桩号侧']);
	const lateralPositionOptions = ref(['左侧', '右侧']);
	const verticalPositionOptions = ref(['顶部', '底部']);

	// 当前显示的选项
	const currentPositionOptions = ref([]);

	// 用于存储输入值的变量
	const positionInput1Value = ref('');
	const positionInput2Value = ref('');

	// LocationDescriptionPositionPopup ref    
	const LocationDescriptionPositionPopup = ref(null);

	// 打开位置描述中位置弹窗
	const openLocationPositionPopup = (type, endpoint) => {
		// 记录当前打开的是哪个方向的位置选择和端点类型
		activePositionType.value = type || 'longitudinal';
		activeEndpointType.value = endpoint || 'start';

		// 根据不同方向设置标题和选项
		if (activePositionType.value === 'longitudinal') {
			currentPositionTitle.value = '纵向位置';
			currentPositionOptions.value = longitudinalPositionOptions.value;
		} else if (activePositionType.value === 'lateral') {
			currentPositionTitle.value = '横向位置';
			currentPositionOptions.value = lateralPositionOptions.value;
		} else if (activePositionType.value === 'vertical') {
			currentPositionTitle.value = '竖向位置';
			currentPositionOptions.value = verticalPositionOptions.value;
		}

		// 打开弹窗
		LocationDescriptionPositionPopup.value.open();
	}

	// 处理第一种输入（直接输入）的确定按钮点击
	const confirmPositionInput1 = () => {
		// 获取输入框的值
		const inputValue = positionInput1Value.value;
		if (!inputValue) {
			uni.showToast({
				title: '请输入内容',
				icon: 'none'
			});
			return;
		}

		// 根据当前激活的方向类型和端点类型更新对应的位置值
		if (activePositionType.value === 'longitudinal') {
			if (activeEndpointType.value === 'start') {
				longitudinalStartPosition.value = inputValue;
			} else {
				longitudinalEndPosition.value = inputValue;
			}
		} else if (activePositionType.value === 'lateral') {
			if (activeEndpointType.value === 'start') {
				lateralStartPosition.value = inputValue;
			} else {
				lateralEndPosition.value = inputValue;
			}
		} else if (activePositionType.value === 'vertical') {
			if (activeEndpointType.value === 'start') {
				verticalStartPosition.value = inputValue;
			} else {
				verticalEndPosition.value = inputValue;
			}
		}

		// 关闭弹窗
		LocationDescriptionPositionPopup.value.close();
		// 清空输入值，避免影响下次输入
		positionInput1Value.value = '';
	}

	// 处理第二种输入（输入+#墩侧）的确定按钮点击
	const confirmPositionInput2 = () => {
		// 获取输入框的值
		const inputValue = positionInput2Value.value;
		if (!inputValue) {
			uni.showToast({
				title: '请输入内容',
				icon: 'none'
			});
			return;
		}

		// 构造完整文本
		const fullValue = inputValue + '#墩侧';

		// 根据当前激活的方向类型和端点类型更新对应的位置值
		if (activePositionType.value === 'longitudinal') {
			if (activeEndpointType.value === 'start') {
				longitudinalStartPosition.value = fullValue;
			} else {
				longitudinalEndPosition.value = fullValue;
			}
		} else if (activePositionType.value === 'lateral') {
			if (activeEndpointType.value === 'start') {
				lateralStartPosition.value = fullValue;
			} else {
				lateralEndPosition.value = fullValue;
			}
		} else if (activePositionType.value === 'vertical') {
			if (activeEndpointType.value === 'start') {
				verticalStartPosition.value = fullValue;
			} else {
				verticalEndPosition.value = fullValue;
			}
		}

		// 关闭弹窗
		LocationDescriptionPositionPopup.value.close();
		// 清空输入值
		positionInput2Value.value = '';
	}

	// 处理第三种输入（直接点击选项）
	const selectPositionItem = (item) => {
		// 根据当前激活的方向类型和端点类型更新对应的位置值
		if (activePositionType.value === 'longitudinal') {
			if (activeEndpointType.value === 'start') {
				longitudinalStartPosition.value = item;
			} else {
				longitudinalEndPosition.value = item;
			}
		} else if (activePositionType.value === 'lateral') {
			if (activeEndpointType.value === 'start') {
				lateralStartPosition.value = item;
			} else {
				lateralEndPosition.value = item;
			}
		} else if (activePositionType.value === 'vertical') {
			if (activeEndpointType.value === 'start') {
				verticalStartPosition.value = item;
			} else {
				verticalEndPosition.value = item;
			}
		}

		// 关闭弹窗
		LocationDescriptionPositionPopup.value.close();
	}

	// 打开位置描述中距离弹窗
	const LocationDescriptionDistancePopup = ref(null);
	const openLocationDistancePopup = (type, endpoint) => {
		// 记录当前打开的是哪个方向的距离选择和端点类型
		activeDistanceType.value = type;
		activeDistanceEndpointType.value = endpoint;
		LocationDescriptionDistancePopup.value.open();
	}

	// 修改长度的单位为picker
	const lengthUnitData = ref([{
			text: 'm',
			value: 0
		},
		{
			text: 'cm',
			value: 1
		},
		{
			text: 'mm',
			value: 2
		}
	]);
	// 创建一个字符串数组供picker使用
	const lengthUnitOptions = ref(lengthUnitData.value.map(item => item.text));
	const lengthUnitIndex = ref(0);
	// 修复change事件处理方法
	const lengthUnitChange = (e) => {
		lengthUnitIndex.value = e.detail.value;
	};

	// 修改宽度的单位为picker
	const widthUnitData = ref([{
			text: 'm',
			value: 0
		},
		{
			text: 'cm',
			value: 1
		},
		{
			text: 'mm',
			value: 2
		}
	]);
	// 创建一个字符串数组供picker使用
	const widthUnitOptions = ref(widthUnitData.value.map(item => item.text));
	const widthUnitIndex = ref(0);
	// 修复change事件处理方法
	const widthUnitChange = (e) => {
		widthUnitIndex.value = e.detail.value;
	};

	// 修改高度/深度的单位为picker
	const heightUnitData = ref([{
			text: 'm',
			value: 0
		},
		{
			text: 'cm',
			value: 1
		},
		{
			text: 'mm',
			value: 2
		}
	]);
	// 创建一个字符串数组供picker使用
	const heightUnitOptions = ref(heightUnitData.value.map(item => item.text));
	const heightUnitIndex = ref(0);
	// 修复change事件处理方法
	const heightUnitChange = (e) => {
		heightUnitIndex.value = e.detail.value;
	};

	// 修改缝宽的单位为picker
	const seamsWidthUnitData = ref([{
			text: 'm',
			value: 0
		},
		{
			text: 'cm',
			value: 1
		},
		{
			text: 'mm',
			value: 2
		}
	]);
	// 创建一个字符串数组供picker使用
	const seamsWidthUnitOptions = ref(seamsWidthUnitData.value.map(item => item.text));
	const seamsWidthUnitIndex = ref(0);
	// 修复change事件处理方法
	const seamsWidthUnitChange = (e) => {
		seamsWidthUnitIndex.value = e.detail.value;
	};

	// 修改面积的单位为picker
	const areaUnitData = ref([{
			text: 'm²',
			value: 0
		},
		{
			text: 'cm²',
			value: 1
		},
		{
			text: 'mm²',
			value: 2
		}
	]);
	// 创建一个字符串数组供picker使用
	const areaUnitOptions = ref(areaUnitData.value.map(item => item.text));
	const areaUnitIndex = ref(0);
	// 修复change事件处理方法
	const areaUnitChange = (e) => {
		areaUnitIndex.value = e.detail.value;
	};

	// 修改体积的单位为picker
	const volumeUnitData = ref([{
			text: 'm³',
			value: 0
		},
		{
			text: 'cm³',
			value: 1
		},
		{
			text: 'mm³',
			value: 2
		}
	]);
	// 创建一个字符串数组供picker使用
	const volumeUnitOptions = ref(volumeUnitData.value.map(item => item.text));
	const volumeUnitIndex = ref(0);
	// 修复change事件处理方法
	const volumeUnitChange = (e) => {
		volumeUnitIndex.value = e.detail.value;
	};

	// 添加各方向的距离值
	const longitudinalStartDistance = ref(''); // 纵向起点距离
	const longitudinalEndDistance = ref(''); // 纵向终点距离
	const lateralStartDistance = ref(''); // 横向起点距离
	const lateralEndDistance = ref(''); // 横向终点距离
	const verticalStartDistance = ref(''); // 竖向起点距离
	const verticalEndDistance = ref(''); // 竖向终点距离

	// 当前激活的方向类型（用于区分是哪个位置打开的弹窗）
	const activeDistanceType = ref('');
	// 当前激活的端点类型（用于区分是起点还是终点）
	const activeDistanceEndpointType = ref('');

	// 处理第一种输入（直接输入米数）的确定按钮点击
	const confirmDistanceInput1 = () => {
		// 获取输入框的值
		const inputValue = distanceInput1Value.value;
		if (!inputValue) {
			uni.showToast({
				title: '请输入数值',
				icon: 'none'
			});
			return;
		}

		// 根据当前激活的方向类型和端点类型更新对应的距离值
		if (activeDistanceType.value === 'longitudinal') {
			if (activeDistanceEndpointType.value === 'start') {
				longitudinalStartDistance.value = inputValue + '米';
			} else {
				longitudinalEndDistance.value = inputValue + '米';
			}
		} else if (activeDistanceType.value === 'lateral') {
			if (activeDistanceEndpointType.value === 'start') {
				lateralStartDistance.value = inputValue + '米';
			} else {
				lateralEndDistance.value = inputValue + '米';
			}
		} else if (activeDistanceType.value === 'vertical') {
			if (activeDistanceEndpointType.value === 'start') {
				verticalStartDistance.value = inputValue + '米';
			} else {
				verticalEndDistance.value = inputValue + '米';
			}
		}

		// 关闭弹窗
		LocationDescriptionDistancePopup.value.close();
		// 清空输入值，避免影响下次输入
		distanceInput1Value.value = '';
	}

	// 处理第二种输入（分数形式）的确定按钮点击
	const confirmDistanceInput2 = () => {
		// 获取分子和分母
		const numerator = distanceInput2Numerator.value;
		const denominator = distanceInput2Denominator.value;

		if (!numerator || !denominator) {
			uni.showToast({
				title: '请完整输入分子和分母',
				icon: 'none'
			});
			return;
		}

		// 构造分数形式
		const fractionValue = denominator + '/' + numerator;

		// 根据当前激活的方向类型和端点类型更新对应的距离值
		if (activeDistanceType.value === 'longitudinal') {
			if (activeDistanceEndpointType.value === 'start') {
				longitudinalStartDistance.value = fractionValue;
			} else {
				longitudinalEndDistance.value = fractionValue;
			}
		} else if (activeDistanceType.value === 'lateral') {
			if (activeDistanceEndpointType.value === 'start') {
				lateralStartDistance.value = fractionValue;
			} else {
				lateralEndDistance.value = fractionValue;
			}
		} else if (activeDistanceType.value === 'vertical') {
			if (activeDistanceEndpointType.value === 'start') {
				verticalStartDistance.value = fractionValue;
			} else {
				verticalEndDistance.value = fractionValue;
			}
		}

		// 关闭弹窗
		LocationDescriptionDistancePopup.value.close();
		// 清空输入值
		distanceInput2Numerator.value = '';
		distanceInput2Denominator.value = '';
	}

	// 处理第三种输入（直接点击选项）
	const selectDistanceItem = (item) => {
		// 根据当前激活的方向类型和端点类型更新对应的距离值
		if (activeDistanceType.value === 'longitudinal') {
			if (activeDistanceEndpointType.value === 'start') {
				longitudinalStartDistance.value = item;
			} else {
				longitudinalEndDistance.value = item;
			}
		} else if (activeDistanceType.value === 'lateral') {
			if (activeDistanceEndpointType.value === 'start') {
				lateralStartDistance.value = item;
			} else {
				lateralEndDistance.value = item;
			}
		} else if (activeDistanceType.value === 'vertical') {
			if (activeDistanceEndpointType.value === 'start') {
				verticalStartDistance.value = item;
			} else {
				verticalEndDistance.value = item;
			}
		}

		// 关闭弹窗
		LocationDescriptionDistancePopup.value.close();
	}

	// 用于存储输入值的变量
	const distanceInput1Value = ref('');
	const distanceInput2Numerator = ref('');
	const distanceInput2Denominator = ref('');

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
		if (componentCodeindex.value === -1) {
			uni.showToast({
				title: '请先选择构件编号',
				icon: 'none'
			});
			return;
		}

		if (typeindex.value === -1) {
			uni.showToast({
				title: '请先选择病害类型',
				icon: 'none'
			});
			return;
		}

		openPositionPopup();
	}
	const openPositionPopup = () => {
		// 打开弹窗
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

	// 添加位置描述清空函数
	const clearLocationDescription = (type, endpoint) => {
		if (type === 'longitudinal') {
			if (endpoint === 'start') {
				longitudinalStartPosition.value = '';
				longitudinalStartDistance.value = '';
			} else {
				longitudinalEndPosition.value = '';
				longitudinalEndDistance.value = '';
			}
		} else if (type === 'lateral') {
			if (endpoint === 'start') {
				lateralStartPosition.value = '';
				lateralStartDistance.value = '';
			} else {
				lateralEndPosition.value = '';
				lateralEndDistance.value = '';
			}
		} else if (type === 'vertical') {
			if (endpoint === 'start') {
				verticalStartPosition.value = '';
				verticalStartDistance.value = '';
			} else {
				verticalEndPosition.value = '';
				verticalEndDistance.value = '';
			}
		}
	};
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
		height: 200rpx;
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
		height: 14%;
		font-size: 18rpx;
		box-sizing: border-box;
		background-color: #ddd;
		padding-left: 10rpx;
		display: flex;
		align-items: center;
	}

	.template-image {
		height: 85%;
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

	.location-description-right-distance {
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
		display: flex;
		flex-direction: row;
		align-items: center;
		border: 1rpx solid #EEEEEE;
		margin-left: 20rpx;
		padding: 4rpx 4rpx;
	}

	.quantitative-data-right-unit-input {
		color: #333333;
		width: 50rpx;
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

	/* 构件编号选择弹窗样式 */
	.component-popup-content {
		background-color: #fff;
		width: 600rpx;
		height: 500rpx;
		/* 增加高度 */
		border-radius: 8rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.component-popup-title {
		text-align: center;
		font-size: 24rpx;
		/* 从30rpx减小到24rpx */
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.component-search-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		border: 1rpx solid #ddd;
		border-radius: 6rpx;
		padding: 0 10rpx;
	}

	.component-search-input {
		flex: 1;
		height: 40rpx;
		padding: 4rpx;
		font-size: 22rpx;
		/* 从26rpx减小到22rpx */
	}

	.component-search-clear {
		font-size: 24rpx;
		/* 从30rpx减小到26rpx */
		color: #999;
		padding: 0 10rpx;
	}

	.component-code-list {
		flex: 1;
		overflow-y: auto;
		margin-bottom: 20rpx;
	}

	.component-code-item {
		padding: 12rpx 10rpx;
		/* 从14rpx减小到12rpx */
		border-bottom: 1rpx solid #eee;
		font-size: 22rpx;
		/* 从26rpx减小到22rpx */
	}

	.component-code-item-active {
		background-color: #f0f0f0;
	}

	.component-popup-buttons {
		display: flex;
		justify-content: space-around;
		margin-top: 10rpx;
	}

	.component-popup-button {
		width: 30%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 6rpx;
		font-size: 24rpx;
		/* 从28rpx减小到24rpx */
		padding: 0;
	}

	.component-popup-button.cancel {
		border: 1rpx solid #ddd;
		color: #666;
	}

	.component-popup-button.confirm {
		background-color: #0F4687;
		color: #fff;
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

	.location-description-position-popup-input2 {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: space-between;
	}

	.location-description-position-popup-input2-text {
		font-size: 16rpx;
		margin-right: 10rpx;
		white-space: nowrap;
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

	.location-description-position-popup-input2-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
		/* 防止这部分被压缩 */
	}

	.location-description-position-popup-input3 {
		margin-top: 10rpx;
		font-size: 20rpx;
	}

	.location-description-position-popup-input3-item {
		margin-bottom: 10rpx;
	}


	/*位置描述中距离弹窗样式*/
	.location-description-distance-popup-content {
		background-color: #fff;
		width: 600rpx;
		height: 300rpx;
		border-radius: 8rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.location-description-distance-popup-input1 {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: space-between;
	}

	.location-description-distance-popup-input1-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
		/* 防止这部分被压缩 */
	}

	.location-description-distance-popup-input1-text {
		font-size: 16rpx;
		margin-right: 10rpx;
		white-space: nowrap;
	}

	.location-description-distance-popup-input2 {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
		/* 防止这部分被压缩 */
	}

	.location-description-distance-popup-input2-mid {
		font-size: 16rpx;
		margin-right: 10rpx;
		white-space: nowrap;
	}

	.location-description-distance-popup-input3 {
		margin-top: 10rpx;
		font-size: 20rpx;
	}

	.location-description-distance-popup-input3-item {
		margin-bottom: 10rpx;
	}
</style>
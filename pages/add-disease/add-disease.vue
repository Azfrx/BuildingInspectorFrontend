<template>
	<view>
		<!-- 新增病害时显示 -->
		<view class="button-group-add" v-if="!isEdit">
			<button class="button-before" @click="beforedisease">上一条</button>
			<button class="button-next-add" @click="nextdisease">下一条</button>
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

		<view class="part-typeandnumber">

			<picker class="picker-type" @change="typePickerChange" :value="typeindex" :range="type">
				<view class="picker-content">
					<view class="part-titleandcontent">
						<view class="part-title" style="position: relative;">
							<text style="position: absolute; left: -10px; color: red;">*</text>部件类型
						</view>
						<view class="part-content" :style="typeindex === -1 ? 'color: #CCCCCC;' : ''">{{ type[typeindex] || '请选择部件类型'}} </view>
					</view>
					<view class="part-icon">&gt;</view>
				</view>
			</picker>


			<picker class="picker-number" @change="numberPickerChange" :value="numindex" :range="num">
				<view class="picker-content">
					<view class="part-titleandcontent">
						<view class="part-title" style="position: relative;">
							<text style="position: absolute; left: -10px; color: red;">*</text>构件编号
						</view>
						<view class="part-content" :style="numindex === -1 ? 'color: #CCCCCC;' : ''">{{ num[numindex] || '请选择构件编号'}}</view>
					</view>
					<view class="part-icon">&gt;</view>
				</view>
			</picker>

		</view>

		<view class="part-Typeofdefect">
			<picker class="picker-Typeofdefect" @change="TypeofdefectPickerChange" :value="Typeofdefectindex"
				:range="Typeofdefect">
				<view class="picker-content">
					<view class="part-titleandcontent">
						<view class="part-title" style="position: relative;">
							<text style="position: absolute; left: -10px; color: red;">*</text>缺损类型
						</view>
						<view class="part-content" :style="Typeofdefectindex === -1 ? 'color: #CCCCCC;' : ''">{{Typeofdefect[Typeofdefectindex] || '请选择缺损类型'}}</view>
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
					<input type="text" placeholder="请填写缺损位置信息" class="input-text" placeholder-class="input-text-placeholder" v-model="position">
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
						<uni-number-box class="NumofDefect" v-model="NumofDefect" />
					</view>

				</view>
			</view>

			<picker class="part-WayofDefect" @change="WayofDefectPickerChange" :value="WayofDefectindex"
				:range="WayofDefect">
				<view class="picker-content">
					<view class="part-titleandcontent">
						<view class="part-title">数据记载方式</view>
						<view class="part-content" :style="WayofDefectindex === -1 ? 'color: #CCCCCC;' : ''">{{WayofDefect[WayofDefectindex] || '请选择数据记载方式'}}</view>
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
						<input type="text" placeholder="长度数据" class="input-text" placeholder-class="input-text-placeholder" v-model="length">
					</view>
				</view>
			</view>

			<view class="part-Width">
				<view class="input-content">
					<view class="part-titleandcontent">
						<view class="part-title">宽度(m)</view>
						<input type="text" placeholder="宽度数据" class="input-text" placeholder-class="input-text-placeholder" v-model="width">
					</view>
				</view>
			</view>

		</view>

		<view class="part-SeamWidth-height-area">
			<view class="part-SeamWidth">
				<view class="input-content">
					<view class="part-titleandcontent">
						<view class="part-title">缝宽(mm)</view>
						<input type="text" placeholder="缝宽数据" class="input-text" placeholder-class="input-text-placeholder" v-model="SeamWidth">
					</view>
				</view>
			</view>

			<view class="part-height">
				<view class="input-content">
					<view class="part-titleandcontent">
						<view class="part-title">高度/深度(m)</view>
						<input type="text" placeholder="高度/深度数据" class="input-text" placeholder-class="input-text-placeholder" v-model="height">
					</view>
				</view>
			</view>

			<view class="part-area">
				<view class="input-content">
					<view class="part-titleandcontent">
						<view class="part-title">面积(m²)</view>
						<input type="text" placeholder="面积数据" class="input-text" placeholder-class="input-text-placeholder" v-model="area">
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
					<input type="text" placeholder="请填写病害描述信息" class="input-text" placeholder-class="input-text-placeholder" v-model= "description">
				</view>
			</view>
		</view>

		<view class="part-ScalesandRatings">
			<view class="part-Scales">
				<view class="radio-title" style="position: relative;">
					<text style="position: absolute; left: -10px; color: red;">*</text>评定标度
				</view>
				<radio-group @change="Scales-radioChange" class="radio-group">
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
				<radio-group @change="Ratings-radioChange" class="radio-group">
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
				<uni-file-picker 
					class="file-picker" 
					limit="9" 
					:image-styles="imageStyles" 
					v-model="fileList"
					file-mediatype="image"
					mode="grid"
					@select="handleFileSelect"
					@delete="handleFileDelete"
				></uni-file-picker>
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

	// 判断是编辑模式还是新增模式
	const isEdit = ref(false);

	// 页面加载时，根据参数判断是新增还是编辑模式
	onMounted(() => {
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
	});

	// 根据接收的数据填充表单
	const fillFormWithData = (data) => {
		// 设置部件类型
		if (data.partType) {
			const index = type.value.findIndex(item => item === data.partType);
			if (index !== -1) {
				typeindex.value = index;
			}
		}
		
		// 设置构件编号
		if (data.partNumber) {
			const index = num.value.findIndex(item => item === data.partNumber);
			if (index !== -1) {
				numindex.value = index;
			}
		}
		
		// 设置缺损类型
		if (data.disease) {
			const index = Typeofdefect.value.findIndex(item => item === data.disease);
			if (index !== -1) {
				Typeofdefectindex.value = index;
			}
		}

    // 设置缺损位置
    if(data.position){
      position.value = data.position;
    }

		// 设置缺损数量
		if (data.count) {
			NumofDefect.value = parseInt(data.count) || 1;
		}
		
		// 设置评定标度
		if (data.grade) {
			const index = scalesItems.findIndex(item => item.value === data.grade);
			if (index !== -1) {
				scalesCurrent.value = index;
			}
		}
		
		// 设置参与评定
		if (data.reference) {
			const value = data.reference === '是' ? '1' : '2';
			const index = ratingItems.findIndex(item => item.value === value);
			if (index !== -1) {
				ratingCurrent.value = index;
			}
		}

    //设置长度
    if(data.length){
      length.value = data.length;
    }else {
      length.value = '-';
    }

    //设置宽度
    if(data.width){
      width.value = data.width;
    }else {
      width.value = '-';
    }

    //设置缝宽
    if(data.SeamWidth){
      SeamWidth.value = data.SeamWidth;
    }else {
      SeamWidth.value = '-';
    }

    //设置高度/深度
    if(data.height){
      height.value = data.height;
    }else {
      height.value = '-';
    }

    //设置面积
    if(data.area){
      area.value = data.area;
    }else {
      area.value = '-';
    }

    // 设置病害描述
    description.value = data.description || '';
    
    // 处理图片数据
    if (data.images && Array.isArray(data.images)) {
      // 将图片URL数组转换为uni-file-picker所需的格式
      fileList.value = data.images.map((url, index) => {
        return {
          name: `图片${index + 1}`,
          url: url,
          extname: 'jpg', // 默认扩展名，也可以从URL中解析
          size: 0 // uni-file-picker需要但我们没有实际大小，设为0
        };
      });
    } else if (data.imageUrl) {
      // 如果是单个图片URL
      fileList.value = [{
        name: '图片1',
        url: data.imageUrl,
        size: 0
      }];
    }
		
		// 可以继续添加其他字段的填充逻辑
	};

	// 图片上传样式
	const imageStyles = reactive({
		width: '150rpx',
		height: '150rpx'
	});

	// 部件类型
	const type = ref([ 'T梁', '支座', '桥面','墩身','墩柱']);
	const typeindex = ref(-1);

	// 构件编号
	const num = ref(['1', '2', '3']);
	const numindex = ref(-1);

	// 缺损类型
	const Typeofdefect = ref(['空洞、孔洞', '剥落、掉角', '凹凸不平', '裂缝']);
	const Typeofdefectindex = ref(-1);

  // 缺损位置
  const position = ref('');

	// 缺损数量
	const NumofDefect = ref(1);

	// 数据记载方式
	const WayofDefect = ref(['数值', '记载方式2', '记载方式3']);
	const WayofDefectindex = ref(0);

  // 长度
  const length = ref('');

  //宽度
  const width = ref('');

  //缝宽
  const SeamWidth = ref('');

  //高度/深度
  const height = ref('');

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
		name: '是',
		value: '1'
	}, {
		name: '否',
		value: '2'
	}]);
	const ratingCurrent = ref(0);

	const beforedisease = () => {
		console.log('上一条');
	}
	const nextdisease = () => {
		console.log('下一条');
	}
	const savetonextdisease = () => {
		console.log('保存并复制到下一条');
	}
	const savedisease = () => {
		console.log('保存');
	}
	const canceldisease = () => {
		console.log('取消');
	}
	// 选择器选择事件
	// 部件类型选择事件
	const typePickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		typeindex.value = e.detail.value
	}
	// 部件编号选择事件
	const numberPickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		numindex.value = e.detail.value
	}
	// 缺损类型选择事件
	const TypeofdefectPickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		Typeofdefectindex.value = e.detail.value
	}
	// 数据记载方式选择事件
	const WayofDefectPickerChange = (e) => {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		WayofDefectindex.value = e.detail.value
	}

	// 编辑模式下的方法
	const deleteDisease = () => {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这条病害记录吗？',
			success: (res) => {
				if (res.confirm) {
					// 删除后返回上一页
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}
			}
		});
	}

	const copyAndAddDisease = () => {
		console.log('复制并新增');
		// 将编辑模式切换为新增模式
		isEdit.value = false;
	}

	const editDisease = () => {
		console.log('编辑');
	}

	const handleFileSelect = (e) => {
		console.log('文件选择事件', e);
	}

	const handleFileDelete = (e) => {
		console.log('文件删除事件', e);
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
</style>
<template>
	<view class="page-container">
		<!-- 顶部导航 -->
		<!-- <view class="nav-header">
      <view class="nav-left">
        <text class="back-icon" @click="goBack">←</text>
        <text class="nav-title">{{ bridgeInfo.name }}</text>
      </view>
    </view> -->

		<!-- 标签页导航 -->
		<view class="tab-nav">
			<view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', currentTab === index ? 'active' : '']"
				@click="switchTab(index)">
				{{ tab }}
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view scroll-y class="content-area">
			<!-- 历史病害区域 -->
			<view v-if="currentTab === 0" class="disease-section">
				<view class="section-header">
					<text class="section-title">历史病害</text>
				</view>
				<view class="disease-content">
					<view class="disease-list">
						<view v-for="(disease, index) in historyDiseases" :key="index" class="disease-item">
							<view class="disease-info">
								<view class="disease-header">
									<text class="disease-type">{{ disease.type }}</text>
									<text class="disease-location">{{ disease.location }}</text>
								</view>
								<text class="disease-description">{{ disease.description }}</text>
								<view class="disease-dates">
									<text class="disease-date">记录时间: {{ disease.date }}</text>
									<text class="disease-date">转入时间: {{ disease.movedDate }}</text>
								</view>
							</view>
							<image v-if="disease.photoUrl" :src="disease.photoUrl" mode="aspectFill"
								class="disease-photo" @click="previewImage(disease.photoUrl)"></image>
						</view>
					</view>
				</view>
			</view>

			<!-- 当前病害区域 -->
			<view v-if="currentTab === 1" class="disease-section">
				<view class="section-header">
					<text class="section-title">当前病害</text>
					<view class="header-right">
						<text class="add-btn" @click="handleAddDisease">添加病害</text>
					</view>
				</view>
				<view class="disease-content">
					<!-- 添加病害表单 -->
					<view v-if="showDiseaseForm" class="disease-form">
						<view class="form-row">
							<text class="form-label">病害类型：</text>
							<picker class="form-picker" :range="diseaseTypes" @change="handleDiseaseTypeChange">
								<view class="picker-text">{{ diseaseForm.type || '请选择病害类型' }}</view>
							</picker>
						</view>
						<view class="form-row">
							<text class="form-label">病害位置：</text>
							<picker class="form-picker" :range="diseaseLocations" @change="handleLocationChange">
								<view class="picker-text">{{ diseaseForm.location || '请选择病害位置' }}</view>
							</picker>
						</view>
						<view class="form-row">
							<text class="form-label">病害描述：</text>
							<textarea class="form-textarea" v-model="diseaseForm.description"
								placeholder="请输入病害描述"></textarea>
						</view>
						<view class="form-row">
							<text class="form-label">拍摄照片：</text>
							<view class="form-photo">
								<view class="photo-preview" v-if="diseaseForm.photoUrl">
									<image :src="diseaseForm.photoUrl" mode="aspectFill" class="preview-img"></image>
									<text class="retake-btn" @click="takeDiseasePhoto">重拍</text>
								</view>
								<view v-else class="take-photo-btn" @click="takeDiseasePhoto">
									<text class="camera-icon">📸</text>
									<text class="camera-text">拍照</text>
								</view>
							</view>
						</view>
						<view class="form-buttons">
							<text class="cancel-btn" @click="cancelDiseaseForm">取消</text>
							<text class="submit-btn" @click="submitDiseaseForm">提交</text>
						</view>
					</view>

					<!-- 病害列表 -->
					<view v-else class="disease-list">
						<view v-for="(disease, index) in currentDiseases" :key="index" class="disease-item">
							<view class="disease-info">
								<view class="disease-header">
									<text class="disease-type">{{ disease.type }}</text>
									<text class="disease-location">{{ disease.location }}</text>
								</view>
								<text class="disease-description">{{ disease.description }}</text>
								<text class="disease-date">记录时间: {{ disease.date }}</text>
							</view>
							<view class="disease-actions">
								<image v-if="disease.photoUrl" :src="disease.photoUrl" mode="aspectFill"
									class="disease-photo" @click="previewImage(disease.photoUrl)"></image>
								<text class="move-btn" @click="moveToHistory(index)">移至历史</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 图片信息区域 -->
			<view v-if="currentTab === 3" class="image-section">
				<view class="section-header">
					<text class="section-title">图片信息</text>
					<view class="header-right">
						<text class="take-all-btn" @click="takeAllPhotos">一键拍照</text>
					</view>
				</view>
				<view class="image-grid">
					<view class="image-item" v-for="(item, index) in imageItems" :key="index">
						<view class="image-content" @click="handlePhotoClick(index)">
							<template v-if="!item.photoUrl">
								<view class="camera-button">
									<text class="camera-icon">📸</text>
									<text class="camera-text">拍照</text>
								</view>
							</template>
							<image v-else :src="item.photoUrl" class="preview-image" mode="aspectFill"></image>
						</view>
						<view class="image-footer">
							<text class="image-label">{{ item.label }}</text>
							<text v-if="item.photoUrl" class="retake-btn" @click="takePhoto(index)">重拍</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 基础信息区域 -->
			<view v-if="currentTab === 2" class="info-section">
				<view class="section-header">
					<text class="section-title">基础信息</text>
					<view class="header-right">
						<text class="save-btn" @click="handleSaveUpload">保存上传</text>
					</view>
				</view>
				<view class="info-content">
					<view class="info-row">
						<text class="info-label">桥台是否采用片石砌筑：</text>
						<checkbox class="info-checkbox"></checkbox>
					</view>
					<view class="info-row">
						<text class="info-label">桥梁桩号（数值）：</text>
						<text class="info-value">166</text>
						<text class="edit-btn">编辑</text>
					</view>
					<view class="info-row">
						<text class="info-label">左右幅桥：</text>
						<text class="info-value">匝道桥</text>
					</view>
					<view class="info-row">
						<text class="info-label">结构形式：</text>
						<text class="info-value">空心板梁</text>
					</view>
					<view class="info-row">
						<text class="info-label">孔径组合：</text>
						<text class="info-value">1-10</text>
					</view>
					<view class="info-row">
						<text class="info-label">桥面铺装：</text>
						<text class="info-value">水泥混凝土</text>
					</view>
					<view class="info-row">
						<text class="info-label">伸缩装置：</text>
						<text class="info-value">无伸缩缝</text>
					</view>
					<view class="info-row">
						<text class="info-label">支座形式：</text>
						<text class="info-value">板式橡胶支座</text>
					</view>
					<view class="info-row">
						<text class="info-label">下部结构：</text>
						<text class="info-value">薄壁式桥台 + 灌注桩基础</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'

	// 响应式状态
	const currentTab = ref(0)
	const bridgeInfo = reactive({
		name: '',
		code: '',
		range: '',
		combination: '',
		length: '',
		baseName: ''
	})

	const tabs = ['历史病害', '当前病害', '详情', '状况照']

	const imageItems = ref([{
			label: '左幅立面',
			photoUrl: '',
			required: true
		},
		{
			label: '右幅立面',
			photoUrl: '',
			required: true
		},
		{
			label: '左幅桥面',
			photoUrl: '',
			required: true
		},
		{
			label: '右幅桥面',
			photoUrl: '',
			required: true
		},
		{
			label: '桥底',
			photoUrl: '',
			required: true
		}
	])

	const showDiseaseForm = ref(false)
	const diseaseForm = reactive({
		type: '',
		location: '',
		description: '',
		photoUrl: '',
		date: ''
	})

	const diseaseTypes = ['裂缝', '破损', '渗水', '锈蚀', '其他']
	const diseaseLocations = ['桥面', '桥墩', '桥台', '护栏', '其他']
	const currentDiseases = ref([])
	const historyDiseases = ref([])

	// 生命周期钩子
	onMounted(() => {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const options = currentPage.$page.options

		if (options.tab) {
			currentTab.value = parseInt(options.tab)
		}
		if (options.bridgeInfo) {
			const info = JSON.parse(decodeURIComponent(options.bridgeInfo))
			bridgeInfo.name = info.name || ''
			bridgeInfo.code = info.code || ''
			bridgeInfo.range = info.range || ''
			bridgeInfo.combination = info.combination || ''
			bridgeInfo.length = info.length || ''
			bridgeInfo.baseName = info.baseName || ''

			// 从本地存储加载病害数据
			const storageKey = `bridge_diseases_${bridgeInfo.baseName}`
			const storedDiseases = uni.getStorageSync(storageKey)
			if (storedDiseases) {
				try {
					const {
						current,
						history
					} = JSON.parse(storedDiseases)
					currentDiseases.value = current || []
					historyDiseases.value = history || []
				} catch (e) {
					currentDiseases.value = []
					historyDiseases.value = []
				}
			}

			uni.setNavigationBarTitle({
				title: bridgeInfo.name
			})
		}
	})

	// 方法
	const goBack = () => {
		uni.navigateBack()
	}

	const switchTab = (index) => {
		currentTab.value = index
	}

	const handlePhotoClick = (index) => {
		if (imageItems.value[index].photoUrl) {
			// 如果已有照片，预览
			previewImage(imageItems.value[index].photoUrl)
		} else {
			// 如果没有照片，拍照
			takePhoto(index)
		}
	}

	const takePhoto = (index) => {
		uni.chooseImage({
			count: 1,
			sourceType: ['camera'],
			success: (res) => {
				imageItems.value[index].photoUrl = res.tempFilePaths[0]
				uni.showToast({
					title: '拍照成功',
					icon: 'success'
				})
			},
			fail: () => {
				uni.showToast({
					title: '拍照失败',
					icon: 'none'
				})
			}
		})
	}

	const previewImage = (url) => {
		const urls = imageItems.value
			.map(item => item.photoUrl)
			.filter(url => url !== '')
		uni.previewImage({
			current: url,
			urls: urls
		})
	}

	const takeAllPhotos = () => {
		const unfinishedItems = imageItems.value.filter(item => !item.photoUrl)
		if (unfinishedItems.length === 0) {
			uni.showToast({
				title: '所有照片已完成',
				icon: 'success'
			})
			return
		}

		uni.showModal({
			title: '一键拍照',
			content: '将依次拍摄所有未拍摄的照片，是否继续？',
			success: (res) => {
				if (res.confirm) {
					startBatchPhotos()
				}
			}
		})
	}

	const startBatchPhotos = () => {
		const takeNext = (index) => {
			if (index >= imageItems.value.length) {
				uni.showToast({
					title: '全部拍照完成',
					icon: 'success'
				})
				return
			}

			if (imageItems.value[index].photoUrl) {
				takeNext(index + 1)
				return
			}

			uni.showModal({
				title: '拍照提示',
				content: `请拍摄${imageItems.value[index].label}`,
				showCancel: true,
				success: (res) => {
					if (res.confirm) {
						takePhoto(index)
						setTimeout(() => takeNext(index + 1), 1000)
					}
				}
			})
		}

		takeNext(0)
	}

	const handleSaveUpload = () => {
		const unfinishedItems = imageItems.value.filter(item => !item.photoUrl)
		const hasUnfinishedPhotos = unfinishedItems.length > 0

		let warningMessage = ''
		if (hasUnfinishedPhotos) {
			warningMessage = ''
		}

		if (warningMessage) {
			uni.showModal({
				title: '提示',
				content: `${warningMessage}，是否继续保存上传？`,
				success: (res) => {
					if (res.confirm) {
						saveAndUpload()
					}
				}
			})
		} else {
			saveAndUpload()
		}
	}

	const saveAndUpload = () => {
		uni.showLoading({
			title: '保存上传中...'
		})

		const uploadData = {
			basicInfo: {
				bridgeNumber: '166',
				bridgeType: '匝道桥',
				structure: '空心板梁',
				spanCombination: '1-10',
				deckPavement: '水泥混凝土',
				expansionJoint: '无伸缩缝',
				bearing: '板式橡胶支座',
				substructure: '薄壁式桥台 + 灌注桩基础',
				stoneAbutment: false
			},
			photos: imageItems.value.map(item => ({
				label: item.label,
				photoUrl: item.photoUrl || ''
			}))
		}

		setTimeout(() => {
			console.log('上传的数据：', uploadData)
			uni.hideLoading()
			uni.showToast({
				title: '保存上传成功',
				icon: 'success',
				duration: 2000
			})
		}, 1500)
	}

	const handleAddDisease = () => {
		showDiseaseForm.value = true
		Object.assign(diseaseForm, {
			type: '',
			location: '',
			description: '',
			photoUrl: '',
			date: ''
		})
	}

	const handleDiseaseTypeChange = (e) => {
		diseaseForm.type = diseaseTypes[e.detail.value]
	}

	const handleLocationChange = (e) => {
		diseaseForm.location = diseaseLocations[e.detail.value]
	}

	const takeDiseasePhoto = () => {
		uni.chooseImage({
			count: 1,
			sourceType: ['camera'],
			success: (res) => {
				diseaseForm.photoUrl = res.tempFilePaths[0]
				uni.showToast({
					title: '拍照成功',
					icon: 'success'
				})
			},
			fail: () => {
				uni.showToast({
					title: '拍照失败',
					icon: 'none'
				})
			}
		})
	}

	const cancelDiseaseForm = () => {
		showDiseaseForm.value = false
	}

	const submitDiseaseForm = () => {
		if (!diseaseForm.type || !diseaseForm.location) {
			uni.showToast({
				title: '请填写必要信息',
				icon: 'none'
			})
			return
		}

		const newDisease = {
			...diseaseForm,
			date: new Date().toLocaleString()
		}

		// 将新病害添加到当前病害列表的开头
		currentDiseases.value.unshift(newDisease)

		// 保存到本地存储
		const storageKey = `bridge_diseases_${bridgeInfo.baseName}`
		uni.setStorageSync(storageKey, JSON.stringify({
			current: currentDiseases.value,
			history: historyDiseases.value
		}))

		showDiseaseForm.value = false
		uni.showToast({
			title: '添加成功',
			icon: 'success'
		})
	}

	// 添加移动到历史记录的方法
	const moveToHistory = (index) => {
		const disease = currentDiseases.value[index]
		const diseaseWithDate = {
			...disease,
			movedDate: new Date().toLocaleString()
		}

		// 添加到历史记录
		historyDiseases.value.unshift(diseaseWithDate)
		// 从当前病害中移除
		currentDiseases.value.splice(index, 1)

		// 保存到本地存储
		const storageKey = `bridge_diseases_${bridgeInfo.baseName}`
		uni.setStorageSync(storageKey, JSON.stringify({
			current: currentDiseases.value,
			history: historyDiseases.value
		}))

		uni.showToast({
			title: '已移至历史记录',
			icon: 'success'
		})
	}

	// 导出方法供模板使用
	defineExpose({
		goBack,
		switchTab,
		handlePhotoClick,
		takePhoto,
		previewImage,
		takeAllPhotos,
		handleSaveUpload,
		handleAddDisease,
		handleDiseaseTypeChange,
		handleLocationChange,
		takeDiseasePhoto,
		cancelDiseaseForm,
		submitDiseaseForm,
		moveToHistory
	})
</script>

<style>
	.page-container {
		height: calc(100vh - var(--window-top));
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
	}

	.nav-header {
		background-color: #2e8b57;
		height: 88rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
	}

	.nav-left {
		display: flex;
		align-items: center;
	}

	.back-icon {
		color: white;
		font-size: 44rpx;
		padding: 10rpx;
	}

	.nav-title {
		color: white;
		font-size: 32rpx;
		margin-left: 20rpx;
	}

	.tab-nav {
		display: flex;
		background-color: white;
		border-bottom: 1px solid #eee;
		position: fixed;
		/* top: 88rpx; */
		left: 0;
		right: 0;
		z-index: 99;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;
		position: relative;
		min-width: 140rpx;
	}

	.tab-item.active {
		color: #2e8b57;
		position: relative;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #2e8b57;
	}

	.content-area {
		flex: 1;
		background-color: #f5f5f5;
		margin-top: 80rpx;
		/* nav-header + tab-nav 的高度总和 */
		height: calc(100vh - 120rpx);
		box-sizing: border-box;
	}

	.image-section {
		padding: 20rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.header-right {
		display: flex;
		gap: 20rpx;
		align-items: center;
	}

	.save-btn {
		font-size: 26rpx;
		color: #2e8b57;
		padding: 8rpx 16rpx;
	}

	.take-all-btn {
		font-size: 26rpx;
		color: #2e8b57;
		padding: 8rpx 16rpx;
	}

	.section-title {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 16rpx;
	}

	.image-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.image-item {
		width: calc((100% - 40rpx) / 3);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.image-content {
		width: 100%;
		aspect-ratio: 1;
		margin-bottom: 10rpx;
	}

	.camera-button {
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
		border: 1px dashed #ddd;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.camera-icon {
		font-size: 36rpx;
		margin-bottom: 8rpx;
	}

	.camera-text {
		font-size: 24rpx;
		color: #666;
	}

	.preview-image {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
		transition: all 0.2s;
	}

	.preview-image:active {
		opacity: 0.8;
		transform: scale(0.98);
	}

	.image-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.retake-btn {
		font-size: 24rpx;
		color: #2e8b57;
		padding: 4rpx 12rpx;
		border: 1px solid #2e8b57;
		border-radius: 4rpx;
		transition: all 0.2s;
	}

	.retake-btn:active {
		background-color: #2e8b57;
		color: white;
		opacity: 0.8;
	}

	.info-section {
		background-color: white;
		border-radius: 8rpx;
		padding: 20rpx;
		margin: 20rpx;
	}

	.info-content {
		padding: 0 20rpx;
	}

	.info-row {
		display: flex;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 1px solid #eee;
	}

	.info-label {
		font-size: 26rpx;
		color: #666;
		flex-shrink: 0;
		width: 240rpx;
	}

	.info-value {
		font-size: 26rpx;
		color: #333;
		flex: 1;
	}

	.info-checkbox {
		transform: scale(0.8);
	}

	.edit-btn {
		margin-left: auto;
		color: #2e8b57;
		font-size: 28rpx;
	}

	.disease-section {
		padding: 20rpx;
	}

	.add-btn {
		font-size: 26rpx;
		color: #2e8b57;
		padding: 8rpx 16rpx;
		border: 1px solid #2e8b57;
		border-radius: 4rpx;
		transition: all 0.2s;
	}

	.add-btn:active {
		background-color: #2e8b57;
		color: white;
		opacity: 0.8;
	}

	.disease-content {
		background-color: white;
		border-radius: 8rpx;
		padding: 20rpx;
		margin-top: 20rpx;
	}

	.disease-form {
		background-color: white;
		border-radius: 8rpx;
		padding: 20rpx;
	}

	.form-row {
		margin-bottom: 20rpx;
	}

	.form-label {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.form-picker {
		border: 1px solid #eee;
		border-radius: 4rpx;
		padding: 12rpx;
	}

	.picker-text {
		font-size: 26rpx;
		color: #333;
	}

	.form-textarea {
		width: 100%;
		height: 160rpx;
		border: 1px solid #eee;
		border-radius: 4rpx;
		padding: 12rpx;
		font-size: 26rpx;
	}

	.form-photo {
		width: 200rpx;
		height: 200rpx;
	}

	.take-photo-btn {
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
		border: 1px dashed #ddd;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.photo-preview {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.preview-img {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}

	.form-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		margin-top: 30rpx;
	}

	.cancel-btn,
	.submit-btn {
		font-size: 26rpx;
		padding: 8rpx 24rpx;
		border-radius: 4rpx;
	}

	.cancel-btn {
		color: #666;
		border: 1px solid #ddd;
	}

	.submit-btn {
		color: white;
		background-color: #2e8b57;
	}

	.disease-list {
		margin-top: 20rpx;
	}

	.disease-item {
		display: flex;
		padding: 20rpx;
		border-bottom: 1px solid #eee;
		gap: 20rpx;
	}

	.disease-info {
		flex: 1;
	}

	.disease-header {
		display: flex;
		gap: 20rpx;
		margin-bottom: 10rpx;
	}

	.disease-type {
		color: #2e8b57;
		font-size: 26rpx;
	}

	.disease-location {
		color: #666;
		font-size: 26rpx;
	}

	.disease-description {
		font-size: 26rpx;
		color: #333;
		line-height: 1.4;
	}

	.disease-photo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 4rpx;
	}

	.disease-dates {
		margin-top: 10rpx;
	}

	.disease-date {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-top: 4rpx;
	}

	.disease-photo:active {
		opacity: 0.8;
	}

	.disease-actions {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.move-btn {
		font-size: 26rpx;
		color: #2e8b57;
		padding: 8rpx 16rpx;
		border: 1px solid #2e8b57;
		border-radius: 4rpx;
		transition: all 0.2s;
	}

	.move-btn:active {
		background-color: #2e8b57;
		color: white;
		opacity: 0.8;
	}
</style>
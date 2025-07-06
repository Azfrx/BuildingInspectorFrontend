<template>
	<view class = 'container'>
		<!-- 状态栏 -->
		<view class="confirm-row">
			<span class="confirm-text">结构信息状态：</span>
			<span class="confirm-status"
				:style="{color: Number(structureData?.Iscommit) === true ? '#f56c6c': '#333'}">
				{{ Number(structureData?.Iscommit) === 3 ? '已提交': '未提交'}}
			</span>
		</view>
		
		<view class="content-layout">
			<!-- 第一级目录 -->
			<view class="sidebar">
				<view v-for="(item, index) in structureData?.children || []" :key="index"
					:class="['sidebar-item', selectedIndex === index ? 'active' : '']" @click="changeTab(index)">
					<view class="treeName sidebar-item-content">
						<image v-if="hasPhotos(item)" src="@/static/image/yes.png" class="menu-icon"></image>
						{{item.name || '未命名'}}
					</view>
				</view>
			</view>
			
			<!-- 第二级目录 -->
			<view class="sidebar second-sidebar">
				<view v-if="secondLevelItems.length > 0">
					<view v-for="(item, index) in secondLevelItems" :key="index"
						:class="['sidebar-item', selectedSecondIndex === index ? 'active' : '']"
						@click="changeSecondTab(index)">
						<view class="treeName sidebar-item-content">
							<image v-if="hasPhotos(item)" src="@/static/image/yes.png" class="menu-icon"></image>
							{{item.name || '未命名'}}
						</view>
					</view>
				</view>
				<view v-else class="no-data-tip">
					不存在第二层数据
				</view>
			</view>
			
			<!-- 第三层照片层 -->
			<view class="photo">
				<my-file-picker class="file-picker" :image-styles="imageStyles" v-model="currentPhotos"
					file-mediatype="image" mode="grid" @select="photoSelect" :auto-upload="false" @delete="deletePhoto"
					@success="onUploadSuccess"></my-file-picker>
			</view>
		</view>
		
		<!-- 弹窗 -->
		<view v-if="show" class="popup-overlay">
		    <view class="edit-popup-content">
		      <view class="popup-title">照片序号</view>
		
		      <view class="edit-row">
		        <text class="edit-label">结构部位</text>
		        <text class="edit-value">{{ structureData?.children?.[selectedIndex]?.name || '未选中' }}</text>
		      </view>
		
		      <view class="edit-row">
		        <text class="edit-label">结构名称</text>
		        <text class="edit-value">{{ secondLevelItems?.[selectedSecondIndex]?.name || '未选中' }}</text>
		      </view>
		
		      <view class="edit-row">
		        <text class="edit-label">照片序号</text>
		        <view class="input-container">
		          <textarea
		            class="hand-input"
		            v-model="photoNumber"
		            :placeholder="'请输入照片序号'"
		            auto-height
		          />
		          <image src="@/static/image/No.png" class="input-icon" @click.stop="clearInput"></image>
		        </view>
		      </view>
		
		      <view class="popup-buttons">
		        <view class="btn cancel-btn" @click="cancel">取消</view>
		        <view class="btn confirm-btn" @click="confirm">确定</view>
		      </view>
		    </view>
		  </view>
	</view>
</template>

<script setup>
import {
		ref,
		computed,
		onMounted,
		watch,
		reactive
	} from 'vue';
import { getObject } from '../utils/readJsonNew';
import {
	userStore
} from '@/store/index.js'
import {setObject}  from '../utils/writeNew'
import myFilePicker from '@/components/myFilePicker/myFilePicker.vue';
//桥梁id
const TaskBridgeId = ref(0)
const structureData = ref(null);
const userInfo = userStore()
const selectedIndex = ref(0);
const selectedSecondIndex = ref(0);
const frontLeft = ref([]);
// 检查照片数据结构是否符合myFilePicker组件的要求，并修复图片URL
const ensureValidPhotoStructure = (photos) => {
	if (!Array.isArray(photos)) return [];
	
	return photos.map(photo => {
		// 确保每个照片对象都有必要的属性
		if (typeof photo !== 'object') return null;
		
		// 检查URL是否有效
		let url = photo.url || '';
		
		// 如果URL是相对路径，可能需要添加基础路径
		if (url && !url.startsWith('http') && !url.startsWith('file://') && !url.startsWith('data:')) {
			// 检查是否是本地临时文件路径
			if (!url.startsWith('/')) {
				url = '/' + url;
			}
			console.log('处理图片URL:', url);
		}
		
		return {
			name: photo.name || 'photo.jpg',
			url: url,
			extname: photo.extname || 'jpg',
			// 添加其他可能需要的属性
		};
	}).filter(photo => photo !== null);
};

// 当前选中项的照片集合
const currentPhotos = computed({
	get: () => {
		console.log('获取currentPhotos...');
		// 如果没有选中项，返回空数组
		if (!structureData.value || !structureData.value.children) {
			console.log('structureData为空或没有children属性');
			return [];
		}
		
		// 获取当前选中的第一级和第二级项
		const firstLevelItem = structureData.value.children[selectedIndex.value];
		if (!firstLevelItem || !firstLevelItem.children) {
			console.log('一级菜单项不存在或没有children属性');
			return [];
		}
		
		const secondLevelItem = firstLevelItem.children[selectedSecondIndex.value];
		if (!secondLevelItem) {
			console.log('二级菜单项不存在');
			return [];
		}
		
		// 如果没有photos属性，初始化为空数组
		if (!secondLevelItem.photos) {
			console.log('二级菜单项没有photos属性，初始化为空数组');
			secondLevelItem.photos = [];
		}
		
		// 确保照片数据结构正确
		const validPhotos = ensureValidPhotoStructure(secondLevelItem.photos);
		console.log('当前有效照片数组:', validPhotos);
		return validPhotos;
	},
	set: (newValue) => {
		console.log('设置currentPhotos:', newValue);
		if (!structureData.value || !structureData.value.children) return;
		
		const firstLevelItem = structureData.value.children[selectedIndex.value];
		if (!firstLevelItem || !firstLevelItem.children) return;
		
		const secondLevelItem = firstLevelItem.children[selectedSecondIndex.value];
		if (!secondLevelItem) return;
		
		// 确保照片数据结构正确
		secondLevelItem.photos = ensureValidPhotoStructure(newValue);
		
		// 强制更新structureData，确保Vue能检测到变化
		structureData.value = JSON.parse(JSON.stringify(structureData.value));
		
		// 自动保存更改
		autoSavePhotos();
	}
});
// 弹窗相关状态
const show = ref(false);
const photoNumber = ref('');
// 图片上传样式
const imageStyles = reactive({
	width: '200rpx',
	height: '200rpx'
});

// 添加缺失的函数
const getFrontPhoto = async (username, buildingId) => {
  // 这里需要实现获取照片的逻辑
  console.log('获取照片', username, buildingId);
  return {}; // 返回空对象作为临时实现
};

const readBridgeImage = (username, buildingId, images) => {
  // 这里需要实现读取桥梁图片的逻辑
  console.log('读取桥梁图片', username, buildingId, images);
  return []; // 返回空数组作为临时实现
};

const removeDiseaseImage = async (paths) => {
  // 这里需要实现删除图片的逻辑
  console.log('删除图片', paths);
};

const setFrontPhoto = async (username, buildingId, data) => {
  // 这里需要实现设置照片的逻辑
  console.log('设置照片', username, buildingId, data);
};

// 添加缺失的变量
const idStorageInfo = {
  buildingId: TaskBridgeId
};

const createPhotoDate = async () => {
  // 这里需要实现创建照片数据的逻辑
  console.log('创建照片数据');
  return {}; // 返回空对象作为临时实现
};

const autoSavePhotos = async () => {
	try {
		// 保存照片数据到存储
		await setObject(userInfo.username, TaskBridgeId.value, structureData.value);
		console.log('照片数据已保存');
	} catch (error) {
		console.error('保存照片数据失败:', error);
		uni.showToast({
			title: '保存失败',
			icon: 'error',
			duration: 1500
		});
	}
};

const deletePhoto = async (index) => {
	// 获取当前选中的第一级和第二级项
	const firstLevelItem = structureData.value.children[selectedIndex.value];
	if (!firstLevelItem || !firstLevelItem.children) {
		return;
	}
	
	const secondLevelItem = firstLevelItem.children[selectedSecondIndex.value];
	if (!secondLevelItem || !secondLevelItem.photos) {
		return;
	}
	
	// 删除指定索引的照片
	const deletedPhoto = secondLevelItem.photos[index];
	if (deletedPhoto) {
		// 如果需要从存储中删除照片文件，可以在这里添加相关代码
		secondLevelItem.photos.splice(index, 1);
		
		// 强制更新structureData，确保Vue能检测到变化
		structureData.value = JSON.parse(JSON.stringify(structureData.value));
		
		// 自动保存更改
		await autoSavePhotos();
		
		// 显示删除成功提示
		uni.showToast({
			title: '删除成功',
			icon: 'success',
			duration: 1500
		});
	}
};

const onUploadSuccess = async () => {
	console.log('上传成功');

	// 自动保存更改
	await autoSavePhotos();

	uni.showToast({
		title: '保存成功',
		icon: 'success',
		duration: 1500
	});
};

// 添加图片加载错误处理
const handleImageError = (e) => {
	console.error('图片加载失败:', e);
	uni.showToast({
		title: '图片加载失败',
		icon: 'none',
		duration: 2000
	});
};

// 修改photoSelect函数，确保正确处理图片URL
const photoSelect = async (e) => {
	if (e && e.tempFiles && e.tempFiles.length > 0) {
		console.log('选择的文件数量:', e.tempFiles.length);
		
		// 获取当前选中的第一级和第二级项
		const firstLevelItem = structureData.value.children[selectedIndex.value];
		if (!firstLevelItem || !firstLevelItem.children) {
			console.error('一级菜单项不存在或没有children属性');
			return;
		}
		
		const secondLevelItem = firstLevelItem.children[selectedSecondIndex.value];
		if (!secondLevelItem) {
			console.error('二级菜单项不存在');
			return;
		}
		
		// 如果没有photos属性，初始化为空数组
		if (!secondLevelItem.photos) {
			secondLevelItem.photos = [];
		}
		
		// 将新选择的照片添加到当前选中项的photos数组中
		const newPhotos = e.tempFiles.map(file => {
			// 确保获取正确的图片URL
			const url = file.url || file.path || (file.file && file.file.path) ||
				(file.image && file.image.location) || file.tempFilePath;
			
			console.log('新照片URL:', url);
			
			return {
				name: file.name || 'photo.jpg',
				url: url,
				extname: file.extname || 'jpg',
			};
		});
		
		console.log('新添加的照片:', newPhotos);
		secondLevelItem.photos = [...(secondLevelItem.photos || []), ...newPhotos];
		console.log('添加照片后的数组:', secondLevelItem.photos);
		
		// 强制更新structureData，确保Vue能检测到变化
		structureData.value = JSON.parse(JSON.stringify(structureData.value));

		// 选择图片后自动保存
		await autoSavePhotos();
	}
};

// 添加hasPhotos函数来检查菜单项是否有照片
const hasPhotos = (item) => {
	// 检查该项是否有照片
	if (item.photos && item.photos.length > 0) {
		return true;
	}
	
	// 如果是一级菜单项，检查其子项是否有照片
	if (item.children && item.children.length > 0) {
		return item.children.some(child => hasPhotos(child));
	}
	
	return false;
};

// 通过计算属性获取URL中的bridgeId参数
const bridgeIdFromURL = computed(() => {
	const pages = getCurrentPages();
	if (pages.length > 0) {
		const currentPage = pages[pages.length - 1];
		const options = currentPage.$page?.options;

		if (options && options.bridgeId) {
			return options.bridgeId;
		}
	}
	return 0; // 默认值
});
// 在初始化时清空所有照片记录
const init = async () => {
	console.log('=== init 函数开始执行 ===');
	
	// 确保TaskBridgeId已经从URL参数中获取
	if (bridgeIdFromURL.value) {
		TaskBridgeId.value = bridgeIdFromURL.value;
	}
	
	try {
		// 获取最新数据
		const latestData = await getObject(userInfo.username, TaskBridgeId.value);
		
		// 清空所有照片记录
		if (latestData && latestData.children) {
			latestData.children.forEach(firstLevel => {
				if (firstLevel.children) {
					firstLevel.children.forEach(secondLevel => {
						// 清空照片数组
						secondLevel.photos = [];
					});
				}
			});
			console.log('已清空所有照片记录');
		}
		
		structureData.value = latestData;
		structureData.value.Iscommit = false;
		console.log("现状照数据 ", structureData.value);
		
		// 保存清空后的数据
		await autoSavePhotos();
	} catch (error) {
		console.error('获取数据失败:', error);
		uni.showToast({
			title: '数据加载失败',
			icon: 'error',
			duration: 1500
		});
	}
};
// 修改切换标签的函数，确保加载最新数据
const changeTab = async (index) => {
	selectedIndex.value = index;
	selectedSecondIndex.value = 0; // 重置第二个侧边栏的选中状态

	// 添加防御性检查
	const firstLevelItem = structureData.value?.children?.[index];
	if (firstLevelItem) {
		console.log('选中的第一层结构:', firstLevelItem.name);
	} else {
		console.log('选中的第一层结构不存在或数据结构有问题');
	}
};
// 计算第二个侧边栏的数据
	const secondLevelItems = computed(() => {
		if (!structureData.value?.children?.[selectedIndex.value]?.children) {
			return [];
		}
		return structureData.value.children[selectedIndex.value].children;
	});

	// 计算第三个侧边栏的数据
	const thirdLevelItems = computed(() => {
		// 检查第二层选中项是否存在且有children属性
		if (!secondLevelItems.value?.[selectedSecondIndex.value]?.children) {
			return [];
		}
		return secondLevelItems.value[selectedSecondIndex.value].children;
	});
	const changeSecondTab = async (index) => {
		selectedSecondIndex.value = index;

		// 添加防御性检查
		const secondLevelItem = secondLevelItems.value?.[index];
		if (secondLevelItem) {
			console.log('选中的第二层结构:', secondLevelItem.name);
			// 检查是否有第三层数据
			if (!secondLevelItem.children || secondLevelItem.children.length === 0) {
				console.log('该第二层结构没有第三层数据');
			}
		} else {
			console.log('选中的第二层结构不存在或数据结构有问题');
		}
	};
onMounted(async () => {
	console.log('初始bridgeId:', bridgeIdFromURL.value);
	// 先确认URL参数是否已获取
	if (bridgeIdFromURL.value) {
		TaskBridgeId.value = bridgeIdFromURL.value;
	}
	await init();
	
	// 初始化后打印数据结构
	console.log('初始化后的structureData:', JSON.stringify(structureData.value));
	
	// 检查当前选中项是否有照片
	if (structureData.value && structureData.value.children && 
		structureData.value.children[selectedIndex.value] && 
		structureData.value.children[selectedIndex.value].children && 
		structureData.value.children[selectedIndex.value].children[selectedSecondIndex.value]) {
		
		const currentItem = structureData.value.children[selectedIndex.value].children[selectedSecondIndex.value];
		console.log('当前选中项:', currentItem);
		console.log('当前选中项的照片:', currentItem.photos);
	}
});

// 打开弹窗
const dowindow = () => {
  show.value = true;
  photoNumber.value = ''; // 清空输入
};

// 取消弹窗
const cancel = () => {
  show.value = false;
};

// 确认弹窗
const confirm = () => {
  if (photoNumber.value.trim()) {
    console.log('确认照片序号:', photoNumber.value);
    // 这里可以添加保存序号的逻辑
  }
  show.value = false;
};

// 清空输入框
const clearInput = () => {
  photoNumber.value = ''; // 清空数据
};


const props = defineProps({
  activeTabTop: {
    type: Number,
    default: 0
  }
});

watch(() => props.activeTabTop, (newval, oldval) => {
  if (newval == 5) {
    console.log('当前activeTabTop为：', newval) // 使用newval而不是activeTabTop
    //Todo 调用初始化方法

  }
})
</script>

<style scoped>
.active {
		position: relative;
	}
	
	.active::before {
		content: '';
		position: absolute;
		left: 0;
		top: 17%; /* 从上往下1/3处开始 */
		height: 66%; /* 高度为总高度的1/3 */
		width: 3rpx;
		background-color: #0F4687;
	}
	
	.active .treeName {
		color: #0F4687 !important; /* 选中项文字颜色 */
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	.content-layout {
		height: 100%;
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	.confirm-row {
		width: 100%;
		background-color: #BDCBE0;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 10rpx;
		box-sizing: border-box;
	}
	
	.confirm-text {
		text-align: center;
		font-size: 20px;
		color: #333;
	}
	
	.confirm-status {
		text-align: center;
		font-size: 20px;
	}
	.sidebar-item {
		padding: 24rpx 0;
		text-align: left;
		color: #666;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 40rpx;
		justify-content: center;
		position: relative;
	}
	
	.sidebar-item-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 12rpx;
		width: 100%; /* 增加宽度，避免内容被挤压 */
		overflow: hidden; /* 超出部分隐藏 */
	}
	/* 侧边栏样式 */
	.sidebar {
		width: 127rpx; /* 从原来的190rpx缩短为2/3 */
		background-color: #f5f5f5;
		border-right: 1rpx solid #eeeeee;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.second-sidebar {
		background-color: #fafafa;
		width: 127rpx; /* 从原来的190rpx缩短为2/3 */
	}
	
	.treeName {
		margin-left: 5rpx;
		font-size: 15rpx;
		white-space: nowrap; /* 防止文本换行 */
		overflow: hidden; /* 超出部分隐藏 */
		text-overflow: ellipsis; /* 超出部分显示省略号 */
		flex: 1; /* 占据剩余空间 */
	}
	/* 添加无数据提示样式 */
	.no-data-tip {
		padding: 30rpx;
		text-align: center;
		color: #999;
		font-size: 24rpx;
	}
	
	/* 菜单图标样式 */
	.menu-icon {
		width: 15rpx;
		height: 15rpx;
		margin-right: 5rpx;
		flex-shrink: 0; /* 防止图标被压缩 */
	}
	
	/* 弹窗样式 */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
	
	.edit-popup-content {
		background-color: #fff;
		padding: 0;
		width: 500rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}
	
	.popup-title {
		font-size: 20rpx;
		text-align: center;
		color: #333;
		background-color: #BDCBE0;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.edit-row {
		display: flex;
		align-items: center;
		margin: 20rpx 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #eee;
	}
	
	.edit-row:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}
	
	.edit-label {
		font-size: 20rpx;
		color: #666;
		width: 150rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}
	
	.edit-value {
		font-size: 20rpx;
		color: #333;
		flex: 1;
		margin-left: 10rpx;
	}
	
	.hand-input {
		flex: 1;
		border: 1px solid #ddd;
		border-radius: 0; /* 去掉圆角 */
		padding: 5rpx;
		height: 20rpx; /* 字体大小的一倍 */
		line-height: 20rpx; /* 行高与高度一致，文字垂直居中 */
		font-size: 20rpx;
		box-sizing: border-box;
		min-height: 20rpx;
		width: 100%;
	}
	
	.input-text {
		display: inline-block;
		width: 100%;
	}
	
	.input-container {
		display: flex;
		align-items: center;
		flex: 1;
		margin-left: 10rpx;
		position: relative; /* 相对定位容器 */
	}
	
	.input-icon {
		width: 20rpx;
		height: 20rpx;
		position: absolute; /* 绝对定位 */
		right: 5rpx; /* 靠右放置 */
		top: 50%; /* 垂直居中 */
		transform: translateY(-50%); /* 垂直居中微调 */
		z-index: 1; /* 确保图标显示在上层 */
		cursor: pointer; /* 鼠标指针变为手型 */
	}
	
	.popup-buttons {
		display: flex;
		justify-content: center; /* 改为居中 */
		gap: 40rpx; /* 增加间距 */
		margin-top: 20rpx;
		padding: 0 30rpx 20rpx;
	}
	
	.btn {
		width: 100rpx; /* 设置固定宽度而不是flex:1 */
		height: 50rpx; /* 恢复原来的高度 */
		font-size: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
		margin: 0;
	}
	
	.cancel-btn {
		background-color: #fff;
		color: #1677FF;
		border: 1px solid #1677FF;
	}
	
	.confirm-btn {
		background-color: #1677FF;
		color: #fff;
		border: none;
	}
	.photo {
	flex: 1;
	overflow-y: auto;
	padding-left: 24px; /* 减小左边距，使照片更靠左 */
}

.file-picker {
	margin-top: 20rpx;
	margin-left: 0; /* 确保没有左边距 */
	width: 100%;
	display: flex;
	justify-content: flex-start; /* 改为左对齐 */
}
</style>
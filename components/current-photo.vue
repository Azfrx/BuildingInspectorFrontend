<template>
	<view class="container">
		<!-- 状态栏 -->
		<view class="confirm-row">
			<span class="confirm-text">结构信息状态：</span>
			<span class="confirm-status" :style="{color: Number(structureData?.Iscommit) === true ? '#f56c6c': '#333'}">
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

			<!-- 照片区域 - 为每个二级菜单项绑定独立的照片选择器 -->
			<view class="photo-section">
				<view v-for="(item, index) in secondLevelItems" :key="index">
					<myPhotoPicker v-if="selectedSecondIndex === index" v-model="item.photo"
						@select="handlePhotoChange(item)" @delete="handleDeletePhoto" />
				</view>
			</view>
			<!--      <view class="photo-section">
					<myPhotoPicker
						v-model="photos"
						@select="handlePhotoChange"
					/>
			</view>-->
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
						<textarea class="hand-input" v-model="photoNumber" :placeholder="'请输入照片序号'" auto-height />
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
	import {
		buildingImagesFromAbsoluteToRelative,
		getObject,
		readBridgeImage,
		removeDiseaseImage
	} from '../utils/readJsonNew';
	import {
		userStore
	} from '@/store/index.js'
	import {
		saveBridgeImages,
		setObject
	} from '../utils/writeNew'
	import myFilePicker from '@/components/myFilePicker/myFilePicker.vue';
	import myPhotoPicker from './myPhotoPicker.vue';

	//桥梁id
	const TaskBridgeId = ref(0)
	const structureData = ref(null);
	const userInfo = userStore()
	const selectedIndex = ref(0);
	const selectedSecondIndex = ref(0);
	const photo = ref([]);
	const show = ref(false);
	// 确保每个二级菜单项都有独立的照片数组
	const ensurePhotoArrays = () => {
		if (!structureData.value?.children) return;

		structureData.value.children.forEach(firstLevel => {
			if (firstLevel.children) {
				firstLevel.children.forEach(secondLevel => {
					if (!secondLevel.photo) {
						secondLevel.photo = [];
					}
				});
			}
		});
	};

	// 照片变化处理函数
	const handlePhotoChange = async (item) => {
		console.log('item.photos', item.photo);

		// 1. 先获取当前item中已有的图片的绝对路径（除了最新添加的图片）
		let oldPhotoPaths = [];
		if (item.photo.length > 1) {
			// 获取除了最后一个新添加图片外的所有图片
			oldPhotoPaths = item.photo.slice(0, item.photo.length - 1);
		}

		//传入的item.photos是上传图片的临时路径(拍照/从相册选择)
		//"_doc/uniapp_temp_1752056512594/camera/1752056522301.jpg" 拍照的临时路径
		///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/UD25-07-06-inspector1@znjc/building/1837/images/bridge_1752056908276_1.jpg 相册选择的临时路径
		// 2. 保存图片到本地，转为相对路径存到json
		item.photo = await saveBridgeImages(userInfo.username, TaskBridgeId.value, item.photo);

		// 3. 转为绝对路径显示
		item.photo = await readBridgeImage(userInfo.username, TaskBridgeId.value, item.photo);

		// 4. 保存结构数据到json
		await autoSavePhotos();

		// 5. 删除旧的物理文件以避免重复
		if (oldPhotoPaths.length > 0) {
			try {
				const deleteResult = await removeDiseaseImage(oldPhotoPaths);
				console.log('删除旧图片结果:', deleteResult);
			} catch (error) {
				console.error('删除旧图片失败:', error);
			}
		}
	};

	// 检查照片数据结构是否符合myFilePicker组件的要求，并修复图片URL
	const ensureValidPhotoStructure = (photos) => {
		if (!Array.isArray(photos)) return [];

		return photos.map(photo => {
			if (typeof photo !== 'object') return null;

			let url = photo.url || '';

			if (url && !url.startsWith('http') && !url.startsWith('file://') && !url.startsWith('data:')) {
				if (!url.startsWith('/')) {
					url = '/' + url;
				}
			}

			return {
				name: photo.name || 'photo.jpg',
				url: url,
				extname: photo.extname || 'jpg',
			};
		}).filter(photo => photo !== null);
	};

	const autoSavePhotos = async () => {
		try {
			if (structureData.value && structureData.value.children) {
				for (const firstLevel of structureData.value.children) {
					if (firstLevel.children) {
						for (const secondLevel of firstLevel.children) {
							if (!secondLevel.photo) {
								secondLevel.photo = [];
							} else {
								secondLevel.photo = await buildingImagesFromAbsoluteToRelative(secondLevel.photo);
							}
						}
					}
				}
			}
			await setObject(userInfo.username, TaskBridgeId.value, structureData.value);
      if (structureData.value && structureData.value.children) {
        for (const firstLevel of structureData.value.children) {
          if (firstLevel.children) {
            for (const secondLevel of firstLevel.children) {
              if (!secondLevel.photo) {
                secondLevel.photo = [];
              } else {
                secondLevel.photo = await readBridgeImage(userInfo.username, TaskBridgeId.value, secondLevel.photo);
              }
            }
          }
        }
      }
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
		const firstLevelItem = structureData.value.children[selectedIndex.value];
		if (!firstLevelItem || !firstLevelItem.children) return;

		const secondLevelItem = firstLevelItem.children[selectedSecondIndex.value];
		if (!secondLevelItem || !secondLevelItem.photo) return;

		const deletedPhoto = secondLevelItem.photo[index];
		if (deletedPhoto) {
			secondLevelItem.photo.splice(index, 1);
			structureData.value = JSON.parse(JSON.stringify(structureData.value));
			await autoSavePhotos();

			uni.showToast({
				title: '删除成功',
				icon: 'success',
				duration: 1500
			});
		}
	};

	const onUploadSuccess = async () => {
		console.log('上传成功');
		await autoSavePhotos();

		uni.showToast({
			title: '保存成功',
			icon: 'success',
			duration: 1500
		});
	};

	const photoSelect = async (e) => {
		if (e && e.tempFiles && e.tempFiles.length > 0) {
			const firstLevelItem = structureData.value.children[selectedIndex.value];
			if (!firstLevelItem || !firstLevelItem.children) return;

			const secondLevelItem = firstLevelItem.children[selectedSecondIndex.value];
			if (!secondLevelItem) return;

			if (!secondLevelItem.photo) {
				secondLevelItem.photo = [];
			}

			const newPhotos = e.tempFiles.map(file => {
				const url = file.url || file.path || (file.file && file.file.path) ||
					(file.image && file.image.location) || file.tempFilePath;

				return {
					name: file.name || 'photo.jpg',
					url: url,
					extname: file.extname || 'jpg',
				};
			});

			secondLevelItem.photo = [...(secondLevelItem.photo || []), ...newPhotos];
			structureData.value = JSON.parse(JSON.stringify(structureData.value));

			await autoSavePhotos();
		}
	};

	// 添加hasPhotos函数来检查菜单项是否有照片
	const hasPhotos = (item) => {
		if (item.photo && item.photo.length > 0) {
			return true;
		}

		if (item.children && item.children.length > 0) {
			return item.children.some(child => hasPhotos(child));
		}

		return false;
	};

	// 处理删除照片事件
	const handleDeletePhoto = async (data) => {
		try {
			const {
				index,
				image
			} = data;
			// 先确保选中的二级菜单项存在
			const secondLevelItem = secondLevelItems.value[selectedSecondIndex.value];
			if (!secondLevelItem) return;
			console.log('删除的照片', image);

			// 调用removeDiseaseImage删除文件
			const result = await removeDiseaseImage(image);

			if (result.success) {
				// 从数据中删除对应的图片记录
				secondLevelItem.photo.splice(index, 0);
				// 保存json时将绝对路径转为相对路径存储
				// secondLevelItem.photos = await buildingImagesFromAbsoluteToRelative(secondLevelItem.photos);
				// 更新数据
				await autoSavePhotos();
				// 读取相对路径为绝对路径
				/*secondLevelItem.photos = await readBridgeImage(userInfo.username, TaskBridgeId.value,
					secondLevelItem.photos)*/

				uni.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 1500
				});
			} else {
				console.error('删除照片失败:', result.error);
				uni.showToast({
					title: '删除失败',
					icon: 'error',
					duration: 1500
				});
			}
		} catch (error) {
			console.error('处理删除照片时出错:', error);
			uni.showToast({
				title: '删除失败',
				icon: 'error',
				duration: 1500
			});
		}
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
		return 0;
	});

	const init = async () => {
		console.log('=== init 函数开始执行 ===');
		if (bridgeIdFromURL.value) {
			TaskBridgeId.value = bridgeIdFromURL.value;
		}
		try {
			const latestData = await getObject(userInfo.username, TaskBridgeId.value);
			// 初始化照片数组
			if (latestData && latestData.children) {
				for (const firstLevel of latestData.children) {
					if (firstLevel.children) {
						for (const secondLevel of firstLevel.children) {
							if (!secondLevel.photo) {
								secondLevel.photo = [];
							} else {
								secondLevel.photo = await readBridgeImage(userInfo.username, TaskBridgeId.value,
									secondLevel.photo);
							}
						}
					}
				}
			}
			structureData.value = latestData;
			structureData.value.Iscommit = false;
			// 这里不要再 autoSavePhotos() 了！
		} catch (error) {
			console.error('获取数据失败:', error);
			uni.showToast({
				title: '数据加载失败',
				icon: 'error',
				duration: 1500
			});
		}
	};

	const changeTab = (index) => {
		selectedIndex.value = index;
		selectedSecondIndex.value = 0;
	};

	// 计算第二个侧边栏的数据
	const secondLevelItems = computed(() => {
		if (!structureData.value?.children?.[selectedIndex.value]?.children) {
			return [];
		}
		return structureData.value.children[selectedIndex.value].children;
	});

	const changeSecondTab = async (index) => {
		selectedSecondIndex.value = index;
	};

	onMounted(async () => {
		if (bridgeIdFromURL.value) {
			TaskBridgeId.value = bridgeIdFromURL.value;
		}
		await init();
	});

	// 打开弹窗
	const dowindow = () => {
		show.value = true;
		photoNumber.value = '';
	};

	// 取消弹窗
	const cancel = () => {
		show.value = false;
	};

	// 确认弹窗
	const confirm = () => {
		if (photoNumber.value.trim()) {
			console.log('确认照片序号:', photoNumber.value);
		}
		show.value = false;
	};

	// 清空输入框
	const clearInput = () => {
		photoNumber.value = '';
	};

	const props = defineProps({
		activeTabTop: {
			type: Number,
			default: 0
		}
	});

	watch(() => props.activeTabTop, (newval) => {
		if (newval == 3) {
			console.log('当前activeTabTop为：', newval)
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
		top: 17%;
		height: 66%;
		width: 3rpx;
		background-color: #0F4687;
	}

	.active .treeName {
		color: #0F4687 !important;
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
		width: 100%;
		overflow: hidden;
	}

	/* 侧边栏样式 */
	.sidebar {
		width: 127rpx;
		background-color: #f5f5f5;
		border-right: 1rpx solid #eeeeee;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.second-sidebar {
		background-color: #fafafa;
		width: 127rpx;
	}

	.treeName {
		margin-left: 5rpx;
		font-size: 15rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
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
		flex-shrink: 0;
	}

	/* 照片区域 */
	.photo-section {
		flex: 1;
		padding: 20rpx;
		overflow-y: auto;
		width: calc(100% - 254rpx); /* 减去两个sidebar的宽度 */
		box-sizing: border-box;
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
		border-radius: 0;
		padding: 5rpx;
		height: 20rpx;
		line-height: 20rpx;
		font-size: 20rpx;
		box-sizing: border-box;
		min-height: 20rpx;
		width: 100%;
	}

	.input-container {
		display: flex;
		align-items: center;
		flex: 1;
		margin-left: 10rpx;
		position: relative;
	}

	.input-icon {
		width: 20rpx;
		height: 20rpx;
		position: absolute;
		right: 5rpx;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		cursor: pointer;
	}

	.popup-buttons {
		display: flex;
		justify-content: center;
		gap: 40rpx;
		margin-top: 20rpx;
		padding: 0 30rpx 20rpx;
	}

	.btn {
		width: 100rpx;
		height: 50rpx;
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

	/* 照片选择器区域 */
	.photo-section {
		flex: 1;
		padding: 20rpx;
		overflow-y: auto;
		width: calc(100% - 254rpx); /* 减去两个sidebar的宽度 */
		box-sizing: border-box;
	}
</style>
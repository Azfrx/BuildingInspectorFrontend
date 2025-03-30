<template>
	<view class="page-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">

		<!-- 标签页部分 -->
		<view class="tabs">
			<view v-for="(tab, index) in tabs" :key="index" :class="['tab', activeTab === index ? 'active' : '']"
				@click="activeTab = index">
				{{ tab }}
			</view>
			<!-- 添加滑动指示器 -->
			<view class="tab-indicator" :style="indicatorStyle"></view>
		</view>

		<!-- 过滤/筛选区域 -->
		<view class="filter-section">
			<view class="filter-row">
				<!-- 跨区域 -->
				<view class="span-section">
					<view class="minus-btn" @click="changeSpan(-1)">
						<text class="btn-icon">-</text>
					</view>
					<view class="span-label">第</view>
					<view class="span-input">
						<input type="number" class="number-input" v-model="currentSpan" />
					</view>
					<view class="span-label">跨</view>
					<view class="add-btn" @click="changeSpan(1)">
						<text class="btn-icon">+</text>
					</view>
				</view>

				<!-- 梁号区域 -->
				<view class="beam-section">
					<view class="beam-label">梁号:</view>
					<view class="beam-input">
						<input type="number" class="number-input small-input" v-model="beamStart" />
					</view>
					<view class="beam-separator">~</view>
					<view class="beam-input">
						<input type="number" class="number-input small-input" v-model="beamEnd" />
					</view>
				</view>

				<!-- 支座数区域 -->
				<view class="support-section">
					<view class="support-label">支座数:</view>
					<view class="support-value">{{supportCount || '/'}}</view>
					<view class="dropdown-icon">▼</view>
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content">
			<!-- 列表标题 -->
			<view class="list-title">病害列表 (共{{filteredDiseaseList.length}}条记录)</view>
			
			<!-- 病害列表 -->
			<view v-for="(item, index) in filteredDiseaseList" :key="index" class="disease-list-item">
				<disease-item :disease="item" @edit="handleEditDisease" @delete="handleDeleteDisease"></disease-item>
			</view>
			
			<!-- 显示无数据提示 -->
			<view class="no-data" v-if="filteredDiseaseList.length === 0">
				暂无符合条件的病害记录
			</view>
		</view>
		
		<!-- 添加按钮 -->
		<view class="add-button" @click="addDisease">+</view>
		
		<!-- 添加病害弹窗组件 -->
		<add-disease ref="addDiseaseRef" @add-disease="handleAddDisease"></add-disease>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['上部结构', '下部结构', '桥面系'],
				activeTab: 0,
				currentSpan: 1,
				beamStart: 1,
				beamEnd: 20,
				supportCount: 0,
				touchStartX: 0,
				touchEndX: 0,
				minSwipeDistance: 50, // 最小滑动距离
				isSwipeLocked: false, // 是否锁定滑动（防止与其他滑动操作冲突）
				touchStartTarget: null, // 记录起始触摸的目标元素
				hasMove: false, // 添加标记，记录是否发生了移动
				diseaseList: [
					// 示例病害数据
					{
						id: 0,
						imageSrc: "/static/image/zjl.png", // 使用已有的图片资源
						time: "02-26 09:02:68",
						component: "小箱梁", //构件
						spanNumber: "1", //跨号
						beamNumber: "1", //梁号
						position: "左腹板", //位置
						subclass: "斜向裂缝", //亚类
						rating: "4", //标度
						rangeX1: "23", //范围x1
						rangeY1: "14", //范围y1
						rangeX2: "12", //范围x2
						rangeY2: "25", //范围y2
						quantity: "1", //数量
						length: "12.0", //长度
						delta: "0.15", //Δ
						remark: "刚才", //备注
					},
					{
						id: 1,
						imageSrc: "/static/image/zjl.png", // 使用已有的图片资源
						time: "02-26 09:02:68",
						component: "小箱梁", //构件
						spanNumber: "1", //跨号
						beamNumber: "2", //梁号
						position: "右腹板", //位置
						subclass: "竖向裂缝", //亚类
						rating: "3", //标度
						rangeX1: "23", //范围x1
						rangeY1: "14", //范围y1
						rangeX2: "12", //范围x2
						rangeY2: "25", //范围y2
						quantity: "1", //数量
						length: "20.0", //长度
						delta: "0.22", //Δ
						remark: "第二个", //备注
					},
					{
						id: 2,
						imageSrc: "/static/image/zjl.png", // 使用已有的图片资源
						time: "02-26 09:02:68",
						component: "小箱梁", //构件
						spanNumber: "2", //跨号
						beamNumber: "2", //梁号
						position: "右腹板", //位置
						subclass: "竖向裂缝", //亚类
						rating: "3", //标度
						rangeX1: "23", //范围x1
						rangeY1: "14", //范围y1
						rangeX2: "12", //范围x2
						rangeY2: "25", //范围y2
						quantity: "1", //数量
						length: "20.0", //长度
						delta: "0.22", //Δ
						remark: "第三个", //备注
					},
				],
				storageFileName: 'bridge_diseases_data.json', // 存储文件名称
				hasStoragePermissions: false  // 存储权限状态
			}
		},
		computed: {
			// 计算滑动指示器的样式
			indicatorStyle() {
				const width = `${100 / this.tabs.length}%`;
				return {
					width,
					transform: `translateX(${this.activeTab * 100}%)`,
				}
			},
			filteredDiseaseList() {
				console.log('当前筛选条件:', {
					currentSpan: this.currentSpan,
					beamStart: this.beamStart,
					beamEnd: this.beamEnd
				});
				console.log('所有病害数据:', this.diseaseList);
				
				// 如果没有设置筛选条件，显示所有数据
				if (!this.currentSpan && !this.beamStart && !this.beamEnd) {
					return this.diseaseList;
				}
				
				const result = this.diseaseList.filter(item => {
					// 检查跨号是否匹配 - 字符串比较
					const spanMatch = !this.currentSpan || item.spanNumber === String(this.currentSpan);
					
					// 检查梁号是否在范围内 - 数字比较
					const beamNumber = parseInt(item.beamNumber || '0');
					const beamMatch = !this.beamStart || !this.beamEnd || 
						(beamNumber >= this.beamStart && beamNumber <= this.beamEnd);
					
					return spanMatch && beamMatch;
				});
				
				console.log('筛选后的数据:', result);
				return result;
			}
		},
		methods: {
			changeSpan(delta) {
				const newSpan = this.currentSpan + delta;
				if (newSpan > 0) {
					this.currentSpan = newSpan;
				}
			},
			// 触摸开始事件
			touchStart(e) {
				// 记录初始触摸位置和元素
				this.touchStartX = e.touches[0].clientX;
				this.touchStartTarget = e.target;
				this.isSwipeLocked = false;
				this.hasMove = false; // 添加标记，记录是否发生了移动
				
				// 检查是否在交互元素上开始触摸
				if (this.isInteractiveElement(e.target)) {
					this.isSwipeLocked = true;
				}
			},
			
			// 触摸移动事件
			touchMove(e) {
				// 如果已经锁定了滑动（在交互元素上），则不处理滑动逻辑
				if (this.isSwipeLocked) return;
				
				// 在移动过程中再次检查是否是交互元素
				if (this.isInteractiveElement(e.target)) {
					this.isSwipeLocked = true;
					return;
				}
				
				// 计算当前移动了多少距离
				const currentX = e.touches[0].clientX;
				const diffX = Math.abs(currentX - this.touchStartX);
				
				// 只有当移动距离超过5px才认为是开始滑动，避免误触
				if (diffX > 5) {
				  this.hasMove = true; // 标记发生了足够大的移动
				  this.touchEndX = currentX;
				}
			},
			
			// 触摸结束事件
			touchEnd(e) {
				// 如果已经锁定了滑动，则不处理滑动逻辑
				if (this.isSwipeLocked) {
					this.isSwipeLocked = false;
					return;
				}
				
				// 再次检查起始元素是否是交互元素
				if (this.isInteractiveElement(this.touchStartTarget)) {
					return;
				}
				
				// 如果没有发生移动，则认为是点击，不切换标签
				if (!this.hasMove) {
				  return;
				}
				
				// 计算滑动距离
				const swipeDistance = this.touchEndX - this.touchStartX;
				
				// 判断滑动方向和距离
				if (Math.abs(swipeDistance) > this.minSwipeDistance) {
					if (swipeDistance > 0) {
						// 向右滑动，切换到上一个标签
						if (this.activeTab > 0) {
							this.activeTab--;
							try {
								uni.vibrateShort();
							} catch (e) {
								console.log('振动反馈不可用');
							}
						}
					} else {
						// 向左滑动，切换到下一个标签
						if (this.activeTab < this.tabs.length - 1) {
							this.activeTab++;
							try {
								uni.vibrateShort();
							} catch (e) {
								console.log('振动反馈不可用');
							}
						}
					}
				}
				
				// 重置触摸数据
				this.touchStartX = 0;
				this.touchEndX = 0;
				this.touchStartTarget = null;
				this.hasMove = false; // 重置移动标记
			},
			
			// 检查是否为交互元素
			isInteractiveElement(className) {
				// 转换为字符串以防className为undefined
				const classStr = String(className);
				
				// 检查是否包含指定的类名
				return classStr.indexOf('input') !== -1 ||
					classStr.indexOf('btn') !== -1 ||
					classStr.indexOf('button') !== -1;
			},
			
			// 添加病害
			addDisease() {
				this.$refs.addDiseaseRef.openModal();
			},
			
			// 处理编辑病害事件
			handleEditDisease(disease) {
				console.log('编辑病害:', disease);
				// 打开弹窗并传递病害数据
				this.$refs.addDiseaseRef.openModal(disease);
			},
			
			// 保存数据到本地JSON文件
			saveToLocalStorage() {
				try {
					// 准备保存的数据（深拷贝避免修改原始数据）
					const dataToSave = JSON.parse(JSON.stringify(this.diseaseList));
					
					// 处理图片路径，确保图片路径是可存储的字符串
					dataToSave.forEach(disease => {
						// 确保images是数组
						if (!Array.isArray(disease.images)) {
							disease.images = [];
						}
						
						// 如果图片是临时路径或对象，进行适当处理
						// 这里我们保留图片路径，临时路径在应用重启后可能失效，实际使用时可能需要转为本地永久路径
					});
					
					// 将disease列表转换为JSON字符串
					const diseaseDataJson = JSON.stringify(dataToSave);
					
					// 保存到本地存储
					uni.setStorage({
						key: this.storageFileName,
						data: diseaseDataJson,
						success: () => {
							console.log('病害数据已保存到本地存储');
						},
						fail: (err) => {
							console.error('保存病害数据失败', err);
							// 显示错误提示
							uni.showToast({
								title: '保存数据失败，请检查存储空间',
								icon: 'none',
								duration: 2000
							});
						}
					});
				} catch (e) {
					console.error('保存病害数据时出错', e);
					// 显示通用错误提示
					uni.showToast({
						title: '保存数据时出错',
						icon: 'none',
						duration: 2000
					});
				}
			},
			
			// 从本地存储加载数据
			loadFromLocalStorage() {
				// 显示加载中提示
				uni.showLoading({
					title: '加载病害数据...'
				});
				
				uni.getStorage({
					key: this.storageFileName,
					success: (res) => {
						try {
							// 解析JSON数据
							const diseaseData = JSON.parse(res.data);
							if (Array.isArray(diseaseData) && diseaseData.length > 0) {
								this.diseaseList = diseaseData;
								console.log('json加载完成')
								console.log('从本地存储加载了', diseaseData.length, '条病害记录');
							}
						} catch (e) {
							console.error('解析本地病害数据失败', e);
							uni.showToast({
								title: '病害数据格式错误',
								icon: 'none',
								duration: 2000
							});
						}
						// 隐藏加载提示
						uni.hideLoading();
					},
					fail: (err) => {
						console.log('本地无病害数据或读取失败', err);
						// 隐藏加载提示
						uni.hideLoading();
						
						// 如果是首次使用没有数据，不显示错误提示
						if (err.errMsg && err.errMsg.indexOf('not exist') === -1) {
							uni.showToast({
								title: '读取病害数据失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			},
			
			// 处理删除病害事件
			handleDeleteDisease(disease) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条病害记录吗？',
					success: (res) => {
						if (res.confirm) {
							// 找到要删除的病害在列表中的索引
							const index = this.diseaseList.findIndex(item => item.id === disease.id);
							if (index !== -1) {
								// 从列表中移除该病害
								this.diseaseList.splice(index, 1);
								
								// 保存更新后的数据到本地存储
								this.saveToLocalStorage();
								
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
							}
						}
					}
				});
			},
			
			// 处理添加病害事件
			handleAddDisease(formData) {
				console.log('添加/编辑病害:', formData);
				
				// 首先处理图片保存
				this.saveImageToLocal(formData, (savedImagePath) => {
					// 检查是否为编辑模式
					if (formData.id !== undefined) {
						// 编辑现有病害
						const index = this.diseaseList.findIndex(item => item.id === formData.id);
						if (index !== -1) {
							// 更新数据（保存处理后的图片路径）
							const updatedDisease = {
								...formData,
								imageUrl: savedImagePath || this.diseaseList[index].imageUrl || '/static/image/zjl.png',
								// 兼容旧版本
								imageSrc: savedImagePath || this.diseaseList[index].imageSrc || '/static/image/zjl.png'
							};
							this.diseaseList.splice(index, 1, updatedDisease);
							
							// 保存更新后的数据到本地存储
							this.saveToLocalStorage();
							
							// 将单条病害保存为JSON文件
							this.saveDiseaseAsJsonFile(updatedDisease);
							
							uni.showToast({
								title: '病害更新成功',
								icon: 'success'
							});
						}
					} else {
						// 创建新病害
						const newDisease = {
							...formData,
							id: Date.now(), // 生成唯一ID
							imageUrl: savedImagePath || '/static/image/zjl.png', // 使用保存后的图片路径或默认图片
							// 兼容旧版本
							imageSrc: savedImagePath || '/static/image/zjl.png'
						};
						
						// 添加到列表开头
						this.diseaseList.unshift(newDisease);
						
						// 保存更新后的数据到本地存储
						this.saveToLocalStorage();
						
						// 将单条病害保存为JSON文件
						this.saveDiseaseAsJsonFile(newDisease);
						
						uni.showToast({
							title: '病害添加成功',
							icon: 'success'
						});
					}
				});
			},
			
			// 将图片保存到本地永久存储
			saveImageToLocal(formData, callback) {
				// 如果没有图片数据
				if (!formData.imageUrl || formData.imageUrl.startsWith('/static/')) {
					console.log('无需保存图片');
					callback(formData.imageUrl || null);
					return;
				}
				
				// 检查是否已经是永久路径
				if (formData.imageUrl.indexOf('_doc/images/') > -1 || 
					formData.imageUrl.indexOf('storage/') > -1) {
					console.log('图片已是永久路径:', formData.imageUrl);
					callback(formData.imageUrl);
					return;
				}
				
				try {
					// 生成文件名
					const now = new Date();
					const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
					const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
					const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
					const imageName = `病害图片_${formData.component}_${formData.subclass}_${dateStr}${timeStr}${rand}.jpg`;
					
					// #ifdef APP-PLUS
					// App环境下的图片保存
					this.saveImageInApp(formData.imageUrl, imageName, callback);
					// #endif
					
					// #ifdef MP || H5
					// 小程序或H5环境
					this.saveImageInMP(formData.imageUrl, imageName, callback);
					// #endif
				} catch (e) {
					console.error('保存图片出错:', e);
					callback(formData.imageUrl); // 如果出错，返回原图片路径
				}
			},
			
			// 检查并请求存储权限
			checkAndRequestPermissions() {
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() === 'android') {
					// 检查常规存储权限
					const permissions = ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE'];
					plus.android.requestPermissions(
						permissions,
						(resultObj) => {
							if (resultObj.granted.length === permissions.length) {
								this.hasStoragePermissions = true;
								console.log('已获得存储权限');
							} else {
								uni.showToast({
									title: '未获得完整存储权限，某些功能可能受限',
									icon: 'none',
									duration: 2000
								});
							}
						},
						(error) => {
							console.error('请求权限错误:', error.message);
						}
					);
				}
				// #endif
			},
			
			// 创建Hbuilder文件夹
			createHbuilderFolder(callback) {
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() === 'android') {
					try {
						// 使用应用内部存储
						const context = plus.android.runtimeMainActivity();
						const filesDir = context.getFilesDir();
						if (filesDir) {
							const hbuilderPath = filesDir.getAbsolutePath() + '/Hbuilder';
							console.log('Hbuilder文件夹物理路径:', hbuilderPath);
							
							const File = plus.android.importClass('java.io.File');
							const hbuilderDir = new File(hbuilderPath);
							
							if (!hbuilderDir.exists()) {
								const success = hbuilderDir.mkdirs();
								if (!success) {
									console.error('无法创建Hbuilder文件夹');
									callback(null);
									return;
								}
							}
							
							// 转换路径为FileEntry对象
							plus.io.resolveLocalFileSystemURL('file://' + hbuilderPath, (dirEntry) => {
								console.log('已创建Hbuilder文件夹:', hbuilderPath);
								console.log('Hbuilder文件夹URL路径:', 'file://' + hbuilderPath);
								callback(dirEntry);
							}, (err) => {
								console.error('无法解析Hbuilder文件夹路径:', err);
								callback(null);
							});
						} else {
							// 如果无法获取内部存储，尝试使用应用私有文档目录
							plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
								fs.root.getDirectory('Hbuilder', { create: true }, (dirEntry) => {
									const fullPath = plus.io.convertLocalFileSystemURL(dirEntry.fullPath);
									console.log('(备选方案)Hbuilder文件夹路径:', fullPath);
									callback(dirEntry);
								}, (err) => {
									console.error('创建Hbuilder文件夹失败:', err);
									callback(null);
								});
							}, (err) => {
								console.error('获取私有文档目录失败:', err);
								callback(null);
							});
						}
					} catch (e) {
						console.error('创建Hbuilder文件夹失败:', e);
						
						// 尝试使用应用私有文档目录
						plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
							fs.root.getDirectory('Hbuilder', { create: true }, (dirEntry) => {
								const fullPath = plus.io.convertLocalFileSystemURL(dirEntry.fullPath);
								console.log('(备选方案)Hbuilder文件夹路径:', fullPath);
								callback(dirEntry);
							}, (err) => {
								console.error('创建Hbuilder文件夹失败:', err);
								callback(null);
							});
						}, (err) => {
							console.error('获取私有文档目录失败:', err);
							callback(null);
						});
					}
				} else {
					// 非Android设备
					plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
						fs.root.getDirectory('Hbuilder', { create: true }, (dirEntry) => {
							const fullPath = plus.io.convertLocalFileSystemURL(dirEntry.fullPath);
							console.log('iOS Hbuilder文件夹路径:', fullPath);
							callback(dirEntry);
						}, (err) => {
							console.error('创建Hbuilder文件夹失败:', err);
							callback(null);
						});
					}, (err) => {
						console.error('获取私有文档目录失败:', err);
						callback(null);
					});
				}
				// #endif
				
				// 非APP环境
				// #ifndef APP-PLUS
				callback(null);
				// #endif
			},
			
			// App环境下保存图片
			saveImageInApp(imagePath, imageName, callback) {
				console.log('开始保存图片，原始路径:', imagePath);
				
				// 创建Hbuilder文件夹并保存图片
				this.createHbuilderFolder((hbuilderDirEntry) => {
					if (!hbuilderDirEntry) {
						console.error('无法创建Hbuilder文件夹');
						uni.showToast({
							title: '无法保存图片',
							icon: 'none',
							duration: 2000
						});
						callback(imagePath);
						return;
					}
					
					console.log('Hbuilder文件夹完整路径:', hbuilderDirEntry.fullPath);
					
					// 创建images子文件夹
					hbuilderDirEntry.getDirectory('images', { create: true }, (imagesDirEntry) => {
						console.log('images文件夹完整路径:', imagesDirEntry.fullPath);
						
						// 复制图片
						plus.io.resolveLocalFileSystemURL(imagePath, (entry) => {
							entry.copyTo(imagesDirEntry, imageName, () => {
								// 获取图片的完整本地路径
								let fullPath = '';
								
								// 针对Android平台
								if (plus.os.name.toLowerCase() === 'android') {
									try {
										// 获取完整物理路径
										const fullPathWithoutProtocol = imagesDirEntry.fullPath + '/' + imageName;
										fullPath = 'file://' + fullPathWithoutProtocol;
										
										// 输出路径信息供调试
										console.log('Android图片完整路径:', fullPath);
										console.log('文件夹物理路径:', hbuilderDirEntry.fullPath);
										
										// 获取应用内部存储路径用于参考
										const context = plus.android.runtimeMainActivity();
										const filesDir = context.getFilesDir();
										if (filesDir) {
											console.log('应用内部存储根路径:', filesDir.getAbsolutePath());
										}
										
										// 获取其他常用目录用于参考
										try {
											const Environment = plus.android.importClass('android.os.Environment');
											console.log('应用外部存储路径:', context.getExternalFilesDir(null).getAbsolutePath());
											console.log('设备下载目录:', Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());
										} catch (e) {
											console.error('获取参考路径时出错:', e);
										}
									} catch (e) {
										console.error('构建图片路径出错:', e);
										// 使用备选路径格式
										fullPath = 'file://' + hbuilderDirEntry.fullPath + '/images/' + imageName;
										console.log('(备选方案)图片完整路径:', fullPath);
									}
								} else {
									// 非Android平台
									fullPath = plus.io.convertLocalFileSystemURL(
										imagesDirEntry.fullPath + '/' + imageName
									);
									console.log('iOS图片完整路径:', fullPath);
								}
								
								console.log('图片已保存至应用存储的Hbuilder文件夹，路径:', fullPath);
								
								// 显示保存成功提示
								uni.showToast({
									title: '图片保存成功',
									icon: 'success',
									duration: 1500
								});
								
								callback(fullPath);
							}, (err) => {
								console.error('复制图片出错:', err);
								uni.showToast({
									title: '复制图片失败',
									icon: 'none',
									duration: 2000
								});
								callback(imagePath);
							});
						}, (err) => {
							console.error('解析源图片路径出错:', err);
							uni.showToast({
								title: '解析图片路径失败',
								icon: 'none',
								duration: 2000
							});
							callback(imagePath);
						});
					}, (err) => {
						console.error('创建images文件夹出错:', err);
						uni.showToast({
							title: '创建图片目录失败',
							icon: 'none',
							duration: 2000
						});
						callback(imagePath);
					});
				});
			},
			
			// 保存文件到Hbuilder文件夹
			saveFileToHbuilderFolder(fileName, content) {
				console.log('开始保存文件:', fileName);
				
				// 创建Hbuilder文件夹
				this.createHbuilderFolder((hbuilderDirEntry) => {
					if (!hbuilderDirEntry) {
						console.error('无法创建Hbuilder文件夹');
						uni.showToast({
							title: '无法创建存储目录',
							icon: 'none',
							duration: 2000
						});
						return;
					}
					
					console.log('Hbuilder文件夹完整路径:', hbuilderDirEntry.fullPath);
					
					// 在Hbuilder文件夹中创建JSON文件
					hbuilderDirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
						console.log('JSON文件创建成功，路径:', fileEntry.fullPath);
						
						fileEntry.createWriter((writer) => {
							writer.onwrite = () => {
								// 获取完整路径用于显示给用户
								let fullPath = '';
								let physicalPath = '';
								
								// 针对Android平台提供更友好的路径
								if (plus.os.name.toLowerCase() === 'android') {
									try {
										const context = plus.android.runtimeMainActivity();
										const filesDir = context.getFilesDir();
										if (filesDir) {
											physicalPath = filesDir.getAbsolutePath() + '/Hbuilder/' + fileName;
											console.log('文件物理路径:', physicalPath);
										}
									} catch (e) {
										console.error('获取物理路径失败:', e);
									}
									
									fullPath = '应用存储/Hbuilder/' + fileName;
								} else {
									fullPath = 'Hbuilder/' + fileName;
									try {
										physicalPath = plus.io.convertLocalFileSystemURL(fileEntry.fullPath);
										console.log('iOS文件物理路径:', physicalPath);
									} catch (e) {
										console.error('获取iOS物理路径失败:', e);
									}
								}
								
								console.log('病害JSON文件已保存到应用存储中的Hbuilder文件夹:');
								console.log('- 相对路径:', fullPath);
								console.log('- 文件URL路径:', 'file://' + hbuilderDirEntry.fullPath + '/' + fileName);
								
								uni.showToast({
									title: `已保存到${fullPath}`,
									icon: 'success',
									duration: 2000
								});
							};
							writer.onerror = (e) => {
								console.error('写入JSON文件失败:', e);
								uni.showToast({
									title: '保存文件失败',
									icon: 'none',
									duration: 2000
								});
							};
							// 写入文件内容
							writer.write(new Blob([content], { type: 'text/plain' }));
							console.log('开始写入文件内容，大小:', content.length, '字节');
						}, (err) => {
							console.error('创建writer失败:', err);
							uni.showToast({
								title: '创建文件写入器失败',
								icon: 'none',
								duration: 2000
							});
						});
					}, (err) => {
						console.error('创建JSON文件失败:', err);
						uni.showToast({
							title: '创建文件失败',
							icon: 'none',
							duration: 2000
						});
					});
				});
			},
			
			// 小程序或H5环境下保存图片
			saveImageInMP(imagePath, imageName, callback) {
				try {
					const fs = uni.getFileSystemManager();
					const imageDir = `${uni.env.USER_DATA_PATH}/images`;
					const targetPath = `${imageDir}/${imageName}`;
					
					// 确保目录存在
					try {
						fs.accessSync(imageDir);
					} catch (e) {
						fs.mkdirSync(imageDir, true);
					}
					
					// 保存图片
					fs.copyFileSync(imagePath, targetPath);
					console.log('图片已保存至:', targetPath);
					callback(targetPath);
				} catch (e) {
					console.error('保存图片失败:', e);
					callback(imagePath);
				}
			},
			
			// 将单条病害保存为JSON文件
			saveDiseaseAsJsonFile(disease) {
				try {
					// 创建一个副本以避免修改原始数据
					const diseaseCopy = JSON.parse(JSON.stringify(disease));
					
					// 格式化JSON字符串以便更好地阅读
					const jsonStr = JSON.stringify(diseaseCopy, null, 2);
					
					// 生成文件名 - 使用日期、时间和ID确保唯一性
					const now = new Date();
					const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
					const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
					const fileName = `病害_${disease.component}_${disease.subclass}_${dateStr}${timeStr}_${disease.id}.json`;
					
					// 根据平台使用不同的文件保存策略
					// #ifdef APP-PLUS
					// App环境下使用plus API
					this.saveFileInApp(fileName, jsonStr);
					// #endif
					
					// #ifdef MP || H5
					// 小程序或H5环境
					this.saveFileInMP(fileName, jsonStr);
					// #endif
				} catch (e) {
					console.error('保存病害到JSON文件时出错:', e);
					uni.showToast({
						title: '保存文件出错',
						icon: 'none'
					});
				}
			},
			
			// 判断是否为平板设备
			isTabletDevice() {
				// 获取屏幕信息
				const info = uni.getSystemInfoSync();
				// 一般认为屏幕宽度大于等于768px的设备为平板
				return info.windowWidth >= 768 || info.windowHeight >= 768;
			},
			
			// App环境下的文件保存实现
			saveFileInApp(fileName, content) {
				// 检测是否为平板设备
				const isTablet = this.isTabletDevice();
				
				try {
					if (isTablet) {
						// 平板设备：保存到Hbuilder文件夹
						this.saveFileToHbuilderFolder(fileName, content);
					} else {
						// 标准App使用plus.io API保存到公共文档目录
						plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
							fs.root.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
								fileEntry.createWriter((writer) => {
									writer.onwrite = () => {
										console.log('病害JSON文件已保存到公共文档目录:', fileName);
										uni.showToast({
											title: '已保存到文档目录',
											icon: 'success'
										});
									};
									writer.onerror = (e) => {
										console.error('写入JSON文件失败:', e);
										uni.showToast({
											title: '保存文件失败',
											icon: 'none'
										});
									};
									// 写入文件内容
									writer.write(new Blob([content], { type: 'text/plain' }));
								});
							});
						});
					}
				} catch (e) {
					console.error('App环境保存文件失败:', e);
					uni.showToast({
						title: '保存文件失败',
						icon: 'none'
					});
				}
			},
			
			// 小程序或H5环境下的文件保存实现
			saveFileInMP(fileName, content) {
				try {
					// 获取文件管理器
					const fs = uni.getFileSystemManager();
					// 获取可用的临时路径
					const tempFilePath = `${uni.env.USER_DATA_PATH}/${fileName}`;
					
					// 写入文件
					fs.writeFileSync(
						tempFilePath,
						content,
						'utf8'
					);
					
					// 对于H5环境，通过创建a标签下载
					// #ifdef H5
					const blob = new Blob([content], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = fileName;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
					
					uni.showToast({
						title: '文件已下载',
						icon: 'success'
					});
					// #endif
					
					// 对于小程序环境，尝试保存到用户空间
					// #ifdef MP
					uni.saveFile({
						tempFilePath: tempFilePath,
						success: (res) => {
							console.log('保存病害JSON文件成功:', res.savedFilePath);
							uni.showToast({
								title: '文件已保存',
								icon: 'success'
							});
						},
						fail: (err) => {
							console.error('保存病害JSON文件失败:', err);
							uni.showToast({
								title: '保存文件失败',
								icon: 'none'
							});
						}
					});
					// #endif
				} catch (e) {
					console.error('小程序环境保存文件失败:', e);
					uni.showToast({
						title: '保存文件失败',
						icon: 'none',
						duration: 2000
					});
				}
			},
			
			// 处理图片路径
			processImagePaths(images) {
				if (!Array.isArray(images)) {
					return [];
				}
				
				// 对于临时图片路径，可能需要复制到应用的永久存储位置
				// 但在这个简单实现中，我们直接返回路径
				return images.map(img => {
					// 如果需要，可以在这里处理图片路径转换
					// 例如：将临时路径保存为永久路径
					return img;
				});
			}
		},
		// 添加生命周期钩子
		onLoad() {
			// 页面加载时从本地存储加载病害数据
			this.loadFromLocalStorage();
			
			// 检查并请求存储权限
			this.checkAndRequestPermissions();
		},
		
		// 页面卸载时保存数据
		onUnload() {
			// 确保在页面关闭时保存一次数据
			this.saveToLocalStorage();
		},
		components: {
			// 使用setup脚本中的组件导入，所以这里不需要了
		}
	}
</script>

<script setup>
import { onMounted, ref } from 'vue';
import DiseaseItem from '@/components/disease-item/disease-item.vue';
import AddDisease from '@/components/add-disease/add-disease.vue';

// 组件引用
const addDiseaseRef = ref(null);

// 页面加载完成后的处理
onMounted(() => {
	console.log('bridge-diseases页面已加载');
	// 可以在这里添加额外的初始化逻辑
});
</script>

<style>
	/* 标签页样式 */
	.tabs {
		position: relative;
		display: flex;
		background-color: #fff;
		border-bottom: 1rpx solid #ddd;
		width: 100%;
	}

	.tab {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #333;
		white-space: nowrap;
		transition: color 0.3s ease;
	}

	.tab.active {
		color: #3A4242;
		font-weight: 500;
	}

	/* 添加滑动指示器样式 */
	.tab-indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 4rpx;
		background-color: #3A4242;
		transition: transform 0.3s ease;
	}

	/* 过滤区域样式 */
	.filter-section {
		width: 100%;
		padding: 2% 2.5%;
		background-color: #f8f8f8;
		box-sizing: border-box;
	}

	.filter-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2%;
	}

	/* 跨区域样式 */
	.span-section {
		display: flex;
		align-items: center;
		height: calc(30px + 1vw);
		flex: 0 0 auto;
		margin-right: 2%;
	}

	.minus-btn,
	.add-btn {
		width: calc(30px + 0.8vw);
		height: calc(30px + 0.8vw);
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #3A4242;
		color: white;
		border-radius: 4rpx;
		flex-shrink: 0;
	}

	.btn-icon {
		font-size: calc(18px + 0.5vw);
		line-height: 1;
	}

	.span-label {
		margin: 0 1%;
		color: #333;
		font-size: calc(12px + 0.3vw);
		white-space: nowrap;
	}

	.span-input {
		position: relative;
		width: calc(40px + 1vw);
		height: calc(30px + 0.8vw);
		flex-shrink: 0;
	}

	.span-input::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2rpx;
		background-color: #FFA500;
	}

	/* 梁号区域样式 */
	.beam-section {
		display: flex;
		align-items: center;
		height: calc(30px + 1vw);
		flex: 0 0 auto;
		margin-right: 2%;
	}

	.beam-label {
		color: #333;
		font-size: calc(12px + 0.3vw);
		margin-right: 1%;
		white-space: nowrap;
	}

	.beam-input {
		width: calc(40px + 1vw);
		height: calc(30px + 0.8vw);
		flex-shrink: 0;
	}

	.beam-separator {
		margin: 0 1%;
		color: #333;
		font-size: calc(12px + 0.3vw);
		white-space: nowrap;
	}

	/* 支座数区域样式 */
	.support-section {
		display: flex;
		align-items: center;
		height: calc(30px + 1vw);
		flex: 0 0 auto;
	}

	.support-label {
		color: #333;
		font-size: calc(12px + 0.3vw);
		margin-right: 1%;
		white-space: nowrap;
	}

	.support-value {
		margin-right: 1%;
		font-size: calc(12px + 0.3vw);
		white-space: nowrap;
	}

	.dropdown-icon {
		font-size: calc(10px + 0.3vw);
		color: #666;
	}

	/* 输入框样式 */
	.number-input {
		height: 100%;
		width: 100%;
		text-align: center;
		font-size: calc(12px + 0.3vw);
		color: #333;
		min-width: 40rpx;
	}

	.small-input {
		font-size: calc(11px + 0.3vw);
	}

	/* 响应式调整 */
	@media screen and (max-width: 480px) {
		.filter-row {
			gap: 1%;
		}

		.span-section,
		.beam-section,
		.support-section {
			margin-right: 1%;
			height: calc(28px + 0.8vw);
		}

		.span-input,
		.beam-input {
			width: calc(35px + 0.8vw);
			height: calc(28px + 0.8vw);
		}

		.span-label,
		.beam-label,
		.support-label,
		.support-value {
			font-size: calc(11px + 0.25vw);
			margin: 0 0.8%;
		}

		.minus-btn,
		.add-btn {
			width: calc(28px + 0.6vw);
			height: calc(28px + 0.6vw);
		}

		.btn-icon {
			font-size: calc(16px + 0.4vw);
		}
	}

	/* iPad - 平板设备通用 */
	@media screen and (min-width: 768px) and (max-width: 1024px) {
		.filter-section {
			padding: 2.2% 3%;
		}

		.filter-row {
			gap: 2.5%;
		}

		.span-section,
		.beam-section,
		.support-section {
			height: calc(35px + 1vw);
		}

		.span-input,
		.beam-input {
			width: calc(45px + 1.2vw);
			height: calc(35px + 1vw);
		}

		.span-label,
		.beam-label,
		.support-label,
		.support-value {
			font-size: calc(13px + 0.35vw);
			margin: 0 1.2%;
		}

		.minus-btn,
		.add-btn {
			width: calc(35px + 1vw);
			height: calc(35px + 1vw);
		}

		.btn-icon {
			font-size: calc(20px + 0.5vw);
		}

		.number-input {
			font-size: calc(13px + 0.35vw);
		}
	}

	/* 标准iPad特定调整 */
	@media screen and (min-width: 768px) and (max-width: 834px) {
		.filter-row {
			justify-content: space-between;
		}

		.span-section {
			margin-right: 0;
		}

		.beam-section {
			margin-right: 0;
		}
	}

	/* iPad Pro和大屏设备 */
	@media screen and (min-width: 1025px) {
		.filter-section {
			padding: 2.5% 3.5%;
		}

		.filter-row {
			gap: 3%;
		}

		.span-section,
		.beam-section {
			margin-right: 3%;
		}

		.span-section,
		.beam-section,
		.support-section {
			height: calc(40px + 1.2vw);
		}

		.span-input,
		.beam-input {
			width: calc(50px + 1.5vw);
			height: calc(40px + 1.2vw);
		}

		.span-label,
		.beam-label,
		.support-label,
		.support-value {
			font-size: calc(14px + 0.4vw);
			margin: 0 1.5%;
		}

		.minus-btn,
		.add-btn {
			width: calc(40px + 1.2vw);
			height: calc(40px + 1.2vw);
		}

		.btn-icon {
			font-size: calc(22px + 0.6vw);
		}

		.number-input {
			font-size: calc(14px + 0.4vw);
		}
	}

	/* 内容区域 */
	.content {
		padding: 10rpx;
		background-color: #fff;
		margin-top: 0;
	}

	/* 添加页面容器样式 */
	.page-container {
		width: 100%;
		min-height: 100vh;
		background-color: #fff;
		position: relative;
		overflow-x: hidden;
	}
	
	/* 优化滑动体验 */
	.page-container {
		touch-action: pan-y; /* 允许垂直滚动，禁止水平滚动干扰 */
	}

	/* 添加按钮样式 */
	.add-button {
		position: fixed;
		bottom: 40rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: #3A4242;
		color: white;
		font-size: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
		z-index: 100;
	}
	
	/* 无数据提示 */
	.no-data {
		text-align: center;
		padding: 40rpx;
		color: #999;
		font-size: 28rpx;
	}
	
	/* iPad适配 */
	@media screen and (min-width: 768px) {
		.add-button {
			width: 120rpx;
			height: 120rpx;
			font-size: 60rpx;
			bottom: 60rpx;
			right: 60rpx;
		}
	}

	/* 列表标题 */
	.list-title {
		padding: 20rpx;
		font-size: 28rpx;
		color: #3A4242;
		background-color: #f5f5f5;
		margin-bottom: 10rpx;
		border-radius: 6rpx;
	}
	
	/* 列表项容器 */
	.disease-list-item {
		margin-bottom: 10rpx;
		border-radius: 6rpx;
		overflow: hidden;
		box-shadow: 0 1rpx 6rpx rgba(0,0,0,0.05);
	}
</style>
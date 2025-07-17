<!-- 
 项目列表
 author:ykx
 date:2025.6.3
 Bug：4
 -->
<template>
	<!-- 内容区 -->
	<view class="container">
		<!-- 下载进度条 -->
		<view class="download-progress-container" v-if="showDownloadProgress">
			<view class="progress-header">
				<text class="progress-title">正在下载数据包 {{ formattedPackageSize }}</text>
				<text class="progress-percent">{{ Math.floor(downloadProgress) }}%</text>
			</view>
			<view class="progress-bar-bg">
				<view class="progress-bar-fill" :style="{ width: downloadProgress + '%' }"></view>
			</view>
			<view class="progress-info">
				<text>已下载: {{ downloadedSize }}</text>
			</view>
		</view>
		
		<!-- 解压进度条 -->
		<view class="download-progress-container" v-if="showUnzipProgress">
			<view class="progress-header">
				<text class="progress-title">正在解压数据包</text>
				<text class="progress-percent">{{ Math.floor(unzipProgress) }}%</text>
			</view>
			<view class="progress-bar-bg">
				<view class="progress-bar-fill" :style="{ width: unzipProgress + '%' }"></view>
			</view>
			<view class="progress-info">
				<text>解压中，请稍候...</text>
			</view>
		</view>
		
		<!-- 信息卡片 -->
		<view class="info-card">
			<view class="info-boxes">
				<view class="info-box">
					<text class="label">检测单位</text>
					<text class="value">{{ infoData.userDept|| '暂无数据' }}</text>
				</view>
				<view class="info-box">
					<text class="label">检测人员</text>
					<text class="value">{{ infoData.userName || '暂无数据' }}</text>
				</view>
				<view class="info-box">
					<text class="label">检测年度</text>
					<picker class="year-picker" :value="selectedYearIndex" :range="years" @change="changeYear">
						<view class="picker-content">
							<text class="value">{{ currentYear }}年度</text>
							<image src="/static/image/RightOutline.svg" mode="scaleToFill" />
						</view>
					</picker>
				</view>
			</view>
		</view>

		<!-- 项目列表 -->
		<view class="bridge-list">
			<view class="bridge-item" v-for="(item, index) in filteredProjects" :key="index" @click="goToList(item)">
				<view class="bridge-info">
					<view class="bridge-code">{{ item.code || '暂无编号' }}</view>
					<view class="bridge-name">{{ item.name || '暂无名称' }}</view>
					<view class="bridge-location">{{ item.ownerDept?.deptName || '暂无公司' }}</view>
				</view>
				<view class="bridge-meta">
					<view class="text-group">
						<text class="bridge-status"
							:class="{ 'completed': item.status === '1' }">{{ getStatusText(item.status) }}</text>
						<text class="bridge-progress">{{`0/${getTasksNumber(item.id)}`||'0/0' }}</text>
					</view>
					<image src="/static/image/RightOutline.svg" mode="scaleToFill" />
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch
	} from 'vue';
	import {
		getProject,
		getTask,
		getTaskByHadUsername
	} from '../../utils/readJsonNew';
	import {
		setProject
	} from '../../utils/writeNew';
	import {
		userStore
	} from '@/store/index.js'
	import {
		idStore
	} from '../../store/idStorage';
	import {
		FILE_NAMING,
		listDirectoryFiles,
		getAllFirstLevelDirs,
		getHadProject
	} from "@/utils/readJsonNew.js";
	import {
		async,
		interval
	} from 'rxjs';
	// 从downloadUtils中导入函数
	import {
		useDownloader,
		testDataPackageAPI,
		directDownload,
		parsePackageSize,
		copyObjectJsonFiles
	} from '@/utils/downloadUtils.js';
	import {
		createUserDataStructure,
		checkDirectoryExists,
		createDirectory,
	} from '@/utils/fileUtils.js';
	import {
		deleteFolderInApp
	} from '@/utils/deleteFolder.js';
	// 导入saveZipAndStorePath函数
	import { saveZipAndStorePath } from '@/utils/write.js';
	
	// 引入下载器
	const { downloadProgress, unzipProgress, downloadAndUnzip } = useDownloader();
	
	// 添加进度条显示控制变量
	const showDownloadProgress = ref(false);
	const showUnzipProgress = ref(false);
	const packageSize = ref(null); // 添加包大小变量
	
	// 获取当前日期字符串 (格式: YY-MM-DD)
	function getCurrentDateStr() {
		const now = new Date();
		const year = now.getFullYear().toString().slice(-2);
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const day = now.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// 生成用户目录名（格式: UD25-06-11-userName）
	function getUserDir(userName) {
		return `UD${getCurrentDateStr()}-${userName}`;
	}

	// 从目录名中提取用户名
	function extractUserNameFromDir(dirName) {
		// 检查目录名格式是否符合 UD日期-用户名
		if (dirName && dirName.startsWith('UD') && dirName.includes('-')) {
			// 获取最后一个'-'后面的内容作为用户名
			const lastDashIndex = dirName.lastIndexOf('-');
			if (lastDashIndex !== -1 && lastDashIndex < dirName.length - 1) {
				return dirName.substring(lastDashIndex + 1);
			}
		}
		return ''; // 如果格式不符，返回空字符串
	}

	// 检测年度选项
	// const years = ref([2025, 2024, 2023, 2022, 2021, 2020]);

	// 获取当前年份
	const currentYear = ref(new Date().getFullYear());

	const initData = ref(null);
	const infoData = ref({});
	// const username = ref("admin")
	// const password = ref(123456);
	const userInfo = userStore()
	const idInfo = idStore()
	// 用户目录变量
	const dir = ref('');
	const selectedYearIndex = ref(0);
	const years = ref([]);
	const tasksNumber = ref(0)
	const loading = ref(false)
	const localProjects = ref([]);
	const data = ref('');
	//初始化数据
	const init = async () => {
		try {
			// 在线登录逻辑
			// const responseLogin = await uni.request({
			// 	url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
			// 	method: 'POST'
			// });
			infoData.value = userInfo.infoData
			console.log('用户信息:', infoData.value);
			console.log("ULPath",userInfo.ULPath);
			// const token = responseLogin.data.token
			// infoData.value = responseLogin.data;

			// 获取并存储用户目录
			// if (userInfo.username) {
			// 	dir.value = getUserDir(userInfo.username);
			// 	console.log('当前用户目录:', dir.value);
			// 	idInfo.setDir(dir.value)
			// }

			if (infoData.value.token) {
				loading.value = true;
				
				// 不再调用testAPI
				// 直接下载数据包
				try {
					const token = infoData.value.token;
					console.log('开始下载数据包，使用token:', token.substring(0, 10) + '...');
					
					// 先检查本地是否已有数据
					let hasLocalData = false;
					let result;
					try {
						// 简化检测逻辑：只检查目录是否存在，不检查文件内容
						await new Promise((resolve, reject) => {
							plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
								entry.createReader().readEntries((entries) => {
									console.log('检查_doc/目录内容:');
									console.log('目录项数量:', entries.length);
									entries.forEach(item => {
										console.log(`- ${item.name} (${item.isDirectory ? '目录' : '文件'})`);
									});
									
									// 简化检测逻辑：只检查目录是否存在，不检查文件内容
									let hasValidData = false;
									const currentUsername = userInfo.username;
									console.log('当前用户名:', currentUsername);
									
									// 检查是否有project目录或包含当前用户名的目录
									for (const item of entries) {
										if (item.isDirectory) {
											console.log('检查目录:', item.name);
											
											// 如果存在project目录，认为有效
											if (item.name === 'project') {
												hasValidData = true;
												console.log('找到project目录');
												break;
											}
											
											// 检查目录名是否以UD开头（用户目录）
											if (item.name.startsWith('UD')) {
												// 提取目录名中的用户名部分（最后一个'-'后面的内容）
												const lastDashIndex = item.name.lastIndexOf('-');
												if (lastDashIndex !== -1 && lastDashIndex < item.name.length - 1) {
													const dirUsername = item.name.substring(lastDashIndex + 1);
													console.log('目录中的用户名:', dirUsername);
													
													// 检查提取的用户名是否与当前用户名匹配
													if (currentUsername && dirUsername === currentUsername) {
														hasValidData = true;
														console.log('找到匹配的用户目录:', item.name);
														// 设置已有用户名到store
														userInfo.setUDPath(item.name);
														break;
													}
												}
											}
										}
									}
									
									if (hasValidData) {
										console.log('本地已有有效数据，跳过下载步骤');
										hasLocalData = true;
									} else {
										console.log('_doc/目录中没有有效数据，需要下载数据');
										hasLocalData = false;
									}
									resolve();
								}, (err) => {
									console.error('读取_doc/目录失败:', err);
									hasLocalData = false; // 确保设置为false
									resolve(); // 继续执行，不中断流程
								});
							}, (err) => {
								// _doc目录不存在，需要下载
								console.log('_doc/目录不存在，需要下载数据');
								// 确保hasLocalData为false
								hasLocalData = false;
								resolve();
							});
						});
						
						// 如果本地有数据，创建一个结果对象
						if (hasLocalData) {
							result = {
								targetDir: '_doc/',
								tempPath: null,
								version: 'local'
							};
						}
					} catch (checkError) {
						console.error('检查本地数据失败:', checkError);
						// 检查失败，确保hasLocalData为false，继续尝试下载
						hasLocalData = false;
					}
					
					console.log('本地数据状态:', hasLocalData ? '已存在' : '不存在或为空，将开始下载');
					
					// 如果本地没有数据，则开始下载流程
					if (!hasLocalData) {
						console.log('开始执行下载流程...');
						
						// 移除确认对话框，直接下载
						try {
							// 显示下载进度提示，改为显示进度条
							showDownloadProgress.value = true;
							
							// 监听下载进度
							uni.$on('download-progress', (progress) => {
								// 不再使用showLoading，而是更新进度条
								downloadProgress.value = progress.progress || 0;
								
								// 如果有包大小信息，也更新它
								if (progress.packageSize) {
									console.log('从进度事件接收到包大小:', progress.packageSize);
									console.log('当前包大小值:', packageSize.value);
									
									// 确保packageSize是一个有效的数字
									const size = Number(progress.packageSize);
									if (!isNaN(size) && size > 0) {
										packageSize.value = size;
										console.log(`更新包大小为: ${(packageSize.value / (1024 * 1024)).toFixed(2)}MB`);
									} else {
										console.warn('接收到无效的包大小:', progress.packageSize);
									}
								}
							});
							
							// 监听解压进度
							uni.$on('unzip-progress', (progress) => {
								// 隐藏下载进度条，显示解压进度条
								showDownloadProgress.value = false;
								showUnzipProgress.value = true;
								unzipProgress.value = progress.progress || 0;
							});
							
							// 监听解压完成事件
							uni.$on('unzip-completed', () => {
								console.log('收到解压完成事件，关闭进度条');
								uni.$off('download-progress');
								uni.$off('unzip-progress');
								uni.$off('unzip-completed');
								showDownloadProgress.value = false;
								showUnzipProgress.value = false;
								
								// 不再自动复制object.json文件
							});
							
							// 添加超时处理
							const timeoutPromise = new Promise((_, reject) => {
								// 增加超时时间到10分钟
								const timeoutId = setTimeout(() => {
									console.log('下载操作已运行10分钟，检查是否已完成但未收到回调');
									
									// 检查_doc目录是否有内容，如果有则可能已经下载解压成功
									plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
										entry.createReader().readEntries((entries) => {
											if (entries.length > 0) {
												console.log('_doc/目录不为空，下载可能已成功但未收到回调，不触发超时错误');
												// 不触发reject，而是让下载继续
											} else {
												console.log('_doc/目录为空，确认下载超时');
												reject(new Error('下载超时，请检查网络连接'));
											}
										}, () => {
											// 读取目录失败，确认超时
											reject(new Error('下载超时，请检查网络连接'));
										});
									}, () => {
										// 目录不存在，确认超时
										reject(new Error('下载超时，请检查网络连接'));
									});
								}, 600000); // 10分钟
								
								// 添加强制完成检查
								const forceCompleteId = setTimeout(() => {
									console.log('下载操作已运行15分钟，强制完成');
									clearTimeout(timeoutId);
									reject(new Error('下载操作时间过长，强制完成'));
								}, 900000); // 15分钟强制完成
								
								return {
									timeoutId,
									forceCompleteId
								};
							});
							
							// 使用Promise.race处理超时
							try {
								let timeoutIds;
								const downloadPromise = downloadAndUnzip(token).then(result => {
									// 清除超时定时器
									if (timeoutIds) {
										clearTimeout(timeoutIds.timeoutId);
										clearTimeout(timeoutIds.forceCompleteId);
									}
									return result;
								});
								
								// 获取超时定时器ID
								timeoutIds = await Promise.race([
									new Promise(resolve => {
										const ids = timeoutPromise.catch(error => {
											// 捕获错误但不处理，让race继续
											return error;
										});
										resolve(ids);
									}),
									downloadPromise.then(() => null)
								]);
								
								// 如果downloadPromise先完成，timeoutIds将为null
								result = await downloadPromise;
								
								// 立即关闭下载弹窗和进度条
								uni.$off('download-progress');
								uni.$off('unzip-progress');
								uni.$off('unzip-completed'); // 确保移除解压完成事件监听
								showDownloadProgress.value = false;
								showUnzipProgress.value = false;
								uni.hideLoading();
								
								// 不再自动复制object.json文件
							} catch (downloadError) {
								console.error('下载出错，尝试直接获取数据:', downloadError);
								
								// 检查是否为超时错误
								if (downloadError.message && downloadError.message.includes('超时')) {
									console.log('下载超时，检查本地数据是否可用');
									
									// 检查_doc目录是否存在有效数据
									try {
										const hasValidLocalData = await new Promise((resolve) => {
											plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
												entry.createReader().readEntries((entries) => {
													console.log('检查_doc/目录内容，项目数:', entries.length);
													
													// 获取当前用户名
													const currentUsername = userInfo.username;
													console.log('当前登录用户名:', currentUsername);
													
													// 标记是否找到匹配的用户目录
													let foundMatchingUserDir = false;
													
													// 检查是否有project目录或包含当前用户名的目录
													for (const item of entries) {
														if (item.isDirectory) {
															console.log('检查目录:', item.name);
															
															// 如果存在project目录，认为有效
															if (item.name === 'project') {
																console.log('找到project目录');
																foundMatchingUserDir = true;
																break;
															}
															
															// 检查目录名是否以UD开头（用户目录）
															if (item.name.startsWith('UD')) {
																// 提取目录名中的用户名部分（最后一个'-'后面的内容）
																const lastDashIndex = item.name.lastIndexOf('-');
																if (lastDashIndex !== -1 && lastDashIndex < item.name.length - 1) {
																	const dirUsername = item.name.substring(lastDashIndex + 1);
																	console.log('目录中的用户名:', dirUsername);
																	
																	// 检查提取的用户名是否与当前用户名匹配
																	if (currentUsername && dirUsername === currentUsername) {
																		console.log('找到匹配的用户目录:', item.name);
																		// 设置已有用户名到store
																		userInfo.setUDPath(item.name);
																		foundMatchingUserDir = true;
																		break;
																	}
																}
															}
														}
													}
													
													// 只有找到匹配的用户目录才认为有本地数据
													resolve(foundMatchingUserDir);
												}, () => resolve(false));
											}, () => resolve(false));
										});
										
										if (hasValidLocalData) {
											console.log('发现有效的本地数据，使用本地数据');
											result = {
												targetDir: '_doc/',
												tempPath: null,
												version: 'local'
											};
											hasLocalData = true;
											
											// 本地数据有效，尝试复制object.json文件
											console.log('本地数据有效，不再自动复制object.json文件');
											// 移除自动复制代码
										} else {
											console.log('未找到与当前用户匹配的本地数据');
											// 本地无数据，尝试直接下载
											throw downloadError; // 重新抛出错误，进入后续处理流程
										}
									} catch (checkError) {
										console.error('检查本地数据失败:', checkError);
										throw downloadError; // 重新抛出原始错误
									}
								}
								// 如果不是超时错误或本地无数据，尝试直接下载
								else if (downloadError.message && (downloadError.message.includes('400') || downloadError.message.includes('URL'))) {
									// 尝试获取API数据
									const apiResult = await testDataPackageAPI(token);
									if (apiResult && apiResult.data) {
										// 处理包大小
										if (apiResult.data.packageSize) {
											const parsedSize = parsePackageSize(apiResult.data.packageSize);
											if (parsedSize) {
												packageSize.value = parsedSize;
												console.log(`解析后的包大小: ${(packageSize.value / (1024 * 1024)).toFixed(2)}MB`);
											}
										}
										
										if (apiResult.data.url) {
											// 尝试直接下载URL
											uni.showLoading({
												title: '尝试直接下载...',
												mask: true
											});
											
											try {
												// 使用Promise包装下载过程
												const tempPath = await new Promise((resolve, reject) => {
													// 直接使用URL下载，不带token
													const downloadTask = uni.downloadFile({
														url: apiResult.data.url,
														success: (res) => {
															if (res.statusCode === 200) {
																console.log('直接下载成功，临时文件路径:', res.tempFilePath);
																resolve(res.tempFilePath);
															} else {
																console.error('直接下载失败，状态码:', res.statusCode);
																// 不立即拒绝，尝试使用directDownload
																directDownload(apiResult.data.url, apiResult.data.packageSize).then(resolve).catch(reject);
															}
														},
														fail: (err) => {
															console.error('直接下载失败:', err);
															// 尝试使用directDownload作为备用方案
															console.log('尝试使用备用下载方法...');
															directDownload(apiResult.data.url, apiResult.data.packageSize).then(resolve).catch(reject);
														}
													});
													
													// 监听下载进度
													downloadTask.onProgressUpdate((e) => {
														const progress = e.progress;
														uni.showLoading({
															title: `直接下载中 ${progress}%`,
															mask: true
														});
													});
												});
												
												// 解压文件
												uni.showLoading({
													title: '正在解压文件...',
													mask: true
												});
												
												try {
													// 直接解压到_doc目录
													await new Promise((resolve, reject) => {
														console.log('开始解压文件:', tempPath, '到', '_doc/');
														
														// 设置解压超时保护
														let isResolved = false;
														const timeoutId = setTimeout(() => {
															if (!isResolved) {
																console.log('解压操作超时，但继续等待完成');
																// 不立即拒绝，只记录日志
															}
														}, 30000); // 30秒超时检查
														
														plus.zip.decompress(
															tempPath,
															'_doc/',
															(progress) => {
																// 添加进度信息日志
																if (progress && progress.loaded && progress.total) {
																	const percent = Math.floor((progress.loaded / progress.total) * 100);
																	console.log(`直接下载解压进度: ${percent}%`);
																} else {
																	console.log('解压进行中...');
																}
															},
															() => {
																console.log('解压完成');
																clearTimeout(timeoutId);
																isResolved = true;
																resolve();
															},
															(err) => {
																console.error('解压失败:', err);
																clearTimeout(timeoutId);
																isResolved = true;
																reject(err);
															}
														);
													});
													
													// 解压完成后立即关闭弹窗
													uni.hideLoading();
													
													// 列出_doc/目录中的内容，查看实际的文件结构
													await new Promise((resolve, reject) => {
														plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
															entry.createReader().readEntries((entries) => {
																console.log('_doc/目录内容:');
																entries.forEach((item) => {
																	console.log(`- ${item.name} (${item.isDirectory ? '目录' : '文件'})`);
																});
																resolve();
															}, (err) => {
																console.error('读取_doc/目录失败:', err);
																reject(err);
															});
														}, (err) => {
															console.error('解析_doc/目录失败:', err);
															reject(err);
														});
													});
													
													// 目标目录
													const targetDir = '_doc/';
													
													result = {
														targetDir,
														tempPath,
														version: apiResult.data.version
													};
													
													// 解压完成后，复制object.json文件
													console.log('直接下载解压完成，不再自动复制object.json文件');
													// 移除自动复制代码
												} catch (directError) {
													console.error('直接下载或解压失败:', directError);
													throw directError;
												}
											} catch (directError) {
												console.error('直接下载或解压失败:', directError);
												throw directError;
											}
										} else {
											throw new Error('无法获取下载URL');
										}
									} else {
										throw new Error('无法获取下载URL');
									}
								} else {
									// 其他错误，直接抛出
									throw downloadError;
								}
							} finally {
								// 移除下载进度监听并隐藏进度条
								uni.$off('download-progress');
								uni.$off('unzip-progress');
								uni.$off('unzip-completed'); // 确保移除解压完成事件监听
								showDownloadProgress.value = false;
								showUnzipProgress.value = false;
								uni.hideLoading();
							}
						} catch (error) {
							// 清理资源并隐藏进度条
							uni.$off('download-progress');
							uni.$off('unzip-progress');
							uni.$off('unzip-completed'); // 确保移除解压完成事件监听
							showDownloadProgress.value = false;
							showUnzipProgress.value = false;
							uni.hideLoading();
							
							console.error('下载失败:', error);
							
							// 不再询问用户，直接尝试使用本地数据
							console.log('下载失败，尝试使用本地数据');
							result = {
								targetDir: '_doc/',
								tempPath: null,
								version: 'local'
							};
							hasLocalData = true;
						}
					} else {
						// 如果已经有本地数据，尝试复制object.json文件
						console.log('使用本地数据，不再自动复制object.json文件');
						// 移除自动复制代码
					}
					
					console.log('数据包已下载并解压到:', result.targetDir);
					console.log('临时文件路径:', result.tempPath || '无临时文件（使用本地数据）');
					console.log('数据包版本:', result.version);
					
					// 如果是下载的数据，不再创建任何额外目录或文件
					if (!hasLocalData && userInfo.username) {
						try {
							// 直接使用解压后的原始文件夹，不做任何额外处理
							console.log('使用解压后的原始文件结构，不创建任何额外目录或文件');
						} catch (error) {
							console.error('处理解压后的文件时出错:', error);
						}
					}
					
					// 显示下载成功提示
					uni.showToast({
						title: hasLocalData ? '数据加载成功' : '数据下载成功',
						icon: 'success',
						duration: 2000
					});
				} catch (error) {
					// 移除下载进度监听并隐藏进度条
					uni.$off('download-progress');
					uni.$off('unzip-progress');
					uni.$off('unzip-completed'); // 确保移除解压完成事件监听
					showDownloadProgress.value = false;
					showUnzipProgress.value = false;
					uni.hideLoading();
					
					console.error('下载数据包失败:', error);
					// 显示更详细的错误信息
					let errorMsg = '下载失败';
					if (error.message) {
						if (error.message.includes('token')) {
							errorMsg = '身份验证失败，请重新登录';
						} else if (error.message.includes('解压')) {
							errorMsg = '解压数据包失败';
						} else if (error.message.includes('超时')) {
							errorMsg = '下载超时，请检查网络';
						} else if (error.message.includes('状态码')) {
							errorMsg = '服务器返回错误';
						} else {
							errorMsg = '下载数据包失败: ' + error.message;
						}
					}
					
					uni.showModal({
						title: '下载失败',
						content: errorMsg,
						showCancel: false
					});
				}
			} else {
				console.error('未获取到有效token');
				uni.showToast({
					title: '登录信息无效，请重新登录',
					icon: 'none'
				});
			}
		} catch (error) {
			// 离线登录逻辑
			const allUsers = await readUserFolders();
			for (const user of allUsers) {
				const hadUsernameArrBySplit = user.split('-');
				const hadUsername = hadUsernameArrBySplit[hadUsernameArrBySplit.length - 1];
				if (hadUsername === userInfo.username) {
					//已存在此用户 去读旧数据
					console.log("已存在此用户", user);
					userInfo.setHadUsername(user); // 设置已存在的用户名到store
					console.log("已存入用户：", userInfo.hadUsername);
					break;
				}
			}
			console.log('当前无网络，离线模式，读取本地数据', error)
			uni.showToast({
				title: '当前无网络，离线模式登录',
				icon: 'none'
			});
			
			// 离线模式下也尝试复制object.json文件
			console.log('离线模式，不再自动复制object.json文件');
			// 移除自动复制代码
		} finally {
			try {
				//不论有没有网，都从本地读取project
				console.log('从本地读取项目数据');
				
				// 直接尝试读取项目数据，不做文件检查
				try {
					const localProjectsAsync = await getProject(userInfo.username);
					data.value = localProjectsAsync;
					console.log("data", data.value);
					
					// 确保data.value包含projects数组
					if (data.value && data.value.projects && Array.isArray(data.value.projects)) {
						// 获取项目数据
						const projectsData = data.value.projects;
						console.log('获取到项目数据，项目数量:', projectsData.length);
						
						// 处理项目任务
						await getProjectsTasks(projectsData);
						
						// 提取并处理年份
						const repeatYears = projectsData
							.map(item => Number(item.year))
							.filter(year => !isNaN(year));
						
						// 去重并降序排序
						years.value = [...new Set(repeatYears)].sort((a, b) => b - a);
						
						if (years.value.length > 0) {
							currentYear.value = years.value[0];
							console.log('设置当前年份为:', currentYear.value);
						} else {
							// 如果没有有效年份，使用当前年份
							const thisYear = new Date().getFullYear();
							years.value = [thisYear];
							currentYear.value = thisYear;
							console.log('未找到有效年份，使用当前年份:', thisYear);
						}
					} else {
						console.log('本地项目数据为空或格式不正确');
						// 确保data.value有一个空的projects数组
						if (!data.value) data.value = {};
						data.value.projects = [];
						years.value = [new Date().getFullYear()];
						currentYear.value = years.value[0];
					}
				} catch (readError) {
					console.error('读取项目数据失败:', readError);
					// 确保data.value有一个空的projects数组
					if (!data.value) data.value = {};
					data.value.projects = [];
					years.value = [new Date().getFullYear()];
					currentYear.value = years.value[0];
				}
			} catch (error) {
				console.error('从本地读取数据时发生错误:', error);
				// 设置默认值，避免页面显示错误
				if (!data.value) data.value = {};
				data.value.projects = [];
				years.value = [new Date().getFullYear()];
				currentYear.value = years.value[0];
			} finally {
				loading.value = false; // 确保加载状态在请求完成后被重置
			}
		}
	};

	function readUserFolders() {
		return new Promise((resolve, reject) => {
			plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
				entry.createReader().readEntries((entries) => {
					const folders = entries.filter(e => e.isDirectory);
					resolve(folders.map(f => f.name));
				}, reject);
			}, reject);
		});
	}

	// 添加计算属性
	const filteredProjects = computed(() => {
		// 确保data.value存在并且包含projects数组
		if (!data.value || !data.value.projects || !Array.isArray(data.value.projects)) {
			return [];
		}
		
		return data.value.projects.filter(project => {
			// 确保year字段存在并进行类型转换比较
			const projectYear = Number(project.year);
			const currentYearValue = Number(currentYear.value);
			return !isNaN(projectYear) && !isNaN(currentYearValue) && projectYear === currentYearValue;
		});
	});
	const filteredProjectsTasks = ref([])

	//获取year的函数
	// const getYear = (objects[]) => {
	// 	for (int i = 0; i < objects.length; i++) {

	// 	}
	// }

	// 修改changeYear函数
	const changeYear = (e) => {
		selectedYearIndex.value = e.detail.value;
		currentYear.value = years.value[selectedYearIndex.value];
		console.log(`已选择${currentYear.value}年度，筛选出${filteredProjects.value.length}个项目`);
	};

	const back = () => {
		uni.navigateBack();
	};

	// Bug4  跳转后如何获取任务id
	const goToList = (item) => {
		// 先设置项目ID到store
		idInfo.setProjectId({
			value: item.id
		})
		// 然后导航到List页面
		uni.navigateTo({
			url: `/pages/List/List?projectId=${item.id}`
		});
	};

	const getProjectsTasks = async (projects) => {
		for (const item of projects) {
			try {
				//读取本地task
				const taskGetWithProjectId = await getTask(userInfo.username, item.id)
				// 确保data和tasks存在
				const tasksCount = taskGetWithProjectId?.data?.tasks?.length || 0;
				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: tasksCount
				});
				console.log(`项目 ${item.name} (ID: ${item.id}) 的任务数量: ${tasksCount}`);
			} catch (error) {
				console.error(`获取项目 ${item.id} 的任务失败:`, error);
				// 添加错误处理，确保即使一个项目失败也不会影响其他项目
				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: 0
				});
			}
		}
	}

	const getProjectsTasksByHadUsername = async (projects, hadUsername) => {
		for (const item of projects) {
			try {
				//读取本地task
				const taskGetWithProjectId = await getTaskByHadUsername(hadUsername, item.id)
				// 确保data和tasks存在
				const tasksCount = taskGetWithProjectId?.data?.tasks?.length || 0;
				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: tasksCount
				});
				console.log(`项目 ${item.name} (ID: ${item.id}) 的任务数量: ${tasksCount}`);
			} catch (error) {
				console.error(`获取项目 ${item.id} 的任务失败:`, error);
				// 添加错误处理，确保即使一个项目失败也不会影响其他项目
				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: 0
				});
			}
		}
	}

	const getTasksNumber = (id) => {
		// 确保filteredProjectsTasks.value是一个数组
		if (!Array.isArray(filteredProjectsTasks.value)) {
			return 0;
		}
		
		const project = filteredProjectsTasks.value.find(item => item.projectId === id);
		return project ? project.tastsNumber : 0;
	}

	// 获取状态文本
	const getStatusText = (status) => {
		switch (status) {
			case '0':
				return '未完成';
			case '1':
				return '已完成';
			default:
				return '未知状态';
		}
	};

	// 添加一个计算属性来获取当前项目
	const currentProject = computed(() => {
		if (!initData.value || !initData.value.data || !initData.value.data.projects) {
			return null;
		}

		// 查找匹配当前projectId的项目
		const project = initData.value.data.projects.find(p => p.id == projectId.value);

		// 如果找不到匹配的项目，则返回第一个项目（作为后备）
		return project || initData.value.data.projects[0];
	});

	// 添加计算属性
	const formattedPackageSize = computed(() => {
		try {
			if (!packageSize.value || isNaN(packageSize.value)) return '';
			const sizeInMB = packageSize.value / (1024 * 1024);
			if (isNaN(sizeInMB)) return '';
			return `(${sizeInMB.toFixed(2)}MB)`;
		} catch (error) {
			console.error('计算格式化包大小时出错:', error);
			return '';
		}
	});

	const downloadedSize = computed(() => {
		try {
			// 如果没有包大小或包大小无效，只显示百分比
			if (!packageSize.value || isNaN(packageSize.value)) {
				console.log('包大小无效，只显示百分比:', packageSize.value);
				return `${Math.floor(downloadProgress.value || 0)}%`;
			}
			
			// 确保downloadProgress有效
			const progress = downloadProgress.value || 0;
			
			// 计算已下载的MB数和总MB数
			const total = packageSize.value / (1024 * 1024);
			const downloaded = (progress * packageSize.value / 100) / (1024 * 1024);
			
			// 检查计算结果是否有效
			if (isNaN(downloaded) || isNaN(total)) {
				console.log('计算结果无效，只显示百分比:', {
					packageSize: packageSize.value,
					progress,
					downloaded,
					total
				});
				return `${Math.floor(progress)}%`;
			}
			
			// 返回格式化的字符串
			return `${downloaded.toFixed(2)}MB / ${total.toFixed(2)}MB`;
		} catch (error) {
			console.error('计算下载大小时出错:', error);
			return `${Math.floor(downloadProgress.value || 0)}%`;
		}
	});

	// 添加一个函数，用于设置UDPath
	const setUDPathFromDir = (dirName) => {
    if (!dirName) return;
    
    try {
        console.log('尝试设置UDPath，目录名:', dirName);
        // 提取目录名，如果是完整路径
        const parts = dirName.split('/');
        const name = parts[parts.length - 1];
        
        // 检查是否是UD开头的目录
        if (name && name.startsWith('UD')) {
            console.log('找到UD目录:', name);
            userInfo.setUDPath(name);
            console.log('UDPath已设置为:', name);
        } else {
            console.log('目录不是UD开头，尝试创建UD目录');
            // 如果不是UD开头的目录，可以创建一个
            saveZipAndStorePath('_doc/' + name, 'package.zip')
                .then(result => {
                    console.log('UDPath设置成功:', result.dirPath);
                })
                .catch(error => {
                    console.error('设置UDPath失败:', error);
                });
        }
    } catch (error) {
        console.error('设置UDPath时出错:', error);
    }
};

	onMounted(async () => {
		await init();
		
		// 设置进度监听
		watch(downloadProgress, (newValue) => {
			uni.$emit('download-progress', { progress: newValue });
		});
		
		watch(unzipProgress, (newValue) => {
			uni.$emit('unzip-progress', { progress: newValue });
		});
		
		// 检查UDPath是否为空，如果为空则尝试设置
		if (!userInfo.UDPath && userInfo.ULPath) {
			console.log('UDPath为空，尝试从ULPath设置:', userInfo.ULPath);
			setUDPathFromDir(userInfo.ULPath);
		}
	});

	const handleRadioChange = (e) => {
		const value = e.detail.value;
		if (value === 'remember') {
			rememberPassword.value = true;
			offlineLogin.value = false;
		} else if (value === 'offline') {
			offlineLogin.value = true;
			rememberPassword.value = false;
		}
	};

	// 测试数据包API接口
	// 测试数据包API接口函数已删除，直接使用testDataPackageAPI
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #fff;
		padding: 0;
		margin: 0;
	}

	.uni-nav-bar {
		height: 88px;
		font-size: 34px;
		font-weight: bold;
		margin-bottom: 0;
		background-color: #0F4687 !important;
	}

	::v-deep .uni-nav-bar__content {
		font-size: 34px;
		font-weight: bold;
		background-color: #0F4687 !important;
	}

	::v-deep .uni-nav-bar__header-container-inner {
		font-size: 34px;
		font-weight: bold;
	}

	.info-card {
		background-color: #bdcbe0;
		padding: 22px 12px 10px 12px;
		margin: 0;
		margin-top: -14px;
		display: flex;
		align-items: center;

		.info-boxes {
			display: flex;
			justify-content: space-around;
			gap: 8rpx;
			// padding: 0 10px 0 10px;
			width: 100%;

			.info-box {
				border: 1px solid #0f4687;
				border-radius: 4px;
				padding: 8px 10px;
				display: flex;
				flex-direction: column;
				background-color: #bdcbe0;
				min-height: 62px;
				justify-content: center;

				&:first-child {
					width: 55%;
					margin-left: 0px;

					.value {
						font-size: 20rpx;
					}
				}

				&:nth-child(2) {
					// width: 19%;
					flex: 1;

					.value {
						font-size: 20rpx;
					}
				}

				&:last-child {
					// width: 19%;
					flex: 1;
					margin-right: 0px;

					.value {
						font-size: 20rpx;
					}
				}

				.label {
					font-size: 15rpx;
					color: #666;
					line-height: 1.2;
					margin-bottom: 3px;
				}

				.value {
					color: #333;
					font-weight: 500;
					line-height: 1.2;
					font-size: 20rpx;
				}
			}
		}
	}

	.year-picker {
		width: 100%;

		.picker-content {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.value {
				font-size: 20rpx;
				color: #333;
				font-weight: 500;
				line-height: 1.2;
			}

			image {
				width: 20rpx;
				height: 20rpx;
			}
		}
	}

	.bridge-list {
		.bridge-item {
			display: flex;
			align-items: center;
			padding: 15px;
			background-color: #fff;
			margin-bottom: 0px;
			border: 1px solid #d0d0d0;
			border-radius: 0px;

			.bridge-info {
				flex: 1;

				.bridge-code {
					font-size: 15rpx;
					color: #666;
					margin-bottom: 4px;
				}

				.bridge-name {
					font-size: 20rpx;
					color: #333;
					margin-bottom: 4px;
				}

				.bridge-location {
					font-size: 15rpx;
					color: #999;
				}
			}

			.bridge-meta {
				text-align: right;
				margin-left: 10px;
				display: flex;
				align-items: center;
				gap: 10px;

				.text-group {
					text-align: right;

					.bridge-status {
						font-size: 18rpx;
						color: #333;
						display: block;

						&.completed {
							color: #00B578;
						}
					}

					.bridge-progress {
						font-size: 15rpx;
						color: #666;
						display: block;
						margin: 4px 0;
					}
				}

				image {
					width: 20rpx;
					height: 20rpx;
				}
			}
		}
	}

	.loading,
	.no-data {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: #666;
		font-size: 16px;
	}

	.appTitle {
		font-size: 20rpx;
		color: #333;
		font-weight: 500;
		line-height: 1.2;
	}

	/* 下载进度条样式 */
	.download-progress-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		background-color: #fff;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
	}
	
	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}
	
	.progress-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}
	
	.progress-percent {
		font-size: 16px;
		font-weight: bold;
		color: #0F4687;
	}
	
	.progress-bar-bg {
		width: 100%;
		height: 10px;
		background-color: #e0e0e0;
		border-radius: 5px;
		overflow: hidden;
	}
	
	.progress-bar-fill {
		height: 100%;
		background-color: #0F4687;
		border-radius: 5px;
		transition: width 0.3s ease;
	}
	
	.progress-info {
		margin-top: 10px;
		font-size: 14px;
		color: #666;
		text-align: center;
	}
</style>
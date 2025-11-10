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
		<view class="download-progress-container" v-if="showDownloadProgress && isActiveProgressId(currentProgressId)">
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
		<view class="download-progress-container" v-if="showUnzipProgress && isActiveProgressId(currentProgressId)">
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
						<!--						<text class="bridge-status"
							:class="{ 'completed': item.status === '1' }">{{ getStatusText(item.status) }}</text>-->
						<text
							class="bridge-progress">{{ filteredProjectsTasks.length > 0 ? `${getCommitedTasksNumber(item.id)}/${getTasksNumber(item.id)}` : '加载中...' }}</text>
					</view>
					<image src="/static/image/RightOutline.svg" mode="scaleToFill" />
				</view>
			</view>
		</view>
		<ChatAgentButton />
	</view>

	<!-- 下载确认弹窗 -->
	<downLoadWindow :visible="showDownloadModal" :title="downloadModalTitle" :content="downloadModalContent"
		@confirm="handleDownloadConfirm" @cancel="handleDownloadCancel" />

	<!-- 版本更新弹窗 -->
	<updateVersionWindow :visible="showUpdateModal" :title="updateModalTitle" :content="updateModalContent"
		@confirm="handleUpdateConfirm" @cancel="handleUpdateCancel" />

</template>

<script setup>
	import {
		computed,
		onMounted,
		onUnmounted,
		ref,
		watch
	} from 'vue';
	import {
		getProject,
		getTask,
		getTaskByHadUsername
	} from '../../utils/readJsonNew';
	import {
		userStore
	} from '@/store/index.js'
	import {
		idStore
	} from '../../store/idStorage';
	// 从downloadUtils中导入函数
	import {
		directDownload,
		parsePackageSize,
		testDataPackageAPI,
		useDownloader
	} from '@/utils/downloadUtils.js';
	// 导入全局进度条管理器
	import {
		clearActiveProgressId,
		isActiveProgressId,
		setActiveProgressId
	} from '@/utils/progressManager.js';
	// 导入saveZipAndStorePath函数
	import ChatAgentButton from "../../components/ChatAgentButton.vue";
	// 导入下载确认弹窗组件
	import downLoadWindow from '@/components/downLoadWindow.vue';
	import apiConfig from '../../config/api';
	// 导入版本更新弹窗组件
	import updateVersionWindow from '@/components/updateVersionWindow.vue';
	import {
		getBuildingCommitedNumber
	} from "@/utils/isBuildingCommited";

	// 引入下载器
	const {
		downloadProgress,
		unzipProgress,
		resetProgress,
		currentTaskId
	} = useDownloader();

	// 添加进度条显示控制变量
	const showDownloadProgress = ref(false);
	const showUnzipProgress = ref(false);
	const packageSize = ref(null); // 添加包大小变量
	const isDownloading = ref(false);
	const hasCheckedVersion = ref(false); // 添加版本检查标志

	// 添加进度条ID管理
	const currentProgressId = ref(null); // 当前页面的进度条ID

	// 下载确认弹窗相关变量
	const showDownloadModal = ref(false);
	const downloadModalTitle = ref('需要下载数据包');
	const downloadModalContent = ref('');
	const downloadConfirmResolve = ref(null); // 用于Promise的resolve函数

	// 版本更新弹窗相关变量
	const showUpdateModal = ref(false);
	const updateModalTitle = ref('发现新版本');
	const updateModalContent = ref('');
	const updateConfirmResolve = ref(null); // 用于Promise的resolve函数

	// 下载确认弹窗处理方法
	const handleDownloadConfirm = () => {
		showDownloadModal.value = false;
		if (downloadConfirmResolve.value) {
			downloadConfirmResolve.value(true);
			downloadConfirmResolve.value = null;
		}
	};

	const handleDownloadCancel = () => {
		showDownloadModal.value = false;
		if (downloadConfirmResolve.value) {
			downloadConfirmResolve.value(false);
			downloadConfirmResolve.value = null;
		}
	};

	// 显示下载确认弹窗的方法
	const showDownloadConfirmModal = (title, content) => {
		return new Promise((resolve) => {
			downloadModalTitle.value = title;
			downloadModalContent.value = content;
			downloadConfirmResolve.value = resolve;
			showDownloadModal.value = true;
		});
	};

	// 版本更新弹窗处理方法
	const handleUpdateConfirm = () => {
		showUpdateModal.value = false;
		if (updateConfirmResolve.value) {
			updateConfirmResolve.value(true);
			updateConfirmResolve.value = null;
		}
	};

	const handleUpdateCancel = () => {
		showUpdateModal.value = false;
		if (updateConfirmResolve.value) {
			updateConfirmResolve.value(false);
			updateConfirmResolve.value = null;
		}
	};

	// 显示版本更新弹窗的方法
	const showUpdateConfirmModal = (title, content) => {
		return new Promise((resolve) => {
			updateModalTitle.value = title;
			updateModalContent.value = content;
			updateConfirmResolve.value = resolve;
			showUpdateModal.value = true;
		});
	};

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


	// 下载文件函数
	const downloadFile = (url, packageSizeParam, taskId) => {
		return new Promise((resolve, reject) => {


			if (!url.startsWith('http')) {
				reject(new Error('URL格式不正确'));
				return;
			}

			// 处理包大小参数，如果是字符串则解析，如果是数字则直接使用
			let TOTAL_FILE_SIZE;
			if (typeof packageSizeParam === 'string') {
				const parsed = parsePackageSize(packageSizeParam);
				TOTAL_FILE_SIZE = parsed || 12.5 * 1024 * 1024;
			} else {
				TOTAL_FILE_SIZE = packageSizeParam || 12.5 * 1024 * 1024;
			}

			const task = uni.downloadFile({
				url,
				timeout: 180000,
				success: (res) => {
					if (res.statusCode === 200) {

						resolve(res.tempFilePath);
					} else {
						reject(new Error(`下载失败: ${res.statusCode}`));
					}
				},
				fail: (err) => {
					console.error('下载文件失败:', err);
					reject(err);
				}
			});

			if (task && typeof task.onProgressUpdate === 'function') {
				task.onProgressUpdate((e) => {
					const totalSize = e.totalBytesExpectedToWrite > 0 ? e.totalBytesExpectedToWrite :
						TOTAL_FILE_SIZE;
					const progress = e.totalBytesWritten / totalSize * 100;

					uni.$emit('download-progress', {
						progress,
						packageSize: TOTAL_FILE_SIZE,
						bytesWritten: e.totalBytesWritten,
						bytesExpected: totalSize,
						taskId: taskId
					});
				});
			}
		});
	};

	const handleUnpdate = async () => {
		try {
			// 防止重复检查版本
			if (hasCheckedVersion.value) {

				return;
			}

			infoData.value = userInfo.infoData;

			if (!infoData.value.token) {
				const responseLogin = await uni.request({
					url: `${apiConfig.baseURL}${apiConfig.endpoints.login}?username=${username.value}&password=${password.value}`,
					method: 'POST'
				});
				infoData.value.token = responseLogin.data.token;
				// uni.showToast({
				//   title: '登录信息无效，请重新登录',
				//   icon: 'none'
				// });
				return;
			}

			// loading.value = true;

			// 1.根据url版本号与本地UD目录的版本号的相对大小来判断是否有更新内容
			const response = await uni.request({
				url: `${apiConfig.baseURL}${apiConfig.endpoints.dataPackage}`,
				// url: 'http://60.205.13.156:8090/api/user/dataPackage',
				method: 'GET',
				header: {
					'Authorization': `${infoData.value.token}`
				}
			});



			if (response.statusCode !== 200 || response.data.code !== 0) {
				throw new Error(response.data?.msg || '获取数据包信息失败');
			}

			const {
				url,
				version,
				packageSize: apiPackageSize
			} = response.data;


			// 处理服务器版本格式：移除.zip后缀
			const dirNew = version.endsWith('.zip') ? version.slice(0, -4) : version;
			const dirOld = userInfo.UDPath;


			// 如果本地版本为空，说明是首次安装，需要下载数据包
			if (!dirOld) {


				// 显示下载确认对话框
				const confirmResult = await showDownloadConfirmModal(
					'需要下载数据包',
					`检测到当前用户需要下载数据包 ${dirNew}，是否立即下载？`
				);

				if (confirmResult) {
					// 开始下载和解压，传递处理后的版本名（不含.zip）
					await downloadAndUnzipPackage(url, apiPackageSize, dirNew);
					// 只有下载成功后才标记已检查过版本
					hasCheckedVersion.value = true;
				} else {
					// 用户拒绝下载，不标记已检查，下次进入还能重新提示

				}
				return;
			}


			// 如果本地版本小于获取的版本 触发更新
			// 添加额外检查：确保版本确实不同
			const needsUpdate = !dirOld || compareUDDirectories(dirNew, dirOld);


			if (needsUpdate) {


				// 显示确认对话框，包含版本信息
				const confirmResult = await showUpdateConfirmModal(
					'发现新版本',
					`检测到新的数据包版本 ${dirNew}，是否立即更新？`
				);

				if (confirmResult) {
					// 开始下载和解压，传递处理后的版本名（不含.zip）
					await downloadAndUnzipPackage(url, apiPackageSize, dirNew);
				}
			} else {

				// uni.showToast({
				//   title: '已是最新版本',
				//   icon: 'success',
				//   duration: 2000
				// });
			}

			// 标记已检查过版本
			hasCheckedVersion.value = true;
		} catch (error) {
			console.error('检查更新失败:', error);
			// 即使检查失败也标记为已检查，避免重复弹窗
			hasCheckedVersion.value = true;

			// 只有在网络错误或服务器错误时才显示错误弹窗
			if (error.message && !error.message.includes('无效的目录格式')) {
				// uni.showModal({
				//   title: '检查更新失败',
				//   content: error.message || '检查更新时发生错误，请稍后重试',
				//   showCancel: false
				// });
				const responseLogin = await uni.request({
					url: `${apiConfig.baseURL}${apiConfig.endpoints.login}?username=${username.value}&password=${password.value}`,
					method: 'POST'
				});
				infoData.value.token = responseLogin.data.token;
			}
		} finally {
			loading.value = false;
		}
	};

	// 判断目录1是否大于目录2
	function compareUDDirectories(dir1, dir2) {


		// 如果本地版本为空，则需要更新
		if (!dir2) {

			return true;
		}

		// 如果两个版本相同，则不需要更新
		if (dir1 === dir2) {

			return false;
		}

		// 定义正则表达式匹配目录中的时间戳部分（14位数字）
		const timestampRegex = /UD-(\d{14})-/;

		// 从第一个目录名中提取时间戳
		const match1 = dir1.match(timestampRegex);
		if (!match1 || !match1[1]) {
			console.warn(`无效的新版本目录格式: ${dir1}，使用字符串比较`);
			// 如果格式不匹配，使用字符串比较作为后备方案
			return dir1 > dir2;
		}
		const timestamp1 = match1[1];

		// 从第二个目录名中提取时间戳
		const match2 = dir2.match(timestampRegex);
		if (!match2 || !match2[1]) {
			console.warn(`无效的本地版本目录格式: ${dir2}，使用字符串比较`);
			// 如果格式不匹配，使用字符串比较作为后备方案
			return dir1 > dir2;
		}
		const timestamp2 = match2[1];



		// 比较两个时间戳字符串（直接字符串比较即可，因为它们都是固定长度的数字）
		const result = timestamp1 > timestamp2;

		return result;
	}

	// 重置下载状态
	const resetDownloadState = () => {

		resetProgress();
		showDownloadProgress.value = false;
		showUnzipProgress.value = false;
		packageSize.value = null;
		isDownloading.value = false;
		// 清理进度条ID
		if (currentProgressId.value) {
			clearActiveProgressId(currentProgressId.value);
			currentProgressId.value = null;
		}
	};

	// 清理事件监听器
	const cleanupDownloadListeners = () => {

		uni.$off('download-progress');
		uni.$off('unzip-progress');
		uni.$off('unzip-completed');
		uni.hideLoading();
	};

	// 查找解压后的实际目录
	const findActualUnzippedDir = () => {
		return new Promise((resolve) => {
			plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
				entry.createReader().readEntries((entries) => {


					// 查找最新的UD开头的目录
					const udDirs = entries
						.filter(e => e.isDirectory && e.name.startsWith('UD'))
						.sort((a, b) => {
							// 按目录名排序，最新的在前
							return b.name.localeCompare(a.name);
						});

					if (udDirs.length > 0) {
						const latestDir = udDirs[0].name;

						resolve(latestDir);
					} else {
						// 如果没有UD目录，查找其他可能的目录
						const otherDirs = entries.filter(e =>
							e.isDirectory &&
							!e.name.startsWith('uniapp_temp') &&
							e.name !== 'project'
						);

						if (otherDirs.length > 0) {
							const dirName = otherDirs[0].name;

							resolve(dirName);
						} else {

							resolve(null);
						}
					}
				}, (err) => {
					console.error('读取_doc/目录失败:', err);
					resolve(null);
				});
			}, (err) => {
				console.error('解析_doc/目录失败:', err);
				resolve(null);
			});
		});
	};

	// 下载并解压数据包
	const downloadAndUnzipPackage = async (url, packageSizeStr, version) => {
		try {
			// 检查是否已经有下载任务在进行
			if (isDownloading.value) {

				return;
			}

			// 先清理之前的状态和监听器
			cleanupDownloadListeners();
			resetDownloadState();

			// 设置下载状态
			isDownloading.value = true;
			const taskId = Date.now();

			// 生成新的进度条ID并设置为活跃状态
			currentProgressId.value = taskId;
			setActiveProgressId(taskId);


			// 显示下载进度条
			showDownloadProgress.value = true;



			// 解析包大小
			const parsedSize = parsePackageSize(packageSizeStr);
			if (parsedSize) {
				packageSize.value = parsedSize;

			}

			// 监听下载进度
			uni.$on('download-progress', (progress) => {
				// 检查是否是当前任务的进度事件
				if (!isDownloading.value || progress.taskId !== taskId) {

					return;
				}

				// 检查是否是当前活跃的进度条
				if (!isActiveProgressId(currentProgressId.value)) {

					return;
				}

				downloadProgress.value = progress.progress || 0;

				if (progress.packageSize) {
					const size = Number(progress.packageSize);
					if (!isNaN(size) && size > 0) {
						packageSize.value = size;
					}
				}
			});

			// 监听解压进度
			uni.$on('unzip-progress', (progress) => {
				// 检查是否是当前任务的进度事件
				if (!isDownloading.value || progress.taskId !== taskId) {

					return;
				}

				// 检查是否是当前活跃的进度条
				if (!isActiveProgressId(currentProgressId.value)) {

					return;
				}

				showDownloadProgress.value = false;
				showUnzipProgress.value = true;
				unzipProgress.value = progress.progress || 0;
			});

			// 监听解压完成事件
			uni.$on('unzip-completed', async (event) => {
				// 检查是否是当前任务的完成事件
				if (!isDownloading.value || event.taskId !== taskId) {

					return;
				}

				// 检查是否是当前活跃的进度条
				if (!isActiveProgressId(currentProgressId.value)) {

					return;
				}

				cleanupDownloadListeners();
				resetDownloadState();

				try {
					// 查找解压后的实际目录
					const actualDirName = await findActualUnzippedDir();
					if (actualDirName) {


						// 删除旧的UD目录（如果存在）
						const oldUDPath = userInfo.UDPath;

						if (oldUDPath && oldUDPath !== actualDirName) {

							try {
								await deleteOldDirectory(`_doc/${oldUDPath}`);

							} catch (error) {

								// 继续执行，不中断流程
							}
						}

						// 更新用户的UDPath为实际解压的目录
						userInfo.setUDPath(actualDirName);

					} else {

						// 如果找不到实际目录，回退到使用时间戳
						const now = new Date();
						const timestamp =
							now.getFullYear().toString() +
							(now.getMonth() + 1).toString().padStart(2, '0') +
							now.getDate().toString().padStart(2, '0') +
							now.getHours().toString().padStart(2, '0') +
							now.getMinutes().toString().padStart(2, '0') +
							now.getSeconds().toString().padStart(2, '0');

						const dirName = `UD${timestamp}-${userInfo.username}`;
						userInfo.setUDPath(dirName);

					}
				} catch (error) {
					console.error('处理解压后目录时出错:', error);
				}

				uni.showToast({
					title: '数据更新成功',
					icon: 'success',
					duration: 2000
				});
			});

			// 开始下载
			const tempPath = await downloadFile(url, parsedSize || packageSizeStr, taskId);


			// 开始解压

			await unzipFile(tempPath, '_doc/', taskId);

		} catch (error) {
			console.error('下载解压失败:', error);
			cleanupDownloadListeners();
			resetDownloadState();

			uni.showModal({
				title: '更新失败',
				content: error.message || '下载或解压数据包失败，请重试',
				showCancel: false
			});
		}
	};

	// 解压文件函数 - 参考bridge页面的优化实现
	const unzipFile = (zipPath, targetDir, taskId) => {
		return new Promise((resolve, reject) => {


			let isResolved = false;

			// 添加强制完成定时器，大幅缩短检查时间
			const forceCompleteTimeoutId = setTimeout(() => {
				if (!isResolved) {

					isResolved = true;

					// 检查_doc目录是否有内容，验证解压是否成功
					plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
						entry.createReader().readEntries((entries) => {

							if (entries.length > 0) {

								// 发送解压完成事件
								uni.$emit('unzip-completed', {
									taskId: taskId
								});
								resolve(targetDir);
							} else {
								console.error('解压后目录为空，可能失败');
								reject(new Error('解压可能失败，目录为空'));
							}
						}, (err) => {
							console.error('读取目录失败，解压可能失败:', err);
							reject(new Error('解压可能失败，无法读取目录'));
						});
					}, (err) => {
						console.error('解压目录不存在，解压失败:', err);
						reject(new Error('解压失败，目标目录不存在'));
					});
				}
			}, 3000); // 缩短到3秒，大多数情况下解压应该已经完成

			// 添加文件系统轮询检查，更快地发现解压完成
			let checkCount = 0;
			const maxChecks = 10;
			const checkInterval = setInterval(() => {
				if (isResolved) {
					clearInterval(checkInterval);
					return;
				}

				checkCount++;


				plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
					entry.createReader().readEntries((entries) => {
						// 检查是否有project目录或其他关键目录，表明解压已完成
						const hasKeyDirectories = entries.some(e =>
							e.isDirectory && (e.name === 'project' || e.name
								.startsWith('UD'))
						);

						if (hasKeyDirectories) {

							if (!isResolved) {
								isResolved = true;
								clearTimeout(forceCompleteTimeoutId);
								clearInterval(checkInterval);
								uni.$emit('unzip-completed', {
									taskId: taskId
								});
								resolve(targetDir);
							}
						} else if (checkCount >= maxChecks) {

							clearInterval(checkInterval);
						}
					}, () => {
						if (checkCount >= maxChecks) {
							clearInterval(checkInterval);
						}
					});
				}, () => {
					if (checkCount >= maxChecks) {
						clearInterval(checkInterval);
					}
				});
			}, 1000); // 每秒检查一次

			plus.zip.decompress(
				zipPath,
				targetDir,
				(progress) => {
					if (progress && progress.loaded && progress.total && progress.total > 0) {
						const progressPercent = Math.floor((progress.loaded / progress.total) * 100);
						uni.$emit('unzip-progress', {
							progress: progressPercent,
							taskId: taskId
						});


						// 如果进度达到100%，也可以认为解压已完成
						if (progressPercent >= 100 && !isResolved) {

							isResolved = true;
							clearTimeout(forceCompleteTimeoutId);
							clearInterval(checkInterval);
							uni.$emit('unzip-completed', {
								taskId: taskId
							});
							resolve(targetDir);
						}
					} else {

					}
				},
				() => {

					// 解压完成时发送事件
					if (!isResolved) {
						uni.$emit('unzip-completed', {
							taskId: taskId
						});
						clearTimeout(forceCompleteTimeoutId);
						clearInterval(checkInterval);
						isResolved = true;
						resolve(targetDir);
					}
				},
				(err) => {
					console.error('解压失败:', err);
					if (!isResolved) {
						clearTimeout(forceCompleteTimeoutId);
						clearInterval(checkInterval);
						isResolved = true;
						reject(new Error(`解压失败: ${JSON.stringify(err)}`));
					}
				}
			);
		});
	};

	// 删除旧目录
	const deleteOldDirectory = (dirPath) => {
		return new Promise((resolve, reject) => {


			plus.io.resolveLocalFileSystemURL(dirPath, (entry) => {
				if (entry.isDirectory) {
					entry.removeRecursively(() => {

						resolve();
					}, (err) => {

						reject(err);
					});
				} else {

					reject(new Error('路径不是目录'));
				}
			}, (err) => {

				// 如果目录不存在，也认为删除成功
				if (err.code === 1) { // NOT_FOUND_ERR

					resolve();
				} else {
					reject(err);
				}
			});
		});
	};

	// 初始化本地路径
	const initializeLocalPaths = async () => {
		try {

			// 检查UDPath是否匹配当前用户，如果不匹配则重置
			if (userInfo.UDPath) {
				const currentUsername = userInfo.username;
				if (currentUsername && !userInfo.UDPath.split('-')[2] === currentUsername) {
					userInfo.setUDPath(''); // 重置UDPath
					hasCheckedVersion.value = false; // 重置版本检查标志
				} else {
					return;
				}
			}

			// 检查本地是否有UD目录
			await new Promise((resolve) => {
				plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
					entry.createReader().readEntries((entries) => {

						// 查找UD开头的目录
						const udDirs = entries
							.filter(e => e.isDirectory && e.name.startsWith('UD'))
							.sort((a, b) => {
								// 按目录名排序，最新的在前
								return b.name.localeCompare(a.name);
							});

						if (udDirs.length > 0) {
							const latestDir = udDirs[0].name;

							// 检查目录是否包含当前用户名
							const currentUsername = userInfo.username;
							let matchedDir = null;

							// 优先查找匹配当前用户名的目录
							if (currentUsername) {
								for (const dir of udDirs) {
									if (dir.name.split('-')[2] === currentUsername) {
										matchedDir = dir.name;
										break;
									}
								}
							}

							// 如果没找到匹配的，不设置UDPath，让系统识别为需要下载
							if (!matchedDir) {
								// 不设置UDPath，让handleUnpdate识别为需要下载
							} else {
								userInfo.setUDPath(matchedDir);
							}
						} else {
							// 不设置UDPath，让handleUnpdate识别为首次安装
						}

						resolve();
					}, (err) => {
						resolve();
					});
				}, (err) => {
					resolve();
				});
			});

		} catch (error) {}
	};

	//初始化数据
	const init = async () => {
		try {
			// 在线登录逻辑
			// const responseLogin = await uni.request({
			// 	url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
			// 	method: 'POST'
			// });
			infoData.value = userInfo.infoData

			// 在检查版本更新之前，先尝试设置本地的UDPath
			await initializeLocalPaths();

			// 然后再检查版本更新
			await handleUnpdate()

			if (infoData.value.token) {
				loading.value = true;

				// 不再调用testAPI
				// 直接下载数据包
				try {
					const token = infoData.value.token;

					// 先检查本地是否已有数据
					let hasLocalData = false;
					let result;
					try {
						// 简化检测逻辑：只检查目录是否存在，不检查文件内容
						await new Promise((resolve, reject) => {
							plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
								entry.createReader().readEntries((entries) => {
									entries.forEach(item => {});

									// 简化检测逻辑：只检查目录是否存在，不检查文件内容
									let hasValidData = false;
									const currentUsername = userInfo.username;

									// 检查是否有project目录或包含当前用户名的目录
									for (const item of entries) {
										if (item.isDirectory) {

											// 如果存在project目录，认为有效
											if (item.name === 'project') {
												hasValidData = true;
												break;
											}

											// 检查目录名是否以UD开头（用户目录）
											if (item.name.startsWith('UD')) {
												// 提取目录名中的用户名部分（最后一个'-'后面的内容）
												const lastDashIndex = item.name
													.lastIndexOf('-');
												if (lastDashIndex !== -1 && lastDashIndex <
													item.name.length - 1) {
													const dirUsername = item.name
														.substring(lastDashIndex + 1);


													// 检查提取的用户名是否与当前用户名匹配
													if (currentUsername && dirUsername ===
														currentUsername) {
														hasValidData = true;

														// 设置已有用户名到store
														userInfo.setUDPath(item.name);
														break;
													}
												}
											}
										}
									}

									if (hasValidData) {

										hasLocalData = true;
									} else {

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

						// 检查失败，确保hasLocalData为false，继续尝试下载
						hasLocalData = false;
					}



					// 如果本地没有数据，则开始下载流程
					if (!hasLocalData) {


						// 移除确认对话框，直接下载
						try {
							// 生成新的进度条ID并设置为活跃状态
							const initTaskId = Date.now();
							currentProgressId.value = initTaskId;
							setActiveProgressId(initTaskId);


							// 显示下载进度提示，改为显示进度条
							showDownloadProgress.value = true;

							// 监听下载进度
							uni.$on('download-progress', (progress) => {
								// 检查是否是当前活跃的进度条
								if (!isActiveProgressId(currentProgressId.value)) {

									return;
								}

								// 不再使用showLoading，而是更新进度条
								downloadProgress.value = progress.progress || 0;

								// 如果有包大小信息，也更新它
								if (progress.packageSize) {


									// 确保packageSize是一个有效的数字
									const size = Number(progress.packageSize);
									if (!isNaN(size) && size > 0) {
										packageSize.value = size;

									} else {
										console.warn('接收到无效的包大小:', progress.packageSize);
									}
								}
							});

							// 监听解压进度
							uni.$on('unzip-progress', (progress) => {
								// 检查是否是当前活跃的进度条
								if (!isActiveProgressId(currentProgressId.value)) {

									return;
								}

								// 隐藏下载进度条，显示解压进度条
								showDownloadProgress.value = false;
								showUnzipProgress.value = true;
								unzipProgress.value = progress.progress || 0;
							});

							// 监听解压完成事件
							uni.$on('unzip-completed', (event) => {
								// 检查是否是当前活跃的进度条
								if (!isActiveProgressId(currentProgressId.value)) {

									return;
								}


								uni.$off('download-progress');
								uni.$off('unzip-progress');
								uni.$off('unzip-completed');
								showDownloadProgress.value = false;
								showUnzipProgress.value = false;

								// 清理进度条ID
								if (currentProgressId.value) {
									clearActiveProgressId(currentProgressId.value);
									currentProgressId.value = null;
								}

								// 不再自动复制object.json文件
							});

							// 添加超时处理
							const timeoutPromise = new Promise((_, reject) => {
								// 增加超时时间到10分钟
								const timeoutId = setTimeout(() => {


									// 检查_doc目录是否有内容，如果有则可能已经下载解压成功
									plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
										entry.createReader().readEntries((entries) => {
											if (entries.length > 0) {

												// 不触发reject，而是让下载继续
											} else {

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


									// 检查_doc目录是否存在有效数据
									try {
										const hasValidLocalData = await new Promise((resolve) => {
											plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
												entry.createReader().readEntries((entries) => {


													// 获取当前用户名
													const currentUsername = userInfo
														.username;


													// 标记是否找到匹配的用户目录
													let foundMatchingUserDir = false;

													// 检查是否有project目录或包含当前用户名的目录
													for (const item of entries) {
														if (item.isDirectory) {


															// 如果存在project目录，认为有效
															if (item.name === 'project') {

																foundMatchingUserDir =
																	true;
																break;
															}

															// 检查目录名是否以UD开头（用户目录）
															if (item.name.startsWith(
																	'UD')) {
																// 提取目录名中的用户名部分（最后一个'-'后面的内容）
																const lastDashIndex = item
																	.name.lastIndexOf('-');
																if (lastDashIndex !== -1 &&
																	lastDashIndex < item
																	.name.length - 1) {
																	const dirUsername =
																		item.name
																		.substring(
																			lastDashIndex +
																			1);


																	// 检查提取的用户名是否与当前用户名匹配
																	if (currentUsername &&
																		dirUsername ===
																		currentUsername) {

																		// 设置已有用户名到store
																		userInfo.setUDPath(
																			item.name);
																		foundMatchingUserDir
																			= true;
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

											result = {
												targetDir: '_doc/',
												tempPath: null,
												version: 'local'
											};
											hasLocalData = true;

											// 本地数据有效，尝试复制object.json文件

											// 移除自动复制代码
										} else {

											// 本地无数据，尝试直接下载
											throw downloadError; // 重新抛出错误，进入后续处理流程
										}
									} catch (checkError) {
										console.error('检查本地数据失败:', checkError);
										throw downloadError; // 重新抛出原始错误
									}
								}
								// 如果不是超时错误或本地无数据，尝试直接下载
								else if (downloadError.message && (downloadError.message.includes('400') ||
										downloadError.message.includes('URL'))) {
									// 尝试获取API数据
									const apiResult = await testDataPackageAPI(token);
									if (apiResult && apiResult.data) {
										// 处理包大小
										if (apiResult.data.packageSize) {
											const parsedSize = parsePackageSize(apiResult.data.packageSize);
											if (parsedSize) {
												packageSize.value = parsedSize;

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

																resolve(res.tempFilePath);
															} else {

																// 不立即拒绝，尝试使用directDownload
																directDownload(apiResult.data
																	.url, apiResult.data
																	.packageSize).then(
																	resolve).catch(reject);
															}
														},
														fail: (err) => {

															// 尝试使用directDownload作为备用方案

															directDownload(apiResult.data.url,
																	apiResult.data.packageSize)
																.then(resolve).catch(reject);
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


														// 设置解压超时保护
														let isResolved = false;
														const timeoutId = setTimeout(() => {
															if (!isResolved) {

																// 不立即拒绝，只记录日志
															}
														}, 30000); // 30秒超时检查

														plus.zip.decompress(
															tempPath,
															'_doc/',
															(progress) => {
																// 添加进度信息日志
																if (progress && progress.loaded &&
																	progress.total) {
																	const percent = Math.floor((
																		progress.loaded /
																		progress.total) * 100);

																} else {

																}
															},
															() => {

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
														plus.io.resolveLocalFileSystemURL('_doc/', (
															entry) => {
															entry.createReader().readEntries((
																entries) => {

																entries.forEach((item) => {

																});
																resolve();
															}, (err) => {
																console.error(
																	'读取_doc/目录失败:', err
																);
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

							result = {
								targetDir: '_doc/',
								tempPath: null,
								version: 'local'
							};
							hasLocalData = true;
						}
					} else {
						// 如果已经有本地数据，尝试复制object.json文件

						// 移除自动复制代码
					}



					// 如果是下载的数据，不再创建任何额外目录或文件
					if (!hasLocalData && userInfo.username) {
						try {
							// 直接使用解压后的原始文件夹，不做任何额外处理

						} catch (error) {
							console.error('处理解压后的文件时出错:', error);
						}
					}

					// 显示下载成功提示
					// uni.showToast({
					// 	title: hasLocalData ? '数据加载成功' : '数据下载成功',
					// 	icon: 'success',
					// 	duration: 2000
					// });
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
				const responseLogin = await uni.request({
					url: `${apiConfig.baseURL}${apiConfig.endpoints.login}?username=${username.value}&password=${password.value}`,
					method: 'POST'
				});
				infoData.value.token = responseLogin.data.token;
				// uni.showToast({
				// 	title: '登录信息无效，请重新登录',
				// 	icon: 'none'
				// });
			}
		} catch (error) {
			// 离线登录逻辑
			const allUsers = await readUserFolders();
			let foundUserData = false;

			for (const user of allUsers) {
				const hadUsernameArrBySplit = user.split('-');
				const hadUsername = hadUsernameArrBySplit[hadUsernameArrBySplit.length - 1];
				if (hadUsername === userInfo.username) {
					//已存在此用户 去读旧数据

					userInfo.setHadUsername(user); // 设置已存在的用户名到store


					// 离线模式下也设置UDPath，用于版本比较
					if (user.startsWith('UD')) {

						userInfo.setUDPath(user);
					}
					foundUserData = true;
					break;
				}
			}

			if (!foundUserData) {
				// 没有找到当前用户的数据，提示需要联网下载

				uni.showModal({
					title: '本地无数据',
					content: '检测到本地没有当前用户的数据包，请先联网登录下载数据包后再使用离线模式。',
					showCancel: false,
					confirmText: '返回登录',
					success: () => {
						// 清理用户数据，返回登录页面
						userInfo.clearUserData();
						uni.reLaunch({
							url: '/pages/LoginPage/LoginPage'
						});
					}
				});
				return; // 不继续执行后续逻辑
			}


			// uni.showToast({
			// 	title: '当前无网络，离线模式登录',
			// 	icon: 'none'
			// });

			// 离线模式下也尝试复制object.json文件

			// 移除自动复制代码
		} finally {
			try {
				//不论有没有网，都从本地读取project


				// 直接尝试读取项目数据，不做文件检查
				try {
					const localProjectsAsync = await getProject(userInfo.username);
					data.value = localProjectsAsync;


					// 确保data.value包含projects数组
					if (data.value && data.value.projects && Array.isArray(data.value.projects)) {
						// 获取项目数据
						const projectsData = data.value.projects;




						// 检查是否是离线模式（有hadUsername）
						if (userInfo.hadUsername) {

							await getProjectsTasksByHadUsername(projectsData, userInfo.hadUsername);
						} else {

							await getProjectsTasks(projectsData);
						}



						// 提取并处理年份
						const repeatYears = projectsData
							.map(item => Number(item.year))
							.filter(year => !isNaN(year));

						// 去重并降序排序
						years.value = [...new Set(repeatYears)].sort((a, b) => b - a);

						if (years.value.length > 0) {
							currentYear.value = years.value[0];

						} else {
							// 如果没有有效年份，使用当前年份
							const thisYear = new Date().getFullYear();
							years.value = [thisYear];
							currentYear.value = thisYear;

						}
					} else {

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

	// 创建一个计算属性来映射项目ID到任务数量
	const projectTasksMap = computed(() => {

		const map = new Map();
		if (Array.isArray(filteredProjectsTasks.value)) {
			filteredProjectsTasks.value.forEach(item => {

				map.set(item.projectId, item.tastsNumber || 0);
			});
		}

		return map;
	});

	const projectCommitedTasksMap = computed(() => {

		const map = new Map();
		if (Array.isArray(filteredProjectsTasks.value)) {
			filteredProjectsTasks.value.forEach(item => {

				map.set(item.projectId, item.commitedNum || 0);
			});
		}

		return map;
	});

	// 同步获取任务数量的函数
	const getTasksNumber = (id) => {
		const result = projectTasksMap.value.get(id) || 0;

		return result;
	};

	// 同步获取任务数量的函数
	const getCommitedTasksNumber = (id) => {
		return projectCommitedTasksMap.value.get(id) || 0;
	};

	// 监听 filteredProjectsTasks 的变化
	watch(filteredProjectsTasks, (newVal) => {

		newVal.forEach(item => {

		});
	}, {
		deep: true
	});

	//获取year的函数
	// const getYear = (objects[]) => {
	// 	for (int i = 0; i < objects.length; i++) {

	// 	}
	// }

	// 修改changeYear函数
	const changeYear = (e) => {
		selectedYearIndex.value = e.detail.value;
		currentYear.value = years.value[selectedYearIndex.value];

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
		// 清空之前的数据，避免重复
		filteredProjectsTasks.value = [];

		for (const item of projects) {
			try {
				//读取本地task

				const taskGetWithProjectId = await getTask(userInfo.username, item.id)

				// 确保data和tasks存在
				const tasksCount = taskGetWithProjectId?.tasks?.length || 0;
				const commitedNum = await getBuildingCommitedNumber(userInfo.username, item.id)

				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: tasksCount,
					commitedNum: commitedNum
				});

			} catch (error) {
				console.error(`获取项目 ${item.id} 的任务失败:`, error);
				// 添加错误处理，确保即使一个项目失败也不会影响其他项目
				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: 0,
					commitedNum: 0
				});
			}
		}
	}

	const getProjectsTasksByHadUsername = async (projects, hadUsername) => {
		// 清空之前的数据，避免重复
		filteredProjectsTasks.value = [];

		for (const item of projects) {
			try {
				//读取本地task

				const taskGetWithProjectId = await getTaskByHadUsername(hadUsername, item.id)
				const commitedNum = await getBuildingCommitedNumber(hadUsername, item.id)

				// 确保data和tasks存在
				const tasksCount = taskGetWithProjectId?.data?.tasks?.length || 0;
				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: tasksCount,
					commitedNum: commitedNum
				});

			} catch (error) {

				// 添加错误处理，确保即使一个项目失败也不会影响其他项目
				filteredProjectsTasks.value.push({
					projectId: item.id,
					tastsNumber: 0,
					commitedNum: 0
				});
			}
		}
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

				return `${Math.floor(downloadProgress.value || 0)}%`;
			}

			// 确保downloadProgress有效
			const progress = downloadProgress.value || 0;

			// 计算已下载的MB数和总MB数
			const total = packageSize.value / (1024 * 1024);
			const downloaded = (progress * packageSize.value / 100) / (1024 * 1024);

			// 检查计算结果是否有效
			if (isNaN(downloaded) || isNaN(total)) {

				return `${Math.floor(progress)}%`;
			}

			// 返回格式化的字符串
			return `${downloaded.toFixed(2)}MB / ${total.toFixed(2)}MB`;
		} catch (error) {
			console.error('计算下载大小时出错:', error);
			return `${Math.floor(downloadProgress.value || 0)}%`;
		}
	});



	onMounted(async () => {
		// 重置版本检查标志，允许重新检查
		hasCheckedVersion.value = false;

		// 初始化进度条状态
		currentProgressId.value = null;
		showDownloadProgress.value = false;
		showUnzipProgress.value = false;
		isDownloading.value = false;
		// 设置屏幕常亮
		uni.setKeepScreenOn({
			keepScreenOn: true,
			success: function() {},
			fail: function(err) {}
		});

		await init();

		// 设置进度监听
		watch(downloadProgress, (newValue) => {
			uni.$emit('download-progress', {
				progress: newValue
			});
		});

		watch(unzipProgress, (newValue) => {
			uni.$emit('unzip-progress', {
				progress: newValue
			});
		});

		uni.$on('getCommitedNum', getCommitedNum);

		// 取消屏幕常亮
		uni.setKeepScreenOn({
			keepScreenOn: false
		});
	});
	const getCommitedNum = async (projectId) => {
		const commitedNum = await getBuildingCommitedNumber(userInfo.username, projectId);
		for (let i = 0; i < filteredProjectsTasks.value.length; i++) {
			if (filteredProjectsTasks.value[i].projectId === projectId) {
				filteredProjectsTasks.value[i].commitedNum = commitedNum;
			}
		}
	};

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

	onUnmounted(async () => {
		/*// 取消屏幕常亮
		uni.setKeepScreenOn({
		  keepScreenOn: false
		});*/

		// 清理下载相关状态
		cleanupDownloadListeners();

		// 如果当前页面的进度条是活跃状态，则清理全局活跃状态
		if (currentProgressId.value) {
			clearActiveProgressId(currentProgressId.value);
		}

		// 重置当前页面的状态
		showDownloadProgress.value = false;
		showUnzipProgress.value = false;
		isDownloading.value = false;
		currentProgressId.value = null;
	})

	// 测试数据包API接口
	// 测试数据包API接口函数已删除，直接使用testDataPackageAPI
</script>

<style scoped lang="scss">
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
			border-bottom: 1px solid #d0d0d0;
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

	/* 手机端适配 */
	@media (max-width: 599px) {
		.info-card {
			.info-boxes {
				.info-box {
					.label {
						font-size: 22rpx;
					}

					.value {}

					&:first-child {
						width: 50%;
						margin-left: 0px;

						.value {
							font-size: 26rpx;
						}
					}

					&:nth-child(2) {
						// width: 19%;
						flex: 1;

						.value {
							font-size: 26rpx;
						}
					}

					&:last-child {
						// width: 19%;
						flex: 1;
						margin-right: 0px;

						.value {
							font-size: 26rpx;
						}
					}
				}
			}
		}

		.bridge-list {
			.bridge-item {
				.bridge-info {
					.bridge-code {
						font-size: 20rpx;
					}

					.bridge-name {
						font-size: 24rpx;
					}

					.bridge-location {
						font-size: 20rpx;
					}
				}

				.bridge-meta {
					.text-group {
						.bridge-status {
							font-size: 24rpx;
						}

						.bridge-progress {
							font-size: 20rpx;
							margin: 4px 0;
						}
					}

					image {
						width: 24rpx;
						height: 24rpx;
					}
				}
			}
		}
	}
</style>
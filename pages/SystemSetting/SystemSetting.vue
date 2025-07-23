<template>
	<view class='System'>
    <!-- <LoadingMask v-if="loading" text="正在更新线上完整数据..." /> -->

    <!-- 下载进度条 -->
    <view class="download-progress-container" v-if="showDownloadProgress">
      <view class="progress-header">
        <text class="progress-title">正在下载数据包</text>
        <text class="progress-percent">{{ Math.floor(downloadProgress) }}%</text>
      </view>
      <view class="progress-bar-bg">
        <view class="progress-bar-fill" :style="{ width: downloadProgress + '%' }"></view>
      </view>
      <view class="progress-info">
        <text>下载中，请稍候...</text>
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
		<view class="main">
			<view class="titleBar">
				<image src="/static/image/user1.png" class="avatar"></image>
				<view class="textContainer">
					<view class="code">{{userAccount}}</view>
					<view class="name">{{name}}</view>
				</view>
				<view class="button">
					<button size="default" type="default" hover-class="is-hover"
						@click="openPasswordModal">修改密码</button>
					<button size="default" type="default" hover-class="is-hover" @click="handleLogout">退出登录</button>
				</view>
			</view>
		</view>
		<!-- <view class="model">
			<view class="modelTitle">运行模式</view>
			<view class="switchContainer">
				<view class="title">离线</view>
				<view>
					<switch name="switch" />
				</view>
				<view class="title">在线</view>
			</view>
		</view> -->
		<view class="divider"></view>
		<view class="versionData">
			<view class="versionTitle">当前本地数据包版本</view>
			<view class="versionNumber">{{currentDataVersion}}</view>
		</view>
		<view class="versionData">
			<view class="versionTitle">当前下载数据包版本</view>
			<view class="versionNumber">{{currentDataVersionD}}</view>
		</view>
    <view class="divider"></view>
    <view class="inData">
      <view class="inDataTitle">更新在线数据</view>
      <button size="default" type="default" class="functionButton" hover-class="is-hover"
              @click="handleUnpdate">检查更新</button>
    </view>
<!--		<view class="divider"></view>
		<view class="inData">
			<view class="inDataTitle">本地数据导入</view>
			<button size="default" type="default" class="functionButton" hover-class="is-hover"
				@click="handleLogin">数据导入</button>
		</view>
		<view class="divider"></view>
		<view class="outData">
			<view class="outDataTitle">本地数据导出</view>
			<button size="default" type="default" class="functionButton" hover-class="is-hover"
				@click="handleLogin">数据导出</button>
		</view>-->
		<view class="divider"></view>
		<view class="versionApp">
			<view class="appTitle">当前应用版本</view>
			<view>{{versionNumber}}</view>
			<button size="default" type="default" class="functionButton" hover-class="is-hover"
				@click="onClickUpdate">版本更新</button>
		</view>
		
		<!-- 添加修改密码弹窗 -->
		<uni-popup ref="passwordPopup" type="center">
			<view class="password-popup-content">
				<view class="popup-title">修改密码</view>
				<view class="password-form">
					<view class="password-row">
						<text class="password-label">旧密码</text>
						<input type="password" v-model="oldPassword" placeholder="请输入旧密码" class="password-input" />
					</view>
					<view class="password-row">
						<text class="password-label">新密码</text>
						<input type="password" v-model="newPassword" placeholder="请输入新密码" class="password-input" />
					</view>
					<view class="password-row">
						<text class="password-label">确认新密码</text>
						<input type="password" v-model="confirmPassword" placeholder="请再次输入新密码"
							class="password-input" />
					</view>
				</view>
				<view class="popup-buttons">
					<button class="popup-btn cancel-btn" @click="closePasswordModal">取消</button>
					<button class="popup-btn confirm-btn" @click="changePassword">确定</button>
				</view>
			</view>
		</uni-popup>

		<!-- 版本更新弹窗 -->
		<updateVersionWindow
			:visible="showUpdateModal"
			:title="updateModalTitle"
			:content="updateModalContent"
			@confirm="handleUpdateConfirm"
			@cancel="handleUpdateCancel"
		/>
	</view>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		async
	} from 'rxjs';
  import {
    userStore
  } from '@/store/index.js'
  import {downloadProjects, getAllDataAndSetToLocal} from '@/utils/request'
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
	// 导入下载工具
	import { useDownloader, parsePackageSize } from '@/utils/downloadUtils.js'
	// 导入版本更新弹窗组件
	import updateVersionWindow from '@/components/updateVersionWindow.vue'

	// 获取用户信息
	const userInfo = userStore();

	// 引入下载器
	const { downloadProgress, unzipProgress, resetProgress, currentTaskId } = useDownloader();

	// 密码相关变量
	const passwordPopup = ref(null);
	const oldPassword = ref('');
	const newPassword = ref('');
	const confirmPassword = ref('');
	const name = ref('未知用户');
	const userAccount = ref('unknownAccount')
	//版本号
	const versionNumber = ref('v1')
	// 打开修改密码弹窗
	const openPasswordModal = () => {
		// 清空输入框
		oldPassword.value = '';
		newPassword.value = '';
		confirmPassword.value = '';
		// 打开弹窗
		passwordPopup.value.open();
	};

  // 使用计算属性来响应 store 变化
  const currentDataVersion = computed(() => {
    return userInfo.ULPath || '-';
  });

  const currentDataVersionD = computed(() => {
    return userInfo.UDPath || '-';
  });
	// 关闭修改密码弹窗
	const closePasswordModal = () => {
		passwordPopup.value.close();
	};

  const infoData = ref({});
  const loading = ref(false);

  // 添加进度条显示控制变量
  const showDownloadProgress = ref(false);
  const showUnzipProgress = ref(false);
  const packageSize = ref(null);
  const isDownloading = ref(false);

  // 版本更新弹窗相关变量
  const showUpdateModal = ref(false);
  const updateModalTitle = ref('发现新版本');
  const updateModalContent = ref('');
  const updateConfirmResolve = ref(null);
  const testButton = ()=>{
	  uni.navigateTo({
	  	url: '/pages/test/test'
	  });
  }

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

  // 重置下载状态
  const resetDownloadState = () => {
    console.log('重置下载状态');
    resetProgress();
    showDownloadProgress.value = false;
    showUnzipProgress.value = false;
    packageSize.value = null;
    isDownloading.value = false;
  };

  // 清理事件监听器
  const cleanupDownloadListeners = () => {
    console.log('清理下载事件监听器');
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
          console.log('检查_doc/目录内容，寻找解压后的目录:');

          // 查找最新的UD开头的目录
          const udDirs = entries
            .filter(e => e.isDirectory && e.name.startsWith('UD'))
            .sort((a, b) => {
              // 按目录名排序，最新的在前
              return b.name.localeCompare(a.name);
            });

          if (udDirs.length > 0) {
            const latestDir = udDirs[0].name;
            console.log('找到最新的UD目录:', latestDir);
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
              console.log('找到其他目录:', dirName);
              resolve(dirName);
            } else {
              console.log('未找到合适的解压目录');
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

  // 删除旧目录
  const deleteOldDirectory = (dirPath) => {
    return new Promise((resolve, reject) => {
      console.log('准备删除目录:', dirPath);

      plus.io.resolveLocalFileSystemURL(dirPath, (entry) => {
        if (entry.isDirectory) {
          entry.removeRecursively(() => {
            console.log('目录删除成功:', dirPath);
            resolve();
          }, (err) => {
            console.error('目录删除失败:', dirPath, err);
            reject(err);
          });
        } else {
          console.error('路径不是目录:', dirPath);
          reject(new Error('路径不是目录'));
        }
      }, (err) => {
        console.error('解析目录路径失败:', dirPath, err);
        // 如果目录不存在，也认为删除成功
        if (err.code === 1) { // NOT_FOUND_ERR
          console.log('目录不存在，无需删除:', dirPath);
          resolve();
        } else {
          reject(err);
        }
      });
    });
  };

  // 下载并解压数据包
  const downloadAndUnzipPackage = async (url, packageSizeStr, version) => {
    try {
      // 检查是否已经有下载任务在进行
      if (isDownloading.value) {
        console.log('已有下载任务在进行，跳过新的下载请求');
        return;
      }

      // 先清理之前的状态和监听器
      cleanupDownloadListeners();
      resetDownloadState();

      // 设置下载状态
      isDownloading.value = true;
      const taskId = Date.now();

      // 显示下载进度条
      showDownloadProgress.value = true;

      console.log('开始下载数据包，URL:', url);
      console.log('包大小:', packageSizeStr);
      console.log('版本:', version);

      // 解析包大小
      const parsedSize = parsePackageSize(packageSizeStr);
      if (parsedSize) {
        packageSize.value = parsedSize;
        console.log(`解析后的包大小: ${(parsedSize / (1024 * 1024)).toFixed(2)}MB`);
      }

      // 监听下载进度
      uni.$on('download-progress', (progress) => {
        if (!isDownloading.value) {
          console.log('忽略过期的下载进度事件');
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
        if (!isDownloading.value) {
          console.log('忽略过期的解压进度事件');
          return;
        }

        showDownloadProgress.value = false;
        showUnzipProgress.value = true;
        unzipProgress.value = progress.progress || 0;
      });

      // 监听解压完成事件
      uni.$on('unzip-completed', async () => {
        if (!isDownloading.value) {
          console.log('忽略过期的解压完成事件');
          return;
        }

        console.log('收到解压完成事件，关闭进度条');
        cleanupDownloadListeners();
        resetDownloadState();

        try {
          // 查找解压后的实际目录
          const actualDirName = await findActualUnzippedDir();
          if (actualDirName) {
            console.log('找到解压后的实际目录:', actualDirName);

            // 删除旧的UD目录（如果存在）
            const oldUDPath = userInfo.UDPath;
            if (oldUDPath && oldUDPath !== actualDirName) {
              console.log('准备删除旧目录:', oldUDPath);
              try {
                await deleteOldDirectory(`_doc/${oldUDPath}`);
                console.log('成功删除旧目录:', oldUDPath);
              } catch (error) {
                console.error('删除旧目录失败:', error);
                // 继续执行，不中断流程
              }
            }

            // 更新用户的UDPath为实际解压的目录
            userInfo.setUDPath(actualDirName);
            console.log('已更新UDPath为实际目录:', actualDirName);
          } else {
            console.log('未找到解压后的实际目录，使用时间戳生成目录名');
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
            console.log('已更新UDPath为时间戳生成的目录:', dirName);
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
      console.log('下载完成，临时文件路径:', tempPath);

      // 开始解压
      console.log('开始解压文件到 _doc/');
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

  // 下载文件函数
  const downloadFile = (url, packageSizeParam, taskId) => {
    return new Promise((resolve, reject) => {
      console.log('开始下载文件:', url);

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
            console.log('下载成功，临时文件路径:', res.tempFilePath);
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
          const totalSize = e.totalBytesExpectedToWrite > 0 ? e.totalBytesExpectedToWrite : TOTAL_FILE_SIZE;
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

  // 解压文件函数 - 参考bridge页面的优化实现
  const unzipFile = (zipPath, targetDir, taskId) => {
    return new Promise((resolve, reject) => {
      console.log('开始解压文件:', zipPath, '到', targetDir);

      let isResolved = false;

      // 添加强制完成定时器，大幅缩短检查时间
      const forceCompleteTimeoutId = setTimeout(() => {
        if (!isResolved) {
          console.log('解压可能已完成，正在检查文件系统');
          isResolved = true;

          // 检查_doc目录是否有内容，验证解压是否成功
          plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
            entry.createReader().readEntries((entries) => {
              console.log('解压后_doc/目录内容:', entries.length, '个项目');
              if (entries.length > 0) {
                console.log('目录不为空，解压已成功');
                // 发送解压完成事件
                uni.$emit('unzip-completed', { taskId: taskId });
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
        console.log(`轮询检查解压状态 (${checkCount}/${maxChecks})...`);

        plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
          entry.createReader().readEntries((entries) => {
            // 检查是否有project目录或其他关键目录，表明解压已完成
            const hasKeyDirectories = entries.some(e =>
              e.isDirectory && (e.name === 'project' || e.name.startsWith('UD'))
            );

            if (hasKeyDirectories) {
              console.log('发现关键目录，解压已完成');
              if (!isResolved) {
                isResolved = true;
                clearTimeout(forceCompleteTimeoutId);
                clearInterval(checkInterval);
                uni.$emit('unzip-completed', { taskId: taskId });
                resolve(targetDir);
              }
            } else if (checkCount >= maxChecks) {
              console.log('达到最大检查次数，停止轮询');
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
            uni.$emit('unzip-progress', { progress: progressPercent, taskId: taskId });
            console.log('解压进度:', progressPercent);

            // 如果进度达到100%，也可以认为解压已完成
            if (progressPercent >= 100 && !isResolved) {
              console.log('进度达到100%，解压已完成');
              isResolved = true;
              clearTimeout(forceCompleteTimeoutId);
              clearInterval(checkInterval);
              uni.$emit('unzip-completed', { taskId: taskId });
              resolve(targetDir);
            }
          } else {
            console.log('解压进行中...', Date.now());
          }
        },
        () => {
          console.log('解压完成回调被触发');
          // 解压完成时发送事件
          if (!isResolved) {
            uni.$emit('unzip-completed', { taskId: taskId });
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
  // 判断目录1是否大于目录2
  function compareUDDirectories(dir1, dir2) {
      // 定义正则表达式匹配目录中的时间戳部分（14位数字）
      const timestampRegex = /UD-(\d{14})-/;
      
      // 从第一个目录名中提取时间戳
      const match1 = dir1.match(timestampRegex);
      if (!match1 || !match1[1]) {
          throw new Error(`无效的目录格式: ${dir1}`);
      }
      const timestamp1 = match1[1];
      
      // 从第二个目录名中提取时间戳
      const match2 = dir2.match(timestampRegex);
      if (!match2 || !match2[1]) {
          throw new Error(`无效的目录格式: ${dir2}`);
      }
      const timestamp2 = match2[1];
      
      // 比较两个时间戳字符串（直接字符串比较即可，因为它们都是固定长度的数字）
      return timestamp1 > timestamp2;
  }
  const handleUnpdate = async () => {
    try {
      infoData.value = userInfo.infoData;

      if (!infoData.value.token) {
        uni.showToast({
          title: '登录信息无效，请重新登录',
          icon: 'none'
        });
        return;
      }

      loading.value = true;

      // 1.根据url版本号与本地UD目录的版本号的相对大小来判断是否有更新内容
      console.log('开始检查数据包版本...');
      const response = await uni.request({
        url: 'http://60.205.13.156:8090/api/user/dataPackage',
        method: 'GET',
        header: {
          'Authorization': `${infoData.value.token}`
        }
      });

      console.log('API响应:', response.data);

      if (response.statusCode !== 200 || response.data.code !== 0) {
        throw new Error(response.data?.msg || '获取数据包信息失败');
      }

      const { url, version, packageSize: apiPackageSize } = response.data;
      console.log('当前数据包版本:', version);
      console.log('压缩包URL:', url);
      console.log('包大小:', apiPackageSize);

      const dirNew = version;
      const dirOld = userInfo.UDPath;
      console.log('本地数据包版本:', dirOld);

      // 如果本地版本小于获取的版本 触发更新
      if (!dirOld || compareUDDirectories(dirNew, dirOld)) {
        console.log('检测到新版本，开始下载更新...');

        // 显示确认对话框
        const confirmResult = await showUpdateConfirmModal(
          '发现新版本',
          `检测到新的数据包版本 ${version}，是否立即更新？`
        );

        if (confirmResult) {
          // 开始下载和解压
          await downloadAndUnzipPackage(url, apiPackageSize, version);
        }
      } else {
        uni.showToast({
          title: '已是最新版本',
          icon: 'success',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('检查更新失败:', error);
      uni.showModal({
        title: '检查更新失败',
        content: error.message || '检查更新时发生错误，请稍后重试',
        showCancel: false
      });
    } finally {
      loading.value = false;
    }
  };

	// 退出登录
	const handleLogout = async () => {
		try {
			// 显示加载中
			uni.showLoading({
				title: '退出中...'
			});

			// 先获取token
			const responseLogin = await uni.request({
				url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
				method: 'POST'
			});

			if (!responseLogin.data || !responseLogin.data.token) {
				uni.hideLoading();
				// 如果无法获取token，清理用户数据并跳转到登录页面
				userInfo.clearUserData();
				uni.reLaunch({
					url: '/pages/LoginPage/LoginPage'
				});
				return;
			}
			const token = responseLogin.data.token;

			// 向后端发送退出登录请求
			const response = await uni.request({
				url: 'http://60.205.13.156:8090/api/user/logOut',
				method: 'POST',
				header: {
					'Content-Type': 'application/json',
					'Authorization': `${token}`
				}
			});

			uni.hideLoading();

			console.log('退出登录响应:', response.data);

			// 根据返回的code判断是否成功退出
			if (response.data && response.data.code === 0) {
				// 退出成功，清理用户数据
				userInfo.clearUserData();

				uni.showToast({
					title: '已退出登录',
					icon: 'success',
					duration: 1500,
					success: () => {
						// 跳转到登录页面
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/LoginPage/LoginPage'
							});
						}, 1500);
					}
				});
			} else {
				// 退出失败
				uni.showToast({
					title: response.data?.msg || '退出登录失败',
					icon: 'none',
					duration: 1500
				});
			}

		} catch (error) {
			uni.hideLoading();
			console.error('退出登录出错:', error);

			// 出错时也清理用户数据并跳转到登录页面
			userInfo.clearUserData();

			uni.showToast({
				title: '退出登录中出现错误',
				icon: 'none',
				duration: 1500,
				success: () => {
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/LoginPage/LoginPage'
						});
					}, 1500);
				}
			});
		}
	};

	// 修改密码
	const changePassword = async () => {
		// 验证输入
		if (!oldPassword.value) {
			uni.showToast({
				title: '请输入旧密码',
				icon: 'none'
			});
			return;
		}
		if (!newPassword.value) {
			uni.showToast({
				title: '请输入新密码',
				icon: 'none'
			});
			return;
		}
		if (newPassword.value !== confirmPassword.value) {
			uni.showToast({
				title: '两次输入的新密码不一致',
				icon: 'none'
			});
			return;
		}

		// 显示加载中
		uni.showLoading({
			title: '修改中...'
		});

		try {
			// 先获取token
			const responseLogin = await uni.request({
				url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${oldPassword.value}`,
				method: 'POST'
			});

			console.log('登录响应:', responseLogin.data);

			// 检查是否获取到token
			if (!responseLogin.data || !responseLogin.data.token) {
				uni.hideLoading();
				uni.showToast({
					title: '旧密码验证失败',
					icon: 'none'
				});
				return;
			}

			const token = responseLogin.data.token;

			// 向后端发送修改密码请求
			const response = await uni.request({
				url: `http://60.205.13.156:8090/api/user/resetPassword?oldPassword=${oldPassword.value}&newPassword=${newPassword.value}`,
				method: 'POST',
				header: {
					'Content-Type': 'application/json',
					'Authorization': `${token}`
				}
			});

			// 隐藏加载中
			uni.hideLoading();

			console.log('修改密码响应:', response.data);

			// 检查响应状态
			if (response.data && response.data.code === 0) {
				// 关闭弹窗
				passwordPopup.value.close();

				// 清理用户数据
				userInfo.clearUserData();

				// 显示成功提示
				uni.showToast({
					title: '密码修改成功，请重新登录',
					icon: 'success',
					duration: 2000,
					success: () => {
						// 延迟跳转到登录页面，让用户看到提示
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/LoginPage/LoginPage'
							});
						}, 2000);
					}
				});
			} else {
				// 显示错误信息
				uni.showToast({
					title: response.data?.msg || '修改密码失败',
					icon: 'none'
				});
			}
		} catch (error) {
			// 隐藏加载中
			uni.hideLoading();

			console.error('修改密码出错:', error);
			uni.showToast({
				title: '网络错误，请稍后重试',
				icon: 'none'
			});
		}
	};

	const onClickUpdate = () => {
		// 显示检查中的提示
		uni.showLoading({
			title: '正在检查更新...',
			mask: true
		});

		// 检查当前环境
		const sysInfo = uni.getSystemInfoSync();
		if (sysInfo.platform === 'devtools') {
			uni.hideLoading();
			uni.showToast({
				title: '开发环境无法检查更新',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		// 获取当前版本号
		const currentVersion = versionNumber.value || sysInfo.appVersion || '1.0.0';
		console.log('当前应用版本:', currentVersion);
		console.log('当前系统信息:', sysInfo);

		// 先检查是否能获取到widgetInfo.version，避免调用checkUpdate时出错
		if (typeof plus !== 'undefined' && plus.runtime) {
			plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
				console.log('widgetInfo:', widgetInfo);

				if (!widgetInfo.version) {
					// 如果无法获取widgetInfo.version，直接显示当前是最新版本
					uni.hideLoading();
					uni.showToast({
						title: '已是最新版本',
						icon: 'success',
						duration: 2000
					});
					return;
				}

				// 如果能获取到版本信息，则调用checkUpdate
				try {
					checkUpdate()
						.then(result => {
							uni.hideLoading();
							console.log('版本检查结果:', result);

							// 如果code为0，表示当前已是最新版本
							if (result && result.code === 0) {
								uni.showToast({
									title: '已是最新版本',
									icon: 'success',
									duration: 2000
								});
							}
							// 其他情况由checkUpdate函数内部处理
						})
						.catch(error => {
							uni.hideLoading();
							console.error('检查更新失败:', error);

							// 显示友好的错误信息
							uni.showToast({
								title: '已是最新版本',
								icon: 'success',
								duration: 2000
							});
						});
				} catch (e) {
					uni.hideLoading();
					console.error('执行检查更新时出错:', e);

					uni.showToast({
						title: '已是最新版本',
						icon: 'success',
						duration: 2000
					});
				}
			});
		} else {
			// 如果plus环境不可用，直接显示当前是最新版本
			uni.hideLoading();
			uni.showToast({
				title: '已是最新版本',
				icon: 'success',
				duration: 2000
			});
		}
	}

	//版本比较函数
	const compareVersion = (v1, v2) => {
		// 去掉前缀 v
		v1 = v1.replace(/^v/, '');
		v2 = v2.replace(/^v/, '');

		// 补年份（可选，如果你的年份只有两位，可以补成四位）
		// 假设 v1: 25-05-20 -> 2025-05-20
		const fullV1 = '20' + v1;
		const fullV2 = '20' + v2;

		// 转成日期对象或字符串比较
		if (fullV1 > fullV2) return 1;
		if (fullV1 < fullV2) return -1;
		return 0;
	}

	//下载并安装
	const downloadAndInstall = (url) => {
		uni.showLoading({
			title: '下载中...',
			mask: true
		});
		const dtask = plus.downloader.createDownload(url, {
			filename: "_doc/update/"
		}, (d, status) => {
			uni.hideLoading();
			if (status == 200) {
				console.log("下载成功：" + d.filename);
				plus.runtime.install(d.filename, {}, () => {
					console.log("安装成功");
					plus.runtime.restart();
				}, (e) => {
					console.error("安装失败：" + e.message);
					uni.showToast({
						title: '安装失败',
						icon: 'none'
					});
				});
			} else {
				console.error("下载失败：" + status);
				uni.showToast({
					title: '下载失败',
					icon: 'none'
				});
			}
		});
		dtask.start();
	}

	onMounted(() => {
		userAccount.value = userInfo.username
		// 获取版本号
		if (typeof plus !== 'undefined') {
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				versionNumber.value = wgtinfo.version;
			});
		} else {
			// H5 调试时可能没有 plus
			versionNumber.value = '开发模式';
		}
	})
	onMounted(async () => {
		try {
			const responseLogin = await uni.request({
				url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
				method: 'POST'
			});
			name.value = responseLogin.data.userName;
		} catch (error) {
			console.error('用户数据请求失败');
		}
	})
</script>

<style lang="scss" scoped>
	.System {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main {
		height: 20vh;
		background-color: #BDCBE0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 20rpx;
	}

	.titleBar {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 20rpx;
		margin-left: 30px;
	}

	.avatar {
		width: 70px;
		height: 70px;
		background-color: #ffffff !important;
		display: block;
		position: relative;
		z-index: 1;
	}

	.textContainer {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.code {
		font-size: 16rpx;
		color: #333333;
	}

	.name {
		font-size: 14rpx;
		color: #999999;
	}

	.button {
		display: flex;
		gap: 20rpx;
		margin-left: auto;
	}

	.button button {
		height: 32rpx;
		width: 84rpx;
		padding: 4rpx 12rpx;
		padding-top: 5rpx;
		color: #ffffff;
		background-color: var(--primary-color);
		font-size: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.model {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: 10px;
		height: 48px;
	}

	.switchContainer {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: auto;
		margin-right: 10px;
	}

	.modelTitle {
		font-size: 20rpx;
		color: #666666;
	}

	.title {
		font-size: 20rpx;
		color: #333333;
	}

	.divider {
		display: none;
	}

	.versionData {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: 10px;
		margin-right: 10px;
		height: 48px;
	}

	.versionTitle {
		font-size: 20rpx;
		color: #666666;
	}

	.versionNumber {
		font-size: 20px;
		color: #333333;
		margin-left: auto;
		margin-right: 0;
	}

	.versionApp {
		display: flex;
		align-items: center;
		margin-right: 10px;
		height: 48px;
	}

	.appTitle {
		font-size: 20rpx;
		color: #666666;
		margin-left: 10px;
	}

	.versionApp view:nth-child(2) {
		font-size: 20rpx;
		color: #333333;
		margin-left: auto;
		margin-right: 20px;
	}

	.versionApp button {
		margin-left: 0 !important;
	}

	.inData {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10rpx;
		height: 48px;
		box-sizing: border-box;
	}

	.inDataTitle {
		font-size: 20rpx;
		color: #666666;
	}

	.functionButton {
		color: #ffffff;
		background-color: #1677ff;
		height: 32rpx;
		width: 84rpx;
		padding: 4rpx 12rpx;
		padding-top: 5rpx;
		font-size: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
	}

	.outData {
		display: flex;
		align-items: center;
		margin-left: 10px;
		margin-right: 10px;
		height: 48px;
	}

	.outDataTitle {
		font-size: 20px;
		color: #666666;
	}

	.outData button {
		margin-left: auto !important;
	}

	// 修改密码弹窗样式
	.password-popup-content {
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

	.password-form {
		padding: 20rpx;
	}

	.password-row {
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.password-label {
		font-size: 20rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.password-input {
		border: 1px solid #ddd;
		border-radius: 5rpx;
		height: 60rpx;
		padding: 0 10rpx;
		font-size: 20rpx;
	}

	.popup-buttons {
		display: flex;
		border-top: 1px solid #eee;
	}

	.popup-btn {
		flex: 1;
		height: 80rpx;
		border-radius: 0;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cancel-btn {
		background-color: #f5f5f5;
		color: #333;
	}

	.confirm-btn {
		background-color: #1677ff;
		color: #fff;
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
		color: #1677ff;
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
		background-color: #1677ff;
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
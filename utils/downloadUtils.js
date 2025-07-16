 // downloadUtils.js
 import { ref } from 'vue';
 import {userStore} from '@/store/index'
 // 导入writeObjectJson函数
 import { writeObjectJson } from './write.js';

 // 全局配置
 const HOST = '60.205.13.156';
 const PORT = 8090;
 const API_URL = `http://${HOST}:${PORT}/api/user/dataPackage`;
 
 // 辅助函数：解析包大小字符串为字节数
 export function parsePackageSize(sizeStr) {
   if (!sizeStr) return null;
   
   try {
     // 如果已经是数字，直接返回
     if (typeof sizeStr === 'number') return sizeStr;
     
     // 尝试直接转换为数字
     const directNumber = Number(sizeStr);
     if (!isNaN(directNumber)) return directNumber;
     
     // 解析字符串格式，如"420.661MB"
     const match = String(sizeStr).match(/^([\d.]+)\s*([KMGT]?B)$/i);
     if (match) {
       const size = parseFloat(match[1]);
       const unit = match[2].toUpperCase();
       
       if (isNaN(size)) return null;
       
       switch (unit) {
         case 'B':
           return size;
         case 'KB':
           return size * 1024;
         case 'MB':
           return size * 1024 * 1024;
         case 'GB':
           return size * 1024 * 1024 * 1024;
         case 'TB':
           return size * 1024 * 1024 * 1024 * 1024;
         default:
           return null;
       }
     }
     
     return null;
   } catch (error) {
     console.error('解析包大小字符串失败:', error);
     return null;
   }
 }
 
 // 导出测试函数，用于直接测试API
 export async function testDataPackageAPI(token) {
   if (!token) throw new Error('未提供token参数');
   
   try {
     console.log('开始测试数据包API接口');
     console.log('API地址:', API_URL);
     console.log('请求头Authorization:', token.substring(0, 10) + '...');
     
     const res = await uni.request({
       url: API_URL,
       header: { 'Authorization': token },
       timeout: 15000
     });
     
     console.log('API响应状态码:', res.statusCode);
     console.log('API响应头:', JSON.stringify(res.header, null, 2));
     console.log('API响应数据:', JSON.stringify(res.data, null, 2));
     
     // 检查并记录包大小
     if (res.data && res.data.packageSize) {
       console.log(`数据包大小: ${(res.data.packageSize / (1024 * 1024)).toFixed(2)}MB`);
     } else {
       console.log('API响应中未包含packageSize信息');
     }
     
     return {
       statusCode: res.statusCode,
       header: res.header,
       data: res.data
     };
   } catch (error) {
     console.error('测试API失败:', error);
     throw error;
   }
 }

// 导出直接下载函数，不使用token，作为最后的备用方案
export async function directDownload(url, packageSize) {
  return new Promise((resolve, reject) => {
    console.log('开始直接下载文件:', url);
    console.log('传入的包大小原始值:', packageSize);
    
    // 检查URL格式
    if (!url.startsWith('http')) {
      console.error('URL格式不正确:', url);
      reject(new Error('URL格式不正确'));
      return;
    }
    
    // 解析包大小字符串为字节数
    const parsedSize = parsePackageSize(packageSize);
    
    // 使用解析后的包大小或默认值
    let TOTAL_FILE_SIZE;
    if (parsedSize) {
      TOTAL_FILE_SIZE = parsedSize;
      console.log(`使用解析后的文件大小: ${(TOTAL_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB`);
    } else {
      TOTAL_FILE_SIZE = 12.5 * 1024 * 1024; // 默认12.5MB
      console.log(`使用默认文件大小: ${(TOTAL_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB`);
    }
    
    // 直接下载，不带任何头信息
    const task = uni.downloadFile({
      url,
      timeout: 180000, // 增加下载超时时间到3分钟
      success: (res) => {
        console.log('直接下载响应:', JSON.stringify(res, null, 2));
        if (res.statusCode === 200) {
          console.log('直接下载成功，临时文件路径:', res.tempFilePath);
          resolve(res.tempFilePath);
        } else {
          console.error('直接下载失败，状态码:', res.statusCode);
          reject(new Error(`直接下载失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('直接下载失败:', err);
        reject(err);
      }
    });
    
    // 监听进度
    if (task && typeof task.onProgressUpdate === 'function') {
      task.onProgressUpdate((e) => {
        // 如果接收到实际的总大小，就使用实际值，否则使用解析后的大小
        const totalSize = e.totalBytesExpectedToWrite > 0 ? e.totalBytesExpectedToWrite : TOTAL_FILE_SIZE;
        // 计算下载百分比
        const progress = e.totalBytesWritten / totalSize * 100;
        // 发送进度事件
        uni.$emit('download-progress', { 
          progress,
          packageSize: TOTAL_FILE_SIZE,
          bytesWritten: e.totalBytesWritten,
          bytesExpected: totalSize
        });
        
        console.log(`直接下载进度: ${progress.toFixed(2)}%, 已下载: ${(e.totalBytesWritten / (1024 * 1024)).toFixed(2)}MB / ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
      });
    } else {
      console.warn('无法监听直接下载进度，task对象可能无效');
    }
  });
}

// 新增：将UD目录下的object.json文件复制到UL目录
export async function copyUDToULObjectJson() {
  const userInfo = userStore();
  const udPath = userInfo.UDPath;
  const ulPath = userInfo.ULPath;
  
  console.log('复制object.json文件，当前路径信息:', { udPath, ulPath });
  
  // 严格检查UDPath和ULPath是否存在
  if (!udPath || !ulPath) {
    console.error('UDPath或ULPath为空，无法复制文件', { udPath, ulPath });
    return { success: false, message: 'UDPath或ULPath为空，请确保已正确设置路径' };
  }
  
  console.log(`开始从UD目录复制object.json文件到UL目录，UD路径: ${udPath}, UL路径: ${ulPath}`);
  
  try {
    // 1. 检查UD目录下的building目录
    const udBuildingPath = `_doc/${udPath}/building`;
    
    // 检查UD/building目录是否存在
    const udBuildingExists = await new Promise((resolve) => {
      plus.io.resolveLocalFileSystemURL(udBuildingPath, () => resolve(true), () => resolve(false));
    });
    
    if (!udBuildingExists) {
      console.log(`${udBuildingPath} 目录不存在，无需复制`);
      return { success: true, message: 'building目录不存在，无需复制' };
    }
    
    // 确保UL/building目录存在
    const ulBuildingPath = `_doc/${ulPath}/building`;
    const ulBuildingExists = await new Promise((resolve) => {
      plus.io.resolveLocalFileSystemURL(ulBuildingPath, () => resolve(true), () => resolve(false));
    });
    
    if (!ulBuildingExists) {
      console.log(`${ulBuildingPath} 目录不存在，创建目录`);
      await new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(`_doc/${ulPath}`, (entry) => {
          entry.getDirectory('building', { create: true }, (dirEntry) => {
            console.log('UL/building目录创建成功');
            resolve(dirEntry);
          }, (err) => {
            console.error('创建UL/building目录失败:', err);
            reject(err);
          });
        }, (err) => {
          console.error(`解析_doc/${ulPath}目录失败:`, err);
          reject(err);
        });
      });
    }
    
    // 2. 获取building目录下的所有buildingId目录
    const buildingDirs = await new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(udBuildingPath, (entry) => {
        entry.createReader().readEntries((entries) => {
          const dirs = entries.filter(e => e.isDirectory);
          resolve(dirs);
        }, (err) => {
          console.error('读取building目录失败:', err);
          reject(err);
        });
      }, (err) => {
        console.error('解析building目录失败:', err);
        reject(err);
      });
    });
    
    console.log(`找到 ${buildingDirs.length} 个buildingId目录`);
    
    // 3. 遍历每个buildingId目录，读取object.json文件并写入UL目录
    let copiedCount = 0;
    let errorCount = 0;
    
    for (const buildingDir of buildingDirs) {
      const buildingId = buildingDir.name;
      const objectJsonPath = `${udBuildingPath}/${buildingId}/object.json`;
      
      try {
        // 4. 读取object.json文件内容
        const objectJsonContent = await new Promise((resolve, reject) => {
          plus.io.resolveLocalFileSystemURL(objectJsonPath, (fileEntry) => {
            fileEntry.file((file) => {
              const reader = new plus.io.FileReader();
              reader.onloadend = function(e) {
                try {
                  const content = JSON.parse(this.result);
                  resolve(content);
                } catch (parseError) {
                  console.error(`解析object.json文件失败: ${objectJsonPath}`, parseError);
                  reject(parseError);
                }
              };
              reader.onerror = function(e) {
                console.error(`读取object.json文件失败: ${objectJsonPath}`, e);
                reject(e);
              };
              reader.readAsText(file);
            }, (err) => {
              console.error(`获取文件对象失败: ${objectJsonPath}`, err);
              reject(err);
            });
          }, (err) => {
            console.error(`解析文件路径失败: ${objectJsonPath}`, err);
            reject(err);
          });
        });
        
        console.log(`成功读取 ${objectJsonPath} 文件内容:`, objectJsonContent);
        
        // 5. 使用writeObjectJson将数据写入UL目录
        await writeObjectJson(buildingId, objectJsonContent);
        console.log(`成功将buildingId=${buildingId}的object.json写入UL目录`);
        
        copiedCount++;
      } catch (error) {
        console.error(`处理 buildingId=${buildingId} 时出错:`, error);
        errorCount++;
      }
    }
    
    console.log(`复制完成，成功: ${copiedCount}，失败: ${errorCount}`);
    return { 
      success: true, 
      message: `复制完成，成功: ${copiedCount}，失败: ${errorCount}`,
      copiedCount,
      errorCount
    };
  } catch (error) {
    console.error('复制object.json文件过程中出错:', error);
    return { success: false, message: error.message || '复制过程中出错' };
  }
}

// 新增：将UD目录下的object.json文件复制到UL目录下
export async function copyObjectJsonFiles() {
  // 调用新实现的函数
  return copyUDToULObjectJson();
}

export function useDownloader() {
   const downloadProgress = ref(0); // 下载进度
   const unzipProgress = ref(0);   // 解压进度
 
   // 主方法：获取URL -> 下载 -> 解压
   const downloadAndUnzip = async (token) => {
     try {
       // 1. 获取带token的压缩包信息
       console.log('步骤1: 开始获取压缩包信息...');
       const response = await fetchDataPackage(token);
       const { url, version, packageSize } = response;
       console.log('获取压缩包信息成功，版本:', version);
       console.log('原始包大小:', packageSize);
       
       // 解析包大小字符串
       const parsedSize = parsePackageSize(packageSize);
       if (parsedSize) {
         console.log(`解析后的包大小: ${(parsedSize / (1024 * 1024)).toFixed(2)}MB`);
       } else {
         console.log('无法解析包大小字符串，将使用默认值');
       }
       
       // 2. 处理URL（替换域名）
       console.log('步骤2: 处理下载URL...');
       let downloadUrl = url;
       
       // 检查URL中是否包含'bi_minio'
       if (url.includes('bi_minio')) {
         downloadUrl = url.replace('bi_minio', HOST);
         console.log('URL中包含bi_minio，已替换为:', HOST);
       } else {
         console.log('URL中不包含bi_minio，使用原始URL');
       }
       console.log('下载URL:', downloadUrl);
       
       // 3. 下载压缩包
       console.log('步骤3: 开始下载压缩包...');
       const tempPath = await downloadFile(downloadUrl, parsedSize);
       console.log('下载完成，临时文件路径:', tempPath);
       
       // 检查文件是否存在
       try {
         await new Promise((resolve, reject) => {
           plus.io.resolveLocalFileSystemURL(
             tempPath,
             (entry) => {
               console.log('临时文件存在，大小:', entry.size);
               resolve(entry);
             },
             (err) => {
               console.error('临时文件不存在或无法访问:', err);
               reject(new Error('临时文件不存在或无法访问'));
             }
           );
         });
       } catch (error) {
         console.error('检查临时文件失败:', error);
         throw new Error('下载文件无法访问，请重试');
       }
       
       // 4. 直接解压到_doc目录
       console.log('开始解压文件:', tempPath, '到', '_doc/');
       await new Promise((resolve, reject) => {
         // 设置解压超时保护
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
                   uni.$emit('unzip-completed');
                   
                   // 生成UD目录名并存储到UDPath
                   const useInfo = userStore();
                   const username = useInfo.username;
                   if (username) {
                     const now = new Date();
                     const timestamp = 
                       now.getFullYear().toString() +
                       (now.getMonth() + 1).toString().padStart(2, '0') +
                       now.getDate().toString().padStart(2, '0') +
                       now.getHours().toString().padStart(2, '0') +
                       now.getMinutes().toString().padStart(2, '0') +
                       now.getSeconds().toString().padStart(2, '0');
                     
                     const dirName = `UD${timestamp}-${username}`;
                     useInfo.UDPath = dirName;
                     console.log('已将目录名存储到UDPath:', dirName);
                     
                     // 同时设置ULPath，确保两个路径都存在
                     const ulDirName = `UL-${timestamp}-${username}`;
                     useInfo.setULPath(ulDirName);
                     console.log('已将目录名存储到ULPath:', ulDirName);
                     
                     // 不再自动创建UL目录，只设置ULPath
                     // 需要使用UL目录时会通过setRootDir函数创建
                     console.log('解压成功，已设置ULPath，不自动创建UL目录');
                   } else {
                     console.log('未获取到用户名，无法设置UDPath和ULPath');
                   }
                   
                   resolve();
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
                   uni.$emit('unzip-completed');
                   
                   // 生成UD目录名并存储到UDPath
                   const useInfo = userStore();
                   const username = useInfo.username;
                   if (username) {
                     const now = new Date();
                     const timestamp = 
                       now.getFullYear().toString() +
                       (now.getMonth() + 1).toString().padStart(2, '0') +
                       now.getDate().toString().padStart(2, '0') +
                       now.getHours().toString().padStart(2, '0') +
                       now.getMinutes().toString().padStart(2, '0') +
                       now.getSeconds().toString().padStart(2, '0');
                     
                     const dirName = `UD${timestamp}-${username}`;
                     useInfo.UDPath = dirName;
                     console.log('已将目录名存储到UDPath:', dirName);
                     
                     // 同时设置ULPath，确保两个路径都存在
                     const ulDirName = `UL-${timestamp}-${username}`;
                     useInfo.setULPath(ulDirName);
                     console.log('已将目录名存储到ULPath:', ulDirName);
                     
                     // 不再自动创建UL目录，只设置ULPath
                     // 需要使用UL目录时会通过setRootDir函数创建
                     console.log('轮询检查发现关键目录，已设置ULPath，不自动创建UL目录');
                   }
                   
                   resolve();
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
           tempPath,
           '_doc/',
           (progress) => {
             // 更新解压进度
             if (progress && progress.loaded && progress.total && progress.total > 0) {
               unzipProgress.value = Math.floor((progress.loaded / progress.total) * 100);
               // 发送解压进度事件
               uni.$emit('unzip-progress', { progress: unzipProgress.value });
               console.log('解压进度:', unzipProgress.value);
               
               // 如果进度达到100%，也可以认为解压已完成
               if (unzipProgress.value >= 100 && !isResolved) {
                 console.log('进度达到100%，解压已完成');
                 isResolved = true;
                 clearTimeout(forceCompleteTimeoutId);
                 clearInterval(checkInterval);
                 uni.$emit('unzip-completed');
                 
                 // 生成UD目录名并存储到UDPath
                 const useInfo = userStore();
                 const username = useInfo.username;
                 if (username) {
                   const now = new Date();
                   const timestamp = 
                     now.getFullYear().toString() +
                     (now.getMonth() + 1).toString().padStart(2, '0') +
                     now.getDate().toString().padStart(2, '0') +
                     now.getHours().toString().padStart(2, '0') +
                     now.getMinutes().toString().padStart(2, '0') +
                     now.getSeconds().toString().padStart(2, '0');
                   
                   const dirName = `UD${timestamp}-${username}`;
                   useInfo.UDPath = dirName;
                   console.log('已将目录名存储到UDPath:', dirName);
                   
                   // 同时设置ULPath，确保两个路径都存在
                   const ulDirName = `UL-${timestamp}-${username}`;
                   useInfo.setULPath(ulDirName);
                   console.log('已将目录名存储到ULPath:', ulDirName);
                   
                   // 不再自动创建UL目录，只设置ULPath
                   // 需要使用UL目录时会通过setRootDir函数创建
                   console.log('解压进度100%，已设置ULPath，不自动创建UL目录');
                 }
                 
                 resolve();
               }
             } else {
               console.log('解压进行中...', Date.now());
             }
           },
           () => {
             console.log('解压完成回调被触发');
             // 解压完成时发送事件
             if (!isResolved) {
               uni.$emit('unzip-completed');
               clearTimeout(forceCompleteTimeoutId);
               clearInterval(checkInterval);
               isResolved = true;
               
               // 生成UD目录名并存储到UDPath
               const useInfo = userStore();
               const username = useInfo.username;
               if (username) {
                 const now = new Date();
                 const timestamp = 
                   now.getFullYear().toString() +
                   (now.getMonth() + 1).toString().padStart(2, '0') +
                   now.getDate().toString().padStart(2, '0') +
                   now.getHours().toString().padStart(2, '0') +
                   now.getMinutes().toString().padStart(2, '0') +
                   now.getSeconds().toString().padStart(2, '0');
                 
                 const dirName = `UD${timestamp}-${username}`;
                 useInfo.UDPath = dirName;
                 console.log('已将目录名存储到UDPath:', dirName);
                 
                 // 同时设置ULPath，确保两个路径都存在
                 const ulDirName = `UL-${timestamp}-${username}`;
                 useInfo.setULPath(ulDirName);
                 console.log('已将目录名存储到ULPath:', ulDirName);
                 
                 // 不再自动创建UL目录，只设置ULPath
                 // 需要使用UL目录时会通过setRootDir函数创建
                 console.log('解压完成回调触发，已设置ULPath，不自动创建UL目录');
               }
               
               resolve();
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
       
       // 列出_doc/目录中的内容，查看实际的文件结构
       try {
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
       } catch (error) {
         console.error('列出目录内容失败:', error);
       }
       
       return {
         targetDir: '_doc/',
         tempPath,
         version
       };
     } catch (e) {
       console.error('处理失败:', e);
       throw e;
     }
   };
 
   // 步骤1：获取压缩包信息
   const fetchDataPackage = async (token) => {
     if (!token) throw new Error('未提供token参数');
     
     try {
       console.log('开始请求数据包信息，API地址:', API_URL);
       console.log('请求头Authorization:', token.substring(0, 10) + '...');
       
       // 使用Promise包装uni.request，确保正确处理错误
       const res = await new Promise((resolve, reject) => {
         uni.request({
           url: API_URL,
           header: { 'Authorization': token },
           timeout: 15000,
           success: (response) => {
             console.log('API请求成功，状态码:', response.statusCode);
             resolve(response);
           },
           fail: (error) => {
             console.error('API请求失败:', error);
             reject(new Error('网络请求失败: ' + (error.errMsg || '未知错误')));
           }
         });
       });
       
       console.log('获取压缩包信息响应状态码:', res.statusCode);
       console.log('获取压缩包信息响应数据:', JSON.stringify(res.data, null, 2));
       
       if (res.statusCode !== 200) {
         console.error('获取压缩包信息失败，状态码:', res.statusCode);
         throw new Error(`获取压缩包信息失败: ${res.statusCode}`);
       }
       
       if (res.data.code !== 0) {
         console.error('获取压缩包信息失败，错误码:', res.data.code, '错误信息:', res.data.msg);
         throw new Error(res.data.msg || '请求失败');
       }
       
       if (!res.data.url) {
         console.error('服务器未返回下载链接');
         throw new Error('服务器未返回下载链接');
       }
       
       console.log('获取压缩包信息成功:');
       console.log('- 下载URL:', res.data.url);
       console.log('- 版本:', res.data.version);
       console.log('- 包大小:', res.data.packageSize); // 新增：获取包大小
       
       return res.data; // 返回 { url, version, packageSize }
     } catch (error) {
       console.error('获取压缩包信息失败:', error);
       throw error;
     }
   };
 
   // 步骤3：下载文件
   const downloadFile = (url, packageSize) => {
     return new Promise((resolve, reject) => {
       console.log('开始下载文件:', url);
       console.log('传入的包大小原始值:', packageSize);
       
       // 检查URL格式
       if (!url.startsWith('http')) {
         console.error('URL格式不正确:', url);
         reject(new Error('URL格式不正确'));
         return;
       }
       
       // 解析URL获取域名和路径（不使用URL类）
       try {
         // 简单解析URL，获取域名和路径
         const protocolEnd = url.indexOf('://');
         const protocol = url.substring(0, protocolEnd + 3);
         const pathStart = url.indexOf('/', protocolEnd + 3);
         const hostname = url.substring(protocolEnd + 3, pathStart);
         const pathname = url.substring(pathStart);
         
         console.log('解析URL成功:');
         console.log('- 协议:', protocol);
         console.log('- 域名:', hostname);
         console.log('- 路径:', pathname);
       } catch (error) {
         console.error('URL解析失败，但继续下载:', error);
         // 不中断下载流程，继续尝试下载
       }
       
       // 不使用token下载文件，直接下载
       console.log('开始执行下载...');
       
       // 解析包大小字符串为字节数
       const parsedSize = parsePackageSize(packageSize);
       
       // 使用解析后的包大小或默认值
       let TOTAL_FILE_SIZE;
       if (parsedSize) {
         TOTAL_FILE_SIZE = parsedSize;
         console.log(`使用解析后的文件大小: ${(TOTAL_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB`);
       } else {
         TOTAL_FILE_SIZE = 12.5 * 1024 * 1024; // 默认12.5MB
         console.log(`使用默认文件大小: ${(TOTAL_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB`);
       }
       
       // 尝试下载
       try {
         const task = uni.downloadFile({
           url,
           timeout: 180000, // 增加下载超时时间到3分钟
           success: (res) => {
             console.log('下载文件响应:', JSON.stringify(res, null, 2));
             if (res.statusCode === 200) {
               console.log('下载成功，临时文件路径:', res.tempFilePath);
               resolve(res.tempFilePath);
             } else {
               console.error('下载失败，状态码:', res.statusCode);
               reject(new Error(`下载失败: ${res.statusCode}`));
             }
           },
           fail: (err) => {
             console.error('下载文件失败:', err);
             reject(err);
           },
         });
         
         // 监听进度
         if (task && typeof task.onProgressUpdate === 'function') {
           task.onProgressUpdate((e) => {
             // 如果接收到实际的总大小，就使用实际值，否则使用解析后的大小
             const totalSize = e.totalBytesExpectedToWrite > 0 ? e.totalBytesExpectedToWrite : TOTAL_FILE_SIZE;
             // 计算下载百分比
             const progress = e.totalBytesWritten / totalSize * 100;
             // 更新进度值
             downloadProgress.value = progress;
             // 发送进度事件，包含详细信息
             uni.$emit('download-progress', { 
               progress,
               packageSize: TOTAL_FILE_SIZE,
               bytesWritten: e.totalBytesWritten,
               bytesExpected: totalSize
             });
             
             console.log(`下载进度: ${progress.toFixed(2)}%, 已下载: ${(e.totalBytesWritten / (1024 * 1024)).toFixed(2)}MB / ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
           });
         } else {
           console.warn('无法监听下载进度，task对象可能无效');
         }
       } catch (error) {
         console.error('执行uni.downloadFile时发生异常:', error);
         reject(error);
       }
     });
   };
 
   // 步骤4：解压文件（使用5+ API）
  const unzipFile = (zipPath, targetDir) => {
    return new Promise((resolve, reject) => {
      console.log('开始解压文件:', zipPath, '到', targetDir);
      
      // 设置解压超时保护
      let isResolved = false;
      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          console.log('解压操作超时，但继续等待完成');
          // 不立即拒绝，只记录日志
        }
      }, 30000); // 30秒超时检查
      
      // 直接解压
      plus.zip.decompress(
        zipPath,
        targetDir,
        (progress) => {
          // 添加进度值检查，避免NaN
          if (progress && progress.loaded && progress.total && progress.total > 0) {
            unzipProgress.value = Math.floor((progress.loaded / progress.total) * 100);
            // 发送解压进度事件
            uni.$emit('unzip-progress', { progress: unzipProgress.value });
            console.log('解压进度:', unzipProgress.value);
          } else {
            console.log('解压进行中...');
            // 即使没有进度信息也继续解压，不中断流程
          }
        },
        () => {
          console.log('解压完成');
          // 解压完成时发送事件
          uni.$emit('unzip-completed');
          clearTimeout(timeoutId);
          isResolved = true;
          
          // 不再自动复制object.json文件
          
          resolve(targetDir);
        },
        (err) => {
          console.error('解压失败:', err);
          clearTimeout(timeoutId);
          isResolved = true;
          reject(new Error(`解压失败: ${JSON.stringify(err)}`));
        }
      );
    });
  };
 
   // 辅助方法：创建目录
   const createDir = (path) => {
     return new Promise((resolve, reject) => {
       console.log('创建目录:', path);
       try {
         const parentPath = path.substring(0, path.lastIndexOf('/'));
         const dirName = path.substring(path.lastIndexOf('/') + 1);
         
         console.log('父目录:', parentPath, '目录名:', dirName);
         
         plus.io.resolveLocalFileSystemURL(
           parentPath,
           (parent) => {
             parent.getDirectory(
               dirName,
               { create: true },
               (dirEntry) => {
                 console.log('目录创建成功:', dirEntry.fullPath);
                 resolve(dirEntry);
               },
               (err) => {
                 console.error('创建目录失败:', err);
                 reject(err);
               }
             );
           },
           (err) => {
             console.error('解析父目录失败:', err);
             reject(err);
           }
         );
       } catch (err) {
         console.error('创建目录异常:', err);
         reject(err);
       }
     });
   };

  // 确保目录存在
  const ensureDirectoryExists = async (path) => {
    return new Promise((resolve, reject) => {
      console.log('确保目录存在:', path);
      
      // 处理_doc/路径
      if (path.startsWith('_doc/')) {
        // 如果是根目录_doc/，直接返回
        if (path === '_doc/') {
          plus.io.resolveLocalFileSystemURL(path, resolve, reject);
          return;
        }
        
        // 分割路径
        const parts = path.split('/').filter(p => p);
        if (parts.length === 1) {
          // 只有一级目录，直接在_doc/下创建
          plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
            entry.getDirectory(parts[0], { create: true }, resolve, reject);
          }, reject);
          return;
        }
        
        // 多级目录，递归创建
        let currentPath = '_doc/';
        let currentEntry = null;
        
        // 获取_doc/目录
        plus.io.resolveLocalFileSystemURL(currentPath, (entry) => {
          currentEntry = entry;
          createNextDir(1);
        }, reject);
        
        // 递归创建子目录
        function createNextDir(index) {
          if (index >= parts.length) {
            resolve(currentEntry);
            return;
          }
          
          const dirName = parts[index];
          console.log(`创建目录: ${currentPath}${dirName}`);
          
          currentEntry.getDirectory(dirName, { create: true }, (entry) => {
            currentEntry = entry;
            currentPath = currentPath + dirName + '/';
            createNextDir(index + 1);
          }, (err) => {
            console.error(`创建目录失败: ${currentPath}${dirName}`, err);
            reject(err);
          });
        }
      } else {
        // 非_doc路径，使用原来的逻辑
        plus.io.resolveLocalFileSystemURL(
          path,
          (entry) => {
            console.log('目录已存在:', path);
            resolve(entry);
          },
          () => {
            console.log('目录不存在，创建目录:', path);
            // 获取父目录
            const parentPath = path.substring(0, path.lastIndexOf('/'));
            const dirName = path.substring(path.lastIndexOf('/') + 1);
            
            plus.io.resolveLocalFileSystemURL(
              parentPath,
              (parent) => {
                parent.getDirectory(
                  dirName,
                  { create: true },
                  (dirEntry) => {
                    console.log('目录创建成功:', dirEntry.fullPath);
                    resolve(dirEntry);
                  },
                  (err) => {
                    console.error('创建目录失败:', err);
                    reject(err);
                  }
                );
              },
              (err) => {
                console.error('解析父目录失败:', err);
                reject(err);
              }
            );
          }
        );
      }
    });
  };
 
   // 检查目录是否存在
   const checkDirectoryExists = (path) => {
     return new Promise((resolve) => {
       plus.io.resolveLocalFileSystemURL(
         path,
         () => resolve(true),
         () => resolve(false)
       );
     });
   };
   
   // 移动目录内容
   const moveDirectoryContents = async (sourcePath, targetPath) => {
     return new Promise((resolve, reject) => {
       console.log(`移动目录内容: 从 ${sourcePath} 到 ${targetPath}`);
       
       plus.io.resolveLocalFileSystemURL(sourcePath, (sourceDir) => {
         sourceDir.createReader().readEntries((entries) => {
           if (entries.length === 0) {
             console.log('源目录为空');
             resolve();
             return;
           }
           
           let processed = 0;
           let errors = [];
           
           entries.forEach((entry) => {
             console.log(`处理文件/目录: ${entry.name}`);
             
             if (entry.isFile) {
               // 如果是文件，复制到目标目录
               copyFile(entry, targetPath).then(() => {
                 processed++;
                 if (processed === entries.length) {
                   if (errors.length > 0) {
                     reject(new Error(`移动过程中有 ${errors.length} 个错误`));
                   } else {
                     resolve();
                   }
                 }
               }).catch((err) => {
                 console.error(`复制文件失败: ${entry.name}`, err);
                 errors.push(err);
                 processed++;
                 if (processed === entries.length) {
                   reject(new Error(`移动过程中有 ${errors.length} 个错误`));
                 }
               });
             } else if (entry.isDirectory) {
               // 如果是目录，确保目标目录存在，然后递归移动
               const newTargetPath = targetPath + entry.name + '/';
               ensureDirectoryExists(newTargetPath).then(() => {
                 moveDirectoryContents(entry.fullPath, newTargetPath).then(() => {
                   processed++;
                   if (processed === entries.length) {
                     if (errors.length > 0) {
                       reject(new Error(`移动过程中有 ${errors.length} 个错误`));
                     } else {
                       resolve();
                     }
                   }
                 }).catch((err) => {
                   console.error(`移动子目录失败: ${entry.name}`, err);
                   errors.push(err);
                   processed++;
                   if (processed === entries.length) {
                     reject(new Error(`移动过程中有 ${errors.length} 个错误`));
                   }
                 });
               }).catch((err) => {
                 console.error(`创建目标子目录失败: ${entry.name}`, err);
                 errors.push(err);
                 processed++;
                 if (processed === entries.length) {
                   reject(new Error(`移动过程中有 ${errors.length} 个错误`));
                 }
               });
             } else {
               // 其他类型的条目
               console.log(`跳过未知类型的条目: ${entry.name}`);
               processed++;
               if (processed === entries.length) {
                 if (errors.length > 0) {
                   reject(new Error(`移动过程中有 ${errors.length} 个错误`));
                 } else {
                   resolve();
                 }
               }
             }
           });
         }, (err) => {
           console.error('读取源目录失败', err);
           reject(err);
         });
       }, (err) => {
         console.error('解析源目录失败', err);
         reject(err);
       });
     });
   };
   
   // 复制文件
   const copyFile = (fileEntry, targetPath) => {
     return new Promise((resolve, reject) => {
       plus.io.resolveLocalFileSystemURL(targetPath, (targetDir) => {
         fileEntry.copyTo(targetDir, fileEntry.name, (newFile) => {
           console.log(`文件复制成功: ${fileEntry.name}`);
           resolve(newFile);
         }, (err) => {
           console.error(`文件复制失败: ${fileEntry.name}`, err);
           reject(err);
         });
       }, (err) => {
         console.error('解析目标目录失败', err);
         reject(err);
       });
     });
   };
   
   // 删除目录
   const removeDirectory = (path) => {
     return new Promise((resolve, reject) => {
       console.log(`删除目录: ${path}`);
       
       plus.io.resolveLocalFileSystemURL(path, (entry) => {
         if (entry.isDirectory) {
           entry.removeRecursively(() => {
             console.log(`目录删除成功: ${path}`);
             resolve();
           }, (err) => {
             console.error(`目录删除失败: ${path}`, err);
             reject(err);
           });
         } else {
           console.error(`路径不是目录: ${path}`);
           reject(new Error(`路径不是目录: ${path}`));
         }
       }, (err) => {
         console.error(`解析目录失败: ${path}`, err);
         reject(err);
       });
     });
   };
 
   return {
     downloadProgress,
     unzipProgress,
     downloadAndUnzip
   };
 }
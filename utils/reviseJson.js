let __currentFilePath = null;

// 获取完整的文件路径
function getFullPath(path) {
  const docPath = plus.io.convertLocalFileSystemURL(path);
  return docPath;
}


// 统一保存方法（只需传递数据）
export function saveData(data) {
  return new Promise((resolve, reject) => {
    if (!__currentFilePath) {
      return reject(new Error('请先执行读取操作获取文件路径'));
    }

    const fullPath = getFullPath(__currentFilePath);
    console.log('准备保存文件到路径:', fullPath);

    plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, fs => {
      console.log('获取文件系统成功');
      fs.root.getFile(fullPath, { create: true }, fileEntry => {
        console.log('获取文件入口成功');
        fileEntry.createWriter(writer => {
          const wait = plus.nativeUI.showWaiting("正在保存信息");
          
          writer.seek(0); // 始终覆盖整个文件
          const jsonString = JSON.stringify(data, null, 2);
          console.log('准备写入数据:', data);
          
          writer.onwrite = () => {
            wait.close();
            console.log('写入成功');
            plus.nativeUI.toast("保存成功");
            resolve(true);
          };
          
          writer.onerror = (e) => {
            wait.close();
            console.error("写入失败:", e.message);
            plus.nativeUI.toast("保存失败");
            reject(e);
          };

          writer.write(jsonString);
        }, error => {
          console.error('创建写入器失败:', error);
          reject(error);
        });
      }, error => {
        console.error('获取文件入口失败:', error);
        reject(error);
      });
    }, error => {
      console.error('获取文件系统失败:', error);
      reject(error);
    });
  });
}


// 路径记录器（不修改原读取方法）
export function trackPath(path) {
  console.log('设置文件路径:', path);
  __currentFilePath = path;
}

// 保存图片到与JSON文件同级目录
export function saveImages(tempImagePaths) {
  return new Promise((resolve, reject) => {
    if (!tempImagePaths || tempImagePaths.length === 0) {
      console.log('没有图片需要保存');
      return resolve([]);
    }
    
    if (!__currentFilePath) {
      console.error('未找到JSON文件路径，请先执行读取操作获取文件路径');
      return resolve(tempImagePaths);
    }
    
    // 获取JSON文件所在目录
    const lastSlashIndex = __currentFilePath.lastIndexOf('/');
    if (lastSlashIndex === -1) {
      console.error('JSON文件路径格式错误:', __currentFilePath);
      return resolve(tempImagePaths);
    }
    
    const targetDir = __currentFilePath.substring(0, lastSlashIndex + 1);
    console.log('目标保存目录:', targetDir);
    console.log('当前图片路径列表:', tempImagePaths);
    
    // 直接保存文件到目标目录
    plus.io.resolveLocalFileSystemURL(targetDir, (dirEntry) => {
      console.log('成功获取目标目录:', targetDir);
      
      // 保存所有图片的promises
      const savePromises = tempImagePaths.map((tempPath, index) => {
        return new Promise((resolveImage, rejectImage) => {
          if (!tempPath) {
            console.warn('空的图片路径');
            return resolveImage('');
          }
          
          // 提取文件名
          const fileName = tempPath.substring(tempPath.lastIndexOf('/') + 1);
          // 确保文件名唯一，防止覆盖
          const uniqueFileName = `img_${Date.now()}_${index}_${fileName}`;
          const targetPath = `${targetDir}${uniqueFileName}`;
          console.log(`[${index}] 尝试保存图片: ${tempPath} 到: ${targetPath}`);
          
          // 使用plus.io复制文件
          plus.io.resolveLocalFileSystemURL(tempPath, (tempEntry) => {
            console.log(`[${index}] 获取到临时文件:`, tempPath);
            
            // 复制文件到目标目录
            tempEntry.copyTo(dirEntry, uniqueFileName, (entry) => {
              const savedPath = entry.fullPath || targetPath;
              console.log(`[${index}] 图片保存成功:`, savedPath);
              resolveImage(savedPath);
            }, (err) => {
              console.error(`[${index}] 复制文件失败:`, err);
              // 失败时返回原始路径
              resolveImage(tempPath);
            });
          }, (err) => {
            console.error(`[${index}] 获取临时文件失败:`, err);
            // 失败时返回原始路径
            resolveImage(tempPath);
          });
        });
      });
      
      // 处理所有图片保存的结果
      Promise.all(savePromises)
        .then(savedPaths => {
          // 过滤掉空路径
          const filteredPaths = savedPaths.filter(path => path);
          console.log('所有图片保存结果:', filteredPaths);
          resolve(filteredPaths);
        })
        .catch(error => {
          console.error('保存图片过程中发生错误:', error);
          resolve(tempImagePaths);
        });
    }, (err) => {
      console.error('获取目标目录失败:', err);
      resolve(tempImagePaths);
    });
  });
}

// 创建完整路径（递归创建目录）
function createFullPath(fullPath) {
  return new Promise((resolve, reject) => {
    const parts = fullPath.split('/').filter(p => p);
    let currentPath = '';
    
    // 从根目录开始逐级创建
    const createNextDir = (index) => {
      if (index >= parts.length) {
        // 所有目录创建完成
        plus.io.resolveLocalFileSystemURL(fullPath, resolve, reject);
        return;
      }
      
      currentPath += '/' + parts[index];
      console.log('尝试创建目录:', currentPath);
      
      plus.io.resolveLocalFileSystemURL(currentPath, 
        // 目录存在，继续下一级
        (entry) => createNextDir(index + 1),
        // 目录不存在，创建
        () => {
          const parentPath = index === 0 ? '/' : currentPath.substring(0, currentPath.lastIndexOf('/'));
          const dirName = parts[index];
          
          plus.io.resolveLocalFileSystemURL(parentPath, (parentEntry) => {
            parentEntry.getDirectory(dirName, { create: true }, 
              (entry) => createNextDir(index + 1),
              reject
            );
          }, reject);
        }
      );
    };
    
    createNextDir(0);
  });
}

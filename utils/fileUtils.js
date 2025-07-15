// fileUtils.js
// 用于处理文件和目录操作的工具函数

/**
 * 检查目录是否存在
 * @param {string} path 目录路径
 * @returns {Promise<boolean>} 目录是否存在
 */
export function checkDirectoryExists(path) {
  return new Promise((resolve) => {
    plus.io.resolveLocalFileSystemURL(
      path,
      () => resolve(true),
      () => resolve(false)
    );
  });
}

/**
 * 创建目录（包括父目录）
 * @param {string} path 完整目录路径
 * @returns {Promise<any>} 创建的目录对象
 */
export function createDirectory(path) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('创建目录:', path);
      
      // 检查路径是否已存在
      const exists = await checkDirectoryExists(path);
      if (exists) {
        console.log('目录已存在:', path);
        plus.io.resolveLocalFileSystemURL(path, resolve, reject);
        return;
      }
      
      // 分割路径
      const parts = path.split('/').filter(p => p);
      let currentPath = '';
      
      // 根据平台确定起始路径
      if (path.startsWith('_doc/')) {
        currentPath = '_doc/';
      } else if (path.startsWith('_downloads/')) {
        currentPath = '_downloads/';
      } else {
        currentPath = '_doc/'; // 默认使用应用私有文档目录
      }
      
      // 递归创建目录
      let entry;
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        
        try {
          entry = await getOrCreateDirectory(currentPath, part);
          currentPath = entry.fullPath + (entry.fullPath.endsWith('/') ? '' : '/');
        } catch (err) {
          console.error(`创建目录 ${currentPath}${part} 失败:`, err);
          reject(err);
          return;
        }
      }
      
      resolve(entry);
    } catch (err) {
      console.error('创建目录异常:', err);
      reject(err);
    }
  });
}

/**
 * 获取或创建目录
 * @param {string} parentPath 父目录路径
 * @param {string} dirName 目录名
 * @returns {Promise<any>} 目录对象
 */
function getOrCreateDirectory(parentPath, dirName) {
  return new Promise((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(
      parentPath,
      (parent) => {
        parent.getDirectory(
          dirName,
          { create: true },
          resolve,
          reject
        );
      },
      reject
    );
  });
}

/**
 * 创建用户数据目录结构
 * @param {string} username 用户名
 * @returns {Promise<string>} 用户目录路径
 */
export function createUserDataStructure(username) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!username) {
        reject(new Error('用户名不能为空'));
        return;
      }
      
      // 生成用户目录名
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const userDir = `UD${year}-${month}-${day}-${username}`;
      const userPath = `_doc/${userDir}`;
      
      // 创建用户目录
      await createDirectory(userPath);
      
      // 创建子目录
      const projectDir = `${userPath}/project`;
      await createDirectory(projectDir);
      
      console.log('用户数据目录结构创建成功:', userPath);
      resolve(userDir);
    } catch (err) {
      console.error('创建用户数据目录结构失败:', err);
      reject(err);
    }
  });
}

/**
 * 检查文件是否存在
 * @param {string} path 文件路径
 * @returns {Promise<boolean>} 文件是否存在
 */
export function checkFileExists(path) {
  return new Promise((resolve) => {
    plus.io.resolveLocalFileSystemURL(
      path,
      (fileEntry) => {
        // 确认是文件而不是目录
        fileEntry.isFile ? resolve(true) : resolve(false);
      },
      () => resolve(false)
    );
  });
}

/**
 * 复制文件
 * @param {string} sourcePath 源文件路径
 * @param {string} targetPath 目标文件路径
 * @returns {Promise<any>} 复制结果
 */
export function copyFile(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(sourcePath, (sourceFileEntry) => {
      // 获取目标目录
      const targetDir = targetPath.substring(0, targetPath.lastIndexOf('/'));
      const targetFileName = targetPath.substring(targetPath.lastIndexOf('/') + 1);
      
      // 确保目标目录存在
      createDirectory(targetDir).then(() => {
        plus.io.resolveLocalFileSystemURL(targetDir, (targetDirEntry) => {
          // 复制文件
          sourceFileEntry.copyTo(targetDirEntry, targetFileName, resolve, reject);
        }, reject);
      }).catch(reject);
    }, reject);
  });
} 
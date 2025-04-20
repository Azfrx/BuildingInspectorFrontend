// 获取文档目录基础路径
const DOC_BASE_PATH = plus.io.convertLocalFileSystemURL("_doc/");
import { trackReadPath } from './reviseJson';

// 统一文件命名规则
const FILE_NAMING = {
  taskList: userId => `${userId}/taskList.json`,
  bridgeList: (userId, bridgeListId) => `${userId}/${bridgeListId}/bridgeList.json`,
  bridge: (userId, bridgeListId, bridgeId) => `${userId}/${bridgeListId}/${bridgeId}/bridge.json`
};

// 核心文件操作方法
function getFullPath(fileName) {
  return `${DOC_BASE_PATH}${fileName}`;
}

// 增强版文件读取方法（返回解析后的JS对象）
async function getJsonData(fullPath) {
  try {
    console.log('文件访问路径:', fullPath);

    // 获取文件系统
    const fileSystem = await new Promise((resolve, reject) => {
      plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, resolve, reject);
    });

    // 获取文件入口
    const fileEntry = await new Promise((resolve, reject) => {
      fileSystem.root.getFile(fullPath, { create: false }, resolve, reject);
    });

    // 获取文件对象
    const file = await new Promise((resolve, reject) => {
      fileEntry.file(resolve, reject);
    });

    // 读取文件内容
    const jsonString = await new Promise((resolve, reject) => {
      const reader = new plus.io.FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    // JSON转JS对象
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error(`JSON解析失败: ${fullPath}`, parseError);
      throw new Error('文件内容格式不正确');
    }

  } catch (error) {
    console.error(`文件操作失败: ${fullPath}`, error);
    throw error; // 抛出错误供上层处理
  }
}

// 对外接口（返回Promise对象）
export function getTaskList(userId) {
  const fileName = FILE_NAMING.taskList(userId);
  const fullPath = getFullPath(fileName);
  trackReadPath(fullPath);
  return getJsonData(fullPath).then(data => {
    // 如果是数组，返回第一项；否则直接返回
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return data;
  });
}

export function getBridgeList(userId, bridgeListId) {
  const fileName = FILE_NAMING.bridgeList(userId, bridgeListId);
  const fullPath = getFullPath(fileName)
  trackReadPath(fullPath); // 新增此行
  return getJsonData(fullPath);
}

export function getBridge(userId, bridgeListId, bridgeId) {
  const fileName = FILE_NAMING.bridge(userId, bridgeListId, bridgeId);
  const fullPath =getFullPath(fileName)
    trackReadPath(fullPath); // 新增此行
  return getJsonData(fullPath);
}

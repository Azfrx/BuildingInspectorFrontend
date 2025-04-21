// 获取文档目录基础路径
const DOC_BASE_PATH = '_doc/';
import { trackPath } from './reviseJson'; 

// 复用原有文件命名规则
const FILE_NAMING = {
  taskList: userId => `${userId}/taskList.json`,
  bridgeList: (userId, bridgeListId) => `${userId}/${bridgeListId}/bridgeList.json`,
  bridge: (userId, bridgeListId, bridgeId) => `${userId}/${bridgeListId}/${bridgeId}/bridge.json`
};

// 核心文件写入方法
function writeJsonData(path, data) {
  return new Promise((resolve, reject) => {
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
      console.log(fs.root.toURL(), '当前根路径');
      fs.root.getFile(path, {
        create: true
      }, fileEntry => {
        fileEntry.file(file => {
          fileEntry.createWriter(writer => {
            plus.nativeUI.showWaiting("正在保存信息");
            
            // 转换为JSON字符串
            const jsonString = JSON.stringify(data, null, "\t");
            
            writer.seek(0); // 从头开始写入
            writer.write(jsonString);
            
            writer.onerror = function() {
              console.error("写入文件失败:", writer.error.message);
              plus.nativeUI.closeWaiting();
              plus.nativeUI.toast("修改信息失败,请重新操作", {
                background: "rgba(255, 255, 255, 0.6)"
              });
              reject(writer.error);
            };
            
            writer.onwrite = function() {
              plus.nativeUI.closeWaiting();
              plus.nativeUI.toast("保存成功");
              resolve(true);
            };
          }, error => {
            console.error("创建Writer失败:", error);
            plus.nativeUI.toast("保存文件失败,请重新操作");
            reject(error);
          });
        });
      }, error => {
        console.error("获取文件失败:", error);
        plus.nativeUI.toast("保存文件失败,请重新操作");
        reject(error);
      });
    }, error => {
      console.error("请求文件系统失败:", error.message);
      plus.nativeUI.toast("请求系统失败,请重新操作");
      reject(error);
    });
  });
}

// 对外写入接口
export function setTaskList(userId, data) {
  const fileName = FILE_NAMING.taskList(userId);
  const fullPath = DOC_BASE_PATH + fileName;
  trackPath(fullPath);
  return writeJsonData(fullPath, data);
}

export function setBridgeList(userId, bridgeListId, data) {
  const fileName = FILE_NAMING.bridgeList(userId, bridgeListId);
  const fullPath = DOC_BASE_PATH + fileName;
  trackPath(fullPath);
  return writeJsonData(fullPath, data);
}

export function setBridge(userId, bridgeListId, bridgeId, data) {
  const fileName = FILE_NAMING.bridge(userId, bridgeListId, bridgeId);
  const fullPath = DOC_BASE_PATH + fileName;
  trackPath(fullPath);
  return writeJsonData(fullPath, data);
}
let __currentFilePath = null;

// 获取完整的文件路径
function getFullPath(path) {
  const docPath = plus.io.convertLocalFileSystemURL("_doc/");
  return `${docPath}${path}`;
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
          console.log('准备写入数据:', jsonString);
          
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
export function trackReadPath(path) {
  console.log('设置文件路径:', path);
  __currentFilePath = path;
}

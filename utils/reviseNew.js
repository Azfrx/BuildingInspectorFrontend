// 文档基础路径
const DOC_BASE_PATH = '_doc/';
// 路径生成规则
const FILE_NAMING = {
    project: userId => `${userId}/project/projects.json`,
    task: (userId, projectId) => `${userId}/project/${projectId}/task.json`,
    property: (userId, buildingId) => `${userId}/building/${buildingId}/property.json`,
    disease: (userId, buildingId, yearId) =>
        `${userId}/building/${buildingId}/disease/${yearId}.json`,
    diseaseImages: (userId, buildingId) =>
        `${userId}/building/${buildingId}/disease/images`,
    ADImages: (userId, buildingId, yearId) =>
        `${userId}/building/${buildingId}/ADImages`,
};

let __currentFilePath = null;

// 获取完整的文件路径
function getFullPath(path) {
    const docPath = plus.io.convertLocalFileSystemURL(path);
    return docPath;
}

// 核心文件写入方法
async function setJsonData(path, data) {
    return new Promise((resolve, reject) => {
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            fs.root.getFile(path, { create: true }, fileEntry => {
                fileEntry.createWriter(writer => {
                    writer.onwriteend = () => {
                        resolve();
                    };
                    writer.onerror = () => {
                        reject(`文件写入失败: ${path}`);
                    };
                    const jsonData = JSON.stringify(data, null, 2);
                    writer.write(jsonData);
                }, reject);
            }, reject);
        }, reject);
    });
}

// 统一保存方法（只需传递数据）
export function saveData(data) {
    return new Promise((resolve, reject) => {
        if (!__currentFilePath) {
            return reject(new Error('请先执行读取操作获取文件路径'));
        }

        const fullPath = getFullPath(__currentFilePath);
        console.log('准备保存文件到路径:', fullPath);

        const wait = plus.nativeUI.showWaiting("正在保存信息");

        setJsonData(fullPath, data)
            .then(() => {
                wait.close();
                console.log('写入成功');
                plus.nativeUI.toast("保存成功");
                resolve(true);
            })
            .catch((error) => {
                wait.close();
                console.error("写入失败:", error);
                plus.nativeUI.toast("保存失败");
                reject(error);
            });
    });
}

// 路径记录器（不修改原读取方法）
export function trackPath(path) {
    console.log('设置文件路径:', path);
    __currentFilePath = path;
}

// 对外接口（set 方法）
export function setProject(userId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userId);
    trackPath(path);
    return saveData(data);
}

export function setTask(userId, projectId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userId, projectId);
    trackPath(path);
    return saveData(data);
}

export function setProperty(userId, buildingId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userId, buildingId);
    trackPath(path);
    return saveData(data);
}

export function setDisease(userId, buildingId, yearId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userId, buildingId, yearId);
    trackPath(path);
    return saveData(data);
}

// 保存图片到与JSON文件同级目录
export function saveDiseaseImages(userId, buildingId, tempImagePaths) {
    console.log('保存的图片tempImagePaths:',  tempImagePaths)
    return new Promise((resolve, reject) => {
        // 构建目标目录路径
        const targetDirPath = DOC_BASE_PATH + FILE_NAMING.diseaseImages(userId, buildingId);
        const fullTargetPath = getFullPath(targetDirPath);
        
        console.log('准备保存图片到目录:', fullTargetPath);
        
        // 显示加载提示
        const wait = plus.nativeUI.showWaiting("正在保存图片");
        
        // 确保目录存在
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            // 创建目录
            fs.root.getDirectory(targetDirPath, { create: true }, dirEntry => {
                console.log('目标目录已创建或已存在');
                
                // 保存所有图片
                const savePromises = tempImagePaths.map((tempPath, index) => {
                    return new Promise((resolveFile, rejectFile) => {
                        // 生成唯一的文件名
                        const fileName = `disease_${Date.now()}_${index}.jpg`;
                        const targetPath = `${targetDirPath}/${fileName}`;
                        
                        // 复制文件
                        plus.io.resolveLocalFileSystemURL(tempPath, fileEntry => {
                            fileEntry.copyTo(dirEntry, fileName, newFile => {
                                console.log(`图片 ${index + 1} 保存成功:`, newFile.fullPath);
                                const  relativePath = `${userId}/disease/images/${fileName}`;
                                //resolveFile(newFile.fullPath);
                                resolveFile(relativePath);
                            }, error => {
                                console.error(`图片 ${index + 1} 保存失败:`, error);
                                rejectFile(error);
                            });
                        }, error => {
                            console.error(`无法访问临时文件 ${tempPath}:`, error);
                            rejectFile(error);
                        });
                    });
                });
                
                // 等待所有图片保存完成
                Promise.all(savePromises)
                    .then(savedPaths => {
                        wait.close();
                        console.log('所有图片保存成功:', savedPaths);
                        // plus.nativeUI.toast("图片保存成功");
                        resolve(savedPaths);
                    })
                    .catch(error => {
                        wait.close();
                        console.error("图片保存失败:", error);
                        plus.nativeUI.toast("图片保存失败");
                        reject(error);
                    });
            }, error => {
                wait.close();
                console.error("创建目录失败:", error);
                plus.nativeUI.toast("创建图片目录失败");
                reject(error);
            });
        }, error => {
            wait.close();
            console.error("文件系统访问失败:", error);
            plus.nativeUI.toast("文件系统访问失败");
            reject(error);
        });
    });
}

export function readDiseaseImages(userId, buildingId, yearId, imagesPaths) {
    const targetDirPath = DOC_BASE_PATH + FILE_NAMING.diseaseImages(userId, buildingId);
}

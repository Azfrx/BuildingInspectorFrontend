// 文档基础路径
const DOC_BASE_PATH = '_doc/';
import { trackPath } from './reviseJson';

// 路径生成规则
const FILE_NAMING = {
    project: userId => `${userId}/project/projects.json`,
    task: (userId, projectId) => `${userId}/project/${projectId}/task.json`,
    property: (userId, buildingId) => `${userId}/building/${buildingId}/property.json`,
    object: (userId, buildingId) => `${userId}/building/${buildingId}/object.json`, // 新增object路径规则
    disease: (userId, buildingId, yearId) =>
        `${userId}/building/${buildingId}/disease/${yearId}.json`,
    AllUserInfo: userId => `${userId}/AllUserInfo.json`,
    diseaseImages: (userId, buildingId) =>
        `${userId}/building/${buildingId}/disease/images`,
    bridgeImages:  (userId, buildingId) => `${userId}/building/${buildingId}/images`,
    targetBridgeZip:  (userId, buildingId) => `${userId}/building/${buildingId}`,
};

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

// 对外接口（set 方法）
export function setProject(userId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setTask(userId, projectId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userId, projectId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setProperty(userId, buildingId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userId, buildingId);
    trackPath(path);
    return setJsonData(path, data);
}

// 新增object数据写入接口
export function setObject(userId, buildingId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.object(userId, buildingId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setDisease(userId, buildingId, yearId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userId, buildingId, yearId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setAllUserInfo(userId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.AllUserInfo(userId);
    trackPath(path);
    return setJsonData(path, data);
}

// 保存图片到与JSON文件同级目录
export function saveDiseaseImages(userId, buildingId, tempImagePaths) {
    console.log('保存的图片tempImagePaths:',  tempImagePaths)
    return new Promise((resolve, reject) => {
        // 构建目标目录路径
        const targetDirPath = DOC_BASE_PATH + FILE_NAMING.diseaseImages(userId, buildingId);
        // 确保目录存在
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            // 创建目录
            fs.root.getDirectory(targetDirPath, { create: true }, dirEntry => {

                // 保存所有图片
                const savePromises = tempImagePaths.map((tempPath, index) => {
                    console.log('准备保存图片:', tempPath)
                    return new Promise((resolveFile, rejectFile) => {
                        // 生成唯一的文件名
                        const fileName = `disease_${Date.now()}_${index}.jpg`;
                        const targetPath = `${targetDirPath}/${fileName}`;

                        // 检查是否是HTTP/HTTPS URL
                        if (tempPath.startsWith('http://') || tempPath.startsWith('https://')) {
                            // 处理网络图片
                            console.log(`开始下载网络图片: ${tempPath}`);
                            const downloadTask = plus.downloader.createDownload(tempPath, {
                                filename: targetPath
                            }, (d, status) => {
                                if (status === 200) {
                                    console.log(`网络图片 ${index + 1} 下载成功:`, d.filename);
                                    const relativePath = `${buildingId}/disease/images/${fileName}`;
                                    resolveFile(relativePath);
                                } else {
                                    console.error(`网络图片 ${index + 1} 下载失败:`, status);
                                    rejectFile(new Error(`下载失败，状态码: ${status}`));
                                }
                            });
                            
                            downloadTask.start();
                        } else {
                            // 处理本地图片
                            plus.io.resolveLocalFileSystemURL(tempPath, fileEntry => {
                                fileEntry.copyTo(dirEntry, fileName, newFile => {
                                    console.log(`图片 ${index + 1} 保存成功:`, newFile.fullPath);
                                    const relativePath = `${buildingId}/disease/images/${fileName}`;
                                    resolveFile(relativePath);
                                }, error => {
                                    console.error(`图片 ${index + 1} 保存失败:`, error);
                                    rejectFile(error);
                                });
                            }, error => {
                                console.error(`无法访问临时文件 ${tempPath}:`, error);
                                rejectFile(error);
                            });
                        }
                    });
                });

                // 等待所有图片保存完成
                console.log(`开始等待 ${savePromises.length} 个图片保存完成`);
                Promise.all(savePromises)
                    .then(savedPaths => {
                        console.log('Promise.all 已完成，所有图片保存成功:', savedPaths);
                        if (typeof wait !== 'undefined' && wait && wait.close) {
                            wait.close();
                        }
                        resolve(savedPaths);
                    })
                    .catch(error => {
                        console.error("Promise.all 出错，图片保存失败:", error);
                        if (typeof wait !== 'undefined' && wait && wait.close) {
                            wait.close();
                        }
                        plus.nativeUI.toast("图片保存失败");
                        reject(error);
                    });
            }, error => {
                if (typeof wait !== 'undefined' && wait && wait.close) {
                    wait.close();
                }
                console.error("创建目录失败:", error);
                plus.nativeUI.toast("创建图片目录失败");
                reject(error);
            });
        }, error => {
            if (typeof wait !== 'undefined' && wait && wait.close) {
                wait.close();
            }
            console.error("文件系统访问失败:", error);
            plus.nativeUI.toast("文件系统访问失败");
            reject(error);
        });
    });
}

export function saveBridgeImages(userId, buildingId, tempImagePaths) {
    console.log('保存的图片tempImagePaths:',  tempImagePaths)
    return new Promise((resolve, reject) => {
        // 构建目标目录路径
        const targetDirPath = DOC_BASE_PATH + FILE_NAMING.bridgeImages(userId, buildingId);

        // 确保目录存在
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            // 创建目录
            fs.root.getDirectory(targetDirPath, { create: true }, dirEntry => {

                // 保存所有图片
                const savePromises = tempImagePaths.map((tempPath, index) => {
                    console.log('准备保存图片:', tempPath)
                    return new Promise((resolveFile, rejectFile) => {
                        // 生成唯一的文件名
                        const fileName = `bridge_${Date.now()}_${index}.jpg`;
                        const targetPath = `${targetDirPath}/${fileName}`;
                        
                        // 检查是否是HTTP/HTTPS URL
                        if (tempPath.startsWith('http://') || tempPath.startsWith('https://')) {
                            // 处理网络图片
                            console.log(`开始下载网络图片: ${tempPath}`);
                            const downloadTask = plus.downloader.createDownload(tempPath, {
                                filename: targetPath
                            }, (d, status) => {
                                if (status === 200) {
                                    console.log(`网络图片 ${index + 1} 下载成功:`, d.filename);
                                    const relativePath = `${buildingId}/images/${fileName}`;
                                    resolveFile(relativePath);
                                } else {
                                    console.error(`网络图片 ${index + 1} 下载失败:`, status);
                                    rejectFile(new Error(`下载失败，状态码: ${status}`));
                                }
                            });
                            
                            downloadTask.start();
                        } else {
                            // 处理本地图片
                            plus.io.resolveLocalFileSystemURL(tempPath, fileEntry => {
                                fileEntry.copyTo(dirEntry, fileName, newFile => {
                                    console.log(`图片 ${index + 1} 保存成功:`, newFile.fullPath);
                                    const relativePath = `${buildingId}/images/${fileName}`;
                                    resolveFile(relativePath);
                                }, error => {
                                    console.error(`图片 ${index + 1} 保存失败:`, error);
                                    rejectFile(error);
                                });
                            }, error => {
                                console.error(`无法访问临时文件 ${tempPath}:`, error);
                                rejectFile(error);
                            });
                        }
                    });
                });

                // 等待所有图片保存完成
                console.log(`开始等待 ${savePromises.length} 个图片保存完成`);
                Promise.all(savePromises)
                    .then(savedPaths => {
                        console.log('Promise.all 已完成，所有图片保存成功:', savedPaths);
                        if (typeof wait !== 'undefined' && wait && wait.close) {
                            wait.close();
                        }
                        resolve(savedPaths);
                    })
                    .catch(error => {
                        console.error("Promise.all 出错，图片保存失败:", error);
                        if (typeof wait !== 'undefined' && wait && wait.close) {
                            wait.close();
                        }
                        plus.nativeUI.toast("图片保存失败");
                        reject(error);
                    });
            }, error => {
                if (typeof wait !== 'undefined' && wait && wait.close) {
                    wait.close();
                }
                console.error("创建目录失败:", error);
                plus.nativeUI.toast("创建图片目录失败");
                reject(error);
            });
        }, error => {
            if (typeof wait !== 'undefined' && wait && wait.close) {
                wait.close();
            }
            console.error("文件系统访问失败:", error);
            plus.nativeUI.toast("文件系统访问失败");
            reject(error);
        });
    });
}

export function saveBridgeImage(userId, buildingId, tempImagePath) {
    return saveBridgeImages(userId, buildingId, [tempImagePath])[0];
}

export function saveBridgeZip(userId, buildingId){
    //void plus.zip.compress(src, zipfile, successCB, errorCB);
    const src = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH + FILE_NAMING.targetBridgeZip(userId, buildingId));
    const zipfile = plus.io.convertLocalFileSystemURL( DOC_BASE_PATH + userId + '/building/' + buildingId);
    plus.zip.compress(src,zipfile,
        function() {
            console.log("Compress success!");
        },function(error) {
            console.log("Compress error!");
    });
    return zipfile + '.zip';
}


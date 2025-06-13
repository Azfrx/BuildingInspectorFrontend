// 文档基础路径
const DOC_BASE_PATH = '_doc/';
import { trackPath } from './reviseJson';

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

// 路径生成规则（不再依赖userId）
const FILE_NAMING = {
    project: userName => `${getUserDir(userName)}/project/projects.json`,
    task: (userName, projectId) => `${getUserDir(userName)}/project/${projectId}/task.json`,
    property: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/property.json`,
    object: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/object.json`,
    disease: (userName, buildingId, yearId) =>
        `${getUserDir(userName)}/building/${buildingId}/disease/${yearId}.json`,
    AllUserInfo: userName => `${getUserDir(userName)}/AllUserInfo.json`,
    diseaseImages: (userName, buildingId) =>
        `${getUserDir(userName)}/building/${buildingId}/disease/images`,
    bridgeImages:  (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/images`,
    targetBridgeZip:  (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}`,
};

// 核心文件写入方法（保持不变）
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

// 对外接口（仅使用userName）
export function setProject(userName, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userName);
    trackPath(path);
    return setJsonData(path, data);
}

export function setTask(userName, projectId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userName, projectId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setProperty(userName, buildingId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userName, buildingId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setObject(userName, buildingId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.object(userName, buildingId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setDisease(userName, buildingId, yearId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userName, buildingId, yearId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setAllUserInfo(userName, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.AllUserInfo(userName);
    trackPath(path);
    return setJsonData(path, data);
}

// 保存图片到与JSON文件同级目录
export function saveDiseaseImages(userName, buildingId, tempImagePaths) {
    console.log('保存的图片tempImagePaths:',  tempImagePaths)
    return new Promise((resolve, reject) => {
        // 构建目标目录路径
        const targetDirPath = DOC_BASE_PATH + FILE_NAMING.diseaseImages(userName, buildingId);
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

export function saveBridgeImages(userName, buildingId, tempImagePaths) {
    console.log('保存的图片tempImagePaths:',  tempImagePaths)
    return new Promise((resolve, reject) => {
        // 构建目标目录路径
        const targetDirPath = DOC_BASE_PATH + FILE_NAMING.bridgeImages(userName, buildingId);

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

export function saveBridgeImage(userName, buildingId, tempImagePath) {
    return saveBridgeImages(userName, buildingId, [tempImagePath])[0];
}

export function saveBridgeZip(userName, buildingId){
    //void plus.zip.compress(src, zipfile, successCB, errorCB);
    const src = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH + FILE_NAMING.targetBridgeZip(userName, buildingId));
    const zipfile = plus.io.convertLocalFileSystemURL( DOC_BASE_PATH + userName + '/building/' + buildingId);
    plus.zip.compress(src,zipfile,
        function() {
            console.log("Compress success!");
        },function(error) {
            console.log("Compress error!");
    });
    return zipfile + '.zip';
}


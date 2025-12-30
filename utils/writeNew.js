// 文档基础路径
import {userStore} from "@/store";

const DOC_BASE_PATH = '_doc/';
import {getAllFirstLevelDirs, getObject} from './readJsonNew';
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
    const userInfo = userStore()
    if (userInfo.hadUsername !== '') {
        //即找到了相同用户名但不同日期的文件夹
        //console.log("找到了，返回保存的hadname:", userInfo.hadUsername);
        return userInfo.hadUsername;
    } else {
        //console.log("没找到新拼一个");
        return `UD${getCurrentDateStr()}-${userName}`;
    }
}

// 路径生成规则（不再依赖userId）
const FILE_NAMING = {
    project: userName => `${getUserDir(userName)}/project/projects.json`,
    coverProject: userName => `${userName}/project/projects.json`,
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
    frontPhoto:  (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/frontPhoto.json`,
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
export async function setProject(userName, data) {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    // 构建项目文件路径
    const path = DOC_BASE_PATH + `${matchedDir}/project/projects.json`;
    trackPath(path);
    return setJsonData(path, data);
}

// 对外接口 覆盖已存在的project（仅使用userName）
export function coverProject(userName, data, oldProjectUsername) {
    const path = DOC_BASE_PATH + FILE_NAMING.coverProject(oldProjectUsername);
    trackPath(path);
    return setJsonData(path, data);
}

export async function setTask(userName, projectId, data) {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    // 构建项目文件路径
    const path = DOC_BASE_PATH + `${matchedDir}/project/${projectId}/task.json`;
    trackPath(path);
    return setJsonData(path, data);
}

export async function setProperty(userName, buildingId, data) {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    // 构建项目文件路径
    const path = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/property.json`;
    trackPath(path);
    return setJsonData(path, data);
}

export async function setObject(userName, buildingId, data) {
    try {
        // 查找匹配的目录
        const matchedDir = await findMatchingULDirectory(userName);
        if (!matchedDir) {
            throw new Error('无法找到或创建有效的UL目录');
        }
        
        // 构建项目文件路径
        const objectPath = `${matchedDir}/building/${buildingId}/object.json`;
        const fullPath = DOC_BASE_PATH + objectPath;
        console.log('准备写入对象文件路径:', fullPath);
        
        // 确保目录结构存在
        await ensureDirectoryExists(`${DOC_BASE_PATH}${matchedDir}/building/${buildingId}`);
        
        // 写入数据
        trackPath(fullPath);
        await setJsonData(fullPath, data);
        console.log('对象数据写入成功:', fullPath);
        return true;
    } catch (error) {
        console.error('写入对象数据失败:', error);
        throw error;
    }
}

export async function setDisease(userName, buildingId, yearId, data) {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    // 构建项目文件路径
    const path = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/disease/${yearId}.json`;
    // const path = DOC_BASE_PATH + FILE_NAMING.disease(userName, buildingId, yearId);
    trackPath(path);
    return setJsonData(path, data);
}

export function setAllUserInfo(userName, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.AllUserInfo(userName);
    trackPath(path);
    return setJsonData(path, data);
}
/**
 * 更新指定节点的病害数量（diseaseNumber + 1）
 * @param {string} userName 用户名
 * @param {string} buildingId 建筑ID
 * @param {string} nameOne 第一层级的name属性值
 * @param {string} nameTwo 第二层级的name属性值
 * @param {string} idThree 第三层级的id属性值
 * @returns {boolean} 是否成功更新
 */
export function addDiseaseNumber(userName, buildingId, nameOne, nameTwo, idThree) {
    // 构建文件路径
    const path = DOC_BASE_PATH + FILE_NAMING.object(userName, buildingId);
    trackPath(path); // 记录路径（假设是日志跟踪）
    
    // 获取原始数据对象
    const data = getObject(userName, buildingId);
    if (!data || !data.children) {
        console.error('数据格式错误：缺少children字段');
        return false;
    }

    // 第一层查找：通过name匹配
    const firstLevelItem = data.children.find(item => item.name === nameOne);
    if (!firstLevelItem) {
        console.error(`未找到第一层级项目：${nameOne}`);
        return false;
    }

    // 第二层查找：通过name匹配
    if (!firstLevelItem.children) {
        console.error(`项目${nameOne}缺少children字段`);
        return false;
    }
    const secondLevelItem = firstLevelItem.children.find(item => item.name === nameTwo);
    if (!secondLevelItem) {
        console.error(`未找到第二层级项目：${nameTwo}`);
        return false;
    }

    // 第三层查找：通过id匹配
    if (!secondLevelItem.children) {
        console.error(`项目${nameTwo}缺少children字段`);
        return false;
    }
    const targetItem = secondLevelItem.children.find(item => item.id === idThree);
    if (!targetItem) {
        console.error(`未找到目标项目ID：${idThree}`);
        return false;
    }

    // 更新病害数量（如果不存在则初始化为0后+1）
    targetItem.diseaseNumber = (targetItem.diseaseNumber || 0) + 1;
    console.log(`病害数量已更新：${targetItem.diseaseNumber}`);

    // 保存修改后的数据
    return setJsonData(path, data);
}
/**
 * 减少指定节点的病害数量（diseaseNumber - 1，最小值为0）
 * @param {string} userName 用户名
 * @param {string} buildingId 建筑ID
 * @param {string} nameOne 第一层级的name属性值
 * @param {string} nameTwo 第二层级的name属性值
 * @param {string} idThree 第三层级的id属性值
 * @returns {boolean} 是否成功更新
 */
export function decreaseDiseaseNumber(userName, buildingId, nameOne, nameTwo, idThree) {
    const path = DOC_BASE_PATH + FILE_NAMING.object(userName, buildingId);
    trackPath(path);
    const data = getObject(userName, buildingId);
    
    // 验证数据基础结构
    if (!data?.children) {
        console.error('数据格式错误：缺失children字段');
        return false;
    }

    // 三级层级查找（使用相同的查找逻辑）
    const firstLevel = data.children.find(item => item.name === nameOne);
    if (!firstLevel) {
        console.error(`[第一层] 未找到名称: ${nameOne}`);
        return false;
    }

    const secondLevel = firstLevel.children?.find(item => item.name === nameTwo);
    if (!secondLevel) {
        console.error(`[第二层] 未找到名称: ${nameTwo}`);
        return false;
    }

    const targetItem = secondLevel.children?.find(item => item.id === idThree);
    if (!targetItem) {
        console.error(`[第三层] 未找到ID: ${idThree}`);
        return false;
    }

    // 执行减1操作（确保不小于0）
    targetItem.diseaseNumber = Math.max(
        (targetItem.diseaseNumber || 0) - 1, 
        0
    );
    
    console.log(`病害数已更新: ${targetItem.diseaseNumber}`);
    return setJsonData(path, data);
}
// 保存图片到与JSON文件同级目录
export async function saveDiseaseImages(userName, buildingId, tempImagePaths) {
    console.log('保存的图片tempImagePaths:', tempImagePaths)
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    return new Promise((resolve, reject) => {
        // 构建目标目录路径
        // const targetDirPath = DOC_BASE_PATH + FILE_NAMING.diseaseImages(userName, buildingId);
        const targetDirPath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/disease/images`;
        // 确保目录存在
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            // 创建目录
            fs.root.getDirectory(targetDirPath, {create: true}, dirEntry => {

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

export async function saveBridgeImages(userName, buildingId, tempImagePaths) {
    console.log('保存的图片tempImagePaths:', tempImagePaths)
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    return new Promise((resolve, reject) => {
        // 构建目标目录路径
        // const targetDirPath = DOC_BASE_PATH + FILE_NAMING.bridgeImages(userName, buildingId);
        const targetDirPath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/images`;

        // 确保目录存在
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            // 创建目录
            fs.root.getDirectory(targetDirPath, {create: true}, dirEntry => {

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
    return new Promise(async (resolve, reject) => {
        try {
            // 等待saveBridgeImages完成并获取结果数组
            const imageUrls = await saveBridgeImages(userName, buildingId, [tempImagePath]);
            // 返回数组中的第一个元素
            if (imageUrls && imageUrls.length > 0) {
                resolve(imageUrls[0]);
            } else {
                reject(new Error('未能保存图片'));
            }
        } catch (error) {
            reject(error);
        }
    });
}

export async function saveBridgeZip(userName, buildingId, projectYear) {
    //void plus.zip.compress(src, zipfile, successCB, errorCB);
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    return new Promise((resolve, reject) => {
        // const src = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH + FILE_NAMING.targetBridgeZip(userName, buildingId));//DOC_BASE_PATH + `${matchedDir}/building/${buildingId}`;
        // 待压缩的文件夹路径
        const src = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH + `${matchedDir}/building/${buildingId}`);
        // const zipfile = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH + getUserDir(userName) + '/building/' + buildingId);
        // 压缩包路径
        const zipfile = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH + `${matchedDir}` + '/building/' + buildingId + '_' + projectYear);
        plus.zip.compress(src, zipfile,

            function () {
                console.log("Compress success!");
                resolve(zipfile + '.zip');
            },
            function (error) {
                console.log("Compress error:", error);
                reject(error);
            });
    });
}

export async function setFrontPhoto(userName, buildingId, data) {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    const path = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/frontPhoto.json`;
    return setJsonData(path, data);
}
export async function markObjectAsCommitted(userName, buildingId) {
    try {
        // 1. 读取现有object数据
        const data = await getObject(userName, buildingId);
        
        // 2. 修改Iscommit标志
        data.Iscommit = true;
        
        // 3. 写回修改后的数据
        await setObject(userName, buildingId, data);
        
    } catch (error) {
        throw new Error(`Commit operation failed: ${error.message}`);
    }
}

async function findMatchingULDirectory(userName) {
    try {
        // 获取_doc目录下的所有子目录
        const allDirs = await getAllFirstLevelDirs();

        // 获取用户信息store
        const userInfo = userStore();
        
        // 优先使用ULPath（如果已经在store中设置）
        if (userInfo.ULPath && allDirs.includes(userInfo.ULPath)) {
          
            return userInfo.ULPath;
        }

        // 如果没有project目录，查找以UL开头的目录
        const ulDirs = allDirs.filter(dir => dir.startsWith('UL'));
       

        // 遍历UL目录，查找匹配当前用户名的目录
        for (const dir of ulDirs) {
            // 提取目录名中的用户名部分（最后一个'-'后面的内容）
            const lastDashIndex = dir.lastIndexOf('-');
            if (lastDashIndex !== -1 && lastDashIndex < dir.length - 1) {
                const dirUsername = dir.substring(lastDashIndex + 1);
                

                // 检查提取的用户名是否与当前用户名匹配
                if (userName && dirUsername === userName) {
               
                    userInfo.setULPath(dir); // 保存到store中
                    return dir;
                }
            }
        }

        // 如果没有找到匹配的UL目录，尝试查找对应的UD目录
        const udDirs = allDirs.filter(dir => dir.startsWith('UD'));
        
        
        // 遍历UD目录，查找匹配当前用户名的目录
        for (const dir of udDirs) {
            const lastDashIndex = dir.lastIndexOf('-');
            if (lastDashIndex !== -1 && lastDashIndex < dir.length - 1) {
                const dirUsername = dir.substring(lastDashIndex + 1);
                
                // 如果找到匹配的UD目录，创建对应的UL目录
                if (userName && dirUsername === userName) {
                    // 创建对应的UL目录名称
                    const ulDir = 'UL' + dir.substring(2); // 替换UD为UL
                  
                    
                    // 创建UL目录
                    try {
                        await createDirectory(DOC_BASE_PATH + ulDir);
                        
                        userInfo.setULPath(ulDir); // 保存到store中
                        return ulDir;
                    } catch (error) {
                        console.error('创建UL目录失败:', error);
                    }
                }
            }
        }

        // // 如果没有找到匹配的目录，创建新的UL目录
        // const newULDir = `UL${getCurrentDateStr()}-${userName}`;
        // console.log('未找到任何匹配目录，创建新的UL目录:', newULDir);

        // try {
        //     await createDirectory(DOC_BASE_PATH + newULDir);
        //     console.log('成功创建新的UL目录:', newULDir);
        //     userInfo.setULPath(newULDir); // 保存到store中
        //     return newULDir;
        // } catch (error) {
        //     console.error('创建新的UL目录失败:', error);
        //     return null;
        // }
    } catch (error) {
        console.error('查找匹配UL目录时出错:', error);
        return null;
    }

}
// 辅助函数：创建目录
function createDirectory(path) {
    return new Promise((resolve, reject) => {
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            fs.root.getDirectory(path, { create: true }, dirEntry => {
               
                resolve(dirEntry);
            }, error => {
                console.error('目录创建失败:', error);
                reject(error);
            });
        }, error => {
            console.error('获取文件系统失败:', error);
            reject(error);
        });
    });
}

// 辅助函数：确保目录存在，如果不存在则创建
async function ensureDirectoryExists(path) {
    
    const parts = path.split('/').filter(Boolean);
    let currentPath = '';
    
    // 逐级创建目录
    for (let i = 0; i < parts.length; i++) {
        currentPath += '/' + parts[i];
        try {
            await createDirectory(currentPath);
        } catch (error) {
            // 如果目录已存在，忽略错误
            if (error.code !== 12) {
                console.error(`创建目录 ${currentPath} 失败:`, error);
                throw error;
            }
        }
    }
    
    return true;
}



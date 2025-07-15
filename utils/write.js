import { userStore } from "../store";

const DOC_BASE_PATH = '_doc/';

export async function setRootDir() {
    return new Promise((resolve, reject) => {
        // 获取当前用户信息
        const useInfo = userStore();
        const username = useInfo.username;
        
        if (!username) {
            reject(new Error('用户未登录，无法获取用户名'));
            return;
        }
        
        console.log('检查用户目录是否存在，用户名:', username);
        
        try {
            // 获取文件系统
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
                console.log('文件系统获取成功');
                
                // 读取根目录下的所有文件夹
                fs.root.createReader().readEntries(entries => {
                    console.log('读取到目录数量:', entries.length);
                    
                    // 查找匹配用户名的目录
                    let userDirEntry = null;
                    for (let i = 0; i < entries.length; i++) {
                        const entry = entries[i];
                        if (entry.isDirectory && entry.name.includes(`-${username}`)) {
                            console.log('找到已存在的用户目录:', entry.name, '完整路径:', entry.fullPath);
                            userDirEntry = entry;
                            break;
                        }
                    }
                    
                    if (userDirEntry) {
                        // 如果找到了用户目录，直接返回
                        console.log('用户目录已存在，无需创建');
                        resolve(userDirEntry);
                        return;
                    }
                    
                    // 如果没找到用户目录，创建新目录
                    // 生成动态目录名 (格式: UL-YYYYMMDDHHmmss-inspector@znjc)
                    const now = new Date();
                    const timestamp = 
                        now.getFullYear().toString() +
                        (now.getMonth() + 1).toString().padStart(2, '0') +
                        now.getDate().toString().padStart(2, '0') +
                        now.getHours().toString().padStart(2, '0') +
                        now.getMinutes().toString().padStart(2, '0') +
                        now.getSeconds().toString().padStart(2, '0');
                    
                    const dirName = `UL-${timestamp}-${username}`;
                    console.log('准备创建新目录:', dirName);
                    
                    // 创建目录
                    fs.root.getDirectory(
                        dirName,
                        { create: true, exclusive: false },
                        dirEntry => {
                            console.log('新目录创建成功:', dirEntry.fullPath);
                            resolve(dirEntry);
                        },
                        error => {
                            console.error('目录创建失败:', error);
                            reject(error);
                        }
                    );
                }, error => {
                    console.error('读取目录失败:', error);
                    reject(error);
                });
            }, error => {
                console.error('获取文件系统失败:', error);
                reject(error);
            });
        } catch (e) {
            console.error('setRootDir异常:', e);
            reject(e);
        }
    });
}

/**
 * 生成task.json文件
 * @param {String} projectId 项目ID
 * @param {Object} data 任务数据
 * @returns {Promise} 返回Promise对象
 */
export function writeTaskJson(projectId, data) {
    return new Promise((resolve, reject) => {
        try {
            const useInfo = userStore();
            const username = useInfo.username;
            
            console.log('writeTaskJson开始执行，参数:', { projectId, username });
            
            if (!username) {
                console.error('用户未登录，无法获取用户名');
                reject(new Error('用户未登录，无法获取用户名'));
                return;
            }
            
            console.log('开始查找用户目录，用户名:', username);
            
            // 获取文件系统
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
                console.log('文件系统获取成功，准备读取目录');
                
                // 读取根目录下的所有文件夹
                const reader = fs.root.createReader();
                reader.readEntries(entries => {
                    console.log('读取到目录数量:', entries.length);
                    
                    // 输出所有目录名称，方便调试
                    entries.forEach((entry, index) => {
                        if (entry.isDirectory) {
                            console.log(`目录[${index}]:`, entry.name);
                        }
                    });
                    
                    // 查找匹配用户名的目录
                    let userDirEntry = null;
                    for (let i = 0; i < entries.length; i++) {
                        const entry = entries[i];
                        if (entry.isDirectory && entry.name.includes(`-${username}`)) {
                            console.log('找到匹配的用户目录:', entry.name, '完整路径:', entry.fullPath);
                            userDirEntry = entry;
                            break;
                        }
                    }
                    
                    if (!userDirEntry) {
                        console.error(`未找到用户 ${username} 的目录，尝试查找UL-开头的目录`);
                        
                        // 如果没找到精确匹配，尝试查找UL-开头的最新目录
                        const ulDirs = entries.filter(entry => entry.isDirectory && entry.name.startsWith('UL-'));
                        if (ulDirs.length > 0) {
                            // 按名称排序，取最新的（假设名称中包含时间戳）
                            ulDirs.sort((a, b) => b.name.localeCompare(a.name));
                            userDirEntry = ulDirs[0];
                            console.log('使用最新的UL-目录:', userDirEntry.name);
                        } else {
                            console.error('未找到任何UL-开头的目录');
                            reject(new Error(`未找到用户 ${username} 的目录`));
                            return;
                        }
                    }
                    
                    // 在用户目录下创建project文件夹
                    userDirEntry.getDirectory('project', { create: true, exclusive: false }, projectDirEntry => {
                        console.log('project目录创建成功，路径:', projectDirEntry.fullPath);
                        
                        // 在project目录下创建以projectId命名的文件夹
                        projectDirEntry.getDirectory(projectId.toString(), { create: true, exclusive: false }, projectIdDirEntry => {
                            console.log(`项目目录 ${projectId} 创建成功，路径:`, projectIdDirEntry.fullPath);
                            
                            // 准备写入的JSON数据
                            const jsonData = JSON.stringify({
                                projectId,
                                ...data,
                                createTime: new Date().getTime()
                            }, null, 2); // 使用缩进格式化JSON
                            
                            console.log('准备写入的JSON数据:', jsonData);
                            
                            // 修复路径，确保没有双斜杠
                            const filePath = `${projectIdDirEntry.fullPath.replace(/\/\//g, '/')}/task.json`;
                            console.log('任务文件路径:', filePath);
                            
                            // 使用与writeNew.js相同的方法写入文件
                            projectIdDirEntry.getFile('task.json', { create: true }, fileEntry => {
                                fileEntry.createWriter(writer => {
                                    writer.onwriteend = () => {
                                        console.log('task.json内容写入成功完成');
                                        resolve(fileEntry);
                                    };
                                    writer.onerror = (error) => {
                                        console.error('task.json写入失败:', error);
                                        reject(error);
                                    };
                                    writer.write(jsonData);
                                }, error => {
                                    console.error('创建写入器失败:', error);
                                    reject(error);
                                });
                            }, error => {
                                console.error('创建task.json文件失败:', error);
                                reject(error);
                            });
                        }, error => {
                            console.error(`创建项目目录 ${projectId} 失败:`, error);
                            reject(error);
                        });
                    }, error => {
                        console.error('创建project目录失败:', error);
                        reject(error);
                    });
                }, error => {
                    console.error('读取目录失败:', error);
                    reject(error);
                });
            }, error => {
                console.error('获取文件系统失败:', error);
                reject(error);
            });
        } catch (e) {
            console.error('writeTaskJson异常:', e);
            reject(e);
        }
    });
}

/**
 * 生成object.json文件
 * @param {String} buildingId 建筑ID
 * @param {Object} data 对象数据
 * @returns {Promise} 返回Promise对象
 */
export function writeObjectJson(buildingId, data) {
    return new Promise((resolve, reject) => {
        try {
            const useInfo = userStore();
            const username = useInfo.username;
            
            console.log('writeObjectJson开始执行，参数:', { buildingId, username });
            
            if (!username) {
                console.error('用户未登录，无法获取用户名');
                reject(new Error('用户未登录，无法获取用户名'));
                return;
            }
            
            console.log('开始查找用户目录，用户名:', username);
            
            // 获取文件系统
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
                console.log('文件系统获取成功，准备读取目录');
                
                // 读取根目录下的所有文件夹
                const reader = fs.root.createReader();
                reader.readEntries(entries => {
                    console.log('读取到目录数量:', entries.length);
                    
                    // 查找匹配用户名的目录
                    let userDirEntry = null;
                    for (let i = 0; i < entries.length; i++) {
                        const entry = entries[i];
                        if (entry.isDirectory && entry.name.includes(`-${username}`)) {
                            console.log('找到匹配的用户目录:', entry.name, '完整路径:', entry.fullPath);
                            userDirEntry = entry;
                            break;
                        }
                    }
                    
                    if (!userDirEntry) {
                        console.error(`未找到用户 ${username} 的目录，尝试查找UL-开头的目录`);
                        
                        // 如果没找到精确匹配，尝试查找UL-开头的最新目录
                        const ulDirs = entries.filter(entry => entry.isDirectory && entry.name.startsWith('UL-'));
                        if (ulDirs.length > 0) {
                            // 按名称排序，取最新的（假设名称中包含时间戳）
                            ulDirs.sort((a, b) => b.name.localeCompare(a.name));
                            userDirEntry = ulDirs[0];
                            console.log('使用最新的UL-目录:', userDirEntry.name);
                        } else {
                            console.error('未找到任何UL-开头的目录');
                            reject(new Error(`未找到用户 ${username} 的目录`));
                            return;
                        }
                    }
                    
                    // 在用户目录下创建building文件夹
                    userDirEntry.getDirectory('building', { create: true, exclusive: false }, buildingDirEntry => {
                        console.log('building目录创建成功，路径:', buildingDirEntry.fullPath);
                        
                        // 在building目录下创建以buildingId命名的文件夹
                        buildingDirEntry.getDirectory(buildingId.toString(), { create: true, exclusive: false }, buildingIdDirEntry => {
                            console.log(`建筑目录 ${buildingId} 创建成功，路径:`, buildingIdDirEntry.fullPath);
                            
                            // 准备写入的JSON数据
                            const jsonData = JSON.stringify({
                                buildingId,
                                ...data,
                                createTime: new Date().getTime()
                            }, null, 2); // 使用缩进格式化JSON
                            
                            console.log('准备写入的JSON数据:', jsonData);
                            
                            // 修复路径，确保没有双斜杠
                            const filePath = `${buildingIdDirEntry.fullPath.replace(/\/\//g, '/')}/object.json`;
                            console.log('对象文件路径:', filePath);
                            
                            // 使用与writeNew.js相同的方法写入文件
                            buildingIdDirEntry.getFile('object.json', { create: true }, fileEntry => {
                                fileEntry.createWriter(writer => {
                                    writer.onwriteend = () => {
                                        console.log('object.json内容写入成功完成');
                                        resolve(fileEntry);
                                    };
                                    writer.onerror = (error) => {
                                        console.error('object.json写入失败:', error);
                                        reject(error);
                                    };
                                    writer.write(jsonData);
                                }, error => {
                                    console.error('创建写入器失败:', error);
                                    reject(error);
                                });
                            }, error => {
                                console.error('创建object.json文件失败:', error);
                                reject(error);
                            });
                        }, error => {
                            console.error(`创建建筑目录 ${buildingId} 失败:`, error);
                            reject(error);
                        });
                    }, error => {
                        console.error('创建building目录失败:', error);
                        reject(error);
                    });
                }, error => {
                    console.error('读取目录失败:', error);
                    reject(error);
                });
            }, error => {
                console.error('获取文件系统失败:', error);
                reject(error);
            });
        } catch (e) {
            console.error('writeObjectJson异常:', e);
            reject(e);
        }
    });
}
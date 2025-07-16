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
                    
                    // 查找所有UL开头的目录
                    const ulDirs = entries.filter(entry => 
                        entry.isDirectory && 
                        entry.name.startsWith('UL-') && 
                        entry.name.includes(`-${username}`)
                    );
                    
                    console.log(`找到 ${ulDirs.length} 个UL目录`);
                    
                    // 检查是否有带project和building子目录的UL目录
                    let validDirEntry = null;
                    let emptyDirs = [];
                    
                    // 先检查是否已经有包含子目录的UL目录
                    const checkDirPromises = ulDirs.map(dir => {
                        return new Promise((resolveCheck) => {
                            // 检查是否有project子目录
                            dir.getDirectory('project', { create: false }, 
                                () => {
                                    // 如果project目录存在，这是一个有效目录
                                    console.log(`找到包含project子目录的UL目录: ${dir.name}`);
                                    validDirEntry = dir;
                                    resolveCheck();
                                },
                                () => {
                                    // project目录不存在，这可能是一个空目录
                                    emptyDirs.push(dir);
                                    resolveCheck();
                                }
                            );
                        });
                    });
                    
                    Promise.all(checkDirPromises).then(() => {
                        if (validDirEntry) {
                            // 如果找到有效目录，使用它
                            console.log('使用已存在的有效UL目录:', validDirEntry.name);
                            useInfo.setULPath(validDirEntry.name);
                            
                            // 删除空的UL目录
                            if (emptyDirs.length > 0) {
                                console.log(`准备删除 ${emptyDirs.length} 个空的UL目录`);
                                emptyDirs.forEach(dir => {
                                    if (dir.name !== validDirEntry.name) {
                                        dir.removeRecursively(
                                            () => console.log(`成功删除空目录: ${dir.name}`),
                                            (err) => console.error(`删除目录失败: ${dir.name}`, err)
                                        );
                                    }
                                });
                            }
                            
                            // 确保子目录存在
                            createSubDirectories(validDirEntry, resolve, reject);
                            return;
                        }
                        
                        // 如果没有找到有效目录，但有空目录，使用第一个空目录
                        if (emptyDirs.length > 0) {
                            // 按名称排序，使用最新的空目录
                            emptyDirs.sort((a, b) => b.name.localeCompare(a.name));
                            const dirEntry = emptyDirs[0];
                            console.log('使用已存在的空UL目录:', dirEntry.name);
                            useInfo.setULPath(dirEntry.name);
                            
                            // 删除其他空目录
                            if (emptyDirs.length > 1) {
                                console.log(`准备删除 ${emptyDirs.length - 1} 个多余的空UL目录`);
                                emptyDirs.slice(1).forEach(dir => {
                                    dir.removeRecursively(
                                        () => console.log(`成功删除多余空目录: ${dir.name}`),
                                        (err) => console.error(`删除目录失败: ${dir.name}`, err)
                                    );
                                });
                            }
                            
                            // 创建子目录
                            createSubDirectories(dirEntry, resolve, reject);
                            return;
                        }
                        
                        // 如果没有找到任何UL目录，创建新目录
                        console.log('未找到任何UL目录，准备创建新目录');
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
                                
                                // 存储目录名到ULPath
                                useInfo.setULPath(dirName);
                                console.log('已将目录名存储到ULPath:', dirName);
                                
                                // 创建子目录
                                createSubDirectories(dirEntry, resolve, reject);
                            },
                            error => {
                                console.error('目录创建失败:', error);
                                reject(error);
                            }
                        );
                    }).catch(error => {
                        console.error('检查目录状态失败:', error);
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
            console.error('setRootDir异常:', e);
            reject(e);
        }
    });
}

/**
 * 创建project和building子目录
 * @param {DirectoryEntry} parentDir 父目录
 * @param {Function} resolve 成功回调
 * @param {Function} reject 失败回调
 */
function createSubDirectories(parentDir, resolve, reject) {
    console.log('开始创建子目录，父目录路径:', parentDir.fullPath);
    
    // 创建project目录
    parentDir.getDirectory('project', { create: true }, projectDir => {
        console.log('project目录创建成功:', projectDir.fullPath);
        
        // 创建building目录
        parentDir.getDirectory('building', { create: true }, buildingDir => {
            console.log('building目录创建成功:', buildingDir.fullPath);
            
            // 所有目录创建成功，返回父目录
            resolve(parentDir);
        }, error => {
            console.error('building目录创建失败:', error, '错误代码:', error.code, '错误信息:', error.message);
            // 即使building目录创建失败，也返回父目录
            resolve(parentDir);
        });
    }, error => {
        console.error('project目录创建失败:', error, '错误代码:', error.code, '错误信息:', error.message);
        // 即使project目录创建失败，也返回父目录
        resolve(parentDir);
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
                    
                    // 首先尝试使用store中保存的路径
                    let userDirEntry = null;
                    
                    // 优先检查ULPath和UDPath
                    if (useInfo.ULPath || useInfo.UDPath) {
                        const storedPath = useInfo.ULPath || useInfo.UDPath;
                        console.log('检查store中保存的路径:', storedPath);
                        
                        // 查找匹配的目录
                        for (let i = 0; i < entries.length; i++) {
                            const entry = entries[i];
                            if (entry.isDirectory && entry.name === storedPath) {
                                console.log('找到store中保存的目录:', entry.name);
                                userDirEntry = entry;
                                break;
                            }
                        }
                    }
                    
                    // 如果没找到store中的路径，查找匹配用户名的目录
                    if (!userDirEntry) {
                        for (let i = 0; i < entries.length; i++) {
                            const entry = entries[i];
                            if (entry.isDirectory && entry.name.includes(`-${username}`)) {
                                console.log('找到匹配的用户目录:', entry.name, '完整路径:', entry.fullPath);
                                userDirEntry = entry;
                                
                                // 更新store中的路径
                                useInfo.setULPath(entry.name);
                                useInfo.setUDPath(entry.name);
                                console.log('更新store中的路径:', entry.name);
                                break;
                            }
                        }
                    }
                    
                    if (!userDirEntry) {
                        console.error(`未找到用户 ${username} 的目录，尝试查找UD-开头或UL-开头的目录`);
                        
                        // 如果没找到精确匹配，尝试查找UD-开头或UL-开头的最新目录
                        const prefixDirs = entries.filter(entry => 
                            entry.isDirectory && (entry.name.startsWith('UD-') || entry.name.startsWith('UL-'))
                        );
                        
                        if (prefixDirs.length > 0) {
                            // 按名称排序，取最新的（假设名称中包含时间戳）
                            prefixDirs.sort((a, b) => b.name.localeCompare(a.name));
                            userDirEntry = prefixDirs[0];
                            console.log('使用最新的目录:', userDirEntry.name);
                            
                            // 更新store中的路径
                            useInfo.setULPath(userDirEntry.name);
                            useInfo.setUDPath(userDirEntry.name);
                        } else {
                            console.error('未找到任何UD-开头或UL-开头的目录');
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
            
            console.log('开始查找用户目录，用户名:', username, '当前ULPath:', useInfo.ULPath, '当前UDPath:', useInfo.UDPath);
            
            // 获取文件系统
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
                console.log('文件系统获取成功，准备读取目录');
                
                // 读取根目录下的所有文件夹
                const reader = fs.root.createReader();
                reader.readEntries(entries => {
                    console.log('读取到目录数量:', entries.length);
                    
                    // 首先尝试使用store中保存的路径
                    let userDirEntry = null;
                    
                    // 优先检查ULPath
                    if (useInfo.ULPath) {
                        const ulPath = useInfo.ULPath;
                        console.log('优先检查ULPath:', ulPath);
                        
                        // 查找匹配的目录
                        for (let i = 0; i < entries.length; i++) {
                            const entry = entries[i];
                            if (entry.isDirectory && entry.name === ulPath) {
                                console.log('找到ULPath对应的目录:', entry.name);
                                userDirEntry = entry;
                                break;
                            }
                        }
                    }
                    
                    // 如果没找到ULPath，检查UDPath
                    if (!userDirEntry && useInfo.UDPath) {
                        const udPath = useInfo.UDPath;
                        console.log('检查UDPath:', udPath);
                        
                        // 查找匹配的目录
                        for (let i = 0; i < entries.length; i++) {
                            const entry = entries[i];
                            if (entry.isDirectory && entry.name === udPath) {
                                console.log('找到UDPath对应的目录:', entry.name);
                                
                                // 如果找到了UD目录，但UL目录不存在，则创建对应的UL目录
                                if (udPath.startsWith('UD') && !useInfo.ULPath) {
                                    const ulPath = 'UL' + udPath.substring(2);
                                    console.log('根据UDPath生成ULPath:', ulPath);
                                    
                                    // 创建UL目录
                                    fs.root.getDirectory(ulPath, { create: true }, ulDirEntry => {
                                        console.log('UL目录创建成功:', ulDirEntry.name);
                                        useInfo.setULPath(ulPath);
                                        userDirEntry = ulDirEntry;
                                        continueWithUserDir(userDirEntry);
                                    }, error => {
                                        console.error('创建UL目录失败:', error);
                                        // 如果创建UL目录失败，则使用UD目录
                                        userDirEntry = entry;
                                        continueWithUserDir(userDirEntry);
                                    });
                                    return; // 提前返回，等待回调
                                } else {
                                    userDirEntry = entry;
                                }
                                break;
                            }
                        }
                    }
                    
                    // 如果没找到store中的路径，查找匹配用户名的目录
                    if (!userDirEntry) {
                        for (let i = 0; i < entries.length; i++) {
                            const entry = entries[i];
                            if (entry.isDirectory && entry.name.includes(`-${username}`)) {
                                console.log('找到匹配的用户目录:', entry.name, '完整路径:', entry.fullPath);
                                
                                // 优先使用UL目录
                                if (entry.name.startsWith('UL')) {
                                    userDirEntry = entry;
                                    useInfo.setULPath(entry.name);
                                    console.log('更新ULPath:', entry.name);
                                    break;
                                } else if (entry.name.startsWith('UD')) {
                                    // 如果是UD目录，检查是否有对应的UL目录
                                    const ulName = 'UL' + entry.name.substring(2);
                                    let hasUL = false;
                                    
                                    for (let j = 0; j < entries.length; j++) {
                                        if (entries[j].name === ulName) {
                                            userDirEntry = entries[j];
                                            useInfo.setULPath(entries[j].name);
                                            useInfo.setUDPath(entry.name);
                                            console.log('找到对应的UL目录:', entries[j].name);
                                            hasUL = true;
                                            break;
                                        }
                                    }
                                    
                                    if (!hasUL) {
                                        // 创建UL目录
                                        fs.root.getDirectory(ulName, { create: true }, ulDirEntry => {
                                            console.log('UL目录创建成功:', ulDirEntry.name);
                                            useInfo.setULPath(ulName);
                                            useInfo.setUDPath(entry.name);
                                            userDirEntry = ulDirEntry;
                                            continueWithUserDir(userDirEntry);
                                        }, error => {
                                            console.error('创建UL目录失败:', error);
                                            // 如果创建UL目录失败，则使用UD目录
                                            userDirEntry = entry;
                                            useInfo.setUDPath(entry.name);
                                            continueWithUserDir(userDirEntry);
                                        });
                                        return; // 提前返回，等待回调
                                    }
                                }
                            }
                        }
                    }
                    
                    if (!userDirEntry) {
                        console.error(`未找到用户 ${username} 的目录，尝试查找UD-开头或UL-开头的目录`);
                        
                        // 如果没找到精确匹配，尝试查找UL-开头的最新目录
                        let prefixDirs = entries.filter(entry => 
                            entry.isDirectory && entry.name.startsWith('UL')
                        );
                        
                        // 如果没有UL目录，查找UD目录
                        if (prefixDirs.length === 0) {
                            prefixDirs = entries.filter(entry => 
                                entry.isDirectory && entry.name.startsWith('UD')
                            );
                        }
                        
                        if (prefixDirs.length > 0) {
                            // 按名称排序，取最新的（假设名称中包含时间戳）
                            prefixDirs.sort((a, b) => b.name.localeCompare(a.name));
                            
                            if (prefixDirs[0].name.startsWith('UL')) {
                                userDirEntry = prefixDirs[0];
                                console.log('使用最新的UL目录:', userDirEntry.name);
                                useInfo.setULPath(userDirEntry.name);
                            } else {
                                // 如果是UD目录，创建对应的UL目录
                                const udName = prefixDirs[0].name;
                                const ulName = 'UL' + udName.substring(2);
                                
                                fs.root.getDirectory(ulName, { create: true }, ulDirEntry => {
                                    console.log('UL目录创建成功:', ulDirEntry.name);
                                    useInfo.setULPath(ulName);
                                    useInfo.setUDPath(udName);
                                    userDirEntry = ulDirEntry;
                                    continueWithUserDir(userDirEntry);
                                }, error => {
                                    console.error('创建UL目录失败:', error);
                                    // 如果创建UL目录失败，则使用UD目录
                                    userDirEntry = prefixDirs[0];
                                    useInfo.setUDPath(udName);
                                    continueWithUserDir(userDirEntry);
                                });
                                return; // 提前返回，等待回调
                            }
                        } else {
                            // 如果没有找到任何目录，创建新的UL目录
                            const now = new Date();
                            const timestamp = 
                                now.getFullYear().toString() +
                                (now.getMonth() + 1).toString().padStart(2, '0') +
                                now.getDate().toString().padStart(2, '0') +
                                now.getHours().toString().padStart(2, '0') +
                                now.getMinutes().toString().padStart(2, '0') +
                                now.getSeconds().toString().padStart(2, '0');
                            
                            const ulName = `UL-${timestamp}-${username}`;
                            
                            fs.root.getDirectory(ulName, { create: true }, ulDirEntry => {
                                console.log('新UL目录创建成功:', ulDirEntry.name);
                                useInfo.setULPath(ulName);
                                userDirEntry = ulDirEntry;
                                continueWithUserDir(userDirEntry);
                            }, error => {
                                console.error('创建新UL目录失败:', error);
                                reject(new Error(`未找到用户 ${username} 的目录，且无法创建新目录`));
                            });
                            return; // 提前返回，等待回调
                        }
                    }
                    
                    // 继续处理用户目录
                    continueWithUserDir(userDirEntry);
                    
                    // 定义一个函数来处理找到用户目录后的逻辑
                    function continueWithUserDir(dirEntry) {
                        // 在用户目录下创建building文件夹
                        dirEntry.getDirectory('building', { create: true, exclusive: false }, buildingDirEntry => {
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
                    }
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

/**
 * 保存下载的压缩包，并将路径存储到UDPath中
 * @param {String} zipUrl 压缩包URL或本地路径
 * @param {String} fileName 保存的文件名
 * @returns {Promise} 返回Promise对象
 */
export function saveZipAndStorePath(zipUrl, fileName) {
    return new Promise((resolve, reject) => {
        try {
            const useInfo = userStore();
            const username = useInfo.username;
            
            if (!username) {
                console.error('用户未登录，无法获取用户名');
                reject(new Error('用户未登录，无法获取用户名'));
                return;
            }
            
            console.log('开始保存压缩包，参数:', { zipUrl, fileName });
            
            // 生成保存路径
            const now = new Date();
            const timestamp = 
                now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0');
            
            const dirName = `UD-${timestamp}-${username}`;  // 使用UD前缀
            const savePath = `${DOC_BASE_PATH}${dirName}`;
            
            // 获取文件系统
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
                // 创建目录
                fs.root.getDirectory(dirName, { create: true, exclusive: false }, dirEntry => {
                    console.log('压缩包目录创建成功:', dirEntry.fullPath);
                    
                    // 如果是网络URL，下载文件
                    if (zipUrl.startsWith('http://') || zipUrl.startsWith('https://')) {
                        const downloadTask = plus.downloader.createDownload(zipUrl, {
                            filename: `${savePath}/${fileName || 'package.zip'}`
                        }, (d, status) => {
                            if (status === 200) {
                                console.log('压缩包下载成功:', d.filename);
                                
                                // 只保存目录名
                                const dirName = dirEntry.name;
                                
                                // 存储目录名到UDPath
                                useInfo.setUDPath(dirName);
                                console.log('已将目录名存储到UDPath:', dirName);
                                
                                resolve({
                                    path: d.filename,
                                    dirPath: dirName
                                });
                            } else {
                                console.error('压缩包下载失败:', status);
                                reject(new Error(`下载失败，状态码: ${status}`));
                            }
                        });
                        
                        downloadTask.start();
                    } 
                    // 如果是本地文件，复制到目标位置
                    else {
                        plus.io.resolveLocalFileSystemURL(zipUrl, fileEntry => {
                            const targetPath = `${savePath}/${fileName || 'package.zip'}`;
                            
                            // 获取目标文件对象
                            fs.root.getFile(targetPath, { create: true, exclusive: false }, targetEntry => {
                                // 复制文件
                                fileEntry.copyTo(dirEntry, fileName || 'package.zip', newFile => {
                                    console.log('压缩包复制成功:', newFile.fullPath);
                                    
                                    // 只保存目录名
                                    const dirName = dirEntry.name;
                                    
                                    // 存储目录名到UDPath
                                    useInfo.setUDPath(dirName);
                                    console.log('已将目录名存储到UDPath:', dirName);
                                    
                                    resolve({
                                        path: newFile.fullPath,
                                        dirPath: dirName
                                    });
                                }, error => {
                                    console.error('压缩包复制失败:', error);
                                    reject(error);
                                });
                            }, error => {
                                console.error('创建目标文件失败:', error);
                                reject(error);
                            });
                        }, error => {
                            console.error('无法访问源文件:', error);
                            reject(error);
                        });
                    }
                }, error => {
                    console.error('创建压缩包目录失败:', error);
                    reject(error);
                });
            }, error => {
                console.error('获取文件系统失败:', error);
                reject(error);
            });
        } catch (e) {
            console.error('saveZipAndStorePath异常:', e);
            reject(e);
        }
    });
}
// 文档基础路径
const DOC_BASE_PATH = '_doc/';
import {
	trackPath
} from './reviseJson';
import {
	userStore
} from '@/store/index.js'

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

// 路径生成规则（基于userName）
export const FILE_NAMING = {
	project: userName => `project/projects.json`,
	projectWithDate: userNameWithDate => `project/projects.json`,
	projectsFolder: userName => `project`,
	task: (userName, projectId) => `project/${projectId}/task.json`,
	taskWithDate: (userNameWithDate, projectId) => `project/${projectId}/task.json`,
	property: (userName, buildingId) => `building/${buildingId}/property.json`,
	disease: (userName, buildingId, yearId) =>
		`building/${buildingId}/disease/${yearId}.json`,
	Object: (userName, buildingId) => `building/${buildingId}/object.json`,
	// 新增用户信息路径规则
	user: userName => `user.json`,
	historyYear: (userName, buildingId) => `building/${buildingId}/disease`,
	AllUserInfo: userName => `AllUserInfo.json`,
	frontPhoto: (userName, buildingId) => `building/${buildingId}/frontPhoto.json`,
};

// 核心文件读取方法
async function getJsonData(path) {
  return new Promise((resolve, reject) => {
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
      fs.root.getFile(path, {
        create: false
      }, fileEntry => {
        fileEntry.file(file => {
          const reader = new plus.io.FileReader();
          reader.onload = () => {
            try {
              resolve(JSON.parse(reader.result));
            } catch (e) {
              reject(`JSON解析失败: ${path}, 错误: ${e.message}`);
            }
          };
          reader.onerror = (e) => {
            reject(`文件读取失败: ${path}, 错误: ${e.message || '未知错误'}`);
          };
          reader.readAsText(file);
        }, err => {
          reject(`获取文件对象失败: ${path}, 错误: ${err.message || '未知错误'}`);
        });
      }, err => {
        reject(`获取文件条目失败: ${path}, 错误: ${err.message || '未知错误'}`);
      });
    }, err => {
      reject(`获取文件系统失败: ${path}, 错误: ${err.message || '未知错误'}`);
    });
  });
}

// 辅助函数：查找匹配的目录
export async function findMatchingDirectory(userName) {
  try {
    // 获取_doc目录下的所有子目录
    const allDirs = await getAllFirstLevelDirs();
    
    // 首先检查是否有project目录（优先使用）
    if (allDirs.includes('project')) {
      console.log('找到project目录，直接使用');
      return 'project';
    }
    
    // 获取用户信息store
    const userInfo = userStore();
    
    // 优先使用UDPath（用于读取数据）
    if (userInfo.UDPath && allDirs.includes(userInfo.UDPath)) {
      console.log('使用store中保存的UDPath:', userInfo.UDPath);
      return userInfo.UDPath;
    }
    
    // 查找以UD开头的目录（用于读取数据）
    const udDirs = allDirs.filter(dir => dir.startsWith('UD'));
    console.log('找到UD开头的目录:', udDirs);
    
    // 遍历UD目录，查找匹配当前用户名的目录
    for (const dir of udDirs) {
      // 提取目录名中的用户名部分（最后一个'-'后面的内容）
      const lastDashIndex = dir.lastIndexOf('-');
      if (lastDashIndex !== -1 && lastDashIndex < dir.length - 1) {
        const dirUsername = dir.substring(lastDashIndex + 1);
        console.log(`目录 ${dir} 中的用户名: ${dirUsername}`);
        
        // 检查提取的用户名是否与当前用户名匹配
        if (userName && dirUsername === userName) {
          console.log('找到匹配的UD用户目录:', dir);
          userInfo.setUDPath(dir);
          console.log('UDPath:', userInfo.UDPath);
          return dir;
        }
      }
    }
    
    // 如果没有找到匹配的UD目录，返回null
    console.log('未找到匹配的UD目录，将使用默认路径');
    return null;
  } catch (error) {
    console.error('查找匹配UD目录时出错:', error);
    return null;
  }
}

// 修改getProject函数，使用辅助函数
export async function getProject(userName) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectory(userName);
    
    // 构建项目文件路径
	const projectPath = DOC_BASE_PATH + matchedDir + '/project/projects.json';
    
    console.log('最终使用的项目文件路径:', projectPath);
    trackPath(projectPath);
    
    try {
      // 读取项目文件
      return await getJsonData(projectPath);
    } catch (readError) {
      console.error('读取项目文件失败:', readError);
      // 返回默认的项目数据结构
      return {
        code: 0,
        msg: "success",
        data: {
          projects: []
        }
      };
    }
  } catch (error) {
    console.error('获取项目数据失败:', error);
    // 返回默认的项目数据结构
    return {
      code: 0,
      msg: "success",
      data: {
        projects: []
      }
    };
  }
}

//此username是带日期的
export function getHadProject(userNameWithDate) {
	const path = DOC_BASE_PATH + FILE_NAMING.projectWithDate(userNameWithDate);
	return getJsonData(path);
}

// 修改getTask函数，使用辅助函数
export async function getTask(userName, projectId) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectory(userName);
    
    // 构建任务文件路径
	const  taskPath = DOC_BASE_PATH + `${matchedDir}/project/${projectId}/task.json`;
    
    console.log('任务文件路径:', taskPath);
    trackPath(taskPath);
    
    try {
      // 读取任务文件
      return await getJsonData(taskPath);
    } catch (readError) {
      console.error('读取任务文件失败:', readError);
      // 返回默认的任务数据结构
      return {
        code: 0,
        msg: "success",
        data: {
          tasks: []
        }
      };
    }
  } catch (error) {
    console.error('获取任务数据失败:', error);
    // 返回默认的任务数据结构
    return {
      code: 0,
      msg: "success",
      data: {
        tasks: []
      }
    };
  }
}

// 修改getTaskByHadUsername函数
export async function getTaskByHadUsername(hadUsername, projectId) {
  try {
    // 这个函数已经有明确的目录名，直接使用
    const path = DOC_BASE_PATH + `${hadUsername}/project/${projectId}/task.json`;
    trackPath(path);
    
    try {
      return await getJsonData(path);
    } catch (readError) {
      console.error('读取指定用户任务文件失败:', readError);
      // 返回默认的任务数据结构
      return {
        code: 0,
        msg: "success",
        data: {
          tasks: []
        }
      };
    }
  } catch (error) {
    console.error('获取指定用户任务数据失败:', error);
    // 返回默认的任务数据结构
    return {
      code: 0,
      msg: "success",
      data: {
        tasks: []
      }
    };
  }
}

export async function getProperty(userName, buildingId) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectory(userName);
    
    // 构建属性文件路径
    const propertyPath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/property.json`;
    
    console.log('属性文件路径:', propertyPath);
    trackPath(propertyPath);
    
    try {
      // 读取属性文件
      return await getJsonData(propertyPath);
    } catch (readError) {
      console.log('属性文件不存在，返回默认数据结构:', readError);
      // 返回默认的属性数据结构
      return {
        code: 0,
        msg: "success",
        data: {}
      };
    }
  } catch (error) {
    console.error('获取属性数据失败:', error);
    // 返回默认的属性数据结构，而不是抛出错误
    return {
      code: 0,
      msg: "success",
      data: {}
    };
  }
}

export async function getDisease(userName, buildingId, yearId) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectory(userName);
    
    // 构建病害文件路径
    const diseasePath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/disease/${yearId}.json`;
    
    console.log('病害文件路径:', diseasePath);
    trackPath(diseasePath);
    
    try {
      // 读取病害文件
      return await getJsonData(diseasePath);
    } catch (readError) {
      console.log('病害文件不存在，返回默认数据结构:', readError);
      // 返回默认的病害数据结构
      return {
        code: 0,
        msg: "success",
        diseases: []
      };
    }
  } catch (error) {
    console.error('获取病害数据失败:', error);
    // 返回默认的病害数据结构，而不是抛出错误
    return {
      code: 0,
      msg: "success",
      diseases: []
    };
  }
}

export async function getObject(userName, buildingId) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectory(userName);
    
    // 构建对象文件路径
    const objectPath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/object.json`;
    
    console.log('对象文件路径:', objectPath);
    trackPath(objectPath);
    
    try {
      // 读取对象文件
      return await getJsonData(objectPath);
    } catch (readError) {
      console.log('对象文件不存在，返回默认数据结构:', readError);
      // 返回默认的对象数据结构
      return {
        code: 0,
        msg: "success",
        buildingId: buildingId,
        Iscommit: false
      };
    }
  } catch (error) {
    console.error('获取对象数据失败:', error);
    // 返回默认的对象数据结构，而不是抛出错误
    return {
      code: 0,
      msg: "success",
      buildingId: buildingId,
      Iscommit: false
    };
  }
}

// export async function getAllUserInfo(userName) {
//   try {
//     // 查找匹配的目录
//     const matchedDir = await findMatchingDirectory(userName);
    
//     // 构建用户信息文件路径
//     let userInfoPath;
//     if (matchedDir === 'project') {
//       // 如果是project目录，使用默认路径
//       userInfoPath = DOC_BASE_PATH + 'AllUserInfo.json';
//     } else if (matchedDir) {
//       // 如果找到匹配的用户目录，使用该目录
//       userInfoPath = DOC_BASE_PATH + `${matchedDir}/AllUserInfo.json`;
//     } else {
//       // 如果没有找到匹配的目录，尝试使用默认路径
//       userInfoPath = DOC_BASE_PATH + 'AllUserInfo.json';
//     }
    
//     console.log('用户信息文件路径:', userInfoPath);
//     trackPath(userInfoPath);
    
//     // 读取用户信息文件
//     return await getJsonData(userInfoPath);
//   } catch (error) {
//     console.error('获取用户信息数据失败:', error);
//     throw error;
//   }
// }

// 获取历史年份方法（返回除当前年份外的所有年份字符串倒序数组）
export async function getHistoryYear(userName, buildingId) {
	try {
		// 查找匹配的目录
		const matchedDir = await findMatchingDirectory(userName);
		// 1. 构建目标目录路径
		const dirPath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/disease`;
		console.log(`历史病害目标目录: ${dirPath}`);

		try {
			// 2. 获取目录下的文件列表
			const files = await listDirectoryFiles(dirPath);

			// 3. 过滤出年份JSON文件 (格式: YYYY.json)
			const yearFiles = files.filter(file =>
				file.name && /^\d{4}\.json$/.test(file.name)
			);

			// 4. 提取年份字符串（保留原始格式）
			const years = yearFiles.map(file =>
				file.name.split('.')[0] // 直接返回字符串
			);

			// 5. 获取当前年份字符串
			const currentYear = String(new Date().getFullYear());

			// 6. 过滤掉当前年份并倒序排序
			const filteredYears = years
				.filter(year => year !== currentYear) // 字符串比较
				.sort((a, b) => {
					// 转换为数字进行比较，但保持返回字符串
					return Number(b) - Number(a); // 从大到小排序
				});

			console.log(`找到历史年份: ${filteredYears.join(',')}`);
			return filteredYears;
		} catch (error) {
			console.log('读取历史年份目录失败，返回空数组:', error);
			return [];
		}
	} catch (error) {
		console.error('获取历史年份时出错:', error);
		return []; // 出错时返回空数组
	}
}

// 辅助方法：列出目录中的文件
export function listDirectoryFiles(path) {
	return new Promise((resolve, reject) => {
		// 1. 获取完整的沙盒目录路径
		const fullPath = plus.io.convertLocalFileSystemURL(path);
		plus.io.resolveLocalFileSystemURL(fullPath, entry => {
			if (entry.isDirectory) {
				const directoryReader = entry.createReader();
				directoryReader.readEntries(
					entries => resolve(Array.from(entries)),
					reject
				);
			} else {
				reject(new Error('路径不是目录'));
			}
		}, reject);
	});
}

// 将图片相对路径转为绝对路径进行读取
export async function readDiseaseImages(userName, buildingId, relativePaths) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    
    // 处理数组情况
    if (Array.isArray(relativePaths)) {
      return Promise.all(relativePaths.map(async (path) => {
        let fullPath;
        if (matchedDir === 'project') {
          // 如果是project目录，使用默认building路径
          fullPath = DOC_BASE_PATH + 'building/' + path;
        } else if (matchedDir) {
          // 如果找到匹配的用户目录，使用该目录
          fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + path;
        } else {
          // 如果没有找到匹配的目录，尝试使用默认路径
          fullPath = DOC_BASE_PATH + 'building/' + path;
        }
        
        // 转为本地绝对路径
        return plus.io.convertLocalFileSystemURL(fullPath);
      }));
    } else {
      // 保持原有单个路径的处理逻辑
      let fullPath;
      if (matchedDir === 'project') {
        // 如果是project目录，使用默认building路径
        fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
      } else if (matchedDir) {
        // 如果找到匹配的用户目录，使用该目录
        fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + relativePaths;
      } else {
        // 如果没有找到匹配的目录，尝试使用默认路径
        fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
      }
      
      // 转为本地绝对路径
      return plus.io.convertLocalFileSystemURL(fullPath);
    }
  } catch (error) {
    console.error('读取病害图片失败:', error);
    throw error;
  }
}

export async function readDiseaseUDImages(userName, buildingId, relativePaths) {
    try {
        // 查找匹配的目录
        const matchedDir = await findMatchingDirectory(userName);

        // 处理数组情况
        if (Array.isArray(relativePaths)) {
            return Promise.all(relativePaths.map(async (path) => {
                let fullPath;
                if (matchedDir === 'project') {
                    // 如果是project目录，使用默认building路径
                    fullPath = DOC_BASE_PATH + 'building/' + path;
                } else if (matchedDir) {
                    // 如果找到匹配的用户目录，使用该目录
                    fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + path;
                } else {
                    // 如果没有找到匹配的目录，尝试使用默认路径
                    fullPath = DOC_BASE_PATH + 'building/' + path;
                }

                // 转为本地绝对路径
                return plus.io.convertLocalFileSystemURL(fullPath);
            }));
        } else {
            // 保持原有单个路径的处理逻辑
            let fullPath;
            if (matchedDir === 'project') {
                // 如果是project目录，使用默认building路径
                fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
            } else if (matchedDir) {
                // 如果找到匹配的用户目录，使用该目录
                fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + relativePaths;
            } else {
                // 如果没有找到匹配的目录，尝试使用默认路径
                fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
            }

            // 转为本地绝对路径
            return plus.io.convertLocalFileSystemURL(fullPath);
        }
    } catch (error) {
        console.error('读取病害图片失败:', error);
        throw error;
    }
}

//从UL中读取图片
export async function readBridgeImage(userName, buildingId, relativePaths) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    
    // 处理数组情况
    if (Array.isArray(relativePaths)) {
      return Promise.all(relativePaths.map(async (path) => {
        let fullPath;
        if (matchedDir === 'project') {
          // 如果是project目录，使用默认building路径
          fullPath = DOC_BASE_PATH + 'building/' + path;
        } else if (matchedDir) {
          // 如果找到匹配的用户目录，使用该目录
          fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + path;
        } else {
          // 如果没有找到匹配的目录，尝试使用默认路径
          fullPath = DOC_BASE_PATH + 'building/' + path;
        }
        
        // 转为本地绝对路径
        return plus.io.convertLocalFileSystemURL(fullPath);
      }));
    } else {
      // 保持原有单个路径的处理逻辑
      let fullPath;
      if (matchedDir === 'project') {
        // 如果是project目录，使用默认building路径
        fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
      } else if (matchedDir) {
        // 如果找到匹配的用户目录，使用该目录
        fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + relativePaths;
      } else {
        // 如果没有找到匹配的目录，尝试使用默认路径
        fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
      }
      
      // 转为本地绝对路径
      return plus.io.convertLocalFileSystemURL(fullPath);
    }
  } catch (error) {
    console.error('读取桥梁图片失败:', error);
    throw error;
  }
}

//从UD中读取图片
export async function readBridgeUDImage(userName, buildingId, relativePaths){
    try {
        // 查找匹配的目录
        const matchedDir = await findMatchingDirectory(userName);

        // 处理数组情况
        if (Array.isArray(relativePaths)) {
            return Promise.all(relativePaths.map(async (path) => {
                let fullPath;
                if (matchedDir === 'project') {
                    // 如果是project目录，使用默认building路径
                    fullPath = DOC_BASE_PATH + 'building/' + path;
                } else if (matchedDir) {
                    // 如果找到匹配的用户目录，使用该目录
                    fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + path;
                } else {
                    // 如果没有找到匹配的目录，尝试使用默认路径
                    fullPath = DOC_BASE_PATH + 'building/' + path;
                }

                // 转为本地绝对路径
                return plus.io.convertLocalFileSystemURL(fullPath);
            }));
        } else {
            // 保持原有单个路径的处理逻辑
            let fullPath;
            if (matchedDir === 'project') {
                // 如果是project目录，使用默认building路径
                fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
            } else if (matchedDir) {
                // 如果找到匹配的用户目录，使用该目录
                fullPath = DOC_BASE_PATH + `${matchedDir}/building/` + relativePaths;
            } else {
                // 如果没有找到匹配的目录，尝试使用默认路径
                fullPath = DOC_BASE_PATH + 'building/' + relativePaths;
            }

            // 转为本地绝对路径
            return plus.io.convertLocalFileSystemURL(fullPath);
        }
    } catch (error) {
        console.error('读取桥梁图片失败:', error);
        throw error;
    }
}


//读取所有一级子目录
export function getAllFirstLevelDirs() {
	return new Promise((resolve, reject) => {
		const fullPath = DOC_BASE_PATH;

		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
			fs.root.getDirectory(fullPath, {
				create: false
			}, dirEntry => {
				const directoryReader = dirEntry.createReader();
				directoryReader.readEntries(entries => {
					const dirNames = entries
						.filter(entry => entry.isDirectory)
						.map(entry => entry.name);
					resolve(dirNames);
				}, reject);
			}, err => {
				// 如果目录不存在，返回空数组而不是reject
				if (err.code === err.NOT_FOUND_ERR) {
					resolve([]);
				} else {
					reject(`无法访问目录: ${fullPath}`);
				}
			});
		}, reject);
	});
}

export async function getFrontPhoto(userName, buildingId) {
    // 查找匹配的目录
    const matchedDir = await findMatchingULDirectory(userName);
    const path = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/frontPhoto.json`;
    trackPath(path);
    return getJsonData(path);
}

export async function getUDFrontPhoto(userName, buildingId) {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectory(userName);
    const path = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/frontPhoto.json`;
    trackPath(path);
    return getJsonData(path);
}

export function removeDiseaseImage(paths) {
	return new Promise((resolve, reject) => {
		try {
			// 如果是数组，处理多个文件
			if (Array.isArray(paths)) {
				const results = [];
				const errors = [];

				// 处理每个文件
				paths.forEach((absolutePath, index) => {
					plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
						entry.remove(
							() => {
								console.log(`成功删除图片: ${absolutePath}`);
								results.push({
									path: absolutePath,
									success: true
								});

								// 当所有文件处理完成后，返回结果
								if (results.length + errors.length === paths.length) {
									resolve({
										success: errors.length === 0,
										results: results,
										errors: errors
									});
								}
							},
							(err) => {
								console.error(`删除图片失败: ${absolutePath}`, err);
								errors.push({
									path: absolutePath,
									error: err.message || '删除失败'
								});

								// 当所有文件处理完成后，返回结果
								if (results.length + errors.length === paths.length) {
									resolve({
										success: errors.length === 0,
										results: results,
										errors: errors
									});
								}
							}
						);
					}, (err) => {
						console.error(`无法解析文件路径: ${absolutePath}`, err);
						errors.push({
							path: absolutePath,
							error: '无法解析文件路径'
						});

						// 当所有文件处理完成后，返回结果
						if (results.length + errors.length === paths.length) {
							resolve({
								success: errors.length === 0,
								results: results,
								errors: errors
							});
						}
					});
				});
			} else {
				// 处理单个文件
				const absolutePath = paths;

				plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
					entry.remove(
						() => {
							console.log(`成功删除图片: ${absolutePath}`);
							resolve({
								success: true,
								path: absolutePath
							});
						},
						(err) => {
							console.error(`删除图片失败: ${absolutePath}`, err);
							reject({
								success: false,
								path: absolutePath,
								error: err.message || '删除失败'
							});
						}
					);
				}, (err) => {
					console.error(`无法解析文件路径: ${absolutePath}`, err);
					reject({
						success: false,
						path: absolutePath,
						error: '无法解析文件路径'
					});
				});
			}
		} catch (error) {
			console.error('删除图片时发生错误:', error);
			reject({
				success: false,
				error: error.message || '删除过程中发生错误'
			});
		}
	});
}

//是否有未提交病害
export async function readDiseaseCommit(userName, buildingId, yearId) {
	try {
		// 获取病害数据并等待Promise解析
		const diseaseData = await getULDisease(userName, buildingId, yearId);

		// 检查diseases数组是否存在
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return false;
		}

		// 使用some方法检查是否有任何病害的commit_type为1（未提交）或为2（需要删除）
		const hasUncommittedDiseases = diseaseData.diseases.some(disease => disease.commitType === 1 || disease
			.commitType === 2);

		console.log(`检查未提交病害: ${hasUncommittedDiseases ? '有未提交病害' : '全部已提交'}`);
		return hasUncommittedDiseases;
	} catch (error) {
		console.error('检查病害提交状态时出错:', error);
		return false; // 出错时返回false
	}
}

// 统计某个构件中病害构件数量
export async function readDiseaseComponent(userName, buildingId, biObjectId) {
	const currentYear = new Date().getFullYear().toString();

	try {
		// 获取当前年份的病害数据
		const diseaseData = await getULDisease(userName, buildingId, currentYear);

		// 检查数据是否有效
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return 0; // 如果没有数据或格式不正确，返回0
		}

		// 用于存储已经统计过的code，避免重复计数
		const countedCodes = new Set();

		// 统计符合条件的病害数量
		let count = 0;

		// 遍历所有病害
		diseaseData.diseases.forEach(disease => {
			// 排除已删除的病害记录(commit_type为2)
			if (disease.commitType === 2) {}

			// 检查component字段是否存在且biObjectId匹配
			else if (disease.component &&
				disease.component.biObjectId === biObjectId &&
				disease.component.code) {

				const code = disease.component.code;

				// 检查这个code是否已经被统计过
				if (!countedCodes.has(code)) {
					// 如果没有被统计过，计数加1并将code添加到Set中
					count++;
					countedCodes.add(code);
				}
			}
		});

		console.log(`biObjectId ${biObjectId} 下不重复的code数量: ${count}`);
		return count;

	} catch (error) {
		console.error('统计病害组件出错:', error);
		return 0; // 出错时返回0
	}
}

// 新增病害时判断某一构建下面是否有病害
export async function isExistDisease(userName, buildingId, componentName, biObjectId) {
	try {
		// 获取当前年份
		const currentYear = new Date().getFullYear().toString();

		// 获取当前年份的病害数据
		const diseaseData = await getULDisease(userName, buildingId, currentYear);

		// 检查数据是否有效
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return false; // 如果没有数据或格式不正确，返回false
		}

		// 过滤掉已删除的病害记录，然后检查剩余记录中是否存在匹配的componentName
		const exists = diseaseData.diseases.filter(disease => disease.commitType !== 2)
			.some(disease => disease.component && disease.component.name === componentName && disease.component.biObject.id === biObjectId);

		console.log(`检查componentName为 ${componentName} 的病害${exists ? '存在' : '不存在'}`);
		return exists;

	} catch (error) {
		console.error('检查病害是否存在与某个构件上时出错:', error);
		return false; // 出错时返回false
	}
}

// 删除病害时判断某一构建下面是否只有一个病害
export async function isOnlyDisease(userName, buildingId, componentName, biObjectId) {
	try {
		// 获取当前年份
		const currentYear = new Date().getFullYear().toString();

		// 获取当前年份的病害数据
		const diseaseData = await getULDisease(userName, buildingId, currentYear);

		// 检查数据是否有效
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return false; // 如果没有数据或格式不正确，返回false
		}

		// 过滤出与指定componentName匹配且未删除的病害记录
		const matchingDiseases = diseaseData.diseases.filter(disease =>
			disease.component &&
			disease.component.name === componentName &&
            disease.component.biObject.id === biObjectId &&
			disease.commitType !== 2 // 排除已删除的病害记录
		);

		// 检查是否只有一个匹配的记录
		const isOnly = matchingDiseases.length === 1;

		console.log(`componentName为 ${componentName},biObjectId为${biObjectId} 的病害${isOnly ? '只有一个' : '有多个或没有'}`);
		return isOnly;

	} catch (error) {
		console.error('检查病害是否唯一时出错:', error);
		return false; // 出错时返回false
	}
}
// 判断是否编辑过 
export async function isCommit(userName, buildingId) {
	const data = await getObject(userName, buildingId);
	if (data.Iscommit == true) {
		return true;
	} else {
		return false;
	}
}

//提交时判断是否有未完成的病害，commitType == 3的病害
export async function isUnFinishDisease(userName, buildingId, yearId) {
	try {
		// 获取病害数据并等待Promise解析
		const diseaseData = await getULDisease(userName, buildingId, yearId);

		// 检查diseases数组是否存在
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return false;
		}

		// 使用some方法检查是否有任何病害的commit_type为3（未完成）
		const hasUnFinishDiseases = diseaseData.diseases.some(disease => disease.commitType === 3);

		console.log(`检查未完成病害: ${hasUnFinishDiseases ? '有未完成病害' : '没有未完成病害'}`);
		return hasUnFinishDiseases;
	} catch (error) {
		console.error('检查病害完成状态时出错:', error);
		return false; // 出错时返回false
	}
}

//读取绝对路径为相对路径
export function buildingImagesFromAbsoluteToRelative(absolutePaths) {
	return absolutePaths.map(path => {
		const parts = path.split('/building/');
		if (parts.length < 2) {
			return '';
		}
		console.log('parts', parts);
		return parts[1]; // 返回'/building/'后面的部分
	});
}

//读取UL下的数据
async function findMatchingULDirectory(userName) {
    try {
        // 获取_doc目录下的所有子目录
        const allDirs = await getAllFirstLevelDirs();

        // 首先检查是否有project目录（优先使用）
        if (allDirs.includes('project')) {
            console.log('找到project目录，直接使用');
            return 'project';
        }

        // 如果没有project目录，查找以UD开头的目录
        const ulDirs = allDirs.filter(dir => dir.startsWith('UL'));

        // 遍历UD目录，查找匹配当前用户名的目录
        for (const dir of ulDirs) {
            // 提取目录名中的用户名部分（最后一个'-'后面的内容）
            const lastDashIndex = dir.lastIndexOf('-');
            if (lastDashIndex !== -1 && lastDashIndex < dir.length - 1) {
                const dirUsername = dir.substring(lastDashIndex + 1);
                console.log(`目录 ${dir} 中的用户名: ${dirUsername}`);

                // 检查提取的用户名是否与当前用户名匹配
                if (userName && dirUsername === userName) {
                    console.log('找到匹配的用户目录:', dir);
                    return dir;
                }
            }
        }

        // 如果没有找到匹配的目录，返回null
        console.log('未找到匹配的目录，将使用默认路径');
        return null;
    } catch (error) {
        console.error('查找匹配目录时出错:', error);
        return null;
    }
}

//UL下的病害json
export async function getULDisease(userName, buildingId, yearId){
    try {
        // 查找匹配的目录
        const matchedDir = await findMatchingULDirectory(userName);

        // 构建病害文件路径
        const diseasePath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/disease/${yearId}.json`;

        trackPath(diseasePath);

        // 读取病害文件
        return await getJsonData(diseasePath);
    } catch (error) {
        console.error('获取病害数据失败:', error);
        throw error;
    }
}
//UL下的正立面照
export async function getULFrontPhoto(userName, buildingId){
    try {
        // 查找匹配的目录
        const matchedDir = await findMatchingULDirectory(userName);

        // 构建病害文件路径
        const diseasePath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/frontPhoto.json`;

        trackPath(diseasePath);

        // 读取病害文件
        return await getJsonData(diseasePath);
    } catch (error) {
        console.error('获取正立面照数据失败:', error);
        throw error;
    }
}

//UL下的task.json
export async function getULTask(userName, projectId){
    try {
        // 查找匹配的目录
        const matchedDir = await findMatchingULDirectory(userName);

        // 构建病害文件路径
        const diseasePath = DOC_BASE_PATH + `${matchedDir}/project/${projectId}/task.json`;

        trackPath(diseasePath);

        // 读取病害文件
        return await getJsonData(diseasePath);
    } catch (error) {
        console.error('获取UL中task数据失败:', error);
        throw error;
    }
}

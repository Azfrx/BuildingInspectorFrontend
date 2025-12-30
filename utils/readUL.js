import {
	trackPath
} from './reviseJson';
import {
	userStore
} from '@/store/index.js';
// 文档基础路径
const DOC_BASE_PATH = '_doc/'
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
          reject(`获取文件对象失败: ${path}, 错误: ${err.message || '未知错误'}`)
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
async function findMatchingDirectoryUL(userName) {
  try {
    // 获取_doc目录下的所有子目录
    const allDirs = await getAllFirstLevelDirs();
    
    // 获取用户信息store
    const userInfo = userStore();
    
    // 优先使用ULPath（用于读取数据）
    if (userInfo.ULPath && allDirs.includes(userInfo.ULPath)) {
      return userInfo.ULPath;
    }
    
    // 查找以UL开头的目录（用于读取数据）
    const ulDirs = allDirs.filter(dir => dir.startsWith('UL'));
    console.log('找到UL开头的目录:', ulDirs);
    
    // 遍历UL目录，查找匹配当前用户名的目录
    for (const dir of ulDirs) {
      // 提取目录名中的用户名部分（最后一个'-'后面的内容）
      const lastDashIndex = dir.lastIndexOf('-');
      if (lastDashIndex !== -1 && lastDashIndex < dir.length - 1) {
        const dirUsername = dir.substring(lastDashIndex + 1);
        console.log(`目录 ${dir} 中的用户名: ${dirUsername}`);
        
        // 检查提取的用户名是否与当前用户名匹配
        if (userName && dirUsername === userName) {
          console.log('找到匹配的UL用户目录:', dir);
          userInfo.setULPath(dir);
          console.log('ULPath:', userInfo.ULPath);
          return dir;
        }
      }
    }
    
    // 如果没有找到匹配的UL目录，返回null
    // 注意：在readUL.js中我们只负责读取，不创建目录
    console.log('未找到匹配的UL目录，返回null');
    return null;
  } catch (error) {
    console.error('查找匹配UL目录时出错:', error);
    return null;
  }
}

export async function getObjectUL(userName, buildingId) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectoryUL(userName);
    
    // 构建对象文件路径
    const objectPath = DOC_BASE_PATH + `${matchedDir}/building/${buildingId}/object.json`;
    
    console.log('object.json路径:', objectPath);
    
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
//     const matchedDir = await findMatchingDirectoryUL(userName);
    
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

export async function readBridgeImage(userName, buildingId, relativePaths) {
  try {
    // 查找匹配的目录
    const matchedDir = await findMatchingDirectoryUL(userName);
    
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


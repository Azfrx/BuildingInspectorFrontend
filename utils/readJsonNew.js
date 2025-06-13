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

// 路径生成规则（基于userName）
const FILE_NAMING = {
    project: userName => `${getUserDir(userName)}/project/projects.json`,
    task: (userName, projectId) => `${getUserDir(userName)}/project/${projectId}/task.json`,
    property: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/property.json`,
    disease: (userName, buildingId, yearId) => `${getUserDir(userName)}/building/${buildingId}/disease/${yearId}.json`,
    Object: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/object.json`,
    // 新增用户信息路径规则
    user: userName => `${getUserDir(userName)}/user.json`,
    historyYear: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/disease`,
    AllUserInfo: userName => `${getUserDir(userName)}/AllUserInfo.json`
};

// 核心文件读取方法
async function getJsonData(path) {
    return new Promise((resolve, reject) => {
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            fs.root.getFile(path, { create: false }, fileEntry => {
                fileEntry.file(file => {
                    const reader = new plus.io.FileReader();
                    reader.onload = () => {
                        try {
                            resolve(JSON.parse(reader.result));
                        } catch (e) {
                            reject(`JSON解析失败: ${path}`);
                        }
                    };
                    reader.onerror = () => reject(`文件读取失败: ${path}`);
                    reader.readAsText(file);
                }, reject);
            }, reject);
        }, reject);
    });
}

// 对外接口（全部基于userName）
export function getProject(userName) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userName);
    trackPath(path);
    return getJsonData(path);
}

export function getTask(userName, projectId) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userName, projectId);
    trackPath(path);
    return getJsonData(path);
}

export function getProperty(userName, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userName, buildingId);
    trackPath(path);
    return getJsonData(path);
}

export function getDisease(userName, buildingId, yearId) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userName, buildingId, yearId);
    trackPath(path);
    return getJsonData(path);
}

export function getObject(userName, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.Object(userName, buildingId);
    trackPath(path);
    return getJsonData(path);
}

export function getAllUserInfo(userName) {
    const path = DOC_BASE_PATH + FILE_NAMING.AllUserInfo(userName);
    trackPath(path);
    return getJsonData(path);
}

// 获取历史年份方法（返回除当前年份外的所有年份字符串倒序数组）
export async function getHistoryYear(userName, buildingId) {
        // 1. 构建目标目录路径
        const dirPath = DOC_BASE_PATH + FILE_NAMING.historyYear(userName, buildingId);
        console.log(`历史病害目标目录: ${dirPath}`)

        // 2. 获取目录下的文件列表
        const files = await listDirectoryFiles(dirPath);

        // 3. 过滤出年份JSON文件 (格式: YYYY.json)
        const yearFiles = files.filter(file =>
            file.name && /^\d{4}\.json$/.test(file.name)
        );

        // 4. 提取年份字符串（保留原始格式）
        const years = yearFiles.map(file =>
            file.name.split('.')[0]  // 直接返回字符串
        );

        // 5. 获取当前年份字符串
        const currentYear = String(new Date().getFullYear());

        // 6. 过滤掉当前年份并倒序排序
        const filteredYears = years
            .filter(year => year !== currentYear)  // 字符串比较
            .sort((a, b) => {
                // 转换为数字进行比较，但保持返回字符串
                return Number(b) - Number(a);  // 从大到小排序
            });

        console.log(`找到历史年份: ${filteredYears.join(',')}`);
        return filteredYears;
}

// 辅助方法：列出目录中的文件
function listDirectoryFiles(path) {
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
export function readDiseaseImages(userName, buildingId, relativePaths) {
    // 处理数组情况
    if (Array.isArray(relativePaths)) {
        return relativePaths.map(path => {
            const fullPath = DOC_BASE_PATH  + getUserDir(userName)+ '/building/' + path;//`${userId}/building/${buildingId}/disease/images`,
            //转为本地绝对路径
            return plus.io.convertLocalFileSystemURL(fullPath);
        });
    } else {
        // 保持原有单个路径的处理逻辑
        const path = DOC_BASE_PATH  + getUserDir(userName)+ '/building/' +relativePaths;
        //转为本地绝对路径
        const imagePath = plus.io.convertLocalFileSystemURL(path);
        return imagePath;
    }
}

export function readBridgeImage(userName, buildingId, relativePaths) {
    // 处理数组情况
    if (Array.isArray(relativePaths)) {
        return relativePaths.map(path => {
            const fullPath = DOC_BASE_PATH  + getUserDir(userName)+ '/building/' + path;//`${buildingId}/images/${fileName}`;
            //转为本地绝对路径
            return plus.io.convertLocalFileSystemURL(fullPath);
        });
    } else {
        // 保持原有单个路径的处理逻辑
        const path = DOC_BASE_PATH  + getUserDir(userName) + '/building/' +relativePaths;
        //转为本地绝对路径
        const imagePath = plus.io.convertLocalFileSystemURL(path);
        return imagePath;
    }
}
//读取所有一级子目录
export function getAllFirstLevelDirs() {
    return new Promise((resolve, reject) => {
        const fullPath = DOC_BASE_PATH;

        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
            fs.root.getDirectory(fullPath, { create: false }, dirEntry => {
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
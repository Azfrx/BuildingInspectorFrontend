// 文档基础路径
const DOC_BASE_PATH = '_doc/';
import { trackPath } from './reviseJson';

// 路径生成规则
const FILE_NAMING = {
    project: userId => `${userId}/project/projects.json`,
    task: (userId, projectId) => `${userId}/project/${projectId}/task.json`,
    property: (userId, buildingId) => `${userId}/building/${buildingId}/property.json`,
    disease: (userId, buildingId, yearId) =>
        `${userId}/building/${buildingId}/disease/${yearId}.json`,
    Object: (userId, buildingId) => `${userId}/building/${buildingId}/object.json`,
    // 新增用户信息路径规则
    user: userId => `${userId}/user.json`,
    historyYear: (userId, buildingId) => `${userId}/building/${buildingId}/disease`,
    AllUserInfo: userId => `${userId}/AllUserInfo.json`
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

// 对外接口
export function getProject(userId) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userId);
    trackPath(path);
    return getJsonData(path);
}

export function getTask(userId, projectId) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userId, projectId);
    trackPath(path);
    return getJsonData(path);
}

export function getProperty(userId, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userId, buildingId);
    trackPath(path);
    return getJsonData(path);
}

export function getDisease(userId, buildingId, yearId) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userId, buildingId, yearId);
    trackPath(path);
    return getJsonData(path);
}

export function getObject(userId, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.Object(userId, buildingId);
    trackPath(path);
    return getJsonData(path);
}

// 新增获取用户信息方法
export function getAllUserInfo(userId) {
    const path = DOC_BASE_PATH + FILE_NAMING.AllUserInfo(userId);
    trackPath(path);
    return getJsonData(path);
}

// 获取历史年份方法（返回除当前年份外的所有年份字符串倒序数组）
export async function getHistoryYear(userId, buildingId) {
        // 1. 构建目标目录路径
        const dirPath = DOC_BASE_PATH + FILE_NAMING.historyYear(userId, buildingId);
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
export function readDiseaseImages(userId, buildingId, relativePaths) {
    // 处理数组情况
    if (Array.isArray(relativePaths)) {
        return relativePaths.map(path => {
            const fullPath = DOC_BASE_PATH  + userId+ '/building/' + path;//`${userId}/building/${buildingId}/disease/images`,
            //转为本地绝对路径
            return plus.io.convertLocalFileSystemURL(fullPath);
        });
    } else {
        // 保持原有单个路径的处理逻辑
        const path = DOC_BASE_PATH  + userId+ '/building/' +relativePaths;
        //转为本地绝对路径
        const imagePath = plus.io.convertLocalFileSystemURL(path);
        return imagePath;
    }
}

export function readBridgeImage(userId, buildingId, relativePaths) {
    // 处理数组情况
    if (Array.isArray(relativePaths)) {
        return relativePaths.map(path => {
            const fullPath = DOC_BASE_PATH  + userId+ '/building/' + path;//`${buildingId}/images/${fileName}`;
            //转为本地绝对路径
            return plus.io.convertLocalFileSystemURL(fullPath);
        });
    } else {
        // 保持原有单个路径的处理逻辑
        const path = DOC_BASE_PATH  + userId+ '/building/' +relativePaths;
        //转为本地绝对路径
        const imagePath = plus.io.convertLocalFileSystemURL(path);
        return imagePath;
    }
}
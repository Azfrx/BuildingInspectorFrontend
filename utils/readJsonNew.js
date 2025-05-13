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
    Object: (userId, buildingId) => `${userId}/building/${buildingId}/object.json`
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

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
    user: userId => `${userId}/user.json`
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

export function setUser(userId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.user(userId);
    trackPath(path);
    return setJsonData(path, data);
}
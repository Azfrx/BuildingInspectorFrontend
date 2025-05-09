// 文档基础路径
const DOC_BASE_PATH = '_doc/';
// 路径生成规则
const FILE_NAMING = {
    project: userId => `${userId}/project/projects.json`,
    task: (userId, projectId) => `${userId}/project/${projectId}/task.json`,
    property: (userId, buildingId) => `${userId}/building/${buildingId}/property.json`,
    disease: (userId, buildingId, yearId) =>
        `${userId}/building/${buildingId}/disease/${yearId}.json`
};

let __currentFilePath = null;

// 获取完整的文件路径
function getFullPath(path) {
    const docPath = plus.io.convertLocalFileSystemURL(path);
    return docPath;
}

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

// 统一保存方法（只需传递数据）
export function saveData(data) {
    return new Promise((resolve, reject) => {
        if (!__currentFilePath) {
            return reject(new Error('请先执行读取操作获取文件路径'));
        }

        const fullPath = getFullPath(__currentFilePath);
        console.log('准备保存文件到路径:', fullPath);

        const wait = plus.nativeUI.showWaiting("正在保存信息");

        setJsonData(fullPath, data)
           .then(() => {
                wait.close();
                console.log('写入成功');
                plus.nativeUI.toast("保存成功");
                resolve(true);
            })
           .catch((error) => {
                wait.close();
                console.error("写入失败:", error);
                plus.nativeUI.toast("保存失败");
                reject(error);
            });
    });
}

// 路径记录器（不修改原读取方法）
export function trackPath(path) {
    console.log('设置文件路径:', path);
    __currentFilePath = path;
}

// 对外接口（set 方法）
export function setProject(userId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userId);
    trackPath(path);
    return saveData(data);
}

export function setTask(userId, projectId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userId, projectId);
    trackPath(path);
    return saveData(data);
}

export function setProperty(userId, buildingId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userId, buildingId);
    trackPath(path);
    return saveData(data);
}

export function setDisease(userId, buildingId, yearId, data) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userId, buildingId, yearId);
    trackPath(path);
    return saveData(data);
}
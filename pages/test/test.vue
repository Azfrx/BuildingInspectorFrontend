<template>
    <view class="container">
        <button @click="fetchProject">获取项目数据</button>
        <button @click="fetchTask">获取任务数据</button>
        <button @click="fetchProperty">获取属性数据</button>
        <button @click="fetchDisease">获取疾病数据</button>
        <view v-if="data">
            <pre>{{ JSON.stringify(data, null, 2) }}</pre>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
// 文档基础路径
const DOC_BASE_PATH = '_doc/';
// 假设这里有 trackPath 函数的实现
function trackPath(path) {
    console.log('Tracked path:', path);
}

// 路径生成规则
const FILE_NAMING = {
    project: userId => `${userId}/project/projects.json`,
    task: (userId, projectId) => `${userId}/project/${projectId}/task.json`,
    property: (userId, buildingId) => `${userId}/building/${buildingId}/property.json`,
    disease: (userId, buildingId, yearId) => 
        `${userId}/building/${buildingId}/disease/${yearId}.json`
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
function getProject(userId) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userId);
    trackPath(path);
    return getJsonData(path);
}

function getTask(userId, projectId) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userId, projectId);
    trackPath(path);
    return getJsonData(path);
}

function getProperty(userId, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userId, buildingId);
    trackPath(path);
    return getJsonData(path);
}

function getDisease(userId, buildingId, yearId) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userId, buildingId, yearId);
    trackPath(path);
    return getJsonData(path);
}

const data = ref(null);
const userId = '1';
const projectId = '3';
const buildingId = '5';
const yearId = '2023';

const fetchProject = async () => {
    try {
        data.value = await getProject(userId);
    } catch (error) {
        console.error(error);
    }
};

const fetchTask = async () => {
    try {
        data.value = await getTask(userId, projectId);
    } catch (error) {
        console.error(error);
    }
};

const fetchProperty = async () => {
    try {
        data.value = await getProperty(userId, buildingId);
    } catch (error) {
        console.error(error);
    }
};

const fetchDisease = async () => {
    try {
        data.value = await getDisease(userId, buildingId, yearId);
    } catch (error) {
        console.error(error);
    }
};
</script>

<style scoped>
.container {
    padding: 20px;
}
button {
    margin: 10px;
}
</style>    
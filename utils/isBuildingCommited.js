// 检查是否有未提交的病害记录
import {getTask, getULTask, isCommit, readDiseaseCommit} from "@/utils/readJsonNew";
import {isPhotoCommmitted} from "@/utils/frontPhoto";
import {setTask} from "@/utils/writeNew";

export async function  checkUncommittedBuilding (username,buildingId) {
    try {
        const currentYear = new Date().getFullYear().toString();
        const hasUncommittedDiseases = await readDiseaseCommit(username, buildingId, currentYear);
        const isPhotoCommited = await isPhotoCommmitted(username, buildingId);
        const hasUncommmittedPhoto = isPhotoCommited ? false : true;
        const isStructureCommited = await isCommit(username, buildingId);
        const hasUnCommitStructure = !isStructureCommited;
        console.log('检查未提交病害结果:', hasUncommittedDiseases);
        console.log('检查未提交图片结果:', hasUncommmittedPhoto);
        console.log('检查未提交结构信息结果:', hasUnCommitStructure)
        return hasUncommittedDiseases || hasUncommmittedPhoto || hasUnCommitStructure ;
    } catch (error) {
        console.error('检查未提交病害出错:', error);
        return false;
    }
}

export async function setBuildingUnCommitted (username,projectId,buildingId) {
    const taskData = await getULTask(username, projectId);
    
    // 找到对应的任务项并设置 commited 字段为 0
    if (taskData && taskData.tasks) {
        const tasks = taskData.tasks;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].buildingId === buildingId) {
                tasks[i] = {
                    updatetime: new Date().toISOString(),
                    id: tasks[i].id,
                    buildingId: tasks[i].buildingId,
                    commited: 0
                };
            }else{
                tasks[i] = {
                    updatetime: tasks[i].updatetime || new Date().toISOString(),
                    id: tasks[i].id,
                    buildingId: tasks[i].buildingId,
                    commited: tasks[i].commited
                };
            }
        }
    }
    uni.$emit('setButtonUnCommited')
    await setTask(username, projectId, taskData);
}

export async function setBuildingCommitted (username,projectId,buildingId) {
    const taskData = await getULTask(username, projectId);

    // 找到对应的任务项并设置 commited 字段为 1
    if (taskData && taskData.tasks) {
        const tasks = taskData.tasks;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].buildingId === buildingId) {
                tasks[i] = {
                    updatetime: new Date().toISOString(),
                    id: tasks[i].id,
                    buildingId: tasks[i].buildingId,
                    commited: 1
                };
            }else{
                tasks[i] = {
                    updatetime: tasks[i].updatetime || new Date().toISOString(),
                    id: tasks[i].id,
                    buildingId: tasks[i].buildingId,
                    commited: tasks[i].commited
                };
            }
        }
    }
    uni.$emit('setButtonCommited')
    await setTask(username, projectId, taskData);
}

export async function isBuildingCommited (username,projectId,buildingId) {
    const taskData = await getULTask(username, projectId);

    // 找到对应的任务项并获取 commited 字段
    if (taskData && taskData && taskData.tasks) {
        const tasks = taskData.tasks;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].buildingId === buildingId) {
                return tasks[i].commited;
                /*if(tasks[i].commited) return tasks[i].commited;
                else return false;*/
            }
        }
    }
}
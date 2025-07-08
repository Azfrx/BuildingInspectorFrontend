// 检查是否有未提交的病害记录
import {isCommit, readDiseaseCommit} from "@/utils/readJsonNew";
import {isPhotoCommmitted} from "@/utils/frontPhoto";

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
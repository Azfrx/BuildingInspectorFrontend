import { getObject } from "./readJsonNew";
import { setObject } from "./writeNew";

export function incrementDiseaseNumber(userId, buildingId,targetId) {
	const data = getObject(userId,buildingId)
    // 遍历第一层 children
    if (data.children && Array.isArray(data.children)) {
        for (let firstLevel of data.children) {
            // 遍历第二层 children
            if (firstLevel.children && Array.isArray(firstLevel.children)) {
                for (let secondLevel of firstLevel.children) {
                    // 遍历第三层 children
                    if (secondLevel.children && Array.isArray(secondLevel.children)) {
                        for (let thirdLevel of secondLevel.children) {
                            // 找到匹配的 ID 并增加 diseaseNumber
                            if (thirdLevel.id === targetId) {
                                // 确保存在 diseaseNumber 属性
                                if (typeof thirdLevel.diseaseNumber !== 'number') {
                                    thirdLevel.diseaseNumber = 0;
                                }
                                thirdLevel.diseaseNumber++;
								setObject(userId,buildingId,data)
                                return true; // 找到并更新成功
                            }
                        }
                    }
                }
            }
        }
    }
    return false; // 未找到匹配的 ID
}
export function decrementDiseaseNumber(userId, buildingId,targetId) {
	const data = getObject(userId,buildingId)
    // 遍历第一层 children
    if (data.children && Array.isArray(data.children)) {
        for (let firstLevel of data.children) {
            // 遍历第二层 children
            if (firstLevel.children && Array.isArray(firstLevel.children)) {
                for (let secondLevel of firstLevel.children) {
                    // 遍历第三层 children
                    if (secondLevel.children && Array.isArray(secondLevel.children)) {
                        for (let thirdLevel of secondLevel.children) {
                            // 找到匹配的 ID
                            if (thirdLevel.id === targetId) {
                                // 确保存在 diseaseNumber 属性
                                if (typeof thirdLevel.diseaseNumber !== 'number') {
                                    thirdLevel.diseaseNumber = 0;
                                }
                                
                                // 减少计数（不低于 0）
                                thirdLevel.diseaseNumber = Math.max(0, thirdLevel.diseaseNumber - 1);
								setObject(userId,buildingId,data)
                                return true; // 找到并更新成功
                            }
                        }
                    }
                }
            }
        }
    }
	
    return false; // 未找到匹配的 ID
}
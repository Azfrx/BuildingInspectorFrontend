import {readDiseaseComponent} from '../utils/readJsonNew.js'
//对数据添加额外字段flag 和 diseaseNumber
export function addFlagsAndDiseaseNumber(data,username,TaskBridgeId) {
    // 处理第一层 children
    if (data.children && Array.isArray(data.children)) {
        data.children.forEach(firstLevel => {
            // 为第一层添加 flag
            firstLevel.flag = false;
            
            // 处理第二层 children
            if (firstLevel.children && Array.isArray(firstLevel.children)) {
                firstLevel.children.forEach(secondLevel => {
                    // 为第二层添加 flag
                    secondLevel.flag = false;
                    
                    // 处理第三层 children
                    if (secondLevel.children && Array.isArray(secondLevel.children)) {
                        secondLevel.children.forEach(thirdLevel => {
                            // 为第三层添加 flag 和 diseaseNumber
                            thirdLevel.flag = false;
                            // thirdLevel.diseaseNumber = readDiseaseComponent(username,TaskBridgeId,thirdLevel.id);
							 thirdLevel.diseaseNumber = 10
                        });
                    }
                });
            }
        });
    }
    return data;
}
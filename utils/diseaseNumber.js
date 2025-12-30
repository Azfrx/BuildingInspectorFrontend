import {setObject} from "./writeNew";
import {useObject} from "../store/object";
import {getULDisease} from "@/utils/readJsonNew";

export async function incrementDiseaseNumber(username, buildingId, targetId) {
	//1. 创建实例对象
	const objectData = useObject()
	const data = objectData.getData()
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
								await setObject(username, buildingId, data)
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
export async function decrementDiseaseNumber(username, buildingId, targetId) {
	const objectData = useObject()
	const data = objectData.getData()
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
								await setObject(username, buildingId, data)
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

export async function refreshDiseaseNumber(username, buildingId, projectYear) {
	const objectData = useObject()
	const currentYear = projectYear;
	const diseaseData = await getULDisease(username, buildingId, currentYear);
	// 创建Map来存储每个构件的病害数量统计
	const diseaseCountMap = new Map();
	// 创建Map来存储每个构件已统计的病害类型
	const diseaseTypeMap = new Map();

	// 遍历所有病害数据
	for (const disease of diseaseData.diseases) {
		// 过滤掉已删除的病害记录（commitType !== 2）
		if (disease.commitType !== 2 && disease.component && disease.component.biObject && disease.component.biObject.id) {
			const biObjectId = disease.component.biObject.id;
			const componentName = disease.component.name;

			// 获取该构件已统计的构件编号Set
			if (!diseaseTypeMap.has(biObjectId)) {
				diseaseTypeMap.set(biObjectId, new Set());
			}
			
			const diseaseTypes = diseaseTypeMap.get(biObjectId);
			
			// 只有当该构件下还没有统计过这个构件编号时，才增加计数
			if (!diseaseTypes.has(componentName)) {
				diseaseTypes.add(componentName);
				
				// 增加该构件的病害数量计数
				if (diseaseCountMap.has(biObjectId)) {
					diseaseCountMap.set(biObjectId, diseaseCountMap.get(biObjectId) + 1);
				} else {
					diseaseCountMap.set(biObjectId, 1);
				}
			}
		}
	}

	// 获取当前对象数据
	const data = objectData.getData();

	// 遍历对象结构，更新每个构件的diseaseNumber
	if (data.children && Array.isArray(data.children)) {
		for (let firstLevel of data.children) {
			if (firstLevel.children && Array.isArray(firstLevel.children)) {
				for (let secondLevel of firstLevel.children) {
					if (secondLevel.children && Array.isArray(secondLevel.children)) {
						for (let thirdLevel of secondLevel.children) {
							const biObjectId = thirdLevel.id;

							// 从Map中获取该构件的病害数量，如果没有则设为0
							// 更新构件的diseaseNumber
							thirdLevel.diseaseNumber = diseaseCountMap.get(biObjectId) || 0;
						}
					}
				}
			}
		}
	}

	// 保存更新后的对象数据
	await setObject(username, buildingId, data);
}
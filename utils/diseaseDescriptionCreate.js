function generateDiseaseDescription(data) {
	const {
		componentName, // 构件名称
		componentCode, // 构件编号
		showColumns, // 是否显示裂缝特征
		diseaseType, // 病害类型
		diseasePosition, // 病害位置
		crackType, // 裂缝特征（可选）
		defects = [], // 缺损数据数组
		counts = 0, // 病害数量（可选）
	} = data;

	const count = defects.length;
	if (count === 0) return '还未填写病害数据';
	let description = `${componentCode}#${componentName}${diseaseType}${count > 0 ? `${count}条缺损`: ''}，${diseasePosition}，`;
	if(showColumns[0] == 1) description += `${crackType}裂缝`;
	let descriptionArr = []
 
	if (counts < 10) {
		const details = defects.map(item => {
			// if(showColumns[0] == 1){ descriptionArr.push(`${item.crackType}裂缝`) }
			descriptionArr.push(`距${item.reference1Location} ${item.reference1LocationStart}m，距${item.reference2Location} ${item.reference2LocationStart}m`)
			if(showColumns[1] == 1){ descriptionArr.push(`长度：${item.length1}m`) }
			// if(showColumns[2] == 1){ descriptionArr.push(`长度2：${item.length1}m`) }
			// if(showColumns[3] == 1){ descriptionArr.push(`长度3：${item.length1}m`) }
			if(showColumns[2] == 1){ descriptionArr.push(`缝宽：${item.crackWidth}mm`) }
			if(showColumns[3] == 1){ descriptionArr.push(`高度/深度：${item.heightDepth}m`) }
			if(showColumns[4] == 1){ descriptionArr.push(`面积：${item.areaLength}×${item.areaWidth}m²`) }
			if(showColumns[5] == 1){ descriptionArr.push(`变形/位移：${item.deformation}m`) }
			if(showColumns[6] == 1){ descriptionArr.push(`角度：${item.angle}度`) }
			if(showColumns[7] == 1){ descriptionArr.push(`比例：${item.numeratorRatio}/${item.denominatorRatio}`) }
			const result = descriptionArr.join('，')
			descriptionArr = []
			return result
		}).join('；');

		return `${description}，${details}`;
	} else {
		const item = defects[0]
		// if(showColumns[0] == 1){ descriptionArr.push(`${item.crackType}裂缝`) }
		descriptionArr.push(`距${item.reference1Location} ${item.reference1LocationStart}m， 距${item.reference2Location} ${item.reference2LocationStart}m`)
		if(showColumns[1] == 1){ descriptionArr.push(`长度：${item.lengthRangeStart}~${item.lengthRangeEnd}m`) }
		// if(showColumns[2] == 1){ descriptionArr.push(`长度：${item.lengthRangeStart}~${item.lengthRangeEnd}m`) }
		// if(showColumns[3] == 1){ descriptionArr.push(`长度：${item.lengthRangeStart}~${item.lengthRangeEnd}m`) }
		if(showColumns[2] == 1){ descriptionArr.push(`缝宽：${item.crackWidthRangeStart}~${item.crackWidthRangeEnd}mm`) }
		if(showColumns[3] == 1){ descriptionArr.push(`高度/深度：${item.heightDepthRangeStart}~${item.heightDepthRangeEnd}m`) }
		if(showColumns[4] == 1){ descriptionArr.push(`面积：${item.areaLength}×${item.areaWidth}m²`) }
		if(showColumns[5] == 1){ descriptionArr.push(`变形/位移：${item.deformationRangeStart}~${item.deformationRangeEnd}m`) }
		if(showColumns[6] == 1){ descriptionArr.push(`角度：${item.angleRangeStart}~${item.angleRangeEnd}度`) }
		if(showColumns[7] == 1){ descriptionArr.push(`比例：${item.numeratorRatio}/${item.denominatorRatio}`) }

		const result = descriptionArr.join('，')
		descriptionArr = []
		return `${description}，${result}`;
	}
}

export {
	generateDiseaseDescription
}
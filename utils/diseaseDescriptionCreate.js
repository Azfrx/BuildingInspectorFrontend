function generateDiseaseDescription(data) {
	const {
		componentName, // 构件名称
		diseaseType, // 病害类型
		diseasePosition, // 病害位置
		crackFeature = [], // 裂缝特征（可选）
		defects = [], // 缺损数据数组
		counts = 0, // 病害数量（可选）
	} = data;

	const count = defects.length;
	if (count === 0) return '还未填写病害数据';

	let description = `${componentName}${diseasePosition}${diseaseType}`;

	if (counts < 10) {
		const details = defects.map(item => {
			const distanceToRef1 = item.reference1LocationStart
			const distanceToRef2 = item.reference2LocationStart
			const length = item.length
			const width = item.width

			const area = (length * width).toFixed(2);
			return `${crackFeature[item.crackTypeIndex].text}裂缝，距${item.reference1Location} ${item.reference1LocationStart}m， 距${item.reference1Location} ${item.reference2LocationStart}m， L=${item.length}m， W=${item.width}m， S=${item.length}×${item.width}m²`;
		}).join('；');

		return `${description}, ${details}`;
	} else {
		const lengths = defects.map(d => d.length);
		const widths = defects.map(d => d.width);
		const lengthMin = Math.min(...lengths);
		const lengthMax = Math.max(...lengths);
		const widthMin = Math.min(...widths);
		const widthMax = Math.max(...widths);

		const reference1Location = defects[0].reference1Location
		const reference2Location = defects[0].reference2Location
		const distanceToRef1 = defects[0].reference1LocationStart
		const distanceToRef2 = defects[0].reference2LocationStart
		const lengthRangeStart = defects[0].lengthRangeStart
		const lengthRangeEnd = defects[0].lengthRangeEnd
		const widthRangeStart = defects[0].widthRangeStart
		const widthRangeEnd = defects[0].widthRangeEnd
		const heightDepthRangeStart = defects[0].heightDepthRangeStart
		const heightDepthRangeEnd = defects[0].heightDepthRangeEnd
		const crackWidthRangeStart = defects[0].crackWidthRangeStart
		const crackWidthRangeEnd = defects[0].crackWidthRangeEnd
		const areaRangeStart = defects[0].areaRangeStart
		const areaRangeEnd = defects[0].areaRangeEnd
		const volumeRangeStart = defects[0].volumeRangeStart
		const volumeRangeEnd = defects[0].volumeRangeEnd

		return `${description}，${crackFeature[defects[0].crackTypeIndex].text}裂缝${counts}条，距${reference1Location} ${distanceToRef1}m，距${reference2Location} ${distanceToRef2}m，` +
			`L=${lengthRangeStart}m~${lengthRangeEnd}m，W=${widthRangeStart}m~${widthRangeEnd}m，` +
			`S=${lengthRangeStart}×${widthRangeStart}m²~${lengthRangeEnd}×${widthRangeEnd}m²`;
	}
}

export {
	generateDiseaseDescription
}
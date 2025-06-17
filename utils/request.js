import {
	saveBridgeImage,
	saveDiseaseImages,
	setDisease,
	setProperty
} from "@/utils/writeNew";

export async function propertyRequest(username, buildingId, token) {

	try {
		const response = await uni.request({
			url: `http://60.205.13.156:8090/api/building/${buildingId}/property`,
			method: 'GET',
			header: {
				'Authorization': `${token}`
			}
		});
		console.log('从后端接口获取到的桥梁卡片数据:', response.data.data);

		if (response.data.code === 0) {
			const bridgedata = response.data.data;
			// bridgedata.images.side = await saveBridgeImages(userInfo.username, buildingId.value, bridgedata.images.side);
			// bridgedata.images.front =  await saveBridgeImages(userInfo.username, buildingId.value, bridgedata.images.front);
			if (bridgedata.property.children[7].children[0].value !== '/') {
				try {
					const savedImageUrl = await saveBridgeImage(username, buildingId, bridgedata
						.property.children[7].children[0].value);
					if (savedImageUrl) {
						bridgedata.property.children[7].children[0].value = savedImageUrl;
					} else {
						console.error('保存图片1失败: 返回的URL为空');
					}
				} catch (error) {
					console.error('保存图片1出错:', error);
					// 保留原始值，避免字段消失
				}
			}
			if (bridgedata.property.children[7].children[1].value !== '/') {
				try {
					const savedImageUrl = await saveBridgeImage(username, buildingId, bridgedata
						.property.children[7].children[1].value);
					if (savedImageUrl) {
						bridgedata.property.children[7].children[1].value = savedImageUrl;
					} else {
						console.error('保存图片2失败: 返回的URL为空');
					}
				} catch (error) {
					console.error('保存图片2出错:', error);
					// 保留原始值，避免字段消失
				}
			}

			console.log('保存后的桥梁卡片数据:', bridgedata);
			//调用接口将数据存在本地(disease)
			await setProperty(username, buildingId, bridgedata);
		} else {
			uni.showToast({
				title: response.data.msg || '获取数据失败',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('获取桥梁卡片数据失败:', error);
		uni.showToast({
			title: '获取数据失败，请稍后重试',
			icon: 'none'
		});
	}
}

export async function diseaseRequest(username, buildingId, token) {
	console.log('开始从后端获取历史病害数据...........');
	try {
		const response = await uni.request({
			//桥梁id改为全局
			url: `http://60.205.13.156:8090/api/building/${buildingId}/disease`,
			method: 'GET',
			header: {
				'Authorization': `${token}`
			}
		});
		console.log('从后端接口获取到的历史病害数据:', response.data.data);
		if (response.data.code === 0) {
			for (const yearDisease of response.data.data) {
				const year = yearDisease.year;

				// 遍历diseases数组
				for (const disease of yearDisease.diseases) {
					// 处理images列表
					if (disease.images && Array.isArray(disease.images)) {
						disease.images = await saveDiseaseImages(username, buildingId, disease
							.images);
					}

					// 处理ADImgs列表
					if (disease.ADImgs && Array.isArray(disease.ADImgs)) {
						disease.ADImgs = await saveDiseaseImages(username, buildingId, disease
							.ADImgs);
					}
				}
				//调用接口将数据存在本地(disease)
				await setDisease(username, buildingId, year, yearDisease)
			}
		} else {
			uni.showToast({
				title: response.data.msg || '获取数据失败',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('获取历史病害数据失败:', error);
	}

}
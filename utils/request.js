import {
	saveBridgeImage,
	saveDiseaseImages,
	setDisease,
	setProperty,
	setTask,
	setObject,
	setProject,
} from "@/utils/writeNew";
import {
	getProject
} from "@/utils/readJsonNew.js";

export async function getAllDataAndSetToLocal(projects, projectResponse, token, username) {
	//获取本地所有project
	try {
		const localProjectsAsync = await getProject(username)
		const localProjects = localProjectsAsync.data.projects

		//根据新projects过滤本地projects，这里只增删project
		filtProjects(localProjects, projects)

		await setProject(username, projectResponse);
		//所有的项目 每一个项目去获取它下面的任务
		for (const project of projects) {
			const projectId = project.id;

			// 查找本地是否已有该项目
			const localProject = localProjects.find(p => p.id === projectId);

			// 如果本地有这个项目，且 updateTime 一致，则跳过更新
			if (localProject && localProject.updateTime === project.updateTime) {
				console.log(`项目 ${project.name} 未更新，跳过数据请求`);
				continue;
			}

			// console.log('开始获取BuildingId:', projectId);
			// buildings也就是tasks 每一个桥梁是一个检测任务
			const buildings = await getBuildingIdByProjectId(projectId, token, username);

			for (const building of buildings) {
				const buildingId = building.buildingId;
				//对比updatetime
				const localBuilding = localBuildings.find(b => b.buildingId === buildingId);
				if (localBuilding && localBuilding.updateTime === building.updateTime) {
					console.log(`Building ${buildingId} 未更新，跳过`);
					continue;
				}
				console.log(`Building ${buildingId} 有更新，开始请求数据`);

				// console.log('开始获取桥梁卡片数据:', buildingId);
				await propertyRequest(buildingId, token, username);
				// console.log('开始获取历史病害数据:', buildingId);
				await diseaseRequest(buildingId, token, username);
				// console.log('开始获取桥梁构件数据:', buildingId);
				await getStructureInfoByBuildingId(buildingId, token, username);
			}
		}
	} catch (error) {
		//本地文件夹为空 全量下载
		await setProject(username, projectResponse);
		//所有的项目 每一个项目去获取它下面的任务
		for (const project of projects) {
			const projectId = project.id;
			const buildings = await getBuildingIdByProjectId(projectId, token, username);
			for (const building of buildings) {
				const buildingId = building.buildingId;
				await propertyRequest(buildingId, token, username);
				await diseaseRequest(buildingId, token, username);
				await getStructureInfoByBuildingId(buildingId, token, username);
			}
		}
	}
}

const filtProjects = (oldProjects, newProjects) => {
	for (let i = oldProjects.length - 1; i >= 0; i--) {
		const oldProject = oldProjects[i];
		const exists = newProjects.some(newProject => newProject.id === oldProject.id);
		if (!exists) {
			console.log("oldProjects[i].id", oldProjects[i].id);
			//删除项目文件夹
			// deleteFolderInApp('_doc/' + FILE_NAMING.projectsFolder(username) +
			// 	'/' + oldProjects[i].id)
			oldProjects.splice(i, 1); // 删除不存在的项目
		}
	}

	for (const newProject of newProjects) {
		const exists = oldProjects.some(oldProject => oldProject.id === newProject.id);
		if (!exists) {
			oldProjects.push(newProject); // 添加新的项目
		}
	}
}

const getBuildingIdByProjectId = async (projectId, token, username) => {
	try {
		const response = await uni.request({
			url: `http://60.205.13.156:8090/api/project/${projectId}/task`,
			method: 'GET',
			header: {
				'Authorization': `${token}`
			}
		});
		if (response.data.code === 0) {
			setTask(username, projectId, response.data)
			return response.data.data.tasks
		} else {
			uni.showToast({
				title: response.data.msg || '获取BuildingId失败',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('获取BuildingId失败:', error);
		uni.showToast({
			title: '获取BuildingId失败，请稍后重试',
			icon: 'none'
		});
	}
}

export async function propertyRequest(buildingId, token, username) {
	try {
		const response = await uni.request({
			url: `http://60.205.13.156:8090/api/building/${buildingId}/property`,
			method: 'GET',
			header: {
				'Authorization': `${token}`
			}
		});

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
			await setProperty(username, buildingId, bridgedata);
		} else {
			uni.showToast({
				title: response.data.msg || `保存桥梁卡片${buildingId}图片失败`,
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('获取桥梁卡片数据失败:', error);
		uni.showToast({
			title: '获取桥梁卡片数据失败，请稍后重试',
			icon: 'none'
		});
	}
}

export async function diseaseRequest(buildingId, token, username) {
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
				const currentYear = new Date().getFullYear();
				if (year !== currentYear) {
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
			}
		} else {
			uni.showToast({
				title: response.data.msg || '获取历史病害数据失败',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('获取历史病害数据失败:', error);
	}
}

const getStructureInfoByBuildingId = async (buildingId, token, username) => {
	try {
		const response = await uni.request({
			//寫死 因爲只有55是最新數據
			url: `http://60.205.13.156:8090/api/building/${buildingId}/object`,
			method: 'GET',
			header: {
				'Authorization': `${token}`
			}
		});
		if (response.data.code === 0) {
			//将数据存在本地 提交前初始化数据
			setObject(username, buildingId, response.data.data);
		} else {
			uni.showToast({
				title: response.data.msg || '获取桥梁构件数据失败',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('获取桥梁构件数据失败:', error);
		uni.showToast({
			title: '获取桥梁构件数据失败，请稍后重试',
			icon: 'none'
		});
	}
}
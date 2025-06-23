// 文档基础路径
const DOC_BASE_PATH = '_doc/';
import {
	trackPath
} from './reviseJson';
import {
	userStore
} from '@/store/index.js'

// 获取当前日期字符串 (格式: YY-MM-DD)
function getCurrentDateStr() {
	const now = new Date();
	const year = now.getFullYear().toString().slice(-2);
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

// 生成用户目录名（格式: UD25-06-11-userName）
function getUserDir(userName) {
	const userInfo = userStore()
	if (userInfo.hadUsername !== '') {
		//即找到了相同用户名但不同日期的文件夹
		//console.log("找到了，返回保存的hadname:", userInfo.hadUsername);
		return userInfo.hadUsername;
	} else {
		//console.log("没找到新拼一个");
		return `UD${getCurrentDateStr()}-${userName}`;
	}
}

// 路径生成规则（基于userName）
export const FILE_NAMING = {
	project: userName => `${getUserDir(userName)}/project/projects.json`,
	projectWithDate: userNameWithDate => `${userNameWithDate}/project/projects.json`,
	projectsFolder: userName => `${getUserDir(userName)}/project`,
	task: (userName, projectId) => `${getUserDir(userName)}/project/${projectId}/task.json`,
	taskWithDate: (userNameWithDate, projectId) => `${userNameWithDate}/project/${projectId}/task.json`,
	property: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/property.json`,
	disease: (userName, buildingId, yearId) =>
		`${getUserDir(userName)}/building/${buildingId}/disease/${yearId}.json`,
	Object: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/object.json`,
	// 新增用户信息路径规则
	user: userName => `${getUserDir(userName)}/user.json`,
	historyYear: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/disease`,
	AllUserInfo: userName => `${getUserDir(userName)}/AllUserInfo.json`,
	frontPhoto: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/frontPhoto.json`,
};

// 核心文件读取方法
async function getJsonData(path) {
	return new Promise((resolve, reject) => {
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
			fs.root.getFile(path, {
				create: false
			}, fileEntry => {
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

// 对外接口（全部基于userName）
export function getProject(userName) {
	const path = DOC_BASE_PATH + FILE_NAMING.project(userName);
	trackPath(path);
	return getJsonData(path);
}

//此username是带日期的
export function getHadProject(userNameWithDate) {
	const path = DOC_BASE_PATH + FILE_NAMING.projectWithDate(userNameWithDate);
	return getJsonData(path);
}

export function getTask(userName, projectId) {
	const path = DOC_BASE_PATH + FILE_NAMING.task(userName, projectId);
	trackPath(path);
	return getJsonData(path);
}

export function getTaskByHadUsername(hadUsername, projectId) {
	const path = DOC_BASE_PATH + FILE_NAMING.taskWithDate(hadUsername, projectId);
	trackPath(path);
	return getJsonData(path);
}

export function getProperty(userName, buildingId) {
	const path = DOC_BASE_PATH + FILE_NAMING.property(userName, buildingId);
	trackPath(path);
	return getJsonData(path);
}

export function getDisease(userName, buildingId, yearId) {
	const path = DOC_BASE_PATH + FILE_NAMING.disease(userName, buildingId, yearId);
	trackPath(path);
	return getJsonData(path);
}

export async function getObject(userName, buildingId) {
	const path = DOC_BASE_PATH + FILE_NAMING.Object(userName, buildingId);
	trackPath(path);
	return await getJsonData(path);
}

export function getAllUserInfo(userName) {
	const path = DOC_BASE_PATH + FILE_NAMING.AllUserInfo(userName);
	trackPath(path);
	return getJsonData(path);
}

// 获取历史年份方法（返回除当前年份外的所有年份字符串倒序数组）
export async function getHistoryYear(userName, buildingId) {
	// 1. 构建目标目录路径
	const dirPath = DOC_BASE_PATH + FILE_NAMING.historyYear(userName, buildingId);
	console.log(`历史病害目标目录: ${dirPath}`)

	// 2. 获取目录下的文件列表
	const files = await listDirectoryFiles(dirPath);

	// 3. 过滤出年份JSON文件 (格式: YYYY.json)
	const yearFiles = files.filter(file =>
		file.name && /^\d{4}\.json$/.test(file.name)
	);

	// 4. 提取年份字符串（保留原始格式）
	const years = yearFiles.map(file =>
		file.name.split('.')[0] // 直接返回字符串
	);

	// 5. 获取当前年份字符串
	const currentYear = String(new Date().getFullYear());

	// 6. 过滤掉当前年份并倒序排序
	const filteredYears = years
		.filter(year => year !== currentYear) // 字符串比较
		.sort((a, b) => {
			// 转换为数字进行比较，但保持返回字符串
			return Number(b) - Number(a); // 从大到小排序
		});

	console.log(`找到历史年份: ${filteredYears.join(',')}`);
	return filteredYears;
}

// 辅助方法：列出目录中的文件
export function listDirectoryFiles(path) {
	return new Promise((resolve, reject) => {
		// 1. 获取完整的沙盒目录路径
		const fullPath = plus.io.convertLocalFileSystemURL(path);
		plus.io.resolveLocalFileSystemURL(fullPath, entry => {
			if (entry.isDirectory) {
				const directoryReader = entry.createReader();
				directoryReader.readEntries(
					entries => resolve(Array.from(entries)),
					reject
				);
			} else {
				reject(new Error('路径不是目录'));
			}
		}, reject);
	});
}

// 将图片相对路径转为绝对路径进行读取
export function readDiseaseImages(userName, buildingId, relativePaths) {
	// 处理数组情况
	if (Array.isArray(relativePaths)) {
		return relativePaths.map(path => {
			const fullPath = DOC_BASE_PATH + getUserDir(userName) + '/building/' +
				path; //`${userId}/building/${buildingId}/disease/images`,
			//转为本地绝对路径
			return plus.io.convertLocalFileSystemURL(fullPath);
		});
	} else {
		// 保持原有单个路径的处理逻辑
		const path = DOC_BASE_PATH + getUserDir(userName) + '/building/' + relativePaths;
		//转为本地绝对路径
		const imagePath = plus.io.convertLocalFileSystemURL(path);
		return imagePath;
	}
}

export function readBridgeImage(userName, buildingId, relativePaths) {
	// 处理数组情况
	if (Array.isArray(relativePaths)) {
		return relativePaths.map(path => {
			const fullPath = DOC_BASE_PATH + getUserDir(userName) + '/building/' +
				path; //`${buildingId}/images/${fileName}`;
			//转为本地绝对路径
			return plus.io.convertLocalFileSystemURL(fullPath);
		});
	} else {
		// 保持原有单个路径的处理逻辑
		const path = DOC_BASE_PATH + getUserDir(userName) + '/building/' + relativePaths;
		//转为本地绝对路径
		const imagePath = plus.io.convertLocalFileSystemURL(path);
		return imagePath;
	}
}
//读取所有一级子目录
export function getAllFirstLevelDirs() {
	return new Promise((resolve, reject) => {
		const fullPath = DOC_BASE_PATH;

		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
			fs.root.getDirectory(fullPath, {
				create: false
			}, dirEntry => {
				const directoryReader = dirEntry.createReader();
				directoryReader.readEntries(entries => {
					const dirNames = entries
						.filter(entry => entry.isDirectory)
						.map(entry => entry.name);
					resolve(dirNames);
				}, reject);
			}, err => {
				// 如果目录不存在，返回空数组而不是reject
				if (err.code === err.NOT_FOUND_ERR) {
					resolve([]);
				} else {
					reject(`无法访问目录: ${fullPath}`);
				}
			});
		}, reject);
	});
}

export function getFrontPhoto(userName, buildingId) {
	const path = DOC_BASE_PATH + FILE_NAMING.frontPhoto(userName, buildingId);
	trackPath(path);
	return getJsonData(path);
}

export function removeDiseaseImage(paths) {
	return new Promise((resolve, reject) => {
		try {
			// 如果是数组，处理多个文件
			if (Array.isArray(paths)) {
				const results = [];
				const errors = [];

				// 处理每个文件
				paths.forEach((absolutePath, index) => {
					plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
						entry.remove(
							() => {
								console.log(`成功删除图片: ${absolutePath}`);
								results.push({
									path: absolutePath,
									success: true
								});

								// 当所有文件处理完成后，返回结果
								if (results.length + errors.length === paths.length) {
									resolve({
										success: errors.length === 0,
										results: results,
										errors: errors
									});
								}
							},
							(err) => {
								console.error(`删除图片失败: ${absolutePath}`, err);
								errors.push({
									path: absolutePath,
									error: err.message || '删除失败'
								});

								// 当所有文件处理完成后，返回结果
								if (results.length + errors.length === paths.length) {
									resolve({
										success: errors.length === 0,
										results: results,
										errors: errors
									});
								}
							}
						);
					}, (err) => {
						console.error(`无法解析文件路径: ${absolutePath}`, err);
						errors.push({
							path: absolutePath,
							error: '无法解析文件路径'
						});

						// 当所有文件处理完成后，返回结果
						if (results.length + errors.length === paths.length) {
							resolve({
								success: errors.length === 0,
								results: results,
								errors: errors
							});
						}
					});
				});
			} else {
				// 处理单个文件
				const absolutePath = paths;

				plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
					entry.remove(
						() => {
							console.log(`成功删除图片: ${absolutePath}`);
							resolve({
								success: true,
								path: absolutePath
							});
						},
						(err) => {
							console.error(`删除图片失败: ${absolutePath}`, err);
							reject({
								success: false,
								path: absolutePath,
								error: err.message || '删除失败'
							});
						}
					);
				}, (err) => {
					console.error(`无法解析文件路径: ${absolutePath}`, err);
					reject({
						success: false,
						path: absolutePath,
						error: '无法解析文件路径'
					});
				});
			}
		} catch (error) {
			console.error('删除图片时发生错误:', error);
			reject({
				success: false,
				error: error.message || '删除过程中发生错误'
			});
		}
	});
}

export async function readDiseaseCommit(userName, buildingId, yearId) {
	try {
		// 获取病害数据并等待Promise解析
		const diseaseData = await getDisease(userName, buildingId, yearId);

		// 检查diseases数组是否存在
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return false;
		}

		// 使用some方法检查是否有任何病害的commit_type为1（未提交）
		const hasUncommittedDiseases = diseaseData.diseases.some(disease => disease.commitType === 1);

		console.log(`检查未提交病害: ${hasUncommittedDiseases ? '有未提交病害' : '全部已提交'}`);
		return hasUncommittedDiseases;
	} catch (error) {
		console.error('检查病害提交状态时出错:', error);
		return false; // 出错时返回false
	}
}

// 统计某个构件中病害构件数量
export async function readDiseaseComponent(userName, buildingId, biObjectId) {
	const currentYear = new Date().getFullYear().toString();

	try {
		// 获取当前年份的病害数据
		const diseaseData = await getDisease(userName, buildingId, currentYear);

		// 检查数据是否有效
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return 0; // 如果没有数据或格式不正确，返回0
		}

		// 用于存储已经统计过的code，避免重复计数
		const countedCodes = new Set();

		// 统计符合条件的病害数量
		let count = 0;

		// 遍历所有病害
		diseaseData.diseases.forEach(disease => {
			// 排除已删除的病害记录(commit_type为2)
			if (disease.commitType === 2) {}

			// 检查component字段是否存在且biObjectId匹配
			else if (disease.component &&
				disease.component.biObjectId === biObjectId &&
				disease.component.code) {

				const code = disease.component.code;

				// 检查这个code是否已经被统计过
				if (!countedCodes.has(code)) {
					// 如果没有被统计过，计数加1并将code添加到Set中
					count++;
					countedCodes.add(code);
				}
			}
		});

		console.log(`biObjectId ${biObjectId} 下不重复的code数量: ${count}`);
		return count;

	} catch (error) {
		console.error('统计病害组件出错:', error);
		return 0; // 出错时返回0
	}
}

// 新增病害时判断某一构建下面是否有病害
export async function isExistDisease(userName, buildingId, componentName) {
	try {
		// 获取当前年份
		const currentYear = new Date().getFullYear().toString();

		// 获取当前年份的病害数据
		const diseaseData = await getDisease(userName, buildingId, currentYear);

		// 检查数据是否有效
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return false; // 如果没有数据或格式不正确，返回false
		}

		// 过滤掉已删除的病害记录，然后检查剩余记录中是否存在匹配的componentName
		const exists = diseaseData.diseases.filter(disease => disease.commitType !== 2)
			.some(disease => disease.component && disease.component.name === componentName);

		console.log(`检查componentName为 ${componentName} 的病害${exists ? '存在' : '不存在'}`);
		return exists;

	} catch (error) {
		console.error('检查病害是否存在与某个构件上时出错:', error);
		return false; // 出错时返回false
	}
}

// 删除病害时判断某一构建下面是否只有一个病害
export async function isOnlyDisease(userName, buildingId, componentName) {
	try {
		// 获取当前年份
		const currentYear = new Date().getFullYear().toString();

		// 获取当前年份的病害数据
		const diseaseData = await getDisease(userName, buildingId, currentYear);

		// 检查数据是否有效
		if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
			console.log('没有找到病害数据或数据格式不正确');
			return false; // 如果没有数据或格式不正确，返回false
		}

		// 过滤出与指定componentName匹配且未删除的病害记录
		const matchingDiseases = diseaseData.diseases.filter(disease =>
			disease.component &&
			disease.component.name === componentName &&
			disease.commitType !== 2 // 排除已删除的病害记录
		);

		// 检查是否只有一个匹配的记录
		const isOnly = matchingDiseases.length === 1;

		console.log(`componentName为 ${componentName} 的病害${isOnly ? '只有一个' : '有多个或没有'}`);
		return isOnly;

	} catch (error) {
		console.error('检查病害是否唯一时出错:', error);
		return false; // 出错时返回false
	}
}
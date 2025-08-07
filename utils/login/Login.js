/**
 * 手动获取本地时间
 */
function getLocalDateTimeString() {
    const d = new Date();
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
        String(d.getHours()).padStart(2, '0'),
        String(d.getMinutes()).padStart(2, '0'),
        String(d.getSeconds()).padStart(2, '0')
    ].join('');
}


/**
 * 在用户目录下创建子目录
 * @param {string} baseDirPath - 父目录
 * @param {string} subDirName - 子目录名称（如 "Documents"）
 * @returns {Promise<{success: boolean, subDirPath?: string, error?: any}>}
 */
export async function createSubDirectory(baseDirPath, subDirName) {
    try {
        // 拼接完整路径
        const subDirPath = `${baseDirPath}/${subDirName}`;
        
        // 创建子目录
        const dirEntry = await new Promise((resolve, reject) => {
            plus.io.resolveLocalFileSystemURL(baseDirPath, (parentEntry) => {
                parentEntry.getDirectory(subDirName, { create: true }, resolve, reject);
            }, reject);
        });
        
        console.log('子目录创建成功:', subDirPath);
        return { success: true, subDirPath };
    } catch (error) {
        console.error('创建子目录失败:', error);
        return { success: false, error };
    }
}


/**
 * 为用户创建UL目录
 * @param {string} username - 用户名
 * @returns {Promise<{success: boolean, dirPath?: string, error?: any}>}
 */
export async function createUserDirectory(username) {
    try {
        
        // 定义目录名称格式（UL_用户名_时间戳）
        const dirName = `UL-${getLocalDateTimeString()}-${username}`;
        const dirPath = `_doc/${dirName}`;
        
        // 创建目录
        const dirEntry = await new Promise((resolve, reject) => {
            plus.io.resolveLocalFileSystemURL('_doc/', (rootEntry) => {
                rootEntry.getDirectory(dirName, { create: true }, resolve, reject);
            }, reject);
        });
        
        return { success: true, dirPath };
    } catch (error) {
        console.error('创建用户目录失败:', error);
        return { success: false, error };
    }
}

/**
 * 获取 _doc 目录下的所有子目录名称
 * @returns {Promise<{success: boolean, dirNames?: string[], error?: any}>}
 */
export async function getAllDocSubdirectories() {
    try {
        // 1. 解析 _doc 目录
        const rootEntry = await new Promise((resolve, reject) => {
            plus.io.resolveLocalFileSystemURL('_doc/', resolve, reject);
        });

        // 2. 读取目录内容
        const entries = await new Promise((resolve, reject) => {
            rootEntry.createReader().readEntries(resolve, reject);
        });

        // 3. 过滤出目录类型的条目
        const dirNames = entries
            .filter(entry => entry.isDirectory)
            .map(entry => entry.name);

        console.log('获取到的目录列表:', dirNames);
        return { success: true, dirNames };
    } catch (error) {
        console.error('获取目录列表失败:', error);
        return { success: false, error };
    }
}


/**
 * 对目录进行过滤 提取是UL还是UD 以及对应的username
 * const { prefix, username, isValid } = parseDirectoryName(dirName);
 * @param {string} dirName 目录名（格式：prefix-timestamp-username）
 * @returns {{
 *   prefix: string,
 *   username: string,
 *   isValid: boolean
 * }}
 */
export function parseDirectoryName(dirName) {
    if (typeof dirName !== 'string') {
        return { prefix: '', username: '', isValid: false };
    }

    const firstDashIndex = dirName.indexOf('-');
    const lastDashIndex = dirName.lastIndexOf('-');

    // 验证格式有效性
    const isValid = (
        firstDashIndex > 0 && 
        lastDashIndex > firstDashIndex && 
        lastDashIndex < dirName.length - 1
    );

    return {
        prefix: isValid ? dirName.slice(0, firstDashIndex) : '',
        username: isValid ? dirName.slice(lastDashIndex + 1) : '',
        isValid
    };
}

//将登录成功的用户保存到storage中
export function rememberUser(username,password) {
	//1.定义storage中存储账号密码的数组
	let userAccount = uni.getStorageSync('userAccount') || null
	
	//2.如果它是一个数组说明它被初始化过 已经存在数据 追加新账号
	if(Array.isArray(userAccount)){
		 userAccount.push({
		    username: username,
		    password: password,
		});
	}else{
		// 首次登录，初始化数组
		userAccount = [{
		    username: username,
		    password: password,
		    }];
	}
	
	//3.去重 只保留最新的账号
	const uniqueAccounts = Array.from(
	    new Map(userAccount.map(item => [item.username, item])).values()
	);
	//4.存储新的数据
	uni.removeStorageSync('userAccount');          // 删除旧的账号列表
	uni.setStorageSync('userAccount', uniqueAccounts); // 存储去重后的新列表
}

/**
 * 判断storage中是否存在用户
 * @param {string} username 要检查的用户名
 * @param {string} password 要检查的密码
 * @returns {boolean} 是否匹配
 */
export function findUser(username, password) {
    if (!username || !password) return false;
    
    const userAccounts = uni.getStorageSync('userAccount') || [];
    return userAccounts.some(
        user => user.username === username && user.password === password
    );
}
/**离线登录
 * @param {Object} username
 * @param {Object} password
 */
export function offLineLogin(username,password){
	//1.账号验证
	if(findUser(username,password)){  //如果用户存在
		//跳转页面
		uni.navigateTo({
			url: '/pages/home/home'
		});
	}else{
		uni.showToast({
		  title: '本地无数据包，请先在线登录', 
		  icon: 'none', 
		  duration: 2000, 
		  mask: true // 
		});
	}
}
/**
 * 判断文件夹是否存在
 */
export async function hasUserDir(Username){
	//1.根据用户名判断是否存在UL目录
	const result = await getAllDocSubdirectories();
	for(let dirname of result.dirNames){
	const { prefix, username, isValid } = parseDirectoryName(dirname);
	if(prefix ==='UL' && username === Username){
		return true;
	}
	}
	return false;
}

/**
 * 创建文件夹
 */
export async function setRootDir(username){
	//如果目录不存在
	if(! await hasUserDir(username)){
		//生成UL目录
		const { success, dirPath } = await createUserDirectory(username);
		//生成子目录
		const subDirs = ['building', 'project'];
		for (const dir of subDirs) {
		    await createSubDirectory(dirPath, dir);
		}
	}else{
		return
	}
}

/**
 * 记住密码功能
 */
export function saveCredentials(username, password, remember) {
	uni.setStorageSync('rememberStatus',remember) || null
  if (remember) {
    uni.setStorageSync('lastUsername', username)
    uni.setStorageSync('lastPassword', password)
  } else {
    uni.removeStorageSync('lastUsername')
    uni.removeStorageSync('lastPassword')
  }
}
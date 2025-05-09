<template>
	<button @click="write">写文件</button>
	<button @click="read">读文件</button>
	<button @click="revise">修改文件</button>
	<button @click="saveFileToNewLocation">保存文件</button>
	<button @click="copyFile">复制文件</button>
	
	 <!-- 渲染数据 -->
	    <view v-if="fileData" class="data-container">
	      <!-- 循环遍历数组 -->
	      <view v-for="(item, index) in fileData" :key="index" class="data-item">
	        <text class="label">姓名：</text>
	        <text class="value">{{ item.name }}</text>
	        
	        <text class="label">性别：</text>
	        <text class="value">{{ item.gender }}</text>
	        
	        <text class="label">生日：</text>
	        <text class="value">{{ item.birthday }}</text>
		  </view>
		</view>
	
</template>

<script setup>
import { ref } from 'vue'
import { changeData,getJsonData,CreateNewDir,saveFile,copyFileTo} from '@/utils/file.js'

const fileData = ref(null)
const fileName = ref('bridgeinfo')  // 将文件名声明为响应式变量

const write = () => {
	const pathUrl = plus.io.convertLocalFileSystemURL("_doc/") +"/3"+ fileName.value + '.json'//设置文件格式
	// const parentDir = '_downloads';
	// const newDirName = 'newDir';
	// CreateNewDir(parentDir, newDirName)
	// "_downloads/"只有4种写法
	// 1.downloads和documents都会在根目录下单独创一个目录允许读写
	// 2.doc会在app目录下创建一个子目录存文件 仅应用自身可读写
	// 3.www也在app目录下 仅应用自身可读

	const data = {
    "msg": "查询成功",
    "code": 0,
    "data": {
        "projectId": 1,
        "tasks": [
            {
                "createBy": "admin",
                "createTime": "2025-04-09 09:09:16",
                "updateBy": "admin",
                "updateTime": "2025-05-02 10:01:47",
                "remark": "测试一下",
                "id": 4,
                "building": {
                    "id": 5,
                    "name": "宜都长江大桥-主桥",
                    "rootObjectId": 160,
                    "rootPropertyId": 2108,
                    "buildingCode": "G0421421088L4750",
                    "routeCode": "G0421",
                    "routeName": "许广高速",
                    "bridgePileNumber": "K532+699",
                    "bridgeLength": "4515.5"
                },
                "buildingId": 5,
                "project": {
                    "id": 1,
                    "name": "宜都长江大桥桥梁检测",
                    "year": 2025,
                    "code": "YDCJDQ01",
                    "startDate": "2025-04-01",
                    "endDate": "2025-05-01"
                },
                "projectId": 1,
                "status": "0"
            },
            {
                "createBy": "admin",
                "createTime": "2025-04-09 09:09:17",
                "updateTime": "2025-04-09 09:09:16",
                "id": 5,
                "building": {
                    "id": 6,
                    "name": "宜都长江大桥-左幅引桥",
                    "rootObjectId": 143,
                    "rootPropertyId": 2108,
                    "buildingCode": "G0421421088L4750",
                    "routeCode": "G0421",
                    "routeName": "许广高速",
                    "bridgePileNumber": "K532+699",
                    "bridgeLength": "4515.5"
                },
                "buildingId": 6,
                "project": {
                    "id": 1,
                    "name": "宜都长江大桥桥梁检测",
                    "year": 2025,
                    "code": "YDCJDQ01",
                    "startDate": "2025-04-01",
                    "endDate": "2025-05-01"
                },
                "projectId": 1,
                "status": "0"
            },
            {
                "createBy": "admin",
                "createTime": "2025-04-16 16:52:59",
                "updateTime": "2025-04-16 16:52:59",
                "id": 6,
                "building": {
                    "id": 3,
                    "name": "荆岳长江大桥",
                    "rootObjectId": 1,
                    "rootPropertyId": 2108,
                    "buildingCode": "G0421421088L4750",
                    "routeCode": "G0421",
                    "routeName": "许广高速",
                    "bridgePileNumber": "K532+699",
                    "bridgeLength": "4515.5"
                },
                "buildingId": 3,
                "project": {
                    "id": 1,
                    "name": "宜都长江大桥桥梁检测",
                    "year": 2025,
                    "code": "YDCJDQ01",
                    "startDate": "2025-04-01",
                    "endDate": "2025-05-01"
                },
                "projectId": 1,
                "status": "0"
            },
            {
                "createBy": "admin",
                "createTime": "2025-04-20 20:50:01",
                "updateTime": "2025-04-20 20:50:01",
                "id": 7,
                "building": {
                    "id": 35,
                    "name": "引桥右幅（新数据测试评分，老的没有权重）",
                    "rootObjectId": 684
                },
                "buildingId": 35,
                "project": {
                    "id": 1,
                    "name": "宜都长江大桥桥梁检测",
                    "year": 2025,
                    "code": "YDCJDQ01",
                    "startDate": "2025-04-01",
                    "endDate": "2025-05-01"
                },
                "projectId": 1,
                "status": "0"
            },
            {
                "createBy": "admin",
                "createTime": "2025-04-21 15:55:30",
                "updateTime": "2025-04-21 15:55:30",
                "id": 8,
                "building": {
                    "id": 32,
                    "name": "宜都长江大桥-右幅引桥",
                    "rootObjectId": 615
                },
                "buildingId": 32,
                "project": {
                    "id": 1,
                    "name": "宜都长江大桥桥梁检测",
                    "year": 2025,
                    "code": "YDCJDQ01",
                    "startDate": "2025-04-01",
                    "endDate": "2025-05-01"
                },
                "projectId": 1,
                "status": "0"
            },
            {
                "createBy": "admin",
                "createTime": "2025-04-21 15:55:30",
                "updateTime": "2025-04-21 15:55:30",
                "id": 9,
                "building": {
                    "id": 34,
                    "name": "引桥左幅",
                    "rootObjectId": 636,
                    "rootPropertyId": 411,
                    "buildingCode": "G70420302R1020",
                    "routeCode": "G70",
                    "routeName": "福州至银川高速公路",
                    "bridgePileNumber": "1373.765",
                    "bridgeLength": "155.6"
                },
                "buildingId": 34,
                "project": {
                    "id": 1,
                    "name": "宜都长江大桥桥梁检测",
                    "year": 2025,
                    "code": "YDCJDQ01",
                    "startDate": "2025-04-01",
                    "endDate": "2025-05-01"
                },
                "projectId": 1,
                "status": "0"
            }
        ]
    }
}
  changeData(pathUrl, 0, data);
}
const read = async()=>{
	const path = plus.io.convertLocalFileSystemURL("_doc/") + fileName.value + '.json'//设置文件格式
	const rawData = await getJsonData(path)
	// 解析JSON数据
	    fileData.value = JSON.parse(rawData)
		uni.showToast({
		      title: '文件读取成功',
		      icon: 'none'
		    })
}
const revise = async()=>{
	//1.准备文件路径
	const path = plus.io.convertLocalFileSystemURL("_downloads/") + fileName.value + '.json'//设置文件格式
	const rawData = await getJsonData(path)
	fileData.value = JSON.parse(rawData)
	//2.准备修改后的数据
	const item_1 = fileData.value[0];
	 item_1.name ="ykx"
	const item_2 = fileData.value[1];
	 item_2.gender = "女性" 
	 //3. 将修改后的数据写回文件
     const updatedData = JSON.stringify(fileData.value);
     await changeData(path, 0, JSON.parse(updatedData));
}

const saveFileToNewLocation = async () => {
    //1.准备新地址
    const newFileName = 'ykxtest'  // 直接使用字符串，因为这是新文件名
    const newPath = "_doc/" + newFileName + '.json'  // 修改为相对路径格式
    //2.准备原文件地址
    const originalPath = plus.io.convertLocalFileSystemURL("_downloads/") + fileName.value + '.json'//设置文件格式
    //3.保存文件
    try {
        await saveFile(newPath, originalPath, newFileName)
        uni.showToast({
            title: '文件保存成功',
            icon: 'success'
        })
    } catch (error) {
        uni.showToast({
            title: '保存失败：' + error,
            icon: 'none'
        })
    }
}

const copyFile = async () => {
    try {
        // 源文件路径
        const sourcePath = plus.io.convertLocalFileSystemURL("_downloads/") + fileName.value + '.json'
        // 目标目录
        const targetDir = "_doc"
        // 目标目录名
        const dirName = "copied_files"
        // 新文件名
        const newFileName = "copied_" + fileName.value + '.json'
        
        const result = await copyFileTo(sourcePath, targetDir, dirName, newFileName)
        if (result) {
            uni.showToast({
                title: '文件复制成功',
                icon: 'success'
            })
            console.log('复制后的文件路径：', result)
        }
    } catch (error) {
        console.error('复制文件失败：', error)
    }
}

//todo 添加内容
//通过调用数组的push方法即可
//   		// 准备要添加的数据
//         		const newItem = {
//             		name: "Tom",
//             		gender: "male",
//            		birthday: "1998-05-20"
//         		};

//         // 将新数据添加到现有数据中
//        		fileData.value.push(newItem);
</script>

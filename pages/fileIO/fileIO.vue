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
    "msg": "ObjectTree success",
    "code": 0,
    "data": {
        "orderNum": 0,
        "delFlag": "0",
        "children": [
            {
                "orderNum": 1,
                "delFlag": "0",
                "children": [
                    {
                        "orderNum": 1,
                        "delFlag": "0",
                        "id": 709,
                        "ancestors": "0,704,705,706",
                        "templateObjectId": 2011,
                        "comments": [
                            {
                                "code": "R-1-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:38",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）1",
                                "id": 244,
                                "status": "0"
                            },
                            {
                                "code": "R-1-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:38",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）2",
                                "id": 245,
                                "status": "0"
                            },
                            {
                                "code": "R-2-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:38",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）3",
                                "id": 246,
                                "status": "0"
                            },
                            {
                                "code": "R-2-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）4",
                                "id": 247,
                                "status": "0"
                            },
                            {
                                "code": "R-3-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）5",
                                "id": 248,
                                "status": "0"
                            },
                            {
                                "code": "R-3-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）6",
                                "id": 249,
                                "status": "0"
                            },
                            {
                                "code": "R-4-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）7",
                                "id": 250,
                                "status": "0"
                            },
                            {
                                "code": "R-4-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）8",
                                "id": 251,
                                "status": "0"
                            },
                            {
                                "code": "R-5-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）9",
                                "id": 252,
                                "status": "0"
                            },
                            {
                                "code": "R-5-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）10",
                                "id": 253,
                                "status": "0"
                            },
                            {
                                "code": "R-6-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）11",
                                "id": 254,
                                "status": "0"
                            },
                            {
                                "code": "R-6-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:39",
                                "name": "上部承重构件（主梁、挂梁）12",
                                "id": 255,
                                "status": "0"
                            },
                            {
                                "code": "R-7-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）13",
                                "id": 256,
                                "status": "0"
                            },
                            {
                                "code": "R-7-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）14",
                                "id": 257,
                                "status": "0"
                            },
                            {
                                "code": "R-8-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）15",
                                "id": 258,
                                "status": "0"
                            },
                            {
                                "code": "R-8-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）16",
                                "id": 259,
                                "status": "0"
                            },
                            {
                                "code": "R-9-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）17",
                                "id": 260,
                                "status": "0"
                            },
                            {
                                "code": "R-9-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）18",
                                "id": 261,
                                "status": "0"
                            },
                            {
                                "code": "R-10-1#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:39",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）19",
                                "id": 262,
                                "status": "0"
                            },
                            {
                                "code": "R-10-2#上部承重构件（主梁、挂梁）",
                                "updateTime": "2025-04-21 16:53:40",
                                "delFlag": "0",
                                "biObjectId": 709,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:53:40",
                                "name": "上部承重构件（主梁、挂梁）20",
                                "id": 263,
                                "status": "0"
                            }
                        ],
                        "count": 20,
                        "weight": 0.7,
                        "updateTime": "2025-04-21 16:50:36",
                        "parentId": 706,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "上部承重构件（主梁、挂梁）",
                        "diseaseTypes": [
                            {
                                "createBy": "admin",
                                "code": "5.2.1-1",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "涂层劣化",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 15,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-2",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "锈蚀",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 16,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-3",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "焊缝开裂",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 17,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-4",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "铆钉（螺栓）损失",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 18,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-5",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "构件裂缝",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 19,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-6",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "跨中挠度",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 20,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-7",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "构件变形",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 21,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-8",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "结构变位",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 22,
                                "minScale": 1,
                                "status": "0"
                            }
                        ],
                        "status": "0"
                    },
                    {
                        "orderNum": 2,
                        "delFlag": "0",
                        "id": 710,
                        "ancestors": "0,704,705,706",
                        "templateObjectId": 2012,
                        "count": 0,
                        "weight": 0.18,
                        "updateTime": "2025-04-21 16:50:36",
                        "parentId": 706,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "上部一般构件（湿接缝、横隔板等）",
                        "diseaseTypes": [
                            {
                                "createBy": "admin",
                                "code": "5.2.1-1",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "涂层劣化",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 15,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-2",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "锈蚀",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 16,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-3",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "焊缝开裂",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 17,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-4",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "铆钉（螺栓）损失",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 18,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-5",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "构件裂缝",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 19,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-6",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "跨中挠度",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 20,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-7",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "构件变形",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 21,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.2.1-8",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "结构变位",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 22,
                                "minScale": 1,
                                "status": "0"
                            }
                        ],
                        "status": "0"
                    },
                    {
                        "orderNum": 3,
                        "delFlag": "0",
                        "id": 711,
                        "ancestors": "0,704,705,706",
                        "templateObjectId": 2013,
                        "comments": [
                            {
                                "code": "R-1#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:19",
                                "name": "支座1",
                                "id": 264,
                                "status": "0"
                            },
                            {
                                "code": "R-2#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座2",
                                "id": 265,
                                "status": "0"
                            },
                            {
                                "code": "R-3#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座3",
                                "id": 266,
                                "status": "0"
                            },
                            {
                                "code": "R-4#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座4",
                                "id": 267,
                                "status": "0"
                            },
                            {
                                "code": "R-5#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座5",
                                "id": 268,
                                "status": "0"
                            },
                            {
                                "code": "R-6#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座6",
                                "id": 269,
                                "status": "0"
                            },
                            {
                                "code": "R-7#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座7",
                                "id": 270,
                                "status": "0"
                            },
                            {
                                "code": "R-8#支座",
                                "updateTime": "2025-04-21 16:57:19",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座8",
                                "id": 271,
                                "status": "0"
                            },
                            {
                                "code": "R-9#支座",
                                "updateTime": "2025-04-21 16:57:20",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座9",
                                "id": 272,
                                "status": "0"
                            },
                            {
                                "code": "R-10#支座",
                                "updateTime": "2025-04-21 16:57:20",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座10",
                                "id": 273,
                                "status": "0"
                            },
                            {
                                "code": "R-11#支座",
                                "updateTime": "2025-04-21 16:57:20",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座11",
                                "id": 274,
                                "status": "0"
                            },
                            {
                                "code": "R-12#支座",
                                "updateTime": "2025-04-21 16:57:20",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座12",
                                "id": 275,
                                "status": "0"
                            },
                            {
                                "code": "R-13#支座",
                                "updateTime": "2025-04-21 16:57:20",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座13",
                                "id": 276,
                                "status": "0"
                            },
                            {
                                "code": "R-14#支座",
                                "updateTime": "2025-04-21 16:57:20",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座14",
                                "id": 277,
                                "status": "0"
                            },
                            {
                                "code": "R-15#支座",
                                "updateTime": "2025-04-21 16:57:20",
                                "delFlag": "0",
                                "biObjectId": 711,
                                "createBy": "admin",
                                "createTime": "2025-04-21 16:57:20",
                                "name": "支座15",
                                "id": 278,
                                "status": "0"
                            }
                        ],
                        "count": 15,
                        "weight": 0.12,
                        "updateTime": "2025-04-21 16:50:36",
                        "parentId": 706,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "支座",
                        "diseaseTypes": [
                            {
                                "createBy": "admin",
                                "code": "5.3.1-1",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "橡胶支座老化变质、开裂",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 23,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.1-2",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "板式支座缺陷",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 24,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.1-3",
                                "maxScale": 5,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "板式支座位置串动、脱空或剪切超限",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 25,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.1-4",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "盆式支座组件损坏",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 26,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.1-5",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "聚四氟乙烯滑板磨损",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 27,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.1-6",
                                "maxScale": 3,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "盆式支座位移、转角超限",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 28,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.2-1",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "钢支座组件或功能缺陷",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 29,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.2-2",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "钢支座位移、转角超限",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 30,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.2-3",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "钢支座部件磨损、裂缝",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 31,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.3-1",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "混凝土缺损",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 32,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.3-2",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "活动支座滑动面不平整、生锈咬死",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 33,
                                "minScale": 1,
                                "status": "0"
                            },
                            {
                                "createBy": "admin",
                                "code": "5.3.3-3",
                                "maxScale": 4,
                                "createTime": "2025-04-14 17:14:06",
                                "name": "承有裂纹、切口或偏移",
                                "updateTime": "2025-04-14 17:14:06",
                                "id": 34,
                                "minScale": 1,
                                "status": "0"
                            }
                        ],
                        "status": "0"
                    }
                ],
                "id": 706,
                "ancestors": "0,704,705",
                "templateObjectId": 201,
                "count": 0,
                "weight": 0.4,
                "updateTime": "2025-04-21 16:50:36",
                "parentId": 705,
                "createBy": "admin",
                "createTime": "2025-04-21 16:50:36",
                "name": "上部结构",
                "status": "0"
            },
            {
                "orderNum": 2,
                "delFlag": "0",
                "children": [
                    {
                        "orderNum": 1,
                        "delFlag": "0",
                        "id": 712,
                        "ancestors": "0,704,705,707",
                        "templateObjectId": 2021,
                        "count": 0,
                        "weight": 0.02,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 707,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "翼墙、耳墙",
                        "status": "0"
                    },
                    {
                        "orderNum": 2,
                        "delFlag": "0",
                        "id": 713,
                        "ancestors": "0,704,705,707",
                        "templateObjectId": 2022,
                        "count": 0,
                        "weight": 0.01,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 707,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "锥坡、护坡",
                        "status": "0"
                    },
                    {
                        "orderNum": 3,
                        "delFlag": "0",
                        "id": 714,
                        "ancestors": "0,704,705,707",
                        "templateObjectId": 2023,
                        "count": 0,
                        "weight": 0.3,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 707,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "桥墩",
                        "status": "0"
                    },
                    {
                        "orderNum": 4,
                        "delFlag": "0",
                        "id": 715,
                        "ancestors": "0,704,705,707",
                        "templateObjectId": 2024,
                        "count": 0,
                        "weight": 0.3,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 707,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "桥台",
                        "status": "0"
                    },
                    {
                        "orderNum": 5,
                        "delFlag": "0",
                        "id": 716,
                        "ancestors": "0,704,705,707",
                        "templateObjectId": 2025,
                        "count": 0,
                        "weight": 0.28,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 707,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "墩台基础",
                        "status": "0"
                    },
                    {
                        "orderNum": 6,
                        "delFlag": "0",
                        "id": 717,
                        "ancestors": "0,704,705,707",
                        "templateObjectId": 2026,
                        "count": 0,
                        "weight": 0.07,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 707,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:37",
                        "name": "河床",
                        "status": "0"
                    },
                    {
                        "orderNum": 7,
                        "delFlag": "0",
                        "id": 718,
                        "ancestors": "0,704,705,707",
                        "templateObjectId": 2027,
                        "count": 0,
                        "weight": 0.02,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 707,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:38",
                        "name": "调治构造物",
                        "status": "0"
                    }
                ],
                "id": 707,
                "ancestors": "0,704,705",
                "templateObjectId": 202,
                "count": 0,
                "weight": 0.4,
                "updateTime": "2025-04-21 16:50:36",
                "parentId": 705,
                "createBy": "admin",
                "createTime": "2025-04-21 16:50:37",
                "name": "下部结构",
                "status": "0"
            },
            {
                "orderNum": 3,
                "delFlag": "0",
                "children": [
                    {
                        "orderNum": 1,
                        "delFlag": "0",
                        "id": 719,
                        "ancestors": "0,704,705,708",
                        "templateObjectId": 2031,
                        "count": 0,
                        "weight": 0.4,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 708,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:38",
                        "name": "桥面铺装",
                        "status": "0"
                    },
                    {
                        "orderNum": 2,
                        "delFlag": "0",
                        "id": 720,
                        "ancestors": "0,704,705,708",
                        "templateObjectId": 2032,
                        "count": 0,
                        "weight": 0.25,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 708,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:38",
                        "name": "伸缩缝装置",
                        "status": "0"
                    },
                    {
                        "orderNum": 3,
                        "delFlag": "0",
                        "id": 721,
                        "ancestors": "0,704,705,708",
                        "templateObjectId": 2033,
                        "count": 0,
                        "weight": 0.1,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 708,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:38",
                        "name": "人行道",
                        "status": "0"
                    },
                    {
                        "orderNum": 4,
                        "delFlag": "0",
                        "id": 722,
                        "ancestors": "0,704,705,708",
                        "templateObjectId": 2034,
                        "count": 0,
                        "weight": 0.1,
                        "updateTime": "2025-04-21 16:50:37",
                        "parentId": 708,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:38",
                        "name": "栏杆、护栏",
                        "status": "0"
                    },
                    {
                        "orderNum": 5,
                        "delFlag": "0",
                        "id": 723,
                        "ancestors": "0,704,705,708",
                        "templateObjectId": 2035,
                        "count": 0,
                        "weight": 0.1,
                        "updateTime": "2025-04-21 16:50:38",
                        "parentId": 708,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:38",
                        "name": "排水系统",
                        "status": "0"
                    },
                    {
                        "orderNum": 6,
                        "delFlag": "0",
                        "id": 724,
                        "ancestors": "0,704,705,708",
                        "templateObjectId": 2036,
                        "count": 0,
                        "weight": 0.05,
                        "updateTime": "2025-04-21 16:50:38",
                        "parentId": 708,
                        "createBy": "admin",
                        "createTime": "2025-04-21 16:50:38",
                        "name": "照明、标志",
                        "status": "0"
                    }
                ],
                "id": 708,
                "ancestors": "0,704,705",
                "templateObjectId": 203,
                "count": 0,
                "weight": 0.2,
                "updateTime": "2025-04-21 16:50:36",
                "parentId": 705,
                "createBy": "admin",
                "createTime": "2025-04-21 16:50:37",
                "name": "桥面系",
                "status": "0"
            }
        ],
        "id": 705,
        "ancestors": "0,704",
        "templateObjectId": 2,
        "count": 0,
        "updateTime": "2025-04-21 16:50:36",
        "parentId": 704,
        "createBy": "admin",
        "parentName": "K38+837白洋互通主线桥",
        "createTime": "2025-04-21 16:50:36",
        "name": "K38+837白洋互通主线桥(K1474+780)-右线(钢梁桥)",
        "status": "0"
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

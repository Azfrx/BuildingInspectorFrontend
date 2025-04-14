<template>
	<!-- 导航栏 -->
    <view class="container">
        <uni-nav-bar 
            class="uni-nav-bar__content-title" 
            dark 
            :fixed="true" 
            shadow 
            background-color="#3b405f" 
            status-bar 
            left-icon="left" 
            title="桥梁定期检查项目" 
            @clickLeft="back" 
        />
    </view>
	
	<!-- 中间 -->
	<view class="mid_container">
		<view class="mid1">
			<text class="row11">承担单位</text>
			<text class="row12">{{inspectionData.unit}}</text>
		</view>
		
		<view class="mid2">
			<text class="row21">承担人员</text>
			<text class="row22">{{inspectionData.person}}</text>
		</view>
		
		<view class="mid3">
			<text class="row31">检测年份</text>
			<picker class="picker" mode="selector" :range="years" :value="currentIndex" @change="yearsChange">
				<view class="picker-content">
					<text>{{currentYear}}</text>
					<view class="arrows">
						<text class="arrow down">▼</text>
					</view>
				</view>
			</picker>
		</view>
	</view>
	
	<!-- 任务列表 -->
	<view class="lists-container">
		<view class="list" v-for="(item,index) in inspectionData.bridgeInspectionList" :key="item.projectCode" @click="goToDetail(item)">
			<text class="text1">{{item.company}}</text>
			<text class="text2">{{item.projectName}}</text>
			<view class="list_bottom">
				<text class="text3">{{item.projectCode}}</text>
				<text class="text4">{{item.progress}}</text>
				<text class="text5">{{item.status}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const years = ['全部','2025年度', '2024年度', '2023年度', '2022年度','2021年度','2020年度','2019年度','2018年度']
const currentIndex = ref(1)
const currentYear = ref(years[1])
const inspectionData = ref({
    unit: '',
    person: '',
    detectionYear: '',
    bridgeInspectionList: []
})

// 获取数据
const getData = () => {
    uni.request({
        url: '/static/data/1.json',
        method: 'GET',
        success: (res) => {
            console.log('获取数据成功:', res.data)
            inspectionData.value = res.data
        },
        fail: (err) => {
            console.error('获取数据失败:', err)
        }
    })
}

// 页面加载时获取数据
onMounted(() => {
    getData()
})

const back = () => {
    uni.showToast({
        title: '点击成功'
    });
}

const yearsChange = (e) => {
    currentIndex.value = e.detail.value
    currentYear.value = years[currentIndex.value]
}

// 跳转到详情页
const goToDetail = (item) => {
    console.log('准备跳转，数据：', item)
    uni.navigateTo({
        url: `/pages/List/List?id=${item.projectCode}`,
        success: () => {
            console.log('跳转成功')
            uni.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 1000
            })
        },
        fail: (err) => {
            console.error('跳转失败：', err)
            uni.showToast({
                title: '跳转失败',
                icon: 'error'
            })
        }
    })
}
</script>

<style lang="scss">
.container {
    min-height: 100vh;
	position: relative;
	font-size: 44px;
	letter-spacing: 5px;
	height: 44px;
	line-height: 44px;
}
.mid_container{
	position: absolute;
	top: 50px;
	width: 100%;
	padding: 0 15px;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: 2fr 1fr 1fr;
	gap: 12px;
	background-color: #f1f0ff;
	padding-bottom: 0;

	.mid1, .mid2, .mid3 {
		padding: 15px;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		border: 1px solid #333;
		box-shadow: 0 2px 0.2px rgba(0,0,0,0.05);
		flex: 1;
	}

	.row11, .row21, .row31 {
		font-size: 16px;
		letter-spacing: 2px;
		color: #666;
	}

	.row12, .row22 {
		font-size: 25px;
		color: #333;
		font-weight: bolder;
		letter-spacing: 2px;
		word-break: break-all;
	}

	.picker {
		.picker-content {
			font-size: 25px;
			color: #333;
			font-weight: bolder;
			letter-spacing: 2px;
			display: flex;
			align-items: center;
			gap: 4px;

			.arrows {
				display: flex;
				flex-direction: column;
				margin-left: 4px;
				
				.arrow {
					font-size: 25px;
					color: #666;
					line-height: 1;
					font-weight: bolder;
					&.down {
						margin-top: 1px;
					}
				}
			}
		}
	}
}

.list {
    position: relative;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin: 0;
    border-bottom: 1px solid #333;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:active {
        background-color: #f5f5f5;
        transform: scale(0.98);
    }
    
    .text1 {
        font-size: 17px;
        color: #666;
        margin-bottom: 8px;
        display: block;
        letter-spacing: 2px;
    }
    
    .text2 {
        font-size: 26px;
        color: #333;
        font-weight: bold;
        margin-bottom: 12px;
        display: block;
        letter-spacing: 2px;
    }
    
    .list_bottom {
        display: flex;
        align-items: center;
        border-top: 1px solid #eee;
        padding-top: 12px;
        
        .text3 {
            font-size: 16px;
            color: #666;
            flex: 1;
        }
        
        .text4 {
            font-size: 16px;
            color: #3b405f;
            flex: 1;
            text-align: center;
        }
        
        .text5 {
            font-size: 16px;
            color: #ff6b6b;
            padding: 4px 8px;
            flex: 1;
            text-align: right;
            padding-right: 15px;
        }
    }
}

.list:last-child {
    border-bottom: none;
}

.lists-container {
    position: absolute;
    top: 170px;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>

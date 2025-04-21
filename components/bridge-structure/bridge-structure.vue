<template>
	<view>

		<view class="part-area">
			<view class="part-area-title">桥梁分孔（m）</view>
			<view class="part-area-content" >{{data.bridgeSpanDivision}}</view>
		</view>

		<view class="part-area">
			<view class="part-area-title">结构体系</view>
			<view class="part-area-content">{{ data.structuralSystem }}</view>
		</view>

    <view v-for="type in types" :key="type" class="type-group">
      <view class="type-header" @click="toggleTypeExpand(type)">
        <text >{{type}}</text>
        <text class="expand-icon">{{ expandedTypes[type] ? '▼' : '▶' }}</text>
      </view>

      <view v-show="expandedTypes[type]" v-if="type === '上部结构形式与材料'">
        <view class="expand-area">
          <view class="expand-area-title">主梁</view>
          <view class="expand-area-content">{{data.superstructureMaterial.mainGirder || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">主拱圈</view>
          <view class="expand-area-content">{{data.superstructureMaterial.mainArch || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">桥（索）塔</view>
          <view class="expand-area-content">{{data.superstructureMaterial.bridgeTower || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">拱上建筑</view>
          <view class="expand-area-content">{{data.superstructureMaterial.spandrelStructure || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">主缆</view>
          <view class="expand-area-content">{{data.superstructureMaterial.mainCable || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">斜拉索（含索力）</view>
          <view class="expand-area-content">{{data.superstructureMaterial.stayCable || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">吊杆（含索力）</view>
          <view class="expand-area-content">{{data.superstructureMaterial.hanger || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">系杆（含索力）</view>
          <view class="expand-area-content">{{data.superstructureMaterial.tieRod || '/'}}</view>
        </view>

      </view>

      <view v-show="expandedTypes[type]" v-if="type === '桥面系形式与材料'">
        <view class="expand-area">
          <view class="expand-area-title">桥面铺装</view>
          <view class="expand-area-content">{{data.deckSystemMaterial.deckPavement || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">伸缩缝</view>
          <view class="expand-area-content">{{data.deckSystemMaterial.expansionJoint || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">人行道、路缘</view>
          <view class="expand-area-content">{{data.deckSystemMaterial.sidewalkCurb || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">栏杆、护栏</view>
          <view class="expand-area-content">{{data.deckSystemMaterial.railing || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">照明、标志</view>
          <view class="expand-area-content">{{data.deckSystemMaterial.lightingSignage || '/'}}</view>
        </view>


      </view>

      <view v-show="expandedTypes[type]" v-if="type === '下部结构形式与材料'">
        <view class="expand-area">
          <view class="expand-area-title">桥台</view>
          <view class="expand-area-content">{{data.substructureMaterial.abutment || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">桥墩</view>
          <view class="expand-area-content">{{data.substructureMaterial.pier || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">锥坡、护坡</view>
          <view class="expand-area-content">{{data.substructureMaterial.slopeProtection || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">翼墙、耳墙</view>
          <view class="expand-area-content">{{data.substructureMaterial.wingWall || '/'}}</view>
        </view>

      </view>

      <view v-show="expandedTypes[type]" v-if="type === '基础形式与材料'">
        <view class="expand-area">
          <view class="expand-area-title">基础</view>
          <view class="expand-area-content">{{data.foundationMaterial.foundation || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">锚碇</view>
          <view class="expand-area-content">{{data.foundationMaterial.anchorBlock || '/'}}</view>
        </view>

      </view>

      <view v-show="expandedTypes[type]" v-if="type === '支座形式、材料与附属设施'">
        <view class="expand-area">
          <view class="expand-area-title">支座</view>
          <view class="expand-area-content">{{data.bearingAncillaryFacilities.bearing || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">防碰撞设施</view>
          <view class="expand-area-content">{{data.bearingAncillaryFacilities.collisionProtection || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">航标及排水系统</view>
          <view class="expand-area-content">{{data.bearingAncillaryFacilities.navigationMarkDrainage || '/'}}</view>
        </view>

        <view class="expand-area">
          <view class="expand-area-title">调治构造物</view>
          <view class="expand-area-content">{{data.bearingAncillaryFacilities.regulatingStructure || '/'}}</view>
        </view>

      </view>

    </view>

	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue'

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    }
  })


  // 初始化默认展开所有类型
  const types = [
    '上部结构形式与材料',
    '桥面系形式与材料',
    '下部结构形式与材料',
    '基础形式与材料',
    '支座形式、材料与附属设施'
  ];
/*
const data = ref({
		splitting: 'L：（3×30+4×30）+（16×30）+(3×67.5)+(100+5×154+100)+（（100＋298）＋816＋（80＋2×75））+(4×67.5)+（7×（4×30）＋（3×30））<br/>' +
			'R：（3×30+4×30）+(16×30)+(3×67.5)+(100+5×154+100)+（（100＋298）＋816＋（80＋2×75））斜拉桥+(4×67.5)+（7×（4×30）＋（3×30）））',
		structure: '1～23#（L）连续小箱梁；24～26#（L/R）等截面连续箱梁；27～33#（L/R）变截面连续箱梁；34～39#（L/R）斜拉桥；40～43#（L/R）等截面连续箱梁；44～74#（L/R）连续小箱梁' +
			'1～7#（R）等截面连续箱梁；8～23#（R）连续小箱梁'
	})

  const superStructure = ref({
    title: '上部结构形式与材料',
    mainBeam: '',//主梁
    mainArchRing:'',//主拱圈
    bridgePylons: '',//桥塔
    archBuilding: '',//拱上建筑
    mainCable: '',//主缆
    cableStayed: '',//斜拉索
    boom: '',// 吊杆
    tieRods: '',// 系杆
  })
  const bridgeDeck = ref({
    title: '桥面系形式与材料',
    paving: '沥青混凝土',//桥面铺装
    expansionJoint: 'D80、D160、D240型',//伸缩缝
    sidewalk: '',// 人行道、路缘
    railings: '',// 栏杆、护栏
    lighting: '',// 照明、标志
  })
  const subStructure = ref({
    title: '下部结构形式与材料',
    Abutment: '重力式桥台',//桥台
    pier: '桩柱式桥台、桩柱式、薄壁、主塔',//桥墩
    conicalSlope: '',// 锥坡、护坡
    wall: '',// 翼墙、耳墙
  })
  const basic = ref({
    title: '基础形式与材料',
    basic: '',//基础
    anchor: ''//锚碇
  })
  const support = ref({
    title: '支座形式、材料与附属设施',
    support: '盆式橡胶支座',//支座
    antiCollisionFacilities: '',//防碰撞设施
    navigationAndDrainage: '',// 航标及排水系统
    regulateStructure: '',//调治构造物
  })*/


	// 展开状态
	const expandedTypes = reactive({});

  // 初始化默认展开
  types.forEach(type => {
    expandedTypes[type] = true; // 设置默认展开
  });

	// 切换类型展开
	const toggleTypeExpand = (type) => {
		expandedTypes[type] = !expandedTypes[type];
	};
</script>

<style scoped>
	/* 变成高度区域 */
	.part-area {
		display: flex;
		flex-direction: column;
		padding: 14rpx 10rpx;
		border-bottom: 1rpx solid #eee;
	}

	.part-area-title {
		font-size: 16rpx;
		color: #666666;
	}

	.part-area-content {
		margin-top: 4rpx;
		font-size: 20rpx;
		color: #666666;
	}

	/* 下拉收缩 */
	.type-header {
		height: 30rpx;
		font-size: 15rpx;
		font-weight: bold;
		background-color: #BDCBE0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5rpx 10rpx;
		border-radius: 2rpx;
		color: #0F4687;
		border-bottom: 1rpx solid #0F4687;
		border-top: 1rpx solid #0F4687;
	}

	.expand-icon {
		margin-left: 5rpx;
		font-size: 12rpx;
		color: #666;
	}

  .expand-area {
    padding: 10rpx;
    border-bottom: 1rpx solid #eee;
  }
  .expand-area-title {
    font-size: 16rpx;
    color: #666666;
  }
  .expand-area-content {
    margin-top: 4rpx;
    font-size: 20rpx;
    color: #333333;
  }
</style>
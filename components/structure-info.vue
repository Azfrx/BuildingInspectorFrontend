<template>
	<view class="container">
		<view class="content-layout">
			<!--左侧边栏-->
			<view class="sidebar">
				<view v-for="(item, index) in tabItems" :key="index"
					:class="['sidebar-item', activeTab === index ? 'active' : '']" @click="changeTab(index)">
					<view class="sidebar-item-content">
						{{item}}
					</view>
				</view>
			</view>

			<!-- 右侧内容区 -->
			<view class="content">
				<view v-for="(item, index) in activeStructures" class="structure-item" 
					  @click="selectStructure(item, index)" 
					  :class="{'selected': selectedStructure === item}">
					<view :key="index" class="structure-name">
						{{item.name}}
					</view>
					<view :class="['structure-state-button', item.state === 'on' ? 'button-on': 'button-off', selectedStructure !== item ? 'disabled' : '']"
						@click.stop="selectedStructure === item && changeStructureState(item)">
						{{item.state === 'on' ? '启用部件' : '停用部件'}}
					</view>
					<view :class="['structure-number-button', selectedStructure !== item ? 'disabled' : '']"
						@click.stop="selectedStructure === item && showPopup(item)">
						{{item.structureNumber.length === 0 ? '创建编号' : '查看编号'}}
					</view>
				</view>
			</view>
		</view>

		<!-- 底部弹出层 -->
		<uni-popup ref="popup" type="bottom">
			<!-- read 模式 -->
			<view v-if="popupContent === 'read'" class="popup-content">
				<view class="popup-header">
					构建编号 - {{currentStructure.name}}
				</view>
				<!-- 表头 -->
				<view class="read-table-header">
					<view class="read-cell name">
						<checkbox :checked="isAllSelected" @click="toggleSelectAll" shape="circle" />
						<text>名称</text>
					</view>
					<text class="read-cell code">编号</text>
					<view class="read-batchDelete">
						<button class="btn delete" :disabled="!hasSelection" :class="{ 'disabled-btn': !hasSelection }"
							@click="batchDelete">批量删除</button>
					</view>
				</view>

				<!-- 列表 -->
				<scroll-view scroll-y class="read-table-body">
					<view v-for="(item, index) in currentStructure.structureNumber" :key="index" class="read-table-row">
						<view class="read-cell name">
							<checkbox :checked="item.selected" @click="selectItem(index)" shape="circle" />
							<text class="text-hide">{{ item.number + item.suffix }}</text>
						</view>
						<text class="read-cell code text-hide">{{ item.number }}</text>
						<view class="read-cell actions">
							<button class="btn delete" @click="singleDelete(item.number)">删除</button>
							<button class="btn edit" @click="edit(item)">编辑</button>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- create 模式 -->
			<view v-else-if="popupContent === 'create'" class="popup-box">
				<view class="popup-header">
					创建编号 - {{currentStructure.name}}
				</view>
				<!-- 名称后缀 -->
				<view class="create-suffix">
					<text class="create-suffix-text">名称后缀</text>
					<input v-model="suffix" class="create-suffix-input" placeholder="如 #锚具" />
				</view>

				<!-- 编号片段表格 -->
				<view class="create-table-header">
					<text class="numberFragment">编号片段</text>
					<template class="create-table-cols">
						<text class="col">序号</text>
						<text class="col">类型</text>
						<text class="col">值</text>
						<text class="col">操作</text>
					</template>
				</view>

				<view class="create-table-body">
					<view class="create-row" v-for="(item, index) in segments" :key="index">
						<view class="create-placeholder"></view>
						<template class="create-row-right">
							<text class="create-number">{{ index + 1 }}</text>
							<picker mode="selector" :range="['固定值', '序号']" :value="item.typeIndex"
								@change="(e) => typeChange({ id: item.id, event: e })" class="create-class">
								<view class="create-class-value">
									{{ ['固定值', '序号'][item.typeIndex] }}
									<text class="arrow-down">▼</text>
								</view>
							</picker>
							<view class="create-value">
								<input v-if="item.typeIndex === 0" v-model="item.value" class="create-value-input" />
								<view v-else class="range-input">
									<input v-model="item.start" class="create-value-input" /> <text
										class="create-value-text">至</text> <input v-model="item.end"
										class="create-value-input" />
								</view>
							</view>
							<view class="create-delete">
								<button class="btn-delete" @click="removeSegment(index)">删除</button>
							</view>
						</template>
					</view>

					<!-- 操作按钮 -->
					<view class="btn-row">
						<button @click="addSegment" class="btn-add">添加片段</button>
						<view class="right-btns">
							<button @click="cancel" class="btn-cancel">取消</button>
							<button @click="confirm" class="btn-confirm">确定</button>
						</view>
					</view>
				</view>

			</view>

			<!-- edit 模式 -->
			<view v-else-if="popupContent === 'edit'" class="popup-content">
				<view class="popup-header">
					编辑编号 - {{currentStructure.name}}
				</view>
				<!-- 名称后缀 -->
				<view class="create-suffix bottomBorder">
					<text class="create-suffix-text">名称后缀</text>
					<input v-model="currentEdit.suffix" class="create-suffix-input" placeholder="如 #锚具" />
				</view>

				<!-- 编号 -->
				<view class="create-suffix">
					<text class="create-suffix-text">编号</text>
					<input v-model="currentEdit.number" class="create-suffix-input" placeholder="如 1-01-1" />
				</view>

				<!-- 操作按钮 -->
				<view class="edit-btn-row">
					<button @click="editCancel" class="btn-cancel">取消</button>
					<button @click="editConfirm" class="btn-confirm">确定</button>
				</view>
			</view>

		</uni-popup>
	</view>
</template>


<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue';
  import {getObject} from '../utils/readJsonNew';
	// 数据
	const tabItems = ref([]);  // 初始化为空数组
	const activeTab = ref(0);
	const popupContent = ref('');
	const currentStructure = ref();
	const currentEdit = ref();
	const selectedStructure = ref(null);
	const structures = ref([{
		name: '钢拱圈',
		from: '上部结构',
		state: 'on',
		structureNumber: [{
			number: '1-01-1',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-2',
			selected: true,
			suffix: '#斜拉索'
		}, {
			number: '1-01-3',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-4',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-5',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-6',
			selected: false,
			suffix: '#斜拉索'
		}, ]
	}, {
		name: '混凝土拱圈',
		from: '上部结构',
		state: 'off',
		structureNumber: []
	}, {
		name: '拱上结构',
		from: '下部结构',
		state: 'on',
		structureNumber: [{
			number: '1-01-1',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-2',
			selected: true,
			suffix: '#斜拉索'
		}, {
			number: '1-01-3',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-4',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-5',
			selected: false,
			suffix: '#斜拉索'
		}, {
			number: '1-01-6',
			selected: false,
			suffix: '#斜拉索'
		}, ]
	}, {
		name: '桥面板',
		from: '桥面系',
		state: 'off',
		structureNumber: []
	}, {
		name: '连接件',
		from: '附属设施',
		state: 'off',
		structureNumber: []
	}, ])
	const activeStructures = ref(structures.value.filter(item => item.from === tabItems.value[0]))
	const changeTab = (index) => {
		const selected = tabItems.value[index]
		activeTab.value = index
		activeStructures.value = structures.value.filter(item => item.from === selected)
	};
	const suffix = ref('');
	const segments = ref([{
		id: generateId(),
		typeIndex: 0,
		value: '',
		start: '',
		end: ''
	}]);

	function generateId() {
		return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
	}

	const popup = ref(null);
	const isAllSelected = computed(() => currentStructure.value.structureNumber.every(item => item.selected));
	const hasSelection = computed(() => currentStructure.value.structureNumber.some(item => item.selected));

	const showPopup = (item) => {
		currentStructure.value = item;
		if (item.structureNumber.length === 0) {
			popupContent.value = 'create'
		} else {
			popupContent.value = 'read'
		}
		popup.value.open();
	};

	const changeStructureState = (structure) => {
		structure.state = structure.state === 'on' ? 'off' : 'on';
	}

	const toggleSelectAll = () => {
		const all = isAllSelected.value;
		currentStructure.value.structureNumber.forEach(item => (item.selected = !all));
	};

	const selectItem = (index) => {
		currentStructure.value.structureNumber[index].selected = !currentStructure.value.structureNumber[index]
			.selected;
	};

	const singleDelete = (number) => {
		if (!number) return;
		currentStructure.value.structureNumber = currentStructure.value.structureNumber.filter(item => item.number !==
			number);
		uni.showToast({
			title: '删除成功',
			icon: 'none'
		});
	};
	const batchDelete = () => {
		if (!hasSelection.value) return;
		currentStructure.value.structureNumber = currentStructure.value.structureNumber.filter(item => !item.selected);
		uni.showToast({
			title: '批量删除成功',
			icon: 'none'
		});
	};

	const edit = (structure) => {
		currentEdit.value = structure;
		popupContent.value = 'edit';
	}

	const addSegment = () => {
		segments.value.push({
			id: generateId(),
			typeIndex: 0,
			value: '',
			start: '',
			end: ''
		});
	};

	const typeChange = (e) => {
		const id = e.id;
		const newValue = e.event.detail.value;
		// 找到 id 对应的索引
		const index = segments.value.findIndex(segment => segment.id === id);
		if (index !== -1) {
			// 找到对应项并更新其 type 值
			segments.value[index].typeIndex = newValue;
		}
	}

	const removeSegment = (index) => {
		segments.value.splice(index, 1);
	};

	// 递归生成组合（深度优先）
	const generateCombinations = (segs, index = 0, path = [], result = []) => {
		if (index === segs.length) {
			const combined = path.join('-')
			result.push({
				// name: `${combined}${suffix.value}`,
				number: combined,
				selected: false,
				suffix: suffix.value
			})
			return
		}

		const seg = segs[index]
		if (seg.typeIndex === 0) {
			// 固定值，直接添加
			generateCombinations(segs, index + 1, [...path, seg.value], result)
		} else if (seg.typeIndex === 1) {
			// 序号段，遍历范围
			const start = Number(seg.start)
			const end = Number(seg.end)
			for (let i = start; i <= end; i++) {
				generateCombinations(segs, index + 1, [...path, i], result)
			}
		}
		return result
	}

	const generateNameObjects = () => {
		return generateCombinations(segments.value)
	}

	const cancel = () => {
		popup.value.close();
	};

	const confirm = () => {
		currentStructure.value.structureNumber = generateNameObjects()
		popup.value.close();
	};

	const editCancel = () => {
		popupContent.value = 'read';
	};

	const editConfirm = () => {
		// currentEdit.value.suffix
		popupContent.value = 'read';
	};

	const selectStructure = (item, index) => {
		selectedStructure.value = item;
	};

	onMounted(async () => {
		const data = await getObject(3, 39);
		console.log('获取到的数据:', data);
		
		// 从数据中提取第一个 children 数组的 name 值
		if (data && data.children && data.children.length > 0) {
			tabItems.value = data.children.map(item => item.name);
			// 更新 activeStructures
			activeStructures.value = structures.value.filter(item => item.from === tabItems.value[0]);
		}
	})
</script>

<style scoped>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	/* 内容布局 */
	.content-layout {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	/* 侧边栏样式 */

	.sidebar {
		width: 16.67%;
		background-color: #f5f5f5;
		border-right: 1rpx solid #eeeeee;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.sidebar-item {
		padding: 24rpx 0;
		text-align: left;
		color: #666;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 40rpx;
		/* 设置固定高度 */
		justify-content: center;
		/* 垂直居中内容 */
	}

	.sidebar-item-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-left: 12rpx;
		width: 60%;
		/* 占满整个宽度 */
		font-size: 18rpx;
		/* 统一字体大小 */
	}

	.sidebar-item.active {
		background-color: #ffffff;
	}

	.sidebar-item.active .sidebar-item-content {
		background-color: #ffffff;
		color: #0F4687;
		font-weight: bold;
		border-left: 4rpx solid #0F4687;
	}



	/* 内容区样式 */
	.content {
		flex: 1;
		overflow-y: auto;
		height: 100%;
		background-color: #ffffff;
	}

	.structure-item {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		padding: 14rpx 12rpx;
		border-bottom: 1rpx solid #eee;
		cursor: pointer;
	}

	.structure-item.selected {
		background-color: #f0f5ff;
	}

	.structure-name {
		color: #666666;
		font-size: 20rpx;
		margin-right: auto;
	}

	.structure-state-button,
	.structure-number-button {
		color: #ffffff;
		font-size: 20rpx;
		padding: 10rpx 20rpx;
		border-radius: 5rpx;
		background-color: #0F4687;
	}

	.structure-number-button {
		margin-left: 10rpx;
	}

	.button-on {
		background-color: #00dd00;
	}

	.button-off {
		background-color: #f56c6c;
	}

	.disabled {
		background-color: #cccccc;
		opacity: 0.6;
		cursor: not-allowed;
	}

	.popup-content {
		background-color: #fff;
		height: 45vh;
		/* padding: 10rpx; */
		display: flex;
		flex-direction: column;
	}

	.popup-header {
		height: 4vh;
		width: 100%;
		display: flex;
		align-items: center;
		padding-left: 10rpx;
		background-color: #bdcbe0;
		font-size: 18px;
		color: #333;
	}

	.read-table-header,
	.read-table-row {
		display: flex;
		align-items: center;
		padding: 14rpx 12rpx;
		border-bottom: 1px solid #eee;
	}

	.read-table-header {
		font-weight: bold;
		background-color: #f5f7fa;
		padding-right: 40rpx;
	}

	.read-table-body {
		flex: 1;
		overflow: auto;
	}

	.read-cell {
		flex-shrink: 0;
	}

	.read-cell.name {
		color: #666666;
		font-size: 20rpx;
		flex: 1.5;
		display: flex;
		align-items: center;
		max-width: 300rpx;
	}

	.read-cell.code {
		color: #666666;
		font-size: 20rpx;
		flex: 1;
	}

	.read-cell.actions {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		gap: 10rpx;
	}

	.read-batchDelete {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	.disabled-btn {
		background-color: #ddd;
		color: #999;
	}

	.btn {
		font-size: 20rpx;
		padding: 0 16rpx;
		border-radius: 6rpx;
		margin: 0 5rpx;
	}

	.delete {
		background-color: #f56c6c;
		color: #fff;
	}

	.edit {
		background-color: #409eff;
		color: #fff;
	}

	.text-hide {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		max-width: 100%;
	}

	:deep(.uni-checkbox-input) {
		border-radius: 50%;
	}

	.popup-box {
		background: #fff;
		/* padding: 10rpx; */
		height: 45vh;
		display: flex;
		flex-direction: column;
	}

	.create-suffix {
		padding: 14rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.create-suffix-text {
		width: 15%;
		color: #666666;
		font-size: 20rpx;
		margin-right: 10rpx;
		text-align: center;
	}

	.create-suffix-input {
		width: 85%;
		border: 1px solid #ccc;
		padding: 5rpx;
		border-radius: 5rpx;
		margin-right: 10rpx;
	}

	.create-table-header {
		padding: 10rpx 0rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #f5f5f5;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.numberFragment {
		width: 15%;
		color: #666666;
		font-size: 20rpx;
		margin-right: 10rpx;
		text-align: center;
	}

	.create-table-cols {
		width: 85%;
		padding: 5rpx;
		display: flex;
		align-items: center;
	}

	.create-table-body {
		flex: 1;
		overflow: auto;
		padding-bottom: 20rpx;
	}

	.create-row {
		height: 50rpx;
		padding: 5rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.create-placeholder {
		width: 15%;
		height: 100%;
	}

	.create-row-right {
		width: 85%;
		height: 100%;
		padding: 5rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.col {
		/* flex: 1; */
		text-align: center;
		font-size: 20rpx;
	}

	.col:nth-child(1) {
		width: 15%;
	}

	.col:nth-child(2) {
		width: 20%;
	}

	.col:nth-child(3) {
		width: 45%;
	}

	.col:nth-child(4) {
		width: 15%;
	}

	.create-number {
		width: 15%;
		text-align: center;
		font-size: 20rpx;
		color: #666;
	}

	.create-class {
		width: 20%;
		padding: 5rpx;
		padding-left: 6rpx;
		border: 1px solid #e3e3e3;
		border-radius: 5rpx;
	}

	.create-class-value {
		font-size: 20rpx;
		color: #666;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.arrow-down {
		font-size: 12rpx;
		color: #666;
		margin-left: 4rpx;
	}

	.create-value {
		width: 30%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 5rpx;
		color: #666;
	}

	.create-value-input {
		font-size: 18rpx;
		padding: 5rpx;
		border: 1px solid #e3e3e3;
		border-radius: 5rpx;
		color: #666;
	}

	.create-value-text {
		margin: 10rpx;
		font-size: 18rpx;
	}

	.create-delete {
		width: 20%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input {
		width: 70%;
		border: 1px solid #ccc;
		padding: 5rpx;
		flex: 1;
	}

	.range-input {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.btn-delete {
		background-color: #f56c6c;
		color: white;
		font-size: 20rpx;
		padding: 0rpx 15rpx;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-row {
		width: 80%;
		height: 20%;
		display: flex;
		justify-content: space-between;
		padding-left: 16%;
		padding-right: 4%;
	}

	.btn-add {
		margin: 0;
		height: 80%;
		background-color: #409eff;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.right-btns {
		display: flex;
		gap: 20rpx;
	}

	.btn-cancel,
	.btn-confirm {
		padding: 10rpx 20rpx;
		color: white;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-cancel {
		background: #ffffff;
		border: 1px solid #409eff;
		color: #409eff;
	}

	.btn-confirm {
		background: #409eff;
	}

	.edit-btn-row {
		height: 13%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 20rpx;
	}

	.edit-btn-row button {
		margin: 10rpx;
	}

	.bottomBorder {
		border-bottom: 1px solid #f5f5f5;
	}
</style>
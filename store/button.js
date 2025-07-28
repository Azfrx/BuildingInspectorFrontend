import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'

export const ButtonStore = defineStore('button', () => {
	const show = ref(false) // 默认隐藏按钮
	
	// 隐藏按钮
	const reback = (Id) => {
		show.value = false;
	}
	
	// 显示按钮
	const showPhotoInfo = () => {
		show.value = true;
	}
	
	return {
		show,
		reback,
		showPhotoInfo
	}
})
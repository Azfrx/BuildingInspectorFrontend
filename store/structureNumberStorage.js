import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'

export const structureStore = defineStore('count', () => {
	//构件数量是否合法 字段为false表示存在异常
	const status = ref(true)
	const setStatus = (bool)=>{
		status.value = bool
	}
	return {
		status,
		setStatus
	}
})
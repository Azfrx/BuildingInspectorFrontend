import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'

export const userStore = defineStore('user', () => {
	const username = ref('')
	const password = ref('')
	const infoData = ref('')
	const setUserInfo = (userinfo) => {
		username.value = userinfo.username
		password.value = userinfo.password
		infoData.value = userinfo.infoData
	}
	
	const hadUsername = ref('') // 用于存储已存在的用户名
	const setHadUsername = (username) => {
		hadUsername.value = username
	}
	return {
		username,
		password,
		infoData,
		setUserInfo,
		hadUsername,
		setHadUsername,
	}
})
//store旨在存储全局数据，让不同组件可以随时访问，而不必层层传递 props 或 emit
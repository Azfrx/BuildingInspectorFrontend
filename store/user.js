import {
	defineStore
} from 'pinia'

export const useUserStore = defineStore('user', {
	//共享的全局数据
	state: () => ({
		username: '',
		token: '',
		isLoggedIn: false
	}),
	//修改全局数据的方法
	actions: {
		login(username, token) {
			this.username = username
			this.token = token
			this.isLoggedIn = true
		},
		logout() {
			this.username = ''
			this.token = ''
			this.isLoggedIn = false
			// 清除本地存储
			uni.removeStorageSync('token')
		}
	}
})
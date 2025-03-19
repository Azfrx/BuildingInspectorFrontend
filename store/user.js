import {
	defineStore
} from 'pinia'

export const useUserStore = defineStore('user', {
	//共享的全局数据
	state: () => ({
		name: '张三',
		age: 25,
		isLoggedIn: false
	}),
	//修改全局数据的方法
	actions: {
		login(name) {
			this.name = name
			this.isLoggedIn = true
		},
		logout() {
			this.name = ''
			this.isLoggedIn = false
		}
	}
})
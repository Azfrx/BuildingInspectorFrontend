import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'


Vue.config.productionTip = false
App.mpType = 'app'


const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import {
	createPinia
} from 'pinia'
import './style/base.css'
import { useChatStore } from './store/chatStore.js';


export function createApp() {
	const app = createSSRApp(App)
	const pinia = createPinia()

	app.use(pinia)

	// 在 app 创建之后，但在挂载之前，设置持久化
	const chatStore = useChatStore(pinia);
	chatStore.$subscribe((mutation, state) => {
		const stateToSave = {
			conversations: state.conversations,
			currentChatId: state.currentChatId,
		};
		try {
			uni.setStorageSync('chatStore', JSON.stringify(stateToSave));
		} catch (error) {
			console.error('聊天机器人持久化失败', error);
		}
	});

	return {
		app
	}
}
// #endif
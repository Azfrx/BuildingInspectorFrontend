import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

//store旨在存储全局数据，让不同组件可以随时访问，而不必层层传递 props 或 emit
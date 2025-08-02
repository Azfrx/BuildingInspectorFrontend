import {
	defineStore
} from 'pinia'
import { ref} from 'vue'; 
export const useObject = defineStore('object', () => {
	const data = ref({});
	const setData = (newdata) =>{
		data.value = newdata;
	}
	const getData = () =>{
		return data.value
	}
	return {
		setData,
		getData
	}
})
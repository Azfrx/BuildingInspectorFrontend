import { reactive } from 'vue';

const apiConfig = reactive({
  baseURL: "http://59.110.81.142:8090", // 基础URL
  endpoints: {
    login: "/jwt/login",
    dataPackage: "/api/user/dataPackage",
    logOut: "/api/user/logOut",
    resetPassword: "/api/user/resetPassword"
  }
});

export default apiConfig;
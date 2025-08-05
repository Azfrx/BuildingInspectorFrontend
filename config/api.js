// api.js
import { reactive } from 'vue';

const apiConfig = reactive({
  baseURL: "http://59.110.81.142:8090", // 基础URL
  botURL: "http://59.110.81.142:8081",
  endpoints: {
    login: "/jwt/login",
    dataPackage: "/api/user/dataPackage",
    logOut: "/api/user/logOut",
    resetPassword: "/api/user/resetPassword"
  },

  // 登录
  login: async function(username, password) {
    return await uni.request({
      url: `${apiConfig.baseURL}${apiConfig.endpoints.login}?username=${username}&password=${password}`,
      method: 'POST'
    });
  },

  // 获取数据包
  getDataPackage: async function(token) {
    return await uni.request({
      url: `${apiConfig.baseURL}${apiConfig.endpoints.dataPackage}`,
      method: 'GET',
      header: {
        'Authorization': `${token}`
      }
    });
  },

  // 重置密码
  resetPassword: async function(oldPassword, newPassword, token) {
    return await uni.request({
      url: `${apiConfig.baseURL}${apiConfig.endpoints.resetPassword}?oldPassword=${oldPassword}&newPassword=${newPassword}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    });
  },

  // 退出登录
  logOut: async function(token) {
    return await uni.request({
      url: `${apiConfig.baseURL}${apiConfig.endpoints.logOut}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    });
  }
});

export default apiConfig;
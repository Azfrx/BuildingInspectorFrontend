import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: `/jwt/login?username=${data.username}&password=${data.password}`,
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}
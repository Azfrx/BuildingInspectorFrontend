// 创建请求实例
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 合并请求头
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    
    // 获取token
    const token = uni.getStorageSync('token')
    // 如果不是登录接口，才添加token
    if (token && !options.url.includes('/jwt/login')) {
      header['token'] = token
    }
    
    // 拼接完整的请求URL
    const baseUrl = 'http://60.205.13.156:8090' // 修改为你的实际后端地址
    const url = options.url.startsWith('http') ? options.url : `${baseUrl}${options.url}`
    
    // 打印请求信息
    console.log('请求URL:', url)
    console.log('请求方法:', options.method)
    console.log('请求数据:', options.data)
    console.log('请求头:', header)
    
    uni.request({
      url,
      method: options.method || 'GET',
      data: options.data,
      header,
      timeout: 10000,
      success: (res) => {
        // 打印响应信息
        console.log('响应数据:', res.data)
        
        // 处理响应
        if (res.statusCode === 200) {
          // 登录成功
          if (res.data.code === 0) {
            // 如果是登录接口，直接返回完整响应
            if (url.includes('/jwt/login')) {
              resolve(res.data)
            } else {
              resolve(res.data.data)
            }
          } else {
            // 处理业务错误
            uni.showToast({
              title: res.data.msg || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else {
          // 处理HTTP错误
          uni.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        console.error('请求失败:', err)
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export default request 
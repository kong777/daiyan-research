import axios from 'axios'
import store from '../store'

// create an axios instance
const service = axios.create({
  baseURL: 'https://question.wendy.fun/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getToken) {
      config.headers['Authorization'] = `bearer ${store.getToken}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code !== 1000) {
      // 未登录
      if ([2004, 2005, 2006, 2007].includes(res.code)) {
        const path = window.location.pathname
        if (path !== '/login') {
          window.location.href = `/login?r=${window.location.pathname}`
        }
      }
      return Promise.reject(res.msg || 'Error')
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
import axios from 'axios'

import { BASE_URL, TIME_OUT } from './config'
import Massage from '@/utils/Massage'

// 封装网络请求类
class HYRequest {
  constructor(config) {
    this.instance = axios.create(config)
    // 确保 config.headers 是一个对象

    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        config.headers['ngrok-skip-browser-warning'] = 'true'
        return config
      },
      (err) => {
        return err
      }
    )

    // 全局响应拦截器
    this.instance.interceptors.response.use(
      (res) => {
        return res.data
      },
      (err) => {
        // 添加判断 token 是否过期
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token')
          // 提示用户 token 过期
          Massage.error('登录已过期，请重新登录！')
          setTimeout(() => {
            // 跳转到登录页面
            window.location.href = '/login'
          }, 2000)
        }
        return Promise.reject(err)
      }
    )

    // 特定实例的拦截器
    if (config.interceptors) {
      const {
        requestSuccessFn,
        requestFailureFn,
        responseSuccessFn,
        responseFailureFn
      } = config.interceptors
      if (requestSuccessFn) {
        this.instance.interceptors.request.use(
          requestSuccessFn,
          requestFailureFn
        )
      }
      if (responseSuccessFn) {
        this.instance.interceptors.response.use(
          responseSuccessFn,
          responseFailureFn
        )
      }
    }
  }

  // 封装网络请求方法
  request(config) {
    // 单次请求的成功拦截处理
    if (config.interceptors && config.interceptors.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }

    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          // 单次响应的成功拦截处理
          if (config.interceptors && config.interceptors.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  }
  get(config) {
    return this.request({ ...config, method: 'GET' })
  }

  post(config) {
    return this.request({ ...config, method: 'POST' })
  }

  delete(config) {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch(config) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

// 创建请求实例
const Request = new HYRequest({
  baseURL: '/api',
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      const noTokenUrls = ['/login', '/register']
      // 获取当前请求的路径
      const url = config.url
      // 判断当前请求路径是否在不需要添加 token 的列表中
      if (noTokenUrls.some((noTokenUrl) => url.includes(noTokenUrl))) {
        return config
      }
      // 每一个请求都自动携带 token
      const token = localStorage.getItem('token')

      if (config.headers && token) {
        config.headers.token = token
      }
      return config
    }
  }
})

export default Request

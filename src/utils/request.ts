/*
 * @Author: qyp
 * @Date: 2026-06-16 13:31:36
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-02 16:03:18
 * @Description: 
 */
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',  
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截：自动带 token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  }, (error) => Promise.reject(error)
)

// 响应拦截：统一处理错误
instance.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data
    if (code === 200) {
      return data   // ✅ 直接返回 data
    }
    // code 不是 200 时，应该抛出错误
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    // HTTP 错误
    return Promise.reject(error)
  }
)

export default instance
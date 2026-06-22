/*
 * @Author: qyp
 * @Date: 2026-06-16 13:31:36
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-16 14:42:33
 * @Description: 
 */
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 1000,
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
instance.interceptors.response.use((response: AxiosResponse<ApiResponse>) => {
  const { code, data, message } = response.data
  if (code === 200) return data
  return Promise.reject(new Error(message || '请求失败'))
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
})

export default instance
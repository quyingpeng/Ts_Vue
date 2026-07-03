/*
 * @Author: qyp
 * @Date: 2026-06-15 11:16:57
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-03 23:14:02
 * @Description: 
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'

interface User {
  id: number
  username: string
  nickname: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'disabled'
  createdAt: string
  avatar: string  // 
}

export const useUserStore = defineStore('user', () => {
  const savedUser = localStorage.getItem('user')
  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)
  const token = ref<string>(localStorage.getItem('token') || '')
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => user.value?.nickname || '')

  const login = async (username: string, password: string): Promise<void> => {
    const data: any = await request.post('/auth/login', { username, password })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    token.value = '';
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user') 
  }

  return { user, token, isLoggedIn, userName, login, logout }
},{
  persist: true  
})

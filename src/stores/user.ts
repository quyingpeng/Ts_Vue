/*
 * @Author: qyp
 * @Date: 2026-06-15 11:16:57
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-26 20:17:05
 * @Description: 
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => user.value?.nickname || '')

  const login = async (username: string, password: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    if (password.length < 3) {
      throw new Error('密码长度不能少于3位')
    }
    const mockToken = 'token_' + Date.now()
    const mockUser: User = {
      id: 1,
      username,
      nickname: username,
      role: 'admin'
    }

    token.value = mockToken
    user.value = mockUser
    localStorage.setItem('token', mockToken)
  }

  const logout = () => {
    token.value = '';
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, userName, login, logout }
})

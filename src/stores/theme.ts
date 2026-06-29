/*
 * @Author: qyp
 * @Date: 2026-06-28 18:08:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-28 18:28:34
 * @Description: 
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  const toggle = () => {
    isDark.value = !isDark.value
  }
  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('theme', val ? 'dark' : 'light')
  }, { immediate: true })
  return { isDark, toggle }
})
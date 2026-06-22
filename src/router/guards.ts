/*
 * @Author: qyp
 * @Date: 2026-06-20 22:25:05
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-20 22:54:12
 * @Description: 
 */
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (to.path === '/login') {
      if (userStore.isLoggedIn) {
        next('/')
      } else {
        next()
      }
      return
    }

    if (!userStore.isLoggedIn) {
      next('/login')
      return
    }

    next()
  })
}
/*
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-20 22:33:54
 * @Description: 
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { setupRouterGuards } from './guards'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', component: () => import('@/views/DashboardView.vue') },
        { path: 'users', component: () => import('@/views/UserListView.vue') },
        { path: 'about', component: () => import('@/views/AboutView.vue') },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')  // 懒加载
    // },
    // {
    //   path: '/users',
    //   name: 'users',
    //   component: () => import('../views/UserListView.vue')
    // },
    // {
    //   path: '/users/:id',
    //   name: 'user-detail',
    //   component: () => import('../views/UserDetail.vue')
    // }
  ],
})
setupRouterGuards(router)
export default router

<!--
 * @Author: qyp
 * @Date: 2026-06-15 23:48:41
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-29 10:46:33
 * @Description: 
-->
<script lang="ts" setup>
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import Breadcrumb from '@/components/Breadcrumb.vue'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div style="display: flex; min-height: 100vh;">
    <!-- 侧边栏 -->
    <aside style="width: 220px; background: var(--sidebar-bg, #304156); color: #fff; padding: 20px 0; display: flex; flex-direction: column; transition: background 0.3s;">
      <h3 style="padding: 0 20px; margin-bottom: 24px; font-size: 18px;">后台管理</h3>

      <!-- 导航菜单 -->
      <nav style="display: flex; flex-direction: column; gap: 4px; flex: 1; padding: 0 12px;">
        <RouterLink to="/" style="color: #fff; padding: 10px 12px; border-radius: 6px; text-decoration: none; font-size: 14px; display: flex; align-items: center; gap: 8px;">
          📊 仪表盘
        </RouterLink>
        <RouterLink to="/users" style="color: #fff; padding: 10px 12px; border-radius: 6px; text-decoration: none; font-size: 14px; display: flex; align-items: center; gap: 8px;">
          👥 用户管理
        </RouterLink>
        <RouterLink to="/about" style="color: #fff; padding: 10px 12px; border-radius: 6px; text-decoration: none; font-size: 14px; display: flex; align-items: center; gap: 8px;">
          ℹ️ 关于
        </RouterLink>
      </nav>

      <!-- 底部操作区 -->
      <div style="padding: 12px; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 12px;">
        <!-- 主题切换 -->
        <div
          @click="themeStore.toggle()"
          style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s; font-size: 14px;"
        >
          <span style="font-size: 18px;">{{ themeStore.isDark ? '☀️' : '🌙' }}</span>
          <span>{{ themeStore.isDark ? '切换亮色' : '切换暗色' }}</span>
        </div>

        <!-- 退出登录 -->
        <div
          @click="handleLogout"
          style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s; font-size: 14px; color: rgba(255,255,255,0.7);"
        >
          <span style="font-size: 16px;">🚪</span>
          <span>退出登录</span>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main style="flex: 1; padding: 24px; background: var(--bg-color, #f0f2f5); transition: background 0.3s;">
      <Breadcrumb />
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* 当前路由高亮 */
nav a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.15) !important;
  font-weight: 500;
}
</style>
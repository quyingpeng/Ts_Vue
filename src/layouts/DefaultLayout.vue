<!--
 * @Author: qyp
 * @Date: 2026-06-15 23:48:41
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-22 00:32:52
 * @Description: 
-->
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Breadcrumb from '@/components/Breadcrumb.vue'
const router = useRouter()
const userStore = useUserStore()
const handleLogout = () => { userStore.logout(); router.push('/login') }
</script>

<template>
  <div style="display:flex;min-height:100vh">
    <!-- 侧边栏 -->
    <aside style="width: 200px; background: #304156; color: white; padding: 20px;">
      <h3>后台管理</h3>
      <nav style="display: flex; flex-direction: column; gap: 8px;">
        <RouterLink to="/" style="color: white;">首页</RouterLink>
        <RouterLink to="/users" style="color: white;">用户管理</RouterLink>
        <RouterLink to="/about" style="color: white;">关于</RouterLink>
        <button @click="handleLogout"
          style="background: transparent; color: white; border: 1px solid white; padding: 8px; border-radius: 4px; margin-top: auto;">
          退出登录
        </button>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main style="flex: 1; padding: 20px;">
      <Breadcrumb />
      <RouterView />
    </main>
  </div>
</template>
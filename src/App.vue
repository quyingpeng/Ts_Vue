<!--
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-28 18:30:09
 * @Description: 
-->
<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AiChat from '@/components/AiChat.vue'
</script>

<template> 
  <div>
    <!-- <nav style="display: flex; gap: 16px; padding: 12px; background: #f5f5f5; margin-bottom: 20px;">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/users">用户列表</RouterLink>
      <RouterLink to="/about">关于</RouterLink>
    </nav> -->

    <!-- 路由出口：匹配到的页面显示在这里 -->
    <RouterView />
    <AiChat />
  </div>
</template>

<style scoped>
html.dark .el-table {
  background-color: var(--card-bg);
  color: var(--text-color);
}

html.dark .el-table th {
  background-color: var(--sidebar-bg);
}
</style>

<!--
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-03 20:49:51
 * @Description: 
-->
<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AiChat from '@/components/AiChat.vue'
</script>

<template> 
  <div>
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

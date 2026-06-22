<!--
 * @Author: qyp
 * @Date: 2026-06-21 23:32:25
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-21 23:32:50
 * @Description: 
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuMap: Record<string, string> = {
  '': '首页',
  users: '用户管理',
  about: '关于'
}

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  const result = [{ name: '首页', path: '/' }]
  let fullPath = ''
  paths.forEach(p => {
    fullPath += `/${p}`
    result.push({ name: menuMap[p] || p, path: fullPath })
  })
  return result
})
</script>

<template>
  <div style="padding: 8px 0; font-size: 14px;">
    <span v-for="(crumb, i) in breadcrumbs" :key="crumb.path">
      <span
        @click="i < breadcrumbs.length - 1 && router.push(crumb.path)"
        :style="{ color: i < breadcrumbs.length - 1 ? '#409eff' : '#333', cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default' }"
      >
        {{ crumb.name }}
      </span>
      <span v-if="i < breadcrumbs.length - 1" style="margin: 0 8px; color: #ccc;">/</span>
    </span>
  </div>
</template>
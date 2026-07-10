<!--
 * @Author: qyp
 * @Date: 2026-07-10 21:48:37
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-10 21:51:55
 * @Description: 
-->
<script setup lang="ts">
import { ref } from 'vue'
import { request } from '@/utils/request'

const users = ref([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)

const fetchUsers = async () => {
  loading.value = true
  try {
    const data = await request({
      url: '/users',
      params: { page: page.value, pageSize: 10 }
    })
    users.value = data.list
    total.value = data.total
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (users.value.length < total.value) {
    page.value++
    // 简单追加
    request({ url: '/users', params: { page: page.value, pageSize: 10 } }).then(data => {
      users.value.push(...data.list)
    })
  }
}
</script>

<template>
  <view>
    <view v-for="user in users" :key="user.id" class="user-item">
      <text>{{ user.nickname || user.username }}</text>
      <text>{{ user.role }}</text>
    </view>
    <button v-if="users.length < total" @click="loadMore">加载更多</button>
  </view>
</template>
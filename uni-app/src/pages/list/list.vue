<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: number
  username: string
  nickname: string
  email: string
  role: string
  status: string
  avatar: string
}

const users = ref<User[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const total = ref(0)

const fetchUsers = async () => {
  loading.value = true
  try {
    const token = uni.getStorageSync('token')
    const res = await uni.request({
      url: 'http://localhost:3000/api/users',
      method: 'GET',
      data: { page: page.value, pageSize: 10, keyword: keyword.value },
      header: { Authorization: `Bearer ${token}` }
    })
    const data = res.data as any
    if (data.code === 200) {
      users.value = data.data.list
      total.value = data.data.total
    }
  } catch (err) {
    console.error('获取用户列表失败', err)
  } finally {
    loading.value = false
  }
}

const goDetail = (user: User) => {
  uni.navigateTo({ url: `/pages/user/user?id=${user.id}` })
}

const handleSearch = () => {
  page.value = 1
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input v-model="keyword" placeholder="搜索用户名或昵称" class="search-input" @confirm="handleSearch" />
      <button @click="handleSearch" size="mini" type="primary">搜索</button>
    </view>

    <!-- 列表 -->
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else>
      <view v-for="user in users" :key="user.id" class="user-item" @click="goDetail(user)">
        <image v-if="user.avatar" :src="user.avatar" class="avatar" mode="aspectFill" />
        <view v-else class="avatar-placeholder">👤</view>
        <view class="user-info">
          <text class="nickname">{{ user.nickname || user.username }}</text>
          <text class="email">{{ user.email }}</text>
        </view>
        <text class="role">{{ user.role === 'admin' ? '管理员' : user.role === 'editor' ? '编辑' : '访客' }}</text>
        <text class="arrow">›</text>
      </view>
      <view v-if="users.length === 0" class="empty">暂无数据</view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}
.search-bar {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
  padding: 16rpx;
  background: #fff;
  border-radius: 12rpx;
}
.search-input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  padding: 12rpx 16rpx;
  font-size: 28rpx;
}
.loading, .empty {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 28rpx;
}
.user-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #fff;
  margin-bottom: 12rpx;
  border-radius: 12rpx;
  gap: 20rpx;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.avatar-placeholder {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.nickname {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.email {
  font-size: 24rpx;
  color: #999;
}
.role {
  font-size: 24rpx;
  color: #666;
  background: #f0f0f0;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}
.arrow {
  font-size: 36rpx;
  color: #ccc;
}
</style>
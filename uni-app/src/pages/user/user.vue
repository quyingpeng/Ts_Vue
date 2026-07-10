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
  createdAt: string
}

const user = ref<User | null>(null)
const loading = ref(true)

onMounted(() => {
  // 从上一页传过来的 id
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const id = currentPage.$page?.options?.id

  if (id) {
    fetchUser(id)
  }
})

const fetchUser = async (id: string) => {
  try {
    const token = uni.getStorageSync('token')
    const res = await uni.request({
      url: `http://localhost:3000/api/users/${id}`,  // 改这里
      method: 'GET',
      timeout: 10000,  // 超时时间 10 秒
      header: { Authorization: `Bearer ${token}` }
    })
    const data = res.data as any
    if (data.code === 200) {
      user.value = data.data
    }
  } catch (err) {
    console.error('获取用户详情失败', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="container">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="user" class="card">
      <view class="header">
        <image v-if="user.avatar" :src="user.avatar" class="avatar" mode="aspectFill" />
        <view v-else class="avatar-placeholder">👤</view>
        <text class="name">{{ user.nickname || user.username }}</text>
        <text class="role-tag">{{ user.role === 'admin' ? '管理员' : user.role === 'editor' ? '编辑' : '访客' }}</text>
      </view>

      <view class="info-list">
        <view class="info-row">
          <text class="label">用户名</text>
          <text class="value">{{ user.username }}</text>
        </view>
        <view class="info-row">
          <text class="label">邮箱</text>
          <text class="value">{{ user.email }}</text>
        </view>
        <view class="info-row">
          <text class="label">状态</text>
          <text class="value" :style="{ color: user.status === 'active' ? '#4caf50' : '#f44336' }">
            {{ user.status === 'active' ? '正常' : '禁用' }}
          </text>
        </view>
        <view class="info-row">
          <text class="label">创建时间</text>
          <text class="value">{{ user.createdAt }}</text>
        </view>
      </view>
    </view>
    <view v-else class="empty">用户不存在</view>
  </view>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}
.loading, .empty {
  text-align: center;
  padding: 200rpx 0;
  color: #999;
  font-size: 28rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40rpx;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 40rpx;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
}
.avatar-placeholder {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  margin-bottom: 20rpx;
}
.name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}
.role-tag {
  font-size: 24rpx;
  color: #409eff;
  background: #ecf5ff;
  padding: 6rpx 24rpx;
  border-radius: 20rpx;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1px solid #f5f5f5;
}
.label {
  color: #999;
  font-size: 28rpx;
}
.value {
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
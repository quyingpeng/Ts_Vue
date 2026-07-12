<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

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
const isEditing = ref(false)

// 编辑时的临时表单数据
const editForm = ref({
  nickname: '',
  email: '',
  avatar: ''
})

// 接收页面参数
onLoad((options: any) => {
  const id = options?.id
  if (id) {
    fetchUser(id)
  }
})

// 获取用户详情
const fetchUser = async (id: string) => {
  loading.value = true
  try {
    const token = uni.getStorageSync('token')
    const res = await uni.request({
      url: `http://localhost:3000/api/users/${id}`,
      method: 'GET',
      header: { Authorization: `Bearer ${token}` }
    })
    const data = res.data as any
    if (data.code === 200) {
      user.value = data.data
      initEditForm()
    }
  } catch (err) {
    console.error('获取用户详情失败', err)
  } finally {
    loading.value = false
  }
}

// 用当前 user 数据初始化编辑表单
const initEditForm = () => {
  if (user.value) {
    editForm.value = {
      nickname: user.value.nickname || '',
      email: user.value.email || '',
      avatar: user.value.avatar || ''
    }
  }
}

// 进入编辑模式
const startEdit = () => {
  initEditForm()
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
}

// 更换头像（仅在编辑模式下可触发）
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uni.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        success: (fileRes) => {
          const base64 = `data:image/jpeg;base64,${fileRes.data}`
          editForm.value.avatar = base64
        }
      })
    }
  })
}

// 保存编辑
const saveEdit = async () => {
  if (!user.value) return
  try {
    const token = uni.getStorageSync('token')
    const res = await uni.request({
      url: `http://localhost:3000/api/users/${user.value.id}`,
      method: 'PUT',
      header: { Authorization: `Bearer ${token}` },
      data: {
        nickname: editForm.value.nickname,
        email: editForm.value.email,
        avatar: editForm.value.avatar
      }
    })
    const data = res.data as any
    if (data.code === 200) {
      // 更新本地 user 数据
      user.value.nickname = editForm.value.nickname
      user.value.email = editForm.value.email
      user.value.avatar = editForm.value.avatar
      isEditing.value = false
      uni.showToast({ title: '保存成功', icon: 'success' })
    } else {
      uni.showToast({ title: data.message || '保存失败', icon: 'none' })
    }
  } catch (err) {
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}
</script>

<template>
  <view class="container">
    <!-- 加载中 -->
    <view v-if="loading" class="loading">加载中...</view>

    <!-- 用户信息卡片 -->
    <view v-else-if="user" class="card">
      <!-- 头部：头像 + 姓名 -->
      <view class="header">
        <!-- 展示模式：不可点击 -->
        <view v-if="!isEditing">
          <image v-if="user.avatar" :src="user.avatar" class="avatar" mode="aspectFill" />
          <view v-else class="avatar-placeholder">👤</view>
        </view>
        <!-- 编辑模式：点击可换头像 -->
        <view v-else @click="changeAvatar">
          <image v-if="editForm.avatar" :src="editForm.avatar" class="avatar" mode="aspectFill" />
          <view v-else class="avatar-placeholder">👤</view>
        </view>

        <text class="name">{{ user.nickname || user.username }}</text>
        <text class="role-tag">{{ user.role === 'admin' ? '管理员' : user.role === 'editor' ? '编辑' : '访客' }}</text>
      </view>

      <!-- 信息列表 -->
      <view class="info-list">
        <view class="info-row">
          <text class="label">用户名</text>
          <text class="value">{{ user.username }}</text>
        </view>

        <view class="info-row">
          <text class="label">昵称</text>
          <input v-if="isEditing" v-model="editForm.nickname" class="edit-input" />
          <text v-else class="value">{{ user.nickname || '-' }}</text>
        </view>

        <view class="info-row">
          <text class="label">邮箱</text>
          <input v-if="isEditing" v-model="editForm.email" class="edit-input" />
          <text v-else class="value">{{ user.email || '-' }}</text>
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

      <!-- 按钮区域 -->
      <view class="actions">
        <button v-if="!isEditing" type="primary" @click="startEdit">编辑</button>
        <template v-else>
          <button type="primary" @click="saveEdit">保存</button>
          <button @click="cancelEdit">取消</button>
        </template>
      </view>
    </view>

    <!-- 用户不存在 -->
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
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f5f5f5;
}
.label {
  color: #999;
  font-size: 28rpx;
  width: 140rpx;
}
.value {
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
  flex: 1;
  text-align: right;
}
.edit-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  font-size: 28rpx;
  text-align: right;
}
.actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  justify-content: center;
}
</style>
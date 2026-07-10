<!--
 * @Author: qyp
 * @Date: 2026-07-04 21:45:20
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-04 22:51:17
 * @Description: 
-->
<template>
  <view class="container">
    <view class="card">
      <text class="title">后台管理系统</text>

      <text v-if="errorMsg" class="error">{{ errorMsg }}</text>

      <input v-model="username" placeholder="用户名" class="input" />
      <input v-model="password" placeholder="密码" type="password" class="input" />

      <button :disabled="loading" @click="handleLogin" class="btn">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const username= ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async ()=>{
  if(!username.value||!password.value){
    errorMsg.value = '请输入用户名和密码'
    return 
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await uni.request({
      url: 'http://localhost:3000/api/auth/login',
      method: 'POST',
      data: { username: username.value, password: password.value }
    })

    const data = res.data as any
    if (data.code === 200) {
      uni.setStorageSync('token', data.data.token)
      uni.showToast({ title: '登录成功', icon: 'success' })
      // 跳转到首页
      uni.switchTab({ url: '/pages/list/list' })
    } else {
      errorMsg.value = data.message || '登录失败'
    }
  } catch (err: any) {
    errorMsg.value = err.message || '网络错误'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}
.card {
  width: 80%;
  padding: 40rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  display: block;
  margin-bottom: 40rpx;
}
.input {
  border: 1px solid #ddd;
  padding: 16rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}
.btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 16rpx;
  border-radius: 8rpx;
  font-size: 30rpx;
}
.error {
  color: red;
  font-size: 26rpx;
  text-align: center;
  display: block;
  margin-bottom: 16rpx;
}
</style>

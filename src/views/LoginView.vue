<!--
 * @Author: qyp
 * @Date: 2026-06-16 15:37:57
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-16 15:57:15
 * @Description: 
-->
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore();

const form = ref({ username: '', password: '' })
const loading = ref(false)
const errorMsg =ref('')

const handleLogin = async ()=>{
   if (!form.value.username || !form.value.password) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  loading.value = true;
  errorMsg.value= '';
  try {
    await userStore.login(form.value.username, form.value.password)
    router.push('/')
  } catch (err: any) {
    errorMsg.value = err.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <!--  样式不重要，但 v-model、@click、v-if 的用法要能看懂 -->
  <div style="max-width: 400px; margin: 100px auto; padding: 40px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="text-align: center;">后台管理系统</h2>
    <div v-if="errorMsg" style="color: red; text-align: center; margin-bottom: 12px;">{{ errorMsg }}</div>

    <div style="margin-bottom: 16px;">
      <label>用户名</label>
      <input v-model="form.username" placeholder="请输入用户名" style="width: 100%; padding: 8px; box-sizing: border-box;" />
    </div>

    <div style="margin-bottom: 16px;">
      <label>密码</label>
      <input v-model="form.password" type="password" placeholder="请输入密码"
        style="width: 100%; padding: 8px; box-sizing: border-box;" @keyup.enter="handleLogin" />
    </div>

    <button :disabled="loading" @click="handleLogin"
      style="width: 100%; padding: 10px; background: #409eff; color: white; border: none; border-radius: 4px;">
      {{ loading ? '登录中...' : '登 录' }}
    </button>
  </div>
</template>
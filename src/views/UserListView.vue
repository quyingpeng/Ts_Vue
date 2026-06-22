<!--
 * @Author: qyp
 * @Date: 2026-06-15 16:42:59
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-21 23:25:00
 * @Description: 
-->
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import FormDialog, { type FormField } from '@/components/FormDialog.vue'
interface User {
  id: number
  username: string
  nickname: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'disabled'
}

// Mock 数据 
const mockUsers: User[] = [
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@test.com', role: 'admin', status: 'active' },
  { id: 2, username: 'editor1', nickname: '编辑小王', email: 'editor@test.com', role: 'editor', status: 'active' },
  { id: 3, username: 'viewer1', nickname: '访客小李', email: 'viewer@test.com', role: 'viewer', status: 'disabled' },
]

const users = ref<User[]>([])
const loading = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const editingUser = ref<User | null>(null)
const formData = ref({
  username: '', nickname: '', email: '',
  role: 'viewer' as User['role'], password: ''
})

const fetchUsers = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  let list = [...mockUsers]
  if (keyword.value) {
    list = list.filter(u => {
      u.username.includes(keyword.value) || u.nickname.includes(keyword.value)
    })
  }
  users.value = list
  loading.value = false
}
const handleCreate = () => {
  editingUser.value = null
  formData.value = { username: '', nickname: '', email: '', role: 'viewer', password: '' }
  dialogVisible.value = true
}

const handleEdit = (user: User) => {
  editingUser.value = user
  formData.value = { username: user.username, nickname: user.nickname, email: user.email, role: user.role, password: '' }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formData.value.username || !formData.value.nickname) {
    alert('用户名和昵称必填')
    return
  }
  if (editingUser.value) {
    const idx = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (idx > -1) {
      users.value[idx] = { ...users.value[idx], ...formData.value }
    }
  } else {
    const newUser: User = {
      id: Date.now(),
      ...formData.value,
      status: 'active'
    }
    users.value.unshift(newUser)
  }
  dialogVisible.value = false
}

const handleDelete = async (user: User) => {
  if (!confirm(`确定删除"${user.nickname}"？`)) return
  users.value = users.value.filter(u => u.id !== user.id)
}

const handleToggleStatus = (user: User) => {
  user.status = user.status === 'active' ? 'disabled' : 'active'
}
// ⚠️ 手敲：表单字段配置（用配置数组驱动表单，不用手写 input）
const formFields: FormField[] = [
  { label: '用户名', key: 'username', type: 'text', required: true },
  { label: '昵称', key: 'nickname', type: 'text', required: true },
  { label: '邮箱', key: 'email', type: 'email' },
  {
    label: '角色', key: 'role', type: 'select', required: true,
    options: [
      { label: '管理员', value: 'admin' },
      { label: '编辑', value: 'editor' },
      { label: '访客', value: 'viewer' }
    ]
  },
  { label: '密码', key: 'password', type: 'password' }
]

// ⚠️ 手敲：处理表单提交
const handleFormSubmit = (data: Record<string, any>) => {
  if (editingUser.value) {
    const idx = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (idx > -1) {
      users.value[idx] = { ...users.value[idx], ...data }
    }
  } else {
    users.value.unshift({
      id: Date.now(),
      ...data,
      status: 'active'
    } as User)
  }
  dialogVisible.value = false
}
onMounted(() => fetchUsers())

</script>
<template>
  <div>
    <h2>👥 用户管理</h2>

    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
      <input v-model="keyword" placeholder="搜索..." @input="fetchUsers" style="padding: 6px; width: 200px;" />
      <!-- 新增按钮：只有 admin 能看到 v-permission="'admin'"   -->
      <button v-permission="'admin'" @click="handleCreate"
        style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; margin-left: auto;">
        + 新增用户
      </button>

    </div>

    <table style="width: 100%; border-collapse: collapse;" v-if="!loading">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="padding: 8px; border: 1px solid #ddd;">用户名</th>
          <th style="padding: 8px; border: 1px solid #ddd;">昵称</th>
          <th style="padding: 8px; border: 1px solid #ddd;">邮箱</th>
          <th style="padding: 8px; border: 1px solid #ddd;">角色</th>
          <th style="padding: 8px; border: 1px solid #ddd;">状态</th>
          <th style="padding: 8px; border: 1px solid #ddd;">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td style="padding: 6px; border: 1px solid #ddd;">{{ u.username }}</td>
          <td style="padding: 6px; border: 1px solid #ddd;">{{ u.nickname }}</td>
          <td style="padding: 6px; border: 1px solid #ddd;">{{ u.email }}</td>
          <td style="padding: 6px; border: 1px solid #ddd;">{{ u.role }}</td>
          <td style="padding: 6px; border: 1px solid #ddd;">
            <button @click="handleToggleStatus(u)"
              :style="{ background: u.status === 'active' ? '#67c23a' : '#f56c6c', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px' }">
              {{ u.status === 'active' ? '正常' : '禁用' }}
            </button>
          </td>
          <td style="padding: 6px; border: 1px solid #ddd;">
            <button @click="handleEdit(u)" style="margin-right: 6px;">编辑</button>
            <!-- 删除按钮：admin 和 editor 能看到 v-role="['admin', 'editor']"   -->
            <button v-role="['admin', 'editor']" @click="handleDelete(u)" style="color: red;">
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>加载中...</p>

    <FormDialog v-model="dialogVisible" :title="editingUser ? '编辑用户' : '新增用户'"
      :fields="editingUser ? formFields.filter(f => f.key !== 'password') : formFields" :initialData="editingUser || {}"
      @submit="handleFormSubmit" />
  </div>
</template>
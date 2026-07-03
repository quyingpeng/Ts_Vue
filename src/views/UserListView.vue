<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { useDebounce } from '@/composables/useDebounce'
import FormDialog, { type FormField } from '@/components/FormDialog.vue'
import request from '@/utils/request'


interface User {
  id: number
  username: string
  nickname: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'disabled'
  createdAt: string
}

const users = ref<User[]>([])
const loading = ref(false)
const keyword = ref('')
const debouncedKeyword = useDebounce(keyword, 500)
const dialogVisible = ref(false)
const editingUser = ref<User | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formFields: FormField[] = [
  { label: '头像', key: 'avatar', type: 'upload' },  // ← 新增
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

const fetchUsers = async () => {
  loading.value = true
  try {
    const data: any = await request.get('/users', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        keyword: debouncedKeyword.value
      }
    })
    users.value = data.list
    total.value = data.total
  } catch (err) {
    console.error('获取用户列表失败', err)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  editingUser.value = null
  dialogVisible.value = true
}

const handleEdit = (user: User) => {
  editingUser.value = user
  dialogVisible.value = true
}

const handleFormSubmit = async (data: Record<string, any>) => {
  try {
    if (editingUser.value) {
      await request.put(`/users/${editingUser.value.id}`, data)
    } else {
      await request.post('/users', data)
    }
    dialogVisible.value = false
    fetchUsers()  // 刷新列表
  } catch (err: any) {
    alert(err.message || '操作失败')
  }
}

const handleDelete = async (user: User) => {
  if (!confirm(`确定删除"${user.nickname}"？`)) return
  try {
    await request.delete(`/users/${user.id}`)
    fetchUsers()
  } catch (err: any) {
    alert(err.message || '删除失败')
  }
}

const handleToggleStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'disabled' : 'active'
  try {
    await request.put(`/users/${user.id}`, { status: newStatus })
    user.status = newStatus  // 前端直接更新显示，不用重新请求
  } catch (err: any) {
    alert(err.message || '操作失败')
  }
}
const handleSizeChange = () => {
  currentPage.value = 1  // 修改每页条数时回到第一页
  fetchUsers()
}
watch(debouncedKeyword, () => {
  fetchUsers()
})
onMounted(() => fetchUsers())
</script>

<template>
  <div>
    <h2>👥 用户管理</h2>

    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
      <el-input v-model="keyword" placeholder="搜索用户名或昵称" style="width: 260px;" clearable />
      <el-button type="primary" v-permission="'admin'" @click="handleCreate">
        + 新增用户
      </el-button>
    </div>

    <el-table :data="users" border stripe v-loading="loading" style="width: 100%;">
      <el-table-column label="头像" width="70">
        <template #default="{ row }">
          <img v-if="row.avatar" :src="row.avatar"
            style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
          <span v-else style="color: #ccc;">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'editor' ? 'warning' : 'info'">
            {{ row.role === 'admin' ? '管理员' : row.role === 'editor' ? '编辑' : '访客' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-switch :model-value="row.status === 'active'" @change="handleToggleStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" type="primary" :icon="Edit" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" :icon="Delete" v-role="['admin', 'editor']" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: center; margin-top: 16px;">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 10, 20]"
        :total="total" layout="total, sizes, prev, pager, next" @current-change="fetchUsers"
        @size-change="handleSizeChange" />
    </div>

    <FormDialog v-model="dialogVisible" :title="editingUser ? '编辑用户' : '新增用户'"
      :fields="editingUser ? formFields.filter(f => f.key !== 'password') : formFields" :initialData="editingUser || {}"
      @submit="handleFormSubmit" />
  </div>
</template>
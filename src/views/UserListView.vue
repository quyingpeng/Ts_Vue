<script setup lang="ts">
import { ref, onMounted, computed,watch } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { useDebounce } from '@/composables/useDebounce'
import FormDialog, { type FormField } from '@/components/FormDialog.vue'

interface User {
  id: number
  username: string
  nickname: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'disabled'
  createdAt: string
}

const mockUsers: User[] = [
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@test.com', role: 'admin', status: 'active', createdAt: '2024-01-01', avatar: '' },
  { id: 2, username: 'editor1', nickname: '编辑小王', email: 'editor@test.com', role: 'editor', status: 'active', createdAt: '2024-02-15', avatar: '' },
  { id: 3, username: 'viewer1', nickname: '访客小李', email: 'viewer@test.com', role: 'viewer', status: 'disabled', createdAt: '2024-03-20' },
  { id: 4, username: 'zhangsan', nickname: '张三', email: 'zhangsan@test.com', role: 'editor', status: 'active', createdAt: '2024-04-10' },
  { id: 5, username: 'lisi', nickname: '李四', email: 'lisi@test.com', role: 'viewer', status: 'active', createdAt: '2024-05-05' },
]

const filteredUsers = ref<User[]>([])
const users = ref<User[]>([])
const loading = ref(false)
const keyword = ref('')
const debouncedKeyword = useDebounce(keyword,500)
const dialogVisible = ref(false)
const editingUser = ref<User | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)

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
  await new Promise(resolve => setTimeout(resolve, 300))
  let list = [...mockUsers]
  if (debouncedKeyword.value) {
    list = list.filter(u =>
      u.username.includes(debouncedKeyword.value) || u.nickname.includes(debouncedKeyword.value)
    )
  }
  filteredUsers.value = list
  currentPage.value = 1 //搜索时重置
  loading.value = false
}

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})
const handleCreate = () => {
  editingUser.value = null
  dialogVisible.value = true
}

const handleEdit = (user: User) => {
  editingUser.value = user
  dialogVisible.value = true
}

const handleFormSubmit = (data: Record<string, any>) => {
  if (editingUser.value) {
    const idx = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (idx > -1) users.value[idx] = { ...users.value[idx], ...data }
  } else {
    users.value.unshift({
      id: Date.now(),
      ...data,
      status: 'active',
      createdAt: new Date().toISOString()
    } as User)
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

watch(pageSize, () => {
  console.log('切换分页参数')
  currentPage.value = 1
})
watch(debouncedKeyword,()=>{
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

    <el-table :data="pagedUsers" border stripe v-loading="loading" style="width: 100%;">
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
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
        :total="filteredUsers.length" layout="total, sizes, prev, pager, next" />
    </div>

    <FormDialog v-model="dialogVisible" :title="editingUser ? '编辑用户' : '新增用户'"
      :fields="editingUser ? formFields.filter(f => f.key !== 'password') : formFields" :initialData="editingUser || {}"
      @submit="handleFormSubmit" />
  </div>
</template>
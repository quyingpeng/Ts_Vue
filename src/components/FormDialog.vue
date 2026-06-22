<!--
 * @Author: qyp
 * @Date: 2026-06-21 23:04:15
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-21 23:26:59
 * @Description: 
-->
<script setup lang="ts">
// 通用表单弹窗封装，理解配置驱动表单的思路
import { ref, watch } from 'vue'

// 表单字段配置类型
export interface FormField {
  label: string
  key: string
  type: 'text' | 'password' | 'email' | 'select' | 'number'
  placeholder?: string
  options?: { label: string; value: string }[]
  disabled?: boolean
  required?: boolean
}

interface Props {
  title: string
  fields: FormField[]
  modelValue: boolean
  initialData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  submit: [data: Record<string, any>]
}>()

// ⚠️ 手敲：表单数据管理
const formData = ref<Record<string, any>>({})

// ⚠️ 手敲：弹窗打开时初始化表单数据
watch(() => props.modelValue, (visible) => {
  if (visible) {
    const data: Record<string, any> = {}
    props.fields.forEach(f => {
      data[f.key] = props.initialData[f.key] || ''
    })
    formData.value = data
  }
})

// ⚠️ 手敲：校验 + 提交
const handleSubmit = () => {
  const requiredFields = props.fields.filter(f => f.required)
  for (const field of requiredFields) {
    if (!formData.value[field.key]) {
      alert(`${field.label} 为必填项`)
      return
    }
  }
  emit('submit', { ...formData.value })
}
</script>

<template>
  <!--  弹窗 UI 模板 -->
  <div v-if="modelValue" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
    <div style="background: white; padding: 24px; border-radius: 8px; width: 450px;">
      <h3>{{ title }}</h3>

      <div v-for="field in fields" :key="field.key" style="margin-bottom: 12px;">
        <label>
          {{ field.label }}
          <span v-if="field.required" style="color: red;">*</span>
        </label>

        <input
          v-if="field.type !== 'select'"
          v-model="formData[field.key]"
          :type="field.type"
          :placeholder="field.placeholder"
          :disabled="field.disabled"
          style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;"
        />

        <select
          v-else
          v-model="formData[field.key]"
          style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;"
        >
          <option value="">请选择</option>
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
        <button @click="emit('update:modelValue', false)" style="padding: 8px 20px; border: 1px solid #ddd; border-radius: 4px; background: white;">取消</button>
        <button @click="handleSubmit" style="padding: 8px 20px; background: #409eff; color: white; border: none; border-radius: 4px;">确定</button>
      </div>
    </div>
  </div>
</template>
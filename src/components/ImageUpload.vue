<!--
 * @Author: qyp
 * @Date: 2026-06-26 20:08:32
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-26 20:08:43
 * @Description: 
-->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [url: string] }>()

const previewUrl = ref(props.modelValue || '')
const uploading = ref(false)

const handleSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const allowTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowTypes.includes(file.type)) {
    alert('只支持 JPG、PNG、GIF、WebP')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    previewUrl.value = reader.result as string
    uploading.value = true
    setTimeout(() => {
      uploading.value = false
      emit('update:modelValue', previewUrl.value)
    }, 500)
  }
  reader.readAsDataURL(file)
}

const handleRemove = () => {
  previewUrl.value = ''
  emit('update:modelValue', '')
}
</script>

<template>
  <div>
    <div
      v-if="previewUrl"
      style="position: relative; width: 100px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;"
    >
      <img :src="previewUrl" style="width: 100%; height: 100%; object-fit: cover;" alt="预览" />
      <div
        @click="handleRemove"
        style="position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px;"
      >
        ✕
      </div>
    </div>

    <label
      v-else
      style="display: flex; align-items: center; justify-content: center; width: 100px; height: 100px; border: 2px dashed #ddd; border-radius: 8px; cursor: pointer; color: #999; font-size: 14px; flex-direction: column;"
    >
      <span style="font-size: 28px;">+</span>
      <span>{{ uploading ? '上传中...' : '上传头像' }}</span>
      <input type="file" accept="image/*" style="display: none;" @change="handleSelect" :disabled="uploading" />
    </label>
  </div>
</template>
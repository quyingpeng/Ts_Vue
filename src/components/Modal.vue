<!--
 * @Author: qyp
 * @Date: 2026-06-13 23:43:07
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-14 22:23:30
 * @Description: 
-->
<script lang="ts" setup>
defineProps<{
  name:string
  email:string
}>()
const emit =defineEmits<{
  'update:name':[value:string]
  'update:email':[value:string]
}>()
</script>

<template>
  <div>
    <input :value="name" @input="$emit('update:name',($event.target as HTMLInputElement).value)" placeholder="邮箱"/>
    <input :value="email" @input="$emit('update:email',($event.target as HTMLInputElement).value)" placeholder="邮箱"/>
  </div>
</template>
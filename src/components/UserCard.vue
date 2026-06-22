<!--
 * @Author: qyp
 * @Date: 2026-06-12 10:30:08
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-12 16:42:06
 * @Description: 
-->
<script setup lang="ts">
interface Props {
  name: string
  age: number
  role?: string
  avatar?: string
}

// 用definedProps 声明
const props = withDefaults(defineProps<Props>(),{
  role:'未知职位',
  avatar:'https://via.placeholder.com/50'
})

// const propsPick = defineProps<Pick<Props, 'name' | 'age'>>();
</script>

<template>
  <div style="border: 1px solid #ddd; padding: 16px; width: 200px;">
    <h3>{{ props.name }}</h3>
    <p>年龄：{{ props.age }}</p>
    <p v-if="props.role">职位{{ props.role }}</p>
  </div>
</template>

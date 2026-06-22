<!--
 * @Author: qyp
 * @Date: 2026-06-12 16:44:57
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-12 21:22:09
 * @Description: 
-->
<script setup lang="ts">
import {ref} from 'vue'

//生命这个组件可以发出什么事件
const emit = defineEmits<{
  update:[value:number]
  reset:[]
}>()

const count = ref<number>(0)

const increment =()=>{
  count.value++
  emit('update',count.value)
}

const reset = ()=>{
  count.value = 0
  emit('reset')
}
</script>
<template>
  <div style="border: 1px solid #ddd; padding: 12px; margin-bottom: 10px;">
    <p>子组件计数：{{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="reset">重置</button>
  </div>
</template>

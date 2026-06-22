<!--
 * @Author: qyp
 * @Date: 2026-06-12 21:46:01
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-13 23:19:38
 * @Description: 
-->
<script setup lang="ts">
interface Props {
  name: string
  price: number
  quantity: number
}
const props = defineProps<Props>();
const emit = defineEmits<{
  increase: [],
  decrease: []
}>();
//加减数量
const increase = (index:number)=>{
  productss.value[index].quantity = (productss.value[index].quantity??0)+1;
}
const decrease = (index:number)=>{
  const item = productss.value[index];
  const num = item.quantity ?? 0
  if (num > 0) {
    item.quantity = num - 1
  }
}
</script>
<template>
  <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 8px;">
    <span style="font-weight: bold;">{{ props.name }}</span>
    <span style="color: #666;"> ¥{{ props.price }}</span>
    <button @click="emit('decrease')">-</button>
    <span>{{ props.quantity }}</span>
    <button @click="emit('increase')">+</button>
    <span style="float: right; color: #e4393c;">¥{{ props.price * props.quantity }}</span>
  </div>
</template>

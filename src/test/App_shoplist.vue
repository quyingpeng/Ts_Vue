<!--
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-11 21:59:36
 * @Description: 
-->
<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect } from "vue";
interface Product {
  name: string
  price: number
  quantity?: number
}
const state = reactive({
  products: [
    { name: '鼠标', price: 49, quantity: 1 },
    { name: '键盘', price: 199, quantity: 1 },
    { name: '耳机', price: 89, quantity: 2 }
  ] as Product[]
});
const productss = ref<Product[]>([
    { name: '鼠标', price: 49, quantity: 1 },
    { name: '键盘', price: 199, quantity: 1 },
    { name: '耳机', price: 89, quantity: 2 }])

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
// 可选：计算总价（全部商品合计）
const totalPrice = computed(() => {
  return productss.value.reduce((sum, item) => {
    return sum + item.price * (item.quantity ?? 0)
  }, 0)
})
watch(totalPrice,(newVal)=>{
  if(newVal >= 100 ){
    console.log(`💡 总价 ${newVal} 元，满100可减10元！`)
  }
})
</script>

<template>
  <div>
    <div v-for="(it,index) in productss" :key="it.name">{{ it.name }}
      <div style="font-weight: bold;">{{ it.name }}</div>
      <div style="color: #666; margin: 4px 0;">单价：¥{{ it.price }}</div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button @click="decrease(index)" :disabled="it.quantity === 0">-</button>
        <span>{{ it.quantity }}</span>
        <button @click="increase(index)">+</button>
        <span style="margin-left: auto; color: #e4393c;">
          ¥{{ it.price * it.quantity }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<!--
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-15 11:16:41
 * @Description: 
-->
<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import Counter from './components/Counter.vue'
import CartItem from './components/CartItem.vue'
import UserCard from './components/UserCard.vue'
import Modal from './components/Modal.vue'
import { defineStore } from 'pinia'
import { useCounterStore } from './stores/counter.ts'

// ====== 用户列表 ======
const users = [
  { name: '张三', age: 30, role: '前端' },
  { name: '李四', age: 28 },
  { name: '王五', age: 35, role: '设计师' }
]

// ====== Counter 通信 ======
const totalFromChild = ref(0)

const handleUpdate = (val: number) => {
  totalFromChild.value = val
  console.log('子组件发来:', val)
}

const handleReset = () => {
  console.log('子组件重置了')
}

const counter = useCounterStore()

// ====== 购物车 ======
interface Product {
  name: string
  price: number
  quantity: number
}

const state = reactive<{ products: Product[] }>({
  products: [
    { name: '鼠标', price: 49, quantity: 1 },
    { name: '键盘', price: 199, quantity: 1 },
    { name: '耳机', price: 89, quantity: 2 }
  ]
})

const increase = (index: number) => {
  state.products[index].quantity++
}

const decrease = (index: number) => {
  if (state.products[index].quantity > 0) {
    state.products[index].quantity--
  }
}

const totalPrice = computed(() => {
  return state.products.reduce((sum, p) => sum + p.price * p.quantity, 0)
})

watch(totalPrice, (newVal) => {
  if (newVal >= 100) {
    console.log(`💡 总价 ${newVal} 元，满100可减10元！`)
  }
})
</script>

<template> 
  <div>
    <h2>用户列表</h2>
    <UserCard v-for="(user, index) in users" :role="user.role" :key="index" :name="user.name" :age="user.age" />

    <h2>父子通信</h2>
    <Counter @update="handleUpdate" @reset="handleReset" />
    <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2>🛒 简易购物车</h2>

      <!-- 用 CartItem 子组件渲染，不再直接写一堆 div -->
      <CartItem v-for="(product, index) in state.products" :key="product.name" :name="product.name"
        :price="product.price" :quantity="product.quantity" @increase="increase(index)" @decrease="decrease(index)" />

      <div style="font-size: 20px; font-weight: bold; margin-top: 16px; text-align: right;">
        总价：<span style="color: #e4393c;">¥{{ totalPrice }}</span>
      </div>
      <div v-if="totalPrice >= 100" style="color: #e4393c; text-align: right; margin-top: 8px;">
        🎉 满100可减10元！
      </div>
    </div>
    <p>子组件当前值：{{ totalFromChild }}</p>

    <div>
      <p>计数：{{ counter.count }}</p>
      <p>双倍：{{ counter.doubleCount }}</p>
      <button @click="counter.increment">+1</button>
      <button @click="counter.decrement">-1</button>
      <button @click="counter.reset">重置</button>
    </div>
  </div>
</template>

<style scoped></style>

<!--
 * @Author: qyp
 * @Date: 2026-06-15 23:05:43
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-15 23:07:11
 * @Description: 
-->
<script lang="ts" setup>
import {useRoute} from 'vue-router'
const route= useRoute()
const userId = route.params.id
</script>
<template>
  <h2>用户详情</h2>
  <p>用户 ID: {{ userId }}</p>
</template>
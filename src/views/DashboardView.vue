<!--
 * @Author: qyp
 * @Date: 2026-06-16 13:07:54
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-22 00:29:51
 * @Description: 
-->
<script setup lang="ts">
import ChartCard from '@/components/ChartCard.vue'
import type { EChartsOption } from 'echarts'

// 折线图
const lineOption: EChartsOption = {
  title: { text: '近7日访问量', left: 'center' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
  yAxis: { type: 'value' },
  series: [{ data: [820, 932, 901, 934, 1290, 1330, 1520], type: 'line', smooth: true }]
}

// 饼图
const pieOption: EChartsOption = {
  title: { text: '用户角色分布', left: 'center' },
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['40%', '70%'],
    data: [
      { value: 3, name: '管理员' },
      { value: 15, name: '编辑' },
      { value: 42, name: '访客' }
    ]
  }]
}

// 柱状图
const barOption: EChartsOption = {
  title: { text: '内容发布统计', left: 'center' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月','6月'] },
  yAxis: { type: 'value' },
  series: [
    { name: '文章', type: 'bar', data: [12, 20, 15, 30, 22, 35] },
    { name: '视频', type: 'bar', data: [5, 10, 8, 15, 12, 20] }
  ]
}
</script>

<template>
  <div>
    <h2>📊 仪表盘</h2>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
      <div v-for="c in [
        { label: '用户总数', value: 60, color: '#409eff' },
        { label: '今日访问', value: 1520, color: '#67c23a' },
        { label: '文章总数', value: 134, color: '#e6a23c' },
        { label: '待审核', value: 8, color: '#f56c6c' }
      ]" :key="c.label"
        style="padding: 20px; border-radius: 8px; background: white; border: 1px solid #eee; text-align: center;">
        <p style="color: #999; margin: 0 0 8px;">{{ c.label }}</p>
        <p :style="{ fontSize: '28px', fontWeight: 'bold', color: c.color, margin: 0 }">{{ c.value }}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div style="padding: 16px; background: white; border: 1px solid #eee; border-radius: 8px;">
        <ChartCard :option="lineOption" height="280px" />
      </div>
      <div style="padding: 16px; background: white; border: 1px solid #eee; border-radius: 8px;">
        <ChartCard :option="pieOption" height="280px" />
      </div>
    </div>

    <div style="padding: 16px; background: white; border: 1px solid #eee; border-radius: 8px;">
      <ChartCard :option="barOption" height="300px" />
    </div>
  </div>
</template>
<!--
 * @Author: qyp
 * @Date: 2026-06-21 23:28:31
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-21 23:29:36
 * @Description: 
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  option: echarts.EChartsOption
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px'
})

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chart?.dispose()
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
  window.addEventListener('resize', () => chart?.resize())
}

watch(() => props.option, (val) => {
  chart?.setOption(val, true)
}, { deep: true })

onMounted(() => initChart())
onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', () => { })
})
</script>

<template>
  <div ref="chartRef" :style="{ width: '100%', height }" />
</template>
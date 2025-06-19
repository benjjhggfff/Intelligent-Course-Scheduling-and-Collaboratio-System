<script setup>
import { ref, onMounted, nextTick } from 'vue'
import BaseEchart from './BaseEchart.vue'

const chartContainer = ref(null)
const chartHeight = ref('300')

const option = ref({
  legend: {
    top: 'bottom'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [30, 100],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' },
        { value: 26, name: 'rose 6' },
        { value: 22, name: 'rose 7' },
        { value: 18, name: 'rose 9' }
      ]
    }
  ]
})

// 确保DOM完全加载后再初始化图表
onMounted(() => {
  nextTick(() => {
    // 等待 DOM 稳定后，再获取真实高度
    setTimeout(() => {
      if (chartContainer.value) {
        const realHeight = chartContainer.value.offsetHeight || 300
        chartHeight.value = `${realHeight}`
        console.log(chartHeight.value)
      }
    }, 100) // 短暂延迟，确保父布局稳定
  })
})
</script>
<template>
  <div ref="chartContainer">
    <BaseEchart :option="option" :height="chartHeight" />
  </div>
</template>

<style lang="scss" scoped></style>

<template>
  <div class="base-echarts">
    <div
      class="echart"
      ref="echartaRef"
      :style="{ height: props.hight + 'px' }"
    ></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, defineProps } from 'vue'
import china from '@/components/Echars/data/chinaData.json'

echarts.registerMap('china', china)

// 定义 echartaRef 用于引用 DOM 元素
const echartaRef = ref(null)

// 定义 props
const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  hight: {
    type: Number,
    default: 500
  }
})

onMounted(() => {
  // 初始化 ECharts 实例
  const echartInstance = echarts.init(echartaRef.value, 'light', {
    renderer: 'canvas'
  })
  // 设置 ECharts 选项
  echartInstance.setOption(props.option)
  console.log(props.option)
})
</script>

<style lang="scss">
.echart {
  height: 500px;
}
</style>

<template>
  <div class="course-schedule-container">
    <!-- FullCalendar 容器 -->
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import locale from '@fullcalendar/core/locales/zh-cn'

// 模拟课程数据（结构与需求匹配）
const mockCourseData = [
  {
    title: '无机化学\n时东然\n11-18',
    startTime: '08:25',
    endTime: '10:05',
    dayOfWeek: 1 // 周一（0=周日，1=周一...）
  },
  {
    title: '有机化学\n马薛姝\n11-18',
    startTime: '08:25',
    endTime: '10:05',
    dayOfWeek: 5 // 周五
  },
  {
    title: '心理健康教育\n韩慧有\n1-18',
    startTime: '10:25',
    endTime: '12:00',
    dayOfWeek: 1 // 周一
  },
  {
    title: '无机化学\n时东然\n11-18',
    startTime: '10:25',
    endTime: '12:00',
    dayOfWeek: 2 // 周二
  },
  {
    title: '有机化学\n马薛姝\n11-18',
    startTime: '10:25',
    endTime: '12:05',
    dayOfWeek: 3 // 周三
  },
  {
    title: '信息技术\n木玉丽\n1-18',
    startTime: '10:25',
    endTime: '12:05',
    dayOfWeek: 4 // 周四
  },
  {
    title: '无机化学\n时东然\n11-18',
    startTime: '10:25',
    endTime: '12:05',
    dayOfWeek: 5 // 周五
  },
  {
    title: '无机化学\n时东然\n11-18',
    startTime: '14:30',
    endTime: '16:10',
    dayOfWeek: 2 // 周二
  },
  {
    title: '有机化学\n马薛姝\n11-18',
    startTime: '14:30',
    endTime: '16:10',
    dayOfWeek: 4 // 周四
  },
  {
    title: '有机化学\n马薛姝\n11-18',
    startTime: '14:30',
    endTime: '16:10',
    dayOfWeek: 6 // 周六
  },
  {
    title: '无机化学\n时东然\n11-18',
    startTime: '16:30',
    endTime: '18:10',
    dayOfWeek: 1 // 周一
  },
  {
    title: '信息技术\n木玉丽\n1-18',
    startTime: '16:30',
    endTime: '18:10',
    dayOfWeek: 3 // 周三
  },
  {
    title: '有机化学\n马薛姝\n11-18',
    startTime: '16:30',
    endTime: '18:10',
    dayOfWeek: 5 // 周五
  },
  {
    title: '无机化学\n时东然\n11-18',
    startTime: '19:30',
    endTime: '21:10',
    dayOfWeek: 2 // 周二
  },
  {
    title: '有机化学\n马薛姝\n11-18',
    startTime: '19:30',
    endTime: '21:10',
    dayOfWeek: 4 // 周四
  }
]

// 转换数据为 FullCalendar 格式
const transformEvents = (data) => {
  const events = []
  data.forEach((item) => {
    const baseDate = new Date()
    // 定位到本周对应星期几
    baseDate.setDate(baseDate.getDate() - baseDate.getDay() + item.dayOfWeek)
    const year = baseDate.getFullYear()
    const month = String(baseDate.getMonth() + 1).padStart(2, '0')
    const day = String(baseDate.getDate()).padStart(2, '0')
    const start = `${year}-${month}-${day}T${item.startTime}:00`
    const end = `${year}-${month}-${day}T${item.endTime}:00`
    events.push({
      title: item.title,
      start,
      end,
      // 按课程名称配背景色
      backgroundColor: item.title.includes('无机化学')
        ? '#B3E5FC'
        : item.title.includes('有机化学')
          ? '#C8E6C9'
          : item.title.includes('心理健康教育')
            ? '#F8BBD0'
            : item.title.includes('信息技术')
              ? '#D1C4E9'
              : '#FFE0B2',
      textColor: '#333' // 统一文字颜色
    })
  })
  return events
}

const calendarOptions = ref({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: locale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek'
  },
  // 紧凑排版：减少槽位间距
  slotMinTime: '08:25:00',

  slotMaxTime: '21:10:00',
  // 时间轴显示格式

  allDaySlot: false,
  events: transformEvents(mockCourseData),
  // 关闭默认交互（取消点击跳转、悬浮提示）
  eventClick: () => false,
  eventMouseEnter: () => {},
  // 自定义事件渲染（让内容更贴合）
  eventContent: (info) => {
    const div = document.createElement('div')
    div.style.padding = '4px'
    div.style.whiteSpace = 'pre-line' // 保留换行
    div.style.fontSize = '12px'
    div.innerHTML = info.event.title
    return { domNodes: [div] }
  },
  // 样式覆盖：紧凑布局核心配置
  views: {
    timeGridWeek: {
      slotLabelInterval: { minutes: 40 }, // 匹配45分钟课时
      columnHeaderFormat: {
        weekday: 'short',
        month: 'numeric',
        day: 'numeric'
      },
      eventTimeFormat: { hour: '2-digit', minute: '2-digit' }
    }
  },
  // 减少内外边距，让课程块更紧凑
  customButtons: {},
  eventDisplay: 'block',
  dayHeaderFormat: { weekday: 'short' },
  // 关键：覆盖 FullCalendar 默认间距
  styles: [
    `
    .fc-timegrid-cols {
      gap: 0 !important; /* 列间距 */
    }
    .fc-timegrid-slots {
      gap: 0 !important; /* 行间距 */
    }
    .fc-timegrid-event {
      margin: 2px !important; /* 课程块间距 */
      padding: 4px !important;
    }
    .fc-timegrid-axis {
      padding: 0 4px !important; /* 时间轴内边距 */
    }
    .fc-col-header-cell-cushion {
      padding: 4px 8px !important; /* 表头间距 */
    }
    `
  ]
})
</script>

<style scoped>
.course-schedule-container {
  width: 95%;
  margin: 10px auto;
}
/* 覆盖 FullCalendar 全局样式，需深度选择器 */
::v-deep .fc {
  --fc-neutral-bg-color: transparent;
  --fc-border-color: #e5e7eb;
}
::v-deep .fc-timegrid-slot-label {
  font-size: 12px;
  color: #666;
}
.course-schedule-container {
  width: 95%;
  margin: 10px auto;
  height: 700px;
  position: relative;
  z-index: 1;
}
::v-deep .fc-header-toolbar {
  padding: 8px 16px;
  border-radius: 4px 4px 0 0;
}
::v-deep .fc-button-primary {
  background-color: #dee5eb;
  background-color: #bbbcce;
  border: 0;
}

::v-deep .fc-button {
  background-color: #bbbcce;
  color: #fff;
  border: none;
}
::v-deep .fc-toolbar-title {
  color: #181e29;
  font-size: 25px;
  font-weight: 500;
  margin-left: -55px;
}
</style>

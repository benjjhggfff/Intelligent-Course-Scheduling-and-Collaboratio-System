<template>
  <div class="classroom-management-system">
    <!-- 顶部导航栏 -->

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 侧边导航 -->

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <!-- 面包屑导航 -->

        <!-- 统计卡片区域 -->
        <div class="stats-cards">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="stat-card" shadow="hover">
                <div class="card-content">
                  <div class="card-icon bg-blue">
                    <i class="fa fa-building"></i>
                  </div>
                  <div class="card-info">
                    <div class="card-title">总教室数</div>
                    <div class="card-value">{{ totalClassrooms }}</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="text-sm text-gray-500"
                    >较上月 <span class="text-green-500">+5%</span></span
                  >
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card" shadow="hover">
                <div class="card-content">
                  <div class="card-icon bg-green">
                    <i class="fa fa-check-circle"></i>
                  </div>
                  <div class="card-info">
                    <div class="card-title">可用教室</div>
                    <div class="card-value">{{ availableClassrooms }}</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="text-sm text-gray-500"
                    >较上月 <span class="text-red-500">-2%</span></span
                  >
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card" shadow="hover">
                <div class="card-content">
                  <div class="card-icon bg-yellow">
                    <i class="fa fa-calendar"></i>
                  </div>
                  <div class="card-info">
                    <div class="card-title">今日预约</div>
                    <div class="card-value">{{ todayReservations }}</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="text-sm text-gray-500"
                    >较昨日 <span class="text-green-500">+8%</span></span
                  >
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card" shadow="hover">
                <div class="card-content">
                  <div class="card-icon bg-purple">
                    <i class="fa fa-line-chart"></i>
                  </div>
                  <div class="card-info">
                    <div class="card-title">利用率</div>
                    <div class="card-value">{{ utilizationRate }}%</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="text-sm text-gray-500"
                    >较上周 <span class="text-green-500">+3%</span></span
                  >
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 可视化区域 -->
        <div class="visualization">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="chart-card" shadow="hover">
                <div class="chart-header">
                  <h3>教室类型分布</h3>
                  <el-radio-group v-model="chartTimeRange" size="small">
                    <el-radio-button label="day">今日</el-radio-button>
                    <el-radio-button label="week">本周</el-radio-button>
                    <el-radio-button label="month">本月</el-radio-button>
                  </el-radio-group>
                </div>
                <div ref="typeDistributionChart" class="chart-container"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="chart-card" shadow="hover">
                <div class="chart-header">
                  <h3>教室利用率趋势</h3>
                  <el-radio-group v-model="trendTimeRange" size="small">
                    <el-radio-button label="week">周</el-radio-button>
                    <el-radio-button label="month">月</el-radio-button>
                    <el-radio-button label="year">年</el-radio-button>
                  </el-radio-group>
                </div>
                <div ref="utilizationTrendChart" class="chart-container"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- 筛选和搜索区域 -->
        <div class="filter-search">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="selectedCampus" placeholder="选择校区">
                <el-option
                  v-for="campus in campusOptions"
                  :key="campus"
                  :label="campus"
                  :value="campus"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="selectedType" placeholder="选择类型">
                <el-option
                  v-for="type in typeOptions"
                  :key="type"
                  :label="type"
                  :value="type"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="selectedStatus" placeholder="选择状态">
                <el-option
                  v-for="status in statusOptions"
                  :key="status"
                  :label="status"
                  :value="status"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索教室名称"
                suffix-icon="el-icon-search"
              >
                <template #append>
                  <el-button @click="handleSearch">搜索</el-button>
                </template>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <!-- 教室列表 -->
        <div class="classroom-list">
          <el-card shadow="hover">
            <div class="list-header">
              <h3>教室列表</h3>
              <div class="list-actions">
                <el-button type="primary" @click="openAddClassroomDialog">
                  <i class="fa fa-plus mr-1"></i>新增教室
                </el-button>
                <el-button type="success" @click="exportData">
                  <i class="fa fa-download mr-1"></i>导出数据
                </el-button>
              </div>
            </div>
            <el-table :data="filteredClassrooms" stripe border>
              <el-table-column prop="name" label="教室名称" width="220">
                <template #default="scope">
                  <div class="flex items-center">
                    <div class="classroom-icon mr-2">
                      <i class="fa fa-graduation-cap"></i>
                    </div>
                    <span>{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="location"
                label="位置"
                width="250"
              ></el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="capacity"
                label="容量"
                width="100"
              ></el-table-column>
              <el-table-column prop="status" label="状态" width="150">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">{{
                    scope.row.status
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="utilization" label="利用率" width="290">
                <template #default="scope">
                  <el-progress
                    :percentage="scope.row.utilization"
                    :color="getProgressColor(scope.row.utilization)"
                  ></el-progress>
                  <span class="ml-2 text-sm">{{ scope.row.utilization }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="350">
                <template #default="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="viewClassroom(scope.row)"
                  >
                    <i class="fa fa-eye text-primary"></i>查看
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="reserveClassroom(scope.row)"
                  >
                    <i class="fa fa-calendar-plus-o text-success"></i>预约
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="editClassroom(scope.row)"
                  >
                    <i class="fa fa-pencil text-warning"></i>编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteClassroom(scope.row)"
                  >
                    <i class="fa fa-trash text-danger"></i>删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalClassrooms"
              ></el-pagination>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 预约教室弹窗 -->
    <el-dialog
      title="预约教室"
      v-model:visible="reservationDialogVisible"
      width="50%"
    >
      <el-form :model="reservationForm" label-width="120px">
        <el-form-item label="教室名称">
          <el-input v-model="reservationForm.classroomName" disabled></el-input>
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker
            v-model="reservationForm.date"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预约时间">
          <el-time-select
            v-model="reservationForm.startTime"
            placeholder="开始时间"
            :picker-options="{
              start: '08:00',
              step: '00:30',
              end: '22:00'
            }"
          ></el-time-select>
          <span class="mx-2">至</span>
          <el-time-select
            v-model="reservationForm.endTime"
            placeholder="结束时间"
            :picker-options="{
              start: '08:30',
              step: '00:30',
              end: '22:30'
            }"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="预约人数">
          <el-input
            v-model.number="reservationForm.peopleCount"
            type="number"
            min="1"
          ></el-input>
        </el-form-item>
        <el-form-item label="预约用途">
          <el-input
            type="textarea"
            v-model="reservationForm.purpose"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reservationDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReservation"
            >确认预约</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟数据
const classrooms = ref([
  {
    id: 1,
    name: 'CJ1-钣金车间',
    location: '库尔勒校区-实训楼1层',
    type: '实训车间',
    capacity: 80,
    status: '可用',
    utilization: 65,
    campus: '库尔勒校区'
  },
  {
    id: 2,
    name: '计算机基础实验室',
    location: '库尔勒校区-信息楼3层',
    type: '实验室',
    capacity: 60,
    status: '已预约',
    utilization: 85,
    campus: '库尔勒校区'
  },
  {
    id: 3,
    name: '多媒体大教室',
    location: '库尔勒校区-教学楼2层',
    type: '多媒体教室',
    capacity: 120,
    status: '可用',
    utilization: 45,
    campus: '库尔勒校区'
  },
  {
    id: 4,
    name: 'CJ2-电气车间',
    location: '库尔勒校区-实训楼2层',
    type: '实训车间',
    capacity: 50,
    status: '维护中',
    utilization: 10,
    campus: '库尔勒校区'
  },
  {
    id: 5,
    name: '机械加工实验室',
    location: '阿克苏校区-工程楼4层',
    type: '实验室',
    capacity: 40,
    status: '可用',
    utilization: 70,
    campus: '阿克苏校区'
  },
  {
    id: 6,
    name: '自动化控制实验室',
    location: '阿克苏校区-信息楼5层',
    type: '实验室',
    capacity: 30,
    status: '已预约',
    utilization: 90,
    campus: '阿克苏校区'
  },
  {
    id: 7,
    name: '商务谈判室',
    location: '乌鲁木齐校区-经管楼6层',
    type: '会议室',
    capacity: 20,
    status: '可用',
    utilization: 35,
    campus: '乌鲁木齐校区'
  },
  {
    id: 8,
    name: '艺术设计工作室',
    location: '乌鲁木齐校区-艺术楼2层',
    type: '工作室',
    capacity: 35,
    status: '已预约',
    utilization: 80,
    campus: '乌鲁木齐校区'
  }
])

// 筛选条件
const selectedCampus = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const searchKeyword = ref('')

// 分页控制
const currentPage = ref(1)
const pageSize = ref(10)

// 图表控制
const chartTimeRange = ref('week')
const trendTimeRange = ref('month')

// 弹窗控制
const reservationDialogVisible = ref(false)
const reservationForm = ref({
  classroomId: null,
  classroomName: '',
  date: '',
  startTime: '',
  endTime: '',
  peopleCount: 0,
  purpose: ''
})

// 计算属性
const campusOptions = computed(() => {
  const campuses = new Set()
  classrooms.value.forEach((classroom) => campuses.add(classroom.campus))
  return Array.from(campuses)
})

const typeOptions = computed(() => {
  const types = new Set()
  classrooms.value.forEach((classroom) => types.add(classroom.type))
  return Array.from(types)
})

const statusOptions = computed(() => ['可用', '已预约', '维护中'])

const filteredClassrooms = computed(() => {
  let result = [...classrooms.value]

  if (selectedCampus.value) {
    result = result.filter(
      (classroom) => classroom.campus === selectedCampus.value
    )
  }

  if (selectedType.value) {
    result = result.filter((classroom) => classroom.type === selectedType.value)
  }

  if (selectedStatus.value) {
    result = result.filter(
      (classroom) => classroom.status === selectedStatus.value
    )
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (classroom) =>
        classroom.name.toLowerCase().includes(keyword) ||
        classroom.location.toLowerCase().includes(keyword)
    )
  }

  return result
})

const totalClassrooms = computed(() => classrooms.value.length)
const availableClassrooms = computed(
  () =>
    classrooms.value.filter((classroom) => classroom.status === '可用').length
)
const todayReservations = computed(
  () =>
    // 模拟今日预约数量
    Math.floor(Math.random() * 20) + 10
)
const utilizationRate = computed(() => {
  const total = classrooms.value.length
  if (total === 0) return 0
  const sumUtilization = classrooms.value.reduce(
    (sum, classroom) => sum + classroom.utilization,
    0
  )
  return Math.round(sumUtilization / total)
})

// 图表初始化
onMounted(() => {
  initCharts()

  // 监听窗口大小变化，重新渲染图表
  window.addEventListener('resize', () => {
    initCharts()
  })
})

function initCharts() {
  nextTick(() => {
    renderTypeDistributionChart()
    renderUtilizationTrendChart()
  })
}

// 渲染教室类型分布图表
function renderTypeDistributionChart() {
  const chartDom = document.querySelector('[ref="typeDistributionChart"]')
  if (!chartDom) return

  const chart = echarts.init(chartDom)

  // 计算各类教室数量
  const typeCount = {}
  filteredClassrooms.value.forEach((classroom) => {
    typeCount[classroom.type] = (typeCount[classroom.type] || 0) + 1
  })

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: Object.keys(typeCount)
    },
    series: [
      {
        name: '教室类型',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['35%', '50%'],
        data: Object.entries(typeCount).map(([type, count]) => ({
          value: count,
          name: type
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  }

  chart.setOption(option)
}

// 渲染利用率趋势图表
function renderUtilizationTrendChart() {
  const chartDom = document.querySelector('[ref="utilizationTrendChart"]')
  if (!chartDom) return

  const chart = echarts.init(chartDom)

  // 模拟数据
  let xAxisData = []
  let yAxisData = []

  if (trendTimeRange.value === 'week') {
    xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    yAxisData = [58, 65, 72, 68, 75, 45, 30]
  } else if (trendTimeRange.value === 'month') {
    xAxisData = ['第1周', '第2周', '第3周', '第4周']
    yAxisData = [60, 68, 72, 75]
  } else {
    xAxisData = [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月'
    ]
    yAxisData = [50, 55, 60, 65, 70, 75, 72, 68, 65, 70, 75, 80]
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '利用率',
        type: 'line',
        data: yAxisData,
        smooth: true,
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0)' }
            ]
          }
        }
      }
    ]
  }

  chart.setOption(option)
}

// 辅助方法
function getStatusType(status) {
  switch (status) {
    case '可用':
      return 'success'
    case '已预约':
      return 'warning'
    case '维护中':
      return 'danger'
    default:
      return 'info'
  }
}

function getProgressColor(percentage) {
  if (percentage < 30) return '#909399'
  if (percentage < 70) return '#409EFF'
  return '#67C23A'
}

// 过滤和搜索方法
function handleSearch() {
  currentPage.value = 1
}

// 分页方法
function handleSizeChange(newSize) {
  pageSize.value = newSize
}

function handleCurrentChange(newPage) {
  currentPage.value = newPage
}

// 预约教室方法
function reserveClassroom(classroom) {
  reservationForm.value = {
    classroomId: classroom.id,
    classroomName: classroom.name,
    date: '',
    startTime: '',
    endTime: '',
    peopleCount: 0,
    purpose: ''
  }
  reservationDialogVisible.value = true
}

function submitReservation() {
  // 表单验证
  if (!reservationForm.value.date) {
    ElMessage.warning('请选择预约日期')
    return
  }

  if (!reservationForm.value.startTime || !reservationForm.value.endTime) {
    ElMessage.warning('请选择预约时间')
    return
  }

  if (reservationForm.value.startTime >= reservationForm.value.endTime) {
    ElMessage.warning('结束时间必须晚于开始时间')
    return
  }

  if (reservationForm.value.peopleCount <= 0) {
    ElMessage.warning('请输入预约人数')
    return
  }

  if (!reservationForm.value.purpose) {
    ElMessage.warning('请输入预约用途')
    return
  }

  // 模拟提交预约
  setTimeout(() => {
    reservationDialogVisible.value = false
    ElMessage.success('预约提交成功！等待管理员审核')

    // 更新教室状态
    const index = classrooms.value.findIndex(
      (c) => c.id === reservationForm.value.classroomId
    )
    if (index !== -1) {
      classrooms.value[index].status = '已预约'
    }
  }, 500)
}

function disabledDate(time) {
  return time.getTime() < Date.now() - 86400000 // 禁止选择过去的日期
}

// 其他操作方法
function openAddClassroomDialog() {
  ElMessage.info('新增教室功能开发中...')
}

function exportData() {
  ElMessage.info('导出数据功能开发中...')
}

function viewClassroom(classroom) {
  ElMessage.info(`查看教室: ${classroom.name}`)
}

function editClassroom(classroom) {
  ElMessage.info(`编辑教室: ${classroom.name}`)
}

function deleteClassroom(classroom) {
  ElMessageBox.confirm(`确定要删除教室 "${classroom.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = classrooms.value.findIndex((c) => c.id === classroom.id)
      if (index !== -1) {
        classrooms.value.splice(index, 1)
        ElMessage.success('教室删除成功')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
</script>

<style lang="scss" scoped>
/* 全局样式 */
.classroom-management-system {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .logo {
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;

    span {
      margin-right: 10px;
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background-color: #304156;
  color: white;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
}

/* 统计卡片样式 */
.stats-cards {
  margin-bottom: 20px;

  .stat-card {
    height: 140px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .card-content {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 20px;

      .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        color: white;

        i {
          font-size: 24px;
        }
      }

      .bg-blue {
        background-color: rgba(64, 158, 255, 0.2);
        color: #409eff;
      }

      .bg-green {
        background-color: rgba(103, 194, 58, 0.2);
        color: #67c23a;
      }

      .bg-yellow {
        background-color: rgba(230, 162, 60, 0.2);
        color: #e6a23c;
      }

      .bg-purple {
        background-color: rgba(114, 124, 245, 0.2);
        color: #727cf5;
      }

      .card-info {
        .card-title {
          font-size: 14px;
          color: #606266;
          margin-bottom: 5px;
        }

        .card-value {
          font-size: 28px;
          font-weight: 600;
          color: #303133;
        }
      }
    }

    .card-footer {
      padding: 10px 20px;
      border-top: 1px solid #ebeef5;
      color: #909399;
      font-size: 12px;
    }
  }
}

/* 筛选搜索区域 */
.filter-search {
  margin-bottom: 20px;

  .el-select {
    width: 100%;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-input {
    width: 100%;
  }
}

/* 可视化区域 */
.visualization {
  margin-bottom: 20px;

  .chart-card {
    height: 360px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #ebeef5;

      h3 {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }
    }

    .chart-container {
      height: calc(100% - 60px);
      padding: 20px;
    }
  }
}

/* 教室列表区域 */
.classroom-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .list-actions {
      display: flex;

      .el-button {
        margin-left: 10px;
        border-radius: 6px;
      }
    }
  }

  .el-table {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);

    th {
      background: #f8f9fc;
      color: #606266;
      font-weight: 500;
      border-bottom: 2px solid #ebeef5 !important;
    }

    td {
      border-bottom: 1px solid #f2f4f7;
      color: #555;
    }

    .classroom-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e9f2ff;
      color: #409eff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      margin-right: 8px;
    }
  }

  .progress-wrap {
    display: flex;
    align-items: center;
  }

  .el-progress {
    flex: 1;
    margin-right: 8px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .el-pagination {
      .el-pagination__total {
        color: #666;
      }

      .el-pagination__sizes,
      .el-pagination__jumper {
        margin: 0 10px;
      }

      button {
        border-radius: 6px;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}

/* 状态标签优化 */
.el-tag {
  &.el-tag--success {
    background: #e9f9ef;
    color: #67c23a;
  }
  &.el-tag--warning {
    background: #fff8e6;
    color: #e6a23c;
  }
  &.el-tag--danger {
    background: #ffe6e6;
    color: #f56c6c;
  }
}

/* 自定义工具类 */
.mr-1 {
  margin-right: 4px;
}
.mr-2 {
  margin-right: 8px;
}
.ml-2 {
  margin-left: 8px;
}
.text-primary {
  color: #409eff;
}
.text-success {
  color: #67c23a;
}
.text-warning {
  color: #e6a23c;
}
.text-danger {
  color: #f56c6c;
}
.text-sm {
  font-size: 12px;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
</style>

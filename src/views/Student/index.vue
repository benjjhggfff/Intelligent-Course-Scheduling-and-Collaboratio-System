<template>
  <div class="class-management-page">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="selectedAcademy" placeholder="选择学院">
            <el-option
              v-for="item in academyOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="selectedGrade" placeholder="选择年级">
            <el-option
              v-for="item in gradeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="selectedStatus" placeholder="选择状态">
            <el-option label="已毕业" value="已毕业" />
            <el-option label="在读" value="在读" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索班级编号/名称"
            suffix-icon="el-icon-search"
            @keyup.enter="handleSearch"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- 统计概览 -->
    <el-row :gutter="20" class="stats-row" style="margin: 20px 0">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon bg-primary">
            <i class="el-icon-s-grid"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">总班级数</div>
            <div class="stat-value">{{ totalClassCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon bg-success">
            <i class="el-icon-s-claim"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">在读班级</div>
            <div class="stat-value">{{ studyingCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon bg-danger">
            <i class="el-icon-s-finance"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">已毕业班级</div>
            <div class="stat-value">{{ graduatedCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon bg-warning">
            <i class="el-icon-s-data"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">平均容量</div>
            <div class="stat-value">{{ averageSize.toFixed(1) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 可视化图表 - 优化布局 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card-large" shadow="hover">
          <div class="chart-header">
            <span>班级分布概览</span>
            <el-radio-group v-model="chartType" size="small">
              <el-radio-button label="学院"></el-radio-button>
              <el-radio-button label="专业"></el-radio-button>
              <el-radio-button label="年级"></el-radio-button>
            </el-radio-group>
          </div>
          <BaseEchart :option="Tclassdata"></BaseEchart>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card-small" shadow="hover">
          <div class="chart-header">
            <span>班级状态占比</span>
          </div>
          <div ref="statusChart" class="chart-container"></div>
        </el-card>
        <el-card
          class="chart-card-small"
          shadow="hover"
          style="margin-top: 20px"
        >
          <div class="chart-header">
            <span>人数分布</span>
          </div>
          <div ref="sizeChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 班级列表 -->
    <el-card class="table-card" shadow="hover" style="margin-top: 20px">
      <div class="table-header">
        <span>班级列表</span>
        <el-button type="primary" size="small" style="float: right">
          <i class="el-icon-download"></i> 导出数据
        </el-button>
      </div>
      <el-table :data="filteredClasses" border style="width: 100%">
        <el-table-column prop="classNumber" label="班级编号" />
        <el-table-column prop="className" label="班级名称" />
        <el-table-column prop="faculties" label="学院" />
        <el-table-column prop="major" label="专业" />
        <el-table-column prop="cultivationLevel" label="培养层次" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === '已毕业' ? 'danger' : 'success'"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="classSize" label="班级人数" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-view"
              @click="viewDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="editClass(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalFiltered"
        style="margin-top: 20px; text-align: right"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

import { ElMessage } from 'element-plus'

// 模拟原始数据（可替换为实际接口数据）
const classData = ref([
  {
    classNumber: '18hg',
    className: '18化工班',
    classAbbreviation: '',
    academic: '三年',
    cultivationLevel: '中职',
    classCategory: '普通班级',
    counsellor: '',
    headteacher: null,
    monitor: '',
    bansuke: '',
    graduationYear: '2021',
    graduationorNot: '已毕业',
    classSize: '20',
    malefemale: null,
    maximumclassSize: '50',
    admissionYear: '2018',
    faculties: '化学与材料工程学院',
    professionalNumber: '670201',
    major: '化学工艺(中职)',
    professionalDirection: '',
    schoolDistricts: '库尔勒校区',
    fixedclassroom: '是',
    remark: '',
    headteacherPhoneNumber: null,
    headteacherNameanother: null,
    finalAcademicyear: null,
    expandTheEnrollment: null,
    academicTutor: '',
    classSchedulingType: '1',
    classSchedulingTime: '2025-03-20T12:36:50.822',
    isDelete: '1'
  },
  {
    classNumber: '20zx',
    className: '20学前教育班',
    classAbbreviation: '',
    academic: '三年',
    cultivationLevel: '中职',
    classCategory: '普通班级',
    counsellor: '',
    headteacher: null,
    monitor: '',
    bansuke: '',
    graduationYear: '2023',
    graduationorNot: '已毕业',
    classSize: '30',
    malefemale: null,
    maximumclassSize: '50',
    admissionYear: '2020',
    faculties: '教育学院',
    professionalNumber: '670101',
    major: '学前教育(中职)',
    professionalDirection: '',
    schoolDistricts: '乌鲁木齐校区',
    fixedclassroom: '是',
    remark: '',
    headteacherPhoneNumber: null,
    headteacherNameanother: null,
    finalAcademicyear: null,
    expandTheEnrollment: null,
    academicTutor: '',
    classSchedulingType: '1',
    classSchedulingTime: '2025-03-20T12:36:50.822',
    isDelete: '1'
  },
  {
    classNumber: '21nc',
    className: '21现代农业班',
    classAbbreviation: '',
    academic: '三年',
    cultivationLevel: '中职',
    classCategory: '普通班级',
    counsellor: '',
    headteacher: null,
    monitor: '',
    bansuke: '',
    graduationYear: '2024',
    graduationorNot: '在读',
    classSize: '25',
    malefemale: null,
    maximumclassSize: '50',
    admissionYear: '2021',
    faculties: '农业学院',
    professionalNumber: '610101',
    major: '现代农业经济管理',
    professionalDirection: '',
    schoolDistricts: '阿克苏校区',
    fixedclassroom: '是',
    remark: '',
    headteacherPhoneNumber: null,
    headteacherNameanother: null,
    finalAcademicyear: null,
    expandTheEnrollment: null,
    academicTutor: '',
    classSchedulingType: '1',
    classSchedulingTime: '2025-03-20T12:36:50.822',
    isDelete: '1'
  },
  {
    classNumber: '22xx',
    className: '22畜牧兽医班',
    classAbbreviation: '',
    academic: '三年',
    cultivationLevel: '中职',
    classCategory: '普通班级',
    counsellor: '',
    headteacher: null,
    monitor: '',
    bansuke: '',
    graduationYear: '2025',
    graduationorNot: '在读',
    classSize: '35',
    malefemale: null,
    maximumclassSize: '50',
    admissionYear: '2022',
    faculties: '农业学院',
    professionalNumber: '610301',
    major: '畜牧兽医',
    professionalDirection: '',
    schoolDistricts: '阿克苏校区',
    fixedclassroom: '是',
    remark: '',
    headteacherPhoneNumber: null,
    headteacherNameanother: null,
    finalAcademicyear: null,
    expandTheEnrollment: null,
    academicTutor: '',
    classSchedulingType: '1',
    classSchedulingTime: '2025-03-20T12:36:50.822',
    isDelete: '1'
  },
  {
    classNumber: '23yy',
    className: '23园艺班',
    classAbbreviation: '',
    academic: '三年',
    cultivationLevel: '中职',
    classCategory: '普通班级',
    counsellor: '',
    headteacher: null,
    monitor: '',
    bansuke: '',
    graduationYear: '2026',
    graduationorNot: '在读',
    classSize: '28',
    malefemale: null,
    maximumclassSize: '50',
    admissionYear: '2023',
    faculties: '农业学院',
    professionalNumber: '610102',
    major: '园艺技术',
    professionalDirection: '',
    schoolDistricts: '阿克苏校区',
    fixedclassroom: '是',
    remark: '',
    headteacherPhoneNumber: null,
    headteacherNameanother: null,
    finalAcademicyear: null,
    expandTheEnrollment: null,
    academicTutor: '',
    classSchedulingType: '1',
    classSchedulingTime: '2025-03-20T12:36:50.822',
    isDelete: '1'
  }
])

// 响应式数据
const selectedAcademy = ref('')
const selectedGrade = ref('')
const selectedStatus = ref('')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const chartType = ref('学院')

// 计算属性
const filteredClasses = computed(() => {
  let result = classData.value.filter((item) => {
    const academyMatch =
      !selectedAcademy.value || item.faculties === selectedAcademy.value
    const gradeMatch =
      !selectedGrade.value || item.admissionYear === selectedGrade.value
    const statusMatch =
      !selectedStatus.value || item.graduationorNot === selectedStatus.value
    const keywordMatch =
      !searchKeyword.value ||
      item.classNumber.includes(searchKeyword.value) ||
      item.className.includes(searchKeyword.value)
    return academyMatch && gradeMatch && statusMatch && keywordMatch
  })

  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const totalFiltered = computed(() => {
  return classData.value.filter((item) => {
    const academyMatch =
      !selectedAcademy.value || item.faculties === selectedAcademy.value
    const gradeMatch =
      !selectedGrade.value || item.admissionYear === selectedGrade.value
    const statusMatch =
      !selectedStatus.value || item.graduationorNot === selectedStatus.value
    const keywordMatch =
      !searchKeyword.value ||
      item.classNumber.includes(searchKeyword.value) ||
      item.className.includes(searchKeyword.value)
    return academyMatch && gradeMatch && statusMatch && keywordMatch
  }).length
})

const academyOptions = computed(() => {
  const set = new Set()
  classData.value.forEach((item) => set.add(item.faculties))
  return [...set]
})

const gradeOptions = computed(() => {
  const set = new Set()
  classData.value.forEach((item) => set.add(item.admissionYear))
  return [...set]
})

const totalClassCount = computed(() => classData.value.length)
const studyingCount = computed(
  () => classData.value.filter((item) => item.graduationorNot === '在读').length
)
const graduatedCount = computed(
  () =>
    classData.value.filter((item) => item.graduationorNot === '已毕业').length
)
const averageSize = computed(() => {
  const sizes = classData.value.map((item) => parseInt(item.classSize))
  return sizes.reduce((a, b) => a + b, 0) / sizes.length
})
import BaseEchart from '@/components/Echars/BaseEchart.vue'
// 图表初始化
onMounted(() => {
  renderMainChart()
  renderStatusChart()
  renderSizeChart()

  window.addEventListener('resize', () => {
    renderMainChart()
    renderStatusChart()
    renderSizeChart()
  })
})

// 监听图表类型变化
watch(chartType, () => {
  renderMainChart()
})
const Tclassdata = ref({})
function renderMainChart() {
  const chartDom = document.querySelector('[ref="mainChart"]')
  if (!chartDom) return
  const chart = echarts.init(chartDom)

  let dataSource = []
  let title = '班级分布'

  if (chartType.value === '学院') {
    const academyCount = {}
    classData.value.forEach((item) => {
      academyCount[item.faculties] = (academyCount[item.faculties] || 0) + 1
    })
    dataSource = Object.entries(academyCount).map(([name, value]) => ({
      name,
      value
    }))
    title = '学院分布'
  } else if (chartType.value === '专业') {
    const majorCount = {}
    classData.value.forEach((item) => {
      majorCount[item.major] = (majorCount[item.major] || 0) + 1
    })
    dataSource = Object.entries(majorCount).map(([name, value]) => ({
      name,
      value
    }))
    title = '专业分布'
  } else if (chartType.value === '年级') {
    const gradeCount = {}
    classData.value.forEach((item) => {
      gradeCount[item.admissionYear] = (gradeCount[item.admissionYear] || 0) + 1
    })
    dataSource = Object.entries(gradeCount).map(([name, value]) => ({
      name,
      value
    }))
    title = '年级分布'
  }

  Tclassdata.value = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#333',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: dataSource.map((item) => item.name)
    },
    series: [
      {
        name: '班级数量',
        type: 'pie',
        radius: ['30%', '75%'],
        center: ['40%', '50%'],
        data: dataSource,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)'
        },
        labelLine: {
          show: true
        }
      }
    ]
  }

  chart.setOption(option)
}

function renderStatusChart() {
  const chartDom = document.querySelector('[ref="statusChart"]')
  if (!chartDom) return
  const chart = echarts.init(chartDom)

  const statusCount = {
    在读: studyingCount.value,
    已毕业: graduatedCount.value
  }

  const option = {
    title: {
      text: '班级状态',
      left: 'center',
      textStyle: {
        color: '#333',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '班级状态',
        type: 'pie',
        radius: ['40%', '70%'],
        data: Object.entries(statusCount).map(([name, value]) => ({
          name,
          value
        })),
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)'
        },
        labelLine: {
          show: true
        },
        itemStyle: {
          colors: ['#67C23A', '#F56C6C']
        }
      }
    ]
  }

  chart.setOption(option)
}

function renderSizeChart() {
  const chartDom = document.querySelector('[ref="sizeChart"]')
  if (!chartDom) return
  const chart = echarts.init(chartDom)

  // 分组统计班级人数范围
  const sizeRanges = [
    { name: '1-10人', min: 1, max: 10, count: 0 },
    { name: '11-20人', min: 11, max: 20, count: 0 },
    { name: '21-30人', min: 21, max: 30, count: 0 },
    { name: '31-40人', min: 31, max: 40, count: 0 },
    { name: '41-50人', min: 41, max: 50, count: 0 }
  ]

  classData.value.forEach((item) => {
    const size = parseInt(item.classSize)
    for (const range of sizeRanges) {
      if (size >= range.min && size <= range.max) {
        range.count++
        break
      }
    }
  })

  const option = {
    title: {
      text: '班级人数分布',
      left: 'center',
      textStyle: {
        color: '#333',
        fontWeight: 'normal'
      }
    },
    xAxis: {
      type: 'category',
      data: sizeRanges.map((range) => range.name),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '班级数量',
        type: 'bar',
        data: sizeRanges.map((range) => range.count),
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }

  chart.setOption(option)
}

// 方法
function handleSearch() {
  currentPage.value = 1
}

function handleSizeChange(newSize) {
  pageSize.value = newSize
  currentPage.value = 1
}

function handleCurrentChange(newPage) {
  currentPage.value = newPage
}

function viewDetail(row) {
  ElMessage.info(`查看班级详情：${row.className}`)
  // 可在此处打开详情弹窗或新页面
}

function editClass(row) {
  ElMessage.info(`编辑班级：${row.className}`)
  // 可在此处打开编辑弹窗
}
</script>

<style lang="scss" scoped>
.class-management-page {
  padding: 20px;
  background-color: #f8f9fa;

  .filter-card {
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
  }

  .stats-row {
    .stat-card {
      background: linear-gradient(135deg, #fff 0%, #f9fafc 100%);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      transition: all 0.3s ease;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        font-size: 24px;

        &.bg-primary {
          background: rgba(64, 158, 255, 0.1);
          color: #409eff;
        }

        &.bg-success {
          background: rgba(103, 194, 58, 0.1);
          color: #67c23a;
        }

        &.bg-danger {
          background: rgba(245, 108, 108, 0.1);
          color: #f56c6c;
        }

        &.bg-warning {
          background: rgba(230, 162, 60, 0.1);
          color: #e6a23c;
        }
      }

      .stat-content {
        .stat-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
      }

      &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
    }
  }

  .chart-row {
    .chart-card-large {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      margin-bottom: 20px;
      transition: all 0.3s ease;

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        span {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .el-radio-group {
          .el-radio-button__inner {
            border-radius: 4px;
            padding: 6px 12px;
          }
        }
      }

      .chart-container {
        height: 360px;
      }

      &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
    }

    .chart-card-small {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      .chart-header {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 16px;
      }

      .chart-container {
        height: 160px;
      }

      &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .table-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    .table-header {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    // 表格样式优化
    .el-table {
      border-radius: 8px;
      overflow: hidden;

      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 500;
        border-bottom: 1px solid #ebeef5;
        padding: 12px 0;
      }

      td {
        border-bottom: 1px solid #ebeef5;
        padding: 12px 0;
        transition: all 0.2s;
      }

      // 行悬停效果
      &__row {
        &:hover {
          td {
            background-color: #fafafa !important;
          }
        }

        // 斑马纹效果
        &:nth-child(even) {
          td {
            background-color: #fcfcfc;
          }
        }
      }

      // 状态标签样式
      .el-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
    }

    // 分页样式
    .el-pagination {
      .el-pager li {
        border-radius: 4px;
        margin: 0 2px;

        &.active {
          background-color: #409eff;
          color: #fff;
        }
      }

      .btn-prev,
      .btn-next {
        border-radius: 4px;
        margin: 0 2px;
      }
    }

    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
  }

  // 响应式布局
  @media (max-width: 1024px) {
    .stats-row .el-col {
      width: 50%;
      margin-bottom: 16px;
    }

    .chart-row .el-col {
      width: 100%;
    }

    .chart-card-small {
      margin-top: 20px !important;
    }
  }

  @media (max-width: 768px) {
    .el-col {
      width: 100%;
      margin-bottom: 16px;
    }

    .stats-row .el-col {
      width: 100%;
    }

    .filter-card,
    .table-card {
      padding: 16px;
    }

    .el-table {
      font-size: 12px;
    }

    .chart-header {
      flex-direction: column;
      align-items: flex-start !important;

      .el-radio-group {
        margin-top: 10px;
      }
    }
  }

  // 动画效果
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .filter-card,
  .stat-card,
  .chart-card-large,
  .chart-card-small,
  .table-card {
    animation: fadeIn 0.3s ease-out forwards;
    opacity: 0;

    &:nth-child(1) {
      animation-delay: 0.05s;
    }
    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      animation-delay: 0.15s;
    }
    &:nth-child(4) {
      animation-delay: 0.2s;
    }
    &:nth-child(5) {
      animation-delay: 0.25s;
    }
  }
}
</style>

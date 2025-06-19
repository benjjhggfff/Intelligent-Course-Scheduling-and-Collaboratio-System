<script setup>
import { ref, computed, onMounted, reactive, watch, nextTick } from 'vue'
import Rose from '@/components/Echars/Rose.vue'
import input1 from '@/components/Input/input1.vue'
import button3 from '@/components/Buttons/button3.vue'
import BanGong from '@/assets/illustration/BanGong.vue'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElCard,
  ElTable,
  ElTableColumn,
  ElTag,
  ElPagination,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElHeader,
  ElMain,
  ElAside,
  ElMenu,
  ElSubMenu,
  ElMenuItem,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElRadioGroup,
  ElRadioButton,
  ElMessageBox,
  ElNotification,
  ElRow,
  ElCol,
  ElLoading,
  ElUpload
} from 'element-plus'
import * as echarts from 'echarts'

// 模拟课程数据 - 添加了更多课程和字段
const courseList = ref([
  {
    id: 1,
    courseNumber: '590101B0B06',
    courseName: '马克思主义基本原理',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'A类(纯理论课)',
    courseNature: '必修课',
    englishName: 'Fundamentals of Marxism',
    department: '马克思主义学院',
    enabledStatus: '是',
    creditHours: '72',
    theoreticalHours: '72',
    experimentalHours: '0',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '4',
    weeklyHours: '4',
    purelyPractical: '否',
    createTime: '2025-01-15',
    teacher: '张教授',
    courseDescription:
      '本课程系统讲解马克思主义的基本原理，包括哲学、政治经济学和科学社会主义等方面的内容。'
  },
  {
    id: 2,
    courseNumber: '590101B0B07',
    courseName: '高等数学A',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'B类(理论+实践)',
    courseNature: '必修课',
    englishName: 'Advanced Mathematics A',
    department: '理学院',
    enabledStatus: '是',
    creditHours: '64',
    theoreticalHours: '48',
    experimentalHours: '16',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3.5',
    weeklyHours: '3.5',
    purelyPractical: '否',
    createTime: '2025-02-20',
    teacher: '李教授',
    courseDescription:
      '本课程主要内容包括函数、极限、导数、积分、微分方程等数学基础知识及其应用。'
  },
  {
    id: 3,
    courseNumber: '590101B0B08',
    courseName: '大学物理',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'B类(理论+实践)',
    courseNature: '必修课',
    englishName: 'College Physics',
    department: '理学院',
    enabledStatus: '是',
    creditHours: '64',
    theoreticalHours: '48',
    experimentalHours: '16',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3.5',
    weeklyHours: '3.5',
    purelyPractical: '否',
    createTime: '2025-03-10',
    teacher: '王教授',
    courseDescription:
      '本课程涵盖力学、热学、电磁学、光学和近代物理等物理学的基本概念和规律。'
  },
  {
    id: 4,
    courseNumber: '590101B0B09',
    courseName: '程序设计基础',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'C类(纯实践课)',
    courseNature: '必修课',
    englishName: 'Fundamentals of Programming',
    department: '计算机学院',
    enabledStatus: '是',
    creditHours: '64',
    theoreticalHours: '32',
    experimentalHours: '32',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3.5',
    weeklyHours: '3.5',
    purelyPractical: '是',
    createTime: '2025-04-05',
    teacher: '赵教授',
    courseDescription:
      '本课程教授编程的基本概念和方法，包括变量、数据类型、控制结构、函数、数组等内容。'
  },
  {
    id: 5,
    courseNumber: '590101B0B10',
    courseName: '数据结构',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'B类(理论+实践)',
    courseNature: '必修课',
    englishName: 'Data Structures',
    department: '计算机学院',
    enabledStatus: '是',
    creditHours: '64',
    theoreticalHours: '48',
    experimentalHours: '16',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3.5',
    weeklyHours: '3.5',
    purelyPractical: '否',
    createTime: '2025-05-12',
    teacher: '钱教授',
    courseDescription:
      '本课程介绍常用的数据结构如链表、栈、队列、树和图等，以及它们的实现和应用。'
  },
  {
    id: 6,
    courseNumber: '590101B0B11',
    courseName: '计算机网络',
    courseCategories: '专业选修课',
    courseProperties: '选修',
    courseType: 'B类(理论+实践)',
    courseNature: '选修课',
    englishName: 'Computer Networks',
    department: '计算机学院',
    enabledStatus: '是',
    creditHours: '48',
    theoreticalHours: '32',
    experimentalHours: '16',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3',
    weeklyHours: '3',
    purelyPractical: '否',
    createTime: '2025-06-08',
    teacher: '孙教授',
    courseDescription:
      '本课程系统介绍计算机网络的基本原理、体系结构、协议和应用，包括物理层、数据链路层、网络层、传输层和应用层等内容。'
  },
  {
    id: 7,
    courseNumber: '590101B0B12',
    courseName: '数据库系统',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'B类(理论+实践)',
    courseNature: '必修课',
    englishName: 'Database Systems',
    department: '计算机学院',
    enabledStatus: '是',
    creditHours: '64',
    theoreticalHours: '40',
    experimentalHours: '24',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '4',
    weeklyHours: '4',
    purelyPractical: '否',
    createTime: '2025-07-15',
    teacher: '周教授',
    courseDescription:
      '本课程介绍数据库系统的基本概念、原理和技术，包括关系模型、SQL语言、数据库设计、查询优化、事务管理等内容。'
  },
  {
    id: 8,
    courseNumber: '590101B0B13',
    courseName: '人工智能基础',
    courseCategories: '专业选修课',
    courseProperties: '选修',
    courseType: 'B类(理论+实践)',
    courseNature: '选修课',
    englishName: 'Fundamentals of Artificial Intelligence',
    department: '计算机学院',
    enabledStatus: '否',
    creditHours: '48',
    theoreticalHours: '32',
    experimentalHours: '16',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3',
    weeklyHours: '3',
    purelyPractical: '否',
    createTime: '2025-08-20',
    teacher: '吴教授',
    courseDescription:
      '本课程介绍人工智能的基本概念、方法和应用，包括搜索算法、机器学习、神经网络、自然语言处理等内容。'
  }
])

// 主页面状态管理
const sidebarCollapsed = ref(false)
const activeMenu = ref('dashboard')
const globalSearch = ref('')
const searchForm = reactive({
  courseName: '',
  category: '',
  department: '',
  courseType: '',
  minCredits: null,
  maxCredits: null,
  sortBy: 'courseNumber',
  sortOrder: 'ascending' // 新增排序方向
})

// 分页控制
const currentPage = ref(1)
const pageSize = ref(10)
const selectedCourses = ref([]) // 选中的课程

// ECharts 相关
const distributionChart = ref(null)
const trendChart = ref(null)
const chartTimeRange = ref('month')
const trendChartType = ref('line')

// 计算属性
const departments = computed(() => {
  const deptSet = new Set()
  courseList.value.forEach((course) => deptSet.add(course.department))
  return Array.from(deptSet)
})

const coreCourseCount = computed(() => {
  return courseList.value.filter(
    (course) => course.courseCategories === '专业核心课(必修)'
  ).length
})

const totalCredits = computed(() => {
  return courseList.value.reduce((sum, course) => {
    return sum + Number(course.credits)
  }, 0)
})

const totalTheoreticalHours = computed(() => {
  return courseList.value.reduce((sum, course) => {
    return sum + Number(course.theoreticalHours)
  }, 0)
})

// 筛选后的课程列表
const filteredCourseList = computed(() => {
  let filtered = courseList.value

  // 全局搜索
  if (globalSearch.value) {
    const searchText = globalSearch.value.toLowerCase()
    filtered = filtered.filter(
      (course) =>
        course.courseName?.toLowerCase().includes(searchText) ||
        course.courseNumber?.toLowerCase().includes(searchText) ||
        course.department?.toLowerCase().includes(searchText)
    )
  }

  // 按课程名称筛选
  if (searchForm.courseName) {
    filtered = filtered.filter((course) =>
      course.courseName?.includes(searchForm.courseName)
    )
  }

  // 按课程分类筛选
  if (searchForm.category) {
    filtered = filtered.filter(
      (course) => course.courseCategories === searchForm.category
    )
  }

  // 按开课学院筛选
  if (searchForm.department) {
    filtered = filtered.filter(
      (course) => course.department === searchForm.department
    )
  }

  // 按课程类型筛选
  if (searchForm.courseType) {
    filtered = filtered.filter(
      (course) => course.courseType === searchForm.courseType
    )
  }

  // 按学分范围筛选
  if (searchForm.minCredits !== null) {
    filtered = filtered.filter(
      (course) => Number(course.credits) >= searchForm.minCredits
    )
  }
  if (searchForm.maxCredits !== null) {
    filtered = filtered.filter(
      (course) => Number(course.credits) <= searchForm.maxCredits
    )
  }

  // 排序
  if (searchForm.sortBy === 'courseNumber') {
    filtered.sort((a, b) => a.courseNumber.localeCompare(b.courseNumber))
  } else if (searchForm.sortBy === 'credits') {
    filtered.sort((a, b) =>
      searchForm.sortOrder === 'ascending'
        ? Number(a.credits) - Number(b.credits)
        : Number(b.credits) - Number(a.credits)
    )
  } else if (searchForm.sortBy === 'theoreticalHours') {
    filtered.sort((a, b) =>
      searchForm.sortOrder === 'ascending'
        ? Number(a.theoreticalHours) - Number(b.theoreticalHours)
        : Number(b.theoreticalHours) - Number(a.theoreticalHours)
    )
  } else if (searchForm.sortBy === 'createTime') {
    filtered.sort((a, b) => {
      const dateA = new Date(a.createTime)
      const dateB = new Date(b.createTime)
      return searchForm.sortOrder === 'ascending'
        ? dateA - dateB
        : dateB - dateA
    })
  }

  return filtered
})

// 当前页显示的课程
const currentPageCourseList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCourseList.value.slice(start, end)
})

// 侧边栏切换
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 搜索相关方法
const handleGlobalSearch = () => {
  currentPage.value = 1 // 重置为第一页
}

const handleAdvancedSearch = () => {
  currentPage.value = 1 // 重置为第一页
}

const resetSearchForm = () => {
  searchForm.courseName = ''
  searchForm.category = ''
  searchForm.department = ''
  searchForm.courseType = ''
  searchForm.minCredits = null
  searchForm.maxCredits = null
  searchForm.sortBy = 'courseNumber'
  searchForm.sortOrder = 'ascending'
  currentPage.value = 1 // 重置为第一页
  globalSearch.value = '' // 清空全局搜索
}

// 验证学分范围
const validateCreditRange = () => {
  if (searchForm.minCredits !== null && searchForm.maxCredits !== null) {
    if (searchForm.minCredits > searchForm.maxCredits) {
      ElNotification({
        title: '输入错误',
        message: '最小学分不能大于最大学分',
        type: 'warning',
        duration: 2000
      })
      // 交换值
      const temp = searchForm.minCredits
      searchForm.minCredits = searchForm.maxCredits
      searchForm.maxCredits = temp
    }
  }
}

// 分页相关方法
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 获取课程类型标签样式
const getCourseTypeTag = (type) => {
  if (type.includes('纯理论')) return 'info'
  if (type.includes('理论+实践')) return 'primary'
  if (type.includes('纯实践')) return 'success'
  return 'default'
}

// 表格选择变化
const handleSelectionChange = (val) => {
  selectedCourses.value = val
}

// 课程状态切换
const toggleCourseStatus = (course) => {
  const newStatus = course.enabledStatus === '是' ? '否' : '是'
  course.enabledStatus = newStatus

  // 显示提示
  ElNotification({
    title: '状态更新',
    message: `课程 "${course.courseName}" 已${newStatus === '是' ? '启用' : '禁用'}`,
    type: 'success',
    duration: 2000
  })
}

// 批量操作
const batchDelete = () => {
  if (selectedCourses.value.length === 0) {
    ElNotification({
      title: '操作提示',
      message: '请先选择要删除的课程',
      type: 'info'
    })
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedCourses.value.length} 门课程吗？`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 模拟批量删除
      const courseNames = selectedCourses.value
        .map((course) => course.courseName)
        .join('、')
      selectedCourses.value.forEach((course) => {
        const index = courseList.value.findIndex(
          (item) => item.id === course.id
        )
        if (index !== -1) {
          courseList.value.splice(index, 1)
        }
      })

      // 清空选择
      selectedCourses.value = []

      ElNotification({
        title: '批量删除成功',
        message: `已成功删除 ${courseNames} 等 ${selectedCourses.value.length} 门课程`,
        type: 'success'
      })
    })
    .catch(() => {
      // 取消操作
    })
}

const batchEnable = () => {
  if (selectedCourses.value.length === 0) {
    ElNotification({
      title: '操作提示',
      message: '请先选择要启用的课程',
      type: 'info'
    })
    return
  }

  // 批量启用
  selectedCourses.value.forEach((course) => {
    course.enabledStatus = '是'
  })

  ElNotification({
    title: '批量操作成功',
    message: `已成功启用 ${selectedCourses.value.length} 门课程`,
    type: 'success'
  })
}

const batchDisable = () => {
  if (selectedCourses.value.length === 0) {
    ElNotification({
      title: '操作提示',
      message: '请先选择要禁用的课程',
      type: 'info'
    })
    return
  }

  // 批量禁用
  selectedCourses.value.forEach((course) => {
    course.enabledStatus = '否'
  })

  ElNotification({
    title: '批量操作成功',
    message: `已成功禁用 ${selectedCourses.value.length} 门课程`,
    type: 'success'
  })
}

// 表格操作方法
const addCourse = () => {
  ElNotification({
    title: '功能开发中',
    message: '添加课程功能正在开发中',
    type: 'info'
  })
}

const editCourse = (course) => {
  ElNotification({
    title: '功能开发中',
    message: `编辑课程: ${course.courseName}`,
    type: 'info'
  })
}

const viewCourse = (course) => {
  ElNotification({
    title: '功能开发中',
    message: `查看课程: ${course.courseName}`,
    type: 'info'
  })
}

const deleteCourse = (course) => {
  ElMessageBox.confirm(`确定要删除课程 "${course.courseName}" 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = courseList.value.findIndex((item) => item.id === course.id)
      if (index !== -1) {
        courseList.value.splice(index, 1)
        ElNotification({
          title: '删除成功',
          message: `课程 "${course.courseName}" 已删除`,
          type: 'success'
        })
      }
    })
    .catch(() => {
      // 取消操作
    })
}

const exportCourses = () => {
  ElNotification({
    title: '功能开发中',
    message: '数据导出功能正在开发中',
    type: 'info'
  })
}

const importCourses = () => {
  ElNotification({
    title: '功能开发中',
    message: '数据导入功能正在开发中',
    type: 'info'
  })
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        window.location.href = '/login' // 跳转到登录页面
        ElNotification({
          title: '退出成功',
          message: '已成功退出系统',
          type: 'info'
        })
      })
      .catch(() => {
        // 取消操作
      })
  } else {
    ElNotification({
      title: '功能开发中',
      message: `${command} 功能正在开发中`,
      type: 'info'
    })
  }
}

// 初始化 ECharts 图表
onMounted(() => {
  initDistributionChart()
  initTrendChart()

  // 监听图表类型和时间范围变化，更新图表
  watch(chartTimeRange, () => {
    initDistributionChart()
  })

  watch(trendChartType, () => {
    initTrendChart()
  })

  // 监听窗口大小变化，自适应图表
  window.addEventListener('resize', () => {
    if (distributionChart.value) distributionChart.value.resize()
    if (trendChart.value) trendChart.value.resize()
  })
})

// 初始化课程分类分布图表
const initDistributionChart = () => {
  // 计算课程分类分布数据
  const categoryMap = {}
  courseList.value.forEach((course) => {
    if (categoryMap[course.courseCategories]) {
      categoryMap[course.courseCategories]++
    } else {
      categoryMap[course.courseCategories] = 1
    }
  })

  const categoryData = Object.entries(categoryMap).map(([category, count]) => ({
    value: count,
    name: category
  }))

  // 获取 DOM 元素
  const chartDom = document.querySelector('.chart-container:nth-child(1)')

  // 如果 DOM 元素不存在，延迟后再尝试
  if (!chartDom) {
    setTimeout(initDistributionChart, 300)
    return
  }

  // 初始化图表
  distributionChart.value = echarts.init(chartDom)

  // 图表配置
  const option = {
    title: {
      text: '课程分类分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
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
      data: categoryData.map((item) => item.name)
    },
    series: [
      {
        name: '课程数量',
        type: 'pie',
        radius: ['30%', '75%'],
        center: ['40%', '50%'],
        data: categoryData,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
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
        }
      }
    ]
  }

  // 应用配置
  distributionChart.value.setOption(option)
}

// 初始化课程学分趋势图表
const initTrendChart = () => {
  // 模拟月度数据
  const months = [
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
  const courseCountData = [5, 8, 12, 15, 18, 22, 25, 28, 30, 35, 38, 42]
  const totalCreditsData = [15, 25, 38, 50, 65, 80, 95, 110, 125, 140, 160, 180]

  // 获取 DOM 元素
  const chartDom = document.querySelector('.chart-container:nth-child(2)')

  // 如果 DOM 元素不存在，延迟后再尝试
  if (!chartDom) {
    setTimeout(initTrendChart, 300)
    return
  }

  // 初始化图表
  trendChart.value = echarts.init(chartDom)

  // 根据选择的图表类型设置不同的配置
  let option

  if (trendChartType.value === 'line') {
    option = {
      title: {
        text: '课程学分趋势（月度）',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['课程数量', '总学分'],
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '课程数量',
          type: 'line',
          data: courseCountData,
          smooth: true,
          itemStyle: {
            color: '#5f95ff'
          }
        },
        {
          name: '总学分',
          type: 'line',
          data: totalCreditsData,
          smooth: true,
          itemStyle: {
            color: '#f56c6c'
          }
        }
      ]
    }
  } else if (trendChartType.value === 'bar') {
    option = {
      title: {
        text: '课程学分趋势（月度）',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['课程数量', '总学分'],
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '课程数量',
          type: 'bar',
          data: courseCountData,
          itemStyle: {
            color: '#5f95ff'
          }
        },
        {
          name: '总学分',
          type: 'bar',
          data: totalCreditsData,
          itemStyle: {
            color: '#f56c6c'
          }
        }
      ]
    }
  } else if (trendChartType.value === 'radar') {
    // 为雷达图准备数据
    const radarData = [
      {
        value: [5, 8, 12, 15, 18, 22],
        name: '上半年课程数量'
      },
      {
        value: [25, 38, 50, 65, 80, 95],
        name: '上半年总学分'
      }
    ]

    option = {
      title: {
        text: '课程学分雷达图（上半年）',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        data: ['上半年课程数量', '上半年总学分'],
        top: '10%'
      },
      radar: {
        indicator: [
          { name: '1月', max: 50 },
          { name: '2月', max: 50 },
          { name: '3月', max: 50 },
          { name: '4月', max: 100 },
          { name: '5月', max: 100 },
          { name: '6月', max: 100 }
        ]
      },
      series: [
        {
          name: '课程数据对比',
          type: 'radar',
          data: radarData
        }
      ]
    }
  }

  // 应用配置
  trendChart.value.setOption(option)
}
</script>
<template>
  <div class="course-management-system">
    <div class="main-container">
      <!-- 主内容区 -->
      <el-main class="main-content" style="position: relative">
        <!-- 页面标题 -->

        <!-- 搜索和筛选区域 -->
        <el-card class="search-card">
          <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="课程名称">
              <input1
                v-model="searchForm.courseName"
                :placeholder="'请输入课程名称'"
              ></input1>
            </el-form-item>
            <el-form-item label="课程分类">
              <el-select
                v-model="searchForm.category"
                placeholder="请选择课程分类"
                filterable
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  label="专业核心课(必修)"
                  value="专业核心课(必修)"
                ></el-option>
                <el-option label="专业选修课" value="专业选修课"></el-option>
                <el-option label="公共必修课" value="公共必修课"></el-option>
                <el-option label="公共选修课" value="公共选修课"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开课学院">
              <el-select
                v-model="searchForm.department"
                placeholder="请选择学院"
                filterable
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="dept in departments"
                  :key="dept"
                  :label="dept"
                  :value="dept"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程类型">
              <el-select
                v-model="searchForm.courseType"
                placeholder="请选择课程类型"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  label="A类(纯理论课)"
                  value="A类(纯理论课)"
                ></el-option>
                <el-option
                  label="B类(理论+实践)"
                  value="B类(理论+实践)"
                ></el-option>
                <el-option
                  label="C类(纯实践课)"
                  value="C类(纯实践课)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学分范围">
              <el-input-number
                v-model="searchForm.minCredits"
                :min="0"
                :max="10"
                placeholder="最小学分"
                @change="validateCreditRange"
              ></el-input-number>
              <span class="range-separator">-</span>
              <el-input-number
                v-model="searchForm.maxCredits"
                :min="0"
                :max="10"
                placeholder="最大学分"
                @change="validateCreditRange"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="排序方式">
              <el-radio-group v-model="searchForm.sortBy">
                <el-radio-button label="courseNumber">课程编号</el-radio-button>
                <el-radio-button label="credits">学分</el-radio-button>
                <el-radio-button label="theoreticalHours"
                  >理论学时</el-radio-button
                >
                <el-radio-button label="createTime">创建时间</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <button3
                :text="'搜&nbsp索'"
                @click="handleAdvancedSearch"
                style="margin-right: 20px"
              ></button3>
              <button3 :text="'重&nbsp置'" @click="resetSearchForm"></button3>
            </el-form-item>
          </el-form>
          <BanGong></BanGong>
        </el-card>

        <!-- 数据概览卡片 -->
        <el-row :gutter="20" class="stats-cards">
          <el-col :span="6">
            <el-card class="stat-card">
              <div
                class="card-icon"
                style="background-color: rgba(95, 149, 255, 0.1)"
              >
                <i class="el-icon-s-claim" style="color: #5f95ff"></i>
              </div>
              <div class="card-content">
                <p class="card-title">总课程数</p>
                <p class="card-value animate-number">{{ courseList.length }}</p>
                <p class="card-trend">
                  <span class="trend-value">+8.2%</span>
                  <span class="trend-text">相比上月</span>
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div
                class="card-icon"
                style="background-color: rgba(245, 108, 108, 0.1)"
              >
                <i class="el-icon-s-cooperation" style="color: #f56c6c"></i>
              </div>
              <div class="card-content">
                <p class="card-title">专业核心课程</p>
                <p class="card-value animate-number">{{ coreCourseCount }}</p>
                <p class="card-trend">
                  <span class="trend-value">+3.5%</span>
                  <span class="trend-text">相比上月</span>
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div
                class="card-icon"
                style="background-color: rgba(103, 194, 58, 0.1)"
              >
                <i class="el-icon-s-data" style="color: #67c23a"></i>
              </div>
              <div class="card-content">
                <p class="card-title">总学分</p>
                <p class="card-value animate-number">
                  {{ totalCredits.toFixed(1) }}
                </p>
                <p class="card-trend">
                  <span class="trend-value">+5.7%</span>
                  <span class="trend-text">相比上月</span>
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div
                class="card-icon"
                style="background-color: rgba(230, 162, 60, 0.1)"
              >
                <i class="el-icon-s-time" style="color: #e6a23c"></i>
              </div>
              <div class="card-content">
                <p class="card-title">总理论学时</p>
                <p class="card-value animate-number">
                  {{ totalTheoreticalHours }}
                </p>
                <p class="card-trend">
                  <span class="trend-value">-1.2%</span>
                  <span class="trend-text">相比上月</span>
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 课程列表 -->
        <el-row :gutter="10">
          <el-col :span="18">
            <el-card class="course-list-card">
              <div class="card-header">
                <h3 class="card-title">课程列表</h3>
                <div class="card-actions">
                  <el-button type="primary" @click="addCourse">
                    <i class="el-icon-plus"></i> 添加课程
                  </el-button>
                  <el-button type="text" @click="exportCourses">
                    <i class="el-icon-download"></i> 导出数据
                  </el-button>
                  <el-button type="text" @click="importCourses">
                    <i class="el-icon-upload"></i> 导入数据
                  </el-button>
                </div>
              </div>

              <!-- 批量操作工具栏 -->
              <div class="batch-actions" v-if="selectedCourses.length > 0">
                <el-button type="danger" size="small" @click="batchDelete">
                  <i class="el-icon-delete"></i> 批量删除
                </el-button>
                <el-button type="primary" size="small" @click="batchEnable">
                  <i class="el-icon-check"></i> 批量启用
                </el-button>
                <el-button type="warning" size="small" @click="batchDisable">
                  <i class="el-icon-close"></i> 批量禁用
                </el-button>
                <span class="selected-count"
                  >已选择 {{ selectedCourses.length }} 门课程</span
                >
              </div>

              <el-table
                :data="currentPageCourseList"
                border
                stripe
                highlight-current-row
                class="course-table"
                @selection-change="handleSelectionChange"
                ref="courseTable"
              >
                <el-table-column type="selection" width="35"></el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  width="60"
                ></el-table-column>
                <el-table-column label="课程信息">
                  <template #header>
                    <span>课程信息</span>
                  </template>
                  <template #default="scope">
                    <div class="course-info">
                      <div class="course-name">
                        <span class="course-number">{{
                          scope.row.courseNumber
                        }}</span>
                        <span class="course-title">{{
                          scope.row.courseName || '未命名课程'
                        }}</span>
                      </div>
                      <div class="course-details">
                        <span class="course-department">{{
                          scope.row.department
                        }}</span>
                        <span class="course-category">{{
                          scope.row.courseCategories
                        }}</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="credits"
                  label="学分"
                  width="60"
                  align="center"
                ></el-table-column>
                <el-table-column label="学时" width="150">
                  <template #default="scope">
                    <div class="course-hours">
                      <span class="theoretical-hours"
                        >理论: {{ scope.row.theoreticalHours }}</span
                      >
                      <span class="experimental-hours"
                        >实验: {{ scope.row.experimentalHours }}</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="课程类型" width="120" align="center">
                  <template #default="scope">
                    <el-tag :type="getCourseTypeTag(scope.row.courseType)">{{
                      scope.row.courseType
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                  <template #default="scope">
                    <el-tag
                      :type="
                        scope.row.enabledStatus === '是' ? 'success' : 'info'
                      "
                      @click="toggleCourseStatus(scope.row)"
                      effect="dark"
                      style="cursor: pointer"
                    >
                      {{
                        scope.row.enabledStatus === '是' ? '已启用' : '未启用'
                      }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                  <template #default="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="viewCourse(scope.row)"
                    >
                      <i class="el-icon-view"></i> 查看
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="editCourse(scope.row)"
                    >
                      <i class="el-icon-edit"></i> 编辑
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="deleteCourse(scope.row)"
                    >
                      <i class="el-icon-delete"></i> 删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 空状态 -->
              <div class="empty-state" v-if="filteredCourseList.length === 0">
                <img
                  src="https://picsum.photos/id/237/200/150"
                  alt="暂无数据"
                  class="empty-image"
                />
                <p class="empty-text">暂无符合条件的课程数据</p>
                <el-button type="primary" @click="resetSearchForm"
                  >重置搜索条件</el-button
                >
              </div>

              <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredCourseList.length"
                v-if="filteredCourseList.length > 0"
              ></el-pagination>
            </el-card>
          </el-col>
          <el-col :span="6">
            <!-- 图表区域 -->

            <el-card class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title">课程分类分布</h3>
                <div class="chart-actions">
                  <el-radio-group v-model="chartTimeRange">
                    <el-radio-button label="month">本月</el-radio-button>
                    <el-radio-button label="quarter">本季度</el-radio-button>
                    <el-radio-button label="year">本年度</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="chart-container" ref="distributionChart">
                <Rose></Rose>
              </div>
            </el-card>

            <el-card class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title">课程学分趋势</h3>
                <div class="chart-actions">
                  <el-select
                    v-model="trendChartType"
                    placeholder="选择图表类型"
                  >
                    <el-option label="折线图" value="line"></el-option>
                    <el-option label="柱状图" value="bar"></el-option>
                    <el-option label="雷达图" value="radar"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="chart-container" ref="trendChart"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-select__wrapper) {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #b9bfc9;
  border-radius: 12px;
  padding: 2px 10px;
  box-shadow: 0 4px 12px rgba(7, 80, 214, 0.1);
  transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
  overflow: hidden;
}

:deep(.el-select__input) {
  flex-grow: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: sans-serif;
  font-size: 1rem;
  color: #333;
  padding: 6px 10px;
  width: 100%;
  position: relative; /* Ensure it stays above other elements */
  z-index: 2; /* Bring input to the front */
  transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-select__input)::placeholder {
  color: #888;
  font-style: italic;
}
:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}

:deep(.el-form-item__label) {
}
.course-management-system {
  height: 100vh;
  overflow: hidden;
}

.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}

:deep(.el-form-item__label) {
}
.course-management-system {
  height: 100vh;
  overflow: hidden;
}

:deep(.el-radio-button__inner) {
  background-color: #ebf6fa;
}
:deep(
  .el-radio-button.is-active
    .el-radio-button__original-radio:not(:disabled)
    + .el-radio-button__inner
) {
  background: rgb(193, 214, 250);
  border: 0;
}

.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.global-search {
  width: 200px;
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.sidebar {
  background-color: #304156;
  color: #bfcbd9;
}

.main-content {
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.range-separator {
  margin: 0 5px;
  display: inline-block;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.card-icon i {
  font-size: 24px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.card-trend {
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.trend-value {
  margin-right: 5px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-title {
  font-size: 12px;
  font-weight: 500;
}

.chart-container {
  width: 100%;
  height: calc(100% - 50px);
}

.course-list-card {
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.batch-actions {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-count {
  margin-left: auto;
  color: #909399;
}

.course-table {
  margin-bottom: 20px;
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-name {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.course-number {
  background-color: #f5f7fa;
  color: #606266;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
}

.course-title {
  font-weight: 500;
}

.course-details {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #909399;
}

.course-hours {
  display: flex;
  gap: 10px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-image {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  margin-bottom: 20px;
  color: #909399;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

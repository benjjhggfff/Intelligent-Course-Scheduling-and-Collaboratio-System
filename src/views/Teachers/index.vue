<template>
  <div class="teacher-management">
    <el-card class="filter-card">
      <template #header>
        <div class="card-header">
          <span>教师查询</span>
          <FlowerButton @click="resetFilters"></FlowerButton>
        </div>
      </template>
      <el-form :model="filters" inline>
        <el-form-item label="教师编号">
          <el-input
            v-model="filters.teacherNumber"
            placeholder="请输入教师编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="教师姓名">
          <el-input
            v-model="filters.teacherName"
            placeholder="请输入教师姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select
            v-model="filters.department"
            placeholder="请选择部门"
            clearable
          >
            <el-option
              v-for="dept in departmentOptions"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="filters.gender">
            <el-radio label="" value="">全部</el-radio>
            <el-radio :label="男" value="男">男</el-radio>
            <el-radio :label="女" value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="teacher-table-card">
          <template #header>
            <div class="card-header">
              <span>教师列表</span>
              <el-button type="success" @click="handleAdd">新增教师</el-button>
            </div>
          </template>
          <el-table
            :data="filteredTeachers"
            stripe
            highlight-current-row
            @row-click="handleRowClick"
          >
            <el-table-column
              prop="teacherNumber"
              label="教师编号"
              width="120"
            />
            <el-table-column prop="teacherName" label="教师姓名" width="140" />
            <el-table-column prop="gender" label="性别" width="80" />
            <el-table-column prop="department" label="所属部门" width="220" />
            <el-table-column prop="title" label="职称" width="120" />
            <el-table-column label="操作" width="210">
              <template #default="scope">
                <div class="" style="display: flex; padding: 10px 0px 10px 0px">
                  <button1
                    :text="'编辑'"
                    @click="handleEdit(scope.row)"
                    bcgColor="'rgb(179, 215, 240)'"
                    style="margin-right: 5px"
                  ></button1>
                  <button1
                    :text="'删除'"
                    bcgColor="'#409EFF'"
                    @click="handleDelete(scope.row)"
                  ></button1>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredTeachers.length"
            :page-sizes="[5, 10, 20]"
            :page-size="pageSize"
            v-model:current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>部门分布</span>
          </template>
          <div class="chart-container" ref="deptChartRef"></div>
        </el-card>
        <el-card class="chart-card">
          <template #header>
            <span>性别比例</span>
          </template>
          <div class="chart-container" ref="genderChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model:visible="dialogVisible" title="教师信息">
      <el-form
        :model="dialogForm"
        :rules="rules"
        ref="dialogFormRef"
        label-width="100px"
      >
        <el-form-item label="教师编号" prop="teacherNumber">
          <el-input
            v-model="dialogForm.teacherNumber"
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="教师姓名" prop="teacherName">
          <el-input v-model="dialogForm.teacherName" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="dialogForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="dialogForm.department" placeholder="请选择部门">
            <el-option
              v-for="dept in departmentOptions"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-input v-model="dialogForm.title" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTeacher">确定</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog v-model:visible="deleteDialogVisible" title="确认删除">
      <span>确定要删除该教师信息吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive, computed } from 'vue'
import button1 from '@/components/Buttons/button1.vue'
import button2 from '@/components/Buttons/button2.vue'
import FlowerButton from '@/components/Buttons/FlowerButton.vue'
import * as echarts from 'echarts'
import Massage from '@/utils/Massage'
// 模拟数据
const teachers = reactive([
  {
    teacherNumber: '0001',
    teacherName: '张三',
    gender: '男',
    englishName: 'Zhang San',
    ethnicGroup: '汉族',
    title: '教授',
    department: '计算机科学与技术学院',
    external: '否',
    facultyCategory: '专职教师'
  },
  {
    teacherNumber: '0002',
    teacherName: '李四',
    gender: '女',
    englishName: 'Li Si',
    ethnicGroup: '汉族',
    title: '副教授',
    department: '电子信息工程学院',
    external: '否',
    facultyCategory: '专职教师'
  },
  {
    teacherNumber: '0003',
    teacherName: '王五',
    gender: '男',
    englishName: 'Wang Wu',
    ethnicGroup: '汉族',
    title: '讲师',
    department: '计算机科学与技术学院',
    external: '否',
    facultyCategory: '专职教师'
  },
  {
    teacherNumber: '0004',
    teacherName: '赵六',
    gender: '男',
    englishName: 'Zhao Liu',
    ethnicGroup: '汉族',
    title: '教授',
    department: '机械工程学院',
    external: '否',
    facultyCategory: '专职教师'
  },
  {
    teacherNumber: '0005',
    teacherName: '钱七',
    gender: '女',
    englishName: 'Qian Qi',
    ethnicGroup: '汉族',
    title: '副教授',
    department: '经济管理学院',
    external: '否',
    facultyCategory: '专职教师'
  },
  {
    teacherNumber: '0006',
    teacherName: '孙八',
    gender: '男',
    englishName: 'Sun Ba',
    ethnicGroup: '汉族',
    title: '讲师',
    department: '外国语学院',
    external: '否',
    facultyCategory: '专职教师'
  },
  {
    teacherNumber: '0007',
    teacherName: '庞春林',
    gender: '男',
    englishName: '',
    ethnicGroup: '',
    title: '',
    department: '后勤管理服务中心',
    external: '否',
    facultyCategory: ''
  }
])

// 部门选项
const departmentOptions = ref([
  '计算机科学与技术学院',
  '电子信息工程学院',
  '机械工程学院',
  '经济管理学院',
  '外国语学院',
  '后勤管理服务中心'
])

// 过滤器
const filters = reactive({
  teacherNumber: '',
  teacherName: '',
  department: '',
  gender: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(5)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogForm = reactive({
  teacherNumber: '',
  teacherName: '',
  gender: '男',
  department: '',
  title: ''
})

const rules = reactive({
  teacherNumber: [
    { required: true, message: '请输入教师编号', trigger: 'blur' }
  ],
  teacherName: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
})

const dialogFormRef = ref(null)
const deleteDialogVisible = ref(false)
const currentTeacher = ref(null)

// 图表引用
const deptChartRef = ref(null)
const genderChartRef = ref(null)

// 计算属性：过滤后的教师数据
const filteredTeachers = computed(() => {
  return teachers.filter((teacher) => {
    return (
      (!filters.teacherNumber ||
        teacher.teacherNumber.includes(filters.teacherNumber)) &&
      (!filters.teacherName ||
        teacher.teacherName.includes(filters.teacherName)) &&
      (!filters.department || teacher.department === filters.department) &&
      (!filters.gender || teacher.gender === filters.gender)
    )
  })
})

// 生命周期钩子
onMounted(() => {
  initCharts()
})

// 初始化图表
const initCharts = () => {
  // 部门分布图表
  const deptChart = echarts.init(deptChartRef.value)
  const deptData = getDeptDistribution()

  deptChart.setOption({
    title: {
      text: '部门教师分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: deptData.departments
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: deptData.counts,
        type: 'bar',
        color: '#409EFF'
      }
    ]
  })

  // 性别比例图表
  const genderChart = echarts.init(genderChartRef.value)
  const genderData = getGenderDistribution()

  genderChart.setOption({
    title: {
      text: '教师性别比例',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '性别比例',
        type: 'pie',
        radius: '50%',
        data: genderData,
        color: ['#409EFF', '#E6A23C']
      }
    ]
  })

  // 监听窗口大小变化，调整图表
}

// 获取部门分布数据
const getDeptDistribution = () => {
  const deptMap = new Map()

  teachers.forEach((teacher) => {
    if (deptMap.has(teacher.department)) {
      deptMap.set(teacher.department, deptMap.get(teacher.department) + 1)
    } else {
      deptMap.set(teacher.department, 1)
    }
  })

  return {
    departments: Array.from(deptMap.keys()),
    counts: Array.from(deptMap.values())
  }
}

// 获取性别分布数据
const getGenderDistribution = () => {
  const maleCount = teachers.filter((t) => t.gender === '男').length
  const femaleCount = teachers.filter((t) => t.gender === '女').length

  return [
    { value: maleCount, name: '男' },
    { value: femaleCount, name: '女' }
  ]
}

// 搜索方法
const search = () => {
  currentPage.value = 1
}

// 重置过滤条件
const resetFilters = () => {
  filters.teacherNumber = ''
  filters.teacherName = ''
  filters.department = ''
  filters.gender = ''
  search()
}

// 分页相关方法
const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 表格行点击事件
const handleRowClick = (row) => {}

// 新增教师
const handleAdd = () => {
  dialogType.value = 'add'
  dialogForm.teacherNumber = ''
  dialogForm.teacherName = ''
  dialogForm.gender = '男'
  dialogForm.department = ''
  dialogForm.title = ''
  dialogVisible.value = true
}

// 编辑教师
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogForm.teacherNumber = row.teacherNumber
  dialogForm.teacherName = row.teacherName
  dialogForm.gender = row.gender
  dialogForm.department = row.department
  dialogForm.title = row.title
  dialogVisible.value = true
}

// 删除教师
const handleDelete = (row) => {
  currentTeacher.value = row
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  if (currentTeacher.value) {
    const index = teachers.findIndex(
      (t) => t.teacherNumber === currentTeacher.value.teacherNumber
    )
    if (index !== -1) {
      teachers.splice(index, 1)
      deleteDialogVisible.value = false
      initCharts() // 更新图表
      Massage.success('删除成功')
    }
  }
}

// 保存教师信息
const saveTeacher = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 检查教师编号是否已存在
        const exists = teachers.some(
          (t) => t.teacherNumber === dialogForm.teacherNumber
        )
        if (exists) {
          Massage.error('教师编号已存在')
          return
        }

        teachers.push({ ...dialogForm })
        Massage.success('新增成功')
      } else {
        const index = teachers.findIndex(
          (t) => t.teacherNumber === dialogForm.teacherNumber
        )
        if (index !== -1) {
          teachers.splice(index, 1, { ...dialogForm })
          Massage.success('更新成功')
        }
      }

      dialogVisible.value = false
      initCharts() // 更新图表
    } else {
      Massage.error('表单验证失败，请检查必填项')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.teacher-management {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .teacher-table-card {
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }

  .chart-card {
    margin-bottom: 20px;

    .chart-container {
      height: 250px;
    }
  }
}
</style>

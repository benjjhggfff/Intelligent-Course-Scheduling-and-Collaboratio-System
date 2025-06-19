<script setup>
import { Fold } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'

import { Setting, Bell } from '@element-plus/icons-vue'
import { ArrowRight } from '@element-plus/icons-vue'
import '@/assets/css/base.css'

import { useRoute, useRouter } from 'vue-router'

import Massage from '@/utils/Massage'
// const route = useRoute()
// const router = useRouter()
// const navArray = ref([])
// watch(
//   () => route.path,
//   (newVal, oldVal) => {
//     navArray.value = route.matched
//     console.log(navArray.value)
//   }
// )
// const goback = () => {
//   //点击了返回按钮
//   router.back()
// }

// let isFold = ref(false)
// const emit = defineEmits(['changeFold'])
// const handleMenuIconClick = () => {
//   isFold.value = !isFold.value

//   emit('changeFold', isFold.value)
// }
// 切换系统
// let isDark = ref(false)
// isDark.value = localStorage.getItem('isDark') === 'false' ? false : true
// console.log('ggg', isDark.value)

// let html = document.documentElement
// console.log('ffff', isDark.value)

// isDark.value ? (html.className = 'dark') : (html.className = '')
// const changeTheme = () => {
//   isDark.value = !isDark.value
//   html = document.documentElement
//   isDark.value ? (html.className = 'dark') : (html.className = '')
//   localStorage.setItem('isDark', isDark.value)
//   ThemeStore.getThemeStutas()
// }
// const gotoUserInfo = () => {
//   router.push('/UserInfo')
// }
// const handleCommand = (command) => {
//   if (command === 'logout') {
//     localStorage.removeItem('token')
//     router.push('/login')
//   }
// }
// const logout = async () => {
//   const res = await logoutService()
//   console.log(res)
//   if (res.code === 200) {
//     localStorage.removeItem('token')
//     Massage.success('退出成功~')
//     //清除·token
//     localStorage.removeItem('token')
//     //跳转到登录页面
//     setTimeout(() => {
//       router.push('/login')
//     }, 1500)
//   } else {
//     Massage.error('退出失败~请联系管理员')
//   }
// }
</script>

<template>
  <div class="Head">
    <div class="">
      <div class="is-fold" @click="handleMenuIconClick">
        <el-icon style="font-size: 26px"><Fold /></el-icon>
      </div>
      <div class="Breadcrumb">
        <el-breadcrumb :separator-icon="ArrowRight">
          <template v-for="(item, index) in navArray" :key="index">
            <el-breadcrumb-item :to="item.path">
              {{ item.name }}
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </div>
      <div class="SearchBar"><SearchBar></SearchBar></div>
      <div class="tools">
        <el-icon size="20px"><Bell /></el-icon>&nbsp;
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link custom-dropdown">
            <el-icon size="20px"><Setting /></el-icon>&nbsp;
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeTheme" v-if="isDark"
                >普通系统</el-dropdown-item
              >
              <el-dropdown-item @click="changeTheme" v-else
                >暗黑系统</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <span class="user-avatar custom-dropdown">
              <img
                class="user-avatar-img"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                alt=""
              />
            </span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a" @click="gotoUserInfo"
                >个人中心</el-dropdown-item
              >

              <el-dropdown-item command="b" @click="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Head {
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  top: 0;
  margin-left: -20px;
}

.user-info {
  position: absolute;
  left: 95%;
}
.logo {
  float: left;

  line-height: 60px;
}
.user-avatar-img {
  margin-top: 18px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.is-fold {
  float: left;
  height: 100%;
  line-height: 70px;
  color: #8b8989;
}
.Breadcrumb {
  float: left;
  margin-top: 20px;
  margin-left: 20px;
}
.SearchBar {
  position: absolute;
  left: 750px;
  margin-top: 10px;
}
.tools {
  position: absolute;
  right: 100px;
  font-size: 18px;
  margin-top: 25px;
  color: #8b8989;
}
</style>

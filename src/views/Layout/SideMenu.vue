<script setup>
import { ref, watch, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import {
  Document,
  Monitor,
  Menu as IconMenu,
  Location,
  User,
  Odometer
} from '@element-plus/icons-vue'

let isDark = ref(false)

//监测isdark的变化

//接收参数
defineProps({
  isFold: {
    type: Boolean,
    default: false
  }
})

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
const router = useRouter()
const handleItemClick = (path) => {
  console.log(path)
  router.push(path)
}

const sideMenu = ref([])
sideMenu.value = [
  {
    title: '系统总览',
    icon: Monitor,

    children: [
      {
        title: '物质总览',
        path: '/goods'
      },
      {
        title: '领取记录',
        path: '/orderRecord'
      },
      {
        title: '库管理',
        path: '/stock'
      },

      {
        title: '粉丝会列表',
        path: '/Fanlist'
      }
    ]
  }
]
</script>

<template>
  <div
    :class="isDark ? 'side-menu-dark' : 'side-menu-light'"
    style="position: fixed; width: 200px; height: 100vh"
  >
    <div class="side-menu">
      <div class="logo">
        <img src="../../images/eyesLogo.png" alt="" />
        <h3 class="title" v-if="!isFold" style="margin-top: 20px">
          智管有方学院智能辅助管理系统
        </h3>
      </div>
    </div>

    <div class="meun-content">
      <el-menu
        default-active="1"
        :class="isDark ? 'el-menu-vertical-demo-dark' : 'el-menu-vertical-demo'"
        :collapse="isFold"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu
          :index="index"
          v-for="(item, index) in sideMenu"
          :key="index"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>

            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(item1, index1) in item.children"
            :key="index1"
            :index="item1.path"
            @click="handleItemClick(item1.path)"
            >{{ item.children[index1].title }}</el-menu-item
          >
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  height: 92vh;
}
.el-menu-vertical-demo-dark {
  height: 92vh;
}
.logo img {
  width: 24px;
  margin-left: 20px;
  margin-top: 10px;
  float: left;
}
.side-menu {
  position: relative;
  height: 60px;
}
.side-menu .title {
  font-size: 16px;
  font-weight: 300;
  float: left;
  position: absolute;
  top: -10px;
  left: 20px;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.meun-content {
  position: fixed;
  width: 200px;
}

.side-menu-light {
  background-color: #f6fafc;
  position: fixed;
}
</style>

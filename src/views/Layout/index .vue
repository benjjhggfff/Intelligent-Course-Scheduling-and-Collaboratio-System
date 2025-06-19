<script setup>
import { ref } from 'vue'
import '@/assets/css/base.css'
import SideMenu from './SideMenu.vue'
import PageHead from './PageHead.vue'
let isfold = ref(false)
const handleMenuIconClick = (isFold) => {
  console.log('isFold', isFold)

  isfold.value = isFold
  console.log(isfold.value)
}
</script>

<template>
  <div class="/home-page">
    <div class="common-layout">
      <el-container>
        <el-aside
          :width="isfold ? '64px' : '200px'"
          style="transition: all 0.4s"
        >
          <SideMenu :isFold="isfold"></SideMenu>
        </el-aside>
        <el-container>
          <el-header style="border-bottom: 1px solid #ccc; background: #f6fafc">
            <PageHead @changeFold="handleMenuIconClick"></PageHead>
          </el-header>
          <el-main style="width: 100%">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<style lang="scss"></style>

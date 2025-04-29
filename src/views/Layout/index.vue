<script setup>
import { ref } from 'vue'
import { createApp } from 'vue'
import App from '../App.vue'
import router from '../router'

const app = createApp(App)
app.use(router)
app.mount('#app')
</script>

<template>
  <div class="">
    <router-view></router-view>
  </div>
</template>

<style lang="scss"></style>

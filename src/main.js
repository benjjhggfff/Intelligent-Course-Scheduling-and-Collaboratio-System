import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as echarts from 'echarts'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../src/assets/css/tailwind.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')

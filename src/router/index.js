import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },

    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Layout/index .vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage/index.vue')
    }
  ]
})

export default router

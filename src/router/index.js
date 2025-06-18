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
      component: () => import('../views/Layout/index .vue'),
      children: [
        {
          path: '/auto-schedule',
          name: '自动排课',
          component: () => import('../views/AutoDoCourse/index.vue')
        },
        {
          path: '/manual-schedule',
          name: '手动排课',
          component: () => import('../views/handDoCourse/index.vue')
        },
        {
          path: '/classroom',
          name: '教室管理',
          component: () => import('../views/classRoom/index.vue')
        },
        {
          path: '/teacher',
          name: '教师管理',
          component: () => import('../views/Teachers/index.vue')
        },
        {
          path: '/class',
          name: '班级管理',
          component: () => import('../views/Student/index.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage/index.vue')
    }
  ]
})

export default router

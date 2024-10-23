import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layout/layout.vue'),
      children: [
        {
          path: 'oneView',
          name: 'oneView',
          meta: { title: '例子一', requiresAuth: true },
          component: () => import('@/views/oneView.vue')
        },
        {
          path: 'twoView',
          name: 'twoView',
          meta: { title: '例子二', requiresAuth: true },
          component: () => import('@/views/twoView.vue')
        },
        {
          path: 'threeView',
          name: 'threeView',
          meta: { title: '例子三', requiresAuth: true },
          component: () => import('@/views/threeView.vue')
        },
        {
          path: 'fourView',
          name: 'fourView',
          meta: { title: '例子四', requiresAuth: true },
          component: () => import('@/views/fourView.vue')
        },
        {
          path: 'fiveView',
          name: 'fiveView',
          meta: { title: '例子五', requiresAuth: true },
          component: () => import('@/views/fiveView.vue')
        },
        {
          path: 'sixView',
          name: 'sixView',
          meta: { title: '例子六', requiresAuth: true },
          component: () => import('@/views/sixView.vue')
        }
      ]
    },
  ]
})

export default router

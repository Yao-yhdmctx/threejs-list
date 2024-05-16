import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layout/layout.vue'),
      children: [
        {
          path: 'oneView',
          name: 'oneView',
          meta: { title: '第一天' },
          component: () => import('@/views/oneView.vue')
        }
      ]
    },
  ]
})

export default router

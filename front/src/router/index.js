import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'land',
      component: () => import('@/components/Land.vue')
    },
    {
      path: '/:page(.*)*',
      name: 'page',
      component: () => import('@/components/Page.vue')
    },
    {
      path: '/:404(.*)*',
      name: '404',
      component: () => import('@/components/404.vue')
    }
  ],
})

export default router

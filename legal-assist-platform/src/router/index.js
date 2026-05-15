import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: { title: '首页', breadcrumb: ['首页'] },
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'knowledge',
        name: 'Knowledge',
        meta: { title: '法律法规知识库', breadcrumb: ['首页', '法律法规知识库'] },
        component: () => import('@/views/KnowledgeBase.vue'),
      },
      {
        path: 'process',
        name: 'Process',
        meta: { title: '标准流程工具', breadcrumb: ['首页', '标准流程执行工具'] },
        component: () => import('@/views/ProcessTool.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

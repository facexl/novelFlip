// Progress 进度条
import NProgress from 'nprogress';
// Progress 进度条样式
import 'nprogress/nprogress.css';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
//   scrollBehavior: () => ({ y: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
  routes: [
    {
      name: '/',
      path: '/',
      component: () => import('../page.vue')
    },
    {
      name: 'page',
      path: '/page',
      component: () => import('../page.vue')
    },
    {
      name: 'flip',
      path: '/flip',
      component: () => import('../flip.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  NProgress.start();
  return true
})
router.afterEach(() => {
  NProgress.done();
})

export default router

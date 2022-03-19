import Vue from 'vue'
import Router from 'vue-router'

import Layout from './components/Layout'
import Login from './view/login'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'index'
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('./view/coupon/list')
      },
      {
        path: 'ad',
        name: 'ad',
        component: () => import('./view/common/ad')
      },
      {
        path: 'user',
        component: () => import('./view/user/index')
      },
      {
        name: 'miniProgramSetting',
        path: 'miniProgramSetting',
        component: () => import('./view/setting/miniProgram'),
      },
      {
        name: 'drawConfig',
        path: 'drawConfig',
        component: () => import('./view/draw/drawConfig')
      }
    ]
  },
  {
    path: '*',
    redirect: '/dashboard',
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

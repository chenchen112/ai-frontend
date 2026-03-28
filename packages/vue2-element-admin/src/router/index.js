import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import UserManagement from '@/views/UserManagement.vue'
import RoleManagement from '@/views/RoleManagement.vue'
import PermissionManagement from '@/views/PermissionManagement.vue'
import OrderManagement from '@/views/OrderManagement.vue'
import ProductManagement from '@/views/ProductManagement.vue'
import StatisticsDashboard from '@/views/StatisticsDashboard.vue'
import ReportManagement from '@/views/ReportManagement.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/vue2-element-admin/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: '首页' }
    },
    {
      path: '/user-management',
      name: 'UserManagement',
      component: UserManagement,
      meta: { title: '用户管理' }
    },
    {
      path: '/role-management',
      name: 'RoleManagement',
      component: RoleManagement,
      meta: { title: '角色管理' }
    },
    {
      path: '/permission-management',
      name: 'PermissionManagement',
      component: PermissionManagement,
      meta: { title: '权限管理' }
    },
    {
      path: '/order-management',
      name: 'OrderManagement',
      component: OrderManagement,
      meta: { title: '订单管理' }
    },
    {
      path: '/product-management',
      name: 'ProductManagement',
      component: ProductManagement,
      meta: { title: '商品管理' }
    },
    {
      path: '/statistics-dashboard',
      name: 'StatisticsDashboard',
      component: StatisticsDashboard,
      meta: { title: '数据看板' }
    },
    {
      path: '/report-management',
      name: 'ReportManagement',
      component: ReportManagement,
      meta: { title: '报表管理' }
    }
  ]
})

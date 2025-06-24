import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
// import { apiClient } from '../api/apiClient'
import accountsRoutes from '@/app/accounts/routes'
import publicRoutes from '@/app/public/routes'
import AppLayout from '../components/AppLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
const appRoutes = [
  ...accountsRoutes,
  ...publicRoutes
]
const authMiddleWare = async (_: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (from.name != 'login' && from.name != 'login_owner') {
    try {
      next()
      return true
    } catch (e: any) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('sidebar')
      localStorage.removeItem('roles')
      next('/login')
      return false
    }
  }
  next()
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: '/dashboard',
      beforeEnter: authMiddleWare,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
        ...appRoutes
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
  ]
})

export default router

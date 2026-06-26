import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },

    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/productos',
      name: 'listado-productos',
      component: () => import('@/views/ProductosView.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/movimientos/registrar',
      name: 'registrar-movimiento',
      component: () => import('@/views/MovimientosView.vue'), 
      meta: { requiresAuth: true }
    },
    {
      path: '/movimientos/mis',
      name: 'mis-movimientos',
      component: () => import('@/views/MisMovimientosView.vue'), 
      meta: { requiresAuth: true }
    },

    {
      path: '/productos/gestion',
      name: 'gestion-productos',
      component: () => import('@/views/ProductosGestionView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('@/views/CategoriasView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: () => import('@/views/ProveedoresView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/movimientos/todos',
      name: 'todos-los-movimientos',
      component: () => import('@/views/TodosMovimientosView.vue'), 
      meta: { requiresAuth: true, roles: ['admin'] }
    }
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  const tokenActivo = localStorage.getItem('token')
  const rolActivo = authStore.userRole || localStorage.getItem('rol')

  if (tokenActivo && !authStore.token) {
    authStore.token = tokenActivo
    authStore.userRole = localStorage.getItem('rol')
    authStore.userNombre = localStorage.getItem('nombre') || ''
  }

  if (to.meta.requiresAuth && !tokenActivo) {
    return { name: 'login' }
  }

  if (to.name === 'login' && tokenActivo) {
    return { name: 'home' }
  }

  if (to.meta.roles && !to.meta.roles.includes(rolActivo)) {
    alert('Acceso denegado: Esta zona es exclusiva para administradores.')
    return { name: 'home' }
  }

  return true 
})

export default router
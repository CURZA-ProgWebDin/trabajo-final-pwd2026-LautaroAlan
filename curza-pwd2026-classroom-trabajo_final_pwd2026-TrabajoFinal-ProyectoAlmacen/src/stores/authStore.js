import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null) 
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.rol || localStorage.getItem('rol') || null)
  const userNombre = computed(() => user.value?.nombre || localStorage.getItem('nombre') || null)

  async function login(username, password) {
    loading.value = true
    try {
      const data = await authService.login(username, password)
      
      const accessToken = data.access_token
      token.value = accessToken
      localStorage.setItem('token', accessToken)

      user.value = { nombre: data.nombre, rol: data.rol }
      localStorage.setItem('nombre', data.nombre)
      localStorage.setItem('rol', data.rol)

      try {
        await fetchMe()
      } catch (corsError) {
        console.warn('CORS interceptó /me, pero el login continúa.')
      }

      return true 
    } catch (error) {
      console.error('Error en login:', error)
      logout()
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    const data = await authService.fetchMe() 
    if (data) {
      user.value = data
      localStorage.setItem('nombre', data.nombre)
      localStorage.setItem('rol', data.rol)
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('rol')
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    userRole,
    userNombre,
    login,
    fetchMe,
    logout
  }
})
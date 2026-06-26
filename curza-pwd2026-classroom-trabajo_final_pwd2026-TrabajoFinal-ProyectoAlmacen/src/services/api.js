import axios from 'axios'
import router from '@/router'
import { useToast } from "vue-toastification"

const api = axios.create({
  baseURL: 'http://localhost:5001'
})

const toast = useToast()

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.error || error.response?.data?.message || error.response?.data?.msg || "Ocurrió un error inesperado"

    switch (status) {
      case 401:
        toast.error('Sesión vencida. Iniciá sesión de nuevo.')
        localStorage.removeItem('token')
        localStorage.removeItem('nombre')
        localStorage.removeItem('rol')
        router.push('/login')
        break

      case 403:
        toast.error('Acceso denegado: No tenés permisos de administrador.')
        break

      case 409:
    console.log("Interceptor detectó 409:", message);
    toast.warning(message);
    break;

      case 400:
        toast.error(message)
        break

      default:
        toast.error('Error del servidor. Intentá más tarde.')
    }

    return Promise.reject(error)
  }
)

export default api
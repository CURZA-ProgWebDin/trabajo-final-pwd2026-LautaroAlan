import api from '@/services/api'

export const authService = {
  async login(username, password) {
    const response = await api.post('/login', { email: username, password })
    return response.data 
  },

  async fetchMe() {
    const response = await api.get('/me')
    return response.data 
  }
}
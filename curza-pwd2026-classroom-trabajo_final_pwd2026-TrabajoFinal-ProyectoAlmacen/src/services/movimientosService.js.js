import api from './api'

export const movimientosService = {
  getAll() {
    return api.get('/movimientos')
  },

  getMisMovimientos() {
    return api.get('/movimientos/mis')
  },
  
  create(data) {
    return api.post('/movimientos', data)
  }
}
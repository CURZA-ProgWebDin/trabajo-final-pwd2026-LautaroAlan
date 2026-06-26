import api from './api'

export const productosService = {
  getAll() {
    return api.get('/productos')
  },
  
  getById(id) {
    return api.get(`/productos/${id}`)
  },
  
  create(data) {
    return api.post('/productos', data)
  },
  
  update(id, data) {
    return api.put(`/productos/${id}`, data)
  },
  
  delete(id) {
    return api.delete(`/productos/${id}`)
  }
}
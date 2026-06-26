import api from './api'

export default {
  getAll() {
    return api.get('/proveedores')
  },

  create(data) {
    return api.post('/proveedores', data)
  },

  delete(id) {
    return api.delete(`/proveedores/${id}`)
  }
}
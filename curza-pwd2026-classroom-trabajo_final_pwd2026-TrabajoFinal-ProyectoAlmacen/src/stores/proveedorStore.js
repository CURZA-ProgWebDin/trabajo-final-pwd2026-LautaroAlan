import { defineStore } from 'pinia'
import api from '@/services/api' // 🌟 Importamos nuestra instancia centralizada

export const useProveedorStore = defineStore('proveedorStore', {
  state: () => ({
    proveedores: [],
    loading: false
  }),

  actions: {
    async fetchProveedores() {
      this.loading = true
      try {
        const res = await api.get('/proveedores')
        this.proveedores = res.data
      } catch (err) {
        console.error("Error al traer proveedores:", err)
      } finally {
        this.loading = false
      }
    },

    async createProveedor(proveedorData) {
      try {
        const res = await api.post('/proveedores', proveedorData)
        this.proveedores.push(res.data)
        return true
      } catch (err) {
        throw err 
      }
    },

    async updateProveedor(id, proveedorData) {
      try {
        const res = await api.put(`/proveedores/${id}`, proveedorData)
        
        const index = this.proveedores.findIndex(p => p.id === id)
        if (index !== -1) this.proveedores[index] = res.data
        return true
      } catch (err) {
        throw err
      }
    },

async deleteProveedor(id) {
  console.log("URL final a la que intento conectar:", `/proveedores/${id}`);
  
  try {
     await api.delete(`/proveedores/${id}`)
        
        this.proveedores = this.proveedores.filter(p => p.id !== id)
        return true
      } catch (err) {
        throw err 
      }
    }
  }
})
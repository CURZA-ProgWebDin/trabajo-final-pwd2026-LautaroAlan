import { defineStore } from 'pinia'
import api from '@/services/api' 

const API_URL = '/productos/'

export const useProductoStore = defineStore('productoStore', {
  state: () => ({
    productos: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProductos() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(API_URL)
        this.productos = res.data
      } catch (err) {
        console.error("Error al traer productos:", err)
        this.error = "No se pudo cargar el catálogo de productos."
      } finally {
        this.loading = false
      }
    },

    async createProducto(productoData) {
      try {
        const res = await api.post(API_URL, productoData)
        this.productos.push(res.data)
        return true
      } catch (err) {
        throw err 
      }
    },

    async updateProducto(id, productoData) {
      try {
        const res = await api.put(`${API_URL}${id}`, productoData)
        
        const index = this.productos.findIndex(p => p.id === id)
        if (index !== -1) this.productos[index] = res.data
        return true
      } catch (err) {
        throw err
      }
    },

    async deleteProducto(id) {
      try {
        await api.delete(`${API_URL}${id}`)
        
        this.productos = this.productos.filter(p => p.id !== id)
        return true
      } catch (err) {
        throw err
      }
    },

    actualizarStockLocal(productoId, tipo, cantidad) {
      const producto = this.productos.find(p => p.id === productoId)
      if (producto) {
        if (tipo === 'entrada') {
          producto.stock_actual += cantidad
        } else if (tipo === 'salida') {
          producto.stock_actual -= cantidad
        }
      }
    }
  }
})
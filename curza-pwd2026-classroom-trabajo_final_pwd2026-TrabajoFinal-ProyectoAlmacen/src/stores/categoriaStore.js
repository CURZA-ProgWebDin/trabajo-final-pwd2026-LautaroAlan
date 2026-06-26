import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore'
import api from '@/services/api'

const API_URL = 'http://localhost:5001/categorias'

export const useCategoriaStore = defineStore('categoria', {
  state: () => ({
    categorias: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCategorias() {
      this.loading = true
      try {
        const authStore = useAuthStore()
        const res = await axios.get(`${API_URL}/`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.categorias = res.data
      } catch (err) {
        this.error = 'Error al cargar las categorías.'
      } finally {
        this.loading = false
      }
    },

    async createCategoria(categoriaData) {
      try {
        const authStore = useAuthStore()
        const res = await axios.post(`${API_URL}/`, categoriaData, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.categorias.push(res.data)
        return true
      } catch (err) {
        throw err.response?.data?.error || 'Error al crear la categoría.'
      }
    },

    async updateCategoria(id, categoriaData) {
      try {
        const authStore = useAuthStore()
        const res = await axios.put(`${API_URL}/${id}`, categoriaData, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        const index = this.categorias.findIndex(c => c.id === id)
        if (index !== -1) this.categorias[index] = res.data
        return true
      } catch (err) {
        throw err.response?.data?.error || 'Error al actualizar la categoría.'
      }
    },



async deleteCategoria(id) {
  try {
    await api.delete(`/categorias/${id}`);
    this.categorias = this.categorias.filter(c => c.id !== id);
    return true;
  } catch (error) {
    throw error; 
  }
}
  }
})
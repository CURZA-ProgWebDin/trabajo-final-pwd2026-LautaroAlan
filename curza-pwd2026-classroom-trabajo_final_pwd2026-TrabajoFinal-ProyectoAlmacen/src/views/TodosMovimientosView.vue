<template>
  <div class="historial-container">
    <h2>🛡️ Auditoría Global de Movimientos (Solo Admin)</h2>
    <p class="subtitle">Historial completo de entradas y salidas de todo el sistema.</p>

    <div v-if="errorMsg" class="alert error">{{ errorMsg }}</div>
    <div v-if="loading" class="loading-text">Cargando auditoría global...</div>

    <div v-else class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario ID</th>
            <th>Producto ID</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Motivo / Descripción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in movimientos" :key="mov.id">
            <td>#{{ mov.id }}</td>
            <td class="user-id">👤 {{ mov.usuario_id || 'Sistema' }}</td>
            <td>{{ mov.producto_id }}</td>
            <td>
              <span :class="['badge', mov.tipo]">
                {{ mov.tipo === 'entrada' ? '🟩 Entrada' : '🟥 Salida' }}
              </span>
            </td>
            <td class="cantidad-celda">{{ mov.cantidad }}</td>
            <td>{{ mov.motivo }}</td>
          </tr>
          <tr v-if="movimientos.length === 0">
            <td colspan="6" class="no-data">No hay registros de movimientos en el sistema.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const movimientos = ref([])
const loading = ref(false)
const errorMsg = ref('')

const cargarTodosLosMovimientos = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const response = await api.get('/movimientos/')
    movimientos.value = response.data
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Error de privilegios o conexión al intentar auditar los movimientos.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarTodosLosMovimientos()
})
</script>

<style scoped>
.historial-container { max-width: 1100px; margin: 2rem auto; padding: 2rem; background-color: #1e1e1e; color: #e0e0e0; border-radius: 8px; }
h2 { color: #ff9800; margin-bottom: 0.5rem; }
.subtitle { color: #a0a0a0; margin-bottom: 1.5rem; font-size: 0.95rem; }
.loading-text { color: #ff9800; font-weight: bold; text-align: center; padding: 2rem; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; margin-top: 1rem; text-align: left; }
.data-table th, .data-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #333; }
.data-table th { background-color: #2a2a2a; color: #fff; font-weight: bold; }
.data-table tr:hover { background-color: #252525; }
.user-id { color: #00bcd4; font-size: 0.9rem; }
.badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: bold; display: inline-block; }
.badge.entrada { background-color: rgba(76, 175, 80, 0.15); color: #81c784; }
.badge.salida { background-color: rgba(244, 67, 54, 0.15); color: #e57373; }
.cantidad-celda { font-weight: bold; }
.no-data { text-align: center; color: #888; padding: 2rem; }
.alert.error { padding: 0.75rem; background-color: rgba(244, 67, 54, 0.2); border: 1px solid #f44336; color: #e57373; border-radius: 4px; margin-bottom: 1rem; }
</style>
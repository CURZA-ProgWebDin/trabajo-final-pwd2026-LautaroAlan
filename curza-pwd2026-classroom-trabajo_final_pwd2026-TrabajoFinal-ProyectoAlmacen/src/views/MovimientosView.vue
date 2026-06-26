<template>
  <div class="movimientos-container">
    <h2>📦 Registrar Movimiento de Stock</h2>
    <p class="subtitle">Cargar entradas o salidas de mercadería del inventario.</p>

    <form @submit.prevent="handleRegistrar" class="movimiento-form">
      
      <div v-if="mensajeExito" class="alert success">{{ mensajeExito }}</div>
      <div v-if="mensajeError" class="alert error">{{ mensajeError }}</div>

      <div class="form-group">
        <label for="producto">Seleccionar Producto:</label>
        <select id="producto" v-model="form.producto_id" required>
          <option value="" disabled>-- Seleccione un producto --</option>
          <option v-for="prod in productoStore.productos" :key="prod.id" :value="prod.id">
            {{ prod.nombre }} (Stock actual: {{ prod.stock_actual }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Tipo de Operación:</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="entrada" v-model="form.tipo" />
            🟩 Entrada (Suma al stock)
          </label>
          <label class="radio-label">
            <input type="radio" value="salida" v-model="form.tipo" />
            🟥 Salida (Resta al stock)
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="cantidad">Cantidad:</label>
        <input 
          type="number" 
          id="cantidad" 
          v-model.number="form.cantidad" 
          min="1" 
          required 
        />
      </div>

      <div class="form-group">
        <label for="motivo">Motivo / Descripción:</label>
        <textarea 
          id="motivo" 
          v-model="form.motivo" 
          rows="3" 
          placeholder="Ej: Compra a proveedor / Ajuste por rotura" 
          required
        ></textarea>
      </div>

      <button type="submit" :disabled="loading" class="btn-submit">
        {{ loading ? 'Procesando...' : 'Confirmar Movimiento' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductoStore } from '@/stores/productoStore'
import api from '@/services/api'
import { useToast } from "vue-toastification";
const toast = useToast();

const productoStore = useProductoStore()

const form = ref({
  tipo: 'entrada',
  cantidad: 0,
  motivo: '',
  producto_id: ''
})

const loading = ref(false)
const mensajeExito = ref('')
const mensajeError = ref('')

const productoSeleccionado = computed(() => {
  return productoStore.productos.find(p => p.id === form.value.producto_id)
})

onMounted(async () => {
  if (productoStore.productos.length === 0) {
    await productoStore.fetchProductos()
  }
})

const handleRegistrar = async () => {
  mensajeExito.value = ''
  mensajeError.value = ''

  if (form.value.tipo === 'salida' && productoSeleccionado.value) {
    if (form.value.cantidad > productoSeleccionado.value.stock_actual) {
      const continuar = confirm(
        `⚠️ ADVERTENCIA DE STOCK:\nLa cantidad solicitada (${form.value.cantidad}) supera el stock disponible (${productoSeleccionado.value.stock_actual}).\n\n¿Desea continuar con la operación de todos modos?`
      )
      if (!continuar) return
    }
  }

  try {
    loading.value = true

    await api.post('/movimientos/', form.value)

    if (productoSeleccionado.value) {
      if (form.value.tipo === 'entrada') {
        productoSeleccionado.value.stock_actual += form.value.cantidad
      } else if (form.value.tipo === 'salida') {
        productoSeleccionado.value.stock_actual -= form.value.cantidad
      }
    }

    mensajeExito.value = '🎉 ¡Movimiento registrado con éxito y stock actualizado!'
    
    form.value = { tipo: 'entrada', cantidad: 0, motivo: '', producto_id: '' }

  } catch (err) {
    console.error(err)
    mensajeError.value = err.response?.data?.error || 'Error al intentar registrar el movimiento.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.movimientos-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
h2 { color: #4caf50; margin-bottom: 0.5rem; }
.subtitle { color: #a0a0a0; margin-bottom: 1.5rem; font-size: 0.95rem; }
.movimiento-form { display: flex; flex-direction: column; gap: 1.2rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-weight: bold; font-size: 0.9rem; }
select, input, textarea {
  padding: 0.75rem;
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  color: #ffffff;
  border-radius: 4px;
}
select:focus, input:focus, textarea:focus { outline: none; border-color: #4caf50; }
.radio-group { display: flex; gap: 1.5rem; }
.radio-label { cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.btn-submit {
  background-color: #4caf50; color: white; border: none; padding: 0.75rem;
  font-weight: bold; border-radius: 4px; cursor: pointer; transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) { background-color: #45a049; }
.btn-submit:disabled { background-color: #555; cursor: not-allowed; }
.alert { padding: 0.75rem; border-radius: 4px; font-size: 0.9rem; font-weight: bold; }
.alert.success { background-color: rgba(76, 175, 80, 0.2); border: 1px solid #4caf50; color: #81c784; }
.alert.error { background-color: rgba(244, 67, 54, 0.2); border: 1px solid #f44336; color: #e57373; }
</style>
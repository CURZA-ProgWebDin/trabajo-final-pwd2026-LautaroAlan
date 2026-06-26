<template>
  <div class="productos-container">
    <header class="page-header">
      <h2>⚙️ Panel de Gestión de Productos (ABM)</h2>
      <router-link to="/" class="btn-back">⬅️ Volver al Home</router-link>
    </header>

    <div class="grid-layout">
<section v-if="isAdmin" class="card form-card" :class="{ 'mode-edit': editandoId }">
  <h3>{{ editandoId ? '✏️ Editar Producto' : '➕ Nuevo Producto' }}</h3>
  <form @submit.prevent="procesarFormulario">
    
    <div class="form-group">
      <label>Nombre del Producto</label>
      <input v-model="form.nombre" type="text" required />
    </div>

    <div class="form-group">
      <label>Categoría</label>
      <select v-model="form.categoria_id" required>
        <option value="" disabled>Seleccione una categoría</option>
        <option v-for="cat in categoriaStore.categorias" :key="cat.id" :value="cat.id">
          {{ cat.nombre }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>Proveedor</label>
      <select v-model="form.proveedor_id" required>
        <option value="" disabled>Seleccione un proveedor</option>
        <option v-for="prov in proveedorStore.proveedores" :key="prov.id" :value="prov.id">
          {{ prov.nombre }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>Precio ($)</label>
      <input v-model.number="form.precio" type="number" step="0.01" min="0" required />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Stock Actual</label>
        <input v-model.number="form.stock_actual" type="number" min="0" :disabled="!!editandoId" required />
      </div>
      <div class="form-group">
        <label>Stock Mínimo</label>
        <input v-model.number="form.stock_minimo" type="number" min="0" required />
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-submit">
        {{ editandoId ? '💾 Guardar Cambios' : 'Cargar en Catálogo' }}
      </button>
      <button v-if="editandoId" type="button" @click="cancelarEdicion" class="btn-cancel">
        Cancelar
      </button>
    </div>
  </form>
</section>

      <section class="card list-card">
        <h3>Listado de Control</h3>
        <div v-if="productoStore.error" class="error-msg">⚠️ {{ productoStore.error }}</div>

        <table v-if="productoStore.productos.length > 0" class="custom-table">
  <thead>
    <tr>
      <th>Producto</th>
      <th>Precio</th>
      <th>Stock</th>
      <th v-if="isAdmin">Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="prod in productoStore.productos" :key="prod.id" :class="{ 'stock-alert-row': prod.stock_actual <= prod.stock_minimo }">
      <td>
        <span class="bold-text">{{ prod.nombre }}</span>
        <div class="id-subtext">{{ prod.categoria?.nombre || 'Sin cat.' }} | {{ prod.proveedor?.nombre || 'Sin prov.' }}</div>
      </td>
      <td class="price-text">${{ prod.precio }}</td>
      <td>
        {{ prod.stock_actual }}
        <span v-if="prod.stock_actual <= prod.stock_minimo" class="badge-alert">⚠️ REPOSICIÓN</span>
      </td>
      
      <td v-if="isAdmin" class="actions-cell">
        <button @click="activarEdicion(prod)" class="btn-edit-table" title="Editar">✏️</button>
        <button @click="eliminar(prod.id)" class="btn-delete" title="Eliminar">🗑️</button>
      </td>
    </tr>
  </tbody>
</table>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProductoStore } from '@/stores/productoStore'
import { useCategoriaStore } from '@/stores/categoriaStore'
import { useProveedorStore } from '@/stores/proveedorStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from "vue-toastification";

const toast = useToast();
const productoStore = useProductoStore()
const categoriaStore = useCategoriaStore()
const proveedorStore = useProveedorStore()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.user?.rol === 'admin')
const editandoId = ref(null)
const form = ref({ nombre: '', categoria_id: '', proveedor_id: '', precio: 0, stock_actual: 0, stock_minimo: 5 })

const activarEdicion = (prod) => {
  editandoId.value = prod.id
  form.value = { 
    ...prod, 
    categoria_id: prod.categoria?.id, 
    proveedor_id: prod.proveedor?.id,
    precio: prod.precio_venta 
  }
}

const cancelarEdicion = () => {
  editandoId.value = null
  form.value = { nombre: '', categoria_id: '', proveedor_id: '', precio: 0, stock_actual: 0, stock_minimo: 5 }
}

const procesarFormulario = async () => {
  try {
    const datosAEnviar = {
      nombre: form.value.nombre,
      categoria_id: form.value.categoria_id,
      proveedor_id: form.value.proveedor_id,
      stock_actual: form.value.stock_actual,
      stock_minimo: form.value.stock_minimo,
      precio_venta: form.value.precio, 
      precio_costo: 0 
    };

    if (editandoId.value) {
      await productoStore.updateProducto(editandoId.value, datosAEnviar)
      toast.success("¡Producto actualizado correctamente!")
    } else {
      await productoStore.createProducto(datosAEnviar)
      toast.success("¡Producto creado con éxito!")
    }
    cancelarEdicion()
  } catch (err) {
  }
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    try {
      await productoStore.deleteProducto(id)
      toast.success("Producto eliminado del sistema")
    } catch (err) {
    }
  }
}

onMounted(() => {
  productoStore.fetchProductos()
  categoriaStore.fetchCategorias()
  proveedorStore.fetchProveedores()
})
</script>

<style scoped>

.grid-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; padding: 20px; }
.card { background: #1f1f1f; padding: 20px; border-radius: 8px; border: 1px solid #333; }
.custom-table { width: 100%; border-collapse: collapse; color: white; }
.custom-table th, .custom-table td { padding: 12px; border-bottom: 1px solid #333; text-align: left; }
.badge-alert {
  background-color: #e06c75;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 8px;
  text-transform: uppercase;
}
.min-stock {
  color: #888;
  font-size: 0.85rem;
}

.stock-alert-row { background-color: rgba(224, 108, 117, 0.2) !important; }
.badge-alert { color: #e06c75; font-weight: bold; margin-left: 10px; font-size: 0.8rem; }
.min-stock { color: #888; font-size: 0.85rem; }
.form-group { margin-bottom: 15px; }
.form-group input, .form-group select { width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; color: white; border-radius: 4px; }
.btn-submit { background: #42b883; color: black; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; }
.btn-edit-table, .btn-delete { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
.productos-container {
    padding: 20px;
    background-color: #121212;
    min-height: 100vh;
    color: white;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.grid-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; }
.card { background: #1f1f1f; padding: 20px; border-radius: 8px; border: 1px solid #333; }


</style>
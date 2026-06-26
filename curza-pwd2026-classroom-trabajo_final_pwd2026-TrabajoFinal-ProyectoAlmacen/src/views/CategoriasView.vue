<script setup>
import { ref, onMounted } from 'vue'
import { useCategoriaStore } from '@/stores/categoriaStore'
import { useToast } from "vue-toastification";

const toast = useToast();
const categoriaStore = useCategoriaStore()

const form = ref({
  id: null,
  nombre: '',
  descripcion: ''
})

const editando = ref(false)

onMounted(() => {
  categoriaStore.fetchCategorias()
})

const prepararEdicion = (categoria) => {
  editando.value = true
  form.value = { ...categoria }
}

const cancelarFormulario = () => {
  editando.value = false
  form.value = { id: null, nombre: '', descripcion: '' }
}

const guardarCategoria = async () => {
  try {
    if (editando.value) {
      await categoriaStore.updateCategoria(form.value.id, {
        nombre: form.value.nombre,
        descripcion: form.value.descripcion
      })
      toast.success("Categoría actualizada con éxito")
    } else {
      await categoriaStore.createCategoria({
        nombre: form.value.nombre,
        descripcion: form.value.descripcion
      })
      toast.success("Categoría creada correctamente")
    }
    cancelarFormulario()
  } catch (error) {
    // El error se maneja en el store/api
  }
}

const elminarCategoriaClick = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
    try {
      await categoriaStore.deleteCategoria(id)
      toast.success("Categoría eliminada del sistema")
    } catch (error) {
    }
  }
}
</script>

<template>
  <div class="categorias-container">
    <header class="page-header">
      <h2>📁 Gestión de Categorías</h2>
    </header>

    <div class="grid-layout">
      <section class="card form-card">
        <h3>{{ editando ? '✏️ Editar Categoría' : '➕ Nueva Categoría' }}</h3>
        <form @submit.prevent="guardarCategoria">
          
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.nombre" type="text" required />
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="form.descripcion"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">
              {{ editando ? '💾 Actualizar' : 'Guardar' }}
            </button>
            <button v-if="editando" type="button" @click="cancelarFormulario" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="card list-card">
        <h3>Categorías Registradas</h3>
        
        <p v-if="categoriaStore.loading" class="empty-msg">Cargando...</p>
        
        <table v-else class="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categoriaStore.categorias" :key="cat.id">
              <td>{{ cat.id }}</td>
              <td>{{ cat.nombre }}</td>
              <td class="actions-cell">
                <button @click="prepararEdicion(cat)" class="btn-edit-table" title="Editar">✏️</button>
                <button @click="elminarCategoriaClick(cat.id)" class="btn-delete" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<style scoped>
.categorias-container { padding: 30px; background-color: #1a1a1a; min-height: 100vh; color: #fff; font-family: sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
.page-header h2 { color: #42b883; margin: 0; }
.grid-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; }
@media (max-width:950px) { .grid-layout { grid-template-columns: 1fr; } }
.card { background: #242424; padding: 25px; border-radius: 8px; border: 1px solid #333; }
.card h3 { margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px; color: #e5c07b; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; color: #ccc; }
.form-group input, .form-group textarea { width: 100%; padding: 10px; background: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: white; box-sizing: border-box; }
.form-actions { display: flex; gap: 10px; }
.btn-submit { flex: 1; background: #42b883; color: #1a1a1a; font-weight: bold; border: none; padding: 12px; border-radius: 4px; cursor: pointer; }
.btn-cancel { background: #444; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; }
.custom-table { width: 100%; border-collapse: collapse; }
.custom-table th, .custom-table td { padding: 12px; border-bottom: 1px solid #333; text-align: left; }
.custom-table th { background: #1a1a1a; color: #42b883; }
.actions-cell { display: flex; gap: 10px; }
.btn-edit-table, .btn-delete { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 5px; border-radius: 4px; }
.btn-edit-table:hover { background: rgba(229,192,123,.2); }
.btn-delete:hover { background: rgba(224,108,117,.2); }
.empty-msg { color: #888; text-align: center; }
</style>
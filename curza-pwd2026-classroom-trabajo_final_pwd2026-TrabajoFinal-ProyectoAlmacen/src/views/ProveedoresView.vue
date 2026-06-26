<template>
  <div class="proveedores-container">
    <header class="page-header">
      <h2>🤝 Gestión de Proveedores (Admin)</h2>
      <router-link to="/" class="btn-back">⬅️ Volver al Home</router-link>
    </header>

    <div class="grid-layout">
      <section class="card form-card" :class="{ 'mode-edit': editandoId }">
        <h3>{{ editandoId ? '✏️ Editar Proveedor' : 'Nuevo Proveedor' }}</h3>
        <form @submit.prevent="procesarFormulario">
          <div class="form-group">
            <label for="nombre">Nombre / Razón Social</label>
            <input v-model="form.nombre" type="text" id="nombre" required />
          </div>
          <div class="form-group">
            <label for="contacto">Persona de Contacto</label>
            <input v-model="form.contacto" type="text" id="contacto" />
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input v-model="form.telefono" type="text" id="telefono" />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input v-model="form.email" type="email" id="email" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">
              {{ editandoId ? '💾 Actualizar' : '➕ Guardar' }}
            </button>
            <button v-if="editandoId" type="button" @click="cancelarEdicion" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="card list-card">
        <h3>Proveedores Aliados</h3>
        
        <div v-if="store.error" class="error-msg">⚠️ {{ store.error }}</div>

        <table v-if="store.proveedores.length > 0" class="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Enlace</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prov in store.proveedores" :key="prov.id">
              <td class="bold-text">🏢 {{ prov.nombre }}</td>
              <td class="contact-name">👤 {{ prov.contacto || '---' }}</td>
              <td>
                <div class="contact-info">📞 {{ prov.telefono || '---' }}</div>
                <div class="contact-subtext">✉️ {{ prov.email || '---' }}</div>
              </td>
              <td class="actions-cell">
                <button @click="activarEdicion(prov)" class="btn-edit-table" title="Editar">✏️</button>
                <button @click="eliminar(prov.id)" class="btn-delete" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else-if="!store.loading" class="empty-msg">No hay proveedores registrados.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProveedorStore } from '@/stores/proveedorStore'
import { useToast } from "vue-toastification";

const toast = useToast();
const store = useProveedorStore()
const editandoId = ref(null)

const form = ref({ nombre: '', contacto: '', telefono: '', email: '' })

const activarEdicion = (prov) => {
  editandoId.value = prov.id
  form.value = { nombre: prov.nombre, contacto: prov.contacto, telefono: prov.telefono, email: prov.email }
}

const cancelarEdicion = () => {
  editandoId.value = null
  form.value = { nombre: '', contacto: '', telefono: '', email: '' }
}

const procesarFormulario = async () => {
  try {
    if (editandoId.value) {
      await store.updateProveedor(editandoId.value, { ...form.value })
      toast.success("Proveedor actualizado correctamente")
    } else {
      await store.createProveedor({ ...form.value })
      toast.success("Proveedor creado con éxito")
    }
    cancelarEdicion()
  } catch (err) {
  }
}

const eliminar = async (id) => {
  if (confirm('¿Deseas dar de baja este proveedor?')) {
    try {
      await store.deleteProveedor(id)
      toast.success("Proveedor eliminado del sistema")
    } catch (err) {
    }
  }
}

onMounted(() => {
  store.fetchProveedores()
})
</script>

<style scoped>
.proveedores-container { padding: 30px; background-color: #1a1a1a; min-height: 100vh; color: #fff; font-family: sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
.page-header h2 { color: #42b883; margin: 0; }
.btn-back { color: #aaa; text-decoration: none; font-size: 0.9rem; padding: 8px 12px; border: 1px solid #444; border-radius: 4px; transition: 0.2s; }
.btn-back:hover { background-color: #333; color: #fff; }
.grid-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; }
@media (max-width: 950px) { .grid-layout { grid-template-columns: 1fr; } }
.card { background-color: #242424; padding: 25px; border-radius: 8px; border: 1px solid #333; }
.form-card.mode-edit { border-color: #e5c07b; }
.card h3 { margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px; color: #e5c07b; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-size: 0.9rem; color: #ccc; }
.form-group input { width: 100%; padding: 10px; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: white; box-sizing: border-box; }
.form-group input:focus { border-color: #42b883; outline: none; }
.form-actions { display: flex; gap: 10px; }
.btn-submit { flex: 1; background-color: #42b883; color: #1a1a1a; font-weight: bold; border: none; padding: 12px; border-radius: 4px; cursor: pointer; transition: 0.2s; }
.btn-submit:hover { background-color: #33a06f; }
.btn-cancel { background-color: #444; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; }
.btn-cancel:hover { background-color: #555; }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; }
.custom-table th, .custom-table td { padding: 12px; border-bottom: 1px solid #333; }
.custom-table th { background-color: #1a1a1a; color: #42b883; }
.bold-text { font-weight: bold; color: #fff; }
.contact-name { color: #e5c07b; font-style: italic; }
.contact-info { font-size: 0.95rem; color: #fff; }
.contact-subtext { font-size: 0.85rem; color: #aaa; margin-top: 2px; }
.actions-cell { display: flex; gap: 10px; }
.btn-edit-table, .btn-delete { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 5px; border-radius: 4px; transition: 0.2s; }
.btn-edit-table:hover { background-color: rgba(229, 192, 123, 0.2); }
.btn-delete:hover { background-color: rgba(224, 108, 117, 0.2); }
.error-msg { background-color: rgba(224, 108, 117, 0.1); color: #e06c75; padding: 10px; border-radius: 4px; margin-bottom: 15px; border: 1px solid #e06c75; font-weight: bold; }
.empty-msg { color: #888; text-align: center; font-style: italic; margin-top: 20px; }
</style>
<template>
  <div class="productos-container">
    <header class="page-header">
      <h2>📋 Catálogo General de Productos</h2>
      <router-link to="/" class="btn-back">⬅️ Volver al Home</router-link>
    </header>

    <section class="card list-card">
      <h3>Artículos en Existencia</h3>
      <div v-if="productoStore.error" class="error-msg">⚠️ {{ productoStore.error }}</div>

      <div class="table-responsive">
        <table v-if="productoStore.productos.length > 0" class="custom-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Precio</th>
              <th>Stock Actual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in productoStore.productos" 
                :key="prod.id"
                :class="{ 'stock-alert-row': prod.stock_actual <= prod.stock_minimo }">
              <td>
                <span class="bold-text">{{ prod.nombre }}</span>
                <div class="id-subtext">ID: {{ prod.id }}</div>
              </td>
              <td><span class="badge-tag cat-tag">{{ prod.categoria?.nombre || 'Sin categoría' }}</span></td>
              <td><span class="badge-tag prov-tag">🏢 {{ prod.proveedor?.nombre || 'Sin proveedor' }}</span></td>
              <td class="price-text">${{ prod.precio }}</td>
              <td>
                <div class="stock-display">
                  <span class="current-stock">{{ prod.stock_actual }}</span>
                  <span class="min-stock">/ min: {{ prod.stock_minimo }}</span>
                </div>
                <span v-if="prod.stock_actual <= prod.stock_minimo" class="alert-badge">
                  ⚠️ Stock Crítico
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else-if="!productoStore.cargando" class="empty-msg">No hay productos cargados en el sistema.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductoStore } from '@/stores/productoStore'

const productoStore = useProductoStore()

onMounted(() => {
  productoStore.fetchProductos()
})
</script>

<style scoped>
.productos-container { padding: 30px; background-color: #1a1a1a; min-height: 100vh; color: #fff; font-family: sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
.page-header h2 { color: #42b883; margin: 0; }
.btn-back { color: #aaa; text-decoration: none; font-size: 0.9rem; padding: 8px 12px; border: 1px solid #444; border-radius: 4px; transition: 0.2s; }
.btn-back:hover { background-color: #333; color: #fff; }
.card { background-color: #242424; padding: 25px; border-radius: 8px; border: 1px solid #333; }
.card h3 { margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px; color: #42b883; }
.table-responsive { overflow-x: auto; }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; }
.custom-table th, .custom-table td { padding: 12px; border-bottom: 1px solid #333; }
.custom-table th { background-color: #1a1a1a; color: #42b883; }
.bold-text { font-weight: bold; color: #fff; }
.id-subtext { font-size: 0.75rem; color: #777; margin-top: 2px; }
.price-text { font-family: monospace; font-weight: bold; color: #e5c07b; font-size: 1.05rem; }
.badge-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; display: inline-block; }
.cat-tag { background-color: rgba(66, 184, 131, 0.15); color: #42b883; }
.prov-tag { background-color: rgba(229, 192, 123, 0.15); color: #e5c07b; }
.stock-display { display: flex; align-items: baseline; gap: 5px; }
.current-stock { font-size: 1.1rem; font-weight: bold; }
.min-stock { font-size: 0.8rem; color: #777; }
.stock-alert-row { background-color: rgba(224, 108, 117, 0.06); }
.stock-alert-row .current-stock { color: #e06c75; }
.alert-badge { background-color: #e06c75; color: #1a1a1a; font-size: 0.72rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; }
.error-msg { background-color: rgba(224, 108, 117, 0.1); color: #e06c75; padding: 10px; border-radius: 4px; margin-bottom: 15px; border: 1px solid #e06c75; }
.empty-msg { color: #888; text-align: center; font-style: italic; margin-top: 20px; }
</style>
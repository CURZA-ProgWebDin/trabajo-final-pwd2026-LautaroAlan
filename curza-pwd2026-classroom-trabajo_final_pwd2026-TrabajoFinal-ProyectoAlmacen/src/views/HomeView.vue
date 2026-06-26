<template>
  <div class="home-container">
    <header class="dashboard-header">
      <div class="header-left">
        <h1>📦 Sistema de Gestión de Inventario</h1>
        <p class="user-badge">
          Conectado como: <strong>{{ authStore.userRole || 'Usuario' }}</strong>
        </p>
      </div>
      
      <button @click="handleLogout" class="btn-logout">
        🚪 Salir
      </button>
    </header>

    <section v-if="esAdmin" class="panel-section">
      <h2 class="section-title admin-title">🛠️ Panel de Administración</h2>
      <div class="modules-grid">
        <router-link to="/categorias" class="module-card card-admin">
          <div class="card-icon">📂</div>
          <div class="card-info">
            <h3>Categorías</h3>
            <p>Configurar familias y agrupaciones de productos.</p>
          </div>
        </router-link>

        
        <router-link to="/proveedores" class="module-card card-admin">
          <div class="card-icon">🤝</div>
          <div class="card-info">
            <h3>Proveedores</h3>
            <p>Gestionar base de datos de distribuidores aliados.</p>
          </div>
        </router-link>

        <router-link to="/productos/gestion" class="module-card card-admin">
          <div class="card-icon">⚙️</div>
          <div class="card-info">
            <h3>ABM Productos</h3>
            <p>Alta, modificación y baja de artículos del catálogo.</p>
          </div>
        </router-link>
      </div>
    </section>

    <section class="panel-section">
      <h2 class="section-title">🏃 Operaciones de Stock</h2>
      <div class="modules-grid">
        <router-link to="/productos" class="module-card">
          <div class="card-icon">📋</div>
          <div class="card-info">
            <h3>Catálogo de Productos</h3>
            <p>Ver lista completa de productos disponibles y stock actual.</p>
          </div>
        </router-link>

        <router-link to="/movimientos/registrar" class="module-card">
          <div class="card-icon">📥</div>
          <div class="card-info">
            <h3>Registrar Movimiento</h3>
            <p>Cargar entradas o salidas de stock de la mercadería.</p>
          </div>
        </router-link>

        <div class="card-grid">
          <router-link 
  v-if="authStore.userRole?.toLowerCase() === 'admin'" 
  to="/movimientos/todos" 
  class="module-card card-admin"
>
  <span class="card-icon">🛡️</span>
  <div class="card-info">
    <h3>Auditoría Global</h3>
    <p>Historial completo de entradas y salidas de todo el sistema.</p>
  </div>
</router-link>
        </div>

        <router-link to="/movimientos/mis" class="module-card">
          <div class="card-icon">🗂️</div>
          <div class="card-info">
            <h3>Mis Movimientos</h3>
            <p>Historial y auditoría de tus flujos cargados en el sistema.</p>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const esAdmin = computed(() => {
  const rol = authStore.userRole || localStorage.getItem('rol')
  return rol === 'admin'
})

const handleLogout = () => {
  if (confirm('¿Seguro que querés cerrar sesión?')) {
    if (typeof authStore.logout === 'function') {
      authStore.logout()
    } else {
      authStore.token = null
      authStore.userRole = null
      authStore.userNombre = ''
      localStorage.clear()
    }
    
    router.push('/login')
  }
}
</script>

<style scoped>
.home-container {
  padding: 40px;
  background-color: #1a1a1a;
  min-height: 100vh;
  color: #fff;
  font-family: sans-serif;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 40px;
}
.dashboard-header h1 {
  color: #42b883;
  margin: 0 0 10px 0;
}
.user-badge {
  background-color: #242424;
  display: inline-block;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #444;
  margin: 0;
}
.user-badge strong {
  color: #e5c07b;
  text-transform: uppercase;
}

.admin-card {
  border: 2px solid #ff9800;
  background-color: #2e2e2e;
}

.btn-logout {
  background-color: #e06c75;
  color: #1a1a1a;
  font-weight: bold;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s, transform 0.1s;
}
.btn-logout:hover {
  background-color: #d15963;
  transform: translateY(-2px);
}
.btn-logout:active {
  transform: translateY(0);
}

.panel-section {
  margin-bottom: 40px;
}
.section-title {
  font-size: 1.4rem;
  color: #ccc;
  margin-bottom: 20px;
  border-left: 4px solid #42b883;
  padding-left: 10px;
}
.admin-title {
  border-left-color: #e5c07b;
}
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.module-card {
  background-color: #242424;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  color: white;
  transition: transform 0.2s, border-color 0.2s;
}
.module-card:hover {
  transform: translateY(-3px);
  border-color: #42b883;
}
.card-admin:hover {
  border-color: #e5c07b;
}
.card-icon {
  font-size: 2.5rem;
}
.card-info h3 {
  margin: 0 0 5px 0;
  color: #fff;
}
.module-card:hover h3 {
  color: #42b883;
}
.card-admin:hover h3 {
  color: #e5c07b;
}
.card-info p {
  margin: 0;
  font-size: 0.88rem;
  color: #aaa;
  line-height: 1.3;
}
</style>
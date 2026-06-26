<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/productos" class="nav-item">Productos</router-link>
      <router-link to="/movimientos" class="nav-item">📦 Registrar Movimiento</router-link>
      <router-link to="/movimientos/mis" class="nav-item">📜 Mis Movimientos</router-link>

      <router-link 
        v-if="authStore.userRole?.toLowerCase() === 'admin'" 
        to="/movimientos/todos" 
        class="nav-item admin-link"
      >
        🛡️ Auditoría Global
      </router-link>
    </div>
    
    <button @click="authStore.logout" class="btn-logout">Salir</button>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

console.log("Rol actual en el store:", authStore.userRole)
</script>

<style scoped>
.navbar { display: flex; justify-content: space-between; padding: 1rem; background-color: #2a2a2a; color: white; }
.nav-links { display: flex; align-items: center; gap: 20px; }
.admin-links { display: flex; gap: 15px; border-left: 2px solid #555; padding-left: 20px; }
.nav-item { text-decoration: none; color: #e0e0e0; }
.btn-logout { background: #f44336; color: white; border: none; padding: 5px 15px; cursor: pointer; }

.admin-link {
  color: #ff9800 !important;
  font-weight: bold;
}

</style>
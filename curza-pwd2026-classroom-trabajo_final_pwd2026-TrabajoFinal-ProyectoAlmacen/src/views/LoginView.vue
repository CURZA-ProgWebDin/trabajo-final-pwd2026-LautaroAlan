<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const message = ref('')
const isSuccess = ref(false)

const handleLogin = async () => {
  try {
    message.value = ''
    const success = await authStore.login(email.value, password.value) 
    
    if (success) {
      isSuccess.value = true
      message.value = `¡Login exitoso! Bienvenido ${authStore.userNombre}.`
      
      console.log('🚀 Botón presionado con éxito. Evaluando desvío al Home (/).')
      
      if (router.currentRoute.value.path !== '/') {
        router.push('/').then((failure) => {
          if (failure) {
            console.log('❌ El Router rechazó la navegación por este motivo:', failure)
          } else {
            console.log('✅ El Router dice que navegó con éxito. Ruta actual:', router.currentRoute.value.path)
          }
        })
      } else {
        console.log('ℹ️ El navegador ya se encuentra en la raíz (/). Redirección omitida para evitar redundancia.')
      }
    }
  } catch (error) {
    isSuccess.value = false
    message.value = error.response?.data?.message || 'Credenciales inválidas.'
  }
}
</script>

<template>
  <div class="login-container">
    <h2>🔑 Iniciar Sesión (Prueba de Cátedra)</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email / Usuario del Administrador:</label>
        <input 
          id="email" 
          v-model="email" 
          type="text" placeholder="Ej: admin o lauti@test.com" 
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input 
          id="password" 
          v-model="password" 
          type="password" 
          placeholder="Ej: admin123" 
          required
        />
      </div>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Conectando...' : 'Ingresar' }}
      </button>
    </form>

    <p v-if="message" :class="{ 'success-msg': isSuccess, 'error-msg': !isSuccess }">
      {{ message }}
    </p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: sans-serif;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #94d6b9;
}
.success-msg {
  color: green;
  font-weight: bold;
}
.error-msg {
  color: red;
  font-weight: bold;
}
</style>

import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'

import router from './router'

import { useAuthStore } from './stores/authStore'




import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";



const app = createApp(App)




app.use(createPinia())

app.use(router)

app.use(Toast)




const authStore = useAuthStore()




if (authStore.token) {


  authStore.fetchMe().finally(() => {

    app.mount('#app')

  })

} else {

  app.mount('#app')

} 


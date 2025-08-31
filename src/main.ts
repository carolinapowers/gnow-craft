import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

// Enable Vue DevTools in development
if (import.meta.env.DEV) {
  app.config.performance = true
}

app.mount('#app')

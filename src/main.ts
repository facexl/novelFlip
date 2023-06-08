import { createApp } from 'vue'
import 'normalize.css/normalize.css'
import 'virtual:uno.css'
import router from './router'
import App from './App.vue'

createApp(App).use(router).mount('#app')

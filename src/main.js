import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import $bus from './utils/Events'
import './css/index.css'

const app = createApp(App)

app.use(router)
app.config.globalProperties.$bus = $bus
app.provide('$bus', $bus)

app.mount('#app')

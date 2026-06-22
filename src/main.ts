/*
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-21 22:58:18
 * @Description: 
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { setupDirectives } from './directives'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(createPinia())
app.use(router)
// 在 app.mount 之前加这行
setupDirectives(app)

app.mount('#app')

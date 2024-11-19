import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from "vue-router";
import routes from '~pages'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post.Accept = 'application/json'
axios.defaults.headers.post['Access-Control-Allow-Credentials'] = true

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const pinia = createPinia()

const app = createApp(App)
app.use(pinia).use(router).mount("#app")

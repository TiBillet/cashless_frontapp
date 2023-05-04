// gère les routes(pages)
import {createRouter, createWebHistory} from 'vue-router'
import Accueil from '@/views/Accueil.vue'

const domain = `${location.protocol}//${location.host}`

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export default router

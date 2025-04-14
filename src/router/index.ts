import { createRouter, createWebHistory } from 'vue-router'
import HomeScreen from '@/ui/HomeScreen.vue'
import GameScreen from '@/ui/GameScreen.vue'

const routes = [
  { path: '/', name: 'home', component: HomeScreen },
  { path: '/game', name: 'game', component: GameScreen },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

import { createRouter, createWebHistory } from 'vue-router'
import GameScreen from '@/ui/GameScreen.vue'

const routes = [{ path: '/', name: 'home', component: GameScreen }]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

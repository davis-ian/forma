import { ref } from 'vue'

export const gameState = ref<'menu' | 'playing' | 'paused'>('menu')
export const isTransitioning = ref(false)

export function startGame() {
    gameState.value = 'playing'
}

export function pauseGame() {
    console.log('PAUSING')
    gameState.value = 'paused'
}

export function resumeGame() {
    console.log('RESUMING')
    gameState.value = 'playing'
}

export function currentGameState() {
    return gameState.value
}

export async function runRoomTransition(callback: () => void) {
    console.log('RUNNING ROOM TRANSITION')
    isTransitioning.value = true

    await new Promise((resolve) => setTimeout(resolve, 100))
    callback()
    await new Promise((resolve) => setTimeout(resolve, 100))

    isTransitioning.value = false
}

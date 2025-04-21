import { ref } from 'vue'
import { initGame } from './Game'

export const gameState = ref<'menu' | 'playing' | 'paused' | 'gameover'>('menu')
export const isTransitioning = ref(false)

let cleanupFn: (() => void) | undefined

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

export function endGame() {
    gameState.value = 'gameover'
}

export function cleanupGame() {
    if (cleanupFn) {
        console.log('CLEANING UP')
        cleanupFn()
        cleanupFn = undefined
    }
}

export function startGame(container: HTMLElement, debug = false) {
    console.log('STARTING  GAME')
    cleanupGame()
    cleanupFn = initGame(container, debug)
}

export async function runRoomTransition(callback: () => void) {
    console.log('RUNNING ROOM TRANSITION')
    isTransitioning.value = true

    await new Promise((resolve) => setTimeout(resolve, 100))
    callback()
    await new Promise((resolve) => setTimeout(resolve, 100))

    isTransitioning.value = false
}

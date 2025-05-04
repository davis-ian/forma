import { ref } from 'vue'
import { initGame } from './Game'

const DEBUG = false

export const gameState = ref<'menu' | 'playing' | 'paused' | 'gameover'>('menu')
export const isTransitioning = ref(false)

let cleanupFn: (() => void) | undefined

export function pauseGame() {
    if (DEBUG) {
        console.log('PAUSING')
    }
    gameState.value = 'paused'
}

export function resumeGame() {
    if (DEBUG) {
        console.log('RESUMING')
    }
    gameState.value = 'playing'
}

export function currentGameState() {
    return gameState.value
}

export function endGame() {
    if (DEBUG) {
        console.log('GAME OVER')
    }
    gameState.value = 'gameover'
}

export function cleanupGame() {
    if (cleanupFn) {
        if (DEBUG) {
            console.log('CLEANING UP')
        }
        cleanupFn()
        cleanupFn = undefined
    }
}

export function startMenu() {
    if (DEBUG) {
        console.log('QUITING GAME')
    }
    cleanupGame()

    gameState.value = 'menu'
}

export function startGame(container: HTMLElement) {
    if (DEBUG) {
        console.log('STARTING  GAME')
    }
    cleanupGame()
    cleanupFn = initGame(container)
}

export async function runRoomTransition(callback: () => void) {
    if (DEBUG) {
        console.log('RUNNING ROOM TRANSITION')
    }
    isTransitioning.value = true

    await new Promise((resolve) => setTimeout(resolve, 100))
    callback()
    await new Promise((resolve) => setTimeout(resolve, 100))

    isTransitioning.value = false
}

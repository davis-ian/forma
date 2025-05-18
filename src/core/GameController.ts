import { ref } from 'vue'
import { initGame } from './Game'
import { debugSettings } from '@/core/GameState'

export const gameState = ref<'menu' | 'playing' | 'paused' | 'gameover'>('menu')
export const isTransitioning = ref(false)

let cleanupFn: (() => void) | undefined

export function pauseGame() {
    if (debugSettings.value.logState || debugSettings.value.logAll) {
        console.log('PAUSING')
    }
    gameState.value = 'paused'
}

export function resumeGame() {
    if (debugSettings.value.logState || debugSettings.value.logAll) {
        console.log('RESUMING')
    }
    gameState.value = 'playing'
}

export function currentGameState() {
    return gameState.value
}

export function endGame() {
    if (debugSettings.value.logState || debugSettings.value.logAll) {
        console.log('GAME OVER')
    }
    gameState.value = 'gameover'
}

export function cleanupGame() {
    if (cleanupFn) {
        if (debugSettings.value.logState || debugSettings.value.logAll) {
            console.log('CLEANING UP')
        }
        cleanupFn()
        cleanupFn = undefined
    }
}

export function startMenu() {
    if (debugSettings.value.logState || debugSettings.value.logAll) {
        console.log('QUITING GAME')
    }
    cleanupGame()

    gameState.value = 'menu'
}

export function startGame(container: HTMLElement) {
    if (debugSettings.value.logState || debugSettings.value.logAll) {
        console.log('STARTING  GAME')
    }
    cleanupGame()
    cleanupFn = initGame(container)
}

export async function runRoomTransition(callback: () => void) {
    if (debugSettings.value.logState || debugSettings.value.logAll) {
        console.log('RUNNING ROOM TRANSITION')
    }
    isTransitioning.value = true

    await new Promise((resolve) => setTimeout(resolve, 100))
    callback()
    await new Promise((resolve) => setTimeout(resolve, 100))

    isTransitioning.value = false
}

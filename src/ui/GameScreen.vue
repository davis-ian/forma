<template>
    <div class="relative h-full w-full">
        <div ref="canvasContainer" class="absolute inset-0 z-0 bg-black"></div>
        <!-- Overlay UI -->
        <!-- <div class="absolute top-4 left-4 z-10 text-white">🍳 Kitchen Nightmares</div> -->

        <PauseMenu v-if="currentGameState() === 'paused'"></PauseMenu>
        <GameOverMenu
            @restart="initRestart"
            v-if="currentGameState() === 'gameover'"
        ></GameOverMenu>

        <HUD />
        <!-- TRANSITION  OVERLAY: START -->
        <transition name="fade">
            <div
                v-show="isTransitioning"
                class="pointer-events-none fixed inset-0 z-50 bg-black"
                :class="{
                    'opacity-100': isTransitioning,
                    'opacity-0': !isTransitioning,
                }"
            ></div>
        </transition>
        <!-- TRANSITION  OVERLAY: END -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { currentGameState, isTransitioning, startGame } from '@/core/GameController'
import PauseMenu from './PauseMenu.vue'
import GameOverMenu from './GameOverMenu.vue'
import HUD from './HUD.vue'

const canvasContainer = ref<HTMLDivElement | null>(null)

function initRestart() {
    if (!canvasContainer.value) return

    console.log('restarting game..')
    startGame(canvasContainer.value)
}

onMounted(() => {
    console.log('game screen mounted')
    if (!canvasContainer.value) return
    console.log('starting game..')
    startGame(canvasContainer.value, true)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>

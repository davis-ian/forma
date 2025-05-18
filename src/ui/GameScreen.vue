<template>
    <div class="relative h-full w-full">
        <div ref="canvasContainer" class="absolute inset-0 z-0 bg-black"></div>

        <MainMenu id="home-screen" @start="initRestart" v-show="currentGameState() === 'menu'" />
        <PauseMenu @quit="startMenu" v-if="currentGameState() === 'paused'"></PauseMenu>
        <GameOverMenu
            @restart="initRestart"
            v-if="currentGameState() === 'gameover'"
        ></GameOverMenu>

        <HUD v-if="currentGameState() === 'playing'" />

        <!-- PLAYER DAMAGE OVERLAY: START -->

        <div id="damage-overlay"></div>
        <!-- PLAYER DAMAGE OVERLAY: END -->

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
import { currentGameState, isTransitioning, startGame, startMenu } from '@/core/GameController'
import PauseMenu from './PauseMenu.vue'
import GameOverMenu from './GameOverMenu.vue'
import MainMenu from '@/ui/MainMenu.vue'
import HUD from './HUD.vue'
import { getSettings, initSettings } from '@/utils/settingsUtils'

const canvasContainer = ref<HTMLDivElement | null>(null)

function loadSettings() {
    let settings = getSettings()

    console.log('settings', settings)

    if (!settings) {
        settings = initSettings()
        console.log('settinngs initialized')
    }
}

function initRestart() {
    if (!canvasContainer.value) return

    console.log('restarting game..')
    startGame(canvasContainer.value)
}

onMounted(() => {
    console.log('game screen mounted')
    loadSettings()
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

#damage-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 0, 0, 0.35); /* red with transparency */
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-out;
    z-index: 9999;
}

#home-screen {
    z-index: 99;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
</style>

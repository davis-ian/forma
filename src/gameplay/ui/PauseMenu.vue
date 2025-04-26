<template>
    <div
        v-if="gameState === 'paused'"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
        <div class="space-y-4 rounded bg-white p-6 text-center text-black shadow-lg">
            <h2 class="text-2xl font-bold">⏸️ Paused</h2>
            <button class="btn" @click="resumeGame">Resume</button>
            <button class="btn" @click="goToMenu">Main Menu</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { gameState, resumeGame } from '@/core/GameController'

function goToMenu() {
    gameState.value = 'menu'
}
</script>

<template>
    <div class="relative h-full w-full">
        <div ref="canvasContainer" class="absolute inset-0 z-0 bg-black"></div>
        <!-- Overlay UI -->
        <div class="absolute top-4 left-4 z-10 text-white">🍳 Kitchen Nightmares</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { startGame } from '@/core/Game'

const canvasContainer = ref<HTMLDivElement | null>(null)

onMounted(() => {
    console.log('game screen mounted')
    if (canvasContainer.value) {
        console.log('starting game..')
        startGame(canvasContainer.value, true)
    }
})
</script>

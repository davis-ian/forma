<template>
    <div class="hud-container">
        <!-- Debug -->
        <!-- <div class="absolute top-2 left-2 rounded bg-black/80 p-2 text-sm text-white">
            <div>❤️ Health</div>
            <div>current: {{ playerHealth.current }}</div>
            <div>max: {{ playerHealth.max }}</div>
        </div> -->

        <!-- Health bar -->
        <div
            class="absolute top-3 left-3 h-6 w-64 overflow-hidden rounded border-2 border-white bg-gray-800"
        >
            <div
                :class="['h-full transition-all duration-200', barColor]"
                :style="{ width: `${(playerHealth.current / playerHealth.max) * 100}%` }"
            ></div>
        </div>

        <div class="absolute top-14 left-3 rounded bg-black/70 px-2 py-1 text-sm text-white">
            👹 Enemies Left: {{ remainingEnemies }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { playerHealth, remainingEnemies } from '@/core/GameState'
import { computed } from 'vue'

const emit = defineEmits<{
    (e: 'start'): void
}>()

function start() {
    emit('start')
}

const barColor = computed(() => {
    const ratio = playerHealth.value.current / playerHealth.value.max
    if (ratio < 0.3) return 'bg-red-500'
    if (ratio < 0.6) return 'bg-yellow-400'
    return 'bg-green-500'
})
</script>

<style scoped>
.hud-container {
    z-index: 5;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
}
</style>

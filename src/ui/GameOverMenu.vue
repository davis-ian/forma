<template>
    <div class="gameover-menu">
        <h1 class="text-3xl">GAME OVER</h1>

        <button
            @click="restart"
            class="bg-primary text-bg hover:bg-secondary cursor-pointer rounded px-6 py-3 font-semibold shadow-md transition"
        >
            Play Again
        </button>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'restart'): void
}>()

function restart() {
    console.log('RESTART  HEARD')
    emit('restart')
}
</script>
<style scoped>
.gameover-menu {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;

    background-color: rgba(0, 0, 0, 0.6);
    gap: 12px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

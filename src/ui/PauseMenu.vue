<template>
    <div class="pause-menu">
        <h1 class="text-3xl">PAUSED</h1>

        <div class="mt-8">
            <button
                @click="quit"
                class="bg-primary text-bg hover:bg-secondary cursor-pointer rounded px-6 py-3 font-semibold shadow-md transition"
            >
                Quit Game
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'quit'): void
}>()

function quit() {
    console.log('QUIT HEARD')
    emit('quit')
}
</script>

<style scoped>
.pause-menu {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;

    background-color: rgba(0, 0, 0, 0.6);
    /* border: 2px solid white; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

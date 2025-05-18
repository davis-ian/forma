<template>
    <div class="pause-menu">
        <h1 class="text-3xl">SETTINGS</h1>

        <div v-if="settings" class="m-4 flex flex-col gap-4 rounded-md border-2 border-white p-4">
            <div v-for="setting in settingsSchema" :key="setting.key">
                <div class="flex justify-between gap-8">
                    <span>{{ setting.label }}</span>
                    <ToggleSwitch v-model="settings[setting.key]" />
                </div>
            </div>
        </div>

        <div class="mt-8">
            <button
                @click="close"
                class="bg-primary text-bg hover:bg-secondary cursor-pointer rounded px-6 py-3 font-semibold shadow-md transition"
            >
                Close
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { debugSettings } from '@/core/GameState'
import { settingsSchema } from '@/utils/settingsUtils'
import ToggleSwitch from './ToggleSwitch.vue'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const settings = debugSettings

function close() {
    emit('close')
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

    background-color: rgba(0, 0, 0, 1);
    /* border: 2px solid white; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

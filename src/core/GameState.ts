import { ref, watch } from 'vue'

export const playerHealth = ref({
    current: 0,
    max: 0,
})

export const remainingEnemies = ref(0)

import {
    getSettings,
    saveSettings,
    defaultSettings,
    type DebugSettings,
} from '@/utils/settingsUtils'

export const debugSettings = ref<DebugSettings>(getSettings() ?? defaultSettings)

watch(
    debugSettings,
    (val) => {
        saveSettings(val)
    },
    { deep: true }
)

import { ref } from 'vue'

export const playerHealth = ref({
    current: 0,
    max: 0,
})

export const remainingEnemies = ref(0)


export const debugSettings = ref({
    logGameState: false,
})

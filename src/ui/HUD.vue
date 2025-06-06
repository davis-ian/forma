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
            <span> 👹 Enemies Left: {{ remainingEnemies }} </span>
            <div class="mt-4"><code class="rounded border-1 p-3">controls: C</code></div>
        </div>

        <div v-if="isMobile" id="touch-controls">
            <div id="joystick-container"></div>
            <button id="attack-button">A</button>
            <!-- <button id="dash-button">💨</button> -->
            <p id="mobile-banner">
                mobile support is limited, for a better experience play on desktop
            </p>
        </div>

        <!-- Control overlay -->
        <div v-if="showControls" id="controlsOverlay">
            <h2 class="pb-4 text-center text-2xl">Game Controls</h2>
            <ul>
                <ul class="m-2">
                    <li class="m-1">
                        Move - <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or Arrow Keys
                    </li>
                    <li class="m-1">Attack - <kbd>Space</kbd> or Left Click</li>
                    <li class="m-1">Dash - <kbd>Shift</kbd> or Right Click</li>
                    <li class="m-1">Show Controls - Hold <kbd>C</kbd></li>
                </ul>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { playerHealth, remainingEnemies } from '@/core/GameState'
import { computed, onMounted, ref, nextTick, onBeforeMount } from 'vue'
import nipplejs from 'nipplejs'
import { Vector2 } from 'three'
import { InputService } from '@/core/services/InputService'

// const emit = defineEmits<{
//     (e: 'start'): void
// }>()

// function start() {
//     emit('start')
// }

const isMobile = ref(false)

const barColor = computed(() => {
    const ratio = playerHealth.value.current / playerHealth.value.max
    if (ratio < 0.3) return 'bg-red-500'
    if (ratio < 0.6) return 'bg-yellow-400'
    return 'bg-green-500'
})

function initJoystick() {
    const joystickZone = document.getElementById('joystick-container')
    if (!joystickZone) return

    requestAnimationFrame(() => {
        const joystick = nipplejs.create({
            zone: joystickZone,
            mode: 'static',
            position: { left: '50px', bottom: '50px' },
            color: 'white',
            size: 100,
        })

        joystick.on('move', (evt, data) => {
            const rad = data.angle.radian
            const force = Math.min(data.force, 1)
            const vec = new Vector2(Math.cos(rad), Math.sin(rad)).multiplyScalar(force)
            InputService.setMoveDirection(vec)
        })

        joystick.on('end', () => {
            InputService.setMoveDirection(new Vector2(0, 0))
        })

        // ATTACK button
        const attackBtn = document.getElementById('attack-button')
        if (attackBtn) {
            attackBtn.addEventListener(
                'touchstart',
                (e) => {
                    e.preventDefault()
                    InputService.setAttackPressed(true)
                },
                { passive: false }
            )
            attackBtn.addEventListener('touchend', () => InputService.setAttackPressed(false))
            attackBtn.addEventListener('mousedown', () => InputService.setAttackPressed(true))
            attackBtn.addEventListener('mouseup', () => InputService.setAttackPressed(false))
            attackBtn.addEventListener('mouseleave', () => InputService.setAttackPressed(false)) // prevent stuck state
        }

        // DASH button
        const dashBtn = document.getElementById('dash-button')
        if (dashBtn) {
            dashBtn.addEventListener('touchstart', () => InputService.setDashPressed(true))
            dashBtn.addEventListener('touchend', () => InputService.setDashPressed(false))
            dashBtn.addEventListener('mousedown', () => InputService.setDashPressed(true))
            dashBtn.addEventListener('mouseup', () => InputService.setDashPressed(false))
            dashBtn.addEventListener('mouseleave', () => InputService.setDashPressed(false))
        }
    })
}

const showControls = ref(false)

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyC') {
        showControls.value = true
    }
}

const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'KeyC') {
        showControls.value = false
    }
}

onMounted(async () => {
    isMobile.value = window.matchMedia('(pointer: coarse)').matches
    if (isMobile.value) {
        await nextTick()
        initJoystick()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
})

onBeforeMount(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
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

#touch-controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
}

#joystick-container {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 100px;
    height: 100px;
    pointer-events: auto;
}

#attack-button,
#dash-button {
    position: absolute;
    bottom: 20px;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    pointer-events: auto;
    font-size: 24px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    touch-action: manipulation;
}

#attack-button {
    right: 20px;
}
#dash-button {
    right: 100px;
}

#mobile-banner {
    position: absolute;
    top: 100px;
    max-width: 200px;
    padding: 12px;
    margin: 12px;
    border: 1px solid;
    border-radius: 8px;
    text-transform: uppercase;
    font-size: small;
    color: #f7cc42;
}

#controlsOverlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
    background-color: rgba(0, 0, 0, 0.85);
    border: 2px solid white;
    border-radius: 8px;
    color: white;
    z-index: 1000;
    padding: 2rem;
}

@media (pointer: fine) {
    #touch-controls {
        display: none !important;
    }
}
</style>

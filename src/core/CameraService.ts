import type { CameraSystem } from '@/shared/systems/CameraSystem'

let cameraSystem: CameraSystem | null = null

export function setCameraSystem(system: CameraSystem) {
    cameraSystem = system
}

export function shakeCamera(duration: number, intensity: number) {
    if (cameraSystem) {
        cameraSystem.startShake(duration, intensity)
    } else {
        console.warn('CameraSystem not registered')
    }
}

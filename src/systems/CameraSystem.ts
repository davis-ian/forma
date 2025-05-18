import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { Vector3, type PerspectiveCamera } from 'three'
import type { PositionComponent } from '../components/Position'
import { EntityTag } from '@/engine/EntityTag'
import { debugSettings } from '@/core/GameState'

export class CameraSystem extends System {
    private camera: PerspectiveCamera
    private shakeOffset = new Vector3()
    private shakeTimer = 0
    private shakeDuration = 0
    private shakeIntensity = 0

    constructor(camera: PerspectiveCamera) {
        super()
        this.camera = camera
    }

    startShake(duration: number, intensity: number) {
        if (debugSettings.value.logCamera || debugSettings.value.logCamera) {
            console.log('start shake triggered')
        }
        this.shakeTimer = duration
        this.shakeDuration = duration
        this.shakeIntensity = intensity
    }

    update(world: World, deltaTime: number) {
        const entities = world.getEntitiesWithTag(EntityTag.CameraFollow)

        if (entities.length === 0) return

        const target = entities[0] //TODO: Support multiple entities

        const pos = target.getComponent<PositionComponent>(ComponentType.Position)
        if (!pos) return

        // Shake logic
        if (this.shakeTimer > 0) {
            this.shakeTimer -= deltaTime
            const t = 1 - this.shakeTimer / this.shakeDuration // 0–1
            const falloff = 1 - t // decay over time

            const randX = (Math.random() * 2 - 1) * this.shakeIntensity * falloff
            const randY = (Math.random() * 2 - 1) * this.shakeIntensity * falloff
            const randZ = (Math.random() * 2 - 1) * this.shakeIntensity * falloff

            this.shakeOffset.set(randX, randY, randZ)
        } else {
            this.shakeOffset.set(0, 0, 0)
        }

        const playerOffset = 4
        const smoothing = 5
        const alpha = deltaTime * smoothing

        const baseTarget = new Vector3(pos.x, this.camera.position.y, pos.z + playerOffset)
        const targetWithShake = baseTarget.add(this.shakeOffset)
        this.camera.position.lerp(targetWithShake, alpha)
    }
}

import { System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { VisualComponent } from '../components/Visual'
import type { DamageFlashComponent } from '../components/DamageFlash'
import { Mesh, Sprite, type MeshBasicMaterial } from 'three'
import type { HealthComponent } from '../components/Health'
import type { WindupDebugComponent } from '../components/AI'

const DEBUG = false
export class DamageFlashSystem extends System {
    update(world: World, deltaTime: number): void {
        for (const entity of world.entities.values()) {
            if (
                entity.hasComponent(ComponentType.Visual) &&
                (entity.hasComponent(ComponentType.DamageFlash) ||
                    entity.hasComponent(ComponentType.WindupDebug))
            ) {
                const visual = entity.getComponent<VisualComponent>(ComponentType.Visual)!
                const flash = entity.getComponent<DamageFlashComponent>(ComponentType.DamageFlash)!
                const health = entity.getComponent<HealthComponent>(ComponentType.Health)
                const windup = entity.getComponent<WindupDebugComponent>(ComponentType.WindupDebug)

                if (windup) windup.elapsed += deltaTime
                if (flash) flash.elapsed += deltaTime

                for (const { mesh, ignoreDamageFlash } of visual.meshes) {
                    if (ignoreDamageFlash) continue
                    if (!(mesh instanceof Mesh || mesh instanceof Sprite)) continue //Skip if not a mesh

                    const material = mesh.material as MeshBasicMaterial

                    const isInvulnerable =
                        health?.invulnerableRemaining && health.invulnerableRemaining > 0
                    const initialFlash = flash ? flash.elapsed < flash.flashTime : false
                    const flashingFromWindup = windup && windup.isActive

                    if (initialFlash) {
                        material.color.set(0xff0000)
                    } else if (flashingFromWindup) {
                        //TODO: move to windup animation
                        if (DEBUG) {
                            console.log('flashing from windup')
                        }
                        material.color.set('limegreen')
                        if (windup.elapsed >= windup.duration) {
                            entity.removeComponent(ComponentType.WindupDebug)
                            material.color.set(0xffffff)
                        }
                    } else if (flash.persitstWhileInvulnerable && isInvulnerable) {
                        // const strobe = Math.sin(flash.elapsed * 20) > 0 ? 0x00ff00 : 0xffffff
                        // material.color.set(strobe)
                        material.color.set(0xffffff)
                        material.transparent = true
                        material.opacity = Math.sin(flash.elapsed * 20) > 0 ? 1 : 0.2
                    } else {
                        material.color.set(0xffffff)

                        entity.removeComponent(ComponentType.DamageFlash)
                    }
                }
            }
        }
    }
}

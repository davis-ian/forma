import { System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { VisualComponent } from '../components/Visual'
import type { DamageFlashComponent } from '../components/DamageFlash'
import { Mesh, Sprite, type MeshBasicMaterial } from 'three'

export class DamageFlashSystem extends System {
    update(world: World, deltaTime: number): void {
        for (const entity of world.entities.values()) {
            if (
                entity.hasComponent(ComponentType.Visual) &&
                entity.hasComponent(ComponentType.DamageFlash)
            ) {
                const visual = entity.getComponent<VisualComponent>(ComponentType.Visual)!
                const flash = entity.getComponent<DamageFlashComponent>(ComponentType.DamageFlash)!

                flash.elapsed += deltaTime

                for (const { mesh, ignoreDamageFlash } of visual.meshes) {
                    if (ignoreDamageFlash) continue
                    if (!(mesh instanceof Mesh || mesh instanceof Sprite)) continue //Skip if not a mesh

                    const material = mesh.material as MeshBasicMaterial

                    if (flash.elapsed < flash.flashTime) {
                        material.color.set(0xff0000)
                    } else {
                        material.color.set(0xffffff)
                        entity.removeComponent(ComponentType.DamageFlash)
                    }
                }
            }
        }
    }
}

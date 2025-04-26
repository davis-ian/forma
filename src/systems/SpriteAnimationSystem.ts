import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { SpriteAnimationComponent } from '../components/SpriteAnimation'
import { Mesh, MeshBasicMaterial } from 'three'
import type { MeshComponent } from '../components/Mesh'

const DEBUG = false

export class SpriteAnimationSystem extends System {
    update(world: World, deltaTime: number): void {
        for (const entity of world.entities.values()) {
            if (
                !entity.hasComponent(ComponentType.SpriteAnimation) ||
                !entity.hasComponent(ComponentType.Mesh)
            )
                continue

            const anim = entity.getComponent<SpriteAnimationComponent>(
                ComponentType.SpriteAnimation
            )!
            const meshComp = entity.getComponent<MeshComponent>(ComponentType.Mesh)!
            const mesh = meshComp.mesh

            if (!(mesh instanceof Mesh)) continue
            if (!anim.playing) continue

            anim.elapsedTime += deltaTime

            if (anim.elapsedTime >= anim.frameDuration) {
                anim.elapsedTime = 0
                anim.currentFrame++

                const isLastFrame = anim.currentFrame >= anim.frameCount

                if (isLastFrame) {
                    if (anim.loop) {
                        anim.currentFrame = 0
                    } else {
                        anim.currentFrame = anim.frameCount - 1
                        anim.playing = false
                        if (anim.onComplete) {
                            anim.onComplete()
                        }
                    }
                }
            }

            const material = mesh.material as MeshBasicMaterial
            const texture = material.map

            if (texture) {
                const frameX = anim.currentFrame % anim.columns
                const frameY = Math.floor(anim.currentFrame / anim.columns) + anim.row
                // texture.repeat.set(1 / anim.columns, 1 / anim.rows)
                // texture.offset.set(anim.currentFrame / anim.columns, 1 - (anim.row + 1) / anim.rows)

                texture.repeat.set(1 / anim.columns, 1 / anim.rows)
                texture.offset.set(frameX / anim.columns, 1 - (frameY + 1) / anim.rows)
            }
        }
    }
}

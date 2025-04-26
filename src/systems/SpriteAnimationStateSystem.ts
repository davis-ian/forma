import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
import type { InputComponent } from '../components/Input'
import type { MeshComponent } from '../components/Mesh'
import type { SpriteAnimationComponent } from '../components/SpriteAnimation'
import { setAnimationState } from '@/utils/animationUtils'
import type { RotationComponent } from '@/components/Rotation'

// const DEBUG = false

export class SpriteAnimationStateSystem extends System {
    update(world: World): void {
        const players = world.getEntitiesWithTag(EntityTag.Player)

        for (const entity of players) {
            if (
                !entity.hasComponent(ComponentType.SpriteAnimation) ||
                !entity.hasComponent(ComponentType.Input)
            ) {
                continue
            }

            const input = entity.getComponent<InputComponent>(ComponentType.Input)!
            const anim = entity.getComponent<SpriteAnimationComponent>(
                ComponentType.SpriteAnimation
            )!

            const hasDirectionInput = input.up || input.down || input.left || input.right

            // Set animation state
            if (!anim.playing || anim.loop) {
                if (hasDirectionInput) {
                    setAnimationState(anim, 'walk')
                } else {
                    setAnimationState(anim, 'idle')
                }
            }

            if (hasDirectionInput) {
                const meshComp = entity.getComponent<MeshComponent>(ComponentType.Mesh)
                if (meshComp) {
                    const sprite = meshComp.mesh
                    if (input.left) {
                        sprite.scale.x = -Math.abs(sprite.scale.x)
                    } else if (input.right) {
                        sprite.scale.x = Math.abs(sprite.scale.x)
                    }
                }
            }
        }

        const enemies = world.getEntitiesWithTag(EntityTag.Enemy)

        for (const enemy of enemies) {
            if (
                !enemy.hasComponent(ComponentType.SpriteAnimation) ||
                !enemy.hasComponent(ComponentType.Rotation) ||
                !enemy.hasComponent(ComponentType.Mesh)
            ) {
                continue
            }

            const rotation = enemy.getComponent<RotationComponent>(ComponentType.Rotation)!.y
            const meshComp = enemy.getComponent<MeshComponent>(ComponentType.Mesh)!
            const sprite = meshComp.mesh

            // Convert rotation to degrees and normalize
            const degrees = (rotation * 180) / Math.PI
            const normalized = ((degrees % 360) + 360) % 360

            // Flip horizontally if facing left-ish (180° to 360°)
            if (normalized > 90 && normalized < 270) {
                sprite.scale.x = -Math.abs(sprite.scale.x)
            } else {
                sprite.scale.x = Math.abs(sprite.scale.x)
            }
        }
    }
}

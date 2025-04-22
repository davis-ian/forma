import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
import type { InputComponent } from '../components/Input'
import type { MeshComponent } from '../components/Mesh'
import type { SpriteAnimationComponent } from '../components/SpriteAnimation'
import { setAnimationState } from '@/utils/animationUtils'

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
                    setAnimationState(anim, 'playerIdle')
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
    }
}

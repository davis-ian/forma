import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'
import type { VelocityComponent } from '@/shared/components/Velocity'
import type { InputComponent } from '@/shared/components/Input'

const SPEED = 4
export class MovementSystem extends System {
    update(world: World, deltaTime: number): void {
        // Loop through entities
        for (const entity of world.entities.values()) {
            // filter for entities with position and velocity

            if (
                entity.hasComponent(ComponentType.Position) &&
                entity.hasComponent(ComponentType.Velocity)
            ) {
                const pos = entity.getComponent<PositionComponent>(ComponentType.Position)!
                const vel = entity.getComponent<VelocityComponent>(ComponentType.Velocity)!

                vel.x = 0
                vel.z = 0

                if (entity.hasComponent(ComponentType.Input)) {
                    const input = entity.getComponent<InputComponent>(ComponentType.Input)!

                    if (input.left) vel.x -= SPEED
                    if (input.right) vel.x += SPEED
                    if (input.up) vel.z -= SPEED
                    if (input.down) vel.z += SPEED
                }

                // if (vel.x || vel.y || vel.z) {
                //     console.log('MOVING')
                // }
                //apply velicity * deltaTime to position
                pos.x += vel.x * deltaTime
                pos.y += vel.y * deltaTime
                pos.z += vel.z * deltaTime
            }
        }
    }
}

import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'
import type { VelocityComponent } from '@/shared/components/Velocity'
import type { InputComponent } from '@/shared/components/Input'

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
                    const speed = 2

                    if (input.left) vel.x -= speed
                    if (input.right) vel.x += speed
                    if (input.up) vel.z -= speed
                    if (input.down) vel.z += speed
                }

                //apply velicity * deltaTime to position
                pos.x += vel.x * deltaTime
                pos.y += vel.y * deltaTime
                pos.z += vel.z * deltaTime
            }
        }
    }
}

import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { VelocityComponent } from '../components/Velocity'
import type { InputComponent } from '../components/Input'

const SPEED = 6

export class VelocitySystem extends System {
    update(world: World, deltaTime: number): void {
        for (const entity of world.entities.values()) {
            if (
                entity.hasComponent(ComponentType.Velocity) &&
                entity.hasComponent(ComponentType.Input)
            ) {
                const vel = entity.getComponent<VelocityComponent>(ComponentType.Velocity)!
                const input = entity.getComponent<InputComponent>(ComponentType.Input)!

                vel.x = 0
                vel.z = 0

                // Normalize velocity for directional movements
                const moveX = (input.right ? 1 : 0) - (input.left ? 1 : 0)
                const moveZ = (input.down ? 1 : 0) - (input.up ? 1 : 0)
                const mag = Math.hypot(moveX, moveZ)

                if (mag > 0) {
                    const dirX = moveX / mag
                    const dirZ = moveZ / mag

                    vel.x = dirX * SPEED
                    vel.z = dirZ * SPEED
                }
            }
        }
    }
}

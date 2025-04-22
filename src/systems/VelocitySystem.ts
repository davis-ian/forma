import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { VelocityComponent } from '../components/Velocity'
import type { InputComponent } from '../components/Input'
import type { ImpulseComponent } from '../components/Impulse'

const DEBUG = false
const SPEED = 9

export class VelocitySystem extends System {
    update(world: World, deltaTime: number): void {
        for (const entity of world.entities.values()) {
            if (entity.hasComponent(ComponentType.Velocity)) {
                const vel = entity.getComponent<VelocityComponent>(ComponentType.Velocity)!

                // Apply impulse first
                if (entity.hasComponent(ComponentType.Impulse)) {
                    const impulse = entity.getComponent<ImpulseComponent>(ComponentType.Impulse)!
                    vel.x = impulse.x
                    vel.z = impulse.z
                    entity.removeComponent(ComponentType.Impulse) // one frame effect
                    continue //Skip input this frame
                }

                // Apply input movement
                if (entity.hasComponent(ComponentType.Input)) {
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
}

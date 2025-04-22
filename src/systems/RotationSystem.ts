// RotationSystem.ts
// Rotates any entity with both Position and Rotation components.

import { System } from '@/engine'
import type { World } from '@/engine'
import type { RotationComponent } from '@/components/Rotation'
import { ComponentType } from '@/engine/ComponentType'
import type { InputComponent } from '../components/Input'

export class RotationSystem extends System {
    update(world: World, deltaTime: number): void {
        for (const entity of world.entities.values()) {
            if (entity.hasComponent(ComponentType.Input)) {
                const input = entity.getComponent<InputComponent>(ComponentType.Input)!

                const moveX = (input.right ? 1 : 0) - (input.left ? 1 : 0)
                const moveZ = (input.down ? 1 : 0) - (input.up ? 1 : 0)

                const mag = Math.hypot(moveX, moveZ)

                if (mag > 0 && entity.hasComponent(ComponentType.Rotation)) {
                    const rot = entity.getComponent<RotationComponent>(ComponentType.Rotation)!

                    const dirX = moveX / mag
                    const dirZ = moveZ / mag

                    rot.y = Math.atan2(dirX, dirZ)
                }
            }
        }
    }
}

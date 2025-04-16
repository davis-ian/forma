// RotationSystem.ts
// Rotates any entity with both Position and Rotation components.

import { System } from '@/engine'
import type { World } from '@/engine'
import type { RotationComponent } from '@/shared/components/Rotation'
import type { MeshComponent } from '@/shared/components/Mesh'
import { ComponentType } from '@/engine/ComponentType'

export class RotationSystem extends System {
    update(world: World, deltaTime: number): void {
        //TODO: fix rotation system
        // for (const entity of world.entities.values()) {
        //     if (
        //         entity.hasComponent(ComponentType.Mesh) &&
        //         entity.hasComponent(ComponentType.Rotation) &&
        //         !entity.hasComponent(ComponentType.Visual)
        //     ) {
        //         const { mesh } = entity.getComponent<MeshComponent>(ComponentType.Mesh)!
        //         const rot = entity.getComponent<RotationComponent>(ComponentType.Rotation)!
        //         // mesh.rotation.set(0, rot.y, 0)
        //     }
        // }
    }
}

import { System, World } from '@/engine'
import type { VisualComponent } from '../components/Visual'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '../components/Position'
import type { RotationComponent } from '../components/Rotation'

export class DebugDrawSystem extends System {
    update(world: World) {
        const scene = world.scene
        if (!scene) return

        for (const entity of world.entities.values()) {
            const visual = entity.getComponent<VisualComponent>(ComponentType.Visual)
            const pos = entity.getComponent<PositionComponent>(ComponentType.Position)
            const rot = entity.getComponent<RotationComponent>(ComponentType.Rotation)

            if (!visual || !pos) continue

            for (const item of visual.meshes) {
                item.mesh.position.set(pos.x, pos.y, pos.z)

                if (rot && !item.ignoreRotation) {
                    item.mesh.rotation.set(rot.x, rot.y, rot.z)
                }

                if (!item.mesh.parent) {
                    scene.add(item.mesh)
                }
            }
        }
    }
}

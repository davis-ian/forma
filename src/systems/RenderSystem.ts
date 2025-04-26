import { System, World } from '@/engine'
import type { PositionComponent } from '../components/Position'
import type { MeshComponent } from '../components/Mesh'
import { ComponentType } from '@/engine/ComponentType'

// const DEBUG = false
export class RenderSystem extends System {
    update(world: World) {
        for (const entity of world.entities.values()) {
            if (
                entity.hasComponent(ComponentType.Position) &&
                entity.hasComponent(ComponentType.Mesh)
            ) {
                const pos = entity.getComponent<PositionComponent>(ComponentType.Position)!
                const { mesh } = entity.getComponent<MeshComponent>(ComponentType.Mesh)!

                mesh.position.set(pos.x, pos.y, pos.z)
            }
        }
    }
}

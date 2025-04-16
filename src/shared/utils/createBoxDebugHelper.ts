import type { Entity, World } from '@/engine'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import type { RotationComponent } from '../components/Rotation'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import type { VisualComponent } from '../components/Visual'

export function addBoxDebugHelper(
    world: World,
    entity: Entity,
    size: { width: number; height: number; depth: number },
    offset = { x: 0, y: 0, z: 0 },
    color = 0xff0000
) {
    const pos = entity.getComponent<PositionComponent>(ComponentType.Position)
    const rot = entity.getComponent<RotationComponent>(ComponentType.Rotation)

    const geom = new BoxGeometry(size.width, size.height, size.depth)
    const mat = new MeshBasicMaterial({ color, wireframe: true })
    const mesh = new Mesh(geom, mat)

    if (pos) {
        mesh.position.set(pos.x + offset.x, pos.y + offset.y, pos.z + offset.z)
    }

    if (rot) {
        mesh.rotation.set(rot.x, rot.y, 0)
    }

    world.scene.add(mesh)

    const visual = entity.getComponent<VisualComponent>(ComponentType.Visual)
    if (visual) {
        visual.meshes.push({ mesh, ignoreRotation: false })
    }
}

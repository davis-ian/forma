import { World } from '@/engine'
import { ComponentType, EntityTag } from '@/engine/ComponentType'
import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three'

export function createPlayer(world: World) {
    const entity = world.createEntity()

    entity.addComponent(ComponentType.Position, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.Velocity, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.Input, {})
    entity.addComponent(ComponentType.Mesh, {
        mesh: new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: 'blue' })),
    })
    entity.addComponent(ComponentType.Input, {
        up: false,
        downn: false,
        left: false,
        right: false,
    })

    entity.addTag(EntityTag.CameraFollow)
    entity.addTag(EntityTag.Player)

    entity.addComponent(ComponentType.Hurtbox, {
        width: 1,
        height: 1,
        depth: 1,
        offsetX: 0,
        offsetY: 0.5,
        offsetZ: 0,
    })

    entity.addComponent(ComponentType.Health, {
        current: 5,
        max: 5,
    })
    return entity
}

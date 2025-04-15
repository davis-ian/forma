import { World } from '@/engine'
import { ComponentType, EntityTag } from '@/engine/ComponentType'
import { Mesh, BoxGeometry, MeshStandardMaterial, Scene, MeshBasicMaterial } from 'three'

export function createPlayer(world: World, scene: Scene, x: number, y: number, z: number) {
    const entity = world.createEntity()

    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addComponent(ComponentType.Velocity, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.Input, {})
    const playerMesh = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshStandardMaterial({ color: 'blue' })
    )
    entity.addComponent(ComponentType.Mesh, {
        mesh: playerMesh,
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

    entity.addComponent(ComponentType.Health, { current: 5, max: 5 })

    const bar = new Mesh(new BoxGeometry(1, 0.1, 0.1), new MeshBasicMaterial({ color: 'green' }))
    bar.geometry.translate(0.5, 0, 0)

    scene.add(playerMesh)
    scene.add(bar)

    entity.addComponent(ComponentType.HealthBar, { mesh: bar })
    entity.addComponent(ComponentType.Visual, { meshes: playerMesh, bar })
    return entity
}

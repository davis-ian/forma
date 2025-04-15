import type { World } from '@/engine'
import { ComponentType, EntityTag } from '@/engine/ComponentType'
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene } from 'three'

export function createEnemy(world: World, scene: Scene, x: number, y: number, z: number) {
    const entity = world.createEntity()

    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addComponent(ComponentType.Velocity, { x: 0, y: 0, z: 0 })

    const enemyMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: 'red' }))
    entity.addComponent(ComponentType.Mesh, {
        mesh: enemyMesh,
    })

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

    entity.addTag(EntityTag.Enemy)
    scene.add(enemyMesh)
    scene.add(bar)

    entity.addComponent(ComponentType.HealthBar, { mesh: bar })

    entity.addComponent(ComponentType.Visual, {
        meshes: [enemyMesh, bar],
    })
    return entity
}

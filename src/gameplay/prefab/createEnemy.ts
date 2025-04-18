import type { World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
import type { VisualComponent } from '@/shared/components/Visual'
import { addBoxDeugHelperForEntity } from '@/shared/utils/createBoxDebugHelper'
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three'

const enemy = {
    width: 1,
    height: 1,
    depth: 1,
}

const hurtboxOffset = {
    x: 0,
    y: 0.5,
    z: 0,
}

export function createEnemy(
    world: World,
    x: number,
    y: number,
    z: number,
    maxHealth: number,
    debug: boolean = false
) {
    console.log('CREATING Enemy')
    const scene = world.scene
    if (!scene) {
        console.error('Player create called but no scene  exists!')
    }

    const entity = world.createEntity()

    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addComponent(ComponentType.Rotation, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.Velocity, { x: 0, y: 0, z: 0 })

    const enemyMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: 'red' }))
    entity.addComponent(ComponentType.Mesh, {
        mesh: enemyMesh,
    })

    entity.addComponent(ComponentType.Hurtbox, {
        width: enemy.width,
        height: enemy.height,
        depth: enemy.depth,
        offsetX: hurtboxOffset.x,
        offsetY: hurtboxOffset.y,
        offsetZ: hurtboxOffset.z,
    })

    entity.addComponent(ComponentType.Health, { current: maxHealth, max: maxHealth })

    const bar = new Mesh(new BoxGeometry(1, 0.1, 0.1), new MeshBasicMaterial({ color: 'green' }))
    bar.geometry.translate(0, 0.8, 0)

    entity.addTag(EntityTag.Enemy)
    entity.addTag(EntityTag.RoomInstance)
    scene.add(enemyMesh)
    scene.add(bar)

    entity.addComponent(ComponentType.HealthBar, { mesh: bar })

    const visual: VisualComponent = {
        meshes: [
            { mesh: enemyMesh, ignoreRotation: false },
            { mesh: bar, ignoreRotation: true },
        ],
    }

    entity.addComponent(ComponentType.Visual, visual)

    if (debug) {
        addBoxDeugHelperForEntity(world, entity, { colorOverride: 0x33c9ff })
    }

    return entity
}

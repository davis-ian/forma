import { World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
import type { VisualComponent } from '@/shared/components/Visual'
import { addBoxDebugHelper } from '@/shared/utils/createBoxDebugHelper'
import { Mesh, BoxGeometry, MeshStandardMaterial, Scene, MeshBasicMaterial, Object3D } from 'three'

const player = {
    width: 1,
    height: 1,
    depth: 1,
}

const hurtboxOffset = {
    x: 0,
    y: 0.5,
    z: 0,
}

export function createPlayer(
    world: World,
    x: number,
    y: number,
    z: number,
    debug: boolean = false
) {
    console.log('CREATING PLAYER')
    const scene = world.scene
    if (!scene) {
        console.error('Player create called but no scene  exists!')
    }

    const entity = world.createEntity()

    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addComponent(ComponentType.Rotation, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.Velocity, { x: 0, y: 0, z: 0 })

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
        width: player.width,
        height: player.height,
        depth: player.depth,
        offsetX: hurtboxOffset.x,
        offsetY: hurtboxOffset.y,
        offsetZ: hurtboxOffset.z,
    })

    entity.addComponent(ComponentType.Health, { current: 5, max: 5 })

    const bar = new Mesh(new BoxGeometry(1, 0.1, 0.1), new MeshBasicMaterial({ color: 'green' }))
    bar.geometry.translate(0, 0.8, 0)

    console.log('current scene in player', scene.uuid)
    scene.add(playerMesh)
    scene.add(bar)

    entity.addComponent(ComponentType.HealthBar, { mesh: bar })

    const visual: VisualComponent = {
        meshes: [
            { mesh: playerMesh, ignoreRotation: false },
            { mesh: bar, ignoreRotation: true },
        ],
    }

    entity.addComponent(ComponentType.Visual, visual)

    console.log('PLAYER CREATED SUCCESSFULLY')

    if (debug) {
        addBoxDebugHelper(
            world,
            entity,
            {
                width: player.width,
                height: player.height,
                depth: player.depth,
            },
            {
                x: hurtboxOffset.x,
                y: hurtboxOffset.y,
                z: hurtboxOffset.z,
            },
            0x00ff00
        )
    }

    return entity
}

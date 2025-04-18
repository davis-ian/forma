import { World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
import type { VisualComponent } from '@/shared/components/Visual'
import { addBoxDeugHelperForEntity } from '@/shared/utils/createBoxDebugHelper'
import {
    Mesh,
    BoxGeometry,
    MeshStandardMaterial,
    Scene,
    MeshBasicMaterial,
    Object3D,
    TextureLoader,
    NearestFilter,
} from 'three'
import { createSpriteMeshAsync } from '../level/utils/createSpriteMesh'

const debug = true
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

export async function createPlayer(world: World, x: number, y: number, z: number) {
    console.log('CREATING PLAYER')
    const scene = world.scene
    if (!scene) {
        console.error('Player create called but no scene  exists!')
    }

    const entity = world.createEntity()

    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addComponent(ComponentType.Rotation, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.Velocity, { x: 0, y: 0, z: 0 })

    // const spriteSheet = loadTexture('@/assets/sprites.png')
    // const texture = spriteSheet.clone()
    // texture.repeat.set(1 / 4, 1)
    // texture.offset.set(0 / 4, 0)
    // const playerMaterial = new MeshBasicMaterial({
    //     map: texture,
    //     transparent: true,
    // })

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
    scene.add(bar)

    entity.addComponent(ComponentType.HealthBar, { mesh: bar })

    const loader = new TextureLoader()
    console.log(loader, 'new loader')

    // const playerMesh = new Mesh(
    //     new BoxGeometry(1, 1, 1),
    //     new MeshStandardMaterial({ color: 'blue' })
    //     // playerMaterial
    // )
    const playerMesh = await createSpriteMeshAsync('/assets/Warrior_Red.png', 8, 8, 0, 0, 2)

    entity.addComponent(ComponentType.Mesh, {
        mesh: playerMesh,
    })
    scene.add(playerMesh)

    const visual: VisualComponent = {
        meshes: [
            { mesh: playerMesh, ignoreRotation: false },
            { mesh: bar, ignoreRotation: true },
        ],
    }

    entity.addComponent(ComponentType.Visual, visual)
    console.log('PLAYER CREATED SUCCESSFULLY')

    // if (debug) {
    //     addBoxDeugHelperForEntity(world, entity, { colorOverride: 0xfc33ff })
    // }

    return entity
}

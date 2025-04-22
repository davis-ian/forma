import type { World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
import type { VisualComponent } from '@/components/Visual'

import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { createPlaneMeshAsync } from '../level/utils/createSpriteMesh'
import { HURTBOX_OFFSET, PLAYER_SIZE } from '../constants'
import type { SpriteAnimationComponent } from '@/components/SpriteAnimation'

import { createAiComponent } from '@/components/AI'
import { setAnimationState } from '@/utils/animationUtils'
import { addBoxDeugHelperForEntity } from '@/utils/createBoxDebugHelper'
import { updateEnemyCount } from '@/utils/roomUtils'

export async function createEnemy(
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

    // const enemyMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: 'red' }))
    const enemyMesh = await createPlaneMeshAsync(
        '/assets/Warrior_Blue.png',
        6,
        8,
        0,
        0,
        PLAYER_SIZE.width * 4
    )

    let animationState = {
        currentFrame: 0,
        frameCount: 0,
        frameDuration: 0,
        elapsedTime: 0,
        row: 2,
        columns: 6,
        rows: 8,
        loop: true,
        playing: true,
    } as SpriteAnimationComponent

    entity.addComponent(ComponentType.SpriteAnimation, animationState)
    setAnimationState(animationState, 'playerIdle')

    entity.addComponent(ComponentType.Mesh, {
        mesh: enemyMesh,
    })

    entity.addComponent(ComponentType.Hurtbox, {
        width: PLAYER_SIZE.width,
        height: PLAYER_SIZE.height,
        depth: PLAYER_SIZE.depth,
        offsetX: HURTBOX_OFFSET.x,
        offsetY: HURTBOX_OFFSET.y,
        offsetZ: HURTBOX_OFFSET.z,
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
            { mesh: enemyMesh, ignoreRotation: true },
            { mesh: bar, ignoreRotation: true, ignoreDamageFlash: true },
        ],
    }

    entity.addComponent(ComponentType.Visual, visual)
    entity.addComponent(ComponentType.AI, createAiComponent('Skeleton'))
    entity.addTag(EntityTag.Obstacle)
    if (debug) {
        addBoxDeugHelperForEntity(world, entity, { colorOverride: 0x33c9ff })
    }

    updateEnemyCount(world)
    return entity
}

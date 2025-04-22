import { World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
import type { VisualComponent } from '@/components/Visual'

import { TextureLoader } from 'three'
import { createPlaneMeshAsync } from '../level/utils/createSpriteMesh'
import { HURTBOX_OFFSET, PLAYER_SIZE } from '../constants'
import type { SpriteAnimationComponent } from '@/components/SpriteAnimation'
import { playerHealth } from '@/core/GameState'
import { addBoxDeugHelperForEntity } from '@/utils/createBoxDebugHelper'
import { setAnimationState } from '@/utils/animationUtils'

const debug = false

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

    entity.addComponent(ComponentType.Input, {
        up: false,
        downn: false,
        left: false,
        right: false,
    })

    entity.addTag(EntityTag.CameraFollow)
    entity.addTag(EntityTag.Player)

    entity.addComponent(ComponentType.Hurtbox, {
        width: PLAYER_SIZE.width,
        height: PLAYER_SIZE.height,
        depth: PLAYER_SIZE.depth,
        offsetX: HURTBOX_OFFSET.x,
        offsetY: HURTBOX_OFFSET.y,
        offsetZ: HURTBOX_OFFSET.z,
    })

    const maxHealth = 5
    const currentHealth = 5
    const playerHealthCooldown = 2
    entity.addComponent(ComponentType.Health, {
        current: currentHealth,
        max: maxHealth,
        invulnerableCooldown: playerHealthCooldown,
        invulnerableRemaining: 0,
    })
    playerHealth.value = {
        current: currentHealth,
        max: maxHealth,
    }

    // const bar = new Mesh(new BoxGeometry(1, 0.1, 0.1), new MeshBasicMaterial({ color: 'green' }))
    // bar.geometry.translate(0, 0.8, 0)
    // scene.add(bar)

    // entity.addComponent(ComponentType.HealthBar, { mesh: bar })

    const loader = new TextureLoader()
    console.log(loader, 'new loader')

    entity.addComponent(ComponentType.Dash, {
        isDashing: false,
        dashDuration: 0.2,
        dashTimer: 0,
        cooldown: 1.0,
        cooldownRemaining: 0,
        dashSpeed: 30,
        direction: { x: 0, z: 0 },
    })

    // const playerMesh = new Mesh(
    //     new BoxGeometry(1, 1, 1),
    //     new MeshStandardMaterial({ color: 'blue' })
    //     // playerMaterial
    // )
    const playerMesh = await createPlaneMeshAsync(
        '/assets/Warrior_Red.png',
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
        row: 0,
        columns: 6,
        rows: 8,
        loop: true,
        playing: true,
    } as SpriteAnimationComponent

    entity.addComponent(ComponentType.SpriteAnimation, animationState)
    setAnimationState(animationState, 'playerIdle')

    entity.addComponent(ComponentType.Mesh, {
        mesh: playerMesh,
    })
    scene.add(playerMesh)

    const visual: VisualComponent = {
        meshes: [
            { mesh: playerMesh, ignoreRotation: true },
            // { mesh: bar, ignoreRotation: true },
        ],
    }

    entity.addComponent(ComponentType.Visual, visual)
    console.log('PLAYER CREATED SUCCESSFULLY')

    if (debug) {
        addBoxDeugHelperForEntity(world, entity, { colorOverride: 0xfc33ff })
    }

    return entity
}

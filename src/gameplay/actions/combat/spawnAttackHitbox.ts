import type { Entity, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'
import type { RotationComponent } from '@/shared/components/Rotation'
import { addBoxDeugHelperForEntity } from '@/shared/utils/createBoxDebugHelper'

//TODO: Support different sized hitboxes, current implementation only works with cube hit boxes
// revisit when weapons need different ranges
// Currently using static hitboxes, circle back to this, a dynamic or hybric approach may have better gameplay feel

const hitbox = {
    width: 1,
    height: 1,
    // depth: 0.5,
    depth: 1,
}

export function spawnAttackHitbox(world: World, attackerEntity: Entity, debug: boolean = false) {
    const pos = attackerEntity.getComponent<PositionComponent>(ComponentType.Position)
    const rot = attackerEntity.getComponent<RotationComponent>(ComponentType.Rotation)
    if (!pos || !rot) return

    const forwardX = Math.sin(rot.y)
    const forwardZ = Math.cos(rot.y)

    const spawnDistance = 1.05
    const spawnX = pos.x + forwardX * spawnDistance
    const spawnZ = pos.z + forwardZ * spawnDistance
    const spawnY = pos.y

    const hitboxEntity = world.createEntity()

    hitboxEntity.addComponent(ComponentType.Position, {
        x: spawnX,
        y: spawnY,
        z: spawnZ,
    })

    hitboxEntity.addComponent(ComponentType.Rotation, {
        x: 0,
        y: rot.y,
        z: 0,
    })

    hitboxEntity.addComponent(ComponentType.Hitbox, {
        width: hitbox.width,
        height: hitbox.height,
        depth: hitbox.depth,
        offsetZ: 0,
    })

    hitboxEntity.addComponent(ComponentType.Damage, {
        amount: 1,
        sourceId: attackerEntity.id,
    })

    hitboxEntity.addComponent(ComponentType.Lifespan, {
        timeLeft: 0.1,
    })

    if (debug) {
        hitboxEntity.addComponent(ComponentType.Visual, { meshes: [] })
        addBoxDeugHelperForEntity(world, hitboxEntity)
    }
}

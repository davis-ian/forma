import type { Entity, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'
import type { RotationComponent } from '@/shared/components/Rotation'
import { addBoxDeugHelperForEntity } from '@/shared/utils/createBoxDebugHelper'
import { AttackRegistry } from './AttackRegistry'
import type { VelocityComponent } from '@/shared/components/Velocity'

//TODO: Support different sized hitboxes, current implementation only works with cube hit boxes
// revisit when weapons need different ranges
// Currently using static hitboxes, circle back to this, a dynamic or hybric approach may have better gameplay feel

const hitbox = {
    width: 1,
    height: 1,
    // depth: 0.5,
    depth: 1,
    offsetZ: 0,
}

const SPAWN_DISTANCE = 1.5

function spawnAttackHitbox(
    world: World,
    attackerEntity: Entity,
    attackId: string,
    attackRegistry: AttackRegistry,
    angleOffset: number = 0,
    debug: boolean = false
) {
    const pos = attackerEntity.getComponent<PositionComponent>(ComponentType.Position)
    const rot = attackerEntity.getComponent<RotationComponent>(ComponentType.Rotation)
    if (!pos || !rot) return

    const angle = rot.y + angleOffset
    const forwardX = Math.sin(angle)
    const forwardZ = Math.cos(angle)

    const spawnX = pos.x + forwardX * SPAWN_DISTANCE
    const spawnZ = pos.z + forwardZ * SPAWN_DISTANCE
    const spawnY = pos.y

    const hitboxEntity = world.createEntity()

    hitboxEntity.addComponent(ComponentType.Position, {
        x: spawnX,
        y: spawnY,
        z: spawnZ,
    })

    hitboxEntity.addComponent(ComponentType.Rotation, {
        x: 0,
        y: angle,
        z: 0,
    })

    hitboxEntity.addComponent(ComponentType.Hitbox, {
        width: hitbox.width,
        height: hitbox.height,
        depth: hitbox.depth,
        offsetZ: hitbox.offsetZ,
    })

    hitboxEntity.addComponent(ComponentType.Damage, {
        amount: 1,
        attackId: attackId,
        sourceId: attackerEntity.id,
        damagedEntities: new Set(),
    })

    hitboxEntity.addComponent(ComponentType.Lifespan, {
        timeLeft: 0.1,
    })

    if (attackRegistry) {
        attackRegistry.register(attackId, hitboxEntity.id)
    }

    if (debug) {
        hitboxEntity.addComponent(ComponentType.Visual, { meshes: [] })
        addBoxDeugHelperForEntity(world, hitboxEntity)
    }
}

function applyLunge(world: World, entity: Entity, force: number = 5) {
    const rotation = entity.getComponent<RotationComponent>(ComponentType.Rotation)

    if (!rotation) return

    entity.addComponent(ComponentType.Impulse, {
        x: Math.sin(rotation.y) * (force * 10),
        z: Math.cos(rotation.y) * (force * 10),
    })
}

export function performSweepingAttack(
    world: World,
    attackerEntity: Entity,
    attackRegistry: AttackRegistry,
    debug = false
) {
    const sweepAngles = [-1, -0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8, 1] //sweeping left to right
    const delay = 10 //ms between each hitbox
    const attackId = crypto.randomUUID()

    applyLunge(world, attackerEntity)

    sweepAngles.forEach((offset, i) => {
        setTimeout(() => {
            spawnAttackHitbox(world, attackerEntity, attackId, attackRegistry, offset, debug)
        }, i * delay)
    })
}

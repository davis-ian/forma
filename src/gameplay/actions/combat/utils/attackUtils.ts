import type { Entity, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'
import type { RotationComponent } from '@/shared/components/Rotation'
import { addBoxDeugHelperForEntity } from '@/shared/utils/createBoxDebugHelper'
import { AttackRegistry } from '../AttackRegistry'
import type { SpriteAnimationComponent } from '@/shared/components/SpriteAnimation'
import { setAnimationState } from '@/shared/utils/animationUtils'
import type { InputComponent } from '@/shared/components/Input'
import { HURTBOX_OFFSET } from '@/gameplay/constants'
import type { HurtboxComponent } from '@/shared/components/Hurtbox'

//TODO: Support different sized hitboxes, current implementation only works with cube hit boxes
// revisit when weapons need different ranges
// Currently using static hitboxes, circle back to this, a dynamic or hybric approach may have better gameplay feel

const DEBUG = true
const hitbox = {
    width: 1,
    height: 1,
    // depth: 0.5,
    depth: 2,
    offsetZ: 0,
}

const SPAWN_DISTANCE = 1.05

export function spawnAttackHitbox(
    world: World,
    attackerEntity: Entity,
    attackId: string,
    attackRegistry: AttackRegistry,
    angleOffset: number = 0,
    options?: {
        onlyHit?: 'Player' | 'Enemy' | 'All'
    }
) {
    const pos = attackerEntity.getComponent<PositionComponent>(ComponentType.Position)
    const rot = attackerEntity.getComponent<RotationComponent>(ComponentType.Rotation)
    if (!pos || !rot) return

    const angle = rot.y + angleOffset
    const forwardX = Math.sin(angle)
    const forwardZ = Math.cos(angle)

    const hurtbox = attackerEntity.getComponent<HurtboxComponent>(ComponentType.Hurtbox)

    const spawnX = pos.x + forwardX * SPAWN_DISTANCE
    const spawnZ = pos.z + forwardZ * SPAWN_DISTANCE
    const spawnY = pos.y + (hurtbox?.offsetY ?? 0)

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
        onlyHit: options?.onlyHit ?? 'All',
    })

    hitboxEntity.addComponent(ComponentType.Lifespan, {
        timeLeft: 0.1,
    })

    if (attackRegistry) {
        attackRegistry.register(attackId, hitboxEntity.id)
    }

    if (DEBUG) {
        hitboxEntity.addComponent(ComponentType.Visual, { meshes: [] })
        addBoxDeugHelperForEntity(world, hitboxEntity)
    }
}

export function applyLunge(world: World, entity: Entity, force: number = 3) {
    const rotation = entity.getComponent<RotationComponent>(ComponentType.Rotation)

    if (!rotation) return

    entity.addComponent(ComponentType.Impulse, {
        x: Math.sin(rotation.y) * (force * 10),
        z: Math.cos(rotation.y) * (force * 10),
    })
}

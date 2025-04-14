import type { Entity, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'

export function spawnAttackHitbox(world: World, attackerEntity: Entity) {
    const pos = attackerEntity.getComponent<PositionComponent>(ComponentType.Position)
    if (!pos) return

    const hitboxEntity = world.createEntity()
    hitboxEntity.addComponent(ComponentType.Position, {
        x: pos.x,
        y: pos.y,
        z: pos.z + 1, //In front of player
    })

    hitboxEntity.addComponent(ComponentType.Hitbox, {
        width: 1,
        height: 1,
        depth: 0.5,
        offsetZ: 0,
    })

    hitboxEntity.addComponent(ComponentType.Damage, {
        amount: 1,
        sourceId: attackerEntity.id,
    })

    hitboxEntity.addComponent(ComponentType.Lifespan, {
        timeLeft: 0.2,
    })

    console.log(hitboxEntity, 'hb entity')
}

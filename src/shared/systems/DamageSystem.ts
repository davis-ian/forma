import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '../components/Position'
import type { DamageComponent } from '../components/Damage'
import type { HurtboxComponent } from '../components/Hurtbox'
import type { HealthComponent } from '../components/Health'
import type { HitboxComponent } from '../components/Hitbox'
import { boxesIntersect, getAABB } from '../utils/collisionUtils'

const debug = true

export class DamageSystem extends System {
    update(world: World) {
        //TODO: Current algo is O(n^2) -> revist to handle with better performance

        const entities = Array.from(world.entities.values())

        for (const damageEntity of entities) {
            if (!damageEntity.hasComponent(ComponentType.Damage)) continue

            const damage = damageEntity.getComponent<DamageComponent>(ComponentType.Damage)!
            const damagePos = damageEntity.getComponent<PositionComponent>(ComponentType.Position)!

            if (!damage.damagedEntities) {
                damage.damagedEntities = new Set()
            }

            if (!damagePos) continue
            const damageHitbox = damageEntity.getComponent<HitboxComponent>(ComponentType.Hitbox)!

            const damageBox = getAABB(damagePos, damageHitbox)

            for (const targetEntity of entities) {
                if (!targetEntity.hasComponent(ComponentType.Hurtbox)) continue

                if (damage.damagedEntities.has(targetEntity.id)) {
                    continue
                }

                const hurtbox = targetEntity.getComponent<HurtboxComponent>(ComponentType.Hurtbox)!
                const targetPos = targetEntity.getComponent<PositionComponent>(
                    ComponentType.Position
                )!

                const hurtboxBox = getAABB(targetPos, hurtbox, {
                    x: hurtbox.offsetX ?? 0,
                    y: hurtbox.offsetY ?? 0,
                    z: hurtbox.offsetZ ?? 0,
                })

                if (boxesIntersect(damageBox.min, damageBox.max, hurtboxBox.min, hurtboxBox.max)) {
                    if (targetEntity.id === damage.sourceId) continue

                    const targetHealth = targetEntity.getComponent<HealthComponent>(
                        ComponentType.Health
                    )
                    if (targetHealth) {
                        targetHealth.current -= damage.amount
                        damage.damagedEntities.add(targetEntity.id)
                    }

                    if (debug) {
                        console.log('--- HIT DETECTED ---')
                        console.log('Hitbox AABB min:', damageBox.min)
                        console.log('Hitbox AABB max:', damageBox.max)
                        console.log('Target AABB min:', hurtboxBox.min)
                        console.log('Target AABB max:', hurtboxBox.max)

                        console.log(`Entity ${targetEntity.id} took ${damage.amount} damage`)
                    }
                }
            }
        }
    }
}

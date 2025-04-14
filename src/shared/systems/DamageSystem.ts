import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '../components/Position'
import type { DamageComponent } from '../components/Damage'
import type { HurtboxComponent } from '../components/Hurtbox'
import type { HealthComponent } from '../components/Health'
import type { HitboxComponent } from '../components/Hitbox'

const debug = true

export class DamageSystem extends System {
    update(world: World) {
        //TODO: Current algo is O(n^2) -> revist to handle with better performance

        const entities = world.entities.values()

        for (const damageEntity of entities) {
            if (!damageEntity.hasComponent(ComponentType.Damage)) continue

            const damage = damageEntity.getComponent<DamageComponent>(ComponentType.Damage)!
            const damagePos = damageEntity.getComponent<PositionComponent>(ComponentType.Position)!

            if (!damagePos) continue
            const damageHitbox = damageEntity.getComponent<HitboxComponent>(ComponentType.Hitbox)!

            const damageBox = getAABB(damagePos, damageHitbox)

            for (const targetEntity of entities) {
                if (!targetEntity.hasComponent(ComponentType.Hurtbox)) continue

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
                    const targetHealth = targetEntity.getComponent<HealthComponent>(
                        ComponentType.Health
                    )
                    if (targetHealth) {
                        targetHealth.current -= damage.amount
                    }

                    if (debug) {
                        console.log(`Entity ${targetEntity.id} took ${damage.amount} damage`)
                    }

                    // Optional: destroy hitbox entity if it's one-time use
                    // world.destroyEntity(damageEntity.id)
                }
            }
        }
    }
}

/**
 * Computes an axis-aligned bounding box (AABB) from an entity's position and size.
 * Offsets are optional, allowing hurtboxes or hitboxes to be positioned relative to center.
 */
function getAABB(
    pos: PositionComponent,
    size: { width: number; height: number; depth: number },
    offset = { x: 0, y: 0, z: 0 }
) {
    return {
        min: {
            x: pos.x - size.width / 2 + (offset.x || 0),
            y: pos.y - size.height / 2 + (offset.y || 0),
            z: pos.z - size.depth / 2 + (offset.z || 0),
        },
        max: {
            x: pos.x + size.width / 2 + (offset.x || 0),
            y: pos.y + size.height / 2 + (offset.y || 0),
            z: pos.z + size.depth / 2 + (offset.z || 0),
        },
    }
}

/**
 * Returns true if two AABBs intersect in all three axes.
 * Assumes each box is defined by min and max vectors.
 */
function boxesIntersect(
    aMin: PositionComponent,
    aMax: PositionComponent,
    bMin: PositionComponent,
    bMax: PositionComponent
): boolean {
    return (
        aMin.x <= bMax.x &&
        aMax.x >= bMin.x &&
        aMin.y <= bMax.y &&
        aMax.y >= bMin.y &&
        aMin.z <= bMax.z &&
        aMax.z >= bMin.z
    )
}

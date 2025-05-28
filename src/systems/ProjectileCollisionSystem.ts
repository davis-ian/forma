import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/components/Position'
// import type { VelocityComponent } from '@/components/Velocity'
import type { HitboxComponent } from '@/components/Hitbox'
import type { DamageComponent } from '@/components/Damage'
// import type { HealthComponent } from '@/components/Health'
import type { HurtboxComponent } from '@/components/Hurtbox'
import { EntityTag } from '@/engine/EntityTag'
import { getAABB, boxesIntersect } from '@/utils/collisionUtils'

export class ProjectileCollisionSystem extends System {
    update(world: World): void {
        const projectiles = Array.from(world.entities.values()).filter(
            (e) =>
                e.hasComponent(ComponentType.Projectile) &&
                e.hasComponent(ComponentType.Position) &&
                e.hasComponent(ComponentType.Velocity) &&
                e.hasComponent(ComponentType.Hitbox)
        )

        const targets = Array.from(world.entities.values()).filter(
            (e) =>
                (e.hasComponent(ComponentType.Hurtbox) || e.hasTag(EntityTag.Solid)) &&
                e.hasComponent(ComponentType.Position)
        )

        for (const proj of projectiles) {
            const pos = proj.getComponent<PositionComponent>(ComponentType.Position)!
            const hitbox = proj.getComponent<HitboxComponent>(ComponentType.Hitbox)!
            const damage = proj.getComponent<DamageComponent>(ComponentType.Damage)!

            const projBox = getAABB(pos, hitbox)

            for (const target of targets) {
                if (target.id === damage.sourceId) continue

                const targetPos = target.getComponent<PositionComponent>(ComponentType.Position)!
                const targetHitbox = (target.getComponent(ComponentType.Hurtbox) ||
                    target.getComponent(ComponentType.Hitbox)) as HurtboxComponent | HitboxComponent

                if (!targetHitbox) continue

                const targetBox = getAABB(targetPos, targetHitbox, {
                    x: targetHitbox.offsetX ?? 0,
                    y: targetHitbox.offsetY ?? 0,
                    z: targetHitbox.offsetZ ?? 0,
                })

                const hit = boxesIntersect(projBox.min, projBox.max, targetBox.min, targetBox.max)
                if (!hit) continue
                console.log('PROJECTILE HIT')

                break
            }
        }
    }
}

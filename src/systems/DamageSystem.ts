import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '../components/Position'
import type { DamageComponent } from '../components/Damage'
import type { HurtboxComponent } from '../components/Hurtbox'
import type { HealthComponent } from '../components/Health'
import type { HitboxComponent } from '../components/Hitbox'
import type { DamageFlashComponent } from '../components/DamageFlash'
import { EntityTag } from '@/engine/EntityTag'
import { getAngle } from '@/gameplay/actions/combat/utils/movementUtils'
import { shakeCamera } from '@/core/services/CameraService'
import { hitPauseService } from '@/core/services/HitPauseService'
import { DamageOverlayService } from '@/core/services/DamageOverlayService'
import { boxesIntersect, getAABB } from '@/utils/collisionUtils'
import { debugSettings } from '@/core/GameState'

export class DamageSystem extends System {
    update(world: World) {
        //TODO: Current algo is O(n^2) -> revist to handle with better performance

        const DEBUG = debugSettings.value.logDamage || debugSettings.value.logAll

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
                const targetIsPlayer = targetEntity.hasTag(EntityTag.Player)
                const targetIsEnemy = targetEntity.hasTag(EntityTag.Enemy)

                if (!targetEntity.hasComponent(ComponentType.Hurtbox)) continue

                if (damage.damagedEntities.has(targetEntity.id)) {
                    continue
                }

                if (damage.onlyHit === 'Enemy' && !targetEntity.hasTag(EntityTag.Enemy)) continue
                if (damage.onlyHit === 'Player' && !targetEntity.hasTag(EntityTag.Player)) continue

                const hurtbox = targetEntity.getComponent<HurtboxComponent>(ComponentType.Hurtbox)!
                const targetPos = targetEntity.getComponent<PositionComponent>(
                    ComponentType.Position
                )!

                const hurtboxBox = getAABB(targetPos, hurtbox, {
                    x: hurtbox.offsetX,
                    y: hurtbox.offsetY,
                    z: hurtbox.offsetZ,
                })

                const targetHit = boxesIntersect(
                    damageBox.min,
                    damageBox.max,
                    hurtboxBox.min,
                    hurtboxBox.max
                )

                if (DEBUG && targetIsPlayer) {
                    console.log(damageBox, 'damage box')
                    console.log(hurtboxBox, 'hurtbox box')
                    console.log(targetHit, 'Player: was hit')
                }

                if (DEBUG && targetIsEnemy) {
                    console.log(targetHit, 'Enemy: was hit')
                }
                // console.log(targetHit, 'target was hit')
                if (targetHit) {
                    if (DEBUG) {
                        console.log(targetIsPlayer, 'target is player and was hit')
                        // console.log(targetIsPlayer, 'player was hit')
                    }
                    if (targetEntity.id === damage.sourceId) continue

                    const targetHealth = targetEntity.getComponent<HealthComponent>(
                        ComponentType.Health
                    )

                    if (targetHealth) {
                        if (!targetHealth.recentlyHitBy) {
                            targetHealth.recentlyHitBy = new Set()
                        }

                        if (targetHealth.recentlyHitBy.has(damage.attackId)) {
                            return //already hit by this attack
                        }

                        if (
                            targetHealth?.invulnerableRemaining &&
                            targetHealth?.invulnerableRemaining > 0
                        ) {
                            return
                        }

                        const knockbackForce = 50
                        const angle = getAngle(targetPos, damagePos)

                        const knockbackX = Math.cos(angle) * knockbackForce
                        const knockbackZ = Math.sin(angle) * knockbackForce
                        targetEntity.addComponent(ComponentType.Impulse, {
                            x: knockbackX,
                            z: knockbackZ,
                        })

                        shakeCamera(0.1, 0.5)
                        if (targetIsEnemy) {
                            setTimeout(() => hitPauseService.start(0.07), 30)
                        }
                        if (targetIsPlayer) {
                            hitPauseService.start(0.15)
                            const damageOverlayService = new DamageOverlayService()
                            damageOverlayService.flash()
                        }

                        // targetHealth.current -= damage.amount
                        if (!targetHealth.pendingDamage) targetHealth.pendingDamage = 0
                        targetHealth.pendingDamage += damage.amount
                        targetHealth.recentlyHitBy.add(damage.attackId)
                        damage.damagedEntities.add(targetEntity.id)

                        if (!targetEntity.hasComponent(ComponentType.DamageFlash)) {
                            targetEntity.addComponent<DamageFlashComponent>(
                                ComponentType.DamageFlash,
                                {
                                    flashTime: 0.15,
                                    elapsed: 0,
                                    persitstWhileInvulnerable: targetIsPlayer,
                                }
                            )
                            if (DEBUG) {
                                console.log('Flash  component  added to ', targetEntity.id)
                            }
                        } else {
                            if (DEBUG) {
                                console.log('FLASH already exitsts')
                            }
                        }
                    }

                    if (DEBUG) {
                        console.log('--- HIT DETECTED ---')
                        console.log('Hitbox AABB min:', damageBox.min)
                        console.log('Hitbox AABB max:', damageBox.max)
                        console.log('Target AABB min:', hurtboxBox.min)
                        console.log('Target AABB max:', hurtboxBox.max)

                        console.log(`Entity ${targetEntity.id} took ${damage.amount} damage`)
                    }

                    if (damageEntity.hasComponent(ComponentType.Projectile)) {
                        world.destroyEntity(damageEntity.id)
                    }
                }
            }
        }
    }
}

import { System, type World } from '@/engine'
import { EntityTag } from '@/engine/EntityTag'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import { AttackPerformers, type AIComponent } from '../components/AI'
import type { VelocityComponent } from '../components/Velocity'
import type { AttackRegistry } from '@/gameplay/actions/combat/AttackRegistry'
import type { SpawnPointComponent } from '@/components/SpawnPoint'

const DEBUG = false
const MELEE_ATTACK_RANGE = 1.5

export class EnemyAISystem extends System {
    constructor(private attackRegistry: AttackRegistry) {
        super()
    }
    update(world: World, deltaTime: number): void {
        const player = world.getEntitiesWithTag(EntityTag.Player)[0]
        if (!player) return

        const playerPos = player.getComponent<PositionComponent>(ComponentType.Position)
        if (!playerPos) return

        for (const enemy of world.getEntitiesWithTag(EntityTag.Enemy)) {
            const ai = enemy.getComponent<AIComponent>(ComponentType.AI)
            const pos = enemy.getComponent<PositionComponent>(ComponentType.Position)
            const vel = enemy.getComponent<VelocityComponent>(ComponentType.Velocity)
            const spawn = enemy.getComponent<SpawnPointComponent>(ComponentType.SpawnPoint)

            if (!ai || !pos || !vel || !spawn) continue

            ai.cooldownRemaining = Math.max(ai.cooldownRemaining - deltaTime, 0)

            const playerDx = playerPos.x - pos.x
            const playerDz = playerPos.z - pos.z
            const distToPlayer = Math.hypot(playerDx, playerDz)

            const leashDx = pos.x - spawn.x
            const leashDz = pos.z - spawn.z
            const distFromSpawn = Math.hypot(leashDx, leashDz)

            if (distFromSpawn > spawn.leashRadius) {
                ai.behavior = 'idle'
            }

            switch (ai.behavior) {
                case 'idle':
                    if (distToPlayer <= spawn.leashRadius) {
                        ai.behavior = 'chase'
                    }

                    if (distFromSpawn > 0.1) {
                        const returnDx = spawn.x - pos.x
                        const returnDz = spawn.z - pos.z

                        const returnDist = Math.hypot(returnDx, returnDz)
                        const returnSpeed = 1.5

                        vel.x = (returnDx / returnDist) * returnSpeed
                        vel.z = (returnDz / returnDist) * returnSpeed
                    } else {
                        vel.x = 0
                        vel.z = 0
                    }
                    break

                case 'chase':
                    if (distToPlayer > MELEE_ATTACK_RANGE) {
                        const speed = 2.5
                        vel.x = (playerDx / distToPlayer) * speed
                        vel.z = (playerDz / distToPlayer) * speed
                    } else if (ai.cooldownRemaining <= 0) {
                        if (DEBUG) {
                            console.log('beginning windup')
                        }
                        // Stop moving, begin windup
                        vel.x = 0
                        vel.z = 0
                        ai.windupRemaining = ai.windupDuration
                        ai.behavior = 'windup'
                        enemy.addComponent(ComponentType.WindupDebug, {
                            isActive: true,
                            elapsed: 0,
                            duration: ai.windupDuration,
                        })
                        if (DEBUG) {
                            console.log('windup component added')
                        }
                    } else {
                        vel.x = 0
                        vel.z = 0
                    }
                    break

                case 'windup':
                    ai.windupRemaining -= deltaTime
                    if (ai.windupRemaining <= 0) {
                        ai.behavior = 'attack'
                        enemy.removeComponent(ComponentType.WindupDebug)
                        if (DEBUG) {
                            console.log('ending windup')
                        }
                    }
                    break

                case 'attack':
                    const attackType = ai.currentAttack ?? ai.attacks[0] ?? 'sweep'
                    const attackFn = AttackPerformers[attackType]
                    attackFn({
                        world,
                        entity: enemy,
                        registry: this.attackRegistry,
                        target: playerPos,
                    })
                    ai.cooldownRemaining = ai.attackCooldown
                    ai.behavior = 'cooldown'
                    break

                case 'cooldown':
                    if (ai.cooldownRemaining <= 0) {
                        ai.behavior = 'chase'
                    }
                    break
            }
        }
    }
}

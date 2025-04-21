import { System, type World } from '@/engine'
import { EntityTag } from '@/engine/EntityTag'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import { AttackPerformers, type AIComponent } from '../components/AI'
import type { VelocityComponent } from '../components/Velocity'
import type { AttackRegistry } from '@/gameplay/actions/combat/AttackRegistry'

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

            if (!ai || !pos || !vel) continue

            ai.cooldownRemaining = Math.max(ai.cooldownRemaining - deltaTime, 0)

            if (ai.behavior === 'chase') {
                //  Compute direction vector from enemy to palyer
                const dx = playerPos.x - pos.x
                const dz = playerPos.z - pos.z

                //get normalized diurection
                const dist = Math.hypot(dx, dz)
                const speed = 2.5

                // If enemy is far enough away, move toward the player
                if (dist > MELEE_ATTACK_RANGE) {
                    vel.x = (dx / dist) * speed
                    vel.z = (dz / dist) * speed
                } else {
                    vel.x = 0
                    vel.z = 0

                    if (ai.cooldownRemaining <= 0) {
                        const attackType = ai.currentAttack ?? ai.attacks[0] ?? 'sweep'
                        // performEnemyAttack(world, enemy, this.attackRegistry, playerPos)
                        const attackFn = AttackPerformers[attackType]

                        attackFn({
                            world,
                            entity: enemy,
                            registry: this.attackRegistry,
                            target: playerPos,
                        })
                        ai.cooldownRemaining = ai.attackCooldown
                    }
                }
            }
        }
    }
}

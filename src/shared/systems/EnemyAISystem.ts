import { System, type World } from '@/engine'
import { EntityTag } from '@/engine/EntityTag'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import type { AIComponent } from '../components/AI'
import type { VelocityComponent } from '../components/Velocity'

export class EnemyAISystem extends System {
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

            if (ai.behavior === 'chase') {
                //  Compute direction vector from enemy to palyer
                const dx = playerPos.x - pos.x
                const dz = playerPos.z - pos.z

                //get normalized diurection
                const dist = Math.hypot(dx, dz)
                const speed = 2.5

                // If enemy is far enough away, move toward the player
                if (dist > 1) {
                    vel.x = (dx / dist) * speed
                    vel.z = (dz / dist) * speed
                } else {
                    vel.x = 0
                    vel.z = 0
                }
            }
        }
    }
}

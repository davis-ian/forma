import { System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { HealthComponent } from '../components/Health'
import { EntityTag } from '@/engine/EntityTag'
import { playerHealth, remainingEnemies } from '@/core/GameState'
import type { RoomManager } from '@/gameplay/level/RoomManager'
import { updateEnemyCount } from '../utils/roomUtils'

export class HealthSystem extends System {
    constructor(private roomManager: RoomManager) {
        super()
        this.roomManager = roomManager
    }

    update(world: World) {
        const entities = world.getEntitiesWithComponent(ComponentType.Health)

        for (const entity of entities) {
            const health = entity.getComponent<HealthComponent>(ComponentType.Health)!

            if (health.pendingDamage && health.pendingDamage > 0) {
                health.current -= health.pendingDamage
                health.pendingDamage = 0

                //Clamp
                health.current = Math.max(0, Math.min(health.current, health.max))

                //Sync Player state
                if (entity.hasTag(EntityTag.Player)) {
                    playerHealth.value = {
                        current: health.current,
                        max: health.max,
                    }
                }

                if (health.current <= 0) {
                    console.log(`💀 Entity ${entity.id} died`)

                    //TODO: add death animation, sound, etc

                    world.destroyEntity(entity.id)

                    //Check room cleared

                    const currentRoom = this.roomManager.getCurrentRoom()
                    if (currentRoom) {
                        updateEnemyCount(world)

                        if (remainingEnemies.value === 0) {
                            console.log(' ROOM CLEARED')
                            currentRoom.cleared = true

                            const exitBlockers = world.getEntitiesWithTag(EntityTag.ExitBlocker)
                            for (const blocker of exitBlockers) {
                                world.destroyEntity(blocker.id)
                            }
                        }
                    }
                }
            }
        }
    }
}

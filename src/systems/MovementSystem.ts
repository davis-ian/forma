import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '../components/Position'
import type { VelocityComponent } from '../components/Velocity'
import { EntityTag } from '@/engine/EntityTag'
import { PLAYER_SIZE } from '@/gameplay/constants'
import { boxesIntersect, getAABB } from '@/utils/collisionUtils'

const DEBUG = false

export class MovementSystem extends System {
    update(world: World, deltaTime: number): void {
        const solids = world.getEntitiesWithTag(EntityTag.Solid)

        for (const entity of world.entities.values()) {
            if (
                entity.hasComponent(ComponentType.Position) &&
                entity.hasComponent(ComponentType.Velocity)
            ) {
                const pos = entity.getComponent<PositionComponent>(ComponentType.Position)!
                const vel = entity.getComponent<VelocityComponent>(ComponentType.Velocity)!

                const originalX = pos.x
                const originalZ = pos.z

                //Attempt x mmoveonvemnt
                pos.x += vel.x * deltaTime
                const boxAfterX = getAABB(pos, PLAYER_SIZE)
                const blockedX = solids.some((wall) => {
                    const wallPos = wall.getComponent<PositionComponent>(ComponentType.Position)
                    if (!wallPos) return false

                    const wallBox = getAABB(wallPos, PLAYER_SIZE)
                    return boxesIntersect(boxAfterX.min, boxAfterX.max, wallBox.min, wallBox.max)
                })
                if (blockedX) {
                    pos.x = originalX
                    vel.x = 0
                }

                pos.z += vel.z * deltaTime
                const boxAfterZ = getAABB(pos, PLAYER_SIZE)
                const blockedZ = solids.some((wall) => {
                    const wallPos = wall.getComponent<PositionComponent>(ComponentType.Position)
                    if (!wallPos) return false

                    const wallBox = getAABB(wallPos, PLAYER_SIZE)
                    return boxesIntersect(boxAfterZ.min, boxAfterZ.max, wallBox.min, wallBox.max)
                })
                if (blockedZ) {
                    pos.z = originalZ
                    vel.z = 0
                }

                if (!entity.hasComponent(ComponentType.Input)) {
                    vel.x = 0
                    vel.z = 0
                }
            }
        }
    }
}

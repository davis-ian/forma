import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '../components/Position'
import type { VelocityComponent } from '../components/Velocity'
import { EntityTag } from '@/engine/EntityTag'
import { SizeProfiles } from '@/gameplay/constants'
import { boxesIntersect, getAABB } from '@/utils/collisionUtils'

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

                let entitySize = SizeProfiles.player
                if (entity.hasComponent(ComponentType.Projectile)) {
                    entitySize = SizeProfiles.projectile
                }
                const boxAfterX = getAABB(pos, entitySize)
                const blockedX = solids.some((wall) => {
                    const wallPos = wall.getComponent<PositionComponent>(ComponentType.Position)
                    if (!wallPos) return false

                    const wallBox = getAABB(wallPos, entitySize)
                    return boxesIntersect(boxAfterX.min, boxAfterX.max, wallBox.min, wallBox.max)
                })
                if (blockedX) {
                    console.log('COLLIDE  X')

                    pos.x = originalX
                    vel.x = 0
                    if (entity.hasComponent(ComponentType.Projectile)) {
                        world.destroyEntity(entity.id)
                    }
                }

                pos.z += vel.z * deltaTime
                const boxAfterZ = getAABB(pos, entitySize)
                const blockedZ = solids.some((wall) => {
                    const wallPos = wall.getComponent<PositionComponent>(ComponentType.Position)
                    if (!wallPos) return false

                    const wallBox = getAABB(wallPos, entitySize)
                    return boxesIntersect(boxAfterZ.min, boxAfterZ.max, wallBox.min, wallBox.max)
                })
                if (blockedZ) {
                    console.log('COLLIDE  Z')
                    pos.z = originalZ
                    vel.z = 0
                    if (entity.hasComponent(ComponentType.Projectile)) {
                        world.destroyEntity(entity.id)
                    }
                }

                if (
                    !entity.hasComponent(ComponentType.Input) &&
                    !entity.hasComponent(ComponentType.Projectile)
                ) {
                    vel.x = 0
                    vel.z = 0
                }
            }
        }
    }
}

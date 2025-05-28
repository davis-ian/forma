import { System, type World } from '@/engine'
import { EntityTag } from '@/engine/EntityTag'
import { RoomManager } from '@/gameplay/level/RoomManager'
import { ComponentType } from '@/engine/ComponentType'
import { isTransitioning, runRoomTransition } from '@/core/GameController'
import { boxesIntersect, getAABB } from '@/utils/collisionUtils'
import type { PositionComponent } from '@/components/Position'
import type { DirectionComponent } from '@/components/Direction'
import { debugSettings } from '@/core/GameState'
import { SizeProfiles } from '@/gameplay/constants'

let logged = false
export class RoomExitDetectionSystem extends System {
    constructor(private roomManager: RoomManager) {
        super()
        this.roomManager = roomManager
    }

    update(world: World) {
        const DEBUG = debugSettings.value.logAll || debugSettings.value.logEnvironment

        if (isTransitioning.value) return

        // if (remainingEnemies.value > 0) return
        // console.log('active room')
        //TODO: Support multiple players here
        const playerSize = SizeProfiles.player
        const player = world.getEntitiesWithTag(EntityTag.Player)[0]
        if (!player) return

        const pos = player.getComponent<PositionComponent>(ComponentType.Position)
        if (!pos) return

        const playerBox = getAABB(pos, playerSize)

        const exits = world.getEntitiesWithTag(EntityTag.ExitDoor)

        if (!logged) {
            if (DEBUG) {
                console.log(exits, 'exits')
            }
            logged = true
        }
        for (const exit of exits) {
            const exitPos = exit.getComponent<PositionComponent>(ComponentType.Position)
            if (!exitPos) continue

            // if (DEBUG) {
            //     // console.log(exitPos, 'exit')
            // }

            const exitBox = getAABB(exitPos, playerSize)
            const intersecting = boxesIntersect(
                playerBox.min,
                playerBox.max,
                exitBox.min,
                exitBox.max
            )

            if (intersecting) {
                // console.log('INTERSECT WITH  EXIT')
                const dirComp = exit.getComponent<DirectionComponent>(ComponentType.Direction)
                if (dirComp) {
                    const targetRoom = this.roomManager.getNeighborRoom(dirComp.direction)

                    if (targetRoom) {
                        runRoomTransition(() => {
                            this.roomManager.transitionTo(targetRoom.id, dirComp.direction)
                        })
                    }
                }

                break
            }
        }
    }
}

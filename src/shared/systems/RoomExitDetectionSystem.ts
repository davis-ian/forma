import { System, type World } from '@/engine'
import { EntityTag } from '@/engine/EntityTag'
import { RoomManager } from '@/gameplay/level/RoomManager'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import { boxesIntersect, getAABB } from '../utils/collisionUtils'
import { opposite } from '@/gameplay/level/RoomGraph'
import type { DirectionComponent } from '../components/DirectionComponent'
import { PLAYER_SIZE } from '@/gameplay/constants'

let logged = false
export class RoomExitDetectionSystem extends System {
    constructor(private roomManager: RoomManager) {
        super()
        this.roomManager = roomManager
    }

    update(world: World) {
        // console.log('active room')
        //TODO: Support multiple players here
        const player = world.getEntitiesWithTag(EntityTag.Player)[0]
        if (!player) return

        const pos = player.getComponent<PositionComponent>(ComponentType.Position)
        if (!pos) return

        const playerBox = getAABB(pos, PLAYER_SIZE)

        const exits = world.getEntitiesWithTag(EntityTag.ExitDoor)

        if (!logged) {
            console.log(exits, 'exits')
            logged = true
        }
        for (const exit of exits) {
            const exitPos = exit.getComponent<PositionComponent>(ComponentType.Position)
            if (!exitPos) continue

            // console.log(exitPos, 'exit')

            const exitBox = getAABB(exitPos, PLAYER_SIZE)
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
                        this.roomManager.transitionTo(targetRoom.id, dirComp.direction)
                    }
                }
            }
        }
    }
}

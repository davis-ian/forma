import { System, type World } from '@/engine'
import { EntityTag } from '@/engine/EntityTag'
import { RoomManager } from '@/gameplay/level/RoomManager'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import { getExitDirection, getTileAtWorldPosition } from '../utils/roomUtils'
import { TileType } from '@/gameplay/level/types'

var logged: boolean = false
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
        const currentRoom = this.roomManager.getCurrentRoom()
        // console.log(currentRoom, 'current room')
        if (!currentRoom || !pos) return

        //TODO: we may want to improve this later
        const tile = getTileAtWorldPosition(pos.x, pos.z, currentRoom)
        if (tile === TileType.Exit) {
            // console.log('🚪 Player is on an exit tile! Transitioning...')
            const exitDirection = getExitDirection(pos.x, pos.z, currentRoom)
            // console.log(exitDirection, 'exit direction')

            if (!exitDirection) return
            const nextRoom = this.roomManager.getNeighborRoom(exitDirection)

            if (!nextRoom) return
            this.roomManager.transitionTo(nextRoom?.id, exitDirection)
        }
        // console.log(player, 'player @ EXIT DETECT')

        // if player steps onto exit tile
        //find room exit tile leads to
    }
}

import { System, type World } from '@/engine'
import { EntityTag } from '@/engine/EntityTag'
import { RoomManager } from '@/gameplay/level/RoomManager'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import { isPlayerOnExitTile } from '../utils/helpers'
import { generateRoomDefinition } from '@/gameplay/level/spawnRoom'

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
        if (!currentRoom) return

        const currentRoomDef = generateRoomDefinition(currentRoom!)

        if (pos && currentRoom && isPlayerOnExitTile(pos.x, pos.z, currentRoomDef)) {
            console.log('🚪 Player is on an exit tile! Transitioning...')
            // const exitDirection = getExitDirection(pos, currentRoomDef)
            // this.roomManager.tranmsitionTo(exitDirection)
        }
        // console.log(player, 'player @ EXIT DETECT')

        // if player steps onto exit tile
        //find room exit tile leads to

        // const entities = world.getEntitiesWithComponent(ComponentType.Health)

        // for (const entity of entities) {
        //     const health = entity.getComponent<HealthComponent>(ComponentType.Health)!

        //     //Clamp
        //     health.current = Math.max(0, Math.min(health.current, health.max))

        //     if (health.current <= 0) {
        //         console.log(`💀 Entity ${entity.id} died`)

        //         //TODO: add death animation, sound, etc

        //         world.destroyEntity(entity.id)
        //     }
        // }
    }
}

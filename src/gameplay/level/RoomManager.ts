import { type World } from '@/engine'
import type { Direction, Room } from './types'
import { getRoomOffset, renderRoomToScene } from './roomFactory'
import { EntityTag } from '@/engine/EntityTag'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/components/Position'
import { teleportPlayer } from '@/utils/roomUtils'

//Tracks which room is 'active'
//spawns active room, removes previous
//handles transition animation

const DEBUG = false

export class RoomManager {
    constructor(
        private world: World,
        private roomGraph: Map<string, Room>
    ) {}
    activeRoomId: string | null = null

    transitionTo(roomId: string, entranceFrom: Direction): void {
        if (DEBUG) {
            console.log('TRANSITION FROM', entranceFrom)
            console.log('TRANSITION TO', roomId)
        }

        const room = this.getRoom(roomId)

        if (!room) {
            console.warn('room not found in roomGraph')
            return
        }

        // Mark visited room for FOW
        room.visited = true

        // Destroy current room visuals/entities
        this.cleanUpCurrentRoom()

        // If room has been visited before, re-render it in its saved state
        renderRoomToScene(this.world, room!)

        // Move player to entrance position
        const player = this.world.getEntitiesWithTag(EntityTag.Player)[0]
        if (player && entranceFrom) {
            const position = player.getComponent<PositionComponent>(ComponentType.Position)
            const { x, z } = this.getEntranceTilePosition(room, entranceFrom)

            if (position) {
                teleportPlayer(this.world, x, position.y, z)
            }
        }

        this.activeRoomId = room.id
        //4 play animation if needed
    }

    getCurrentRoom(): Room | null {
        return this.getRoom(this.activeRoomId)
    }

    cleanUpCurrentRoom() {
        if (DEBUG) {
            console.log('cleaning up room!')
        }
        const entities = this.world.getEntitiesWithTag(EntityTag.RoomInstance)

        if (DEBUG) {
            console.log(entities, 'entities to clean')
        }
        for (const entity of entities) {
            this.world.destroyEntity(entity.id)
        }
    }

    getNeighborRoom(direction: Direction): Room | null {
        const currentRoom = this.getCurrentRoom()
        if (!currentRoom) return null

        const [dx, dy] = directionDelta[direction]
        const neighborId = `${currentRoom.x + dx},${currentRoom.y + dy}`
        return this.getRoom(neighborId)
    }

    getRoomGraph() {
        return this.roomGraph
    }

    setActiveRoom(id: string) {
        const room = this.getRoom(id)
        if (!room) {
            throw new Error(`Room ${id} does not exist in graph`)
        }

        room.visited = true
        this.activeRoomId = id
    }

    getEntranceTilePosition(room: Room, from: Direction): { x: number; z: number } {
        const { offsetX, offsetZ } = getRoomOffset(room)
        const centerX = Math.floor(room.width / 2)
        const centerZ = Math.floor(room.height / 2)

        switch (from) {
            case 'top':
                return { x: offsetX + centerX, z: offsetZ + room.height - 3 }
            case 'bottom':
                return { x: offsetX + centerX, z: offsetZ + 2 }
            case 'left':
                return { x: offsetX + room.width - 3, z: offsetZ + centerZ }
            case 'right':
                return { x: offsetX + 2, z: offsetZ + centerZ }
        }
    }

    private getRoom(roomId: string | null) {
        return roomId ? (this.roomGraph.get(roomId) ?? null) : null
    }
}

const directionDelta: Record<Direction, [dx: number, dy: number]> = {
    top: [0, -1],
    bottom: [0, 1],
    left: [-1, 0],
    right: [1, 0],
}

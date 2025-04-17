import type { World } from '@/engine'
import type { Direction, Room } from './types'
import { generateRoomDefinition, spawnRoom } from './spawnRoom'

//Tracks which room is 'active'
//spawns active room, removes previous
//handles transition animation

export class RoomManager {
    constructor(
        private world: World,
        private roomGraph: Map<string, Room>
    ) {}

    activeRoomId: string | null = null

    transitionTo(
        roomId: string,
        entranceFrom?: Direction,
        options?: {
            animate?: boolean
        }
    ): void {
        console.log('TRANSITION FROM', entranceFrom)
        console.log('TRANSITION TO', roomId)

        const room = this.getRoom(roomId)

        if (!room) {
            console.log('room not found in roomGraph')
        }

        // 1. remove  old room entities

        //2 spawn new room via spawnRoom()
        const def = generateRoomDefinition(room!)
        console.log(def, 'room def INTO')
        spawnRoom(this.world, def)

        //3 move player to the entrance tile

        //4 play animation if needed
    }

    getCurrentRoom(): Room | null {
        return this.getRoom(this.activeRoomId)
    }

    setActiveRoom(id: string) {
        if (!this.roomGraph.has(id)) {
            throw new Error(`Room ${id} does not exist in graph`)
        }

        this.activeRoomId = id
    }

    destroy(): void {
        //cleanup if needed (eg before restarting level)
    }

    private getRoom(roomId: string | null) {
        return roomId ? (this.roomGraph.get(roomId) ?? null) : null
    }
}

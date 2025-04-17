import type { World } from '@/engine'
import { generateRoomGraph } from './RoomGraph'
import type { Room } from './types'
import { generateRoomDefinition, spawnRoom } from './spawnRoom'

export class LevelGenerator {
    private graph: Map<string, Room> = new Map()
    init(world: World, maxRooms: number) {
        this.graph = generateRoomGraph(maxRooms)

        const startRoom = Array.from(this.graph.values()).filter((r) => r.tags.includes('start'))[0]

        if (!startRoom) {
            throw new Error('Start room not found in this graph')
        }

        const def = generateRoomDefinition(startRoom)
        spawnRoom(world, def)

        return this.graph
    }

    getRoomGraph() {
        return this.graph
    }
}

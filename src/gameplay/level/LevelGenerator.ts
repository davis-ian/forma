import type { World } from '@/engine'
import { generateRoomGraph } from './RoomGraph'
import type { Room } from './types'
import { renderRoomToScene } from './roomFactory'

export class LevelGenerator {
    private graph: Map<string, Room> = new Map()
    init(world: World, maxRooms: number) {
        this.graph = generateRoomGraph(maxRooms)

        const startRoom = Array.from(this.graph.values()).filter((r) => r.tags.includes('start'))[0]

        if (!startRoom) {
            throw new Error('Start room not found in this graph')
        }

        //Spawn all rooms for debugging
        // for (const room of this.graph.values()) {
        //     renderRoomToScene(world, room)
        // }
        renderRoomToScene(world, startRoom)

        return this.graph
    }

    getRoomGraph() {
        return this.graph
    }
}

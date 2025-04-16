/*

Represent the level as a set of room nodes with directional connections.

Each node contains a RoomDefinition and a position offset (x, y in grid space).

Prevent overlap by tracking used grid positions.

Hint: Depth-first placement works well if you’re aiming for dungeon-style chains. Use a Set<string> to track used (x,y) grid keys.

Tracks placed rooms in a grid (Map<string, Room>)

Starts with a seedRoom at (0, 0)

Expands in random directions, up to maxRooms

Calls generateRoom for each new placement

*/

import type { RoomDefinition } from './types'

export class RoomGraph {
    rooms: PlacedRoom[] = []

    generate(seedRoom: RoomDefinition, roomTemplates: RoomDefinition[], maxRooms: number): void {
        // place seed room

        // pick directions

        //add non-overlapping rooms

        console.log('🟥')
    }
}

export interface PlacedRoom {
    room: RoomDefinition
    gridX: number
    grixY: number
}

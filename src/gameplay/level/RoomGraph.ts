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

import { createRoomMeta } from './roomFactory'
import type { Direction, Room, RoomNode } from './types'

// Define valid expansion directions and their corresponding (x, y) deltas
const directions: Direction[] = ['top', 'bottom', 'left', 'right']
const dirOffsets = {
    top: [0, -1],
    bottom: [0, 1],
    left: [-1, 0],
    right: [1, 0],
}

//Convert a grid position to a unique string key for tracking visited coordinates
function posKey(x: number, y: number): string {
    return `${x},${y}`
}

// Return the opposite direction, used for linking rooms bidirectionally
function opposite(dir: Direction): Direction {
    switch (dir) {
        case 'top':
            return 'bottom'
        case 'bottom':
            return 'top'
        case 'left':
            return 'right'
        case 'right':
            return 'left'
    }
}

/**
 * Generates a dungeon-like room  graph with directional links.
 * Each room is placed in grid space (x, y), and no two rooms overlap.
 * Returns a map  of string keys to Room objects
 * @param maxRooms
 * @param startX
 * @param startY
 * @returns
 */
export function generateRoomGraph(maxRooms: number): Map<string, Room> {
    const roomMap = new Map<string, Room>()
    const visited = new Set<string>()
    const stack: RoomNode[] = [{ x: 0, y: 0 }] // start at (0, 0)

    while (stack.length && roomMap.size < maxRooms) {
        const { x, y, from } = stack.pop()!
        const id = posKey(x, y)
        if (visited.has(id)) continue

        const room = createRoomMeta(x, y, from)
        if (roomMap.size === 0) {
            room.tags.push('start')
        }

        visited.add(id)
        roomMap.set(id, room)

        const neighbors = getUnvisitedNeighbors(x, y, visited, maxRooms, roomMap.size)

        for (const neighbor of neighbors) {
            const { x: nx, y: ny, from: dirFrom } = neighbor
            const neighborKey = posKey(nx, ny)

            // Current room gets exit toward neighbor
            room.exits.push(dirFrom ? opposite(dirFrom) : 'top')

            // Ensure neighbor room is created
            let neighborRoom = roomMap.get(neighborKey)
            if (!neighborRoom) {
                neighborRoom = createRoomMeta(nx, ny, dirFrom)
                roomMap.set(neighborKey, neighborRoom)
            }

            // Neighbor room gets exit pointing back
            neighborRoom.exits.push(dirFrom!)
            stack.push(neighbor)
        }
    }

    // Mark final room
    const roomArr = Array.from(roomMap.values())
    const lastRoom = roomArr[roomArr.length - 1]
    if (lastRoom) {
        lastRoom.tags ??= []
        lastRoom.tags.push('end')
    }

    // 🔒 Final pruning: remove exits that lead nowhere or aren't reciprocated
    for (const room of roomMap.values()) {
        room.exits = room.exits.filter((dir) => {
            const [dx, dy] = directionDelta[dir]
            const neighborKey = posKey(room.x + dx, room.y + dy)
            const neighborRoom = roomMap.get(neighborKey)
            return neighborRoom?.exits.includes(opposite(dir))
        })
    }

    return roomMap
}

export function getUnvisitedNeighbors(
    x: number,
    y: number,
    visited: Set<string>,
    maxRooms: number,
    currentCount: number
): RoomNode[] {
    const result: RoomNode[] = []

    // Shuffle directions for randomness and organic layout
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5)

    for (const dir of shuffledDirections) {
        const [dx, dy] = dirOffsets[dir]
        const nx = x + dx
        const ny = y + dy
        const neighborKey = posKey(nx, ny)

        // Only que this  direction if  its unused and under room limit
        if (!visited.has(neighborKey) && currentCount < maxRooms) {
            result.push({ x: nx, y: ny, from: opposite(dir) })
        }
    }

    return result
}

const directionDelta: Record<Direction, [dx: number, dy: number]> = {
    top: [0, -1],
    bottom: [0, 1],
    left: [-1, 0],
    right: [1, 0],
}

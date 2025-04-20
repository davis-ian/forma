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

const MAX_NEIGHBORS = 2
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
export function opposite(dir: Direction): Direction {
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
    const queue: Room[] = []

    const startRoom = createRoomMeta(0, 0)
    roomMap.set(posKey(0, 0), startRoom)
    visited.add(posKey(0, 0))
    queue.push(startRoom)

    // --- Room Expansion ---
    while (queue.length && roomMap.size < maxRooms) {
        const current = queue.shift()!
        const { x, y } = current
        const shuffledDirs = shuffle(directions)

        for (const dir of shuffledDirs) {
            if (roomMap.size >= maxRooms) break
            if (current.exits.length >= MAX_NEIGHBORS) break

            const [dx, dy] = directionDelta[dir]
            const nx = x + dx
            const ny = y + dy
            const key = posKey(nx, ny)

            if (visited.has(key)) continue

            const neighbor = createRoomMeta(nx, ny)
            neighbor.exits.push(opposite(dir)) // link back
            roomMap.set(key, neighbor)
            visited.add(key)

            current.exits.push(dir)
            queue.push(neighbor)
        }
    }

    // --- Find farthest room from startRoom (0,0) ---
    let farthestRoom = startRoom
    let maxDist = -1
    const rooms = Array.from(roomMap.values())

    for (const room of rooms) {
        const dist = Math.abs(room.x - 0) + Math.abs(room.y - 0)
        if (dist > maxDist) {
            maxDist = dist
            farthestRoom = room
        }
    }

    startRoom.tags.push('start')
    startRoom.cleared = true
    if (!farthestRoom.tags.includes('start')) {
        farthestRoom.tags.push('end')
    }

    // Tag rooms to spawn enemies (not start or end rooms)
    for (const room of rooms) {
        if (!room.tags.includes('start') && !room.tags.includes('end')) {
            room.tags.push('spawn')
        }
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

export function shuffle<T>(array: T[]): T[] {
    const arr = [...array] // avoid mutating the original
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

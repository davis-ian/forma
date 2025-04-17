import type { Direction, Room } from './types'
import { getRandomInt } from './utils/random'

// const minSize = 20
// const maxSize = 25
const width = 20
const height = 20

export function generateRoom(x: number, y: number, from?: Direction): Room {
    const id = `${x},${y}`
    const exits: Direction[] = []

    if (from) {
        exits.push(from)
    }

    return {
        id,
        x,
        y,
        // width: getRandomInt(minSize, maxSize),
        // height: getRandomInt(minSize, maxSize),
        width,
        height,
        exits: exits,
        tags: [],
    }
}

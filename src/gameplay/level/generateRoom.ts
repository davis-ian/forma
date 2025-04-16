import type { Direction, Room } from './types'
import { getRandomInt } from './utils/random'

const minSize = 5
const maxSize = 10

export function generateRoom(x: number, y: number, fromDirection: Direction): Room {
    const exits: Direction[] = []

    const allDirections: Direction[] = ['top', 'bottom', 'left', 'right']
    const possibleExits: Direction[] = allDirections.filter(
        (dir) => dir !== oppositeOf(fromDirection)
    )

    for (let i = 0; i < getRandomInt(1, 4); i++) {
        const [exit] = possibleExits.splice(getRandomInt(0, possibleExits.length - 1), 1)
        exits.push(exit)
    }

    return {
        id: crypto.randomUUID(),
        x,
        y,
        width: getRandomInt(minSize, maxSize),
        height: getRandomInt(minSize, maxSize),
        exits: [fromDirection, ...exits],
    }
}

function oppositeOf(dir: Direction): Direction {
    return {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
    }[dir] as Direction
}

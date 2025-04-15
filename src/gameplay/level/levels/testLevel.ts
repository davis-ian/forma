// src/gameplay/levels/testLevel.ts
// export const testLevel = [
//     ['#', '#', '#', '#', '#', '#', '#'],
//     ['#', ' ', ' ', 'C', ' ', ' ', '#'],
//     ['#', ' ', 'P', ' ', 'S', ' ', '#'],
//     ['#', ' ', ' ', ' ', ' ', ' ', '#'],
//     ['#', '#', '#', '#', '#', '#', '#'],
// ]

import { TileType } from '@/gameplay/level/TileType'

const W = TileType.Wall
const F = TileType.Floor
const P = TileType.PlayerStart
const E = TileType.Enemy
// const C = TileType.ChoppingStation

export const testLevel: TileType[][] = [
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, W, F, F, F, E, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, E, F, F, F, F, F, W],
    [F, F, F, F, F, F, P, F, W],
    [F, F, F, F, F, F, F, F, F],
]

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
// const C = TileType.ChoppingStation

export const testLevel: TileType[][] = [
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, W, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, P],
]

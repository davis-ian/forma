import type { RoomDefinition } from '../RoomDefinition'
import { TileType } from '../TileType'

const W = TileType.Wall
const F = TileType.Floor
const P = TileType.PlayerStart
const E = TileType.Enemy

export const tiles1: TileType[][] = [
    [E, F, F, F, F, F, W, W, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, P, F, F, W],
    [F, F, F, F, F, F, F, F, W],
    [F, F, F, F, F, F, F, F, F],
]

export const room1: RoomDefinition = {
    tiles: tiles1,
    offsetX: 0,
    offsetZ: 0,
    wallColor: '#444444',
    floorColor: '#222222',
    enemyWaves: [[{ x: 1, z: 1 }], [{ x: 5, z: 1 }]],
}

export const tiles2: TileType[][] = [
    [W, W, W, W, W, W],
    [W, F, F, F, F, W],
    [W, F, P, F, E, W],
    [W, F, F, F, F, W],
    [W, W, W, W, W, W],
]

export const room2: RoomDefinition = {
    tiles: tiles2,
    offsetX: 10,
    offsetZ: 0,
    wallColor: '#3c3c3c',
    floorColor: '#1a1a1a',
    enemyWaves: [[{ x: 4, z: 2 }]], // optional, see below
}

export const tiles3: TileType[][] = [
    [W, W, W, W, W],
    [W, F, F, F, W],
    [W, F, E, F, W],
    [W, F, F, P, W],
    [W, W, W, W, W],
]

export const room3: RoomDefinition = {
    tiles: tiles3,
    offsetX: 0,
    offsetZ: 10,
    wallColor: '#552222',
    floorColor: '#220000',
}

export const tiles4: TileType[][] = [
    [W, W, W, W, W],
    [W, E, F, E, W],
    [W, F, P, F, W],
    [W, F, F, F, W],
    [W, W, W, W, W],
]

export const room4: RoomDefinition = {
    tiles: tiles4,
    offsetX: 10,
    offsetZ: 10,
    wallColor: '#224422',
    floorColor: '#001100',
}

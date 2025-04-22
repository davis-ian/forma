export enum TileType {
    Floor = 'floor',
    Wall = 'wall',
    PlayerStart = 'playerstart',
    Enemy = 'enemy',
    Exit = 'exit',
}

export interface Room {
    id: string
    x: number
    y: number
    width: number
    height: number
    exits: Direction[]
    tags: string[]
    visited?: boolean
    cleared?: boolean
    state?: RoomState
}

export interface RoomState {
    visited: boolean
    cleared: boolean
    defeatedEnemyIds: string[]
    spawnedLootIds: string[]
}
export interface RoomNode {
    x: number
    y: number
    from?: Direction
}

export type Direction = 'top' | 'bottom' | 'left' | 'right'

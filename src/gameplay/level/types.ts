export enum TileType {
    Floor = 'floor',
    Wall = 'wall',
    PlayerStart = 'playerstart',
    Enemy = 'enemy',
    Exit = 'exit',
}

export interface RoomDefinition {
    height: number
    width: number
    tiles: TileType[][]
    offsetX: number
    offsetZ: number
    floorColor: string
    wallColor: string
    enemyWaves?: { x: number; z: number }[][]
    tags?: string[] //eg ["start", "boss", "shop"]
}

export interface Room {
    id: string
    x: number
    y: number
    width: number
    height: number
    exits: Direction[]
}

export type Direction = 'top' | 'bottom' | 'left' | 'right'

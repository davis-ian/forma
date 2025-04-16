import type { TileType } from './TileType'

export interface RoomDefinition {
    tiles: TileType[][]
    offsetX: number
    offsetZ: number
    floorColor: string
    wallColor: string
    enemyWaves?: { x: number; z: number }[][]
    tags?: string[] //eg ["start", "boss", "shop"]
}

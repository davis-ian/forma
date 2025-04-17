import { TileType, type RoomDefinition } from '@/gameplay/level/types'

export function isPlayerOnExitTile(
    playerX: number,
    playerZ: number,
    room: RoomDefinition
): boolean {
    const tileX = Math.floor(playerX) - room.offsetX
    const tileZ = Math.floor(playerZ) - room.offsetZ

    //Prevent out of bounds
    if (tileZ < 0 || tileZ >= room.tiles.length || tileX < 0 || tileX >= room.tiles[0].length) {
        return false
    }

    return room.tiles[tileZ][tileX] === TileType.Exit
}

import type { World } from '@/engine'
import { getRoomOffset, getRoomTiles } from '@/gameplay/level/roomFactory'
import { TileType, type Direction, type Room } from '@/gameplay/level/types'
import type { PositionComponent } from '../components/Position'
import type { VelocityComponent } from '../components/Velocity'
import { EntityTag } from '@/engine/EntityTag'
import { ComponentType } from '@/engine/ComponentType'

export function getTileAtWorldPosition(x: number, z: number, room: Room): TileType | null {
    const tiles = getRoomTiles(room)
    const { offsetX, offsetZ } = getRoomOffset(room)

    const tileX = Math.floor(x) - offsetX
    const tileZ = Math.floor(z) - offsetZ

    if (tileZ < 0 || tileZ >= tiles.length || tileX < 0 || tileX >= tiles[0].length) {
        return null
    }

    return tiles[tileZ][tileX]
}

export function getExitDirection(x: number, z: number, room: Room) {
    const { offsetX, offsetZ } = getRoomOffset(room)

    const localX = Math.floor(x) - offsetX
    const localZ = Math.floor(z) - offsetZ

    for (const direction of room.exits) {
        switch (direction) {
            case 'top':
                if (localZ === 0) return 'top'
                break
            case 'bottom':
                if (localZ === room.height - 1) return 'bottom'
                break
            case 'left':
                if (localX === 0) return 'left'
                break
            case 'right':
                if (localX === room.width - 1) return 'right'
                break
        }
    }
    return null
}

export function teleportPlayer(world: World, x: number, y: number, z: number) {
    console.log('TELEPORTING PLAYER')
    const player = world.getEntitiesWithTag(EntityTag.Player)[0]
    if (!player) return

    const pos = player.getComponent<PositionComponent>(ComponentType.Position)
    const vel = player.getComponent<VelocityComponent>(ComponentType.Velocity)

    if (pos) {
        pos.x = x
        pos.y = y
        pos.z = z
    }

    if (vel) {
        vel.x = 0
        vel.y = 0
        vel.z = 0
    }
}

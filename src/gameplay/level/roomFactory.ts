import type { World } from '@/engine'
import { BoxGeometry, Mesh, MeshStandardMaterial, type Scene } from 'three'
import { createPlayer } from '@/gameplay/prefab/createPlayer'
import { createEnemy } from '@/gameplay/prefab/createEnemy'
import { TileType, type Direction, type Room, type RoomState } from './types'
import { EntityTag } from '@/engine/EntityTag'
import { ComponentType } from '@/engine/ComponentType'
import type { VisualComponent } from '@/shared/components/Visual'

// Room size & visuals
const ROOM_WIDTH = 20
const ROOM_HEIGHT = 10
// const ROOM_PADDING = 1.5
const ROOM_PADDING = 1
const TILE_SIZE = 1
const FLOOR_HEIGHT = 0.1
const WALL_Y = TILE_SIZE / 2
const FLOOR_Y = 0
const PLAYER_Y = FLOOR_HEIGHT / 2 + 1
const ENEMY_Y = WALL_Y

const DEFAULT_BORDER_COLOR = '#5500aa'
const EXIT_COLOR = '#fc33ff'
const START_BORDER_COLOR = '#00e676'
const END_BORDER_COLOR = '#ff5252'

const DEBUG = true

// -----------------------------
// Public API
// -----------------------------

export function createRoomMeta(x: number, y: number, from?: Direction): Room {
    const id = `${x},${y}`
    const exits: Direction[] = from ? [from] : []

    return {
        id,
        x,
        y,
        width: ROOM_WIDTH,
        height: ROOM_HEIGHT,
        exits,
        tags: [],
    }
}

/**
 * Renders a Room into the Three.js scene.
 */
export function renderRoomToScene(world: World, room: Room, state?: RoomState) {
    const scene = world.scene
    if (!scene) {
        console.error('❌ No scene found for room rendering')
        return
    }

    const tiles = getRoomTiles(room)
    const { offsetX, offsetZ } = getRoomOffset(room)
    const { floorColor, wallColor } = getRoomColors(room.tags)

    if (DEBUG) {
        console.log('🧱 Spawning Room:', room.id, room.tags)
    }

    for (let z = 0; z < tiles.length; z++) {
        for (let x = 0; x < tiles[z].length; x++) {
            const tile = tiles[z][x]
            const worldX = x + offsetX
            const worldZ = z + offsetZ

            renderTile(
                world,
                scene,
                tile,
                worldX,
                worldZ,
                room,
                floorColor,
                wallColor,
                offsetX,
                offsetZ,
                state
            )
        }
    }
}

export function getRoomTiles(room: Room): TileType[][] {
    const tiles: TileType[][] = []
    const centerX = Math.floor(room.width / 2)
    const centerZ = Math.floor(room.height / 2)

    for (let z = 0; z < room.height; z++) {
        const row: TileType[] = []

        for (let x = 0; x < room.width; x++) {
            let tile: TileType = TileType.Floor

            if (
                x > 0 &&
                x < room.width - 1 &&
                z > 0 &&
                z < room.height - 1 &&
                room.tags.includes('start') &&
                x === centerX &&
                z === centerZ
            ) {
                tile = TileType.PlayerStart
            }

            row.push(tile)
        }

        tiles.push(row)
    }

    for (const exit of room.exits) {
        if (exit === 'top') tiles[0][centerX] = TileType.Exit
        if (exit === 'bottom') tiles[room.height - 1][centerX] = TileType.Exit
        if (exit === 'left') tiles[centerZ][0] = TileType.Exit
        if (exit === 'right') tiles[centerZ][room.width - 1] = TileType.Exit
    }

    return tiles
}

export function getRoomOffset(room: Room): { offsetX: number; offsetZ: number } {
    return {
        offsetX: room.x * (room.width * ROOM_PADDING),
        offsetZ: room.y * (room.height * ROOM_PADDING),
    }
}

// -----------------------------
// Private Helpers
// -----------------------------

function getRoomColors(tags: string[]): { floorColor: string; wallColor: string } {
    if (tags.includes('start')) return { floorColor: '#444', wallColor: '#222' }
    if (tags.includes('shop')) return { floorColor: '#222', wallColor: '#555' }
    return { floorColor: '#333', wallColor: '#111' }
}

function renderTile(
    world: World,
    scene: Scene,
    tile: TileType,
    x: number,
    z: number,
    room: Room,
    floorColor: string,
    wallColor: string,
    offsetX: number,
    offsetZ: number,
    state?: RoomState
) {
    const isBorder =
        x === offsetX ||
        x === offsetX + room.width - 1 ||
        z === offsetZ ||
        z === offsetZ + room.height - 1

    const baseColor = isBorder ? getBorderColor(room.tags) : floorColor

    let tileColor = baseColor

    if (tile === TileType.Exit) {
        tileColor = EXIT_COLOR
    }

    if (tile !== TileType.Wall) {
        createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, tileColor, x, FLOOR_Y, z)
    }

    switch (tile) {
        case TileType.Wall:
            createTileEntity(world, TILE_SIZE, TILE_SIZE, wallColor, x, WALL_Y, z)
            break
        case TileType.PlayerStart:
            if (DEBUG) console.log('✅ Player tile detected!')
            if (!world.getEntitiesWithTag(EntityTag.Player).length) {
                createPlayer(world, x, PLAYER_Y, z, DEBUG)
            }
            break
        case TileType.Enemy:
            if (DEBUG) console.log('✅ Enemy tile detected!')
            createEnemy(world, x, ENEMY_Y, z, DEBUG)

            break
    }
}

function getBorderColor(tags: string[]): string {
    if (tags.includes('start')) return START_BORDER_COLOR
    if (tags.includes('end')) return END_BORDER_COLOR
    return DEFAULT_BORDER_COLOR
}

// function createFloorTile(
//     size: number,
//     height: number,
//     color: string,
//     scene: Scene,
//     x: number,
//     y: number,
//     z: number
// ) {
//     const tileMesh = new Mesh(
//         new BoxGeometry(size, height, size),
//         new MeshStandardMaterial({ color })
//     )
//     tileMesh.position.set(x, y, z)
//     scene.add(tileMesh)
// }

// function createWallTile(
//     size: number,
//     color: string,
//     scene: Scene,
//     x: number,
//     y: number,
//     z: number
// ) {
//     const wallMesh = new Mesh(
//         new BoxGeometry(size, size, size),
//         new MeshStandardMaterial({ color })
//     )
//     wallMesh.position.set(x, y, z)
//     scene.add(wallMesh)
// }

export function createTileEntity(
    world: World,
    size: number,
    height: number,
    color: string,
    x: number,
    y: number,
    z: number
) {
    const mesh = new Mesh(new BoxGeometry(size, height, size), new MeshStandardMaterial({ color }))
    mesh.position.set(x, y, z)

    world.scene?.add(mesh)

    const entity = world.createEntity()
    // entity.addComponent(ComponentType.Mesh, { mesh })
    const visual: VisualComponent = {
        meshes: [{ mesh, ignoreRotation: false }],
    }
    entity.addComponent(ComponentType.Visual, visual)
    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addTag(EntityTag.RoomInstance)

    return entity
}

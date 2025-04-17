import type { World } from '@/engine'
import { BoxGeometry, Mesh, MeshStandardMaterial, type Scene } from 'three'
import { createPlayer } from '@/gameplay/prefab/createPlayer'
import { createEnemy } from '@/gameplay/prefab/createEnemy'
import { TileType, type Room, type RoomDefinition } from './types'

const debug = true
const tileSize = 1
const floorHeight = 0.1
const playerHeight = 1
const playerY = floorHeight / 2 + playerHeight / 2
const wallY = tileSize / 2
const enemyY = wallY
const floorY = 0

export function spawnRoom(world: World, room: RoomDefinition) {
    //Offset tile positions by room.offsetX / offsetZ
    //add floor tiles, walls, spawn player/enemies
    const scene = world.scene
    console.log('SPAWNING ROOM')
    console.log(room.tags, 'room tags')

    if (!scene) {
        console.error('No scene at room spawn')
    }

    for (let z = 0; z < room.tiles.length; z++) {
        for (let x = 0; x < room.tiles[z].length; x++) {
            const worldX = x + room.offsetX
            const worldZ = z + room.offsetZ

            const tile = room.tiles[z][x]

            spawnTile(world, scene, tile, worldX, worldZ, room, debug)
        }
    }
}

const DEFAULT_BORDER_COLOR = '#5500aa'
const EXIT_COLOR = '#fc33ff'
const START_BORDER_COLOR = '#00e676'
const END_BORDER_COLOR = '#ff5252'

const ROOM_PADDING = 1.5

function spawnTile(
    world: World,
    scene: Scene,
    tile: TileType,
    x: number,
    z: number,
    room: RoomDefinition,
    debug: boolean
) {
    const isBorder =
        x === room.offsetX ||
        x === room.offsetX + room.width - 1 ||
        z === room.offsetZ ||
        z === room.offsetZ + room.height - 1

    if (isBorder) {
        const borderColor = getBorderColor(room)
        createFloorTile(tileSize, floorHeight, borderColor, scene, x, floorY, z)
    } else {
        createFloorTile(tileSize, floorHeight, room.floorColor, scene, x, floorY, z)
    }

    switch (tile) {
        case TileType.Wall:
            createWallTile(tileSize, room.wallColor, scene, x, wallY, z)
            break
        case TileType.Exit:
            createFloorTile(tileSize, floorHeight, EXIT_COLOR, scene, x, floorY, z)
            break

        case TileType.PlayerStart:
            console.log('✅ Player tile detected!')
            createPlayer(world, x, playerY, z, debug)
            break

        case TileType.Enemy:
            console.log('✅ Enemy tile detected!')
            createEnemy(world, x, enemyY, z, debug)
            break
        default:
    }
}

function createFloorTile(
    size: number,
    height: number,
    color: string,
    scene: Scene,
    x: number,
    y: number,
    z: number
) {
    const tileMesh = new Mesh(
        new BoxGeometry(size, height, size),
        new MeshStandardMaterial({ color: color })
    )
    tileMesh.position.set(x, y, z)
    scene.add(tileMesh)
}

function createWallTile(
    size: number,
    color: string,
    scene: Scene,
    x: number,
    y: number,
    z: number
) {
    const wallMesh = new Mesh(
        new BoxGeometry(size, size, size),
        new MeshStandardMaterial({ color })
    )
    wallMesh.position.set(x, y, z)
    scene.add(wallMesh)
}

export function generateRoomDefinition(room: Room): RoomDefinition {
    const tiles: TileType[][] = []
    const centerX = Math.floor(room.width / 2)
    const centerZ = Math.floor(room.height / 2)

    for (let z = 0; z < room.height; z++) {
        const row: TileType[] = []

        for (let x = 0; x < room.width; x++) {
            //Default to  walls
            // let tile: TileType = TileType.Wall
            let tile: TileType = TileType.Floor

            // Inner area becomes floor
            if (x > 0 && x < room.width - 1 && z > 0 && z < room.height - 1) {
                if (room.tags.includes('start') && x === centerX && z === centerZ) {
                    tile = TileType.PlayerStart
                } else {
                    tile = TileType.Floor
                }
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

    return {
        height: room.height,
        width: room.width,
        tiles,
        offsetX: room.x * (room.width * ROOM_PADDING),
        offsetZ: room.y * (room.height * ROOM_PADDING),
        // offsetX: room.x * ROOM_SPACING,
        // offsetZ: room.y * ROOM_SPACING,
        floorColor: '#444',
        wallColor: '#222',
        tags: room.tags,
    }
}

function getBorderColor(room: RoomDefinition): string {
    if (room.tags?.includes('start')) {
        return START_BORDER_COLOR
    } else if (room.tags?.includes('end')) {
        return END_BORDER_COLOR
    } else {
        return DEFAULT_BORDER_COLOR
    }
}

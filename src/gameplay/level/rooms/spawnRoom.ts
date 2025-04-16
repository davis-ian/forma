import type { World } from '@/engine'
import { BoxGeometry, Mesh, MeshStandardMaterial, type Scene } from 'three'
import type { RoomDefinition } from '../RoomDefinition'
import { TileType } from '../TileType'
import { createPlayer } from '@/gameplay/prefab/createPlayer'
import { createEnemy } from '@/gameplay/prefab/createEnemy'

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

function spawnTile(
    world: World,
    scene: Scene,
    tile: TileType,
    x: number,
    z: number,
    room: RoomDefinition,
    debug: boolean
) {
    createFloorTile(tileSize, floorHeight, room.floorColor, scene, x, floorY, z)

    switch (tile) {
        case TileType.Wall:
            createWallTile(tileSize, room.wallColor, scene, x, wallY, z)
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

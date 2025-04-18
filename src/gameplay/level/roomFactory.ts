import type { World } from '@/engine'
import { BoxGeometry, Mesh, MeshStandardMaterial, type Scene } from 'three'
import { createPlayer } from '@/gameplay/prefab/createPlayer'
import { createEnemy } from '@/gameplay/prefab/createEnemy'
import { TileType, type Direction, type Room, type RoomState } from './types'
import { EntityTag } from '@/engine/EntityTag'
import { ComponentType } from '@/engine/ComponentType'
import type { VisualComponent } from '@/shared/components/Visual'
import { getRandomInt } from './utils/random'
import { shuffle } from './RoomGraph'

// Room size & visuals
const ROOM_WIDTH = 30
const ROOM_HEIGHT = 20
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

const DEBUG = false

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

    if (room.tags.includes('spawn') && !room.tags.includes('spawned')) {
        const tiles = getRoomTiles(room)
        const { offsetX, offsetZ } = getRoomOffset(room)

        const floorPositions: { x: number; z: number }[] = []

        for (let z = 0; z < tiles.length; z++) {
            for (let x = 0; x < tiles[z].length; x++) {
                if (tiles[z][x] === TileType.Floor) {
                    floorPositions.push({
                        x: offsetX + x,
                        z: offsetZ + z,
                    })
                }
            }
        }

        const enemyCount = Math.min(getRandomInt(2, 6), floorPositions.length)
        const spawnTiles = shuffle(floorPositions).slice(0, enemyCount)

        for (const pos of spawnTiles) {
            const maxHealth = getRandomInt(1, 5)
            createEnemy(world, pos.x, ENEMY_Y, pos.z, maxHealth)
        }

        room.tags.push('spawned') // Prevent re-spawning
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

            // Add walls around the edges
            if (x === 0 || x === room.width - 1 || z === 0 || z === room.height - 1) {
                tile = TileType.Wall
            }

            // Start tile (center of room)
            if (room.tags.includes('start') && x === centerX && z === centerZ) {
                tile = TileType.PlayerStart
            }

            row.push(tile)
        }

        tiles.push(row)
    }

    // Replace walls with exits where exits exist
    for (const exit of room.exits) {
        if (exit === 'top') {
            tiles[0][centerX] = TileType.Exit
            tiles[0][centerX + 1] = TileType.Exit
        }
        if (exit === 'bottom') {
            tiles[room.height - 1][centerX] = TileType.Exit
            tiles[room.height - 1][centerX + 1] = TileType.Exit
        }
        if (exit === 'left') {
            tiles[centerZ][0] = TileType.Exit
            tiles[centerZ + 1][0] = TileType.Exit
        }
        if (exit === 'right') {
            tiles[centerZ][room.width - 1] = TileType.Exit
            tiles[centerZ + 1][room.width - 1] = TileType.Exit
        }
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

function renderTile(
    world: World,
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
    if (tile !== TileType.Wall) {
        createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, floorColor, x, FLOOR_Y, z)
    }

    switch (tile) {
        case TileType.Floor:
            createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, floorColor, x, FLOOR_Y, z)
            break

        case TileType.Exit:
            let direction: 'top' | 'bottom' | 'left' | 'right' = 'top'

            if (z === offsetZ) direction = 'top'
            else if (z === offsetZ + room.height - 1) direction = 'bottom'
            else if (x === offsetX) direction = 'left'
            else if (x === offsetX + room.width - 1) direction = 'right'

            // Draw floor under the door
            createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, EXIT_COLOR, x, FLOOR_Y, z)

            // Add an invisible (or visible) door entity that triggers transitions
            const door = createTileEntity(
                world,
                TILE_SIZE,
                FLOOR_HEIGHT,
                EXIT_COLOR,
                x,
                FLOOR_Y + 1,
                z
            )
            door.addTag(EntityTag.ExitDoor)
            door.addComponent(ComponentType.Direction, { direction })
            break

        case TileType.Wall:
            const wall = createTileEntity(world, TILE_SIZE, TILE_SIZE, wallColor, x, WALL_Y, z)
            wall.addTag(EntityTag.Solid)
            if (DEBUG) {
                console.log('Tagged wall as solid', wall.id, wall.getTags())
            }
            break
        case TileType.PlayerStart:
            if (DEBUG) console.log('✅ Player tile detected!')
            if (!world.getEntitiesWithTag(EntityTag.Player).length) {
                createPlayer(world, x, PLAYER_Y, z)
            }
            break
    }
}

function getRoomColors(tags: string[]): { floorColor: string; wallColor: string } {
    if (tags.includes('start')) return { floorColor: '#555', wallColor: START_BORDER_COLOR }
    if (tags.includes('end')) return { floorColor: '#555', wallColor: END_BORDER_COLOR }
    if (tags.includes('shop')) return { floorColor: '#222', wallColor: '#555' }
    return { floorColor: '#555', wallColor: '#111' }
}

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

    const visual: VisualComponent = {
        meshes: [{ mesh, ignoreRotation: false }],
    }
    entity.addComponent(ComponentType.Visual, visual)
    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addTag(EntityTag.RoomInstance)

    return entity
}

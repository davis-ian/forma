import type { World } from '@/engine'
import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial, Texture } from 'three'
import { createPlayer } from '@/gameplay/prefab/createPlayer'
import { createEnemy } from '@/gameplay/prefab/createEnemy'
import { TileType, type Direction, type Room } from './types'
import { EntityTag } from '@/engine/EntityTag'
import { ComponentType } from '@/engine/ComponentType'
import type { VisualComponent } from '@/components/Visual'
import { getRandomInt } from './utils/random'
import { shuffle } from './RoomGraph'
import { TILE_ATLAS_CONFIG } from './utils/TileAtlas'
import { debugSettings } from '@/core/GameState'
import { SizeProfiles } from '../constants'

// Room size & visuals
const ROOM_WIDTH = 30
const ROOM_HEIGHT = 20
// const ROOM_PADDING = 1.5
const ROOM_PADDING = 1
const TILE_SIZE = 1
const FLOOR_HEIGHT = 0.1
const Y_OFFSET = 0
// const WALL_Y = TILE_SIZE / 2
// const FLOOR_Y = 0
// const PLAYER_Y = FLOOR_HEIGHT / 2 + 1
// const ENEMY_Y = FLOOR_HEIGHT / 2 + 1
// const ENEMY_Y = WALL_Y

// const START_BORDER_COLOR = '#00e676'
// const END_BORDER_COLOR = '#ff5252'

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
        theme: 'diner',
    }
}

/**
 * Renders a Room into the Three.js scene.
 */
export function renderRoomToScene(world: World, room: Room) {
    const scene = world.scene
    if (!scene) {
        console.error('❌ No scene found for room rendering')
        return
    }

    const tiles = getRoomTiles(room)
    const { offsetX, offsetZ } = getRoomOffset(room)
    // const { floorColor, wallColor } = getRoomColors(room.tags)

    if (debugSettings.value.logAll || debugSettings.value.logEnvironment) {
        console.log('🧱 Spawning Room:', room.id, room.tags)
    }

    // const centerX = offsetX + Math.floor(room.width / 2)
    // const centerZ = offsetZ + Math.floor(room.height / 2)

    for (let z = 0; z < tiles.length; z++) {
        for (let x = 0; x < tiles[z].length; x++) {
            const tile = tiles[z][x]
            const worldX = x + offsetX
            const worldZ = z + offsetZ

            renderTile(world, tile, worldX, worldZ, room, offsetX, offsetZ)
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

        const enemyCount = Math.min(getRandomInt(6, 12), floorPositions.length) + 1
        const spawnTiles = shuffle(floorPositions).slice(0, enemyCount)

        for (const pos of spawnTiles) {
            createEnemy(world, pos.x, Y_OFFSET, pos.z, 'slicer')
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
    offsetX: number,
    offsetZ: number
) {
    // const dirtTileMat = createTileFromAtlas(1, 1, {
    //     tileSize: 48,
    //     padding: 0,
    //     atlas: tdAtlas,
    //     atlasWidth: 576, // 12 cols * 48,
    //     atlasHeight: 528, //11 rows * 48,
    // })

    const isWhite = (x + z) % 2 === 0
    // const tileMat = isWhite ? whiteTileMat : blackTileMat
    const tileMat = new MeshStandardMaterial({ color: '#1a1a1a' })
    const wallMat = new MeshStandardMaterial({ color: '#303030' })

    createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, tileMat, x, Y_OFFSET, z)

    // const dirtTileMat = getNamedTileMaterial('dirtPath')
    // const wallMat = getNamedTileMaterial('wall')
    // const exitMat = getNamedTileMaterial('exitFloor')

    if (tile !== TileType.Wall) {
        createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, tileMat, x, Y_OFFSET, z)
        // loadKitchenTile(world, x, FLOOR_Y + 0.5, z)
    }
    const wallSize = SizeProfiles.wall

    switch (tile) {
        case TileType.Floor:
            // createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, dirtTileMat, x, FLOOR_Y, z)
            break

        case TileType.Exit:
            let direction: 'top' | 'bottom' | 'left' | 'right' = 'top'

            if (z === offsetZ) direction = 'top'
            else if (z === offsetZ + room.height - 1) direction = 'bottom'
            else if (x === offsetX) direction = 'left'
            else if (x === offsetX + room.width - 1) direction = 'right'

            // Draw floor under the door
            // createTileEntity(world, TILE_SIZE, FLOOR_HEIGHT, dirtTileMat, x, FLOOR_Y, z)

            // Add an invisible (or visible) door entity that triggers transitions
            const door = createTileEntity(
                world,
                wallSize.width,
                wallSize.height,
                TransparentMaterial,
                x,
                Y_OFFSET,
                z
            )
            door.addTag(EntityTag.ExitDoor)
            door.addComponent(ComponentType.Direction, { direction })

            // Add a separate collider blocker if the room is not cleared
            const isBlocked = !room.cleared
            if (isBlocked) {
                // Determine geometry size based on direction
                const isHorizontal = direction === 'top' || direction === 'bottom'
                const width = isHorizontal ? TILE_SIZE : 0.1
                const depth = isHorizontal ? 0.1 : TILE_SIZE

                const geometry = new BoxGeometry(width, wallSize.height, depth)
                const blockerMesh = new Mesh(geometry, ExitBlockedMaterial)
                blockerMesh.position.set(x, TILE_SIZE / 2, z)

                const offsetAmount = 0.2

                // Offset slightly depending on exit direction
                if (direction === 'top') blockerMesh.position.z += offsetAmount
                else if (direction === 'bottom') blockerMesh.position.z -= offsetAmount
                else if (direction === 'left') blockerMesh.position.x += offsetAmount
                else if (direction === 'right') blockerMesh.position.x -= offsetAmount

                world.scene?.add(blockerMesh)

                const blocker = world.createEntity()
                blocker.addComponent(ComponentType.Position, {
                    x: blockerMesh.position.x,
                    y: blockerMesh.position.y,
                    z: blockerMesh.position.z,
                })
                blocker.addComponent(ComponentType.Visual, {
                    meshes: [{ mesh: blockerMesh, ignoreRotation: false, originalColor: 'white' }],
                })
                blocker.addTag(EntityTag.Solid)
                blocker.addTag(EntityTag.ExitBlocker)
            }

            break

        case TileType.Wall:
            const wall = createTileEntity(
                world,
                wallSize.width,
                wallSize.height,
                wallMat,
                x,
                Y_OFFSET,
                z
            )
            wall.addTag(EntityTag.Solid)

            wall.addComponent(ComponentType.Hitbox, {
                width: TILE_SIZE,
                height: TILE_SIZE,
                depth: TILE_SIZE,
                offsetX: 0,
                offsetY: 0,
                offsetZ: 0,
            })

            if (debugSettings.value.logAll || debugSettings.value.logEnvironment) {
                console.log('Tagged wall as solid', wall.id, wall.getTags())
            }
            break
        case TileType.PlayerStart:
            if (debugSettings.value.logAll || debugSettings.value.logEnvironment)
                console.log('✅ Player tile detected!')
            if (!world.getEntitiesWithTag(EntityTag.Player).length) {
                createPlayer(world, x, Y_OFFSET, z)
            }
            break
    }
}

// function getRoomColors(tags: string[]): { floorColor: string; wallColor: string } {
//     if (tags.includes('start')) return { floorColor: '#555', wallColor: START_BORDER_COLOR }
//     if (tags.includes('end')) return { floorColor: '#555', wallColor: END_BORDER_COLOR }
//     if (tags.includes('shop')) return { floorColor: '#222', wallColor: '#555' }
//     return { floorColor: '#555', wallColor: '#111' }
// }

export function createTileEntity(
    world: World,
    size: number,
    height: number,
    material: MeshStandardMaterial,
    x: number,
    y: number,
    z: number
) {
    const mesh = new Mesh(new BoxGeometry(size, height, size), material)
    mesh.position.set(x, y, z)

    world.scene?.add(mesh)

    const entity = world.createEntity()

    const visual: VisualComponent = {
        meshes: [{ mesh, ignoreRotation: false, originalColor: 'white' }],
    }
    entity.addComponent(ComponentType.Visual, visual)
    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addTag(EntityTag.RoomInstance)

    return entity
}

export function createTileFromAtlas(
    tileIndexX: number,
    tileIndexY: number,
    config: {
        tileSize: number
        padding: number
        atlas: Texture
        atlasWidth: number
        atlasHeight: number
    }
): MeshStandardMaterial {
    const { tileSize, padding, atlas, atlasWidth, atlasHeight } = config

    const paddedSize = tileSize + padding * 2

    const tex = atlas.clone()
    tex.needsUpdate = true

    // How much of the texture to show (repeat)
    const uSize = tileSize / atlasWidth
    const vSize = tileSize / atlasHeight

    // Where to start sampling (offset), accounting for padding
    const u = (tileIndexX * paddedSize + padding) / atlasWidth
    const v = (tileIndexY * paddedSize + padding) / atlasHeight

    tex.repeat.set(uSize, vSize)
    tex.offset.set(u, 1 - vSize - v) // Flip vertically

    return new MeshStandardMaterial({
        map: tex,
        transparent: true,
    })
}

const TileIndexMap = {
    dirtPath: { x: 1, y: 1 },
    sandPath: { x: 4, y: 5 },
    wall: { x: 7, y: 3 },
    // borderTop: { x: 0, y: 1 },
}

export function getTileMaterial(x: number, y: number): MeshStandardMaterial {
    const { tileSize, padding, atlas, atlasWidth, atlasHeight } = TILE_ATLAS_CONFIG
    const paddedSize = tileSize + padding * 2

    const tex = atlas.clone()
    tex.needsUpdate = true

    const uSize = tileSize / atlasWidth
    const vSize = tileSize / atlasHeight

    const u = (x * paddedSize + padding) / atlasWidth
    const v = (y * paddedSize + padding) / atlasHeight

    tex.repeat.set(uSize, vSize)
    tex.offset.set(u, 1 - vSize - v)

    return new MeshStandardMaterial({ map: tex, transparent: true })
}

export function getNamedTileMaterial(tileName: keyof typeof TileIndexMap) {
    const coords = TileIndexMap[tileName]
    return getTileMaterial(coords.x, coords.y)
}

export const TransparentMaterial = new MeshStandardMaterial({
    opacity: 0,
    transparent: true,
    depthWrite: false, // prevents weird z-buffer issues
})

export const ExitBlockedMaterial = new MeshStandardMaterial({
    color: '#ff3333',
    opacity: 0.4,
    transparent: true,
    emissive: '#ff3333',
    emissiveIntensity: 1.5,
    side: DoubleSide,
    depthWrite: false,
})

const blackTileMat = new MeshStandardMaterial({ color: 0x111111 })
const whiteTileMat = new MeshStandardMaterial({ color: 0xffffff })
// const retroRedMat = new MeshStandardMaterial({ color: 0xd32f2f })
// const silverMat = new MeshStandardMaterial({ color: 0xc0c0c0 })
// const brownTileMat = new MeshStandardMaterial({ color: '#4B352A' })
// const charcTileMat = new MeshStandardMaterial({ color: '#4B352A' })

// VERY SLOW LOAD TIME  FOR 3D ASSETS
// const loader = new GLTFLoader()
// export async function loadKitchenTile(world: World, x: number, y: number, z: number) {
//     loader.load('/assets/rest_3D_assets/gltf/floor_kitchen_small.gltf', (gltf) => {
//         const model = gltf.scene
//         model.scale.set(0.5, 0.5, 0.5)
//         model.position.set(x, y, z)

//         world.scene?.add(model)

//         const entity = world.createEntity()
//         const visual: VisualComponent = {
//             meshes: [{ mesh: model, ignoreRotation: false }],
//         }
//         entity.addComponent(ComponentType.Visual, visual)
//         entity.addComponent(ComponentType.Position, { x, y, z })
//         entity.addTag(EntityTag.RoomInstance)
//     })
// }

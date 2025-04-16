import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from 'three'
import { World } from '@/engine'
import { createPlayer } from './prefab/createPlayer'
import { createEnemy } from './prefab/createEnemy'
import { TileType } from './level/types'

// World is laid out with X (left/right), Z (forward/back), Y (up/down)
// Tile (0,0) = top-left of map

const debug = false

const TILE = {
    size: 1,
    floorHeight: 0.1,
    playerHeight: 1,
    wallColor: '#444444',
    floorColor: '#222222',
}
const playerY = TILE.floorHeight / 2 + TILE.playerHeight / 2

export function loadLevel(world: World, level: string[][], scene: Scene) {
    for (let z = 0; z < level.length; z++) {
        for (let x = 0; x < level[z].length; x++) {
            const tile = level[z][x]

            if (debug) {
                console.log(`Tile at (${x}, ${z}):`, tile)
            }

            //   Always create a floor tile
            const floor = createFloorTile(TILE.size, TILE.floorHeight, TILE.floorColor)
            setTilePosition(floor, x, 0, z)
            scene.add(floor)

            if (tile === TileType.Wall) {
                const wall = createWallTile(TILE.size, TILE.wallColor)
                setTilePosition(wall, x, 0.5, z)
                wall.position.set(x, 0.5, z)
                scene.add(wall)
            }

            if (tile === TileType.PlayerStart) {
                console.log('✅ Player tile detected!')
                createPlayer(world, x, playerY, z)
            }

            if (tile === TileType.Enemy) {
                console.log('✅ Enemy tile detected!')
                createEnemy(world, x, 0.5, z)
            }
        }
    }
}

function createFloorTile(size: number, height: number, color: string) {
    return new Mesh(new BoxGeometry(size, height, size), new MeshStandardMaterial({ color: color }))
}

function createWallTile(size: number, color: string) {
    return new Mesh(new BoxGeometry(size, size, size), new MeshStandardMaterial({ color }))
}

function setTilePosition(mesh: Mesh, x: number, y: number, z: number) {
    mesh.position.set(x, y, z)
}

// function setEntityPosition(entity: Entity, x: number, y: number, z: number) {
//     const pos = entity.getComponent<PositionComponent>(ComponentType.Position)

//     if (!pos) return

//     pos.x = x
//     pos.y = y
//     pos.z = z
// }

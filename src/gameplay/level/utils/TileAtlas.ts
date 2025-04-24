import { TextureLoader, NearestFilter, RepeatWrapping } from 'three'

const loader = new TextureLoader()
const tileAtlas = loader.load('/assets/tiny-dungeon-spritesheet.png')

tileAtlas.magFilter = NearestFilter
tileAtlas.minFilter = NearestFilter
tileAtlas.wrapS = RepeatWrapping
tileAtlas.wrapT = RepeatWrapping

export const TILE_ATLAS_CONFIG = {
    atlas: tileAtlas,
    tileSize: 48,
    padding: 0,
    atlasWidth: 576, // 12 cols * 48
    atlasHeight: 528, // 11 rows * 48
}

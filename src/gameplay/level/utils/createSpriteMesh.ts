import { NearestFilter, RepeatWrapping, Sprite, SpriteMaterial, TextureLoader } from 'three'

export async function createSpriteMeshAsync(
    texturePath: string,
    columns = 1,
    rows = 1,
    columnIndex = 0,
    rowIndex = 0,
    scale = 1
): Promise<Sprite> {
    const loader = new TextureLoader()
    const texture = await loader.loadAsync(texturePath)

    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping

    // Frame size (used to keep aspect ratio correct)
    const frameWidth = texture.image.width / columns
    const frameHeight = texture.image.height / rows
    const aspectRatio = frameWidth / frameHeight

    // Show one tile/frame
    texture.repeat.set(1 / columns, 1 / rows)

    // Offset to specific frame (bottom-left origin!)
    texture.offset.set(columnIndex / columns, 1 - (rowIndex + 1) / rows)

    const material = new SpriteMaterial({
        map: texture,
        transparent: true,
    })

    const sprite = new Sprite(material)
    // Maintain aspect ratio with scale
    sprite.scale.set(scale * aspectRatio, scale, 1)
    sprite.position.y += scale / 2
    return sprite
}

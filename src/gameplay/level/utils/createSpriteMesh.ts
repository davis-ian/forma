import {
    ClampToEdgeWrapping,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    PlaneGeometry,
    RepeatWrapping,
    Sprite,
    SpriteMaterial,
    SRGBColorSpace,
    TextureLoader,
} from 'three'

export async function createSpriteMeshAsync(
    texturePath: string,
    columns = 1,
    rows = 1,
    columnIndex = 0,
    rowIndex = 0,
    size = 1
): Promise<Sprite> {
    const loader = new TextureLoader()
    const texture = await loader.loadAsync(texturePath)

    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    // texture.wrapS = RepeatWrapping
    // texture.wrapT = RepeatWrapping
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping

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
        depthWrite: false,
    })

    const sprite = new Sprite(material)
    // Maintain aspect ratio with scale
    const width = size
    const height = width / aspectRatio

    sprite.scale.set(width, height, 1)
    sprite.position.y += height / 2

    return sprite
}

export async function createPlaneMeshAsync(
    texturePath: string,
    columns = 1,
    rows = 1,
    columnIndex = 0,
    rowIndex = 0,
    size = 1
): Promise<Mesh> {
    const loader = new TextureLoader()
    const texture = await loader.loadAsync(texturePath)

    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping
    texture.flipY = true
    texture.colorSpace = SRGBColorSpace

    // Set initial frame
    texture.repeat.set(1 / columns, 1 / rows)
    texture.offset.set(columnIndex / columns, 1 - (rowIndex + 1) / rows)

    const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
    })

    const geometry = new PlaneGeometry(size, size, 1, 1)
    const mesh = new Mesh(geometry, material)

    // Rotate the plane to face the camera (top-down)
    mesh.rotation.x = -Math.PI / 2 // lay flat in XZ plane

    return mesh
}

// InputService.ts
import {
    Vector2,
    Vector3,
    Raycaster,
    Camera,
    WebGLRenderer,
    PlaneGeometry,
    TextureLoader,
    MeshBasicMaterial,
    Mesh,
} from 'three'

const mouse = new Vector2()
const raycaster = new Raycaster()

let camera: Camera
let renderer: WebGLRenderer
let groundY = 0 // assume flat ground at y=0

let mouseWorld = new Vector3()

export function initMouseTracking(cam: Camera, rend: WebGLRenderer) {
    camera = cam
    renderer = rend

    window.addEventListener('mousemove', (e) => {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    })
}

export function getMouseWorldPosition(): Vector3 {
    raycaster.setFromCamera(mouse, camera)

    // Intersect with ground plane at y = groundY
    const direction = raycaster.ray.direction
    const origin = raycaster.ray.origin

    const t = (groundY - origin.y) / direction.y
    mouseWorld = origin.clone().add(direction.clone().multiplyScalar(t))

    return mouseWorld
}

export function createCrosshairMesh() {
    const size = 0.5
    const geometry = new PlaneGeometry(size, size)

    const texture = new TextureLoader().load('/textures/crosshair.png') // or use a solid color
    const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
    })

    const mesh = new Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2 // face upward
    mesh.renderOrder = 10 // render above ground

    return mesh
}

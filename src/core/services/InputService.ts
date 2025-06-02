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

let simulatedMouse: Vector3 | null = null
let playerPosition: Vector3 | null = null

export const InputService = {
    moveDirection: new Vector2(0, 0),
    attackPressed: false,
    dashPressed: false,

    setMoveDirection(dir: Vector2) {
        this.moveDirection.copy(dir)

        if (dir.x == 0 && dir.y == 0) return

        // Update virtual mouse direction for facing
        const strength = 0.8
        setVirtualMouseDirection(
            dir.lengthSq() > 0.001 ? dir.clone().normalize().multiplyScalar(strength) : null
        )
    },
    setAttackPressed(isPressed: boolean) {
        this.attackPressed = isPressed
    },
    setDashPressed(isPressed: boolean) {
        this.dashPressed = isPressed
    },
}

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
    const inputVec = virtualMouseOverride ?? mouse
    raycaster.setFromCamera(inputVec, camera)

    // Intersect with ground plane at y = groundY
    const direction = raycaster.ray.direction
    const origin = raycaster.ray.origin

    const t = (groundY - origin.y) / direction.y
    mouseWorld = origin.clone().add(direction.clone().multiplyScalar(t))

    return mouseWorld
}

let virtualMouseOverride: Vector2 | null = null
export function setVirtualMouseDirection(direction: Vector2 | null) {
    if (direction && direction.lengthSq() > 0.001) {
        // Convert joystick direction (-1 to 1) to screen space
        virtualMouseOverride = direction.clone().clampScalar(-1, 1)
    } else {
        virtualMouseOverride = null
    }
}

import { getMouseWorldPosition } from '@/core/services/InputService'
import { System, World } from '@/engine'
import { Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from 'three'

export class CrosshairSystem extends System {
    private crosshair: Mesh

    constructor(crosshair: Mesh) {
        super()
        this.crosshair = crosshair
    }

    update(world: World): void {
        const position = getMouseWorldPosition()
        this.crosshair.position.set(position.x, 0.01, position.z)
    }
}

export function createCrosshairMesh() {
    const size = 1
    const geometry = new PlaneGeometry(size, size)

    const texture = new TextureLoader().load('/assets/crosshair138.png') // or use a solid color
    const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: false,
    })

    const mesh = new Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2 // face upward
    mesh.renderOrder = 999 // render above ground

    return mesh
}

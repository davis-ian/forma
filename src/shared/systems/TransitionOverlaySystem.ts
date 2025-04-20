import { System, World } from '@/engine'
import { Mesh, MeshBasicMaterial, PlaneGeometry, type Scene } from 'three'

export class TranstitionOverlaySystem extends System {
    private mesh: Mesh
    private opacity = 0
    private fadingIn = false
    private fadingOut = false
    private onFadeComplete?: () => void

    constructor(private scene: Scene) {
        super()
        const geometry = new PlaneGeometry(2, 2)
        const material = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 })
        this.mesh = new Mesh(geometry, material)
        this.mesh.renderOrder = 999
        this.scene.add(this.mesh)
    }

    fadeOut(duration = 0.5, onComplete?: () => void) {
        this.opacity = 0
        this.fadingOut = true
        this.fadingIn = false
        this.onFadeComplete = onComplete
    }

    fadeIn(duration = 0.5, onComplete?: () => void) {
        this.opacity = 1
        this.fadingIn = true
        this.fadingOut = false
        this.onFadeComplete = onComplete
    }

    update(world: World, deltaTime: number) {
        const speed = 2

        if (this.fadingOut) {
            this.opacity += deltaTime * speed
            if (this.opacity >= 1) {
                this.opacity = 1
                this.fadingOut = false
                this.onFadeComplete?.()
            } else if (this.fadingIn) {
                this.opacity -= deltaTime * speed
                if (this.opacity <= 0) {
                    this.opacity = 0
                    this.fadingIn = false
                    this.onFadeComplete?.()
                }
            }
        }

        ;(this.mesh.material as MeshBasicMaterial).opacity = this.opacity
    }
}

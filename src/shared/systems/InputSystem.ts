import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { InputComponent } from '@/shared/components/Input'

export class InputSystem extends System {
    private keys = new Set<string>()

    constructor() {
        super()
        window.addEventListener('keydown', (e) => this.keys.add(e.code))
        window.addEventListener('keyup', (e) => this.keys.delete(e.code))
    }

    update(world: World): void {
        for (const entity of world.entities.values()) {
            if (entity.hasComponent(ComponentType.Input)) {
                const input = entity.getComponent<InputComponent>(ComponentType.Input)!

                input.up = this.keys.has('KeyW') || this.keys.has('ArrowUp')
                input.down = this.keys.has('KeyS') || this.keys.has('ArrowDown')
                input.left = this.keys.has('KeyA') || this.keys.has('ArrowLeft')
                input.right = this.keys.has('KeyD') || this.keys.has('ArrowRight')
                input.attack = this.keys.has('Space')
            }
        }
    }
}

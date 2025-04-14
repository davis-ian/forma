import { System, type World } from '@/engine'
import { BoxGeometry, Mesh, MeshBasicMaterial, type Object3D, type Scene } from 'three'
import type { PositionComponent } from '../components/Position'
import { ComponentType } from '@/engine/ComponentType'
import type { HitboxComponent } from '../components/Hitbox'
import type { HurtboxComponent } from '../components/Hurtbox'

export class DebugDrawSystem extends System {
    private scene: Scene
    private helpers = new Map<number, Object3D>()

    constructor(scene: Scene) {
        super()
        this.scene = scene
    }

    update(world: World) {
        for (const entity of world.entities.values()) {
            const pos = entity.getComponent<PositionComponent>(ComponentType.Position)

            if (!pos) continue

            const id = entity.id

            let size
            let color

            if (entity.hasComponent(ComponentType.Hitbox)) {
                const hitbox = entity.getComponent<HitboxComponent>(ComponentType.Hitbox)!
                size = { x: hitbox.width, y: hitbox.height, z: hitbox.depth }
                color = 0xff0000
            } else if (entity.hasComponent(ComponentType.Hurtbox)) {
                const hurtbox = entity.getComponent<HurtboxComponent>(ComponentType.Hurtbox)!

                size = { x: hurtbox.width, y: hurtbox.height, z: hurtbox.depth }
                color = 0x00ff00
            } else {
                continue
            }

            let helper = this.helpers.get(id)

            if (!helper) {
                const geom = new BoxGeometry(size.x, size.y, size.z)
                const mat = new MeshBasicMaterial({ color, wireframe: true })
                helper = new Mesh(geom, mat)
                this.helpers.set(id, helper)
                this.scene.add(helper)
            }

            helper.position.set(pos.x, pos.y, pos.z)
        }
    }

    removeEntity(id: number) {
        const helper = this.helpers.get(id)
        if (helper) {
            this.scene.remove(helper)
            this.helpers.delete(id)
        }
    }
}

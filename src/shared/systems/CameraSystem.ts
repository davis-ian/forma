import { System, World } from '@/engine'
import { ComponentType, EntityTag } from '@/engine/ComponentType'
import { Vector3, type PerspectiveCamera } from 'three'
import type { PositionComponent } from '../components/Position'

export class CameraSystem extends System {
    private camera: PerspectiveCamera

    constructor(camera: PerspectiveCamera) {
        super()
        this.camera = camera
    }

    update(world: World, deltaTime: number) {
        const entities = world.getEntitiesWithTag(EntityTag.CameraFollow)

        if (entities.length === 0) return

        const target = entities[0] //TODO: Support multiple entities

        const pos = target.getComponent<PositionComponent>(ComponentType.Position)
        if (!pos) return

        const playerOffset = 4
        const smoothing = 5
        const alpha = deltaTime * smoothing
        this.camera.position.lerp(
            new Vector3(pos.x, this.camera.position.y, pos.z + playerOffset), //Maintain cameras Y height
            alpha
        )
    }
}

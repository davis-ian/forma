import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { HealthBarComponent, HealthComponent } from '../components/Health'
import type { PositionComponent } from '../components/Position'

// const DEBUG = false
const showHealthBars = true

export class HealthBarSystem extends System {
    update(world: World) {
        if (!showHealthBars) return

        const entities = world.getEntitiesWithComponent(ComponentType.Health)

        for (const entity of entities) {
            const health = entity.getComponent<HealthComponent>(ComponentType.Health)!
            const position = entity.getComponent<PositionComponent>(ComponentType.Position)
            const bar = entity.getComponent<HealthBarComponent>(ComponentType.HealthBar)

            if (!position || !bar) continue

            const percent = health.current / health.max
            bar.mesh.scale.x = Math.max(0.001, percent)
            bar.mesh.position.set(position.x - 0.5, position.y + 1.2, position.z)
        }
    }
}

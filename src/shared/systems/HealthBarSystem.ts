import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { HealthBarComponent, HealthComponent } from '../components/Health'
import type { PositionComponent } from '../components/Position'

const showHealthBars = true

export class HealthBarSystem extends System {
    update(world: World) {
        if (!showHealthBars) return

        const entities = world.getEntitiesWithComponent(ComponentType.Health)

        for (const entity of entities) {
            const health = entity.getComponent<HealthComponent>(ComponentType.Health)!
            const position = entity.getComponent<PositionComponent>(ComponentType.Position)
            const bar = entity.getComponent<HealthBarComponent>(ComponentType.HealBar)

            if (!position || !bar) continue

            const percent = Math.max(health.current / health.max, 0)
            bar.mesh.scale.x = percent
            bar.mesh.position.set(position.x, position.y + 1.2, position.z)
        }
    }
}

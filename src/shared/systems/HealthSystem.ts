import { System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { HealthComponent } from '../components/Health'

export class HealthSystem extends System {
    update(world: World) {
        const entities = world.getEntitiesWithComponent(ComponentType.Health)

        for (const entity of entities) {
            const health = entity.getComponent<HealthComponent>(ComponentType.Health)!

            //Clamp
            health.current = Math.max(0, Math.min(health.current, health.max))

            if (health.current <= 0) {
                console.log(`💀 Entity ${entity.id} died`)

                //TODO: add death animation, sound, etc

                world.destroyEntity(entity.id)
            }
        }
    }
}

import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { LifespanComponent } from '../components/Lifespan'

export class LifespanSystem extends System {
    update(world: World, deltaTime: number) {
        const entities = world.getEntitiesWithComponent(ComponentType.Lifespan)

        for (const entity of entities) {
            const lifespan = entity.getComponent<LifespanComponent>(ComponentType.Lifespan)!
            lifespan.timeLeft -= deltaTime

            if (lifespan.timeLeft <= 0) {
                console.log('destroy call!')
                world.destroyEntity(entity.id)
            }
        }
    }
}

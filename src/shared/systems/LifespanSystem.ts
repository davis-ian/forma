import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { LifespanComponent } from '../components/Lifespan'
import type { DamageComponent } from '../components/Damage'
import type { AttackRegistry } from '@/gameplay/actions/combat/AttackRegistry'

export class LifespanSystem extends System {
    constructor(private attackRegistry: AttackRegistry) {
        super()
    }

    update(world: World, deltaTime: number) {
        const entities = world.getEntitiesWithComponent(ComponentType.Lifespan)

        for (const entity of entities) {
            const lifespan = entity.getComponent<LifespanComponent>(ComponentType.Lifespan)!
            lifespan.timeLeft -= deltaTime

            if (lifespan.timeLeft <= 0) {
                // console.log('destroy call!')
                const damage = entity.getComponent<DamageComponent>(ComponentType.Damage)
                if (damage?.attackId) {
                    const fullyRemoved = this.attackRegistry.unregister(damage.attackId, entity.id)
                    if (fullyRemoved) {
                        console.log(`[Attack Registry] Attack ${damage.attackId} fully removed`)
                    }
                }
                world.destroyEntity(entity.id)
            }
        }
    }
}

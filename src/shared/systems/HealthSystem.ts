import { System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { HealthComponent } from '../components/Health'
import type { MeshComponent } from '../components/Mesh'

export class HealthSystem extends System {
    update(world: World) {
        const entities = world.getEntitiesWithComponent(ComponentType.Health)

        for (const entity of entities) {
            const health = entity.getComponent<HealthComponent>(ComponentType.Health)!

            //Clamp
            health.current = Math.max(0, Math.min(health.current, health.max))

            // const bar = entity.getComponent<MeshComponent>(ComponentType.HealBarMesh)
            // if (bar) {
            //     const percent = health.current / health.max
            //     bar.mesh.scale.x = percent
            //     bar.mesh.position.x = 0.5 + percent / 2
            // }

            if (health.current <= 0) {
                console.log(`💀 Entity ${entity.id} died`)

                //TODO: add death animation, sound, etc

                world.destroyEntity(entity.id)
            }
        }
    }
}

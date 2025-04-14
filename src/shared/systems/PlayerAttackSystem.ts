import { System, type World } from '@/engine'
import { ComponentType, EntityTag } from '@/engine/ComponentType'
import type { InputComponent } from '../components/Input'
import { spawnAttackHitbox } from '@/gameplay/actions'

const attackCooldown = 0.4

export class PlayerAttackSystem extends System {
    private attackCooldown = 0

    update(world: World, deltaTime: number) {
        this.attackCooldown -= deltaTime

        //TODO: Support multiple players here
        const players = world.getEntitiesWithTag(EntityTag.Player)
        let player = players[0]

        if (!player) return

        const input = player.getComponent<InputComponent>(ComponentType.Input)
        if (!input) return

        if (input.attack && this.attackCooldown <= 0) {
            spawnAttackHitbox(world, player)
            this.attackCooldown = attackCooldown
        }
    }
}

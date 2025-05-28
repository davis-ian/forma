import { System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { InputComponent } from '../components/Input'

import { EntityTag } from '@/engine/EntityTag'
import type { AttackRegistry } from '@/gameplay/actions/combat/AttackRegistry'
// import { performPlayerSweepAttack } from '@/gameplay/actions/combat/player/performPlayerSweepAttack'
import type { ShooterComponent } from '@/components/Shooter'

const attackCooldown = 0.25

export class PlayerAttackSystem extends System {
    private attackCooldown = 0

    constructor(private attackRegistry: AttackRegistry) {
        super()
    }

    update(world: World, deltaTime: number) {
        this.attackCooldown -= deltaTime

        //TODO: Support multiple players here
        const players = world.getEntitiesWithTag(EntityTag.Player)
        let player = players[0]

        if (!player) return

        const input = player.getComponent<InputComponent>(ComponentType.Input)
        if (!input) return

        if (input.attack && this.attackCooldown <= 0) {
            // performPlayerSweepAttack(world, player, this.attackRegistry)
            if (player.hasComponent(ComponentType.Shooter)) {
                const shooter = player.getComponent<ShooterComponent>(ComponentType.Shooter)!
                shooter.trigger = input.attack
                
            }
            this.attackCooldown = attackCooldown
        }
    }
}

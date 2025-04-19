import { System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { InputComponent } from '../components/Input'

import { EntityTag } from '@/engine/EntityTag'
import type { AttackRegistry } from '@/gameplay/actions/combat/AttackRegistry'
import { performSweepingAttack } from '@/gameplay/actions/combat/attackUtils'

const attackCooldown = 0.25
const debug = true

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
            // spawnAttackHitbox(world, player, 0, debug)
            performSweepingAttack(world, player, this.attackRegistry, debug)
            this.attackCooldown = attackCooldown
        }
    }
}

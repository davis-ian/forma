import type { Entity, World } from '@/engine'
import type { AttackRegistry } from '../AttackRegistry'
import { applyLunge, spawnAttackHitbox } from '../utils/attackUtils'
import { ComponentType } from '@/engine/ComponentType'
import type { SpriteAnimationComponent } from '@/shared/components/SpriteAnimation'
import type { InputComponent } from '@/shared/components/Input'
import { setAnimationState } from '@/shared/utils/animationUtils'

export function performPlayerSweepAttack(
    world: World,
    attackerEntity: Entity,
    attackRegistry: AttackRegistry
) {
    const sweepAngles = [-1, -0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8, 1] //sweeping left to right
    const delay = 5 //ms between each hitbox
    const attackId = crypto.randomUUID()

    applyLunge(world, attackerEntity)

    const animation = attackerEntity.getComponent<SpriteAnimationComponent>(
        ComponentType.SpriteAnimation
    )
    const input = attackerEntity.getComponent<InputComponent>(ComponentType.Input)
    const preset = input?.up ? 'sweepUp' : input?.down ? 'sweepDown' : 'sweepSide' // left/right share same anim row

    if (animation) {
        setAnimationState(animation, preset, {
            locked: true,
            onComplete: () => {
                setAnimationState(animation, 'playerIdle')
            },
        })
    }

    sweepAngles.forEach((offset, i) => {
        setTimeout(() => {
            spawnAttackHitbox(world, attackerEntity, attackId, attackRegistry, offset, {
                onlyHit: 'Enemy',
            })
        }, i * delay)
    })
}

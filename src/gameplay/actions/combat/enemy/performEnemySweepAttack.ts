import type { Entity, World } from '@/engine'
import type { AttackRegistry } from '../AttackRegistry'
import type { PositionComponent } from '@/components/Position'
import { ComponentType } from '@/engine/ComponentType'
import type { RotationComponent } from '@/components/Rotation'
import { applyLunge, spawnAttackHitbox } from '../utils/attackUtils'
import { getAngle } from '../utils/movementUtils'
import type { SpriteAnimationComponent } from '@/components/SpriteAnimation'
import { setAnimationState } from '@/utils/animationUtils'

const DEBUG = false

export function performEnemySweepAttack(
    world: World,
    enemyEntity: Entity,
    attackRegistry: AttackRegistry,
    targetPosition: PositionComponent
) {
    if (DEBUG) {
        console.log('PERFOMING ENEMY ATTACK')
    }
    const attackId = crypto.randomUUID()

    const enemyPos = enemyEntity.getComponent<PositionComponent>(ComponentType.Position)
    if (!enemyPos) return

    const rot = enemyEntity.getComponent<RotationComponent>(ComponentType.Rotation)
    if (!rot) return

    // Face the player: calculate angle from enemy to player
    const angle = getAngle(enemyPos, targetPosition)
    rot.y = angle

    // const degrees = (rot.y * 180) / Math.PI
    // const normalized = ((degrees % 360) + 360) % 360 // Normalize to 0–359

    applyLunge(world, enemyEntity)

    // Set enemy animation
    const animation = enemyEntity.getComponent<SpriteAnimationComponent>(
        ComponentType.SpriteAnimation
    )

    if (animation) {
        setAnimationState(animation, 'attack', {
            locked: true,
            onComplete: () => {
                setAnimationState(animation, 'idle')
            },
        })
    }

    const sweepAngles = [-1, -0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8, 1] //sweeping left to right
    const delay = 5 //ms between each hitbox

    sweepAngles.forEach((offset, i) => {
        setTimeout(() => {
            spawnAttackHitbox(world, enemyEntity, attackId, attackRegistry, offset, {
                onlyHit: 'Player',
            })
        }, i * delay)
    })
}

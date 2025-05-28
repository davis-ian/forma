import type { Entity, World } from '@/engine'
import type { AttackRegistry } from '@/gameplay/actions/combat/AttackRegistry'
import type { PositionComponent } from './Position'
import { performEnemySweepAttack } from '@/gameplay/actions/combat/enemy/performEnemySweepAttack'
import type { EnemyType } from '@/gameplay/prefab/createEnemy'

export type EnemyAttackType = 'sweep'
export type EnemyState = 'chase' | 'windup' | 'attack' | 'cooldown' | 'idle'

const WINDUP_DURATIONS = {
    jab: 0.3,
    melee: 0.5,
    heavySlam: 1,
    boss: 1.5,
}

export type AIComponent = {
    type: EnemyType
    behavior: EnemyState
    attackCooldown: number
    cooldownRemaining: number
    attacks: EnemyAttackType[]
    currentAttack?: EnemyAttackType
    windupDuration: number
    windupRemaining: number
}

export const createAiComponent = (enemyType: EnemyType): AIComponent => ({
    type: enemyType,
    behavior: 'chase',
    attackCooldown: 2,
    cooldownRemaining: 2,
    attacks: [],
    windupDuration: WINDUP_DURATIONS.melee,
    windupRemaining: WINDUP_DURATIONS.melee,
})

type AttackArgs = {
    world: World
    entity: Entity
    registry: AttackRegistry
    target: PositionComponent
}

export const AttackPerformers: Record<EnemyAttackType, (args: AttackArgs) => void> = {
    sweep: ({ world, entity, registry, target }) =>
        performEnemySweepAttack(world, entity, registry, target),
    // heavySmash: ({ world, entity, registry, target }) => performHeavySmash(world, entity, target),
    // ranged: ({ world, entity, registry, target }) => performRangedAttack(world, entity, target),
}

export interface WindupDebugComponent {
    isActive: boolean
    elapsed: number
    duration: number
}

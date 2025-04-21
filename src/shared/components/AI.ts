import type { Entity, World } from '@/engine'
import type { AttackRegistry } from '@/gameplay/actions/combat/AttackRegistry'
import type { PositionComponent } from './Position'
import { performEnemySweepAttack } from '@/gameplay/actions/combat/enemy/performEnemySweepAttack'

export type EnemyType = 'Skeleton' | 'Boss'
export type EnemyAttackType = 'sweep'

export type AIComponent = {
    type: EnemyType
    behavior: 'chase' | 'idle'
    attackCooldown: number
    cooldownRemaining: number
    attacks: EnemyAttackType[]
    currentAttack?: EnemyAttackType
}

export const createAiComponent = (enemyType: EnemyType): AIComponent => ({
    type: enemyType,
    behavior: 'chase',
    attackCooldown: 2,
    cooldownRemaining: 2,
    attacks: [],
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

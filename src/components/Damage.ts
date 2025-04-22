import type { EntityId } from '@/engine'

export interface DamageComponent {
    amount: number
    attackId: string
    type?: string
    sourceId?: EntityId
    statusEffects?: string[]
    damagedEntities?: Set<EntityId>
    onlyHit: 'Player' | 'Enemy' | 'All'
}

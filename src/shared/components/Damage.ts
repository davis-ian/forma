import type { EntityId } from '@/engine'

export interface DamageComponent {
    amount: number
    type?: string
    sourceId?: EntityId
    statusEffects?: string[]
}

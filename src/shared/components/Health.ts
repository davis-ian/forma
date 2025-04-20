import type { Mesh } from 'three'

export interface HealthComponent {
    current: number
    max: number
    pendingDamage: number
    recentlyHitBy?: Set<string> //attackId strings
    invulnerable?: boolean
    onDeath?: () => void
}

export interface HealthBarComponent {
    mesh: Mesh
}

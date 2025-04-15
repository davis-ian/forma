import type { Mesh } from 'three'

export interface HealthComponent {
    current: number
    max: number
    invulnerable?: boolean
    onDeath?: () => void
}

export interface HealthBarComponent {
    mesh: Mesh
}

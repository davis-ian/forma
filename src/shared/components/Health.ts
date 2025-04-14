export interface HealthComponent {
    current: number
    max: number
    invulnerable?: boolean
    onDeath?: () => void
}

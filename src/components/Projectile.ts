export interface ProjectileComponent {
    speed: number
    direction: { x: number; z: number }
    damage: number
    lifespan: number
    pierce?: number
    sourceId: number
    fromEnemy: boolean
}

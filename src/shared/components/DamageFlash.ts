import type { Color } from 'three'

export interface DamageFlashComponent {
    flashTime: number
    elapsed: number
    originalColor?: Color
}

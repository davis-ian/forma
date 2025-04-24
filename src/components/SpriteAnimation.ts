import type { SpriteName } from '@/core/registry/SpriteAtlasRegistry'

export interface SpriteAnimationComponent {
    spriteName: SpriteName
    currentFrame: number
    frameCount: number
    frameDuration: number // seconds
    elapsedTime: number
    row: number //whcih row on  sprite sheet
    columns: number
    rows: number
    loop: boolean
    playing: boolean
    locked: boolean
    onComplete?: () => void
}

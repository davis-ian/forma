export interface SpriteAnimationComponent {
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

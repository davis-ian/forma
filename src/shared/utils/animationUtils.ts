import type { Direction } from '@/gameplay/level/types'
import type { SpriteAnimationComponent } from '@/shared/components/SpriteAnimation'

export type AnimationStateName =
    | 'playerIdle'
    | 'enemyIdle'
    | 'walk'
    | 'sweepSide'
    | 'sweepUp'
    | 'sweepDown'

interface AnimationStateConfig {
    row: number
    frameCount: number
    frameDuration: number
    loop: boolean
}

const animationPresets: Record<AnimationStateName, AnimationStateConfig> = {
    playerIdle: { row: 0, frameCount: 4, frameDuration: 0.15, loop: true },
    enemyIdle: { row: 1, frameCount: 6, frameDuration: 0.15, loop: true },
    walk: { row: 1, frameCount: 6, frameDuration: 0.15, loop: true },
    sweepSide: { row: 2, frameCount: 6, frameDuration: 0.005, loop: false },
    sweepUp: { row: 6, frameCount: 6, frameDuration: 0.005, loop: false },
    sweepDown: { row: 5, frameCount: 6, frameDuration: 0.005, loop: false },
}

export function setAnimationState(
    anim: SpriteAnimationComponent,
    state: AnimationStateName,
    options: { onComplete?: () => void; locked?: boolean } = {}
) {
    const preset = animationPresets[state]
    // Prevent resetting the same state
    if (
        anim.row === preset.row &&
        anim.frameCount === preset.frameCount &&
        anim.loop === preset.loop &&
        anim.playing
    ) {
        return
    }

    anim.row = preset.row
    anim.frameCount = preset.frameCount
    anim.frameDuration = preset.frameDuration
    anim.loop = preset.loop
    anim.currentFrame = 0
    anim.elapsedTime = 0
    anim.playing = true
    anim.onComplete = options.onComplete ?? undefined
    anim.locked = options.locked ?? false
}

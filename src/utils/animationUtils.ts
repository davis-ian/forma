import type { SpriteAnimationComponent } from '@/components/SpriteAnimation'
import { SpriteAtlasRegistry } from '@/core/registry/SpriteAtlasRegistry'

export type AnimationStateName = 'idle' | 'walk' | 'attack' | 'sweepSide' | 'sweepUp' | 'sweepDown'

// interface AnimationStateConfig {
//     row: number
//     frameCount: number
//     frameDuration: number
//     loop: boolean
// }

// const animationPresets: Record<AnimationStateName, AnimationStateConfig> = {
//     playerIdle: { row: 0, frameCount: 4, frameDuration: 0.15, loop: true },
//     enemyIdle: { row: 2, frameCount: 6, frameDuration: 0.15, loop: true },
//     walk: { row: 1, frameCount: 6, frameDuration: 0.15, loop: true },
//     sweepSide: { row: 2, frameCount: 6, frameDuration: 0.005, loop: false },
//     sweepUp: { row: 6, frameCount: 6, frameDuration: 0.005, loop: false },
//     sweepDown: { row: 5, frameCount: 6, frameDuration: 0.005, loop: false },
// }

export function setAnimationState(
    anim: SpriteAnimationComponent,
    state: AnimationStateName,
    options: { onComplete?: () => void; locked?: boolean } = {}
) {
    // const preset = animationPresets[state]
    const atlas = SpriteAtlasRegistry[anim.spriteName]
    const animDef = atlas?.animations[state]

    // Prevent resetting the same state

    // console.log('setting animation state!', preset)
    if (
        anim.row === animDef.row &&
        anim.frameCount === animDef.frameCount &&
        anim.loop === animDef.loop &&
        anim.playing
    ) {
        return
    }

    anim.row = animDef.row
    anim.frameCount = animDef.frameCount
    anim.frameDuration = animDef.frameDuration
    anim.loop = animDef.loop ?? false
    anim.currentFrame = 0
    anim.elapsedTime = 0
    anim.playing = true
    anim.onComplete = options.onComplete ?? undefined
    anim.locked = options.locked ?? false
}

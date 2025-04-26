export interface SpriteAnimationInfo {
    row: number
    frameCount: number
    frameDuration: number
    loop?: boolean
}

export interface SpriteSheetFDefinition {
    src: string
    scale: number
    rows: number
    columns: number
    frameWidth?: number
    frameHeight?: number
    animations: {
        [key: string]: SpriteAnimationInfo
    }
}

export type SpriteName = 'burger' | 'tomato' | 'warriorRed' | 'warriorBlue'

export const SpriteAtlasRegistry: Record<string, SpriteSheetFDefinition> = {
    warriorBlue: {
        src: '/assets/Warrior_Blue.png',
        columns: 6,
        rows: 8,
        scale: 4,
        animations: {
            idle: { row: 0, frameCount: 4, loop: true, frameDuration: 0.15 },
            walk: { row: 1, frameCount: 6, loop: true, frameDuration: 0.15 },
            attack: { row: 2, frameCount: 5, frameDuration: 0.05 },
        },
    },
    warriorRed: {
        src: '/assets/Warrior_Red.png',
        columns: 6,
        rows: 8,
        scale: 4,
        animations: {
            idle: { row: 0, frameCount: 4, loop: true, frameDuration: 0.15 },
            walk: { row: 1, frameCount: 6, loop: true, frameDuration: 0.15 },
            attack: { row: 2, frameCount: 5, frameDuration: 0.005 },
        },
    },
    burger: {
        src: '/assets/burger_spritesheet.png',
        columns: 6,
        rows: 5,
        scale: 2,
        animations: {
            idle: { row: 1, frameCount: 6, loop: true, frameDuration: 0.15 },
            walk: { row: 2, frameCount: 6, loop: true, frameDuration: 0.15 },
            attack: { row: 3, frameCount: 2, frameDuration: 0.15 },
        },
    },
    strawberry: {
        src: '/assets/smoreSnaxPack.png',
        columns: 6,
        rows: 5,
        scale: 2,
        animations: {
            idle: { row: 1, frameCount: 6, loop: true, frameDuration: 0.15 },
            walk: { row: 2, frameCount: 6, loop: true, frameDuration: 0.15 },
            attack: { row: 3, frameCount: 2, frameDuration: 0.15 },
        },
    },
    tomato: {
        src: '/assets/Tomato-Sheet.png',
        columns: 8,
        rows: 7,
        scale: 4,
        animations: {
            idle: { row: 0, frameCount: 5, loop: true, frameDuration: 0.1 },
            walk: { row: 1, frameCount: 5, loop: true, frameDuration: 0.1 },
            attack: { row: 2, frameCount: 16, frameDuration: 0.08 },
        },
    },
}

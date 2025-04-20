export type AIComponent = {
    behavior: 'chase' | 'idle'
}

export const createAiComponent = (): AIComponent => ({ behavior: 'chase' })

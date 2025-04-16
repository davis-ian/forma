import type { Entity, World } from '@/engine'

type DebugVisualHandler = (world: World, entity: Entity) => void

const registry: DebugVisualHandler[] = []

export function registerDebugHandler(handler: DebugVisualHandler) {
    registry.push(handler)
}

export function appyDebugVisuals(world: World, entity: Entity) {
    for (const handler of registry) {
        handler(world, entity)
    }
}

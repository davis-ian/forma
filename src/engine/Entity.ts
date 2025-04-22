// Entity.ts
// Responsible for holding a unique ID and a map of components.
// In ECS, an Entity is just an ID that has components attached to it.

import type { PositionComponent } from '@/components/Position'
import type { ComponentType } from './ComponentType'
import type { World } from './World'

export type EntityId = number

export class Entity {
    id: EntityId
    components: Map<ComponentType, any> = new Map()
    nextPosition = {
        x: 0,
        y: 0,
        z: 0,
    } as PositionComponent

    constructor(
        id: EntityId,
        private world: World
    ) {
        this.id = id
    }

    addComponent<T>(type: ComponentType, data: T) {
        this.components.set(type, data)
    }

    removeComponent(type: ComponentType) {
        if (this.components.has(type)) {
            this.components.delete(type)
        }
    }

    getComponent<T>(type: ComponentType): T | undefined {
        return this.components.get(type)
    }

    hasComponent(type: ComponentType): boolean {
        return this.components.has(type)
    }

    addTag(tag: string) {
        this.world.addTag(this.id, tag)
    }

    removeTag(tag: string) {
        this.world.removeTag(this.id, tag)
    }

    hasTag(tag: string) {
        return this.world.hasTag(this.id, tag)
    }

    getTags(): string[] {
        return this.world.getEntityTags(this.id)
    }

    setNextPosition(position: PositionComponent) {
        this.nextPosition = position
    }

    getNextPosition() {
        return this.nextPosition
    }
}

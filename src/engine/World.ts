// World.ts
// Central registry for all entities and systems. Updates all systems each frame.

import { Entity } from '@/engine'
import type { EntityId } from '@/engine'
import { System } from '@/engine'
import { ComponentType } from './ComponentType'
import type { MeshComponent } from '@/shared/components/Mesh'
import type { DebugDrawSystem } from '@/shared/systems/DebugDrawSystem'
import type { VisualComponent } from '@/shared/components/Visual'

export class World {
    private nextEntityId = 0
    public entities: Map<EntityId, Entity> = new Map()
    public systems: System[] = []
    private tags = new Map<string, Set<EntityId>>()
    private debugDrawSystem?: DebugDrawSystem

    createEntity(): Entity {
        const entity = new Entity(this.nextEntityId++, this)
        this.entities.set(entity.id, entity)
        return entity
    }

    destroyEntity(entityId: EntityId): Entity | null {
        const entity = this.entities.get(entityId)
        if (!entity) return null

        const visual = entity.getComponent<VisualComponent>(ComponentType.Visual)

        if (visual?.meshes) {
            visual.meshes.forEach((mesh) => mesh.parent?.remove(mesh))
        }

        this.debugDrawSystem?.removeEntity(entityId)

        this.entities.delete(entityId)
        return entity
    }

    addSystem(system: System) {
        this.systems.push(system)
    }

    update(deltaTime: number) {
        for (const system of this.systems) {
            system.update(this, deltaTime)
        }
    }

    setDebugDrawSystem(system: DebugDrawSystem) {
        this.debugDrawSystem = system
    }

    getEntitiesWithComponent(component: ComponentType): Entity[] {
        let entites: Entity[] = []

        for (const entity of this.entities.values()) {
            if (entity.hasComponent(component)) {
                entites.push(entity)
            }
        }

        return entites
    }

    addTag(entityId: EntityId, tag: string) {
        if (!this.tags.has(tag)) this.tags.set(tag, new Set())

        this.tags.get(tag)!.add(entityId)
    }

    removeTag(entityId: EntityId, tag: string) {
        if (this.tags.has(tag)) {
            this.tags.get(tag)!.delete(entityId)
            if (this.tags.get(tag)!.size === 0) {
                this.tags.delete(tag)
            }
        }
    }

    hasTag(entityId: EntityId, tag: string) {
        return this.tags.has(tag) && this.tags.get(tag)!.has(entityId)
    }

    getEntitiesWithTag(tag: string): Entity[] {
        const ids = this.tags.get(tag)
        if (!ids) return []
        return Array.from(ids)
            .map((id) => this.entities.get(id)!)
            .filter(Boolean)
    }
}

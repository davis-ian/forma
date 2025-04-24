import type { HitboxComponent } from '@/components/Hitbox'
import type { HurtboxComponent } from '@/components/Hurtbox'
import type { PositionComponent } from '@/components/Position'
import type { RotationComponent } from '@/components/Rotation'
import type { VisualComponent } from '@/components/Visual'
import type { Entity, World } from '@/engine'

import { ComponentType } from '@/engine/ComponentType'

import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

export interface Options {
    colorOverride?: number
}

export function addBoxDeugHelperForEntity(world: World, entity: Entity, options: Options = {}) {
    const pos = entity.getComponent<PositionComponent>(ComponentType.Position)

    if (!pos) return

    const rot = entity.getComponent<RotationComponent>(ComponentType.Rotation)
    const visual = entity.getComponent<VisualComponent>(ComponentType.Visual)

    //Detect which box component exists
    const boxComp =
        entity.getComponent<HitboxComponent>(ComponentType.Hitbox) ||
        entity.getComponent<HurtboxComponent>(ComponentType.Hurtbox)

    if (!boxComp) return

    const { width, height, depth, offsetX = 0, offsetY = 0, offsetZ = 0 } = boxComp

    const color = options.colorOverride ?? getDefaultDebugColorForEntity(entity)

    const geometry = new BoxGeometry(width, height, depth)
    const material = new MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
    })
    const mesh = new Mesh(geometry, material)

    // Apply absolute position + offset
    mesh.position.set(pos.x + offsetX, pos.y + offsetY, pos.z + offsetZ)

    //Apply rotation if applicable
    if (rot) {
        mesh.rotation.set(rot.x, rot.y, rot.z)
    }

    world.scene.add(mesh)

    if (visual) {
        visual.meshes.push({ mesh, ignoreRotation: false })
    } else {
        entity.addComponent(ComponentType.Visual, { meshes: [{ mesh, ignoreRotation: false }] })
    }
}

export const DefaultDebugColors: Partial<Record<ComponentType, number>> = {
    [ComponentType.Hitbox]: 0xfc33ff,
    [ComponentType.Hurtbox]: 0x33c9ff,
    [ComponentType.HealthBar]: 0x33ff77,
}

export function getDefaultDebugColorForEntity(entity: Entity): number {
    for (const [type, color] of Object.entries(DefaultDebugColors)) {
        if (entity.hasComponent(type as ComponentType)) {
            return color
        }
    }

    return 0xffffff // Fallback color if no matching component
}

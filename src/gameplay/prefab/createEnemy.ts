import type { World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { EntityTag } from '@/engine/EntityTag'
// import type { VisualComponent } from '@/components/Visual'
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { SizeProfiles } from '../constants'
import type { Entity } from '@/engine'
import { createAiComponent } from '@/components/AI'
import { addBoxDeugHelperForEntity } from '@/utils/createBoxDebugHelper'
import { updateEnemyCount } from '@/utils/roomUtils'
import { debugSettings } from '@/core/GameState'

export type EnemyType = 'slicer' | 'charger' | 'caster' | 'swarm' | 'boss'

interface EnemyDefinition {
    name: string
    color: string
    maxHealth: number
    aiType: EnemyType
    meshSize?: { width: number; height: number; depth: number }
}

const EnemyRegistry: Record<EnemyType, EnemyDefinition> = {
    slicer: {
        name: 'Slicer',
        color: 'red',
        maxHealth: 3,
        aiType: 'slicer',
    },
    charger: {
        name: 'Charger',
        color: 'orange',
        maxHealth: 4,
        aiType: 'charger',
    },
    caster: {
        name: 'Caster',
        color: 'purple',
        maxHealth: 2,
        aiType: 'caster',
    },
    swarm: {
        name: 'Gremlin',
        color: 'green',
        maxHealth: 1,
        aiType: 'swarm',
        meshSize: { width: 0.7, height: 0.7, depth: 0.7 },
    },
    boss: {
        name: 'Bone Chef',
        color: 'black',
        maxHealth: 10,
        aiType: 'boss',
        meshSize: { width: 1.5, height: 1.5, depth: 1.5 },
    },
}

export async function createEnemy(world: World, x: number, y: number, z: number, type: EnemyType) {
    const scene = world.scene
    if (!scene) return

    const def = EnemyRegistry[type]
    const entity = world.createEntity()
    setupBaseComponents(entity, x, y, z)

    const size = SizeProfiles.player
    const meshSize = def.meshSize ?? size
    const meshColor = def.color

    const enemyMesh = createBoxMesh(meshColor, meshSize)
    const healthBarMesh = createHealthBarMesh()

    scene.add(enemyMesh)
    scene.add(healthBarMesh)

    addHealthComponents(entity, def.maxHealth)
    addVisualComponent(entity, enemyMesh, healthBarMesh, meshColor)
    addEnemyTags(entity)
    addEnemyAI(entity, def.aiType)

    entity.addComponent(ComponentType.Mesh, { mesh: enemyMesh })
    entity.addComponent(ComponentType.HealthBar, { mesh: healthBarMesh })

    if (debugSettings.value.logCharacter || debugSettings.value.logAll) {
        addBoxDeugHelperForEntity(world, entity, { colorOverride: 0x33c9ff })
    }

    updateEnemyCount(world)
    return entity
}

function setupBaseComponents(entity: Entity, x: number, y: number, z: number) {
    entity.addComponent(ComponentType.Position, { x, y, z })
    entity.addComponent(ComponentType.Rotation, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.Velocity, { x: 0, y: 0, z: 0 })
    entity.addComponent(ComponentType.SpawnPoint, {
        x,
        y,
        z,
        leashRadius: 5,
    })
}

function createBoxMesh(color: string, size: { width: number; height: number; depth: number }) {
    const geo = new BoxGeometry(size.width, size.height, size.depth)
    const mat = new MeshStandardMaterial({ color })
    return new Mesh(geo, mat)
}

function createHealthBarMesh() {
    const geo = new BoxGeometry(1, 0.1, 0.1)
    const mat = new MeshBasicMaterial({ color: 'green' })
    geo.translate(0, 0.8, 0)
    return new Mesh(geo, mat)
}

function addHealthComponents(entity: Entity, maxHealth: number) {
    entity.addComponent(ComponentType.Health, {
        current: maxHealth,
        max: maxHealth,
    })

    const size = SizeProfiles.player

    entity.addComponent(ComponentType.Hurtbox, {
        width: size.width,
        height: size.height,
        depth: size.depth,
        offsetX: size.offsetX,
        offsetY: size.offsetY,
        offsetZ: size.offsetZ,
    })
}

function addVisualComponent(entity: Entity, mesh: Mesh, bar: Mesh, color: string) {
    entity.addComponent(ComponentType.Visual, {
        meshes: [
            { mesh, ignoreRotation: true, originalColor: color },
            { mesh: bar, ignoreRotation: true, ignoreDamageFlash: true, originalColor: 'white' },
        ],
    })
}

function addEnemyTags(entity: Entity) {
    entity.addTag(EntityTag.Enemy)
    entity.addTag(EntityTag.RoomInstance)
    entity.addTag(EntityTag.Obstacle)
}

function addEnemyAI(entity: Entity, aiType: EnemyType) {
    entity.addComponent(ComponentType.AI, createAiComponent(aiType))
}

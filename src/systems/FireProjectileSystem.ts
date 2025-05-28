import type { PositionComponent } from '@/components/Position'
import type { ProjectileComponent } from '@/components/Projectile'
// import type { RotationComponent } from '@/components/Rotation'
import type { ShooterComponent } from '@/components/Shooter'
import { getMouseWorldPosition } from '@/core/services/InputService'
import { Entity, System, type World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import { SizeProfiles } from '@/gameplay/constants'
import { normalizeVector } from '@/utils/collisionUtils'
import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

export function spawnProjectile(world: World, shooter: Entity, props: ProjectileComponent) {
    const projectile = world.createEntity()
    const projectileSize = SizeProfiles.projectile

    const shooterPos = shooter.getComponent<PositionComponent>(ComponentType.Position)
    if (!shooterPos) return

    projectile.addComponent(ComponentType.Position, {
        x: shooterPos.x,
        y: shooterPos.y,
        z: shooterPos.z,
    })

    projectile.addComponent(ComponentType.Velocity, {
        x: props.direction.x * props.speed,
        y: 0,
        z: props.direction.z * props.speed,
    })

    projectile.addComponent(ComponentType.Projectile, props)

    projectile.addComponent(ComponentType.Damage, {
        amount: props.damage,
        attackId: crypto.randomUUID(),
        sourceId: props.sourceId,
        onlyHit: props.fromEnemy ? 'Player' : 'Enemy',
        damagedEntities: new Set(),
    })

    projectile.addComponent(ComponentType.Hitbox, {
        width: projectileSize.width,
        height: projectileSize.height,
        depth: projectileSize.depth,
        offsetX: projectileSize.offsetX,
        offsetY: projectileSize.offsetZ,
        offsetZ: projectileSize.offsetZ,
    })

    projectile.addComponent(ComponentType.Lifespan, {
        timeLeft: props.lifespan,
    })

    const mesh = new Mesh(
        new SphereGeometry(projectileSize.width, 32, 16),
        new MeshStandardMaterial({ color: props.fromEnemy ? 'red' : 'cyan' })
    )

    world.scene?.add(mesh)

    projectile.addComponent(ComponentType.Mesh, { mesh })
    projectile.addComponent(ComponentType.Visual, { meshes: [{ mesh }] })

    return projectile
}

export class FireProjectileSystem extends System {
    update(world: World, delta: number): void {
        for (const entity of world.entities.values()) {
            if (!entity.hasComponent(ComponentType.Shooter)) continue

            const shooter = entity.getComponent<ShooterComponent>(ComponentType.Shooter)!
            shooter.cooldownRemaining -= delta

            if (shooter.trigger && shooter.cooldownRemaining <= 0) {
                shooter.cooldownRemaining = shooter.cooldown
                shooter.trigger = false

                // TODO: handle separate aiming, right now just use forward
                // const rot = entity.getComponent<RotationComponent>(ComponentType.Rotation)
                const shooterPos = entity.getComponent<PositionComponent>(ComponentType.Position)!
                const mouseWorldPos = getMouseWorldPosition()

                const direction = normalizeVector({
                    x: mouseWorldPos.x - shooterPos.x,
                    z: mouseWorldPos.z - shooterPos.z,
                })

                spawnProjectile(world, entity, {
                    speed: 30,
                    direction,
                    damage: shooter.damage,
                    lifespan: 3.5,
                    sourceId: entity.id,
                    fromEnemy: shooter.fromEnemy,
                })
            }
        }
    }
}

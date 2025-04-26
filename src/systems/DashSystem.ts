import { System, World } from '@/engine'
import { ComponentType } from '@/engine/ComponentType'
import type { DashComponent } from '../components/Dash'
import type { InputComponent } from '../components/Input'
import type { VelocityComponent } from '../components/Velocity'
import type { HealthComponent } from '../components/Health'

// const DEBUG = false
export class DashSystem extends System {
    update(world: World, deltaTime: number): void {
        for (const entity of world.entities.values()) {
            if (
                entity.hasComponent(ComponentType.Input) &&
                entity.hasComponent(ComponentType.Dash) &&
                entity.hasComponent(ComponentType.Velocity)
            ) {
                const input = entity.getComponent<InputComponent>(ComponentType.Input)!
                const dash = entity.getComponent<DashComponent>(ComponentType.Dash)!
                const vel = entity.getComponent<VelocityComponent>(ComponentType.Velocity)!

                // add invulnerable while dashing
                const health = entity.getComponent<HealthComponent>(ComponentType.Health)

                dash.cooldownRemaining = Math.max(dash.cooldownRemaining - deltaTime, 0)

                if (!dash.isDashing && input.dash && dash.cooldownRemaining <= 0) {
                    dash.isDashing = true
                    dash.dashTimer = dash.dashDuration
                    dash.cooldownRemaining = dash.cooldown

                    // Determine dash direction from input
                    dash.direction.x = (input.right ? 1 : 0) - (input.left ? 1 : 0)
                    dash.direction.z = (input.down ? 1 : 0) - (input.up ? 1 : 0)
                    const len = Math.hypot(dash.direction.x, dash.direction.z)
                    if (len > 0) {
                        dash.direction.x /= len
                        dash.direction.z /= len
                    } else {
                        dash.direction.x = 0
                        dash.direction.z = 1 // default dash forward
                    }

                    if (health) {
                        health.invulnerableRemaining = dash.dashDuration
                    }
                }

                if (dash.isDashing) {
                    dash.dashTimer -= deltaTime
                    vel.x = dash.direction.x * dash.dashSpeed
                    vel.z = dash.direction.z * dash.dashSpeed

                    if (dash.dashTimer <= 0) {
                        dash.isDashing = false
                        vel.x = 0
                        vel.z = 0
                    }
                }

                if (health?.invulnerableRemaining && health.invulnerableRemaining > 0) {
                    health.invulnerableRemaining -= deltaTime
                }
            }
        }
    }
}

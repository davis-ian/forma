import type { PositionComponent } from '@/shared/components/Position'

export function getAngle(from: PositionComponent, to: PositionComponent) {
    // Face the player: calculate angle from enemy to player
    const dx = to.x - from.x
    const dz = to.z - from.z
    const angle = Math.atan2(dx, dz) // y-axis rotation

    return angle
}

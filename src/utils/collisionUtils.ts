import type { PositionComponent } from '../../components/Position'

export interface AABB {
    width: number
    height: number
    depth: number
}

export interface Offset {
    x?: number
    y?: number
    z?: number
}

/**
 * Computes an axis-aligned bounding box from a center position and size.
 */

export function getAABB(pos: PositionComponent, size: AABB, offset: Offset = {}) {
    const cx = pos.x + (offset.x || 0)
    const cy = pos.y + (offset.y || 0)
    const cz = pos.z + (offset.z || 0)

    return {
        min: {
            x: cx - size.width / 2,
            y: cy - size.height / 2,
            z: cz - size.depth / 2,
        },
        max: {
            x: cx + size.width / 2,
            y: cy + size.height / 2,
            z: cz + size.depth / 2,
        },
    }
}

/**
 * Checks if two AABBs intersect (all axes overlap).
 */
export function boxesIntersect(
    aMin: PositionComponent,
    aMax: PositionComponent,
    bMin: PositionComponent,
    bMax: PositionComponent
): boolean {
    return (
        aMin.x <= bMax.x &&
        aMax.x >= bMin.x &&
        aMin.y <= bMax.y &&
        aMax.y >= bMin.y &&
        aMin.z <= bMax.z &&
        aMax.z >= bMin.z
    )
}

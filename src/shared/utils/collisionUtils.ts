import type { PositionComponent } from '../components/Position'

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
    return {
        min: {
            x: pos.x - size.width / 2 + (offset.x || 0),
            y: pos.y - size.height / 2 + (offset.y || 0),
            z: pos.z - size.depth / 2 + (offset.z || 0),
        },
        max: {
            x: pos.x + size.width / 2 + (offset.x || 0),
            y: pos.y + size.height / 2 + (offset.y || 0),
            z: pos.z + size.depth / 2 + (offset.z || 0),
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

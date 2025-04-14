// System.ts
// A system is a unit of logic that operates on entities with specific components.

import type { World } from '@/engine'

export abstract class System {
  // Each system runs every frame with access to the world and deltaTime.
  abstract update(world: World, deltaTime: number): void
}

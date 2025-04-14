🧱 Kitchen Nightmares Architecture Guide

🧠 Overview

This game is built using a custom ECS (Entity-Component-System) architecture and a modular rendering loop on top of Three.js, with Vue 3 managing UI overlays.

The architecture is designed to be modular, testable, and scalable — ideal for building a complex, reactive game world in a browser-based environment.

🏗️ ECS Breakdown

Entity

An entity is a unique ID referencing a collection of components. Entities themselves are passive.

```
class Entity {
id: number
components: Map<string, Component>
}
```

Component

A component holds pure data. Example: PositionComponent, HealthComponent, RenderComponent

```
interface Component {
type: string
}
```

System

Systems operate on all entities with the required components.

```
abstract class System {
abstract update(delta: number): void
}
```

World

The World class manages the full entity/component registry and system execution.

```
class World {
addSystem(system: System): void
update(delta: number): void
}
```

🔁 Game Loop

The loop is split between logic tick and render draw:

```
function gameLoop() {
requestAnimationFrame(gameLoop)
const delta = clock.getDelta()
world.update(delta) // ECS logic
renderer.render(scene, camera) // Three.js draw
}
```

Delta-based updates ensure time consistency across frame rates.

🎮 Game Systems

InputSystem — Maps key/mouse/controller to actions

MovementSystem — Applies velocity to position

RenderSystem — Syncs ECS entities to Three.js mesh transforms

CookingSystem — Tracks cook state and kitchen station logic

CombatSystem — Handles collisions, damage, status effects

RoomTransitionSystem — Manages procedural room loading

🎥 Scene Management

Each room/dungeon/encounter is treated as a Scene object:

```
interface Scene {
load(): Promise<void>
update(delta: number): void
unload(): void
}
```

SceneManager handles transitions:

Fade out

Unload old scene

Load new scene

Fade in

🧩 Integration Points

Vue 3 handles UI (menus, HUD, overlays)

Three.js manages rendering layer

Tailwind CSS handles UI styling via theme tokens

Post-processing is handled via custom shaders (future roadmap)

✅ Benefits

Highly modular and testable

Scales well to new mechanics

Keeps rendering and simulation decoupled

Separates UI (Vue) from engine logic (TS + Three.js)

🛠️ Future Architecture Improvements

Add EventBus or Signal system to decouple inter-system communication

Implement PrefabFactory for spawning enemies or interactables

Serialize ECS state for replays or save files

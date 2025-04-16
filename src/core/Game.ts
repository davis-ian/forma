import {
    Clock,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
} from 'three'

// ECS imports
import { RenderSystem } from '@/shared/systems/RenderSystem'
import { RotationSystem } from '@/shared/systems/RotationSystem'
import { MovementSystem } from '@/shared/systems/MovementSystem'
import { InputSystem } from '@/shared/systems/InputSystem'
import { CameraSystem } from '@/shared/systems/CameraSystem'
import { LifespanSystem } from '@/shared/systems/LifespanSystem'
import { PlayerAttackSystem } from '@/shared/systems/PlayerAttackSystem'
import { DamageSystem } from '@/shared/systems/DamageSystem'
import { HealthBarSystem } from '@/shared/systems/HealthBarSystem'
import { HealthSystem } from '@/shared/systems/HealthSystem'
import { spawnRoom } from '@/gameplay/level/rooms/spawnRoom'
import { room1, room2, room3, room4 } from '@/gameplay/level/rooms/templates'
import { DebugDrawSystem } from '@/shared/systems/DebugDrawSystem'
import { registerDebugHandler } from '@/shared/utils/DebugVisualRegistry'
import { ComponentType } from '@/engine/ComponentType'
import { addBoxDeugHelperForEntity } from '@/shared/utils/createBoxDebugHelper'
import { World } from '@/engine'

export function startGame(container: HTMLElement, debug: boolean = false) {
    if (debug) {
        console.log('game start initiated')
    }
    /**
     * Core rendering setup: scene, camera, renderer
     */
    const scene = new Scene()

    const camera = new PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    )

    //Set isometric camera
    camera.position.set(0, 7, 5)
    camera.lookAt(0, 0, 0)

    const ambient = new AmbientLight(0xffffff, 0.5)
    scene.add(ambient)

    const directional = new DirectionalLight(0xffffff, 1)
    directional.position.set(5, 5, 5)
    scene.add(directional)

    if (debug) {
        console.log('camera z', camera.position.z)
    }

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    if (debug) {
        console.log('Canvas size:', renderer.domElement.width, renderer.domElement.height)
    }
    registerDebugHandler((world, entity) => {
        if (entity.hasComponent(ComponentType.Hitbox)) {
            addBoxDeugHelperForEntity(world, entity)
        }
    })
    registerDebugHandler((world, entity) => {
        if (entity.hasComponent(ComponentType.Hurtbox)) {
            addBoxDeugHelperForEntity(world, entity)
        }
    })

    const clock = new Clock()

    /**
     * Initialize ECS world and register systems
     */
    const world = new World()
    world.setScene(scene)

    world.addSystem(new RenderSystem())
    world.addSystem(new RotationSystem())
    world.addSystem(new MovementSystem())
    world.addSystem(new InputSystem())
    world.addSystem(new LifespanSystem())
    world.addSystem(new PlayerAttackSystem())
    world.addSystem(new DamageSystem())
    world.addSystem(new HealthBarSystem())
    world.addSystem(new HealthSystem())
    world.addSystem(new CameraSystem(camera))
    world.addSystem(new DebugDrawSystem())

    /**
     * Create a cube mesh and attach to ECS entity
     * The cube's transform will be driven by ECS data and systems
     */

    // loadLevel(world, testLevel, scene)
    spawnRoom(world, room1)
    // spawnRoom(world, scene, room2)
    // spawnRoom(world, scene, room3)
    // spawnRoom(world, scene, room4)

    /**
     * Animation loop
     * Runs the ECS world update and renders the scene
     */
    function animate() {
        const delta = clock.getDelta()
        world.update(delta)

        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

    window.addEventListener('resize', () => {
        const width = container.clientWidth
        const height = container.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
    })

    animate()
}

import type { Object3D } from 'three'

export interface VisualComponent {
    meshes: {
        mesh: Object3D
        ignoreRotation?: boolean
        ignoreDamageFlash?: boolean
    }[] //could be mesh, group, etc
}

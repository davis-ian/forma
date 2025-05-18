import type { Object3D } from 'three'

export interface VisualComponent {
    meshes: {
        mesh: Object3D
        ignoreRotation?: boolean
        ignoreDamageFlash?: boolean
        originalColor: string
    }[] //could be mesh, group, etc
}

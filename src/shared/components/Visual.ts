import type { Mesh, Object3D } from 'three'

export interface VisualComponent {
    meshes: {
        mesh: Object3D
        ignoreRotation?: boolean
    }[] //could be mesh, group, etc
}

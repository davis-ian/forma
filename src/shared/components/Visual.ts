import type { Object3D } from 'three'

export interface VisualComponent {
    meshes: Object3D[] //could be mesh, group, etc
}

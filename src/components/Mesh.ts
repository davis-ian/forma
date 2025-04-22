import type { Mesh } from 'three'

export interface MeshComponent {
    mesh: Mesh // or Mesh, but Object3D is more flexible
}

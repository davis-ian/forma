import type { World } from '@/engine'
import type { Room } from '../level/types'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'

export class MiniMap {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private roomMap: Map<string, Room>
    private scale = 6 //scale  factor for tile size
    private tileSize = 1 //how big 1 unit is

    constructor(roomMap: Map<string, Room>) {
        this.roomMap = roomMap

        this.canvas = document.createElement('canvas')
        this.canvas.width = 100
        this.canvas.height = 100
        this.canvas.style.width = '150px' // <-- override scaling
        this.canvas.style.height = '150px'
        this.canvas.style.position = 'absolute'
        this.canvas.style.top = '10px'
        this.canvas.style.right = '10px'
        this.canvas.style.zIndex = '1000'
        this.canvas.style.background = '#111'
        this.canvas.style.border = '1px solid  #fff'
        document.body.appendChild(this.canvas)

        this.ctx = this.canvas.getContext('2d')!
    }

    update(world: World) {
        const ctx = this.ctx
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        //Draw each room
        for (const room of this.roomMap.values()) {
            const color = this.getRoomColor(room)
            this.drawRoom(room.x, room.y, color)
        }

        const player = world.getEntitiesWithComponent(ComponentType.Input)[0]
        if (player) {
            const pos = player.getComponent<PositionComponent>(ComponentType.Position)
            if (pos) {
                const px = Math.floor(pos.x / 25)
                const pz = Math.floor(pos.z / 25)

                this.drawPlayerMarker(px, pz)
            }
        }
    }

    private drawRoom(x: number, z: number, color: string) {
        const size = this.scale
        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2

        const drawX = centerX + x * size
        const drawY = centerY + z * size

        this.ctx.fillStyle = color
        this.ctx.fillRect(drawX, drawY, size, size)
    }

    private drawPlayerMarker(x: number, z: number) {
        const size = this.scale
        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2

        const drawX = centerX + x * size
        const drawY = centerY + z * size

        this.ctx.fillStyle = '#00f'
        this.ctx.fillRect(drawX + size / 4, drawY + size / 4, size / 2, size / 2)
    }

    private getRoomColor(room: Room): string {
        if (room.tags?.includes('start')) return '#00e676'
        if (room.tags?.includes('end')) return '#ff5252'
        return '#aaa'
    }
}

import type { World } from '@/engine'
import type { Room } from '../level/types'
import { RoomManager } from '../level/RoomManager'
import { EntityTag } from '@/engine/EntityTag'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/shared/components/Position'

export class MiniMap {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private scale = 16 //scale  factor for tile size
    private width = 150
    private height = 150

    constructor(private roomManager: RoomManager) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        Object.assign(this.canvas.style, {
            width: '150px',
            height: '150px',
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            border: '1px solid white',
            borderRadius: '0.75rem',
            background: '#000a',
            zIndex: '50',
        })
        document.body.appendChild(this.canvas)
        this.ctx = this.canvas.getContext('2d')!
    }

    update(world: World) {
        const ctx = this.ctx
        ctx.clearRect(0, 0, this.width, this.height)

        const currentRoom = this.roomManager.getCurrentRoom()
        const graph = this.roomManager.getRoomGraph()

        for (const room of graph.values()) {
            // const isActive = room.id === currentRoom?.id

            // const color = isActive ? '#00ffff' : this.getRoomColor(room)
            const color = this.getRoomColor(room)

            this.drawRoom(room.x, room.y, color)

            // Player Marker
            const player = world.getEntitiesWithTag(EntityTag.Player)[0]
            const pos = player?.getComponent<PositionComponent>(ComponentType.Position)
            if (pos && currentRoom) {
                const px = currentRoom.x * this.scale + this.width / 2 + this.scale / 2
                const py = currentRoom.y * this.scale + this.height / 2 + this.scale / 2

                ctx.fillStyle = '#00f'
                ctx.beginPath()
                ctx.arc(px, py, 3, 0, Math.PI * 2)
                ctx.fill()
            }
        }
    }

    private drawRoom(x: number, y: number, color: string) {
        const cx = this.width / 2
        const cy = this.height / 2
        const size = this.scale

        const drawX = cx + x * size
        const drawY = cy + y * size

        this.ctx.fillStyle = color
        this.ctx.strokeStyle = '#222'
        this.ctx.lineWidth = 1.5

        this.ctx.beginPath()
        this.ctx.roundRect(drawX, drawY, size, size, 2)
        this.ctx.fill()
        this.ctx.stroke()
    }

    private getRoomColor(room: Room): string {
        if (room.tags?.includes('start')) return '#00e676'
        if (room.tags?.includes('end')) return '#ff5252'
        return '#aaa'
    }
}

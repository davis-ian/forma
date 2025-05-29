import type { World } from '@/engine'
import type { Room } from '../level/types'
import { RoomManager } from '../level/RoomManager'
import { EntityTag } from '@/engine/EntityTag'
import { ComponentType } from '@/engine/ComponentType'
import type { PositionComponent } from '@/components/Position'

export class MiniMap {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private scale = 20 //scale  factor for tile size
    private width = 150
    private height = 150

    constructor(private roomManager: RoomManager) {
        //Create and config canvas element
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height

        //Apply styles for  hud overlay position and appearance
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
        ctx.clearRect(0, 0, this.width, this.height) // Clear previous frame

        const currentRoom = this.roomManager.getCurrentRoom()
        const graph = this.roomManager.getRoomGraph()

        // Loop through all rooms in the graph and draw them
        for (const room of graph.values()) {
            if (!room.visited) continue

            const color = this.getRoomColor(room)

            this.drawRoom(room, color)

            // Draw the player marker at the center (always center on active room)
            const player = world.getEntitiesWithTag(EntityTag.Player)[0]
            const pos = player?.getComponent<PositionComponent>(ComponentType.Position)
            if (pos && currentRoom) {
                const centerX = this.width / 2
                const centerY = this.height / 2
                const px = centerX + 0 * this.scale + this.scale / 2 // player dot centered in tile
                const py = centerY + 0 * this.scale + this.scale / 2

                ctx.fillStyle = '#000000'
                ctx.beginPath()
                ctx.arc(px, py, 3, 0, Math.PI * 2) // circle marker
                ctx.fill()
            }
        }
    }

    dispose() {
        this.canvas.remove()
        this.ctx = null as any
        this.canvas = null as any
    }

    /**
     * Draw a room relative to the active room (centered)
     */
    private drawRoom(room: Room, color: string) {
        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2

        const playerRoom = this.roomManager.getCurrentRoom()
        if (!playerRoom) return

        const size = this.scale
        const spacing = 2
        // Position relative to player's current room
        const drawX = centerX + (room.x - playerRoom.x) * this.scale * spacing
        const drawY = centerY + (room.y - playerRoom.y) * this.scale * spacing

        this.ctx.fillStyle = color
        this.ctx.strokeStyle = '#222'
        this.ctx.lineWidth = 1.5

        // Draw rounded rectangle for the room
        this.ctx.beginPath()
        this.ctx.roundRect(drawX, drawY, size, size, 2)
        this.ctx.fill()
        this.ctx.stroke()

        //Draw Exits
        if (!room.exits) return
        this.ctx.fillStyle = '#fff' // or something like '
        const thickness = 4 // How thick the "door" looks
        const length = 8 // How far it extends from the edge

        for (const exit of room.exits) {
            switch (exit) {
                case 'top':
                    this.ctx.fillRect(
                        drawX + size / 2 - thickness / 2,
                        drawY - length,
                        thickness,
                        length
                    )
                    break
                case 'bottom':
                    this.ctx.fillRect(
                        drawX + size / 2 - thickness / 2,
                        drawY + size,
                        thickness,
                        length
                    )
                    break
                case 'left':
                    this.ctx.fillRect(
                        drawX - length,
                        drawY + size / 2 - thickness / 2,
                        length,
                        thickness
                    )
                    break
                case 'right':
                    this.ctx.fillRect(
                        drawX + size,
                        drawY + size / 2 - thickness / 2,
                        length,
                        thickness
                    )
                    break
            }
        }
    }

    /**
     * Assign colors based on room tags
     */
    private getRoomColor(room: Room): string {
        if (room.tags?.includes('start')) return '#00e676'
        if (room.tags?.includes('end')) return '#ff5252'
        return '#aaa'
    }
}

export interface DashComponent {
    isDashing: boolean
    dashDuration: number
    dashTimer: number
    cooldown: number
    cooldownRemaining: number
    dashSpeed: number
    direction: { x: number; z: number }
}

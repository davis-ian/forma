export interface InputComponent {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    attack: boolean

    attackPressedLastFrame?: boolean
}

export interface InputComponent {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    attack: boolean
    dash: boolean

    attackPressedLastFrame?: boolean
    pausePressedLastFrame?: boolean
    dashPressedLastFrame?: boolean
}

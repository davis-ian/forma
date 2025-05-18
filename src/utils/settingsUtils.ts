const settingsKey = 'dotdSettings'

export type DebugSettings = {
    godMode: boolean
    showHitboxes: boolean
    logDamage: boolean
    logAttack: boolean
    logState: boolean
    logCamera: boolean
    logCharacter: boolean
    logHealth: boolean
    logEnemyAI: boolean
    logEnvironment: boolean
    logAll: boolean
}

export const defaultSettings: DebugSettings = {
    showHitboxes: false,
    logDamage: false,
    logAttack: false,
    logState: false,
    logCamera: false,
    logCharacter: false,
    logHealth: false,
    logEnemyAI: false,
    logEnvironment: false,
    logAll: false,
    godMode: false,
}
export const settingsSchema = [
    { key: 'showHitboxes', label: 'Show Hitboxes' },
    { key: 'logDamage', label: 'Log Damage' },
    { key: 'logAttack', label: 'Log Attack' },
    { key: 'logState', label: 'Log Game State' },
    { key: 'logCamera', label: 'Log Camera' },
    { key: 'logCharacter', label: 'Log Character' },
    { key: 'logHealth', label: 'Log Health' },
    { key: 'logEnemyAI', label: 'Log Enemy AI' },
    { key: 'logEnvironment', label: 'Log Environment' },
    { key: 'logAll', label: 'Log All' },
    { key: 'godMode', label: 'God Mode' },
] as const

export type SettingsKey = (typeof settingsSchema)[number]['key']

export function initSettings(): DebugSettings {
    const settings = getSettings()

    const isValid = (obj: any): obj is DebugSettings => {
        if (typeof obj !== 'object' || obj === null) return false

        for (const key in defaultSettings) {
            const typedKey = key as keyof DebugSettings
            if (typeof obj[typedKey] !== typeof defaultSettings[typedKey]) {
                return false
            }
        }

        return true
    }

    if (!isValid(settings)) {
        localStorage.setItem(settingsKey, JSON.stringify(defaultSettings))
        return { ...defaultSettings }
    }

    return settings
}

export function getSettings(): DebugSettings | null {
    const settingsString = localStorage.getItem(settingsKey)
    if (!settingsString) return null
    return JSON.parse(settingsString)
}

export function saveSettings(newSettings: DebugSettings) {
    localStorage.setItem(settingsKey, JSON.stringify(newSettings))
}

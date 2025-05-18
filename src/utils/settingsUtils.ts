const settingsKey = 'dotdSettings'

export type DebugSettings = {
    showHitboxes: boolean
    showDamageLogs: boolean
    godMode: boolean
    enemyAI: boolean
}

export const defaultSettings: DebugSettings = {
    showHitboxes: false,
    showDamageLogs: false,
    godMode: false,
    enemyAI: false,
}
export const settingsSchema = [
    { key: 'showHitboxes', label: 'Show Hitboxes' },
    { key: 'showDamageLogs', label: 'Show Damage Logs' },
    { key: 'godMode', label: 'God Mode' },
    { key: 'enemyAI', label: 'Enable Enemy AI' },
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

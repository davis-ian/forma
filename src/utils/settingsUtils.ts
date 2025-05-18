const settingsKey = 'dotdSettings'
export function initSettings() {
    const debugSettings = {}
    localStorage.setItem(settingsKey, JSON.stringify(debugSettings))

    return debugSettings
}

export function getSettings() {
    const settingsString = localStorage.getItem(settingsKey)

    if (!settingsString) return null

    return JSON.parse(settingsString)
}

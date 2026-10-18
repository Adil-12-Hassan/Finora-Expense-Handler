const THEME_STORAGE_KEY = 'finora-theme'
const DEFAULT_THEME = 'dark'

export const getStoredTheme = () => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : DEFAULT_THEME
}

export const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    window.dispatchEvent(new Event('finora-theme-change'))
}

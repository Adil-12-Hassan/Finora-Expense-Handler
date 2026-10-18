import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, getStoredTheme } from '../../utils/theme'

const ThemeToggle = ({ compact = false }) => {
    const [theme, setTheme] = useState(getStoredTheme)
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const Icon = theme === 'dark' ? Sun : Moon

    useEffect(() => {
        const syncTheme = () => setTheme(getStoredTheme())
        window.addEventListener('finora-theme-change', syncTheme)
        return () => window.removeEventListener('finora-theme-change', syncTheme)
    }, [])

    const toggleTheme = () => {
        applyTheme(nextTheme)
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
            className={compact
                ? 'flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-medium cursor-pointer transition-colors'
                : 'flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors'}
            style={{
                background: compact ? 'transparent' : 'var(--color-surface-2)',
                border: compact ? '1px solid transparent' : '1px solid var(--color-border)',
                color: 'var(--color-text)',
            }}
        >
            <Icon size={18} />
            {compact && <span>Theme</span>}
        </button>
    )
}

export default ThemeToggle

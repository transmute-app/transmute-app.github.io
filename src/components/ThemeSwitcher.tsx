import { useState, useRef, useEffect } from 'react'
import { THEMES, useTheme, type ThemeKey } from '../context/ThemeContext'

const themeKeys = Object.keys(THEMES) as ThemeKey[]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-surface-dim dark:hover:bg-surface-dim-dark transition-colors"
        aria-label="Switch theme"
        title="Switch alchemy theme"
      >
        <span>{THEMES[theme].icon}</span>
        <span className="hidden sm:inline">{THEMES[theme].label}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface dark:bg-surface-dark shadow-xl z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            {themeKeys.map((key) => {
              const t = THEMES[key]
              const active = key === theme
              return (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-surface-dim dark:hover:bg-surface-dim-dark'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{t.icon}</span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{t.label}</div>
                    <div className="text-xs text-text-muted dark:text-text-muted-dark truncate">
                      {t.description}
                    </div>
                  </div>
                  {active && (
                    <svg
                      className="ml-auto h-4 w-4 flex-shrink-0 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

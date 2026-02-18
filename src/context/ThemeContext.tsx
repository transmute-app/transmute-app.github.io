import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export const THEMES = {
  'emerald-elixir': {
    label: 'Emerald Elixir',
    description: 'Classic alchemy — green & purple',
    icon: '🧪',
  },
  'philosophers-fire': {
    label: "Philosopher's Fire",
    description: 'Calcination — crimson & amber',
    icon: '🔥',
  },
  'magnum-opus': {
    label: 'Magnum Opus',
    description: 'The Great Work — gold & violet',
    icon: '✨',
  },
  nigredo: {
    label: 'Nigredo',
    description: 'The dark stage — indigo & silver',
    icon: '🌑',
  },
  viriditas: {
    label: 'Viriditas',
    description: 'The green force — teal & orange',
    icon: '🌿',
  },
} as const

export type ThemeKey = keyof typeof THEMES

const STORAGE_KEY = 'transmute-theme'
const DEFAULT_THEME: ThemeKey = 'philosophers-fire'

interface ThemeContextValue {
  theme: ThemeKey
  setTheme: (theme: ThemeKey) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME
    const stored = localStorage.getItem(STORAGE_KEY)
    return (stored && stored in THEMES) ? stored as ThemeKey : DEFAULT_THEME
  })

  const setTheme = (next: ThemeKey) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

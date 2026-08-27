import { useState } from 'react'
import { SunIcon, MoonIcon, AutoIcon } from './icons'
import { useTheme } from '../context/ThemeContext'

const THEME_OPTIONS = [
  { value: 'auto', label: 'Automatisch', icon: AutoIcon },
  { value: 'light', label: 'Licht', icon: SunIcon },
  { value: 'dark', label: 'Donker', icon: MoonIcon },
]

// Herbruikbare thema-knop met dropdown — gebruikt in de hoofdbalk bovenin
// én in Gastmodus, zodat ook een gast zelf tussen licht/donker/automatisch
// kan wisselen zonder in te loggen.
export default function ThemeToggle({ className = '' }) {
  const { preference, setPreference } = useTheme()
  const [open, setOpen] = useState(false)
  const ActiveIcon = THEME_OPTIONS.find((t) => t.value === preference)?.icon || AutoIcon

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Thema wijzigen"
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-11 h-11 rounded-token-md flex items-center justify-center text-text-secondary hover:bg-surface-2 transition-colors"
      >
        <ActiveIcon size={19} />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-modal cursor-default" aria-hidden="true" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-token-md shadow-token-lg z-modal py-1"
          >
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.value}
                  role="menuitem"
                  onClick={() => {
                    setPreference(opt.value)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 h-10 text-sm ${
                    preference === opt.value ? 'text-accent-soft-text bg-accent-soft' : 'text-text-primary hover:bg-surface-2'
                  }`}
                >
                  <Icon size={16} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

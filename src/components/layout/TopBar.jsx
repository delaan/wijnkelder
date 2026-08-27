import { useState } from 'react'
import { SunIcon, MoonIcon, AutoIcon, PlusIcon, ChevronDownIcon, LogoutIcon } from '../icons'
import { useTheme } from '../../context/ThemeContext'

const THEME_OPTIONS = [
  { value: 'auto', label: 'Automatisch', icon: AutoIcon },
  { value: 'light', label: 'Licht', icon: SunIcon },
  { value: 'dark', label: 'Donker', icon: MoonIcon },
]

export default function TopBar({ title, onAdd, email, onSignOut }) {
  const { preference, setPreference } = useTheme()
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const ActiveIcon = THEME_OPTIONS.find((t) => t.value === preference)?.icon || AutoIcon

  return (
    <header className="sticky top-0 z-nav bg-surface/90 backdrop-blur border-b border-border safe-top">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {title && <span className="font-semibold text-text-primary truncate md:hidden">{title}</span>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen((v) => !v)}
              aria-label="Thema wijzigen"
              aria-haspopup="menu"
              aria-expanded={themeMenuOpen}
              className="w-11 h-11 rounded-token-md flex items-center justify-center text-text-secondary hover:bg-surface-2 transition-colors"
            >
              <ActiveIcon size={19} />
            </button>
            {themeMenuOpen && (
              <>
                <button
                  className="fixed inset-0 z-modal cursor-default"
                  aria-hidden="true"
                  onClick={() => setThemeMenuOpen(false)}
                />
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
                          setThemeMenuOpen(false)
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 h-10 text-sm ${
                          preference === opt.value ? 'text-accent bg-accent-soft' : 'text-text-primary hover:bg-surface-2'
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

          {onAdd && (
            <button
              onClick={onAdd}
              className="h-11 px-4 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold flex items-center gap-2 shadow-[0_0_0_1px_var(--accent-soft),0_8px_24px_-8px_var(--accent)] transition-colors duration-fast"
            >
              <PlusIcon size={17} />
              <span className="hidden sm:inline">Wijn toevoegen</span>
            </button>
          )}

          {email && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-label="Accountmenu"
                className="w-11 h-11 rounded-token-full bg-surface-2 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              >
                <span className="text-sm font-semibold uppercase">{email[0]}</span>
              </button>
              {userMenuOpen && (
                <>
                  <button
                    className="fixed inset-0 z-modal cursor-default"
                    aria-hidden="true"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-token-md shadow-token-lg z-modal py-1"
                  >
                    <p className="px-3 py-2 text-xs text-text-tertiary truncate border-b border-border">{email}</p>
                    <button
                      role="menuitem"
                      onClick={onSignOut}
                      className="w-full flex items-center gap-2.5 px-3 h-10 text-sm text-text-primary hover:bg-surface-2"
                    >
                      <LogoutIcon size={16} />
                      Uitloggen
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

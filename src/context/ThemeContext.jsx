import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { deriveAccentTokens } from '../lib/color'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'wijnkast-theme'
const DEFAULTS = { preference: 'auto', accent: '#641027', dining: false }

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

function writeLocal(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // localStorage kan geblokkeerd zijn — dan werkt alleen de sessie zelf nog.
  }
}

function resolveIsDark(preference) {
  if (preference === 'dark') return true
  if (preference === 'light') return false
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyToDocument({ preference, accent, dining }) {
  const root = document.documentElement
  if (preference === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', preference)

  root.setAttribute('data-dining', dining ? 'true' : 'false')

  const isDark = resolveIsDark(preference)
  const tokens = deriveAccentTokens(accent, isDark)
  root.style.setProperty('--accent', tokens.accent)
  root.style.setProperty('--accent-hover', tokens.accentHover)
  root.style.setProperty('--accent-soft', tokens.accentSoft)
  root.style.setProperty('--accent-contrast', tokens.accentContrast)

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', isDark ? '#16130f' : tokens.accent)
}

export function ThemeProvider({ userId, children }) {
  const [state, setState] = useState(readLocal)
  const saveTimer = useRef(null)
  const loadedFromServer = useRef(false)

  useEffect(() => {
    applyToDocument(state)
    writeLocal(state)
  }, [state])

  // Live meebewegen met het systeemthema in "auto".
  useEffect(() => {
    if (state.preference !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyToDocument(state)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [state])

  // Bij inloggen: haal de opgeslagen voorkeuren van deze gebruiker op, zodat
  // instellingen meesynchroniseren tussen apparaten.
  useEffect(() => {
    if (!userId) return
    loadedFromServer.current = false
    supabase
      .from('cellar_settings_public')
      .select('accent_color, theme_preference, dining_view')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        if (data) {
          setState({
            preference: data.theme_preference || 'auto',
            accent: data.accent_color || DEFAULTS.accent,
            dining: Boolean(data.dining_view),
          })
        }
        loadedFromServer.current = true
      })
  }, [userId])

  const persist = useCallback(
    (next) => {
      if (!userId) return
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        supabase
          .from('cellar_settings')
          .upsert(
            {
              user_id: userId,
              theme_preference: next.preference,
              accent_color: next.accent,
              dining_view: next.dining,
            },
            { onConflict: 'user_id' }
          )
          .then(() => {})
      }, 400)
    },
    [userId]
  )

  const update = useCallback(
    (patch) => {
      setState((prev) => {
        const next = { ...prev, ...patch }
        persist(next)
        return next
      })
    },
    [persist]
  )

  const value = useMemo(
    () => ({
      preference: state.preference,
      accent: state.accent,
      dining: state.dining,
      setPreference: (preference) => update({ preference }),
      setAccent: (accent) => update({ accent }),
      setDining: (dining) => update({ dining }),
    }),
    [state, update]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme moet binnen ThemeProvider gebruikt worden')
  return ctx
}

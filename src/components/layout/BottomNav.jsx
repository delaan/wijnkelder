import { useState } from 'react'
import { NAV_ITEMS } from '../../lib/navItems'
import { PlusIcon, MoreIcon } from '../icons'
import { useFocusTrap } from '../../hooks/useFocusTrap'

const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.mobile !== false)
// Vaste volgorde voor het "Meer"-keuzemenu, los van de volgorde in de
// zijbalk — dit is wat Delano expliciet heeft opgegeven.
const MORE_MENU_KEYS = ['history', 'wishlist', 'cellarmap', 'guest']
const MORE_MENU_ITEMS = MORE_MENU_KEYS.map((key) => NAV_ITEMS.find((item) => item.key === key)).filter(Boolean)

function MoreSheet({ view, onNavigate, onClose }) {
  const dialogRef = useFocusTrap(onClose)
  return (
    <div className="md:hidden fixed inset-0 z-modal flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Meer" ref={dialogRef}>
      <div
        className="absolute inset-0 backdrop-blur-md animate-fade-in"
        style={{ background: 'var(--overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-[calc(100%-1.5rem)] max-w-sm mb-[calc(0.75rem+env(safe-area-inset-bottom))] space-y-2 animate-slide-up">
        <div className="rounded-token-lg overflow-hidden bg-surface/95 backdrop-blur-xl border border-border shadow-token-lg divide-y divide-border">
          {MORE_MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const active = view === item.key
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={active ? 'page' : undefined}
                className={`w-full h-14 flex items-center gap-3 px-4 text-base ${active ? 'text-accent-soft-text font-semibold' : 'text-text-primary'}`}
              >
                <Icon size={19} className="text-accent-soft-text shrink-0" />
                {item.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full h-14 rounded-token-lg bg-surface/95 backdrop-blur-xl border border-border shadow-token-lg text-base font-semibold text-accent-soft-text"
        >
          Annuleren
        </button>
      </div>
    </div>
  )
}

// Zwevende navigatiebalk (mobiel): losstaand van de schermranden, met
// volledig afgeronde hoeken en een "liquid glass"-achtige vervaging en
// doorschijnendheid — in plaats van een balk die plat tegen de onderkant
// van het scherm zit. "Wijn toevoegen" krijgt een prominente, verhoogde
// knop in het midden van de balk. Labels krimpen en breken zo nodig af
// zodat ze altijd binnen hun eigen kolom blijven, ook op een smal scherm.
// De laatste knop ("Meer") opent een keuzemenu voor schermen die geen
// eigen plek in de balk hebben (Geschiedenis, Verlanglijst, Kelderkaart,
// Wine food match, Gastmodus) — zo blijft de balk overzichtelijk.
export default function BottomNav({ view, onNavigate, onAdd }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const primaryItems = MOBILE_NAV_ITEMS.filter((item) => item.section !== 'secondary')
  const secondaryItems = MOBILE_NAV_ITEMS.filter((item) => item.section === 'secondary')
  const moreActive = MORE_MENU_ITEMS.some((item) => item.key === view)

  const handleMoreSelect = (key) => {
    setMoreOpen(false)
    onNavigate(key)
  }

  const renderItem = (item) => {
    const active = view === item.key
    const Icon = item.icon
    return (
      <button
        key={item.key}
        onClick={() => onNavigate(item.key)}
        aria-current={active ? 'page' : undefined}
        className="flex flex-col items-center justify-center gap-0.5 h-14 min-w-0 px-0.5 text-[9.5px] font-medium"
      >
        <span
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-fast ${
            active ? 'bg-nav-active text-accent-soft-text' : 'text-text-tertiary'
          }`}
        >
          <Icon size={18} />
        </span>
        <span
          className={`w-full truncate text-center leading-tight ${
            active ? 'text-accent-soft-text font-semibold' : 'text-text-tertiary'
          }`}
        >
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <>
      <nav
        className="md:hidden fixed inset-x-3 z-nav safe-left safe-right pointer-events-none"
        style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        aria-label="Hoofdnavigatie"
      >
        <div
          className="max-w-sm mx-auto rounded-full pointer-events-auto backdrop-blur-xl
            bg-[color-mix(in_srgb,var(--surface)_72%,transparent)]
            border border-[color-mix(in_srgb,var(--border-strong)_55%,transparent)]
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_12px_32px_-8px_rgba(0,0,0,0.28)]"
        >
          <div className={`grid ${onAdd ? 'grid-cols-5' : 'grid-cols-4'} px-1 py-1.5`}>
            {primaryItems.map(renderItem)}
            {onAdd && (
              <div className="flex items-center justify-center min-w-0">
                <button
                  onClick={onAdd}
                  aria-label="Wijn toevoegen"
                  className="w-14 h-14 -mt-6 rounded-full bg-accent hover:bg-accent-hover text-accent-contrast flex items-center justify-center border-4 border-[var(--bg)] shadow-[0_10px_22px_-6px_var(--accent)] transition-colors duration-fast"
                >
                  <PlusIcon size={21} />
                </button>
              </div>
            )}
            {secondaryItems.map(renderItem)}
            <button
              onClick={() => setMoreOpen(true)}
              aria-label="Meer"
              aria-haspopup="true"
              aria-expanded={moreOpen}
              className="flex flex-col items-center justify-center gap-0.5 h-14 min-w-0 px-0.5 text-[9.5px] font-medium"
            >
              <span
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-fast ${
                  moreActive ? 'bg-nav-active text-accent-soft-text' : 'text-text-tertiary'
                }`}
              >
                <MoreIcon size={18} />
              </span>
              <span
                className={`w-full truncate text-center leading-tight ${
                  moreActive ? 'text-accent-soft-text font-semibold' : 'text-text-tertiary'
                }`}
              >
                Meer
              </span>
            </button>
          </div>
        </div>
      </nav>

      {moreOpen && <MoreSheet view={view} onNavigate={handleMoreSelect} onClose={() => setMoreOpen(false)} />}
    </>
  )
}

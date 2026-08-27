import { NAV_ITEMS } from '../../lib/navItems'
import { PlusIcon } from '../icons'

// Zwevende navigatiebalk (mobiel): losstaand van de schermranden, met
// volledig afgeronde hoeken en een "liquid glass"-achtige vervaging en
// doorschijnendheid — in plaats van een balk die plat tegen de onderkant
// van het scherm zit. "Wijn toevoegen" krijgt een prominente, verhoogde
// knop in het midden van de balk.
export default function BottomNav({ view, onNavigate, onAdd }) {
  const primaryItems = NAV_ITEMS.filter((item) => item.section !== 'secondary')
  const secondaryItems = NAV_ITEMS.filter((item) => item.section === 'secondary')

  const renderItem = (item) => {
    const active = view === item.key
    const Icon = item.icon
    return (
      <button
        key={item.key}
        onClick={() => onNavigate(item.key)}
        aria-current={active ? 'page' : undefined}
        className="flex flex-col items-center justify-center gap-0.5 h-14 min-w-[44px] text-[10px] font-medium"
      >
        <span
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-fast ${
            active ? 'bg-accent-soft text-accent-soft-text' : 'text-text-tertiary'
          }`}
        >
          <Icon size={19} />
        </span>
        <span className={active ? 'text-accent-soft-text' : 'text-text-tertiary'}>{item.label}</span>
      </button>
    )
  }

  return (
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
        <div className={`grid ${onAdd ? 'grid-cols-6' : 'grid-cols-5'} px-1.5 py-1.5 items-center`}>
          {primaryItems.map(renderItem)}
          {onAdd && (
            <div className="flex items-center justify-center">
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
        </div>
      </div>
    </nav>
  )
}

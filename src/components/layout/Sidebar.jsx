import { NAV_ITEMS } from '../../lib/navItems'

// De zijbalk toont alleen de navigatie — de titel/logo van de wijnkast staat
// nu in de balk bovenin (TopBar), zodat het één doorlopende balk vormt in
// plaats van twee losse blokken naast elkaar.
//
// Broadsheet-ontwerp: een "navigatie-rail" zoals in een krantensite — een
// kicker-label boven de lijst, en actieve items met een dikke linkerrand
// i.p.v. een afgeronde achtergrondpil.
export default function Sidebar({ view, onNavigate }) {
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
        className={`w-full flex items-center gap-3 h-11 pl-3.5 pr-3 border-l-[3px] text-sm transition-colors duration-fast
          ${active ? 'border-accent bg-accent-soft text-text-primary font-semibold' : 'border-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`}
      >
        <Icon size={18} className="shrink-0" />
        <span className="font-serif truncate">{item.label}</span>
      </button>
    )
  }

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-border-strong bg-surface h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="flex-1 flex flex-col px-3 pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))]" aria-label="Hoofdnavigatie">
        <p className="kicker px-3.5 mb-2">Navigatie</p>
        <div className="space-y-px">{primaryItems.map(renderItem)}</div>
        {secondaryItems.length > 0 && (
          <div className="mt-auto pt-3 border-t border-border space-y-px">{secondaryItems.map(renderItem)}</div>
        )}
      </nav>
    </aside>
  )
}

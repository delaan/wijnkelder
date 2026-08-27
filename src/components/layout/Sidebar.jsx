import { NAV_ITEMS } from '../../lib/navItems'

// De zijbalk toont alleen de navigatie — de titel/logo van de wijnkast staat
// nu in de balk bovenin (TopBar), zodat het één doorlopende balk vormt in
// plaats van twee losse blokken naast elkaar.
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
        className={`w-full flex items-center gap-3 h-11 px-3 rounded-token-md text-sm font-medium transition-colors duration-fast
          ${active ? 'bg-accent-soft text-accent-soft-text' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`}
      >
        <Icon size={20} className="shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    )
  }

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-border bg-surface h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 flex flex-col px-3 py-4" aria-label="Hoofdnavigatie">
        <div className="space-y-1">{primaryItems.map(renderItem)}</div>
        {secondaryItems.length > 0 && (
          <div className="mt-auto pt-3 border-t border-border space-y-1">{secondaryItems.map(renderItem)}</div>
        )}
      </nav>
    </aside>
  )
}

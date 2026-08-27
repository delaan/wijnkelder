import { NAV_ITEMS } from '../../lib/navItems'
import { LogoMark } from '../../lib/logoPresets'

export default function Sidebar({ view, onNavigate, cellarName, logoType, logoUrl }) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-border bg-surface h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
        <span className="w-8 h-8 rounded-token-md bg-accent-soft flex items-center justify-center shrink-0 overflow-hidden">
          <LogoMark logoType={logoType} logoUrl={logoUrl} size={18} className="text-accent" />
        </span>
        <span className="font-semibold text-text-primary truncate min-w-0" title={cellarName}>
          {cellarName}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Hoofdnavigatie">
        {NAV_ITEMS.map((item) => {
          const active = view === item.key
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center gap-3 h-11 px-3 rounded-token-md text-sm font-medium transition-colors duration-fast
                ${active ? 'bg-accent-soft text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

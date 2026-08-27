import { NAV_ITEMS } from '../../lib/navItems'

export default function BottomNav({ view, onNavigate }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-nav bg-surface border-t border-border safe-bottom safe-left safe-right"
      aria-label="Hoofdnavigatie"
    >
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = view === item.key
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center justify-center gap-1 h-16 min-w-[44px] text-[11px] font-medium"
            >
              <span
                className={`w-9 h-9 flex items-center justify-center rounded-token-full transition-colors duration-fast ${
                  active ? 'bg-accent-soft text-accent' : 'text-text-tertiary'
                }`}
              >
                <Icon size={20} />
              </span>
              <span className={active ? 'text-accent' : 'text-text-tertiary'}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

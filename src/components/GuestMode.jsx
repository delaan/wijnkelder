import { useMemo, useState } from 'react'
import { WINE_COLORS, TASTE_PROFILES, FOOD_PAIRINGS } from '../lib/wineHelpers'
import { LogoMark } from '../lib/logoPresets'
import { SearchIcon, ChevronRightIcon } from './icons'
import Collection from './Collection'

const TILES = [
  ...WINE_COLORS.slice(0, 4).map((c) => ({ kind: 'color', value: c.value, label: c.label, dot: c.dot })),
  ...TASTE_PROFILES.map((t) => ({ kind: 'tasting_profile', value: t.value, label: t.label })),
  ...FOOD_PAIRINGS.map((f) => ({ kind: 'food_pairing', value: f.value, label: f.label })),
]

export default function GuestMode({ wines, cellarName, logoType, logoUrl, onOpenWine, onExit }) {
  const [filter, setFilter] = useState(null) // { kind, value } | 'all' | null
  const [search, setSearch] = useState('')

  const filteredWines = useMemo(() => {
    if (!filter) return []
    if (filter === 'all') return wines
    if (filter.kind === 'food_pairing') {
      return wines.filter((w) => Array.isArray(w.food_pairing) && w.food_pairing.includes(filter.value))
    }
    return wines.filter((w) => w[filter.kind] === filter.value)
  }, [wines, filter])

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-nav bg-surface/90 backdrop-blur border-b border-border safe-top">
        <div className="h-16 px-4 sm:px-6 flex items-center gap-3 max-w-5xl mx-auto">
          <button
            onClick={onExit}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Terug naar normale weergave (tik op het logo)"
          >
            <span className="w-8 h-8 rounded-token-md bg-accent-soft flex items-center justify-center overflow-hidden">
              <LogoMark logoType={logoType} logoUrl={logoUrl} size={17} className="text-accent" />
            </span>
            <span className="font-semibold text-text-primary truncate">{cellarName}</span>
          </button>
          <span className="ml-auto text-xs text-text-tertiary hidden sm:inline">Gastmodus</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!filter ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-text-primary">Waar heb je zin in?</h1>
              <p className="text-text-secondary text-sm mt-1">Kies een type, smaak of gerecht om de collectie te ontdekken.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TILES.map((tile) => (
                <button
                  key={`${tile.kind}-${tile.value}`}
                  onClick={() => setFilter(tile)}
                  className="h-24 rounded-token-lg border border-border bg-surface hover:border-accent hover:bg-accent-soft transition-colors flex flex-col items-center justify-center gap-2"
                >
                  {tile.dot && <span className="w-3 h-3 rounded-token-full" style={{ backgroundColor: tile.dot }} />}
                  <span className="text-sm font-medium text-text-primary">{tile.label}</span>
                </button>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center gap-1.5 h-11 px-5 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold"
              >
                Bekijk de hele collectie
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setFilter(null)} className="text-sm font-medium text-accent">
                ← Andere keuze
              </button>
              <p className="text-sm text-text-secondary" aria-live="polite">
                {filter === 'all' ? 'Hele collectie' : `Filter: ${filter.label}`}
              </p>
            </div>
            <div className="relative">
              <SearchIcon size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoeken binnen deze selectie…"
                className="w-full h-11 pl-10 pr-3 rounded-token-md bg-surface-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <Collection wines={filteredWines} search={search} onOpenWine={onOpenWine} hidePrivate />
          </div>
        )}
      </main>
    </div>
  )
}

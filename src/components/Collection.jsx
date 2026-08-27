import { useEffect, useMemo, useState } from 'react'
import { GridIcon, ListIcon } from './icons'
import { WINE_COLORS, colorLabel, tasteLabel } from '../lib/wineHelpers'
import WineGridCard from './WineGridCard'
import WineListRow from './WineListRow'
import EmptyState from './EmptyState'

const STORAGE_KEY = 'wijnkast-collection-view'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent toegevoegd' },
  { value: 'name', label: 'Naam A-Z' },
  { value: 'producer', label: 'Producent A-Z' },
  { value: 'vintage_desc', label: 'Jaargang (nieuw eerst)' },
  { value: 'vintage_asc', label: 'Jaargang (oud eerst)' },
  { value: 'stock', label: 'Voorraad' },
  { value: 'value', label: 'Waarde' },
  { value: 'favorites', label: 'Favorieten eerst' },
]

const GROUP_OPTIONS = [
  { value: 'none', label: 'Geen groepering' },
  { value: 'color', label: 'Wijntype' },
  { value: 'tasting_profile', label: 'Smaakprofiel' },
  { value: 'producer', label: 'Producent' },
  { value: 'country', label: 'Land' },
  { value: 'region', label: 'Regio' },
]

function readPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function sortWines(wines, sortBy) {
  const sorted = [...wines]
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'producer':
      return sorted.sort((a, b) => (a.producer || '').localeCompare(b.producer || ''))
    case 'vintage_desc':
      return sorted.sort((a, b) => (b.vintage || 0) - (a.vintage || 0))
    case 'vintage_asc':
      return sorted.sort((a, b) => (a.vintage || 0) - (b.vintage || 0))
    case 'stock':
      return sorted.sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    case 'value':
      return sorted.sort(
        (a, b) => (b.estimated_value || b.purchase_price || 0) - (a.estimated_value || a.purchase_price || 0)
      )
    case 'favorites':
      return sorted.sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0))
    default:
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

function groupLabel(groupBy, value) {
  if (groupBy === 'color') return colorLabel(value)
  if (groupBy === 'tasting_profile') return tasteLabel(value) || 'Onbekend'
  return value || 'Onbekend'
}

export default function Collection({ wines, search, onOpenWine, onToggleFavorite, hidePrivate }) {
  const persisted = readPersisted()
  const [viewMode, setViewMode] = useState(persisted.viewMode || 'grid')
  const [sortBy, setSortBy] = useState(persisted.sortBy || 'recent')
  const [groupBy, setGroupBy] = useState(persisted.groupBy || 'none')
  const [colorFilter, setColorFilter] = useState(persisted.colorFilter || '')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ viewMode, sortBy, groupBy, colorFilter }))
    } catch {
      // negeer opslagfouten stilletjes
    }
  }, [viewMode, sortBy, groupBy, colorFilter])

  const filtered = useMemo(() => {
    let result = wines
    if (search?.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((w) =>
        [w.name, w.producer, w.grape_varieties, w.region, w.country, String(w.vintage || ''), colorLabel(w.color), tasteLabel(w.tasting_profile)]
          .filter(Boolean)
          .some((f) => String(f).toLowerCase().includes(q))
      )
    }
    if (colorFilter) result = result.filter((w) => w.color === colorFilter)
    return sortWines(result, sortBy)
  }, [wines, search, colorFilter, sortBy])

  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ label: null, wines: filtered }]
    const map = new Map()
    for (const w of filtered) {
      const key = w[groupBy] || '—'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(w)
    }
    return Array.from(map.entries()).map(([key, groupWines]) => ({
      label: groupLabel(groupBy, key),
      wines: groupWines,
    }))
  }, [filtered, groupBy])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
          className="h-10 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Alle types</option>
          {WINE_COLORS.slice(0, 5).map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sorteren: {o.label}
            </option>
          ))}
        </select>

        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="h-10 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {GROUP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Groeperen: {o.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-1 bg-surface-2 rounded-token-md p-1">
          <button
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="Rasterweergave"
            className={`w-9 h-9 rounded-token-sm flex items-center justify-center ${
              viewMode === 'grid' ? 'bg-surface shadow-token-sm text-accent' : 'text-text-tertiary'
            }`}
          >
            <GridIcon size={17} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="Lijstweergave"
            className={`w-9 h-9 rounded-token-sm flex items-center justify-center ${
              viewMode === 'list' ? 'bg-surface shadow-token-sm text-accent' : 'text-text-tertiary'
            }`}
          >
            <ListIcon size={17} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState hasFilters={Boolean(search || colorFilter)} />
      ) : (
        groups.map((group) => (
          <div key={group.label || 'all'}>
            {group.label && <h3 className="text-sm font-semibold text-text-secondary mb-2.5 mt-4">{group.label}</h3>}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {group.wines.map((wine) => (
                  <WineGridCard
                    key={wine.id}
                    wine={wine}
                    onOpen={onOpenWine}
                    onToggleFavorite={onToggleFavorite}
                    hidePrivate={hidePrivate}
                  />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border bg-surface border border-border rounded-token-lg px-2">
                {group.wines.map((wine) => (
                  <WineListRow
                    key={wine.id}
                    wine={wine}
                    onOpen={onOpenWine}
                    onToggleFavorite={onToggleFavorite}
                    hidePrivate={hidePrivate}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

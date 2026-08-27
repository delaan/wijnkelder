import { useEffect, useMemo, useState } from 'react'
import { GridIcon, ListIcon, ChevronDownIcon, CheckIcon, HeartIcon } from './icons'
import { WINE_COLORS, colorLabel, tasteLabel } from '../lib/wineHelpers'
import WineGridCard from './WineGridCard'
import WineListRow from './WineListRow'
import EmptyState from './EmptyState'
import { useFocusTrap } from '../hooks/useFocusTrap'

// Compacte, aantikbare dropdown voor keuzes met veel opties (sorteren,
// groeperen) — alle opties direct zichtbaar zodra hij open staat, in
// plaats van een systeem-<select>.
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const menuRef = useFocusTrap(open ? () => setOpen(false) : null)
  const current = options.find((o) => o.value === value)
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-10 pl-3.5 pr-2.5 rounded-token-full border border-border bg-surface text-sm font-medium text-text-primary flex items-center gap-1.5 hover:border-border-strong transition-colors whitespace-nowrap"
      >
        <span className="text-text-tertiary">{label}:</span> {current?.label}
        <ChevronDownIcon size={14} className="text-text-tertiary" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-modal cursor-default" aria-hidden="true" onClick={() => setOpen(false)} />
          <div
            ref={menuRef}
            role="menu"
            className="absolute left-0 mt-2 w-60 max-h-80 overflow-y-auto bg-surface border border-border rounded-token-md shadow-token-lg z-modal py-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                role="menuitem"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 h-10 text-sm text-left ${
                  value === opt.value ? 'text-accent-soft-text bg-accent-soft font-medium' : 'text-text-primary hover:bg-surface-2'
                }`}
              >
                {opt.label}
                {value === opt.value && <CheckIcon size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const STORAGE_KEY = 'wijnkast-collection-view'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent toegevoegd' },
  { value: 'name', label: 'Naam A-Z' },
  { value: 'producer', label: 'Producent A-Z' },
  { value: 'vintage_desc', label: 'Jaargang (nieuw eerst)' },
  { value: 'vintage_asc', label: 'Jaargang (oud eerst)' },
  { value: 'stock', label: 'Voorraad' },
  { value: 'value', label: 'Waarde' },
  { value: 'rating', label: 'Beoordeling' },
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
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
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

export default function Collection({
  wines,
  search,
  onOpenWine,
  onToggleFavorite,
  hidePrivate,
  initialColorFilter = '',
  persist = true,
  // De aparte "Favorieten"-bestemming staat niet meer in de navigatiebalk
  // onderin (mobiel) — favorieten filteren gebeurt in plaats daarvan met
  // een knop hier binnen Collectie, alleen zichtbaar op mobiel (op desktop
  // heeft de zijbalk al een eigen Favorieten-item). Deze knop wordt
  // uitgezet op de losse (desktop-only) Favorieten-weergave zelf, en in
  // Gastmodus, om dubbele/overbodige UI te voorkomen.
  showFavoritesToggle = true,
}) {
  const persisted = persist ? readPersisted() : {}
  const [viewMode, setViewMode] = useState(persisted.viewMode || 'grid')
  const [sortBy, setSortBy] = useState(persisted.sortBy || 'recent')
  const [groupBy, setGroupBy] = useState(persisted.groupBy || 'none')
  // In Gastmodus (persist=false) start het kleurfilter op de categorie die
  // de gast heeft aangetikt, en blijft dat filter — net als in het
  // hoofdmenu — hier volledig aan/uit te zetten via de knoppen hieronder.
  const [colorFilter, setColorFilter] = useState(persisted.colorFilter || initialColorFilter)
  const [favoritesOnly, setFavoritesOnly] = useState(persisted.favoritesOnly || false)

  useEffect(() => {
    if (!persist) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ viewMode, sortBy, groupBy, colorFilter, favoritesOnly }))
    } catch {
      // negeer opslagfouten stilletjes
    }
  }, [persist, viewMode, sortBy, groupBy, colorFilter, favoritesOnly])

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
    if (showFavoritesToggle && favoritesOnly) result = result.filter((w) => w.is_favorite)
    return sortWines(result, sortBy)
  }, [wines, search, colorFilter, sortBy, showFavoritesToggle, favoritesOnly])

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
      <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-0.5" role="group" aria-label="Filter op wijntype">
        {showFavoritesToggle && (
          <button
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
            className={`md:hidden h-9 pl-2.5 pr-3.5 rounded-token-full text-sm font-medium whitespace-nowrap border shrink-0 flex items-center gap-1.5 transition-colors ${
              favoritesOnly ? 'bg-accent text-accent-contrast border-accent' : 'bg-surface text-text-secondary border-border hover:border-border-strong'
            }`}
          >
            <HeartIcon size={13} filled={favoritesOnly} />
            Favorieten
          </button>
        )}
        <button
          onClick={() => setColorFilter('')}
          aria-pressed={colorFilter === ''}
          className={`h-9 px-3.5 rounded-token-full text-sm font-medium whitespace-nowrap border shrink-0 transition-colors ${
            colorFilter === '' ? 'bg-accent text-accent-contrast border-accent' : 'bg-surface text-text-secondary border-border hover:border-border-strong'
          }`}
        >
          Alle
        </button>
        {WINE_COLORS.slice(0, 5).map((c) => (
          <button
            key={c.value}
            onClick={() => setColorFilter(colorFilter === c.value ? '' : c.value)}
            aria-pressed={colorFilter === c.value}
            className={`h-9 pl-2.5 pr-3.5 rounded-token-full text-sm font-medium whitespace-nowrap border shrink-0 flex items-center gap-1.5 transition-colors ${
              colorFilter === c.value ? 'bg-accent text-accent-contrast border-accent' : 'bg-surface text-text-secondary border-border hover:border-border-strong'
            }`}
          >
            <span className="w-2 h-2 rounded-token-full shrink-0" style={{ backgroundColor: c.dot }} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <FilterDropdown label="Sorteren" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
        <FilterDropdown label="Groeperen" value={groupBy} options={GROUP_OPTIONS} onChange={setGroupBy} />

        <div className="ml-auto flex items-center gap-1 bg-surface-2 rounded-token-md p-1">
          <button
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="Rasterweergave"
            className={`w-10 h-10 rounded-token-sm flex items-center justify-center ${
              viewMode === 'grid' ? 'bg-surface shadow-token-sm text-accent-soft-text' : 'text-text-tertiary'
            }`}
          >
            <GridIcon size={17} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="Lijstweergave"
            className={`w-10 h-10 rounded-token-sm flex items-center justify-center ${
              viewMode === 'list' ? 'bg-surface shadow-token-sm text-accent-soft-text' : 'text-text-tertiary'
            }`}
          >
            <ListIcon size={17} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState hasFilters={Boolean(search || colorFilter || (showFavoritesToggle && favoritesOnly))} />
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

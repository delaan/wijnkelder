import { WINE_COLORS } from '../lib/wineHelpers'

export default function Filters({ search, onSearch, color, onColor, sort, onSort }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Zoek op naam, wijnmaker, druif of regio…"
        className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-transparent"
      />
      <select
        value={color}
        onChange={(e) => onColor(e.target.value)}
        className="rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-wine-700"
      >
        <option value="">Alle kleuren</option>
        {WINE_COLORS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value)}
        className="rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-wine-700"
      >
        <option value="recent">Recent toegevoegd</option>
        <option value="name">Naam A-Z</option>
        <option value="vintage_desc">Jaargang (nieuw eerst)</option>
        <option value="vintage_asc">Jaargang (oud eerst)</option>
        <option value="rating">Beoordeling</option>
      </select>
    </div>
  )
}

import { formatCurrency, totalBottles, totalValue } from '../lib/wineHelpers'

export default function StatsBar({ wines }) {
  const bottles = totalBottles(wines)
  const value = totalValue(wines)
  const distinctWines = wines.length
  const regions = new Set(wines.map((w) => w.region).filter(Boolean)).size

  const stats = [
    { label: 'Flessen', value: bottles },
    { label: 'Wijnen', value: distinctWines },
    { label: 'Regio’s', value: regions },
    { label: 'Geschatte waarde', value: formatCurrency(value) },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-stone-200 rounded-xl px-4 py-3">
          <p className="text-stone-500 text-xs font-medium uppercase tracking-wide">{s.label}</p>
          <p className="font-serif text-xl font-semibold text-stone-900 mt-0.5">{s.value}</p>
        </div>
      ))}
    </div>
  )
}

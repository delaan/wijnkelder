import { useMemo } from 'react'
import { totalBottles, totalValue, colorDistribution, formatCurrency, isInDrinkWindow } from '../lib/wineHelpers'
import DistributionBar from './DistributionBar'
import WineListRow from './WineListRow'
import WeatherWidget from './WeatherWidget'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-surface border border-border rounded-token-lg p-4">
      <p className="text-text-tertiary text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-2xl text-text-primary mt-1">{value}</p>
      {sub && <p className="text-text-tertiary text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Dashboard({ wines, onOpenWine, onToggleFavorite, onGoToCollection, displayName, heroImageUrl }) {
  const stats = useMemo(() => {
    const bottles = totalBottles(wines)
    const distinct = wines.length
    const value = totalValue(wines)
    const inWindow = wines.filter((w) => isInDrinkWindow(w.drink_from, w.drink_until)).length
    const lowStock = wines.filter((w) => w.quantity > 0 && w.quantity <= 2)
    const recent = [...wines].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
    const distribution = colorDistribution(wines)
    return { bottles, distinct, value, inWindow, lowStock, recent, distribution }
  }, [wines])

  return (
    <div className="space-y-8">
      <div className="relative h-64 sm:h-80 rounded-token-lg overflow-hidden bg-surface-2">
        <img src={heroImageUrl || '/hero-default.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* De foto heeft onderaan al een lichte gloed; dit verloop trekt die
            door naar de echte paginakleur, zodat de kaart — ook in donkere
            modus — netjes overloopt in de blokjes eronder. */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 38%, var(--bg) 97%)' }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]">
            Welkom{displayName ? `, ${displayName}` : ''}
          </h1>
          <p className="text-white/95 text-sm sm:text-base font-medium mt-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            Een overzicht van je hele collectie.
          </p>
        </div>
      </div>

      <div className="flex justify-end -mt-4">
        <WeatherWidget />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Flessen" value={stats.bottles} />
        <StatCard label="Wijnen" value={stats.distinct} />
        <StatCard label="Geschatte waarde" value={formatCurrency(stats.value)} />
        <StatCard label="In drinkvenster" value={stats.inWindow} />
      </div>

      <section className="bg-surface border border-border rounded-token-lg p-5">
        <h2 className="font-semibold text-text-primary mb-4">Collectie in balans</h2>
        <DistributionBar segments={stats.distribution} />
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        <section className="bg-surface border border-border rounded-token-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-text-primary">Recent toegevoegd</h2>
            <button onClick={onGoToCollection} className="text-accent-soft-text text-sm font-medium">
              Alles bekijken
            </button>
          </div>
          {stats.recent.length === 0 ? (
            <p className="text-text-tertiary text-sm py-4">Nog niks toegevoegd.</p>
          ) : (
            <div className="divide-y divide-border -mx-1">
              {stats.recent.map((w) => (
                <WineListRow key={w.id} wine={w} onOpen={onOpenWine} onToggleFavorite={onToggleFavorite} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface border border-border rounded-token-lg p-5">
          <h2 className="font-semibold text-text-primary mb-2">Bijna op</h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-text-tertiary text-sm py-4">Niks is bijna op.</p>
          ) : (
            <div className="divide-y divide-border -mx-1">
              {stats.lowStock.map((w) => (
                <WineListRow key={w.id} wine={w} onOpen={onOpenWine} onToggleFavorite={onToggleFavorite} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

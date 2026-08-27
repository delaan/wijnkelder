import { useMemo } from 'react'
import { totalBottles, totalValue, colorDistribution, formatCurrency, isInDrinkWindow } from '../lib/wineHelpers'
import DistributionBar from './DistributionBar'
import WineListRow from './WineListRow'
import WeatherWidget from './WeatherWidget'

// Broadsheet-ontwerp: geen grote foto-hero meer — een redactionele voorpagina
// met een welkomstalinea, een cijferkader, de verdelingsbalk en twee kolommen
// (recent toegevoegd / bijna op), met een smalle zijkolom voor het weer en
// een verwijzing naar "Wine, food, match!".
function StatBlock({ value, label }) {
  return (
    <div>
      <span className="block font-serif text-2xl sm:text-[1.75rem] font-semibold text-text-primary leading-none">
        {value}
      </span>
      <span className="byline">{label}</span>
    </div>
  )
}

function EntryRow({ wine, onOpenWine, onToggleFavorite, accent }) {
  return (
    <button
      onClick={() => onOpenWine(wine)}
      className="w-full flex items-center justify-between gap-3 py-3 border-t border-border text-left"
    >
      <span className="min-w-0">
        <span className="block font-serif text-[15px] font-semibold text-text-primary truncate">{wine.name}</span>
        <span className="byline truncate block">
          {[wine.region, wine.vintage].filter(Boolean).join(' · ')}
        </span>
      </span>
      <span className={`byline whitespace-nowrap ${accent ? 'text-accent' : ''}`}>{wine.quantity} fl.</span>
    </button>
  )
}

export default function Dashboard({ wines, onOpenWine, onToggleFavorite, onGoToCollection, displayName }) {
  const stats = useMemo(() => {
    const bottles = totalBottles(wines)
    const distinct = wines.length
    const value = totalValue(wines)
    const inWindow = wines.filter((w) => isInDrinkWindow(w.drink_from, w.drink_until)).length
    const lowStock = [...wines.filter((w) => w.quantity > 0 && w.quantity <= 2)]
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5)
    const recent = [...wines].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
    const distribution = colorDistribution(wines)
    return { bottles, distinct, value, inWindow, lowStock, recent, distribution }
  }, [wines])

  return (
    <div>
      {/* Masthead-koppel bovenaan de voorpagina */}
      <div className="pb-4 border-b border-border-strong flex justify-between items-baseline gap-3 flex-wrap">
        <p className="kicker">Welkom terug</p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-10">
        <div>
          {/* Lead: welkomstalinea + cijferkader */}
          <div className="grid sm:grid-cols-[1.3fr_1fr] gap-8 pt-6 pb-7 border-b border-border-strong">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text-primary leading-tight mb-3">
                Welkom{displayName ? `, ${displayName}` : ''}
              </h1>
              <p className="text-[15px] leading-relaxed text-text-secondary">
                Je kelder telt vandaag {stats.distinct} wijnen verdeeld over {stats.bottles} flessen, met een
                geschatte waarde van {formatCurrency(stats.value)}.{' '}
                {stats.inWindow > 0
                  ? `${stats.inWindow} fles${stats.inWindow > 1 ? 'sen' : ''} ${stats.inWindow > 1 ? 'staan' : 'staat'} op het punt hun drinkvenster te bereiken.`
                  : 'Er is een overzicht van je hele collectie hieronder.'}
              </p>
            </div>
            <div className="border border-border-strong bg-surface p-5">
              <p className="kicker mb-3">In cijfers</p>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <StatBlock value={stats.bottles} label="Flessen" />
                <StatBlock value={stats.distinct} label="Wijnen" />
                <StatBlock value={formatCurrency(stats.value)} label="Geschatte waarde" />
                <StatBlock value={stats.inWindow} label="In drinkvenster" />
              </div>
            </div>
          </div>

          {/* Collectie in balans */}
          <div className="py-6 border-b border-border-strong">
            <p className="kicker mb-3">Collectie in balans</p>
            <DistributionBar segments={stats.distribution} />
          </div>

          {/* Twee kolommen: recent / bijna op */}
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-10 pt-6">
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <p className="kicker">Recent toegevoegd</p>
                <button onClick={onGoToCollection} className="text-xs font-semibold text-accent-soft-text">
                  Alles bekijken →
                </button>
              </div>
              {stats.recent.length === 0 ? (
                <p className="text-text-tertiary text-sm py-4">Nog niks toegevoegd.</p>
              ) : (
                <div>
                  {stats.recent.map((w) => (
                    <EntryRow key={w.id} wine={w} onOpenWine={onOpenWine} onToggleFavorite={onToggleFavorite} />
                  ))}
                </div>
              )}
            </div>

            <div className="sm:pl-10 sm:border-l border-border-strong">
              <p className="kicker mb-1">Bijna op</p>
              {stats.lowStock.length === 0 ? (
                <p className="text-text-tertiary text-sm py-4">Niks is bijna op.</p>
              ) : (
                <div>
                  {stats.lowStock.map((w) => (
                    <EntryRow key={w.id} wine={w} onOpenWine={onOpenWine} onToggleFavorite={onToggleFavorite} accent />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zijkolom: weer + verwijzing naar Wine, food, match! */}
        <aside className="mt-8 lg:mt-0 lg:pl-8 lg:border-l border-border-strong pt-1">
          <WeatherWidget />
        </aside>
      </div>
    </div>
  )
}

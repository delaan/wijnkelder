import { useState } from 'react'
import { FOOD_PAIRINGS, pairingLabel } from '../lib/wineHelpers'
import { BowlFoodIcon } from './icons'
import WineListRow from './WineListRow'
import PageHeader from './PageHeader'

// Eigen scherm (voorheen een blokje op het dashboard): kies wat er op tafel
// komt, en zie welke wijnen uit je eigen kelder (met voorraad) daarbij
// passen — gebruikt het bestaande food_pairing-veld op elke wijn.
export default function WineFoodMatch({ wines, onOpenWine, onToggleFavorite }) {
  const [selected, setSelected] = useState(null)

  const matches = selected
    ? wines
        .filter((w) => w.quantity > 0 && Array.isArray(w.food_pairing) && w.food_pairing.includes(selected))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : []

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        eyebrow="Paringen van de redactie"
        title={<span className="italic">Wine, food, match!</span>}
        subtitle="Kies wat er op tafel komt, en zie wat er in je kelder bij past."
      />

      <div className="flex flex-wrap gap-2.5">
        {FOOD_PAIRINGS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setSelected((s) => (s === f.value ? null : f.value))}
            aria-pressed={selected === f.value}
            className={`h-10 px-4 text-sm border ${
              selected === f.value
                ? 'border-accent text-accent font-semibold bg-accent-soft'
                : 'border-border-strong text-text-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!selected ? (
        <div className="text-center py-16 border-t border-border">
          <BowlFoodIcon size={28} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Kies hierboven wat je gaat eten.</p>
          <p className="text-text-tertiary text-xs mt-1">We laten dan zien welke wijnen uit je kelder daarbij passen.</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 border-t border-border">
          <p className="text-text-secondary text-sm">
            Geen wijn op voorraad met {pairingLabel(selected).toLowerCase()} als food pairing.
          </p>
          <p className="text-text-tertiary text-xs mt-1">Vul dit veld in bij een wijn om hem hier te laten verschijnen.</p>
        </div>
      ) : (
        <div className="pt-2 border-t-2 border-text-primary">
          <p className="kicker mt-4 mb-1">
            Past goed bij {pairingLabel(selected).toLowerCase()} — {matches.length} wijnen op voorraad
          </p>
          <div>
            {matches.map((w) => (
              <WineListRow key={w.id} wine={w} onOpen={onOpenWine} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

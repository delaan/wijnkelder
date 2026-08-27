import { useState } from 'react'
import { FOOD_PAIRINGS, pairingLabel } from '../lib/wineHelpers'
import { BowlFoodIcon } from './icons'
import WineListRow from './WineListRow'

// Simpele pairing-hulp op het dashboard: kies wat je eet, zie welke wijnen
// uit je eigen kelder (met voorraad) daarbij passen — gebruikt het bestaande
// food_pairing-veld op elke wijn, geen nieuwe data nodig.
export default function PairingFinder({ wines, onOpenWine, onToggleFavorite }) {
  const [selected, setSelected] = useState(null)

  const matches = selected
    ? wines
        .filter((w) => w.quantity > 0 && Array.isArray(w.food_pairing) && w.food_pairing.includes(selected))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : []

  return (
    <section className="bg-surface border border-border rounded-token-lg p-5">
      <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-1">
        <BowlFoodIcon size={17} /> Wat drink ik hierbij?
      </h2>
      <p className="text-text-secondary text-sm mb-4">Kies wat er op tafel komt, en zie wat er in je kelder bij past.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {FOOD_PAIRINGS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setSelected((s) => (s === f.value ? null : f.value))}
            aria-pressed={selected === f.value}
            className={`h-9 px-3 rounded-token-full text-sm border ${
              selected === f.value
                ? 'bg-accent-soft border-accent-soft-text text-accent-soft-text'
                : 'border-border text-text-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {selected && (
        matches.length === 0 ? (
          <p className="text-text-tertiary text-sm py-3">
            Geen wijn op voorraad met {pairingLabel(selected).toLowerCase()} als food pairing.
          </p>
        ) : (
          <div className="divide-y divide-border -mx-1">
            {matches.slice(0, 5).map((w) => (
              <WineListRow key={w.id} wine={w} onOpen={onOpenWine} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        )
      )}
    </section>
  )
}

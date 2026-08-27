import { StarIcon } from './icons'

// Eén gedeelde sterrenbeoordeling: zonder onChange is hij read-only (voor
// weergave op kaarten/detailscherm), mét onChange wordt elke ster een
// aantikbare knop (voor in formulieren). "Wis" verschijnt alleen als er al
// een waarde staat, zodat je een beoordeling ook weer kunt verwijderen.
export default function StarRating({ value = 0, onChange, size = 16, className = '' }) {
  const stars = [1, 2, 3, 4, 5]
  const interactive = typeof onChange === 'function'

  if (!interactive && !value) return null

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="inline-flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined} aria-label="Beoordeling">
        {stars.map((n) =>
          interactive ? (
            <button
              key={n}
              type="button"
              onClick={() => onChange(value === n ? 0 : n)}
              aria-label={`${n} ster${n > 1 ? 'ren' : ''}`}
              aria-pressed={value >= n}
              className="text-warning p-0.5 -m-0.5"
            >
              <StarIcon filled={value >= n} size={size} />
            </button>
          ) : (
            <span key={n} className="text-warning" aria-hidden="true">
              <StarIcon filled={value >= n} size={size} />
            </span>
          )
        )}
      </div>
      {!interactive && <span className="sr-only">{value} van de 5 sterren</span>}
    </div>
  )
}

import { colorLabel, colorSwatch, formatCurrency } from '../lib/wineHelpers'
import { HeartIcon, StarIcon } from './icons'

export default function WineGridCard({ wine, onOpen, onToggleFavorite, hidePrivate }) {
  return (
    <div className="group relative border-t border-border-strong pt-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(wine)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen(wine)
          }
        }}
        className="block w-full text-left cursor-pointer"
      >
        <div className="aspect-[4/3] bg-surface-2 relative overflow-hidden flex items-center justify-center mb-2.5">
          {wine.label_photo_url ? (
            <img
              src={wine.label_photo_url}
              alt={wine.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-slow"
            />
          ) : (
            <span className={`w-4 h-14 rounded-token-full ${colorSwatch(wine.color)} opacity-80`} />
          )}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(wine)
              }}
              aria-label={wine.is_favorite ? 'Verwijderen uit favorieten' : 'Toevoegen aan favorieten'}
              aria-pressed={wine.is_favorite}
              className="absolute top-2 right-2 w-9 h-9 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-accent-soft-text"
            >
              <HeartIcon filled={wine.is_favorite} size={16} />
            </button>
          )}
          {wine.quantity === 0 && (
            <span className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur text-text-secondary text-[10.5px] font-semibold uppercase tracking-wide px-2 py-1 border border-border-strong">
              Op
            </span>
          )}
        </div>
        <span className="inline-block text-[10.5px] font-semibold uppercase tracking-wide px-1.5 py-0.5 border border-border-strong text-text-secondary">
          {colorLabel(wine.color)}
        </span>
        <p className="font-serif text-[19px] font-semibold text-text-primary leading-snug truncate mt-1.5">
          {wine.name}
        </p>
        <p className="byline truncate mb-1">
          {[wine.producer || null, wine.vintage, !hidePrivate ? `${wine.quantity} fl.` : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {wine.rating > 0 && (
          <span className="inline-flex items-center gap-0.5 text-warning text-xs">
            <StarIcon filled size={11} />
            {wine.rating}
          </span>
        )}
      </div>
    </div>
  )
}

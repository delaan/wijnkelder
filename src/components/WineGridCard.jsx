import { colorLabel, colorSwatch, formatCurrency } from '../lib/wineHelpers'
import { HeartIcon, StarIcon } from './icons'

export default function WineGridCard({ wine, onOpen, onToggleFavorite, hidePrivate }) {
  return (
    <div className="group bg-surface border border-border rounded-token-lg overflow-hidden hover:shadow-token-md hover:border-border-strong transition-all duration-base relative">
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
        <div className="aspect-[4/5] bg-surface-2 relative overflow-hidden flex items-center justify-center">
          {wine.label_photo_url ? (
            <img
              src={wine.label_photo_url}
              alt={wine.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-slow"
            />
          ) : (
            <span className={`w-4 h-16 rounded-token-full ${colorSwatch(wine.color)} opacity-80`} />
          )}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(wine)
              }}
              aria-label={wine.is_favorite ? 'Verwijderen uit favorieten' : 'Toevoegen aan favorieten'}
              aria-pressed={wine.is_favorite}
              className="absolute top-2 right-2 w-10 h-10 rounded-token-full bg-surface/90 backdrop-blur flex items-center justify-center text-accent-soft-text shadow-token-sm"
            >
              <HeartIcon filled={wine.is_favorite} size={17} />
            </button>
          )}
          {wine.quantity === 0 && (
            <span className="absolute bottom-2.5 left-2.5 bg-surface/90 backdrop-blur text-text-secondary text-[11px] font-medium px-2 py-1 rounded-token-full">
              Op
            </span>
          )}
        </div>
        <div className="p-3.5">
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide">
            {colorLabel(wine.color)}
          </p>
          <p className="font-semibold text-text-primary leading-snug truncate mt-0.5">{wine.name}</p>
          <p className="text-text-secondary text-sm truncate">{wine.producer || '—'}</p>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-text-tertiary text-xs flex items-center gap-1">
              {wine.vintage || '—'} · {wine.region || '—'}
              {wine.rating > 0 && (
                <span className="inline-flex items-center gap-0.5 text-warning ml-1">
                  <StarIcon filled size={11} />
                  {wine.rating}
                </span>
              )}
            </span>
            {!hidePrivate && (
              <span className="text-text-primary text-sm font-medium">{wine.quantity}×</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { colorLabel, colorSwatch, tasteLabel } from '../lib/wineHelpers'
import { HeartIcon, StarIcon } from './icons'

export default function WineListRow({ wine, onOpen, onToggleFavorite, hidePrivate }) {
  return (
    <div className="flex items-center gap-1 py-1.5 px-1.5 rounded-token-md hover:bg-surface-2 transition-colors">
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
        className="flex flex-1 min-w-0 items-center gap-3 py-1.5 px-1.5 text-left cursor-pointer"
      >
        <span className="w-11 h-11 rounded-token-md bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
          {wine.label_photo_url ? (
            <img src={wine.label_photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className={`w-2 h-7 rounded-token-full ${colorSwatch(wine.color)} opacity-80`} />
          )}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary truncate flex items-center gap-1.5">
            {wine.name}
            {wine.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-warning text-xs font-normal shrink-0">
                <StarIcon filled size={11} />
                {wine.rating}
              </span>
            )}
          </p>
          <p className="text-text-secondary text-xs truncate">
            {wine.producer || '—'} {wine.vintage ? `· ${wine.vintage}` : ''} {wine.region ? `· ${wine.region}` : ''}
          </p>
        </div>

        <div className="hidden sm:flex flex-col items-end shrink-0 w-32">
          <span className="text-xs text-text-tertiary">{colorLabel(wine.color)}</span>
          {wine.tasting_profile && (
            <span className="text-xs text-text-tertiary">{tasteLabel(wine.tasting_profile)}</span>
          )}
        </div>

        {!hidePrivate && (
          <span className="text-text-primary text-sm font-medium w-10 text-right shrink-0">{wine.quantity}×</span>
        )}
      </div>

      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(wine)}
          aria-label={wine.is_favorite ? 'Verwijderen uit favorieten' : 'Toevoegen aan favorieten'}
          aria-pressed={wine.is_favorite}
          className="w-10 h-10 rounded-token-full flex items-center justify-center text-accent-soft-text shrink-0"
        >
          <HeartIcon filled={wine.is_favorite} size={16} />
        </button>
      )}
    </div>
  )
}

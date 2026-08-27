import { colorLabel, colorSwatch, tasteLabel } from '../lib/wineHelpers'
import { HeartIcon } from './icons'

export default function WineListRow({ wine, onOpen, onToggleFavorite, hidePrivate }) {
  return (
    <button
      onClick={() => onOpen(wine)}
      className="w-full flex items-center gap-3 py-3 px-3 rounded-token-md hover:bg-surface-2 transition-colors text-left"
    >
      <span className="w-11 h-11 rounded-token-md bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
        {wine.label_photo_url ? (
          <img src={wine.label_photo_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className={`w-2 h-7 rounded-token-full ${colorSwatch(wine.color)} opacity-80`} />
        )}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary truncate">{wine.name}</p>
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

      {onToggleFavorite && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(wine)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite(wine)
            }
          }}
          aria-label={wine.is_favorite ? 'Verwijderen uit favorieten' : 'Toevoegen aan favorieten'}
          aria-pressed={wine.is_favorite}
          className="w-9 h-9 rounded-token-full flex items-center justify-center text-accent-soft-text shrink-0"
        >
          <HeartIcon filled={wine.is_favorite} size={16} />
        </span>
      )}
    </button>
  )
}

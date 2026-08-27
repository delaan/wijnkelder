import { useEffect, useRef, useState } from 'react'
import {
  colorLabel,
  colorDot,
  tasteLabel,
  pairingLabel,
  formatCurrency,
  formatDate,
  drinkWindowStatus,
} from '../lib/wineHelpers'
import { HeartIcon, XIcon, WineGlassIcon } from './icons'
import StarRating from './StarRating'

function Field({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-text-tertiary text-xs uppercase tracking-wide">{label}</p>
      <p className="text-text-primary text-sm mt-0.5">{value}</p>
    </div>
  )
}

export default function WineDetailSheet({ wine, onClose, onToggleFavorite, onUncork, hidePrivate, onEdit, onDelete }) {
  const closeRef = useRef(null)
  const sheetRef = useRef(null)
  const previouslyFocused = useRef(null)
  const [uncorkCount, setUncorkCount] = useState(1)
  const [uncorking, setUncorking] = useState(false)
  const [uncorkNoteOpen, setUncorkNoteOpen] = useState(false)
  const [uncorkNote, setUncorkNote] = useState('')
  const [uncorkRating, setUncorkRating] = useState(0)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
    closeRef.current?.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      previouslyFocused.current?.focus?.()
    }
  }, [onClose])

  const status = drinkWindowStatus(wine.drink_from, wine.drink_until)
  const maxUncork = wine.quantity
  const foodPairing = Array.isArray(wine.food_pairing) ? wine.food_pairing : []

  const handleUncork = async () => {
    setUncorking(true)
    try {
      await onUncork(wine, uncorkCount, { note: uncorkNote, occasionRating: uncorkRating })
      setUncorkCount(1)
      setUncorkNote('')
      setUncorkRating(0)
      setUncorkNoteOpen(false)
    } finally {
      setUncorking(false)
    }
  }

  return (
    <div className="fixed inset-0 z-modal flex items-end md:items-center justify-center">
      <div
        className="absolute inset-x-0 top-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:inset-0 backdrop-blur-md animate-fade-in"
        style={{ background: 'var(--overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wine-detail-title"
        className="relative bg-surface w-[calc(100%-1.5rem)] md:w-full md:max-w-lg rounded-token-lg shadow-token-lg max-h-[calc(100vh-9rem)] md:max-h-[92vh] overflow-y-auto safe-bottom mb-[calc(6.5rem+env(safe-area-inset-bottom))] md:mb-0 animate-slide-up"
      >
        <div className="sticky top-0 z-10">
          {/* Losse achtergrondlaag voor de vervaging — zie toelichting in TopBar.jsx */}
          <div className="absolute inset-0 bg-surface/95 backdrop-blur border-b border-border" aria-hidden="true" />
          <div className="relative px-5 py-4 flex items-center justify-between">
            <h2 id="wine-detail-title" className="font-semibold text-text-primary truncate pr-4">
              {wine.name}
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(wine)}
                  aria-label={wine.is_favorite ? 'Verwijderen uit favorieten' : 'Toevoegen aan favorieten'}
                  aria-pressed={wine.is_favorite}
                  className="w-10 h-10 rounded-token-full flex items-center justify-center text-accent-soft-text hover:bg-surface-2"
                >
                  <HeartIcon filled={wine.is_favorite} size={18} />
                </button>
              )}
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Sluiten"
                className="w-10 h-10 rounded-token-full flex items-center justify-center text-text-secondary hover:bg-surface-2"
              >
                <XIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="aspect-[16/9] bg-surface-2 flex items-center justify-center">
          {wine.label_photo_url ? (
            <img src={wine.label_photo_url} alt={wine.name} className="w-full h-full object-cover" />
          ) : (
            <span className="w-4 h-20 rounded-token-full opacity-80" style={{ backgroundColor: colorDot(wine.color) }} />
          )}
        </div>

        <div className="p-5 space-y-6">
          <div>
            <p className="text-text-secondary text-sm">{wine.producer || '—'}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-token-full bg-surface-2 text-text-secondary">
                {colorLabel(wine.color)}
              </span>
              {wine.vintage && (
                <span className="text-xs px-2.5 py-1 rounded-token-full bg-surface-2 text-text-secondary">
                  {wine.vintage}
                </span>
              )}
              {tasteLabel(wine.tasting_profile) && (
                <span className="text-xs px-2.5 py-1 rounded-token-full bg-surface-2 text-text-secondary">
                  {tasteLabel(wine.tasting_profile)}
                </span>
              )}
              {status && (
                <span className={`text-xs px-2.5 py-1 rounded-token-full ${status.tone}`}>{status.label}</span>
              )}
              <StarRating value={wine.rating || 0} size={14} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Regio" value={wine.region} />
            <Field label="Land" value={wine.country} />
            <Field label="Appellatie" value={wine.appellation} />
            <Field label="Classificatie" value={wine.classification} />
            <Field label="Druiven" value={wine.grape_varieties} />
            <Field label="Serveertemperatuur" value={wine.serve_temperature} />
            <Field label="Karaffeertijd" value={wine.decant_time} />
            <Field
              label="Drinkvenster"
              value={wine.drink_from || wine.drink_until ? `${wine.drink_from || '…'} – ${wine.drink_until || '…'}` : null}
            />
          </div>

          {foodPairing.length > 0 && (
            <div>
              <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1.5">Food pairing</p>
              <div className="flex flex-wrap gap-1.5">
                {foodPairing.map((f) => (
                  <span key={f} className="text-xs px-2.5 py-1 rounded-token-full bg-surface-2 text-text-secondary">
                    {pairingLabel(f)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!hidePrivate && (
            <>
              <div className="border-t border-border pt-5 grid grid-cols-2 gap-4">
                <Field label="Aankoopprijs" value={wine.purchase_price ? formatCurrency(wine.purchase_price) : null} />
                <Field label="Geschatte waarde" value={wine.estimated_value ? formatCurrency(wine.estimated_value) : null} />
                <Field label="Aankoopdatum" value={wine.purchase_date ? formatDate(wine.purchase_date) : null} />
                <Field label="Aankooplocatie" value={wine.purchase_location} />
                <Field label="Locatie in kelder" value={wine.location} />
              </div>
              {wine.tasting_notes && (
                <div>
                  <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1">Persoonlijke notities</p>
                  <p className="text-text-primary text-sm whitespace-pre-wrap">{wine.tasting_notes}</p>
                </div>
              )}

              <div className="border-t border-border pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-primary flex items-center gap-2">
                    <WineGlassIcon size={17} /> Ontkurken
                  </h3>
                  <span className="text-text-secondary text-sm">{wine.quantity} op voorraad</span>
                </div>
                {maxUncork === 0 ? (
                  <p className="text-text-tertiary text-sm">Geen voorraad meer om te ontkurken.</p>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-token-md">
                      <button
                        onClick={() => setUncorkCount((c) => Math.max(1, c - 1))}
                        aria-label="Minder flessen"
                        className="w-11 h-11 text-lg text-text-secondary"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium" aria-live="polite">
                        {uncorkCount}
                      </span>
                      <button
                        onClick={() => setUncorkCount((c) => Math.min(maxUncork, c + 1))}
                        aria-label="Meer flessen"
                        className="w-11 h-11 text-lg text-text-secondary"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleUncork}
                      disabled={uncorking}
                      className="flex-1 h-11 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold disabled:opacity-60"
                    >
                      {uncorking ? 'Bezig…' : `Ontkurk ${uncorkCount} fles${uncorkCount > 1 ? 'sen' : ''}`}
                    </button>
                  </div>
                )}
                {maxUncork > 0 && (
                  <div className="mt-3">
                    {!uncorkNoteOpen ? (
                      <button
                        type="button"
                        onClick={() => setUncorkNoteOpen(true)}
                        className="text-xs font-medium text-accent-soft-text"
                      >
                        + Notitie of beoordeling voor dit moment
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <StarRating value={uncorkRating} onChange={setUncorkRating} size={18} />
                        <textarea
                          value={uncorkNote}
                          onChange={(e) => setUncorkNote(e.target.value)}
                          rows={2}
                          placeholder="Hoe smaakte hij? Bij welke gelegenheid?"
                          className="w-full rounded-token-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-5 flex justify-between">
                <button onClick={() => onEdit(wine)} className="text-sm font-medium text-accent-soft-text">
                  Bewerken
                </button>
                <button onClick={() => onDelete(wine)} className="text-sm font-medium text-text-tertiary hover:text-danger-text">
                  Verwijderen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

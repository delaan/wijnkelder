import { useState } from 'react'
import { WINE_COLORS } from '../lib/wineHelpers'
import { XIcon } from './icons'
import { useFocusTrap } from '../hooks/useFocusTrap'

const empty = {
  name: '',
  producer: '',
  vintage: '',
  region: '',
  country: '',
  grape_varieties: '',
  color: '',
  target_price: '',
  notes: '',
}

const inputClass =
  'w-full h-11 rounded-token-md border border-border bg-surface px-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent'
const labelClass = 'block text-sm font-medium text-text-secondary mb-1'

// Lichtgewicht toevoegformulier voor de verlanglijst — bewust een stuk
// korter dan WineForm, want hier gaat het om een wens, niet om een fles
// die je al in bezit hebt (dus geen voorraad, aankoopprijs, locatie, etc.).
export default function WishlistForm({ onSave, onClose }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const dialogRef = useFocusTrap(onClose)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave({
        ...form,
        vintage: form.vintage ? Number(form.vintage) : null,
        target_price: form.target_price ? Number(form.target_price) : null,
        color: form.color || null,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Opslaan mislukt.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-modal flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-form-title"
      ref={dialogRef}
    >
      <div
        className="absolute inset-x-0 top-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:inset-0 backdrop-blur-md animate-fade-in"
        style={{ background: 'var(--overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-surface w-[calc(100%-1.5rem)] md:w-full md:max-w-lg rounded-token-lg shadow-token-lg max-h-[calc(100vh-9rem)] md:max-h-[92vh] overflow-y-auto safe-bottom mb-[calc(6.5rem+env(safe-area-inset-bottom))] md:mb-0 animate-slide-up">
        <div className="sticky top-0 z-10">
          <div className="absolute inset-0 bg-surface/95 backdrop-blur border-b border-border" aria-hidden="true" />
          <div className="relative px-5 py-4 flex items-center justify-between">
            <h2 id="wishlist-form-title" className="font-semibold text-text-primary">Aan verlanglijst toevoegen</h2>
            <button onClick={onClose} aria-label="Sluiten" className="w-10 h-10 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2 hover:text-text-primary transition-colors">
              <XIcon size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <div>
            <label className={labelClass}>Wijnnaam *</label>
            <input required value={form.name} onChange={set('name')} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Producent</label>
              <input value={form.producer} onChange={set('producer')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Jaargang</label>
              <input type="number" value={form.vintage} onChange={set('vintage')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Land</label>
              <input value={form.country} onChange={set('country')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Regio</label>
              <input value={form.region} onChange={set('region')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Wijntype</label>
              <select value={form.color} onChange={set('color')} className={inputClass}>
                <option value="">Onbekend</option>
                {WINE_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Richtprijs (€)</label>
              <input type="number" step="0.01" value={form.target_price} onChange={set('target_price')} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Druiven</label>
            <input value={form.grape_varieties} onChange={set('grape_varieties')} placeholder="bv. Cabernet Sauvignon" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Notitie</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={2}
              placeholder="Waar zag je 'm, waarom wil je 'm proberen…"
              className="w-full rounded-token-md border border-border bg-surface px-3 py-2 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && <p className="text-sm text-danger-text bg-danger-bg rounded-token-md px-3 py-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="text-sm font-medium text-text-secondary px-3 h-11">
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-sm font-semibold text-accent-contrast bg-accent hover:bg-accent-hover disabled:opacity-60 px-5 h-11 rounded-token-md"
            >
              {saving ? 'Opslaan…' : 'Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

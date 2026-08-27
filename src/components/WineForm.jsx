import { useRef, useState } from 'react'
import { WINE_COLORS, TASTE_PROFILES, FOOD_PAIRINGS } from '../lib/wineHelpers'
import FormSection from './FormSection'
import StarRating from './StarRating'
import { CameraIcon, HeartIcon, XIcon } from './icons'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useCellarZones } from '../hooks/useCellarZones'

const emptyWine = {
  name: '',
  producer: '',
  vintage: '',
  grape_varieties: '',
  region: '',
  country: '',
  appellation: '',
  classification: '',
  color: 'rood',
  tasting_profile: '',
  food_pairing: [],
  serve_temperature: '',
  decant_time: '',
  quantity: 1,
  location: '',
  purchase_price: '',
  purchase_date: '',
  purchase_location: '',
  estimated_value: '',
  drink_from: '',
  drink_until: '',
  tasting_notes: '',
  label_photo_url: '',
  is_favorite: false,
  rating: null,
  zone_id: '',
  zone_row: '',
  zone_col: '',
}

const inputClass =
  'w-full h-11 rounded-token-md border border-border bg-surface px-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent'
const labelClass = 'block text-sm font-medium text-text-secondary mb-1'

export default function WineForm({ wine, onSave, onClose, onUploadPhoto, userId, title }) {
  const [form, setForm] = useState(wine ? { ...emptyWine, ...wine, food_pairing: wine.food_pairing || [] } : emptyWine)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInput = useRef(null)
  const dialogRef = useFocusTrap(onClose)
  const { zones } = useCellarZones(userId)
  const selectedZone = zones.find((z) => z.id === form.zone_id)
  const isEditing = Boolean(wine?.id)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const toggleFoodPairing = (value) => {
    setForm((f) => ({
      ...f,
      food_pairing: f.food_pairing.includes(value)
        ? f.food_pairing.filter((v) => v !== value)
        : [...f.food_pairing, value],
    }))
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await onUploadPhoto(file)
      setForm((f) => ({ ...f, label_photo_url: url }))
    } catch (err) {
      setError('Foto uploaden mislukt: ' + (err.message || 'onbekende fout'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        vintage: form.vintage ? Number(form.vintage) : null,
        quantity: form.quantity ? Number(form.quantity) : 0,
        purchase_price: form.purchase_price ? Number(form.purchase_price) : null,
        estimated_value: form.estimated_value ? Number(form.estimated_value) : null,
        purchase_date: form.purchase_date || null,
        drink_from: form.drink_from ? Number(form.drink_from) : null,
        drink_until: form.drink_until ? Number(form.drink_until) : null,
        tasting_profile: form.tasting_profile || null,
        rating: form.rating || null,
        zone_id: form.zone_id || null,
        zone_row: form.zone_id && form.zone_row !== '' ? Number(form.zone_row) : null,
        zone_col: form.zone_id && form.zone_col !== '' ? Number(form.zone_col) : null,
      }
      delete payload.id
      delete payload.user_id
      delete payload.created_at
      delete payload.updated_at
      await onSave(payload)
      onClose()
    } catch (err) {
      setError(err.message || 'Opslaan mislukt.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-modal flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="wine-form-title" ref={dialogRef}>
      <div
        className="absolute inset-x-0 top-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:inset-0 backdrop-blur-md animate-fade-in"
        style={{ background: 'var(--overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-surface w-[calc(100%-1.5rem)] md:w-full md:max-w-lg rounded-token-lg shadow-token-lg max-h-[calc(100vh-9rem)] md:max-h-[92vh] overflow-y-auto safe-bottom mb-[calc(6.5rem+env(safe-area-inset-bottom))] md:mb-0 animate-slide-up"
      >
        <div className="sticky top-0 z-10">
          {/* Losse achtergrondlaag voor de vervaging — zie toelichting in TopBar.jsx */}
          <div className="absolute inset-0 bg-surface/95 backdrop-blur border-b border-border" aria-hidden="true" />
          <div className="relative px-5 py-4 flex items-center justify-between">
            <h2 id="wine-form-title" className="font-semibold text-text-primary">
              {title || (isEditing ? 'Wijn bewerken' : 'Nieuwe wijn')}
            </h2>
            <button onClick={onClose} aria-label="Sluiten" className="w-10 h-10 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2 hover:text-text-primary transition-colors">
              <XIcon size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInput.current?.click()}
              className="w-20 h-20 rounded-token-md bg-surface-2 border border-dashed border-border-strong flex items-center justify-center overflow-hidden cursor-pointer shrink-0"
            >
              {form.label_photo_url ? (
                <img src={form.label_photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <CameraIcon size={22} className="text-text-tertiary" />
              )}
            </div>
            <input ref={fileInput} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => fileInput.current?.click()} disabled={uploading} className="text-sm font-medium text-accent-soft-text">
                {uploading ? 'Bezig met uploaden…' : form.label_photo_url ? 'Andere foto kiezen' : 'Flesfoto toevoegen'}
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, is_favorite: !f.is_favorite }))}
                className="flex items-center gap-1.5 text-sm text-text-secondary"
              >
                <HeartIcon filled={form.is_favorite} size={15} className="text-accent-soft-text" />
                Favoriet
              </button>
              <StarRating value={form.rating || 0} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
            </div>
          </div>

          <FormSection title="Basisgegevens" defaultOpen>
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
                  {WINE_COLORS.slice(0, 5).map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Druiven</label>
                <input value={form.grape_varieties} onChange={set('grape_varieties')} placeholder="bv. Cabernet Sauvignon" className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Herkomst & classificatie">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Appellatie</label>
                <input value={form.appellation} onChange={set('appellation')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Classificatie</label>
                <input value={form.classification} onChange={set('classification')} className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Smaak & food pairing">
            <div>
              <label className={labelClass}>Smaakprofiel</label>
              <select value={form.tasting_profile} onChange={set('tasting_profile')} className={inputClass}>
                <option value="">Geen</option>
                {TASTE_PROFILES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Food pairing</label>
              <div className="flex flex-wrap gap-2">
                {FOOD_PAIRINGS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => toggleFoodPairing(f.value)}
                    aria-pressed={form.food_pairing.includes(f.value)}
                    className={`h-9 px-3 rounded-token-full text-sm border ${
                      form.food_pairing.includes(f.value)
                        ? 'bg-accent-soft border-accent-soft-text text-accent-soft-text'
                        : 'border-border text-text-secondary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Serveertemperatuur</label>
                <input value={form.serve_temperature} onChange={set('serve_temperature')} placeholder="bv. 16-18°C" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Karaffeertijd</label>
                <input value={form.decant_time} onChange={set('decant_time')} placeholder="bv. 30 min" className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Voorraad & aankoop">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Aantal flessen *</label>
                <input required type="number" min={0} value={form.quantity} onChange={set('quantity')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Locatie in kelder</label>
                <input value={form.location} onChange={set('location')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aankoopdatum</label>
                <input type="date" value={form.purchase_date || ''} onChange={set('purchase_date')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aankooplocatie</label>
                <input value={form.purchase_location} onChange={set('purchase_location')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aankoopprijs (€)</label>
                <input type="number" step="0.01" value={form.purchase_price} onChange={set('purchase_price')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Geschatte waarde (€)</label>
                <input type="number" step="0.01" value={form.estimated_value} onChange={set('estimated_value')} className={inputClass} />
              </div>
            </div>
          </FormSection>

          {zones.length > 0 && (
            <FormSection title="Plek in de kelderkaart">
              <div>
                <label className={labelClass}>Zone/rek</label>
                <select
                  value={form.zone_id}
                  onChange={(e) => setForm((f) => ({ ...f, zone_id: e.target.value, zone_row: '', zone_col: '' }))}
                  className={inputClass}
                >
                  <option value="">Niet ingedeeld</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedZone && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Rij (1–{selectedZone.rows})</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedZone.rows}
                      value={form.zone_row}
                      onChange={set('zone_row')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Kolom (1–{selectedZone.cols})</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedZone.cols}
                      value={form.zone_col}
                      onChange={set('zone_col')}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </FormSection>
          )}

          <FormSection title="Drinkvenster & notities">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Drinkvenster van</label>
                <input type="number" value={form.drink_from} onChange={set('drink_from')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Drinkvenster tot</label>
                <input type="number" value={form.drink_until} onChange={set('drink_until')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Persoonlijke notities</label>
              <textarea value={form.tasting_notes} onChange={set('tasting_notes')} rows={3} className="w-full rounded-token-md border border-border bg-surface px-3 py-2 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </FormSection>

          {error && <p className="text-sm text-danger-text bg-danger-bg rounded-token-md px-3 py-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="text-sm font-medium text-text-secondary px-3 h-11">
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="text-sm font-semibold text-accent-contrast bg-accent hover:bg-accent-hover disabled:opacity-60 px-5 h-11 rounded-token-md"
            >
              {saving ? 'Opslaan…' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

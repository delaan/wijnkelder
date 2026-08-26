import { useRef, useState } from 'react'
import { WINE_COLORS } from '../lib/wineHelpers'
import StarRating from './StarRating'

const emptyWine = {
  name: '',
  producer: '',
  vintage: '',
  grape_varieties: '',
  region: '',
  country: '',
  color: 'rood',
  quantity: 1,
  location: '',
  purchase_price: '',
  purchase_date: '',
  drink_from: '',
  drink_until: '',
  rating: 0,
  tasting_notes: '',
  label_photo_url: '',
}

export default function WineForm({ wine, onSave, onClose, onUploadPhoto }) {
  const [form, setForm] = useState(wine ? { ...emptyWine, ...wine } : emptyWine)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInput = useRef(null)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

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
        purchase_date: form.purchase_date || null,
        drink_from: form.drink_from ? Number(form.drink_from) : null,
        drink_until: form.drink_until ? Number(form.drink_until) : null,
        rating: form.rating ? Number(form.rating) : null,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-2xl shadow-lg max-h-[92vh] overflow-y-auto safe-bottom">
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            {wine ? 'Wijn bewerken' : 'Wijn toevoegen'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInput.current?.click()}
              className="w-20 h-20 rounded-lg bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center overflow-hidden cursor-pointer shrink-0"
            >
              {form.label_photo_url ? (
                <img src={form.label_photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-stone-400 text-xs text-center px-1">
                  {uploading ? '…' : 'Foto etiket'}
                </span>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="text-sm font-medium text-wine-700 hover:text-wine-900"
            >
              {uploading ? 'Bezig met uploaden…' : form.label_photo_url ? 'Andere foto kiezen' : 'Foto toevoegen'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Naam *</label>
              <input
                required
                value={form.name}
                onChange={set('name')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Wijnmaker</label>
              <input
                value={form.producer}
                onChange={set('producer')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Jaargang</label>
              <input
                type="number"
                value={form.vintage}
                onChange={set('vintage')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Druif(en)</label>
              <input
                value={form.grape_varieties}
                onChange={set('grape_varieties')}
                placeholder="bv. Cabernet Sauvignon"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Kleur</label>
              <select
                value={form.color}
                onChange={set('color')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              >
                {WINE_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Regio</label>
              <input
                value={form.region}
                onChange={set('region')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Land</label>
              <input
                value={form.country}
                onChange={set('country')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Aantal flessen *</label>
              <input
                required
                type="number"
                min={0}
                value={form.quantity}
                onChange={set('quantity')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Locatie in kelder</label>
              <input
                value={form.location}
                onChange={set('location')}
                placeholder="bv. Rek B, plank 3"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Aankoopprijs (€)</label>
              <input
                type="number"
                step="0.01"
                value={form.purchase_price}
                onChange={set('purchase_price')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Aankoopdatum</label>
              <input
                type="date"
                value={form.purchase_date || ''}
                onChange={set('purchase_date')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Drinkvenster van</label>
              <input
                type="number"
                value={form.drink_from}
                onChange={set('drink_from')}
                placeholder="bv. 2026"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Drinkvenster tot</label>
              <input
                type="number"
                value={form.drink_until}
                onChange={set('drink_until')}
                placeholder="bv. 2032"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Beoordeling</label>
              <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size="text-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Proefnotities</label>
              <textarea
                value={form.tasting_notes}
                onChange={set('tasting_notes')}
                rows={3}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-2"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="text-sm font-medium text-white bg-wine-800 hover:bg-wine-700 disabled:opacity-60 px-5 py-2.5 rounded-lg"
            >
              {saving ? 'Opslaan…' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

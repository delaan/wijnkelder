import { colorLabel, colorSwatch, drinkWindowStatus, formatCurrency } from '../lib/wineHelpers'
import StarRating from './StarRating'

export default function WineCard({ wine, onEdit, onDelete }) {
  const status = drinkWindowStatus(wine.drink_from, wine.drink_until)

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
      <button onClick={() => onEdit(wine)} className="block w-full text-left">
        <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
          {wine.label_photo_url ? (
            <img
              src={wine.label_photo_url}
              alt={wine.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className={`w-3 h-10 rounded-full ${colorSwatch[wine.color] || 'bg-stone-300'}`} />
            </div>
          )}
          {wine.quantity <= 1 && (
            <span className="absolute top-2 right-2 bg-white/90 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
              Laatste fles
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-serif font-semibold text-stone-900 truncate">{wine.name}</p>
              <p className="text-stone-500 text-sm truncate">{wine.producer || '—'}</p>
            </div>
            <span className="text-stone-700 font-medium text-sm shrink-0">{wine.vintage || '—'}</span>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              {colorLabel(wine.color)}
            </span>
            {wine.region && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 truncate max-w-[10rem]">
                {wine.region}
              </span>
            )}
            {status && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${status.tone}`}>{status.label}</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <StarRating value={wine.rating || 0} readOnly size="text-xs" />
            <span className="text-stone-700 text-sm font-medium">
              {wine.quantity}× · {formatCurrency(wine.purchase_price)}
            </span>
          </div>
        </div>
      </button>
      <div className="border-t border-stone-100 px-4 py-2 flex justify-end gap-3">
        <button
          onClick={() => onEdit(wine)}
          className="text-xs font-medium text-wine-700 hover:text-wine-900"
        >
          Bewerken
        </button>
        <button
          onClick={() => onDelete(wine)}
          className="text-xs font-medium text-stone-400 hover:text-red-600"
        >
          Verwijderen
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { colorLabel, formatCurrency } from '../lib/wineHelpers'
import { BookmarkIcon, PlusIcon, TrashIcon, ArrowRightIcon } from './icons'
import WishlistForm from './WishlistForm'
import Spinner from './Spinner'

function WishlistCard({ item, onDelete, onConvert }) {
  return (
    <div className="bg-surface border border-border rounded-token-lg p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-text-primary truncate">{item.name}</p>
          <p className="text-text-secondary text-sm truncate">
            {item.producer || '—'} {item.vintage ? `· ${item.vintage}` : ''}
          </p>
        </div>
        <button
          onClick={() => onDelete(item)}
          aria-label="Van verlanglijst verwijderen"
          className="w-9 h-9 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2 hover:text-danger-text shrink-0"
        >
          <TrashIcon size={15} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {item.color && (
          <span className="text-xs px-2.5 py-1 rounded-token-full bg-surface-2 text-text-secondary">{colorLabel(item.color)}</span>
        )}
        {item.region && (
          <span className="text-xs px-2.5 py-1 rounded-token-full bg-surface-2 text-text-secondary">{item.region}</span>
        )}
        {item.target_price && (
          <span className="text-xs px-2.5 py-1 rounded-token-full bg-surface-2 text-text-secondary">
            ± {formatCurrency(item.target_price)}
          </span>
        )}
      </div>
      {item.notes && <p className="text-text-secondary text-sm">{item.notes}</p>}
      <button
        onClick={() => onConvert(item)}
        className="mt-1 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-accent-soft-text"
      >
        Toevoegen aan kelder <ArrowRightIcon size={13} />
      </button>
    </div>
  )
}

export default function Wishlist({ items, loading, error, onAddItem, onDeleteItem, onConvert }) {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <BookmarkIcon size={20} className="text-accent-soft-text" /> Verlanglijst
          </h1>
          <p className="text-text-secondary text-sm mt-1">Wijnen die je nog wil kopen.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="h-11 px-4 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold flex items-center gap-1.5 shrink-0"
        >
          <PlusIcon size={15} /> Toevoegen
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-danger-text text-sm">Verlanglijst kon niet worden opgehaald: {error}</p>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border rounded-token-lg text-center py-16">
          <BookmarkIcon size={28} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Nog niks op je verlanglijst.</p>
          <p className="text-text-tertiary text-xs mt-1">Zet hier wijnen op die je nog wil proberen of kopen.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} onDelete={onDeleteItem} onConvert={onConvert} />
          ))}
        </div>
      )}

      {formOpen && <WishlistForm onSave={onAddItem} onClose={() => setFormOpen(false)} />}
    </div>
  )
}

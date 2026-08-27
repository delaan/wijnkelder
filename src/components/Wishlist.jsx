import { useState } from 'react'
import { colorLabel, formatCurrency } from '../lib/wineHelpers'
import { PlusIcon, TrashIcon, ArrowRightIcon } from './icons'
import WishlistForm from './WishlistForm'
import Spinner from './Spinner'
import PageHeader from './PageHeader'

function WishlistEntry({ item, index, onDelete, onConvert }) {
  return (
    <div className="grid grid-cols-[36px_1fr] sm:grid-cols-[36px_1fr_auto] gap-x-4 gap-y-2 py-5 border-t border-border">
      <span className="font-serif text-xl text-text-tertiary">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="font-serif text-[19px] font-semibold text-text-primary">{item.name}</p>
        <p className="byline mt-0.5">
          {[item.region, item.color ? colorLabel(item.color) : null, item.target_price ? `± ${formatCurrency(item.target_price)}` : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {item.notes && <p className="text-text-secondary text-sm mt-1.5">{item.notes}</p>}
      </div>
      <div className="col-span-2 sm:col-span-1 flex items-center gap-4 sm:self-start">
        <button
          onClick={() => onConvert(item)}
          className="text-sm font-semibold text-accent-soft-text whitespace-nowrap flex items-center gap-1"
        >
          Toevoegen aan kelder <ArrowRightIcon size={13} />
        </button>
        <button
          onClick={() => onDelete(item)}
          aria-label="Van verlanglijst verwijderen"
          className="w-8 h-8 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2 hover:text-danger-text shrink-0"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Wishlist({ items, loading, error, onAddItem, onDeleteItem, onConvert }) {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="space-y-5 max-w-2xl">
      <PageHeader
        eyebrow="Wijnen die je nog wil proberen"
        title="Verlanglijst"
        action={
          <button
            onClick={() => setFormOpen(true)}
            className="h-11 px-4 border border-border-strong text-text-secondary text-sm font-medium flex items-center gap-1.5 hover:border-text-primary hover:text-text-primary transition-colors"
          >
            <PlusIcon size={14} /> Toevoegen
          </button>
        }
      />

      {loading ? (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-danger-text text-sm">Verlanglijst kon niet worden opgehaald: {error}</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border-t border-border">
          <p className="text-text-secondary text-sm">Nog niks op je verlanglijst.</p>
          <p className="text-text-tertiary text-xs mt-1">Zet hier wijnen op die je nog wil proberen of kopen.</p>
        </div>
      ) : (
        <div>
          {items.map((item, i) => (
            <WishlistEntry key={item.id} item={item} index={i} onDelete={onDeleteItem} onConvert={onConvert} />
          ))}
        </div>
      )}

      {formOpen && <WishlistForm onSave={onAddItem} onClose={() => setFormOpen(false)} />}
    </div>
  )
}

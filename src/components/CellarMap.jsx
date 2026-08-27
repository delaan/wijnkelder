import { useState } from 'react'
import { useCellarZones } from '../hooks/useCellarZones'
import { colorDot } from '../lib/wineHelpers'
import { MapIcon, PlusIcon, TrashIcon, XIcon, CheckIcon } from './icons'
import Spinner from './Spinner'
import PageHeader from './PageHeader'

const inputClass =
  'w-full h-11 rounded-token-md border border-border bg-surface px-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent'
const labelClass = 'block text-sm font-medium text-text-secondary mb-1'

function AddZoneForm({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(6)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ name, rows: Number(rows), cols: Number(cols) })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border-strong bg-surface p-4 space-y-3">
      <div>
        <label className={labelClass}>Naam van de zone/rek</label>
        <input required autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="bv. Rek A, Kelderkast" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Rijen</label>
          <input type="number" min={1} max={20} required value={rows} onChange={(e) => setRows(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Kolommen</label>
          <input type="number" min={1} max={20} required value={cols} onChange={(e) => setCols(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="text-sm font-medium text-text-secondary px-3 h-10">
          Annuleren
        </button>
        <button type="submit" disabled={saving} className="text-sm font-semibold text-accent-contrast bg-accent hover:bg-accent-hover disabled:opacity-60 px-4 h-10 rounded-token-md">
          {saving ? 'Bezig…' : 'Zone toevoegen'}
        </button>
      </div>
    </form>
  )
}

function ZoneCell({ wine, onOpenWine }) {
  if (!wine) {
    return <div className="aspect-square border border-border-strong bg-transparent" />
  }
  return (
    <button
      type="button"
      onClick={() => onOpenWine(wine)}
      title={wine.name}
      className="aspect-square border overflow-hidden flex items-center justify-center relative hover:ring-2 hover:ring-accent"
      style={{ borderColor: colorDot(wine.color), backgroundColor: `${colorDot(wine.color)}1a` }}
    >
      {wine.label_photo_url ? (
        <img src={wine.label_photo_url} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="w-1.5 h-5 rounded-token-full opacity-80" style={{ backgroundColor: colorDot(wine.color) }} />
      )}
    </button>
  )
}

function ZoneCard({ zone, wines, onOpenWine, onUpdateZone, onDeleteZone }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(zone.name)
  const [rows, setRows] = useState(zone.rows)
  const [cols, setCols] = useState(zone.cols)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saving, setSaving] = useState(false)

  const grid = []
  for (let r = 1; r <= zone.rows; r++) {
    for (let c = 1; c <= zone.cols; c++) {
      const wine = wines.find((w) => w.zone_id === zone.id && w.zone_row === r && w.zone_col === c)
      grid.push({ r, c, wine })
    }
  }
  const filledCount = grid.filter((cell) => cell.wine).length

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onUpdateZone(zone.id, { name, rows: Number(rows), cols: Number(cols) })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-5 border-t border-border-strong space-y-3">
      {editing ? (
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div>
            <label className={labelClass}>Naam</label>
            <input required autoFocus value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rijen</label>
              <input type="number" min={1} max={20} required value={rows} onChange={(e) => setRows(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Kolommen</label>
              <input type="number" min={1} max={20} required value={cols} onChange={(e) => setCols(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(false)} className="text-sm font-medium text-text-secondary px-3 h-10">
              Annuleren
            </button>
            <button type="submit" disabled={saving} className="text-sm font-semibold text-accent-contrast bg-accent hover:bg-accent-hover disabled:opacity-60 px-4 h-10 rounded-token-md">
              {saving ? 'Bezig…' : 'Opslaan'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-xl font-semibold text-text-primary">{zone.name}</h3>
            <p className="byline whitespace-nowrap">
              {zone.rows} × {zone.cols} · {filledCount} van {zone.rows * zone.cols} plekken bezet
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 -mt-2">
            <div className="flex items-center gap-1 shrink-0">
              {!confirmDelete ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs font-medium text-accent-soft-text px-2 h-8"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    aria-label="Zone verwijderen"
                    className="w-8 h-8 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2 hover:text-danger-text"
                  >
                    <TrashIcon size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-danger-text mr-1">Zeker weten?</span>
                  <button
                    onClick={() => onDeleteZone(zone.id)}
                    aria-label="Ja, verwijderen"
                    className="w-8 h-8 rounded-token-full flex items-center justify-center text-danger-text hover:bg-danger-bg"
                  >
                    <CheckIcon size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Annuleren"
                    className="w-8 h-8 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2"
                  >
                    <XIcon size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div
              className="grid gap-1.5 min-w-[min-content]"
              style={{ gridTemplateColumns: `repeat(${zone.cols}, minmax(2rem, 3.5rem))` }}
            >
              {grid.map((cell) => (
                <ZoneCell key={`${cell.r}-${cell.c}`} wine={cell.wine} onOpenWine={onOpenWine} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function CellarMap({ userId, wines, onOpenWine }) {
  const { zones, loading, error, addZone, updateZone, deleteZone } = useCellarZones(userId)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Waar staat wat"
        title="Kelderkaart"
        action={
          !addOpen && (
            <button
              onClick={() => setAddOpen(true)}
              className="h-11 px-4 border border-border-strong text-text-secondary text-sm font-medium flex items-center gap-1.5 hover:border-text-primary hover:text-text-primary transition-colors"
            >
              <PlusIcon size={14} /> Zone toevoegen
            </button>
          )
        }
      />

      {addOpen && <AddZoneForm onSave={addZone} onClose={() => setAddOpen(false)} />}

      {loading ? (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-danger-text text-sm">Kelderkaart kon niet worden opgehaald: {error}</p>
      ) : zones.length === 0 && !addOpen ? (
        <div className="text-center py-16 border-t border-border">
          <MapIcon size={28} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Nog geen zones ingedeeld.</p>
          <p className="text-text-tertiary text-xs mt-1">
            Maak een zone aan (bv. een rek of kast) en geef je wijnen daarna een plek via het bewerkscherm.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              wines={wines}
              onOpenWine={onOpenWine}
              onUpdateZone={updateZone}
              onDeleteZone={deleteZone}
            />
          ))}
        </div>
      )}
    </div>
  )
}

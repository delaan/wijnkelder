export const WINE_COLORS = [
  { value: 'rood', label: 'Rood' },
  { value: 'wit', label: 'Wit' },
  { value: 'rose', label: 'Rosé' },
  { value: 'mousserend', label: 'Mousserend' },
  { value: 'versterkt', label: 'Versterkt' },
]

export const colorLabel = (value) =>
  WINE_COLORS.find((c) => c.value === value)?.label || value || '—'

export const colorSwatch = {
  rood: 'bg-wine-700',
  wit: 'bg-amber-200',
  rose: 'bg-rose-300',
  mousserend: 'bg-amber-100',
  versterkt: 'bg-amber-800',
}

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)
}

export const formatDate = (value) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(value)
  )
}

export const drinkWindowStatus = (from, until) => {
  const year = new Date().getFullYear()
  if (!from && !until) return null
  if (until && year > until) return { label: 'Over de top', tone: 'text-red-700 bg-red-50' }
  if (from && year < from) return { label: 'Nog te vroeg', tone: 'text-amber-700 bg-amber-50' }
  return { label: 'Op zijn best', tone: 'text-green-700 bg-green-50' }
}

export const totalValue = (wines) =>
  wines.reduce((sum, w) => sum + (Number(w.purchase_price) || 0) * (Number(w.quantity) || 0), 0)

export const totalBottles = (wines) => wines.reduce((sum, w) => sum + (Number(w.quantity) || 0), 0)

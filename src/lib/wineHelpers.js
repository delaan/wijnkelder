export const WINE_COLORS = [
  { value: 'rood', label: 'Rood', swatch: 'bg-type-rood', dot: 'var(--type-rood)' },
  { value: 'wit', label: 'Wit', swatch: 'bg-type-wit', dot: 'var(--type-wit)' },
  { value: 'rose', label: 'Rosé', swatch: 'bg-type-rose', dot: 'var(--type-rose)' },
  { value: 'mousserend', label: 'Mousserend', swatch: 'bg-type-mousserend', dot: 'var(--type-mousserend)' },
  { value: 'dessert', label: 'Dessertwijn', swatch: 'bg-type-dessert', dot: 'var(--type-dessert)' },
  { value: 'versterkt', label: 'Versterkt', swatch: 'bg-type-dessert', dot: 'var(--type-dessert)' },
]

export const TASTE_PROFILES = [
  { value: 'fris_mineraal', label: 'Fris & mineraal' },
  { value: 'vol_romig', label: 'Vol & romig' },
  { value: 'licht_fruitig', label: 'Licht & fruitig' },
  { value: 'krachtig_complex', label: 'Krachtig & complex' },
]

export const FOOD_PAIRINGS = [
  { value: 'vis', label: 'Vis' },
  { value: 'vlees', label: 'Vlees' },
  { value: 'pasta', label: 'Pasta' },
  { value: 'kaas', label: 'Kaas' },
  { value: 'aperitief', label: 'Aperitief' },
  { value: 'dessert', label: 'Dessert' },
]

export const colorLabel = (value) => WINE_COLORS.find((c) => c.value === value)?.label || value || '—'
export const colorSwatch = (value) => WINE_COLORS.find((c) => c.value === value)?.swatch || 'bg-text-tertiary'
export const colorDot = (value) => WINE_COLORS.find((c) => c.value === value)?.dot || 'var(--text-tertiary)'
export const tasteLabel = (value) => TASTE_PROFILES.find((t) => t.value === value)?.label || null
export const pairingLabel = (value) => FOOD_PAIRINGS.find((f) => f.value === value)?.label || value

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
  if (until && year > until) return { label: 'Over de top', tone: 'text-danger-text bg-danger-bg' }
  if (from && year < from) return { label: 'Nog te vroeg', tone: 'text-warning bg-warning-bg' }
  return { label: 'Op zijn best', tone: 'text-success bg-success-bg' }
}

export const isInDrinkWindow = (from, until) => {
  const year = new Date().getFullYear()
  if (!from && !until) return false
  if (from && year < from) return false
  if (until && year > until) return false
  return true
}

export const totalValue = (wines) =>
  wines.reduce((sum, w) => sum + (Number(w.estimated_value ?? w.purchase_price) || 0) * (Number(w.quantity) || 0), 0)

export const totalBottles = (wines) => wines.reduce((sum, w) => sum + (Number(w.quantity) || 0), 0)

export const colorDistribution = (wines) => {
  const totals = {}
  let grandTotal = 0
  for (const w of wines) {
    const qty = Number(w.quantity) || 0
    if (!qty) continue
    totals[w.color] = (totals[w.color] || 0) + qty
    grandTotal += qty
  }
  return WINE_COLORS.filter((c) => totals[c.value] > 0).map((c) => ({
    ...c,
    count: totals[c.value] || 0,
    percent: grandTotal ? Math.round(((totals[c.value] || 0) / grandTotal) * 100) : 0,
  }))
}

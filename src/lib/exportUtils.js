import { colorLabel } from './wineHelpers'

// Puntkomma als scheidingsteken i.p.v. komma: Excel in de Nederlandse
// regio-instellingen (die de komma als decimaalteken gebruikt) opent CSV's
// met puntkomma's automatisch correct in kolommen, met komma's juist niet.
const CSV_COLUMNS = [
  ['name', 'Naam'],
  ['producer', 'Producent'],
  ['vintage', 'Jaargang'],
  ['color', 'Type'],
  ['region', 'Regio'],
  ['country', 'Land'],
  ['appellation', 'Appellatie'],
  ['classification', 'Classificatie'],
  ['grape_varieties', 'Druiven'],
  ['quantity', 'Aantal'],
  ['location', 'Locatie in kelder'],
  ['purchase_price', 'Aankoopprijs'],
  ['purchase_date', 'Aankoopdatum'],
  ['estimated_value', 'Geschatte waarde'],
  ['drink_from', 'Drinkvenster van'],
  ['drink_until', 'Drinkvenster tot'],
  ['rating', 'Beoordeling'],
]

function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function winesToCsv(wines) {
  const header = CSV_COLUMNS.map(([, label]) => csvEscape(label)).join(';')
  const rows = wines.map((w) =>
    CSV_COLUMNS.map(([key]) => csvEscape(key === 'color' ? colorLabel(w[key]) : w[key])).join(';')
  )
  return [header, ...rows].join('\r\n')
}

export function downloadWinesCsv(wines, filename = 'wijnkelder-export.csv') {
  const csv = winesToCsv(wines)
  // BOM vooraan zodat Excel het bestand herkent als UTF-8 (anders sneven é, ë, etc.).
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

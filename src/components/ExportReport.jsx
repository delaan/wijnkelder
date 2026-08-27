import { createPortal } from 'react-dom'
import { colorLabel, formatCurrency, formatDate, totalBottles, totalValue } from '../lib/wineHelpers'

const th = { textAlign: 'left', borderBottom: '1.5px solid #1c1917', padding: '5px 8px', fontSize: 10.5 }
const td = { borderBottom: '1px solid #d6cfc9', padding: '5px 8px', fontSize: 11, breakInside: 'avoid' }

// Blijft altijd gemonteerd (onzichtbaar, via CSS in index.css) zodat het
// rapport met de actuele wijnen klaarstaat zodra Delano op "Printen/PDF"
// klikt — window.print() zelf gebeurt vanuit de knop in SettingsPage.
export default function ExportReport({ wines, cellarName }) {
  const target = document.getElementById('print-root')
  if (!target) return null

  const sorted = [...wines].sort((a, b) => a.name.localeCompare(b.name, 'nl'))

  return createPortal(
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1c1917' }}>
      <h1 style={{ fontSize: 19, margin: '0 0 2px' }}>{cellarName}</h1>
      <p style={{ fontSize: 10.5, color: '#6b6461', margin: '0 0 16px' }}>
        {sorted.length} wijnen · {totalBottles(wines)} flessen op voorraad · geschatte waarde{' '}
        {formatCurrency(totalValue(wines))} · geëxporteerd op {formatDate(new Date().toISOString())}
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Naam</th>
            <th style={th}>Producent</th>
            <th style={th}>Jaargang</th>
            <th style={th}>Type</th>
            <th style={th}>Regio / land</th>
            <th style={th}>Aantal</th>
            <th style={th}>Locatie</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((w) => (
            <tr key={w.id}>
              <td style={{ ...td, fontWeight: 600 }}>{w.name}</td>
              <td style={td}>{w.producer || '—'}</td>
              <td style={td}>{w.vintage || '—'}</td>
              <td style={td}>{colorLabel(w.color)}</td>
              <td style={td}>{[w.region, w.country].filter(Boolean).join(', ') || '—'}</td>
              <td style={td}>{w.quantity}</td>
              <td style={td}>{w.location || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    target
  )
}

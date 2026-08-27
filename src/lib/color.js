// Kleine kleurhulpjes om vanuit één gekozen accentkleur automatisch een
// hover/pressed-variant en een zachte achtergrondtint te berekenen, zodat
// de gebruiker maar één kleur hoeft te kiezen in Instellingen.

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mix(hex, target, amount) {
  const a = hexToRgb(hex)
  const b = hexToRgb(target)
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  })
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const srgb = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

export function isValidHex(hex) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)
}

// Maakt (indien nodig) een lichtere versie van de accentkleur, specifiek om
// als TEKST/icoonkleur te gebruiken in donkere modus — de kleur zelf is vaak
// te donker om leesbaar te zijn op een donkere ondergrond (bijv. een
// geselecteerd menu-item), ook al werkt diezelfde kleur prima als vulling
// van een knop (met witte tekst erop). Mikt ruim boven de WCAG AA-drempel
// (4,5:1) voor kleine tekst.
function lightenForDarkText(hex) {
  let amount = 0
  let result = hex
  while (relativeLuminance(result) < 0.32 && amount < 0.9) {
    amount += 0.04
    result = mix(hex, '#ffffff', amount)
  }
  return result
}

// Berekent afgeleide tinten voor licht/donker thema vanuit één basiskleur.
export function deriveAccentTokens(hex, isDark) {
  const base = isValidHex(hex) ? hex : '#641027'
  const hover = mix(base, isDark ? '#ffffff' : '#000000', isDark ? 0.16 : 0.2)
  const soft = `${base}${isDark ? '26' : '14'}` // hex alpha suffix
  const contrast = relativeLuminance(base) > 0.4 ? '#1c1917' : '#ffffff'
  const softText = isDark ? lightenForDarkText(base) : base
  return { accent: base, accentHover: hover, accentSoft: soft, accentContrast: contrast, accentSoftText: softText }
}

export const ACCENT_PRESETS = [
  { label: 'Bordeaux', value: '#641027' },
  { label: 'Terracotta', value: '#a4432a' },
  { label: 'Olijf', value: '#5c6b2e' },
  { label: 'Nachtblauw', value: '#1f3a5f' },
  { label: 'Antraciet', value: '#3a3632' },
  { label: 'Amber', value: '#8a5a12' },
]

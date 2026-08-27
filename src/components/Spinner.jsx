// Eén gedeeld laad-icoontje, in plaats van dat elk scherm zijn eigen
// (net iets andere) draaiende cirkel opnieuw uitschrijft — zo oogt "bezig
// met laden" overal in de app hetzelfde.
export default function Spinner({ size = 20, muted = false, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Bezig met laden…"
      className={`inline-block rounded-token-full border-2 border-t-transparent animate-spin shrink-0 ${
        muted ? 'border-text-tertiary' : 'border-accent'
      } ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

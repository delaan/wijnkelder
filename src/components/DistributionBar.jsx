import { useState } from 'react'

// Interactieve horizontale verdelingsbalk. Werkt met muis (hover), toetsenbord
// (focus/pijltjestoetsen) en aanraking (tap + slepen over de balk).
export default function DistributionBar({ segments }) {
  const [activeIndex, setActiveIndex] = useState(null)

  if (!segments.length) {
    return <p className="text-text-tertiary text-sm">Nog geen wijnen om te verdelen.</p>
  }

  const handlePointerMove = (e) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    let cumulative = 0
    for (let i = 0; i < segments.length; i++) {
      cumulative += segments[i].percent
      if (ratio * 100 <= cumulative) {
        setActiveIndex(i)
        return
      }
    }
    setActiveIndex(segments.length - 1)
  }

  const active = activeIndex !== null ? segments[activeIndex] : null

  return (
    <div>
      <div
        className="flex h-8 rounded-token-full overflow-hidden cursor-pointer touch-pan-y"
        role="group"
        aria-label="Verdeling van je collectie per wijntype"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => setActiveIndex(null)}
        onTouchMove={handlePointerMove}
        onTouchEnd={() => setActiveIndex(null)}
      >
        {segments.map((seg, i) => (
          <button
            key={seg.value}
            type="button"
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex(null)}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
            aria-label={`${seg.label}: ${seg.count} flessen, ${seg.percent}% van je collectie`}
            style={{
              width: `${seg.percent}%`,
              backgroundColor: seg.dot,
              transform: activeIndex === i ? 'scaleY(1.15)' : 'scaleY(1)',
            }}
            className="h-full transition-transform duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3" aria-hidden={false}>
        {segments.map((seg) => (
          <span key={seg.value} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-token-full shrink-0" style={{ backgroundColor: seg.dot }} />
            {seg.label} <span className="text-text-tertiary">· {seg.count} ({seg.percent}%)</span>
          </span>
        ))}
      </div>

      {active && (
        <p className="text-sm text-text-primary mt-2" role="status">
          <strong>{active.label}</strong> — {active.count} flessen, {active.percent}% van je collectie
        </p>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { SearchIcon } from './icons'

// Persistente zoekbalk, onderin, altijd op dezelfde plek — met een subtiele
// schaduw zodat hij los van de pagina lijkt te zweven. Blijft op iOS/Android
// boven een opkomend schermtoetsenbord staan door de visualViewport-hoogte
// te volgen, in plaats van erachter te verdwijnen.
export default function SearchBar({ value, onChange, placeholder = 'Zoek op naam, producent, regio, druif…', fullWidth = false }) {
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const handler = () => {
      const offset = window.innerHeight - vv.height - vv.offsetTop
      // Alleen reageren op een écht schermtoetsenbord (flink hoger dan de
      // ruis die bijv. het in-/uitklappen van de adresbalk tijdens scrollen
      // geeft) — anders "springt" de balk mee met elke kleine
      // viewport-schommeling. Alleen "resize" gebruiken (niet "scroll"),
      // want een toetsenbord verandert de hoogte van de visuele viewport;
      // gewoon scrollen verandert alleen de offset, niet de hoogte.
      setKeyboardOffset(offset > 120 ? Math.round(offset) : 0)
    }
    vv.addEventListener('resize', handler)
    handler()
    return () => {
      vv.removeEventListener('resize', handler)
    }
  }, [])

  return (
    <div
      className={`fixed z-nav flex justify-center px-4 pointer-events-none bottom-[calc(6rem+env(safe-area-inset-bottom))] md:bottom-[calc(3rem+env(safe-area-inset-bottom))] ${
        fullWidth ? 'inset-x-0' : 'inset-x-0 md:inset-x-auto md:left-64 md:right-0'
      }`}
      style={keyboardOffset > 0 ? { bottom: keyboardOffset + 12 } : undefined}
    >
      <div className="w-full max-w-2xl pointer-events-auto relative">
        <SearchIcon size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Zoek in je collectie"
          className="w-full h-14 pl-14 pr-5 rounded-token-full bg-surface border border-border text-base text-text-primary placeholder:text-text-tertiary shadow-token-lg focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
        />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { SearchIcon } from './icons'

// Persistente zoekbalk, onderin, altijd op dezelfde plek — met een subtiele
// schaduw zodat hij los van de pagina lijkt te zweven. Blijft op iOS/Android
// boven een opkomend schermtoetsenbord staan door de visualViewport-hoogte
// te volgen, in plaats van erachter te verdwijnen.
export default function SearchBar({ value, onChange, placeholder = 'Zoek op naam, producent, regio, druif…' }) {
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const handler = () => {
      const offset = window.innerHeight - vv.height - vv.offsetTop
      setKeyboardOffset(Math.max(0, Math.round(offset)))
    }
    vv.addEventListener('resize', handler)
    vv.addEventListener('scroll', handler)
    handler()
    return () => {
      vv.removeEventListener('resize', handler)
      vv.removeEventListener('scroll', handler)
    }
  }, [])

  return (
    <div
      className="fixed inset-x-0 z-nav flex justify-center px-4 pointer-events-none bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
      style={keyboardOffset > 12 ? { bottom: keyboardOffset + 12 } : undefined}
    >
      <div className="w-full max-w-xl pointer-events-auto relative">
        <SearchIcon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Zoek in je collectie"
          className="w-full h-12 pl-11 pr-4 rounded-token-full bg-surface border border-border text-sm text-text-primary placeholder:text-text-tertiary shadow-token-lg focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
        />
      </div>
    </div>
  )
}

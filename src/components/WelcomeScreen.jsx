import { useEffect, useState } from 'react'

// Kort welkomstscherm dat verschijnt telkens als de app opnieuw geopend
// wordt (nieuwe sessie/tabblad) — niet bij elke interne navigatie. Gaat
// vanzelf verder na een korte pauze, of meteen bij een tik/klik.
export default function WelcomeScreen({ name, cellarName, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(onDone, 1800)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={onDone}
      className={`fixed inset-0 z-modal bg-bg flex items-center justify-center cursor-pointer transition-opacity duration-slow ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center px-6">
        <span className="mx-auto w-16 h-16 rounded-token-full bg-accent flex items-center justify-center mb-5 shadow-token-md overflow-hidden">
          <img src="/icon-192.png" alt="" className="w-full h-full object-cover" />
        </span>
        <h1 className="text-3xl font-bold text-text-primary">Welkom{name ? `, ${name}` : ''}</h1>
        {cellarName && <p className="text-text-secondary text-sm mt-2">{cellarName}</p>}
      </div>
    </div>
  )
}

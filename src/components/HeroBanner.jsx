import { useState } from 'react'

// Gedeelde "hero"-banner met achtergrondfoto (standaard of zelf gekozen),
// gebruikt op zowel het dashboard als de gastmodus, zodat titel, ondertitel
// en de foto er overal precies hetzelfde uitzien. De foto faded rustig in
// zodra hij klaar is met laden, in plaats van er in één keer "in te
// springen" — dat voorkomt de sprong die je anders ziet zodra een (grote,
// eventueel zelf geüploade) foto pas na de rest van het scherm binnenkomt.
export default function HeroBanner({ heroImageUrl, title, subtitle, heightClass = 'h-64 sm:h-80', className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const src = heroImageUrl || '/hero-default.jpg'

  return (
    <div className={`relative ${heightClass} rounded-token-lg overflow-hidden bg-surface-2 ${className}`}>
      <img
        key={src}
        src={src}
        alt=""
        fetchPriority="high"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-slow ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* De foto heeft onderaan al een lichte gloed; dit verloop trekt die
          door naar de echte paginakleur, zodat de kaart — ook in donkere
          modus — netjes overloopt in wat eronder staat. */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 38%, var(--bg) 97%)' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]">{title}</h1>
        {subtitle && (
          <p className="text-white/95 text-sm sm:text-base font-medium mt-2 max-w-md drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { SunIcon, CloudIcon, CloudRainIcon, CloudBoltIcon, SnowflakeIcon, SmogIcon, LocationIcon } from './icons'
import Spinner from './Spinner'

// Klein weerkaartje op het dashboard, gebaseerd op de locatie van het
// apparaat (via de browser) en Open-Meteo (geen account/sleutel nodig).
// Wordt 30 minuten in localStorage bewaard zodat niet bij elk bezoek
// opnieuw naar locatie gevraagd en opgehaald hoeft te worden.
const CACHE_KEY = 'wijnkast-weather-cache'
const CACHE_MS = 30 * 60 * 1000

function weatherInfo(code) {
  if (code === 0) return { Icon: SunIcon, label: 'Helder' }
  if (code === 1 || code === 2) return { Icon: CloudIcon, label: 'Licht bewolkt' }
  if (code === 3) return { Icon: CloudIcon, label: 'Bewolkt' }
  if (code === 45 || code === 48) return { Icon: SmogIcon, label: 'Mist' }
  if ([51, 53, 55, 56, 57].includes(code)) return { Icon: CloudRainIcon, label: 'Motregen' }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { Icon: CloudRainIcon, label: 'Regen' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { Icon: SnowflakeIcon, label: 'Sneeuw' }
  if ([95, 96, 99].includes(code)) return { Icon: CloudBoltIcon, label: 'Onweer' }
  return { Icon: CloudIcon, label: 'Wisselend bewolkt' }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data.fetchedAt || Date.now() - data.fetchedAt > CACHE_MS) return null
    return data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, fetchedAt: Date.now() }))
  } catch {
    // negeer opslagfouten stilletjes — het weerkaartje werkt dan gewoon iets minder gecached
  }
}

export default function WeatherWidget() {
  const [state, setState] = useState(() => {
    const cached = readCache()
    return cached ? { status: 'ok', ...cached } : { status: 'loading' }
  })

  useEffect(() => {
    if (readCache()) return

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({ status: 'unavailable' })
      return
    }

    let cancelled = false

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const [weatherRes, placeRes] = await Promise.allSettled([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
            ).then((r) => r.json()),
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=nl`
            ).then((r) => r.json()),
          ])
          if (cancelled) return

          if (weatherRes.status !== 'fulfilled' || !weatherRes.value?.current) {
            setState({ status: 'unavailable' })
            return
          }

          const w = weatherRes.value
          const place =
            placeRes.status === 'fulfilled' ? placeRes.value?.city || placeRes.value?.locality || null : null

          const data = {
            temp: Math.round(w.current.temperature_2m),
            code: w.current.weather_code,
            max: Math.round(w.daily.temperature_2m_max[0]),
            min: Math.round(w.daily.temperature_2m_min[0]),
            place,
          }
          writeCache(data)
          setState({ status: 'ok', ...data })
        } catch {
          if (!cancelled) setState({ status: 'unavailable' })
        }
      },
      () => {
        if (!cancelled) setState({ status: 'denied' })
      },
      { timeout: 10000, maximumAge: CACHE_MS }
    )

    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center md:justify-start gap-2.5 h-14 px-4 w-full md:w-auto rounded-token-lg bg-transparent md:bg-surface border-0 md:border md:border-border text-text-tertiary text-sm md:shrink-0">
        <Spinner size={14} muted />
        Weer laden…
      </div>
    )
  }

  if (state.status === 'denied' || state.status === 'unavailable') {
    return (
      <div className="flex items-center justify-center md:justify-start gap-2.5 h-14 px-4 w-full md:w-auto md:max-w-[15rem] rounded-token-lg bg-transparent md:bg-surface border-0 md:border md:border-border text-text-tertiary text-sm md:shrink-0">
        <LocationIcon size={16} className="shrink-0" />
        <span>{state.status === 'denied' ? 'Zet locatietoegang aan voor het weer' : 'Weer nu niet beschikbaar'}</span>
      </div>
    )
  }

  const { Icon, label } = weatherInfo(state.code)

  return (
    <div className="flex items-center justify-center md:justify-start gap-3 h-14 px-4 w-full md:w-auto rounded-token-lg bg-transparent md:bg-surface border-0 md:border md:border-border md:shrink-0">
      <Icon size={26} className="text-accent-soft-text shrink-0" />
      <div className="leading-tight text-center md:text-left">
        <p className="font-semibold text-text-primary text-lg">
          {state.temp}°<span className="text-text-tertiary text-xs font-normal ml-1.5">{label}</span>
        </p>
        <p className="text-text-tertiary text-xs mt-0.5">
          {state.place ? `${state.place} · ` : ''}
          Max {state.max}° · Min {state.min}°
        </p>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { WINE_COLORS, TASTE_PROFILES, FOOD_PAIRINGS } from '../lib/wineHelpers'
import { LogoMark } from '../lib/logoPresets'
import {
  ChevronRightIcon,
  XIcon,
  WineGlassIcon,
  CheersIcon,
  WineBottleIcon,
  DropletIcon,
  GemIcon,
  AppleIcon,
  FireIcon,
  FishIcon,
  DrumstickIcon,
  BowlFoodIcon,
  CheeseIcon,
  CocktailIcon,
  IceCreamIcon,
} from './icons'
import Collection from './Collection'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'
import HeroBanner from './HeroBanner'

// Per categorie een passend icoon en een eigen tint, zodat elke kaart er
// herkenbaar en "beeldend" uitziet, ook zonder echte foto's.
const WINE_TYPE_META = {
  rood: { icon: WineGlassIcon, tint: 'var(--type-rood)' },
  wit: { icon: WineGlassIcon, tint: 'var(--type-wit)' },
  rose: { icon: WineGlassIcon, tint: 'var(--type-rose)' },
  mousserend: { icon: CheersIcon, tint: 'var(--type-mousserend)' },
  dessert: { icon: WineBottleIcon, tint: 'var(--type-dessert)' },
  versterkt: { icon: WineBottleIcon, tint: 'var(--type-dessert)' },
}

const TASTE_META = {
  fris_mineraal: { icon: DropletIcon, tint: '#4a90a4' },
  vol_romig: { icon: GemIcon, tint: '#b8860b' },
  licht_fruitig: { icon: AppleIcon, tint: '#d64550' },
  krachtig_complex: { icon: FireIcon, tint: '#7a3348' },
}

const FOOD_META = {
  vis: { icon: FishIcon, tint: '#3b6ea5' },
  vlees: { icon: DrumstickIcon, tint: '#7a3b2e' },
  pasta: { icon: BowlFoodIcon, tint: '#c98a3e' },
  kaas: { icon: CheeseIcon, tint: '#d4a017' },
  aperitief: { icon: CocktailIcon, tint: '#e0954f' },
  dessert: { icon: IceCreamIcon, tint: '#b5607a' },
}

const SECTIONS = [
  {
    key: 'color',
    title: 'Soorten wijn',
    subtitle: 'Kies op basis van kleur en stijl.',
    items: WINE_COLORS,
    meta: WINE_TYPE_META,
  },
  {
    key: 'tasting_profile',
    title: 'Smaakprofielen',
    subtitle: 'Waar heb je smaakmatig zin in?',
    items: TASTE_PROFILES,
    meta: TASTE_META,
  },
  {
    key: 'food_pairing',
    title: 'Etenswaren',
    subtitle: 'Kies een gerecht om een passende wijn te vinden.',
    items: FOOD_PAIRINGS,
    meta: FOOD_META,
  },
]

function CategoryTile({ label, Icon, tint, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-token-lg border border-border overflow-hidden bg-surface transition-transform duration-fast hover:-translate-y-0.5 hover:shadow-token-md"
    >
      <div
        className="h-24 sm:h-28 flex items-center justify-center"
        style={{
          background: `linear-gradient(160deg, color-mix(in srgb, ${tint} 45%, transparent), color-mix(in srgb, ${tint} 10%, transparent))`,
        }}
      >
        <span style={{ color: tint }}>
          <Icon size={30} />
        </span>
      </div>
      <div className="px-3 py-2.5">
        <span className="text-sm font-semibold text-text-primary">{label}</span>
      </div>
    </button>
  )
}

export default function GuestMode({ wines, cellarName, logoType, logoUrl, heroImageUrl, onOpenWine, onExit }) {
  const [filter, setFilter] = useState(null) // { kind, value, label } | 'all' | null
  const [search, setSearch] = useState('')

  // Voor "kleur" laten we Collection zélf filteren (met dezelfde
  // kleurenknoppen als in het hoofdmenu), zodat de knoppen daar altijd
  // precies de actieve keuze tonen en de gast die vrij kan aanpassen.
  // Voor smaakprofiel/etenswaar (waar Collection geen eigen knoppen voor
  // heeft) filteren we hier alvast voor.
  const collectionWines = useMemo(() => {
    if (!filter) return []
    if (filter === 'all' || filter.kind === 'color') return wines
    if (filter.kind === 'food_pairing') {
      return wines.filter((w) => Array.isArray(w.food_pairing) && w.food_pairing.includes(filter.value))
    }
    return wines.filter((w) => w[filter.kind] === filter.value)
  }, [wines, filter])

  const handleSearch = (value) => {
    setSearch(value)
    if (!filter && value) setFilter('all')
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-nav bg-surface/90 backdrop-blur border-b border-border safe-top">
        <div className="h-16 px-4 sm:px-6 flex items-center gap-3 max-w-5xl mx-auto">
          <button
            onClick={onExit}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Terug naar normale weergave (tik op het logo)"
          >
            <span className="w-8 h-8 rounded-token-md bg-accent-soft flex items-center justify-center overflow-hidden">
              <LogoMark logoType={logoType} logoUrl={logoUrl} size={17} className="text-accent-soft-text" />
            </span>
            <span className="font-semibold text-text-primary truncate">{cellarName}</span>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-xs text-text-tertiary hidden sm:inline mr-1">Gastmodus</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-48 md:pb-32">
        {!filter ? (
          <>
            <HeroBanner
              heroImageUrl={heroImageUrl}
              title={`Welkom bij ${cellarName}`}
              subtitle="Blader gerust door de collectie. Kies een wijntype, smaakprofiel of gerecht om inspiratie te krijgen — of bekijk direct de hele voorraad."
              className="mb-8"
            />

            <div className="text-center mb-10">
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center gap-1.5 h-11 px-5 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold"
              >
                Bekijk de hele collectie
                <ChevronRightIcon size={16} />
              </button>
            </div>

            <div className="space-y-10">
              {SECTIONS.map((section) => (
                <section key={section.key}>
                  <div className="mb-3">
                    <h2 className="text-lg font-bold text-text-primary">{section.title}</h2>
                    <p className="text-text-tertiary text-sm mt-0.5">{section.subtitle}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {section.items.map((item) => {
                      const meta = section.meta[item.value] || {}
                      const Icon = meta.icon || WineGlassIcon
                      return (
                        <CategoryTile
                          key={`${section.key}-${item.value}`}
                          label={item.label}
                          Icon={Icon}
                          tint={meta.tint || 'var(--accent)'}
                          onClick={() => setFilter({ kind: section.key, value: item.value, label: item.label })}
                        />
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => setFilter(null)} className="text-sm font-medium text-accent-soft-text shrink-0">
                ← Andere keuze
              </button>
              {filter === 'all' ? (
                <p className="text-sm text-text-secondary">Hele collectie</p>
              ) : filter.kind !== 'color' ? (
                <button
                  onClick={() => setFilter('all')}
                  className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2.5 rounded-token-full bg-accent-soft text-accent-soft-text text-sm font-medium"
                  aria-label={`Filter "${filter.label}" verwijderen`}
                >
                  {filter.label}
                  <XIcon size={12} />
                </button>
              ) : null}
            </div>
            <Collection
              wines={collectionWines}
              search={search}
              onOpenWine={onOpenWine}
              hidePrivate
              persist={false}
              initialColorFilter={filter.kind === 'color' ? filter.value : ''}
              showFavoritesToggle={false}
            />
          </div>
        )}
      </main>

      <SearchBar value={search} onChange={handleSearch} fullWidth />
    </div>
  )
}

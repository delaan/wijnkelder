import {
  CellarIcon,
  GridIcon,
  HeartIcon,
  GuestIcon,
  SettingsIcon,
  HistoryIcon,
  BookmarkIcon,
  MapIcon,
} from '../components/icons'

// Eén bron voor de navigatie, gedeeld door zijbalk en bottom nav, zodat
// afmetingen, volgorde en labels overal gelijk zijn.
//
// - `mobile: false` betekent: niet als eigen knop in de zwevende onderbalk
//   (mobiel) — te overvol anders. Op de zijbalk (desktop) staat gewoon alles.
// - `more: true` betekent: op mobiel bereikbaar via de "Meer"-knop (een
//   keuzemenu), in plaats van helemaal niet bereikbaar.
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Mijn kelder', icon: CellarIcon, section: 'primary' },
  { key: 'collection', label: 'Collectie', icon: GridIcon, section: 'primary' },
  { key: 'cellarmap', label: 'Kelderkaart', icon: MapIcon, section: 'primary', mobile: false, more: true },
  { key: 'favorites', label: 'Favorieten', icon: HeartIcon, section: 'primary', mobile: false },
  { key: 'wishlist', label: 'Verlanglijst', icon: BookmarkIcon, section: 'primary', mobile: false, more: true },
  { key: 'history', label: 'Geschiedenis', icon: HistoryIcon, section: 'primary', mobile: false, more: true },
  { key: 'guest', label: 'Gastmodus', icon: GuestIcon, section: 'secondary', mobile: false, more: true },
  { key: 'settings', label: 'Instellingen', icon: SettingsIcon, section: 'secondary' },
]

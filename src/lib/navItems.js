import { CellarIcon, GridIcon, HeartIcon, GuestIcon, SettingsIcon } from '../components/icons'

// Eén bron voor de navigatie, gedeeld door zijbalk en bottom nav, zodat
// afmetingen, volgorde en labels overal gelijk zijn.
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Mijn kelder', icon: CellarIcon },
  { key: 'collection', label: 'Collectie', icon: GridIcon },
  { key: 'favorites', label: 'Favorieten', icon: HeartIcon },
  { key: 'guest', label: 'Gastmodus', icon: GuestIcon },
  { key: 'settings', label: 'Instellingen', icon: SettingsIcon },
]

import { CellarIcon, GridIcon, HeartIcon, GuestIcon, SettingsIcon } from '../components/icons'

// Eén bron voor de navigatie, gedeeld door zijbalk en bottom nav, zodat
// afmetingen, volgorde en labels overal gelijk zijn.
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Mijn kelder', icon: CellarIcon, section: 'primary' },
  { key: 'collection', label: 'Collectie', icon: GridIcon, section: 'primary' },
  { key: 'favorites', label: 'Favorieten', icon: HeartIcon, section: 'primary' },
  { key: 'guest', label: 'Gastmodus', icon: GuestIcon, section: 'secondary' },
  { key: 'settings', label: 'Instellingen', icon: SettingsIcon, section: 'secondary' },
]

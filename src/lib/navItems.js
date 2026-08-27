import { CellarIcon, GridIcon, HeartIcon, GuestIcon, SettingsIcon } from '../components/icons'

// Eén bron voor de navigatie, gedeeld door zijbalk en bottom nav, zodat
// afmetingen, volgorde en labels overal gelijk zijn. "Favorieten" staat wel
// in de zijbalk (desktop), maar niet in de navigatiebalk onderin (mobiel) —
// daar is favorieten-filteren in plaats daarvan een knop binnen Collectie.
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Mijn kelder', icon: CellarIcon, section: 'primary' },
  { key: 'collection', label: 'Collectie', icon: GridIcon, section: 'primary' },
  { key: 'favorites', label: 'Favorieten', icon: HeartIcon, section: 'primary', mobile: false },
  { key: 'guest', label: 'Gastmodus', icon: GuestIcon, section: 'secondary' },
  { key: 'settings', label: 'Instellingen', icon: SettingsIcon, section: 'secondary' },
]

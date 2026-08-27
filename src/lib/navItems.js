import { CellarIcon, GridIcon, HeartIcon, GuestIcon, SettingsIcon, HistoryIcon, BookmarkIcon, MapIcon } from '../components/icons'

// Eén bron voor de navigatie, gedeeld door zijbalk en bottom nav, zodat
// afmetingen, volgorde en labels overal gelijk zijn. "Favorieten" staat wel
// in de zijbalk (desktop), maar niet in de navigatiebalk onderin (mobiel) —
// daar is favorieten-filteren in plaats daarvan een knop binnen Collectie.
// Geschiedenis/Verlanglijst/Kelderkaart zijn om dezelfde reden ook
// mobile:false — op de telefoon zijn ze bereikbaar via Instellingen > Meer,
// zodat de zwevende onderbalk niet overvol raakt.
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Mijn kelder', icon: CellarIcon, section: 'primary' },
  { key: 'collection', label: 'Collectie', icon: GridIcon, section: 'primary' },
  { key: 'favorites', label: 'Favorieten', icon: HeartIcon, section: 'primary', mobile: false },
  { key: 'history', label: 'Geschiedenis', icon: HistoryIcon, section: 'secondary', mobile: false },
  { key: 'wishlist', label: 'Verlanglijst', icon: BookmarkIcon, section: 'secondary', mobile: false },
  { key: 'cellarmap', label: 'Kelderkaart', icon: MapIcon, section: 'secondary', mobile: false },
  { key: 'guest', label: 'Gastmodus', icon: GuestIcon, section: 'secondary' },
  { key: 'settings', label: 'Instellingen', icon: SettingsIcon, section: 'secondary' },
]

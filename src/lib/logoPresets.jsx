import { CellarIcon, WineGlassIcon, CheersIcon, HeartIcon } from '../components/icons'

export const LOGO_PRESETS = [
  { key: 'cellar', icon: CellarIcon, label: 'Fles' },
  { key: 'glass', icon: WineGlassIcon, label: 'Glas' },
  { key: 'cheers', icon: CheersIcon, label: 'Proost' },
  { key: 'heart', icon: HeartIcon, label: 'Hart' },
]

export function LogoMark({ logoType, logoUrl, size = 18, className = '' }) {
  if (logoType === 'upload' && logoUrl) {
    return <img src={logoUrl} alt="" className={`w-full h-full object-cover ${className}`} />
  }
  const preset = LOGO_PRESETS.find((p) => p.key === logoUrl) || LOGO_PRESETS[0]
  const Icon = preset.icon
  return <Icon size={size} className={className} />
}

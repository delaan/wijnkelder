// Font Awesome Free-iconen (geladen via CDN, zie index.html), met dezelfde
// component-API als voorheen: <XyzIcon size={20} className="tekst-kleur-klasse" />
// — zo hoefden alle andere bestanden die deze iconen gebruiken niet te
// veranderen. Kleur komt gewoon mee via `currentColor` (Tailwind text-*
// klassen), precies zoals bij de vorige handgetekende iconen.

function Icon({ name, weight = 'solid', size = 20, className = '' }) {
  return (
    <i
      className={`fa-${weight} fa-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}
      aria-hidden="true"
    />
  )
}

export const CellarIcon = (p) => <Icon name="wine-bottle" {...p} />
export const GridIcon = (p) => <Icon name="table-cells" {...p} />
export const ListIcon = (p) => <Icon name="list" {...p} />
export const HeartIcon = ({ filled, ...p }) => <Icon name="heart" weight={filled ? 'solid' : 'regular'} {...p} />
export const GuestIcon = (p) => <Icon name="eye" {...p} />
export const SettingsIcon = (p) => <Icon name="gear" {...p} />
export const SearchIcon = (p) => <Icon name="magnifying-glass" {...p} />
export const PlusIcon = (p) => <Icon name="plus" {...p} />
export const XIcon = (p) => <Icon name="xmark" {...p} />
export const SunIcon = (p) => <Icon name="sun" {...p} />
export const MoonIcon = (p) => <Icon name="moon" {...p} />
export const AutoIcon = (p) => <Icon name="circle-half-stroke" {...p} />
export const CameraIcon = (p) => <Icon name="camera" {...p} />
export const UploadIcon = (p) => <Icon name="upload" {...p} />
export const CheckIcon = (p) => <Icon name="check" {...p} />
export const ChevronDownIcon = (p) => <Icon name="chevron-down" {...p} />
export const ChevronRightIcon = (p) => <Icon name="chevron-right" {...p} />
export const WineGlassIcon = (p) => <Icon name="wine-glass" {...p} />
export const WineBottleIcon = (p) => <Icon name="wine-bottle" {...p} />
export const CheersIcon = (p) => <Icon name="champagne-glasses" {...p} />
export const TrashIcon = (p) => <Icon name="trash" {...p} />
export const UndoIcon = (p) => <Icon name="arrow-rotate-left" {...p} />
export const ImageIcon = (p) => <Icon name="image" {...p} />
export const LockIcon = (p) => <Icon name="lock" {...p} />
export const LogoutIcon = (p) => <Icon name="arrow-right-from-bracket" {...p} />

// Decoratief kleureniconennstje voor "eigen accentkleur kiezen" — bewust géén
// Font Awesome-icoon (dat is altijd één kleur): een ring van kleine bolletjes,
// elk een andere regenboogkleur, als vriendelijke visuele hint bij de
// kleurenkiezer.
export function ColorWheelIcon({ size = 20, className = '' }) {
  const dots = [
    '#ef4444', // rood
    '#f97316', // oranje
    '#eab308', // geel
    '#22c55e', // groen
    '#3b82f6', // blauw
    '#a855f7', // paars
  ]
  const positions = dots.map((fill, i) => {
    const angle = (i / dots.length) * Math.PI * 2 - Math.PI / 2
    return { fill, cx: 12 + Math.cos(angle) * 7.5, cy: 12 + Math.sin(angle) * 7.5 }
  })
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" />
      {positions.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="2.6" fill={d.fill} />
      ))}
    </svg>
  )
}

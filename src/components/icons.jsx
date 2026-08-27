// Handgetekende, minimale lijniconen (geen externe library nodig).
// Alle iconen: 24x24 viewBox, stroke = currentColor, consistente stroke-width.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, className, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      {children}
    </svg>
  )
}

export const CellarIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3v9" />
    <path d="M8.5 3h7l.7 5a3.7 3.7 0 0 1-3.2 4.2v0A3.7 3.7 0 0 1 9.5 8l.7-5Z" />
    <path d="M9.5 21h5" />
    <path d="M12 12v9" />
  </Svg>
)

export const GridIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Svg>
)

export const ListIcon = (p) => (
  <Svg {...p}>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </Svg>
)

export const HeartIcon = ({ filled, ...p }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.5s-7.5-4.7-9.8-9.3C.6 7.7 2.4 4.5 5.7 4a4.9 4.9 0 0 1 4.9 2 4.9 4.9 0 0 1 4.9-2c3.3.5 5.1 3.7 3.5 7.2C19.5 15.8 12 20.5 12 20.5Z" />
  </Svg>
)

export const GuestIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Svg>
)

export const SettingsIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13.5a1.9 1.9 0 0 0 .4 2.1l.1.1a2.3 2.3 0 1 1-3.2 3.2v-.1a1.9 1.9 0 0 0-2-.4 1.9 1.9 0 0 0-1.1 1.7v.2a2.3 2.3 0 0 1-4.6 0v-.1a1.9 1.9 0 0 0-1.2-1.7 1.9 1.9 0 0 0-2.1.4l-.1.1a2.3 2.3 0 1 1-3.2-3.2l.1-.1a1.9 1.9 0 0 0 .4-2.1 1.9 1.9 0 0 0-1.7-1.1H1a2.3 2.3 0 0 1 0-4.6h.1a1.9 1.9 0 0 0 1.7-1.2 1.9 1.9 0 0 0-.4-2.1l-.1-.1a2.3 2.3 0 1 1 3.2-3.2l.1.1a1.9 1.9 0 0 0 2.1.4H8a1.9 1.9 0 0 0 1.1-1.7V1a2.3 2.3 0 0 1 4.6 0v.1a1.9 1.9 0 0 0 1.1 1.7 1.9 1.9 0 0 0 2.1-.4l.1-.1a2.3 2.3 0 1 1 3.2 3.2l-.1.1a1.9 1.9 0 0 0-.4 2.1v.1a1.9 1.9 0 0 0 1.7 1.1H23a2.3 2.3 0 0 1 0 4.6h-.1a1.9 1.9 0 0 0-1.7 1.1Z" />
  </Svg>
)

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Svg>
)

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
)

export const XIcon = (p) => (
  <Svg {...p}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </Svg>
)

export const SunIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
)

export const MoonIcon = (p) => (
  <Svg {...p}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
  </Svg>
)

export const AutoIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none" />
  </Svg>
)

export const CameraIcon = (p) => (
  <Svg {...p}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
)

export const UploadIcon = (p) => (
  <Svg {...p}>
    <path d="M12 15V4" />
    <path d="m7 8 5-5 5 5" />
    <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
  </Svg>
)

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
)

export const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const ChevronRightIcon = (p) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const WineGlassIcon = (p) => (
  <Svg {...p}>
    <path d="M7 3h10l-1 6a4 4 0 0 1-8 0L7 3Z" />
    <path d="M12 13v7" />
    <path d="M8.5 20h7" />
  </Svg>
)

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13a1.5 1.5 0 0 0 1.5 1.4h7A1.5 1.5 0 0 0 17 20l1-13" />
  </Svg>
)

export const UndoIcon = (p) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 1 1 2.5 5.8" />
    <path d="M4 12V6" />
    <path d="M4 12h6" />
  </Svg>
)

export const ImageIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m5 18 5-5 3 3 3-3 3 3" />
  </Svg>
)

export const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="9" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Svg>
)

export const LogoutIcon = (p) => (
  <Svg {...p}>
    <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
    <path d="M16 16.5 20.5 12 16 7.5" />
    <path d="M20 12H9" />
  </Svg>
)

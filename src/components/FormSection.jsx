import { useState } from 'react'
import { ChevronDownIcon } from './icons'

// Progressive disclosure: secties staan standaard dicht, behalve de eerste,
// zodat het formulier niet als één lange lijst aanvoelt.
export default function FormSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-border rounded-token-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 h-12 text-sm font-semibold text-text-primary bg-surface-2"
      >
        {title}
        <ChevronDownIcon size={16} className={`transition-transform duration-fast ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  )
}

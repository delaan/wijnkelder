// Gedeelde krantenkop voor elk hoofdscherm: klein kapitaal label (kicker),
// een grote serif-titel, en een dubbele onderlijn zoals in het Broadsheet-
// ontwerp. Vervangt de losse "icoon + vetgedrukte titel"-koppen van voorheen.
export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap pb-4 border-b-2 border-text-primary">
      <div className="min-w-0">
        {eyebrow && <p className="kicker mb-1.5">{eyebrow}</p>}
        <h1 className="font-serif text-3xl sm:text-[2.25rem] font-semibold text-text-primary leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-text-secondary text-sm mt-1.5 max-w-lg">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

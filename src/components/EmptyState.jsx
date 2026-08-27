export default function EmptyState({ hasFilters }) {
  return (
    <div className="text-center py-20">
      <h3 className="font-semibold text-text-primary">
        {hasFilters ? 'Geen wijnen gevonden' : 'Nog geen wijnen hier'}
      </h3>
      <p className="text-text-secondary text-sm mt-1">
        {hasFilters ? 'Probeer een andere zoekterm of filter.' : 'Voeg een wijn toe via de knop hierboven.'}
      </p>
    </div>
  )
}

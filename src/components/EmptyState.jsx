export default function EmptyState({ hasFilters, onAdd }) {
  return (
    <div className="text-center py-20">
      <div className="text-4xl mb-3">🍷</div>
      <h3 className="font-serif text-lg font-semibold text-stone-900">
        {hasFilters ? 'Geen wijnen gevonden' : 'Je kelder is nog leeg'}
      </h3>
      <p className="text-stone-500 text-sm mt-1 mb-5">
        {hasFilters
          ? 'Probeer een andere zoekterm of filter.'
          : 'Voeg je eerste fles toe om te beginnen.'}
      </p>
      {!hasFilters && (
        <button
          onClick={onAdd}
          className="bg-wine-800 hover:bg-wine-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          + Wijn toevoegen
        </button>
      )}
    </div>
  )
}

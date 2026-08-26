export default function Header({ email, onSignOut, onAdd }) {
  return (
    <header className="sticky top-0 z-20 bg-wine-900 text-white safe-top">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-wine-700 flex items-center justify-center shrink-0">
            <span className="text-lg">🍷</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-lg font-semibold leading-tight truncate">Wijnkelder</h1>
            <p className="text-wine-200 text-xs truncate">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAdd}
            className="bg-white text-wine-900 hover:bg-wine-100 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors"
          >
            + Wijn toevoegen
          </button>
          <button
            onClick={onSignOut}
            className="text-wine-200 hover:text-white text-sm font-medium px-2 py-2 transition-colors"
            title="Uitloggen"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </header>
  )
}

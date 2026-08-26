export default function SetupNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded-xl shadow-sm p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-wine-700 flex items-center justify-center mb-4">
          <span className="text-white text-xl">🍷</span>
        </div>
        <h1 className="font-serif text-xl font-semibold text-stone-900 mb-2">Nog niet gekoppeld</h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          Deze app heeft nog geen verbinding met je Supabase-database. Volg de stappen in{' '}
          <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800">README.md</code> om
          je <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800">VITE_SUPABASE_URL</code>{' '}
          en <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800">VITE_SUPABASE_ANON_KEY</code>{' '}
          in te stellen.
        </p>
      </div>
    </div>
  )
}

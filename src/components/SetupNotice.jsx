export default function SetupNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="max-w-md w-full bg-surface border border-border rounded-token-lg shadow-token-sm p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-token-full bg-accent flex items-center justify-center mb-4">
          <span className="text-accent-contrast text-xl">🍷</span>
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">Nog niet gekoppeld</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Deze app heeft nog geen verbinding met je Supabase-database. Volg de stappen in{' '}
          <code className="bg-surface-2 px-1.5 py-0.5 rounded-token-sm text-text-primary">README.md</code> om
          je <code className="bg-surface-2 px-1.5 py-0.5 rounded-token-sm text-text-primary">VITE_SUPABASE_URL</code>{' '}
          en <code className="bg-surface-2 px-1.5 py-0.5 rounded-token-sm text-text-primary">VITE_SUPABASE_ANON_KEY</code>{' '}
          in te stellen.
        </p>
      </div>
    </div>
  )
}

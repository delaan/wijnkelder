import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { CellarIcon } from './icons'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
      } else {
        const { error: signUpError } = await signUp(email, password)
        if (signUpError) throw signUpError
        setInfo('Account aangemaakt. Check je e-mail als bevestiging is vereist, of log direct in.')
      }
    } catch (err) {
      setError(err.message || 'Er ging iets mis.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 safe-top safe-bottom">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-token-full bg-accent flex items-center justify-center mb-4 shadow-token-sm">
            <CellarIcon size={24} className="text-accent-contrast" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Wijnkast</h1>
          <p className="text-text-secondary text-sm mt-1">Jouw persoonlijke wijncollectie</p>
        </div>

        <div className="bg-surface border border-border rounded-token-lg shadow-token-sm p-6">
          <div className="flex mb-6 bg-surface-2 rounded-token-md p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-token-sm transition-colors ${
                mode === 'signin' ? 'bg-surface text-text-primary shadow-token-sm' : 'text-text-tertiary'
              }`}
            >
              Inloggen
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-token-sm transition-colors ${
                mode === 'signup' ? 'bg-surface text-text-primary shadow-token-sm' : 'text-text-tertiary'
              }`}
            >
              Account maken
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">E-mailadres</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="jij@voorbeeld.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Wachtwoord</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Minimaal 6 tekens"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-token-md px-3 py-2">{error}</p>}
            {info && <p className="text-sm text-green-700 bg-green-50 rounded-token-md px-3 py-2">{info}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 bg-accent hover:bg-accent-hover disabled:opacity-60 text-accent-contrast text-sm font-semibold rounded-token-md transition-colors"
            >
              {busy ? 'Even geduld…' : mode === 'signin' ? 'Inloggen' : 'Account maken'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

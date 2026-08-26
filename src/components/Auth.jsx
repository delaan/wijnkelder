import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

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
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6 safe-top safe-bottom">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-wine-800 flex items-center justify-center mb-4 shadow-sm">
            <span className="text-2xl">🍷</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-stone-900">Wijnkelder</h1>
          <p className="text-stone-500 text-sm mt-1">Jouw persoonlijke wijnvoorraad</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
          <div className="flex mb-6 bg-stone-100 rounded-lg p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === 'signin' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Inloggen
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === 'signup' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Account maken
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">E-mailadres</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-transparent"
                placeholder="jij@voorbeeld.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Wachtwoord</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-transparent"
                placeholder="Minimaal 6 tekens"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {info && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{info}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-wine-800 hover:bg-wine-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {busy ? 'Even geduld…' : mode === 'signin' ? 'Inloggen' : 'Account maken'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

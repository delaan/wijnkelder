import { useCallback, useEffect, useState } from 'react'
import { listUsers, inviteUser, updateUserRole, toggleUserAccess } from '../lib/adminApi'
import { formatDate } from '../lib/wineHelpers'

export default function AdminPanel({ currentUserId, onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMessage, setInviteMessage] = useState(null)

  const [busyUserId, setBusyUserId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { users: data } = await listUsers()
      setUsers(data)
    } catch (err) {
      setError(err.message || 'Gebruikers laden mislukt.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleInvite = async (e) => {
    e.preventDefault()
    setInviting(true)
    setInviteMessage(null)
    try {
      await inviteUser(inviteEmail)
      setInviteMessage({ type: 'success', text: `Uitnodiging verstuurd naar ${inviteEmail}.` })
      setInviteEmail('')
      load()
    } catch (err) {
      setInviteMessage({ type: 'error', text: err.message || 'Uitnodigen mislukt.' })
    } finally {
      setInviting(false)
    }
  }

  const handleRoleChange = async (user, role) => {
    setBusyUserId(user.id)
    setError(null)
    try {
      await updateUserRole(user.id, role)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)))
    } catch (err) {
      setError(err.message || 'Rol wijzigen mislukt.')
    } finally {
      setBusyUserId(null)
    }
  }

  const handleToggleAccess = async (user) => {
    const revoke = user.status === 'active'
    setBusyUserId(user.id)
    setError(null)
    try {
      await toggleUserAccess(user.id, revoke)
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: revoke ? 'revoked' : 'active' } : u))
      )
    } catch (err) {
      setError(err.message || 'Bijwerken mislukt.')
    } finally {
      setBusyUserId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="text-accent text-sm font-medium mb-1">
            ← Terug naar instellingen
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Beheer gebruikers</h1>
          <p className="text-text-secondary text-sm mt-1">Wie heeft een wijnkast, en met welke rechten.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-token-lg p-5">
          <h2 className="font-semibold text-text-primary mb-3">Gebruiker uitnodigen</h2>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="naam@voorbeeld.nl"
              className="flex-1 rounded-token-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={inviting}
              className="bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-token-md whitespace-nowrap"
            >
              {inviting ? 'Bezig…' : 'Uitnodiging versturen'}
            </button>
          </form>
          {inviteMessage && (
            <p
              className={`text-sm mt-3 rounded-token-md px-3 py-2 ${
                inviteMessage.type === 'success' ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
              }`}
            >
              {inviteMessage.text}
            </p>
          )}
          <p className="text-xs text-text-tertiary mt-3">
            De genodigde krijgt een e-mail van Supabase om zelf een wachtwoord in te stellen. Ze krijgen
            automatisch hun eigen, persoonlijke wijnkast.
          </p>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-token-md px-3 py-2">{error}</p>}

        <div className="bg-surface border border-border rounded-token-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-text-primary">Gebruikers</h2>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-token-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-text-tertiary text-sm px-5 py-6">Nog geen gebruikers gevonden.</p>
          ) : (
            <ul className="divide-y divide-border">
              {users.map((user) => {
                const isSelf = user.id === currentUserId
                const busy = busyUserId === user.id
                return (
                  <li key={user.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">
                        {user.email}
                        {isSelf && <span className="text-text-tertiary font-normal"> (jij)</span>}
                      </p>
                      <p className="text-text-tertiary text-xs mt-0.5">
                        {user.wineCount} wijnen · {user.bottleCount} flessen · lid sinds{' '}
                        {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-token-full font-medium ${
                          user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {user.status === 'active' ? 'Actief' : 'Ingetrokken'}
                      </span>

                      <select
                        value={user.role}
                        disabled={busy || (isSelf && user.role === 'admin')}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className="text-sm rounded-token-md border border-border px-2 py-1.5 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="user">Gebruiker</option>
                        <option value="admin">Beheerder</option>
                      </select>

                      <button
                        onClick={() => handleToggleAccess(user)}
                        disabled={busy || isSelf}
                        className={`text-xs font-medium px-3 py-1.5 rounded-token-md disabled:opacity-40 ${
                          user.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {user.status === 'active' ? 'Toegang intrekken' : 'Toegang herstellen'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
      </div>
    </div>
  )
}

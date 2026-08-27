import { supabase } from './supabaseClient'

async function callFunction(name, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new Error('Niet ingelogd.')

  const res = await fetch(`/.netlify/functions/${name}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...(options.headers || {}),
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Er ging iets mis.')
  return body
}

export const listUsers = () => callFunction('admin-list-users')

export const inviteUser = (email) =>
  callFunction('admin-invite-user', { method: 'POST', body: JSON.stringify({ email }) })

export const updateUserRole = (userId, role) =>
  callFunction('admin-update-role', { method: 'POST', body: JSON.stringify({ userId, role }) })

export const toggleUserAccess = (userId, revoke) =>
  callFunction('admin-toggle-access', { method: 'POST', body: JSON.stringify({ userId, revoke }) })

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

export const setResetCode = (code) =>
  callFunction('reset-code-set', { method: 'POST', body: JSON.stringify({ code }) })

export const resetCellar = (code) =>
  callFunction('reset-cellar', { method: 'POST', body: JSON.stringify({ code }) })

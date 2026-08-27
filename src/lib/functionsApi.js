import { supabase } from './supabaseClient'

// Gedeelde helper voor het aanroepen van Netlify Functions (privileged
// server-side acties): stuurt automatisch de ingelogde sessie mee en zet
// een niet-2xx-respons om in een leesbare foutmelding. Gebruikt door zowel
// cellarApi.js (resetcode/resetten) als adminApi.js (gebruikersbeheer).
export async function callFunction(name, options = {}) {
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

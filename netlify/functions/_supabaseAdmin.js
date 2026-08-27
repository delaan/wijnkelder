const { createClient } = require('@supabase/supabase-js')

// Deze module draait alleen server-side (Netlify Functions), nooit in de browser.
// SUPABASE_SERVICE_ROLE_KEY geeft volledige toegang tot de database, voorbij
// alle beveiligingsregels (RLS) — daarom staat hij hier, en NIET als VITE_-
// variabele die in de frontend-bundel terecht zou komen.

function getAdminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL of SUPABASE_SERVICE_ROLE_KEY ontbreekt in de Netlify environment variables.'
    )
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Controleert dat de aanroeper is ingelogd én de rol "admin" heeft, aan de
// hand van het toegangstoken dat de frontend meestuurt. Nooit vertrouwen op
// een client-aangeleverd "ik ben admin"-veld.
async function requireAdmin(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization
  if (!authHeader) {
    return { error: 'Niet ingelogd.', status: 401 }
  }
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const admin = getAdminClient()

  const { data: userData, error: userError } = await admin.auth.getUser(token)
  if (userError || !userData?.user) {
    return { error: 'Ongeldige of verlopen sessie.', status: 401 }
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return { error: 'Geen beheerdersrechten.', status: 403 }
  }

  return { admin, user: userData.user }
}

module.exports = { getAdminClient, requireAdmin }

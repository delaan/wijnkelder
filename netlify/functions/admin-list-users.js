const { requireAdmin } = require('./_supabaseAdmin')

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const auth = await requireAdmin(event)
  if (auth.error) {
    return { statusCode: auth.status, body: JSON.stringify({ error: auth.error }) }
  }
  const { admin } = auth

  try {
    const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({ perPage: 1000 })
    if (usersError) throw usersError

    const { data: profiles, error: profilesError } = await admin.from('profiles').select('id, role')
    if (profilesError) throw profilesError
    const roleMap = Object.fromEntries((profiles || []).map((p) => [p.id, p.role]))

    const { data: wines, error: winesError } = await admin.from('wines').select('user_id, quantity')
    if (winesError) throw winesError
    const wineStats = {}
    for (const w of wines || []) {
      if (!wineStats[w.user_id]) wineStats[w.user_id] = { wineCount: 0, bottleCount: 0 }
      wineStats[w.user_id].wineCount += 1
      wineStats[w.user_id].bottleCount += Number(w.quantity) || 0
    }

    const now = new Date()
    const users = usersData.users
      .map((u) => ({
        id: u.id,
        email: u.email,
        role: roleMap[u.id] || 'user',
        status: u.banned_until && new Date(u.banned_until) > now ? 'revoked' : 'active',
        createdAt: u.created_at,
        wineCount: wineStats[u.id]?.wineCount || 0,
        bottleCount: wineStats[u.id]?.bottleCount || 0,
      }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    return { statusCode: 200, body: JSON.stringify({ users }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Onbekende fout' }) }
  }
}

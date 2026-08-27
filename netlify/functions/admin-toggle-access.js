const { requireAdmin } = require('./_supabaseAdmin')

// Trekt toegang in (of herstelt die) zonder data te wissen: we "bannen" het
// account bij Supabase Auth, zodat inloggen niet meer lukt maar alle wijnen
// gewoon bewaard blijven voor als de toegang later weer wordt hersteld.
const REVOKE_DURATION = '876000h' // ~100 jaar, Supabase kent geen "voor altijd"
const RESTORE_DURATION = 'none'

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const auth = await requireAdmin(event)
  if (auth.error) {
    return { statusCode: auth.status, body: JSON.stringify({ error: auth.error }) }
  }
  const { admin, user } = auth

  let userId, revoke
  try {
    ;({ userId, revoke } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) }
  }

  if (userId === user.id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Je kunt je eigen toegang niet intrekken.' }) }
  }

  try {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      ban_duration: revoke ? REVOKE_DURATION : RESTORE_DURATION,
    })
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Bijwerken mislukt.' }) }
  }
}

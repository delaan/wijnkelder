const { requireAdmin } = require('./_supabaseAdmin')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const auth = await requireAdmin(event)
  if (auth.error) {
    return { statusCode: auth.status, body: JSON.stringify({ error: auth.error }) }
  }
  const { admin } = auth

  let email
  try {
    ;({ email } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) }
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Vul een geldig e-mailadres in.' }) }
  }

  try {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email.trim())
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ user: { id: data.user.id, email: data.user.email } }) }
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: err.message || 'Uitnodigen mislukt.' }) }
  }
}

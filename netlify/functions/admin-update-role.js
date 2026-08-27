const { requireAdmin } = require('./_supabaseAdmin')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const auth = await requireAdmin(event)
  if (auth.error) {
    return { statusCode: auth.status, body: JSON.stringify({ error: auth.error }) }
  }
  const { admin, user } = auth

  let userId, role
  try {
    ;({ userId, role } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) }
  }

  if (!['admin', 'user'].includes(role)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige rol.' }) }
  }
  if (userId === user.id && role !== 'admin') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Je kunt jezelf niet degraderen.' }) }
  }

  try {
    const { error } = await admin.from('profiles').update({ role }).eq('id', userId)
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Bijwerken mislukt.' }) }
  }
}

const { requireUser, hashCode } = require('./_supabaseUser')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }
  const auth = await requireUser(event)
  if (auth.error) return { statusCode: auth.status, body: JSON.stringify({ error: auth.error }) }
  const { admin, user } = auth

  let code
  try {
    ;({ code } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) }
  }
  if (!code || String(code).trim().length < 4) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Kies een code van minstens 4 tekens.' }) }
  }

  try {
    const reset_code_hash = hashCode(code.trim())
    const { error } = await admin
      .from('cellar_settings')
      .upsert({ user_id: user.id, reset_code_hash }, { onConflict: 'user_id' })
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Opslaan mislukt.' }) }
  }
}

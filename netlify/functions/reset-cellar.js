const { requireUser, verifyCode } = require('./_supabaseUser')

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
  if (!code) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Vul je resetcode in.' }) }
  }

  try {
    const { data: settings, error: settingsError } = await admin
      .from('cellar_settings')
      .select('reset_code_hash')
      .eq('user_id', user.id)
      .single()
    if (settingsError) throw settingsError
    if (!settings?.reset_code_hash) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Er is nog geen resetcode ingesteld.' }) }
    }
    if (!verifyCode(code, settings.reset_code_hash)) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Onjuiste resetcode.' }) }
    }

    const { error: deleteError } = await admin.from('wines').delete().eq('user_id', user.id)
    if (deleteError) throw deleteError

    // Na gebruik vervalt de code — er moet een nieuwe worden ingesteld.
    const { error: clearError } = await admin
      .from('cellar_settings')
      .update({ reset_code_hash: null })
      .eq('user_id', user.id)
    if (clearError) throw clearError

    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Resetten mislukt.' }) }
  }
}

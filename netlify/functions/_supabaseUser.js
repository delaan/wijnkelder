const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

function getAdminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL of SUPABASE_SERVICE_ROLE_KEY ontbreekt in de Netlify environment variables.')
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// Controleert alleen dat de aanroeper is ingelogd (geen rol-check) —
// gebruikt voor acties die iedereen op zijn EIGEN kelder mag doen.
async function requireUser(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization
  if (!authHeader) return { error: 'Niet ingelogd.', status: 401 }
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const admin = getAdminClient()
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data?.user) return { error: 'Ongeldige of verlopen sessie.', status: 401 }
  return { admin, user: data.user }
}

const SCRYPT_KEYLEN = 64

function hashCode(code) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(code), salt, SCRYPT_KEYLEN).toString('hex')
  return `${salt}:${hash}`
}

function verifyCode(code, stored) {
  if (!stored || !stored.includes(':')) return false
  const [salt, hash] = stored.split(':')
  const candidate = crypto.scryptSync(String(code), salt, SCRYPT_KEYLEN).toString('hex')
  const a = Buffer.from(candidate, 'hex')
  const b = Buffer.from(hash, 'hex')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

module.exports = { getAdminClient, requireUser, hashCode, verifyCode }

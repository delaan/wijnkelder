import { callFunction } from './functionsApi'

export const setResetCode = (code) =>
  callFunction('reset-code-set', { method: 'POST', body: JSON.stringify({ code }) })

export const resetCellar = (code) =>
  callFunction('reset-cellar', { method: 'POST', body: JSON.stringify({ code }) })

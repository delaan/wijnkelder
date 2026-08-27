import { callFunction } from './functionsApi'

export const recognizeLabel = (base64, mediaType) =>
  callFunction('recognize-label', { method: 'POST', body: JSON.stringify({ image: base64, mediaType }) })

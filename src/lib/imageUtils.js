// Comprimeert een foto client-side vóór upload/AI-analyse: een telefoonfoto
// van 4000x3000 hoeft niet in volle resolutie naar de server — dit scheelt
// tijd bij het uploaden en maakt de AI-herkenning sneller/goedkoper.
export function compressImage(file, { maxDimension = 1280, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height / width) * maxDimension)
          width = maxDimension
        } else {
          width = Math.round((width / height) * maxDimension)
          height = maxDimension
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Afbeelding comprimeren mislukt.'))
            return
          }
          const reader = new FileReader()
          reader.onloadend = () => {
            const dataUrl = reader.result
            const base64 = String(dataUrl).split(',')[1]
            resolve({
              previewUrl: URL.createObjectURL(blob),
              file: new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }),
              base64,
              mediaType: 'image/jpeg',
            })
          }
          reader.onerror = () => reject(new Error('Afbeelding verwerken mislukt.'))
          reader.readAsDataURL(blob)
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Afbeelding laden mislukt.'))
    }
    img.src = objectUrl
  })
}

import { useRef, useState } from 'react'
import { CameraIcon, ChevronRightIcon, XIcon, SparklesIcon } from './icons'
import WineForm from './WineForm'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { compressImage } from '../lib/imageUtils'
import { recognizeLabel } from '../lib/aiApi'

export default function AddWineModal({ onSave, onClose, onUploadPhoto, userId }) {
  const [mode, setMode] = useState(null) // null (keuzescherm) | 'ai' | 'manual'
  const [photo, setPhoto] = useState(null) // { previewUrl, file, base64, mediaType }
  const [analyzing, setAnalyzing] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [recognizedWine, setRecognizedWine] = useState(null)
  const fileInput = useRef(null)
  const aiDialogRef = useFocusTrap(mode === 'ai' ? onClose : null)
  const chooseDialogRef = useFocusTrap(mode === null ? onClose : null)

  if (mode === 'manual' || recognizedWine) {
    return (
      <WineForm
        wine={recognizedWine}
        onSave={onSave}
        onClose={onClose}
        onUploadPhoto={onUploadPhoto}
        userId={userId}
        title={recognizedWine ? 'Controleer herkende gegevens' : undefined}
      />
    )
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAiError(null)
    try {
      const compressed = await compressImage(file)
      setPhoto(compressed)
    } catch (err) {
      setAiError(err.message || 'Foto laden mislukt.')
    }
  }

  const handleAnalyze = async () => {
    if (!photo) return
    setAnalyzing(true)
    setAiError(null)
    try {
      const recognized = await recognizeLabel(photo.base64, photo.mediaType)
      const label_photo_url = await onUploadPhoto(photo.file)
      setRecognizedWine({ ...recognized, label_photo_url })
    } catch (err) {
      setAiError(err.message || 'Herkenning mislukt. Probeer het opnieuw of voeg de wijn handmatig toe.')
    } finally {
      setAnalyzing(false)
    }
  }

  const resetPhoto = () => {
    setPhoto(null)
    setAiError(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  if (mode === 'ai') {
    return (
      <div className="fixed inset-0 z-modal flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="ai-title" ref={aiDialogRef}>
        <div
          className="absolute inset-x-0 top-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:inset-0 backdrop-blur-md animate-fade-in"
          style={{ background: 'var(--overlay)' }}
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative bg-surface w-[calc(100%-1.5rem)] md:w-full md:max-w-sm rounded-token-lg shadow-token-lg p-6 mb-[calc(6.5rem+env(safe-area-inset-bottom))] md:mb-0 animate-slide-up">
          <button onClick={onClose} aria-label="Sluiten" className="absolute right-4 top-4 w-9 h-9 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2">
            <XIcon size={16} />
          </button>

          {!photo ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-token-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
                <SparklesIcon size={22} className="text-accent-soft-text" />
              </div>
              <h2 id="ai-title" className="font-semibold text-text-primary mb-1.5">Scannen en herkennen met AI</h2>
              <p className="text-text-secondary text-sm mb-5">
                Maak of kies een foto van het etiket — we lezen de naam, producent, jaargang en meer automatisch af.
              </p>
              <button
                onClick={() => fileInput.current?.click()}
                className="w-full h-11 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold flex items-center justify-center gap-2"
              >
                <CameraIcon size={16} /> Foto maken of kiezen
              </button>
              <button onClick={() => setMode('manual')} className="w-full h-11 mt-1 text-sm font-medium text-text-secondary">
                Liever handmatig invoeren
              </button>
              <input ref={fileInput} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
              {aiError && <p className="text-sm text-danger-text bg-danger-bg rounded-token-md px-3 py-2 mt-3">{aiError}</p>}
            </div>
          ) : (
            <div>
              <h2 id="ai-title" className="font-semibold text-text-primary mb-3 text-center">Etiket herkennen</h2>
              <div className="w-full aspect-[4/3] rounded-token-md overflow-hidden bg-surface-2 mb-4">
                <img src={photo.previewUrl} alt="Foto van het etiket" className="w-full h-full object-cover" />
              </div>
              {aiError && <p className="text-sm text-danger-text bg-danger-bg rounded-token-md px-3 py-2 mb-3">{aiError}</p>}
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full h-11 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  'Etiket wordt gelezen…'
                ) : (
                  <>
                    <SparklesIcon size={15} /> Analyseren
                  </>
                )}
              </button>
              <button onClick={resetPhoto} disabled={analyzing} className="w-full h-11 mt-1 text-sm font-medium text-text-secondary disabled:opacity-60">
                Andere foto kiezen
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-modal flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="add-wine-title" ref={chooseDialogRef}>
      <div
        className="absolute inset-x-0 top-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:inset-0 backdrop-blur-md animate-fade-in"
        style={{ background: 'var(--overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-surface w-[calc(100%-1.5rem)] md:w-full md:max-w-sm rounded-token-lg shadow-token-lg p-5 mb-[calc(6.5rem+env(safe-area-inset-bottom))] md:mb-0 animate-slide-up"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="add-wine-title" className="font-semibold text-text-primary">Wijn toevoegen</h2>
          <button onClick={onClose} aria-label="Sluiten" className="w-9 h-9 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2">
            <XIcon size={16} />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => setMode('ai')}
            className="w-full flex items-center gap-3 p-4 rounded-token-md border border-border hover:border-accent hover:bg-accent-soft transition-colors text-left"
          >
            <span className="w-11 h-11 rounded-token-md bg-accent-soft flex items-center justify-center shrink-0">
              <CameraIcon size={20} className="text-accent-soft-text" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-text-primary">Scannen en herkennen met AI</span>
              <span className="block text-xs text-text-secondary mt-0.5">Maak of upload een foto van het etiket</span>
            </span>
            <ChevronRightIcon size={18} className="text-text-tertiary shrink-0" />
          </button>

          <button
            onClick={() => setMode('manual')}
            className="w-full flex items-center gap-3 p-4 rounded-token-md border border-border hover:border-accent hover:bg-accent-soft transition-colors text-left"
          >
            <span className="w-11 h-11 rounded-token-md bg-surface-2 flex items-center justify-center shrink-0 text-text-secondary font-semibold text-sm">
              A-Z
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-text-primary">Handmatig toevoegen</span>
              <span className="block text-xs text-text-secondary mt-0.5">Vul zelf alle gegevens in</span>
            </span>
            <ChevronRightIcon size={18} className="text-text-tertiary shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}

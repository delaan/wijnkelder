import { useState } from 'react'
import { CameraIcon, ChevronRightIcon, XIcon } from './icons'
import WineForm from './WineForm'
import { useFocusTrap } from '../hooks/useFocusTrap'

export default function AddWineModal({ onSave, onClose, onUploadPhoto }) {
  const [mode, setMode] = useState(null) // null (keuzescherm) | 'ai' | 'manual'
  const aiDialogRef = useFocusTrap(mode === 'ai' ? onClose : null)
  const chooseDialogRef = useFocusTrap(mode === null ? onClose : null)

  if (mode === 'manual') {
    return <WineForm onSave={onSave} onClose={onClose} onUploadPhoto={onUploadPhoto} />
  }

  if (mode === 'ai') {
    return (
      <div className="fixed inset-0 z-modal flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="ai-stub-title" ref={aiDialogRef}>
        <div
          className="absolute inset-x-0 top-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:inset-0 backdrop-blur-md animate-fade-in"
          style={{ background: 'var(--overlay)' }}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className="relative bg-surface w-[calc(100%-1.5rem)] md:w-full md:max-w-sm rounded-token-lg shadow-token-lg p-6 text-center mb-[calc(6.5rem+env(safe-area-inset-bottom))] md:mb-0 animate-slide-up"
        >
          <button onClick={onClose} aria-label="Sluiten" className="absolute right-4 top-4 w-9 h-9 rounded-token-full flex items-center justify-center text-text-tertiary hover:bg-surface-2">
            <XIcon size={16} />
          </button>
          <div className="w-14 h-14 rounded-token-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
            <CameraIcon size={24} className="text-accent-soft-text" />
          </div>
          <h2 id="ai-stub-title" className="font-semibold text-text-primary mb-1.5">AI-herkenning komt binnenkort</h2>
          <p className="text-text-secondary text-sm mb-5">
            We werken aan het automatisch herkennen van etiketten. Voeg je wijn voor nu handmatig toe — dat gaat ook
            snel, en je kunt gewoon alvast een foto toevoegen.
          </p>
          <button
            onClick={() => setMode('manual')}
            className="w-full h-11 rounded-token-md bg-accent hover:bg-accent-hover text-accent-contrast text-sm font-semibold"
          >
            Handmatig toevoegen
          </button>
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

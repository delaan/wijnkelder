import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { ACCENT_PRESETS, isValidHex } from '../lib/color'
import { CellarIcon, CheckIcon, ChevronRightIcon } from './icons'

const STEPS = ['naam', 'kelder', 'kleur']

// Eerste-keer-introductie: vraagt de paar gegevens die de app nodig heeft om
// meteen persoonlijk te voelen (naam voor het welkomstscherm, kelder-naam,
// optioneel een accentkleur). Verschijnt alleen zolang onboarding_completed
// nog niet op de instellingen staat.
export default function Onboarding({ settings, onComplete }) {
  const { setAccent } = useTheme()
  const [stepIndex, setStepIndex] = useState(0)
  const [displayName, setDisplayName] = useState(settings?.display_name || '')
  const [cellarName, setCellarName] = useState(settings?.cellar_name || 'Mijn wijnkelder')
  const [chosenAccent, setChosenAccent] = useState(settings?.accent_color || '#641027')
  const [customColor, setCustomColor] = useState(settings?.accent_color || '#641027')
  const [saving, setSaving] = useState(false)

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1
  const canNext = step !== 'naam' || displayName.trim().length > 0

  const finish = async () => {
    setSaving(true)
    try {
      if (isValidHex(chosenAccent)) setAccent(chosenAccent)
      await onComplete({
        display_name: displayName.trim(),
        cellar_name: cellarName.trim() || 'Mijn wijnkelder',
        onboarding_completed: true,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!canNext) return
    if (isLast) finish()
    else setStepIndex((i) => i + 1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 safe-top safe-bottom">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-token-full bg-accent flex items-center justify-center mb-4 shadow-token-sm">
            <CellarIcon size={24} className="text-accent-contrast" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welkom bij Wijnkast</h1>
          <p className="text-text-secondary text-sm mt-1">Nog drie korte vragen, dan is je kelder klaar.</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-6" role="status" aria-label={`Stap ${stepIndex + 1} van ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-token-full transition-all ${i === stepIndex ? 'w-6 bg-accent' : 'w-1.5 bg-border-strong'}`}
            />
          ))}
        </div>

        <form onSubmit={handleNext} className="bg-surface border border-border rounded-token-lg shadow-token-sm p-6">
          {step === 'naam' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Hoe mogen we je noemen?</label>
              <input
                autoFocus
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Bijv. Delano"
                className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-text-tertiary text-xs mt-2">Dit gebruiken we voor je welkomstscherm.</p>
            </div>
          )}

          {step === 'kelder' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Hoe heet je wijnkelder?</label>
              <input
                autoFocus
                value={cellarName}
                onChange={(e) => setCellarName(e.target.value)}
                placeholder="Mijn wijnkelder"
                className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-text-tertiary text-xs mt-2">Dit pas je later altijd aan in Instellingen.</p>
            </div>
          )}

          {step === 'kleur' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Kies een accentkleur (optioneel)</label>
              <div className="flex flex-wrap items-center gap-2">
                {ACCENT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setChosenAccent(preset.value)
                      setCustomColor(preset.value)
                    }}
                    aria-label={preset.label}
                    aria-pressed={chosenAccent.toLowerCase() === preset.value.toLowerCase()}
                    className="w-9 h-9 rounded-token-full border-2 flex items-center justify-center"
                    style={{
                      backgroundColor: preset.value,
                      borderColor: chosenAccent.toLowerCase() === preset.value.toLowerCase() ? 'var(--text-primary)' : 'transparent',
                    }}
                  >
                    {chosenAccent.toLowerCase() === preset.value.toLowerCase() && <CheckIcon size={14} className="text-white" />}
                  </button>
                ))}
                <input
                  type="color"
                  value={isValidHex(customColor) ? customColor : '#641027'}
                  onChange={(e) => {
                    setCustomColor(e.target.value)
                    setChosenAccent(e.target.value)
                  }}
                  className="w-9 h-9 rounded-token-md border border-border cursor-pointer bg-transparent"
                  aria-label="Eigen kleur kiezen"
                />
              </div>
              <p className="text-text-tertiary text-xs mt-3">Dit pas je later altijd aan in Instellingen.</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            {stepIndex > 0 ? (
              <button type="button" onClick={() => setStepIndex((i) => i - 1)} className="text-sm font-medium text-text-secondary h-11 px-2">
                Terug
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={!canNext || saving}
              className="h-11 px-5 rounded-token-md bg-accent hover:bg-accent-hover disabled:opacity-60 text-accent-contrast text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              {saving ? 'Bezig…' : isLast ? 'Aan de slag' : 'Volgende'}
              {!isLast && !saving && <ChevronRightIcon size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { ACCENT_PRESETS, isValidHex } from '../lib/color'
import { LOGO_PRESETS, LogoMark } from '../lib/logoPresets'
import { setResetCode, resetCellar } from '../lib/cellarApi'
import { SunIcon, MoonIcon, AutoIcon, CheckIcon, LockIcon } from './icons'

function SettingsSection({ title, description, children }) {
  return (
    <section className="bg-surface border border-border rounded-token-lg p-5">
      <h2 className="font-semibold text-text-primary">{title}</h2>
      {description && <p className="text-text-secondary text-sm mt-0.5 mb-4">{description}</p>}
      {!description && <div className="mt-4" />}
      {children}
    </section>
  )
}

export default function SettingsPage({ settings, onUpdate, onUploadLogo, isAdmin, onOpenAdmin, onResetSuccess }) {
  const { preference, setPreference, accent, setAccent, dining, setDining } = useTheme()
  const logoInput = useRef(null)

  const [name, setName] = useState(settings?.cellar_name || 'Mijn wijnkelder')
  const [nameSaved, setNameSaved] = useState(false)
  const [customColor, setCustomColor] = useState(accent)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const [newCode, setNewCode] = useState('')
  const [codeMessage, setCodeMessage] = useState(null)
  const [savingCode, setSavingCode] = useState(false)

  const [resetStep, setResetStep] = useState(0) // 0 = idle, 1 = confirm, 2 = enter code
  const [resetCode2, setResetCode2] = useState('')
  const [resetting, setResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState(null)

  const handleNameBlur = async () => {
    if (name === settings?.cellar_name) return
    await onUpdate({ cellar_name: name || 'Mijn wijnkelder' })
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const url = await onUploadLogo(file)
      await onUpdate({ logo_type: 'upload', logo_url: url })
    } finally {
      setUploadingLogo(false)
    }
  }

  const applyCustomColor = () => {
    if (isValidHex(customColor)) setAccent(customColor)
  }

  const handleSetCode = async (e) => {
    e.preventDefault()
    setSavingCode(true)
    setCodeMessage(null)
    try {
      await setResetCode(newCode)
      setCodeMessage({ type: 'success', text: 'Resetcode ingesteld.' })
      setNewCode('')
    } catch (err) {
      setCodeMessage({ type: 'error', text: err.message })
    } finally {
      setSavingCode(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setResetting(true)
    setResetMessage(null)
    try {
      await resetCellar(resetCode2)
      setResetMessage({ type: 'success', text: 'Je wijnkelder is geleegd. Stel hierboven een nieuwe resetcode in.' })
      setResetStep(0)
      setResetCode2('')
      onResetSuccess?.()
    } catch (err) {
      setResetMessage({ type: 'error', text: err.message })
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Instellingen</h1>
        <p className="text-text-secondary text-sm mt-1">Naam, logo, vormgeving en beheer van je kelder.</p>
      </div>

      <SettingsSection title="Identiteit">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Naam van je wijnkelder</label>
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                className="flex-1 h-11 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {nameSaved && <CheckIcon size={18} className="text-green-600 shrink-0" />}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Logo</label>
            <div className="flex flex-wrap items-center gap-2">
              {LOGO_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => onUpdate({ logo_type: 'default', logo_url: preset.key })}
                  aria-label={preset.label}
                  aria-pressed={settings?.logo_type === 'default' && settings?.logo_url === preset.key}
                  className={`w-11 h-11 rounded-token-md border flex items-center justify-center ${
                    settings?.logo_type === 'default' && settings?.logo_url === preset.key
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-border text-text-secondary'
                  }`}
                >
                  <preset.icon size={18} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => logoInput.current?.click()}
                disabled={uploadingLogo}
                className={`w-11 h-11 rounded-token-md border flex items-center justify-center overflow-hidden ${
                  settings?.logo_type === 'upload' ? 'border-accent' : 'border-dashed border-border-strong text-text-tertiary'
                }`}
                aria-label="Eigen logo uploaden"
              >
                {settings?.logo_type === 'upload' ? (
                  <LogoMark logoType={settings.logo_type} logoUrl={settings.logo_url} size={18} />
                ) : (
                  '+'
                )}
              </button>
              <input ref={logoInput} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Vormgeving">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Thema</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'auto', label: 'Automatisch', icon: AutoIcon },
                { value: 'light', label: 'Licht', icon: SunIcon },
                { value: 'dark', label: 'Donker', icon: MoonIcon },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPreference(opt.value)}
                  aria-pressed={preference === opt.value}
                  className={`h-16 rounded-token-md border flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                    preference === opt.value ? 'border-accent bg-accent-soft text-accent' : 'border-border text-text-secondary'
                  }`}
                >
                  <opt.icon size={17} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Accentkleur</label>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setAccent(preset.value)}
                  aria-label={preset.label}
                  aria-pressed={accent.toLowerCase() === preset.value.toLowerCase()}
                  className="w-9 h-9 rounded-token-full border-2"
                  style={{
                    backgroundColor: preset.value,
                    borderColor: accent.toLowerCase() === preset.value.toLowerCase() ? 'var(--text-primary)' : 'transparent',
                  }}
                />
              ))}
              <div className="flex items-center gap-1.5 ml-1">
                <input
                  type="color"
                  value={isValidHex(customColor) ? customColor : '#641027'}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-9 h-9 rounded-token-md border border-border cursor-pointer bg-transparent"
                  aria-label="Eigen kleur kiezen"
                />
                <button onClick={applyCustomColor} className="text-xs font-medium text-accent">
                  Toepassen
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center justify-between h-11">
            <span className="text-sm font-medium text-text-secondary">Dinerweergave (donkerder, rustiger)</span>
            <button
              onClick={() => setDining(!dining)}
              role="switch"
              aria-checked={dining}
              className={`w-11 h-6 rounded-token-full relative transition-colors ${dining ? 'bg-accent' : 'bg-surface-2 border border-border'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-token-full bg-surface shadow-token-sm transition-transform ${
                  dining ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
        </div>
      </SettingsSection>

      {isAdmin && (
        <SettingsSection title="Gebruikers" description="Wie heeft een wijnkast, rollen en toegang beheren.">
          <button onClick={onOpenAdmin} className="text-sm font-semibold text-accent">
            Open gebruikersbeheer →
          </button>
        </SettingsSection>
      )}

      <SettingsSection title="Wijnkelder resetten" description="Verwijdert al je wijnen. Dit kan niet ongedaan worden gemaakt.">
        <div className="space-y-5">
          <form onSubmit={handleSetCode} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {settings?.has_reset_code ? 'Nieuwe resetcode instellen' : 'Resetcode instellen'}
              </label>
              <input
                type="password"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                minLength={4}
                placeholder="Minstens 4 tekens"
                className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button type="submit" disabled={savingCode} className="h-11 px-4 rounded-token-md border border-border text-sm font-medium text-text-primary">
              {savingCode ? '…' : 'Opslaan'}
            </button>
          </form>
          {codeMessage && (
            <p className={`text-sm rounded-token-md px-3 py-2 ${codeMessage.type === 'success' ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              {codeMessage.text}
            </p>
          )}

          <div className="border-t border-border pt-5">
            {resetStep === 0 && (
              <button
                onClick={() => setResetStep(1)}
                disabled={!settings?.has_reset_code}
                className="text-sm font-semibold text-red-600 disabled:opacity-40"
              >
                Wijnkelder resetten…
              </button>
            )}
            {!settings?.has_reset_code && resetStep === 0 && (
              <p className="text-text-tertiary text-xs mt-1">Stel eerst hierboven een resetcode in.</p>
            )}

            {resetStep === 1 && (
              <div className="bg-red-50 rounded-token-md p-4">
                <p className="text-sm text-red-800">
                  Dit verwijdert <strong>al je wijnen en hun geschiedenis</strong> permanent. Je kelderinstellingen
                  (naam, logo, thema) blijven staan. Weet je het zeker?
                </p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => setResetStep(0)} className="text-sm font-medium text-text-secondary">
                    Annuleren
                  </button>
                  <button onClick={() => setResetStep(2)} className="text-sm font-semibold text-red-600">
                    Ja, ga door
                  </button>
                </div>
              </div>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleReset} className="space-y-3">
                <label className="block text-sm font-medium text-text-secondary">
                  <span className="flex items-center gap-1.5 mb-1">
                    <LockIcon size={14} /> Voer je resetcode in ter bevestiging
                  </span>
                  <input
                    type="password"
                    required
                    value={resetCode2}
                    onChange={(e) => setResetCode2(e.target.value)}
                    className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setResetStep(0)} className="text-sm font-medium text-text-secondary">
                    Annuleren
                  </button>
                  <button type="submit" disabled={resetting} className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 h-10 rounded-token-md">
                    {resetting ? 'Bezig…' : 'Definitief resetten'}
                  </button>
                </div>
              </form>
            )}

            {resetMessage && (
              <p className={`text-sm rounded-token-md px-3 py-2 mt-3 ${resetMessage.type === 'success' ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {resetMessage.text}
              </p>
            )}
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}

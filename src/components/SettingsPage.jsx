import { useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { ACCENT_PRESETS, isValidHex } from '../lib/color'
import { LOGO_PRESETS, LogoMark } from '../lib/logoPresets'
import { setResetCode, resetCellar } from '../lib/cellarApi'
import { downloadWinesCsv } from '../lib/exportUtils'
import ExportReport from './ExportReport'
import PageHeader from './PageHeader'
import {
  SunIcon,
  MoonIcon,
  AutoIcon,
  CheckIcon,
  LockIcon,
  ColorWheelIcon,
  CameraIcon,
  DownloadIcon,
  PrinterIcon,
} from './icons'

function SettingsSection({ title, description, children }) {
  return (
    <section className="border border-border-strong bg-surface p-5">
      <p className="kicker mb-1.5">{title}</p>
      {description && <p className="text-text-secondary text-sm mb-4">{description}</p>}
      {!description && <div className="mb-2" />}
      {children}
    </section>
  )
}

export default function SettingsPage({
  settings,
  onUpdate,
  onUploadLogo,
  onUploadHeroImage,
  onUploadAvatar,
  isAdmin,
  onOpenAdmin,
  onResetSuccess,
  wines = [],
}) {
  const { preference, setPreference, accent, setAccent } = useTheme()
  const logoInput = useRef(null)
  const heroInput = useRef(null)
  const avatarInput = useRef(null)

  const [name, setName] = useState(settings?.cellar_name || 'Mijn wijnkelder')
  const [nameSaved, setNameSaved] = useState(false)
  const [displayName, setDisplayName] = useState(settings?.display_name || '')
  const [displayNameSaved, setDisplayNameSaved] = useState(false)
  const [customColor, setCustomColor] = useState(accent)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

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

  const handleDisplayNameBlur = async () => {
    if (displayName === (settings?.display_name || '')) return
    await onUpdate({ display_name: displayName.trim() })
    setDisplayNameSaved(true)
    setTimeout(() => setDisplayNameSaved(false), 2000)
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

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHero(true)
    try {
      const url = await onUploadHeroImage(file)
      await onUpdate({ hero_image_url: url })
    } finally {
      setUploadingHero(false)
      if (heroInput.current) heroInput.current.value = ''
    }
  }

  const handleRemoveHero = async () => {
    await onUpdate({ hero_image_url: null })
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const url = await onUploadAvatar(file)
      await onUpdate({ avatar_url: url })
    } finally {
      setUploadingAvatar(false)
      if (avatarInput.current) avatarInput.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    await onUpdate({ avatar_url: null })
  }

  const handleCustomColorChange = (hex) => {
    setCustomColor(hex)
    if (isValidHex(hex)) setAccent(hex)
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
    <div className="space-y-6 w-full">
      <PageHeader eyebrow="Naam, vormgeving en beheer" title="Instellingen" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-stretch">
      <SettingsSection title="Identiteit">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Profielfoto</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => avatarInput.current?.click()}
                disabled={uploadingAvatar}
                aria-label={settings?.avatar_url ? 'Andere profielfoto kiezen' : 'Profielfoto uploaden'}
                className="w-16 h-16 rounded-token-full border border-dashed border-border-strong flex items-center justify-center overflow-hidden shrink-0 text-text-tertiary disabled:opacity-50"
              >
                {settings?.avatar_url ? (
                  <img src={settings.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <CameraIcon size={20} />
                )}
              </button>
              <div className="flex flex-col items-start gap-1">
                <button
                  type="button"
                  onClick={() => avatarInput.current?.click()}
                  disabled={uploadingAvatar}
                  className="text-sm font-medium text-accent-soft-text disabled:opacity-50"
                >
                  {uploadingAvatar ? 'Bezig met uploaden…' : settings?.avatar_url ? 'Andere foto kiezen' : 'Foto uploaden'}
                </button>
                {settings?.avatar_url && (
                  <button type="button" onClick={handleRemoveAvatar} className="text-sm font-medium text-text-secondary">
                    Verwijderen
                  </button>
                )}
              </div>
              <input ref={avatarInput} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
            <p className="text-text-tertiary text-xs mt-2">Te zien in het accountmenu en je welkomstscherm.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Jouw naam</label>
            <div className="flex items-center gap-2">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={handleDisplayNameBlur}
                placeholder="Bijv. Delano"
                className="flex-1 h-11 rounded-token-md border border-border bg-surface px-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {displayNameSaved && <CheckIcon size={18} className="text-success shrink-0" />}
            </div>
            <p className="text-text-tertiary text-xs mt-1">Wordt gebruikt in je welkomstscherm.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Naam van je wijnkelder</label>
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                className="flex-1 h-11 rounded-token-md border border-border bg-surface px-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {nameSaved && <CheckIcon size={18} className="text-success shrink-0" />}
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
                      ? 'border-accent-soft-text bg-accent-soft text-accent-soft-text'
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
                    preference === opt.value
                      ? 'border-accent-soft-text bg-accent-soft text-accent-soft-text'
                      : 'border-border text-text-secondary'
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
              <div
                className="relative w-9 h-9 rounded-token-md border border-border overflow-hidden flex items-center justify-center text-text-secondary shrink-0"
                title="Eigen kleur kiezen"
              >
                <ColorWheelIcon size={20} />
                <input
                  type="color"
                  value={isValidHex(customColor) ? customColor : '#641027'}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Eigen kleur kiezen"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <div className="lg:col-span-2">
        <SettingsSection
          title="Achtergrondfoto dashboard"
          description="De foto boven je overzicht, met 'Welkom' erop. Zonder eigen foto gebruiken we de meegeleverde standaardfoto."
        >
          <div className="space-y-3">
            <div className="relative h-36 sm:h-48 rounded-token-md overflow-hidden border border-border bg-surface-2">
              <img
                src={settings?.hero_image_url || '/hero-default.jpg'}
                alt="Achtergrondfoto van je dashboard"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => heroInput.current?.click()}
                disabled={uploadingHero}
                className="h-10 px-4 rounded-token-md border border-border text-sm font-medium text-text-primary disabled:opacity-50"
              >
                {uploadingHero ? 'Bezig met uploaden…' : settings?.hero_image_url ? 'Andere foto kiezen' : 'Eigen foto uploaden'}
              </button>
              {settings?.hero_image_url && (
                <button type="button" onClick={handleRemoveHero} className="text-sm font-medium text-text-secondary">
                  Standaardfoto herstellen
                </button>
              )}
              <input ref={heroInput} type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="lg:col-span-2">
        <SettingsSection title="Exporteren" description="Een kopie van je collectie, voor eigen administratie of back-up.">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => downloadWinesCsv(wines, `${(settings?.cellar_name || 'wijnkelder').toLowerCase().replace(/\s+/g, '-')}.csv`)}
              className="h-11 px-4 rounded-token-md border border-border text-sm font-medium text-text-primary flex items-center gap-2"
            >
              <DownloadIcon size={15} /> CSV downloaden
            </button>
            <button
              onClick={() => window.print()}
              className="h-11 px-4 rounded-token-md border border-border text-sm font-medium text-text-primary flex items-center gap-2"
            >
              <PrinterIcon size={15} /> Printen / PDF
            </button>
          </div>
        </SettingsSection>
        <ExportReport wines={wines} cellarName={settings?.cellar_name || 'Mijn wijnkelder'} />
      </div>

      {isAdmin && (
        <SettingsSection title="Gebruikers" description="Wie heeft een wijnkast, rollen en toegang beheren.">
          <button onClick={onOpenAdmin} className="text-sm font-semibold text-accent-soft-text">
            Open gebruikersbeheer →
          </button>
        </SettingsSection>
      )}
      </div>

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
                className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button type="submit" disabled={savingCode} className="h-11 px-4 rounded-token-md border border-border text-sm font-medium text-text-primary">
              {savingCode ? '…' : 'Opslaan'}
            </button>
          </form>
          {codeMessage && (
            <p className={`text-sm rounded-token-md px-3 py-2 ${codeMessage.type === 'success' ? 'text-success bg-success-bg' : 'text-danger-text bg-danger-bg'}`}>
              {codeMessage.text}
            </p>
          )}

          <div className="border-t border-border pt-5">
            {resetStep === 0 && (
              <button
                onClick={() => setResetStep(1)}
                disabled={!settings?.has_reset_code}
                className="text-sm font-semibold text-danger-text disabled:opacity-40"
              >
                Wijnkelder resetten…
              </button>
            )}
            {!settings?.has_reset_code && resetStep === 0 && (
              <p className="text-text-tertiary text-xs mt-1">Stel eerst hierboven een resetcode in.</p>
            )}

            {resetStep === 1 && (
              <div className="bg-danger-bg rounded-token-md p-4">
                <p className="text-sm text-danger-text">
                  Dit verwijdert <strong>al je wijnen en hun geschiedenis</strong> permanent. Je kelderinstellingen
                  (naam, logo, thema) blijven staan. Weet je het zeker?
                </p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => setResetStep(0)} className="text-sm font-medium text-text-secondary">
                    Annuleren
                  </button>
                  <button onClick={() => setResetStep(2)} className="text-sm font-semibold text-danger-text">
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
                    className="w-full h-11 rounded-token-md border border-border bg-surface px-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setResetStep(0)} className="text-sm font-medium text-text-secondary">
                    Annuleren
                  </button>
                  <button type="submit" disabled={resetting} className="text-sm font-semibold text-white bg-danger hover:bg-danger-hover px-4 h-10 rounded-token-md">
                    {resetting ? 'Bezig…' : 'Definitief resetten'}
                  </button>
                </div>
              </form>
            )}

            {resetMessage && (
              <p className={`text-sm rounded-token-md px-3 py-2 mt-3 ${resetMessage.type === 'success' ? 'text-success bg-success-bg' : 'text-danger-text bg-danger-bg'}`}>
                {resetMessage.text}
              </p>
            )}
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}

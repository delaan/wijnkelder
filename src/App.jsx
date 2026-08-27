import { lazy, Suspense, useState } from 'react'
import { supabaseConfigured } from './lib/supabaseClient'
import { useAuth } from './hooks/useAuth'
import { useWines } from './hooks/useWines'
import { useProfile } from './hooks/useProfile'
import { useCellarSettings } from './hooks/useCellarSettings'
import { useWishlist } from './hooks/useWishlist'
import { ThemeProvider } from './context/ThemeContext'
import SetupNotice from './components/SetupNotice'
import Auth from './components/Auth'
import AppShell from './components/layout/AppShell'
import Dashboard from './components/Dashboard'
import Collection from './components/Collection'
import GuestMode from './components/GuestMode'
import SettingsPage from './components/SettingsPage'
import AddWineModal from './components/AddWineModal'
import WineForm from './components/WineForm'
import WineDetailSheet from './components/WineDetailSheet'
import ConfirmDialog from './components/ConfirmDialog'
import Toast from './components/Toast'
import WelcomeScreen from './components/WelcomeScreen'
import SearchBar from './components/SearchBar'
import Spinner from './components/Spinner'
import History from './components/History'
import Wishlist from './components/Wishlist'
import CellarMap from './components/CellarMap'

// Zelden bezochte schermen (eenmalige onboarding, alleen-voor-beheerders
// gebruikersbeheer) worden pas opgehaald zodra ze echt nodig zijn, in
// plaats van standaard in de hoofdbundel te zitten die iedereen bij elk
// bezoek moet downloaden.
const Onboarding = lazy(() => import('./components/Onboarding'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))

const WELCOME_KEY = 'wijnkast-welcomed'
const VIEW_TITLES = {
  dashboard: 'Mijn kelder',
  collection: 'Collectie',
  favorites: 'Favorieten',
  history: 'Geschiedenis',
  wishlist: 'Verlanglijst',
  cellarmap: 'Kelderkaart',
  settings: 'Instellingen',
  admin: 'Beheer gebruikers',
}

export default function App() {
  if (!supabaseConfigured) return <SetupNotice />
  return <Root />
}

function Root() {
  const { user, loading: authLoading, signOut } = useAuth()
  return (
    <ThemeProvider userId={user?.id}>
      {authLoading ? <FullPageLoader /> : !user ? <Auth /> : <WineApp user={user} signOut={signOut} />}
    </ThemeProvider>
  )
}

function WineApp({ user, signOut }) {
  const wines = useWines(user.id)
  const { isAdmin } = useProfile(user.id)
  const cellarSettings = useCellarSettings(user.id)
  const wishlist = useWishlist(user.id)

  const [view, setView] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [welcomed, setWelcomed] = useState(() => {
    try {
      return sessionStorage.getItem(WELCOME_KEY) === '1'
    } catch {
      return false
    }
  })

  const markWelcomed = () => {
    try {
      sessionStorage.setItem(WELCOME_KEY, '1')
    } catch {
      // sessionStorage kan geblokkeerd zijn — dan zie je het welkomstscherm iets vaker, geen probleem.
    }
    setWelcomed(true)
  }

  const handleSearch = (value) => {
    setSearch(value)
    if (view === 'dashboard' && value) setView('collection')
  }

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingWine, setEditingWine] = useState(null)
  const [viewingWine, setViewingWine] = useState(null)
  const [viewingIsGuest, setViewingIsGuest] = useState(false)
  const [deletingWine, setDeletingWine] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [convertingItem, setConvertingItem] = useState(null) // verlanglijst-item dat naar de kelder wordt overgezet

  const openDetail = (wine, isGuest = false) => {
    setViewingWine(wine)
    setViewingIsGuest(isGuest)
  }

  const handleSaveWine = async (payload) => {
    if (editingWine) await wines.updateWine(editingWine.id, payload)
    else await wines.addWine(payload)
    setEditingWine(null)
  }

  const handleToggleFavorite = async (wine) => {
    const updated = await wines.toggleFavorite(wine)
    if (viewingWine?.id === updated.id) setViewingWine(updated)
  }

  const handleUncork = async (wine, count, options) => {
    const result = await wines.uncork(wine, count, options)
    if (result) {
      setViewingWine(result.wine)
      setToast({
        message: `${count} fles${count > 1 ? 'sen' : ''} van "${wine.name}" ontkurkt.`,
        undo: () => handleUndo(result.event),
      })
    }
  }

  const handleUndo = async (event) => {
    const updated = await wines.undoEvent(event)
    if (updated && viewingWine?.id === updated.id) setViewingWine(updated)
  }

  // Alleen bekende WineForm-velden overnemen — het verlanglijst-item heeft
  // ook kolommen (bv. target_price, notes) die niet op de wines-tabel
  // bestaan, en die zouden de insert laten mislukken als we ze meesturen.
  const wishlistPrefill = convertingItem && {
    name: convertingItem.name,
    producer: convertingItem.producer || '',
    vintage: convertingItem.vintage || '',
    region: convertingItem.region || '',
    country: convertingItem.country || '',
    grape_varieties: convertingItem.grape_varieties || '',
    color: convertingItem.color || 'rood',
    tasting_notes: convertingItem.notes || '',
    quantity: 1,
  }

  const handleSaveConvertedWine = async (payload) => {
    await wines.addWine(payload)
    await wishlist.deleteItem(convertingItem.id)
    setConvertingItem(null)
  }

  const confirmDelete = async () => {
    setDeleteBusy(true)
    try {
      await wines.deleteWine(deletingWine.id)
      setDeletingWine(null)
      setViewingWine(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  const cellarName = cellarSettings.settings?.cellar_name || 'Mijn wijnkelder'
  const displayName = cellarSettings.settings?.display_name
  const logoType = cellarSettings.settings?.logo_type
  const logoUrl = cellarSettings.settings?.logo_url
  const avatarUrl = cellarSettings.settings?.avatar_url
  const needsOnboarding = !cellarSettings.loading && !cellarSettings.settings?.onboarding_completed

  const overlays = (
    <>
      {viewingWine && (
        <WineDetailSheet
          wine={viewingWine}
          onClose={() => setViewingWine(null)}
          onToggleFavorite={viewingIsGuest ? null : handleToggleFavorite}
          onUncork={handleUncork}
          hidePrivate={viewingIsGuest}
          onEdit={(w) => {
            setViewingWine(null)
            setEditingWine(w)
          }}
          onDelete={(w) => {
            setViewingWine(null)
            setDeletingWine(w)
          }}
        />
      )}

      {addModalOpen && (
        <AddWineModal
          onSave={handleSaveWine}
          onClose={() => setAddModalOpen(false)}
          onUploadPhoto={wines.uploadLabelPhoto}
          userId={user.id}
        />
      )}

      {editingWine && (
        <WineForm
          wine={editingWine}
          onSave={handleSaveWine}
          onClose={() => setEditingWine(null)}
          onUploadPhoto={wines.uploadLabelPhoto}
          userId={user.id}
        />
      )}

      {convertingItem && (
        <WineForm
          wine={wishlistPrefill}
          onSave={handleSaveConvertedWine}
          onClose={() => setConvertingItem(null)}
          onUploadPhoto={wines.uploadLabelPhoto}
          userId={user.id}
          title="Toevoegen aan kelder"
        />
      )}

      {deletingWine && (
        <ConfirmDialog
          title="Wijn verwijderen"
          message={`Weet je zeker dat je "${deletingWine.name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingWine(null)}
          busy={deleteBusy}
        />
      )}

      {toast && <Toast message={toast.message} onUndo={toast.undo} onDismiss={() => setToast(null)} />}
    </>
  )

  if (cellarSettings.loading || wines.loading) {
    return <FullPageLoader />
  }

  if (needsOnboarding) {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <Onboarding settings={cellarSettings.settings} onComplete={cellarSettings.update} />
      </Suspense>
    )
  }

  if (!welcomed) {
    return (
      <WelcomeScreen
        name={displayName}
        cellarName={cellarName}
        logoType={logoType}
        logoUrl={logoUrl}
        avatarUrl={avatarUrl}
        onDone={markWelcomed}
      />
    )
  }

  if (view === 'guest') {
    return (
      <>
        <GuestMode
          wines={wines.wines}
          cellarName={cellarName}
          logoType={logoType}
          logoUrl={logoUrl}
          heroImageUrl={cellarSettings.settings?.hero_image_url}
          onOpenWine={(w) => openDetail(w, true)}
          onExit={() => setView('dashboard')}
        />
        {overlays}
      </>
    )
  }

  const showSearchBar = view === 'dashboard' || view === 'collection' || view === 'favorites'

  return (
    <>
      <AppShell
        view={view}
        onNavigate={setView}
        cellarName={cellarName}
        logoType={logoType}
        logoUrl={logoUrl}
        title={VIEW_TITLES[view]}
        onAdd={() => setAddModalOpen(true)}
        email={user.email}
        avatarUrl={avatarUrl}
        onSignOut={signOut}
      >
        {wines.error && showSearchBar && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-token-md bg-danger-bg text-danger-text text-sm px-4 py-3">
            <span>Je wijnen konden niet worden opgehaald: {wines.error}</span>
            <button onClick={() => wines.refetch()} className="font-semibold shrink-0">
              Opnieuw proberen
            </button>
          </div>
        )}
        {view === 'dashboard' && (
          <Dashboard
            wines={wines.wines}
            onOpenWine={openDetail}
            onToggleFavorite={handleToggleFavorite}
            onGoToCollection={() => setView('collection')}
            displayName={displayName}
            heroImageUrl={cellarSettings.settings?.hero_image_url}
          />
        )}
        {view === 'collection' && (
          <Collection wines={wines.wines} search={search} onOpenWine={openDetail} onToggleFavorite={handleToggleFavorite} />
        )}
        {view === 'favorites' && (
          <Collection
            wines={wines.wines.filter((w) => w.is_favorite)}
            search={search}
            onOpenWine={openDetail}
            onToggleFavorite={handleToggleFavorite}
            showFavoritesToggle={false}
          />
        )}
        {view === 'history' && <History userId={user.id} />}
        {view === 'wishlist' && (
          <Wishlist
            items={wishlist.items}
            loading={wishlist.loading}
            error={wishlist.error}
            onAddItem={wishlist.addItem}
            onDeleteItem={(item) => wishlist.deleteItem(item.id)}
            onConvert={setConvertingItem}
          />
        )}
        {view === 'cellarmap' && <CellarMap userId={user.id} wines={wines.wines} onOpenWine={openDetail} />}
        {view === 'settings' && (
          <SettingsPage
            settings={cellarSettings.settings}
            onUpdate={cellarSettings.update}
            onUploadLogo={cellarSettings.uploadLogo}
            onUploadHeroImage={cellarSettings.uploadHeroImage}
            onUploadAvatar={cellarSettings.uploadAvatar}
            isAdmin={isAdmin}
            onOpenAdmin={() => setView('admin')}
            onResetSuccess={() => {
              wines.refetch({ silent: true })
              cellarSettings.refetch({ silent: true })
            }}
            wines={wines.wines}
            onOpenHistory={() => setView('history')}
            onOpenWishlist={() => setView('wishlist')}
            onOpenCellarMap={() => setView('cellarmap')}
          />
        )}
        {view === 'admin' && (
          <Suspense fallback={<div className="flex justify-center py-16"><Spinner /></div>}>
            <AdminPanel currentUserId={user.id} onBack={() => setView('settings')} />
          </Suspense>
        )}
      </AppShell>
      {showSearchBar && <SearchBar value={search} onChange={handleSearch} />}
      {overlays}
    </>
  )
}

function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Spinner size={22} />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { supabaseConfigured } from './lib/supabaseClient'
import { useAuth } from './hooks/useAuth'
import { useWines } from './hooks/useWines'
import SetupNotice from './components/SetupNotice'
import Auth from './components/Auth'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import Filters from './components/Filters'
import WineCard from './components/WineCard'
import WineForm from './components/WineForm'
import ConfirmDialog from './components/ConfirmDialog'
import EmptyState from './components/EmptyState'

export default function App() {
  if (!supabaseConfigured) return <SetupNotice />
  return <AuthenticatedApp />
}

function AuthenticatedApp() {
  const { user, loading: authLoading, signOut } = useAuth()

  if (authLoading) return <FullPageLoader />
  if (!user) return <Auth />

  return <WineApp user={user} signOut={signOut} />
}

function WineApp({ user, signOut }) {
  const { wines, loading, addWine, updateWine, deleteWine, uploadLabelPhoto } = useWines(user.id)

  const [search, setSearch] = useState('')
  const [color, setColor] = useState('')
  const [sort, setSort] = useState('recent')
  const [formOpen, setFormOpen] = useState(false)
  const [editingWine, setEditingWine] = useState(null)
  const [deletingWine, setDeletingWine] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const filteredWines = useMemo(() => {
    let result = wines
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((w) =>
        [w.name, w.producer, w.grape_varieties, w.region, w.country]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      )
    }
    if (color) result = result.filter((w) => w.color === color)

    const sorted = [...result]
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'vintage_desc':
        sorted.sort((a, b) => (b.vintage || 0) - (a.vintage || 0))
        break
      case 'vintage_asc':
        sorted.sort((a, b) => (a.vintage || 0) - (b.vintage || 0))
        break
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        break
    }
    return sorted
  }, [wines, search, color, sort])

  const openAdd = () => {
    setEditingWine(null)
    setFormOpen(true)
  }
  const openEdit = (wine) => {
    setEditingWine(wine)
    setFormOpen(true)
  }
  const closeForm = () => {
    setFormOpen(false)
    setEditingWine(null)
  }

  const handleSave = async (payload) => {
    if (editingWine) {
      await updateWine(editingWine.id, payload)
    } else {
      await addWine(payload)
    }
  }

  const confirmDelete = async () => {
    setDeleteBusy(true)
    try {
      await deleteWine(deletingWine.id)
      setDeletingWine(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header email={user.email} onSignOut={signOut} onAdd={openAdd} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <StatsBar wines={wines} />

        <Filters search={search} onSearch={setSearch} color={color} onColor={setColor} sort={sort} onSort={setSort} />

        {loading ? (
          <FullPageLoader inline />
        ) : filteredWines.length === 0 ? (
          <EmptyState hasFilters={Boolean(search || color)} onAdd={openAdd} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWines.map((wine) => (
              <WineCard key={wine.id} wine={wine} onEdit={openEdit} onDelete={setDeletingWine} />
            ))}
          </div>
        )}
      </main>

      {formOpen && (
        <WineForm wine={editingWine} onSave={handleSave} onClose={closeForm} onUploadPhoto={uploadLabelPhoto} />
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
    </div>
  )
}

function FullPageLoader({ inline }) {
  const content = (
    <div className="flex items-center gap-2 text-stone-400 text-sm">
      <span className="w-4 h-4 border-2 border-wine-700 border-t-transparent rounded-full animate-spin" />
      Laden…
    </div>
  )
  if (inline) return <div className="py-16 flex justify-center">{content}</div>
  return <div className="min-h-screen flex items-center justify-center bg-stone-50">{content}</div>
}

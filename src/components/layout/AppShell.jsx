import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function AppShell({
  view,
  onNavigate,
  cellarName,
  logoUrl,
  search,
  onSearch,
  showSearch,
  onAdd,
  email,
  onSignOut,
  children,
}) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar view={view} onNavigate={onNavigate} cellarName={cellarName} logoUrl={logoUrl} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          search={search}
          onSearch={onSearch}
          showSearch={showSearch}
          onAdd={onAdd}
          email={email}
          onSignOut={onSignOut}
        />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 md:pb-6 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      <BottomNav view={view} onNavigate={onNavigate} />
    </div>
  )
}

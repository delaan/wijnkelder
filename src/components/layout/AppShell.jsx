import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function AppShell({
  view,
  onNavigate,
  cellarName,
  logoType,
  logoUrl,
  title,
  onAdd,
  email,
  onSignOut,
  children,
}) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar view={view} onNavigate={onNavigate} cellarName={cellarName} logoType={logoType} logoUrl={logoUrl} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar title={title} onAdd={onAdd} email={email} onSignOut={onSignOut} />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-32 md:pb-24 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      <BottomNav view={view} onNavigate={onNavigate} />
    </div>
  )
}

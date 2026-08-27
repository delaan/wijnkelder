import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

// Bovenin loopt de balk (logo + titel + acties) over de volle breedte door;
// daaronder splitst het in de zijbalk (desktop) en de hoofdinhoud.
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
    <div className="min-h-screen bg-bg flex flex-col">
      <TopBar
        title={title}
        cellarName={cellarName}
        logoType={logoType}
        logoUrl={logoUrl}
        onAdd={onAdd}
        email={email}
        onSignOut={onSignOut}
      />

      <div className="flex-1 flex min-w-0">
        <Sidebar view={view} onNavigate={onNavigate} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 pb-40 md:pb-28 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      <BottomNav view={view} onNavigate={onNavigate} />
    </div>
  )
}

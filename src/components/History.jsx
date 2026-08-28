import { useWineEvents } from '../hooks/useWineEvents'
import { colorDot, formatDate } from '../lib/wineHelpers'
import { HistoryIcon, WineGlassIcon } from './icons'
import StarRating from './StarRating'
import Spinner from './Spinner'

const TYPE_LABEL = {
  add: 'Toegevoegd',
  correct: 'Aangepast',
  uncork: 'Ontkurkt',
  undo: 'Ongedaan gemaakt',
}

function EventRow({ event }) {
  const wine = event.wine
  const delta = event.quantity_delta
  return (
    <div className="flex items-start gap-3 py-3.5 px-1">
      <span className="w-10 h-10 rounded-token-md bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
        {wine?.label_photo_url ? (
          <img src={wine.label_photo_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="w-2 h-6 rounded-token-full opacity-80" style={{ backgroundColor: colorDot(wine?.color) }} />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-text-primary truncate">{wine?.name || 'Verwijderde wijn'}</p>
          <span className={`text-sm font-medium shrink-0 ${delta < 0 ? 'text-danger-text' : 'text-success'}`}>
            {delta > 0 ? '+' : ''}
            {delta}
          </span>
        </div>
        <p className="text-text-tertiary text-xs mt-0.5">
          {TYPE_LABEL[event.type] || event.type} · {formatDate(event.created_at)}
        </p>
        {(event.occasion_rating || event.note) && (
          <div className="mt-1.5 space-y-1">
            {event.occasion_rating > 0 && <StarRating value={event.occasion_rating} size={13} />}
            {event.note && <p className="text-text-secondary text-sm">{event.note}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function History({ userId }) {
  const { events, loading, error } = useWineEvents(userId)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
          <HistoryIcon size={22} className="text-accent-soft-text" /> Geschiedenis
        </h1>
        <p className="text-text-secondary text-sm mt-1">Alles wat je hebt toegevoegd, aangepast en ontkurkt.</p>
      </div>

      <div className="bg-surface border border-border rounded-token-lg px-3">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-danger-text text-sm px-2 py-6">Geschiedenis kon niet worden opgehaald: {error}</p>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <WineGlassIcon size={28} className="text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary text-sm">Nog niks om te laten zien.</p>
            <p className="text-text-tertiary text-xs mt-1">Zodra je wijnen toevoegt of ontkurkt, verschijnt dat hier.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

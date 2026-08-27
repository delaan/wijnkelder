import { useWineEvents } from '../hooks/useWineEvents'
import { colorDot, formatDate } from '../lib/wineHelpers'
import { WineGlassIcon } from './icons'
import StarRating from './StarRating'
import Spinner from './Spinner'
import PageHeader from './PageHeader'

const TYPE_LABEL = {
  add: 'Toegevoegd',
  correct: 'Aangepast',
  uncork: 'Ontkurkt',
  undo: 'Ongedaan gemaakt',
}

function EventRow({ event }) {
  const wine = event.wine
  const delta = event.quantity_delta
  const isUncork = event.type === 'uncork'
  return (
    <div className="grid grid-cols-[96px_20px_1fr] gap-0 pb-6">
      <span className="byline pt-0.5">{formatDate(event.created_at)}</span>
      <div className="flex justify-center">
        <span
          className="w-[9px] h-[9px] rounded-full mt-1.5"
          style={{ backgroundColor: isUncork ? colorDot(wine?.color) : 'var(--text-tertiary)' }}
        />
      </div>
      <div className="min-w-0">
        <p className="font-serif font-semibold text-text-primary text-[17px] flex items-center gap-2 flex-wrap">
          {TYPE_LABEL[event.type] || event.type} — {wine?.name || 'Verwijderde wijn'}
          <span className={`text-sm font-sans font-medium ${delta < 0 ? 'text-danger-text' : 'text-success'}`}>
            {delta > 0 ? '+' : ''}
            {delta}
          </span>
        </p>
        {(event.occasion_rating || event.note) && (
          <p className="text-text-secondary text-sm mt-1">
            {event.note}
            {event.occasion_rating > 0 && (
              <span className="ml-1.5 inline-block align-middle">
                <StarRating value={event.occasion_rating} size={13} />
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

export default function History({ userId }) {
  const { events, loading, error } = useWineEvents(userId)

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Wat er is toegevoegd en ontkurkt" title="Geschiedenis" />

      {loading ? (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-danger-text text-sm">Geschiedenis kon niet worden opgehaald: {error}</p>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <WineGlassIcon size={28} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Nog niks om te laten zien.</p>
          <p className="text-text-tertiary text-xs mt-1">Zodra je wijnen toevoegt of ontkurkt, verschijnt dat hier.</p>
        </div>
      ) : (
        <div className="max-w-2xl">
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

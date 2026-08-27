import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Kelderlogboek: alle voorraadgebeurtenissen (toegevoegd/aangepast/
// ontkurkt/ongedaan gemaakt), inclusief naam en foto van de wijn — die
// wordt er via Supabase's relatie-syntax meteen bij opgehaald, zodat we
// niet apart door de wijnenlijst hoeven te zoeken (en het ook nog klopt
// voor een wijn die je inmiddels hebt verwijderd).
export function useWineEvents(userId) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('wine_events')
      .select('*, wine:wines(name, label_photo_url, color)')
      .order('created_at', { ascending: false })
      .limit(200)
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setEvents(data)
      setError(null)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return { events, loading, error, refetch: fetchEvents }
}

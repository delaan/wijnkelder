import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Zones/rekken voor de kelderkaart: elke zone heeft een eigen rooster
// (rijen x kolommen) waarin wijnen een plek kunnen krijgen.
export function useCellarZones(userId) {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchZones = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('cellar_zones')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setZones(data)
      setError(null)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchZones()
  }, [fetchZones])

  const addZone = async (zone) => {
    const { data, error: insertError } = await supabase
      .from('cellar_zones')
      .insert([{ ...zone, user_id: userId }])
      .select()
    if (insertError) throw insertError
    setZones((prev) => [...prev, data[0]])
    return data[0]
  }

  const updateZone = async (id, updates) => {
    const { data, error: updateError } = await supabase
      .from('cellar_zones')
      .update(updates)
      .eq('id', id)
      .select()
    if (updateError) throw updateError
    setZones((prev) => prev.map((z) => (z.id === id ? data[0] : z)))
    return data[0]
  }

  const deleteZone = async (id) => {
    const { error: deleteError } = await supabase.from('cellar_zones').delete().eq('id', id)
    if (deleteError) throw deleteError
    setZones((prev) => prev.filter((z) => z.id !== id))
  }

  return { zones, loading, error, addZone, updateZone, deleteZone, refetch: fetchZones }
}

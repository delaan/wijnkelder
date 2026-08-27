import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useWines(userId) {
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // `silent: true` ververst de data op de achtergrond zonder de hele app
  // terug te zetten naar het volledige-paginaspinner-scherm — alleen de
  // allereerste keer laden (bij het openen van de app) mag dat.
  const fetchWines = useCallback(async ({ silent = false } = {}) => {
    if (!userId) return
    if (!silent) setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('wines')
      .select('*')
      .order('created_at', { ascending: false })
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setWines(data)
      setError(null)
    }
    if (!silent) setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchWines()
  }, [fetchWines])

  const addWine = async (wine) => {
    const { data, error: insertError } = await supabase
      .from('wines')
      .insert([{ ...wine, user_id: userId }])
      .select()
    if (insertError) throw insertError
    setWines((prev) => [data[0], ...prev])
    return data[0]
  }

  const updateWine = async (id, updates) => {
    const { data, error: updateError } = await supabase
      .from('wines')
      .update(updates)
      .eq('id', id)
      .select()
    if (updateError) throw updateError
    setWines((prev) => prev.map((w) => (w.id === id ? data[0] : w)))
    return data[0]
  }

  const deleteWine = async (id) => {
    const { error: deleteError } = await supabase.from('wines').delete().eq('id', id)
    if (deleteError) throw deleteError
    setWines((prev) => prev.filter((w) => w.id !== id))
  }

  const uploadLabelPhoto = async (file) => {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('wine-labels').upload(path, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('wine-labels').getPublicUrl(path)
    return data.publicUrl
  }

  const toggleFavorite = async (wine) => {
    const { data, error: updateError } = await supabase
      .from('wines')
      .update({ is_favorite: !wine.is_favorite })
      .eq('id', wine.id)
      .select()
    if (updateError) throw updateError
    setWines((prev) => prev.map((w) => (w.id === wine.id ? data[0] : w)))
    return data[0]
  }

  // Ontkurkt `count` flessen: verlaagt de voorraad en logt een gebeurtenis,
  // zodat dit betrouwbaar ongedaan te maken is via undoEvent().
  const uncork = async (wine, count) => {
    const amount = Math.min(count, wine.quantity)
    if (amount <= 0) return null
    const newQuantity = wine.quantity - amount
    const { data, error: updateError } = await supabase
      .from('wines')
      .update({ quantity: newQuantity })
      .eq('id', wine.id)
      .select()
    if (updateError) throw updateError

    const { data: eventData, error: eventError } = await supabase
      .from('wine_events')
      .insert([{ wine_id: wine.id, user_id: userId, type: 'uncork', quantity_delta: -amount }])
      .select()
    if (eventError) throw eventError

    setWines((prev) => prev.map((w) => (w.id === wine.id ? data[0] : w)))
    return { wine: data[0], event: eventData[0] }
  }

  const undoEvent = async (event) => {
    const wine = wines.find((w) => w.id === event.wine_id)
    if (!wine) return null
    // event.quantity_delta was negative (bv. -2 bij het ontkurken van 2 flessen);
    // ongedaan maken betekent die verandering terugdraaien.
    const restoredQuantity = wine.quantity - event.quantity_delta
    const { data, error: updateError } = await supabase
      .from('wines')
      .update({ quantity: restoredQuantity })
      .eq('id', wine.id)
      .select()
    if (updateError) throw updateError

    await supabase
      .from('wine_events')
      .insert([{ wine_id: wine.id, user_id: userId, type: 'undo', quantity_delta: -event.quantity_delta }])

    setWines((prev) => prev.map((w) => (w.id === wine.id ? data[0] : w)))
    return data[0]
  }

  return {
    wines,
    loading,
    error,
    addWine,
    updateWine,
    deleteWine,
    uploadLabelPhoto,
    toggleFavorite,
    uncork,
    undoEvent,
    refetch: fetchWines,
  }
}

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useWines(userId) {
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWines = useCallback(async () => {
    if (!userId) return
    setLoading(true)
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
    setLoading(false)
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

  return { wines, loading, error, addWine, updateWine, deleteWine, uploadLabelPhoto, refetch: fetchWines }
}

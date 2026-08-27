import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Verlanglijst: wijnen die je nog wil kopen, los van je huidige voorraad.
export function useWishlist(userId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('wishlist_items')
      .select('*')
      .order('created_at', { ascending: false })
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setItems(data)
      setError(null)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (item) => {
    const { data, error: insertError } = await supabase
      .from('wishlist_items')
      .insert([{ ...item, user_id: userId }])
      .select()
    if (insertError) throw insertError
    setItems((prev) => [data[0], ...prev])
    return data[0]
  }

  const deleteItem = async (id) => {
    const { error: deleteError } = await supabase.from('wishlist_items').delete().eq('id', id)
    if (deleteError) throw deleteError
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return { items, loading, error, addItem, deleteItem, refetch: fetchItems }
}

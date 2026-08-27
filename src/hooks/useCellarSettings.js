import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useCellarSettings(userId) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase.from('cellar_settings_public').select('*').eq('user_id', userId).single()
    setSettings(data || null)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const uploadLogo = async (file) => {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('cellar-logos').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('cellar-logos').getPublicUrl(path)
    return data.publicUrl
  }

  const uploadHeroImage = async (file) => {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('cellar-hero').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('cellar-hero').getPublicUrl(path)
    return data.publicUrl
  }

  const update = async (patch) => {
    const { data, error } = await supabase
      .from('cellar_settings')
      .upsert({ user_id: userId, ...patch }, { onConflict: 'user_id' })
      .select()
    if (error) throw error
    await refetch()
    return data?.[0]
  }

  return { settings, loading, refetch, update, uploadLogo, uploadHeroImage }
}

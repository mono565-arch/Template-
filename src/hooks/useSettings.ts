import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import type { RestaurantSettings } from '../services/api'

const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'Pizza Saucy',
  phone: '+92 300 1234567',
  email: 'info@pizzasaucy.com',
  address: '123 Pizza Lane, Gulberg III, Lahore',
  mapUrl: 'https://maps.google.com/?q=123+Pizza+Lane+Lahore',  // ✅ ADDED
  deliveryFee: 150,
  minOrderAmount: 500,
  taxRate: 0,
}

const SETTINGS_DOC = doc(db, 'settings', 'restaurant')

export const useSettings = () => {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Real-time listener (read)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      SETTINGS_DOC,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() as RestaurantSettings })
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Settings listener error:', err)
        setError('Failed to load settings')
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  // Update full settings object
  const updateSettings = useCallback(async (newSettings: Partial<RestaurantSettings>) => {
    setSaving(true)
    setError(null)
    try {
      await setDoc(SETTINGS_DOC, newSettings, { merge: true })
      return true
    } catch (err) {
      console.error('Failed to update settings:', err)
      setError('Failed to save settings')
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  // Update single field
  const updateSetting = useCallback(async <K extends keyof RestaurantSettings>(
    key: K,
    value: RestaurantSettings[K]
  ) => {
    setSaving(true)
    setError(null)
    try {
      await updateDoc(SETTINGS_DOC, { [key]: value })
      return true
    } catch (err) {
      console.error(`Failed to update ${String(key)}:`, err)
      setError(`Failed to save ${String(key)}`)
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  return { settings, loading, saving, error, updateSettings, updateSetting }
}

export default useSettings
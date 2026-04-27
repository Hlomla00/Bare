import { useState, useEffect, useCallback } from 'react'
import type { Slot } from '../types'
import { MOCK_SLOTS } from '../data/mockData'

export function useSlots(filters?: { suburb?: string; classType?: string }) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      let result = MOCK_SLOTS.filter((s) => s.status === 'open' && s.spots_remaining > 0)

      if (filters?.suburb && filters.suburb !== 'All') {
        result = result.filter((s) => s.gym?.suburb === filters.suburb)
      }
      if (filters?.classType && filters.classType !== 'All') {
        result = result.filter((s) => s.class_type === filters.classType)
      }

      setSlots(result)
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [filters?.suburb, filters?.classType])

  // Simulate real-time spot decrements
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prev) =>
        prev.map((slot) => {
          if (Math.random() < 0.05 && slot.spots_remaining > 1) {
            return { ...slot, spots_remaining: slot.spots_remaining - 1 }
          }
          return slot
        })
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const flashSlots = slots.filter((s) => s.is_flash)
  const regularSlots = slots.filter((s) => !s.is_flash)

  return { slots, flashSlots, regularSlots, loading }
}

export function useSlotById(id: string) {
  const slot = MOCK_SLOTS.find((s) => s.id === id)
  return { slot, loading: false }
}

export function useBookSlot() {
  const [loading, setLoading] = useState(false)

  const bookSlot = useCallback(async (slotId: string, _useCredits: boolean): Promise<string> => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    const code = `BARE-${Date.now().toString(36).toUpperCase().slice(-4)}-${Math.random().toString(36).toUpperCase().slice(2, 6)}`
    return code
  }, [])

  return { bookSlot, loading }
}

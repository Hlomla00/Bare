import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Slot } from '../types'
import { MOCK_SLOTS } from '../data/mockData'

// Supabase realtime for live slot counters.
// Falls back to mock data with simulated decrements when no Supabase project is configured.
export function useRealtimeSlots(gymId?: string) {
  const [slots, setSlots] = useState<Slot[]>(() =>
    gymId ? MOCK_SLOTS.filter((s) => s.gym_id === gymId) : MOCK_SLOTS
  )
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    const isConfigured =
      import.meta.env.VITE_SUPABASE_URL &&
      !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

    if (isConfigured) {
      const channel = supabase
        .channel('slots-realtime')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'slots' },
          (payload) => {
            setSlots((prev) =>
              prev.map((s) =>
                s.id === payload.new.id ? { ...s, ...(payload.new as Partial<Slot>) } : s
              )
            )
          }
        )
        .subscribe()

      channelRef.current = channel
      return () => { supabase.removeChannel(channel) }
    }

    // Mock: simulate spot decrements every 6–12 seconds
    const tick = () => {
      setSlots((prev) => {
        const updated = prev.map((slot) => {
          if (slot.spots_remaining > 0 && Math.random() < 0.06) {
            return { ...slot, spots_remaining: slot.spots_remaining - 1 }
          }
          return slot
        })
        // Remove fully booked slots from view
        return updated
      })
    }

    const interval = setInterval(tick, 8000)
    return () => clearInterval(interval)
  }, [gymId])

  const openSlots = slots.filter((s) => s.status === 'open' && s.spots_remaining > 0)
  const flashSlots = openSlots.filter((s) => s.is_flash)

  return { slots: openSlots, flashSlots, allSlots: slots }
}

// Real-time active session count from Supabase or mock counter
export function useLiveCount() {
  const [count, setCount] = useState(124)

  useEffect(() => {
    const isConfigured =
      import.meta.env.VITE_SUPABASE_URL &&
      !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

    if (isConfigured) {
      const channel = supabase
        .channel('active-sessions-count')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'active_sessions' },
          async () => {
            const { count: c } = await supabase
              .from('active_sessions')
              .select('*', { count: 'exact', head: true })
              .eq('is_live', true)
            if (c !== null) setCount(c)
          }
        )
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    }

    // Mock oscillation
    const interval = setInterval(() => {
      setCount((c) => Math.max(80, Math.min(210, c + Math.floor(Math.random() * 7) - 3)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return count
}

import { createClient } from '@supabase/supabase-js'
import type { User, Gym, Slot, Booking, Subscription, Friendship, ActiveSession, Review, GymEarning, Notification } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: { Row: User; Insert: Omit<User, 'id' | 'created_at'>; Update: Partial<User> }
      gyms: { Row: Gym; Insert: Omit<Gym, 'id' | 'created_at'>; Update: Partial<Gym> }
      slots: { Row: Slot; Insert: Omit<Slot, 'id' | 'created_at'>; Update: Partial<Slot> }
      bookings: { Row: Booking; Insert: Omit<Booking, 'id' | 'created_at'>; Update: Partial<Booking> }
      subscriptions: { Row: Subscription; Insert: Omit<Subscription, 'id' | 'created_at'>; Update: Partial<Subscription> }
      friendships: { Row: Friendship; Insert: Omit<Friendship, 'id' | 'created_at'>; Update: Partial<Friendship> }
      active_sessions: { Row: ActiveSession; Insert: Omit<ActiveSession, 'id'>; Update: Partial<ActiveSession> }
      reviews: { Row: Review; Insert: Omit<Review, 'id' | 'created_at'>; Update: Partial<Review> }
      gym_earnings: { Row: GymEarning; Insert: Omit<GymEarning, 'id'>; Update: Partial<GymEarning> }
      notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Notification> }
    }
  }
}

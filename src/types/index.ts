export type SubscriptionTier = 'none' | 'starter' | 'explorer' | 'active' | 'daily'

export type SlotStatus = 'open' | 'full' | 'cancelled' | 'completed'

export type BookingStatus = 'confirmed' | 'checked_in' | 'no_show' | 'cancelled'

export type FriendshipStatus = 'pending' | 'accepted'

export type DotStatus = 'live' | 'done_today' | 'not_yet'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  credits_remaining: number
  vitality_id: string | null
  location_suburb: string
  created_at: string
}

export interface Gym {
  id: string
  owner_id: string
  name: string
  description: string
  suburb: string
  lat: number
  lng: number
  address: string
  photos: string[]
  amenities: string[]
  vibe_tags: string[]
  has_generator: boolean
  parking: boolean
  verified: boolean
  bare_score: number
  created_at: string
}

export interface Slot {
  id: string
  gym_id: string
  gym?: Gym
  class_type: string
  title: string
  start_time: string
  end_time: string
  total_capacity: number
  bare_allocation: number
  spots_remaining: number
  price: number
  is_flash: boolean
  flash_expires_at: string | null
  status: SlotStatus
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  slot_id: string
  gym_id: string
  slot?: Slot
  gym?: Gym
  status: BookingStatus
  amount_paid: number
  gym_payout: number
  qr_code: string
  checked_in_at: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  visits_included: number
  visits_used: number
  billing_date: string
  status: 'active' | 'cancelled' | 'expired'
  created_at: string
}

export interface Friendship {
  id: string
  user_id: string
  friend_id: string
  friend?: User
  status: FriendshipStatus
  created_at: string
}

export interface ActiveSession {
  id: string
  user_id: string
  gym_id: string
  gym?: Gym
  user?: User
  started_at: string
  is_live: boolean
}

export interface Review {
  id: string
  user_id: string
  user_name: string
  gym_id: string
  booking_id: string
  rating: number
  body: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'credit_purchase' | 'booking_debit' | 'refund' | 'subscription'
  amount: number
  credits?: number
  description: string
  created_at: string
}

export interface WaitlistEntry {
  id: string
  user_id: string
  slot_id: string
  slot?: Slot
  position: number
  created_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  user_name: string
  subject: string
  body: string
  status: 'open' | 'in_progress' | 'resolved'
  type: 'booking_issue' | 'payment' | 'gym_quality' | 'other'
  created_at: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'support' | 'finance'
}

export interface GymApplication {
  id: string
  owner_name: string
  gym_name: string
  suburb: string
  email: string
  phone: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
}

export interface GymEarning {
  id: string
  gym_id: string
  booking_id: string
  amount: number
  status: 'pending' | 'paid_out'
  paid_out_at: string | null
}

export interface Notification {
  id: string
  user_id: string
  type: 'flash_slot' | 'booking_confirmed' | 'friend_live' | 'check_in_reminder' | 'payout'
  title: string
  body: string
  data: Record<string, unknown>
  read: boolean
  created_at: string
}

export interface Friend {
  id: string
  name: string
  avatar_url: string | null
  dot_status: DotStatus
  last_session?: {
    gym_name: string
    suburb: string
    started_at: string
    duration_mins?: number
  }
  trained_at?: string
}

export const SUBSCRIPTION_PLANS: Record<
  Exclude<SubscriptionTier, 'none'>,
  { name: string; price: number; visits: number; pricePerVisit: number }
> = {
  starter: { name: 'Starter', price: 299, visits: 5, pricePerVisit: 59.8 },
  explorer: { name: 'Explorer', price: 549, visits: 10, pricePerVisit: 54.9 },
  active: { name: 'Active', price: 799, visits: 16, pricePerVisit: 49.94 },
  daily: { name: 'Daily', price: 1399, visits: 26, pricePerVisit: 53.81 },
}

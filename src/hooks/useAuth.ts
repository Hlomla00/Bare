import { useState } from 'react'
import type { User } from '../types'

// Mock current user — replace with real Supabase auth
const MOCK_USER: User = {
  id: 'user-1',
  name: 'Jordan Cape',
  email: 'jordan@example.com',
  phone: '+27 82 555 0199',
  avatar_url: null,
  subscription_tier: 'active',
  credits_remaining: 11,
  vitality_id: '8843001234567',
  location_suburb: 'Sea Point',
  created_at: '2024-01-01T00:00:00Z',
}

const MOCK_PARTNER_USER: User = {
  id: 'partner-1',
  name: 'Marco Ferreira',
  email: 'marco@velocitygym.co.za',
  phone: '+27 21 434 5678',
  avatar_url: null,
  subscription_tier: 'none',
  credits_remaining: 0,
  vitality_id: null,
  location_suburb: 'Sea Point',
  created_at: '2024-01-15T00:00:00Z',
}

export function useAuth(role: 'member' | 'partner' = 'member') {
  const [user] = useState<User>(role === 'partner' ? MOCK_PARTNER_USER : MOCK_USER)
  const [loading] = useState(false)

  return { user, loading, isAuthenticated: true }
}

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'

export type AuthRole = 'member' | 'partner' | 'admin'

interface AuthState {
  user: User | null
  role: AuthRole | null
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (role: AuthRole) => void
  logout: () => void
}

// ─── Mock users per role ─────────────────────────────────────────────────────

const USERS: Record<AuthRole, User> = {
  member: {
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
  },
  partner: {
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
  },
  admin: {
    id: 'admin-1',
    name: 'Bare Admin',
    email: 'admin@bare.co.za',
    phone: '+27 21 000 0001',
    avatar_url: null,
    subscription_tier: 'none',
    credits_remaining: 0,
    vitality_id: null,
    location_suburb: 'Cape Town CBD',
    created_at: '2024-01-01T00:00:00Z',
  },
}

const STORAGE_KEY = 'bare_auth_role'

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Rehydrate from localStorage so refresh keeps you logged in
    const saved = localStorage.getItem(STORAGE_KEY) as AuthRole | null
    if (saved && USERS[saved]) {
      return { user: USERS[saved], role: saved, isAuthenticated: true }
    }
    return { user: null, role: null, isAuthenticated: false }
  })

  const login = (role: AuthRole) => {
    localStorage.setItem(STORAGE_KEY, role)
    setState({ user: USERS[role], role, isAuthenticated: true })
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ user: null, role: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}

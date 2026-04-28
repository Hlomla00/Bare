import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import { useAuthContext } from '../context/AuthContext'
import type { AuthRole } from '../context/AuthContext'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState<AuthRole>('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    login(role)                          // ← sets global auth state + localStorage
    setLoading(false)
    if (role === 'partner') navigate('/partner')
    else if (role === 'admin') navigate('/admin')
    else navigate('/app')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-between px-6 pt-16 pb-10">
      {/* Logo */}
      <div>
        <div className="mb-10 text-center">
          <span className="text-white font-black text-4xl tracking-tighter">bare</span>
          <p className="text-[#555] text-sm mt-1">Cape Town's gym marketplace</p>
        </div>

        {/* Role tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-[#111] border border-[#1E1E1E] mb-8">
          {(['member', 'partner', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all capitalize ${
                role === r ? 'bg-[#CAFF00] text-black' : 'text-[#555]'
              }`}
            >
              {r === 'member' ? 'Member' : r === 'partner' ? 'Gym Partner' : 'Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'partner' ? 'marco@velocitygym.co.za' : role === 'admin' ? 'admin@bare.co.za' : 'jordan@example.com'}
              className="w-full bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 text-white placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 text-sm"
            />
          </div>

          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 text-white placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 text-sm pr-12"
              />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4 text-[#555]" /> : <Eye className="w-4 h-4 text-[#555]" />}
              </button>
            </div>
          </div>

          {error && <p className="text-[#FF3547] text-sm text-center">{error}</p>}

          <div className="flex justify-end">
            <Link to="/auth/forgot-password" className="text-[#CAFF00] text-xs font-semibold">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : (
              <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* Demo quick-access */}
        <div className="mt-6 p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            {(['member', 'partner', 'admin'] as const).map(r => (
              <button
                key={r}
                onClick={async () => {
                  setLoading(true)
                  await new Promise(res => setTimeout(res, 600))
                  login(r)
                  setLoading(false)
                  if (r === 'partner') navigate('/partner')
                  else if (r === 'admin') navigate('/admin')
                  else navigate('/app')
                }}
                className="py-2 rounded-xl bg-[#1A1A1A] border border-[#242424] text-[#888] text-xs font-medium capitalize"
              >
                {r === 'partner' ? 'Partner' : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-4 mt-8">
        <p className="text-[#555] text-sm">
          New member?{' '}
          <Link to="/auth/signup" className="text-[#CAFF00] font-semibold">Create account</Link>
        </p>
        <p className="text-[#555] text-sm">
          Own a gym?{' '}
          <Link to="/auth/partner-signup" className="text-[#CAFF00] font-semibold">List your gym →</Link>
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[#333] text-xs">
          <Zap className="w-3 h-3 text-[#FF3547]" fill="currentColor" />
          <span>Flash slots drop every day — don't miss them</span>
        </div>
      </div>
    </div>
  )
}

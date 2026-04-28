import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col px-6 pt-14 pb-10">
      <button onClick={() => navigate('/auth/login')} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E] w-fit mb-8">
        <ArrowLeft className="w-4 h-4 text-white" />
      </button>

      {!sent ? (
        <>
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#CAFF00]/10 flex items-center justify-center mb-5">
              <Mail className="w-7 h-7 text-[#CAFF00]" />
            </div>
            <h1 className="text-white font-black text-2xl">Reset password</h1>
            <p className="text-[#555] text-sm mt-2">Enter your email and we'll send you a reset link.</p>
          </div>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jordan@example.com"
                className="w-full bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 text-white placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 text-sm" />
            </div>
            <button type="submit" disabled={!email || loading}
              className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl text-sm disabled:opacity-40 mt-4">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#CAFF00]/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-[#CAFF00]" />
          </div>
          <h1 className="text-white font-black text-2xl mb-3">Check your email</h1>
          <p className="text-[#888] text-sm leading-relaxed mb-8 max-w-xs">
            We sent a reset link to <span className="text-white font-semibold">{email}</span>. It expires in 15 minutes.
          </p>
          <button onClick={() => navigate('/auth/login')} className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl text-sm">
            Back to Sign In
          </button>
          <button onClick={() => setSent(false)} className="mt-3 text-[#555] text-sm">Didn't receive it? Try again</button>
        </div>
      )}
    </div>
  )
}

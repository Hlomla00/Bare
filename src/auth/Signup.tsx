import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'

const SUBURBS = ['Sea Point', 'Green Point', 'De Waterkant', 'Cape Town CBD', 'Camps Bay', 'Woodstock', 'Gardens', 'Claremont', 'Observatory', 'Rondebosch']

export function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', suburb: '', referral: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const nextStep = () => setStep(s => s + 1)

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    navigate('/auth/onboarding')
  }

  const inputCls = "w-full bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 text-white placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 text-sm"

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col px-6 pt-14 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => step === 1 ? navigate('/auth/login') : setStep(s => s - 1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="flex-1">
          <p className="text-[#555] text-xs">Step {step} of 2</p>
          <div className="flex gap-1 mt-1">
            {[1, 2].map(n => (
              <div key={n} className={`h-1 flex-1 rounded-full transition-all ${n <= step ? 'bg-[#CAFF00]' : 'bg-[#1E1E1E]'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-white font-black text-2xl">{step === 1 ? 'Create your account' : 'Where are you based?'}</h1>
        <p className="text-[#555] text-sm mt-1">{step === 1 ? 'Join Cape Town\'s fitness community' : 'We\'ll show you the best gyms nearby'}</p>
      </div>

      {step === 1 && (
        <div className="space-y-4 flex-1">
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Full Name</label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Jordan Cape" className={inputCls} />
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jordan@example.com" className={inputCls} />
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Phone</label>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+27 82 555 0199" className={inputCls} />
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className={`${inputCls} pr-12`} />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4 text-[#555]" /> : <Eye className="w-4 h-4 text-[#555]" />}
              </button>
            </div>
          </div>
          <button onClick={nextStep} disabled={!form.name || !form.email || form.password.length < 6} className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-40 mt-4">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[#555] text-sm">Already have an account? <Link to="/auth/login" className="text-[#CAFF00] font-semibold">Sign in</Link></p>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 flex-1">
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Home Suburb</label>
            <select value={form.suburb} onChange={set('suburb')} className={inputCls + ' appearance-none'}>
              <option value="">Select suburb...</option>
              {SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Referral Code <span className="text-[#555] font-normal normal-case">(optional)</span></label>
            <input type="text" value={form.referral} onChange={set('referral')} placeholder="BARE-XXXX" className={inputCls} />
          </div>
          {/* T&Cs */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
            <div className="w-5 h-5 rounded-md bg-[#CAFF00] flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-black" strokeWidth={3} />
            </div>
            <p className="text-[#888] text-xs leading-relaxed">By creating an account I agree to Bare's <span className="text-[#CAFF00]">Terms of Service</span> and <span className="text-[#CAFF00]">Privacy Policy</span>.</p>
          </div>
          <button onClick={handleSubmit} disabled={!form.suburb || loading} className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-40 mt-4">
            {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      )}
    </div>
  )
}

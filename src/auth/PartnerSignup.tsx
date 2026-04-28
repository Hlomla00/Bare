import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, Upload, MapPin } from 'lucide-react'

const SUBURBS = ['Sea Point','Green Point','De Waterkant','Cape Town CBD','Camps Bay','Woodstock','Gardens','Claremont','Observatory','Rondebosch','Bellville','Mitchells Plain']
const GYM_TYPES = ['HIIT & Functional','Strength & Powerlifting','Yoga & Pilates','CrossFit','Boxing & MMA','Spin & Cycling','Wellness & Recovery','General Fitness']
const AMENITIES_LIST = ['Showers','Lockers','Parking','Towels','WiFi','Café','Sauna','Steam Room','Pool','Protein Bar','Outdoor Area']

export function PartnerSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [amenities, setAmenities] = useState<string[]>([])
  const [form, setForm] = useState({
    ownerName: '', email: '', phone: '', password: '',
    gymName: '', suburb: '', address: '', gymType: '', description: '',
    capacity: '', price_from: '', price_to: '',
    bankName: '', accountNumber: '', branchCode: '', accountHolder: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleAmenity = (a: string) =>
    setAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setStep(5)
  }

  const inputCls = "w-full bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 text-white placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 text-sm"

  const steps = ['Your Details', 'Gym Info', 'Facilities', 'Bank Details', 'Done!']

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col px-6 pt-14 pb-10">
      {/* Header */}
      {step < 5 && (
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => step === 1 ? navigate('/auth/login') : setStep(s => s - 1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-[#555] text-xs">{steps[step - 1]}</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={`h-1 flex-1 rounded-full transition-all ${n <= step ? 'bg-[#CAFF00]' : 'bg-[#1E1E1E]'}`} />
              ))}
            </div>
          </div>
          <span className="text-[#555] text-xs">{step}/4</span>
        </div>
      )}

      {/* Step 1: Owner details */}
      {step === 1 && (
        <>
          <h1 className="text-white font-black text-2xl mb-1">List your gym</h1>
          <p className="text-[#555] text-sm mb-8">Join 48 gyms earning on Bare</p>
          <div className="space-y-4 flex-1">
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Your Full Name</label>
              <input type="text" value={form.ownerName} onChange={set('ownerName')} placeholder="Marco Ferreira" className={inputCls} /></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Business Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="marco@velocitygym.co.za" className={inputCls} /></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Phone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+27 21 434 5678" className={inputCls} /></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" className={inputCls} /></div>
          </div>
          <button onClick={() => setStep(2)} disabled={!form.ownerName || !form.email || form.password.length < 6}
            className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-40 mt-8">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[#555] text-sm mt-4">Already a partner? <Link to="/auth/login" className="text-[#CAFF00] font-semibold">Sign in</Link></p>
        </>
      )}

      {/* Step 2: Gym Info */}
      {step === 2 && (
        <>
          <h1 className="text-white font-black text-2xl mb-1">About your gym</h1>
          <p className="text-[#555] text-sm mb-8">This is what members will see</p>
          <div className="space-y-4 flex-1">
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Gym Name</label>
              <input type="text" value={form.gymName} onChange={set('gymName')} placeholder="Velocity Gym" className={inputCls} /></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Suburb</label>
              <select value={form.suburb} onChange={set('suburb')} className={inputCls + ' appearance-none'}>
                <option value="">Select suburb...</option>
                {SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Street Address</label>
              <div className="relative"><input type="text" value={form.address} onChange={set('address')} placeholder="142 Beach Road, Sea Point" className={inputCls + ' pr-10'} />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" /></div></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Gym Type</label>
              <select value={form.gymType} onChange={set('gymType')} className={inputCls + ' appearance-none'}>
                <option value="">Select type...</option>
                {GYM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Description</label>
              <textarea value={form.description} onChange={set('description') as any} rows={3} placeholder="Describe what makes your gym special..." className={inputCls + ' resize-none'} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Price From (R)</label>
                <input type="number" value={form.price_from} onChange={set('price_from')} placeholder="120" className={inputCls} /></div>
              <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Price To (R)</label>
                <input type="number" value={form.price_to} onChange={set('price_to')} placeholder="300" className={inputCls} /></div>
            </div>
            {/* Photo upload placeholder */}
            <div className="border-2 border-dashed border-[#242424] rounded-2xl p-6 flex flex-col items-center gap-2 text-center">
              <Upload className="w-8 h-8 text-[#555]" />
              <p className="text-white text-sm font-semibold">Upload gym photos</p>
              <p className="text-[#555] text-xs">PNG, JPG up to 10MB each</p>
              <button className="mt-2 px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#242424] text-[#888] text-xs font-medium">Choose files</button>
            </div>
          </div>
          <button onClick={() => setStep(3)} disabled={!form.gymName || !form.suburb}
            className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-40 mt-8">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Step 3: Facilities */}
      {step === 3 && (
        <>
          <h1 className="text-white font-black text-2xl mb-1">Facilities & Capacity</h1>
          <p className="text-[#555] text-sm mb-8">Help members know what to expect</p>
          <div className="space-y-5 flex-1">
            <div>
              <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-3 block">Amenities</label>
              <div className="grid grid-cols-3 gap-2">
                {AMENITIES_LIST.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${amenities.includes(a) ? 'bg-[#CAFF00]/10 border-[#CAFF00]/50 text-[#CAFF00]' : 'bg-[#111] border-[#242424] text-[#888]'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Class Capacity (max per session)</label>
              <input type="number" value={form.capacity} onChange={set('capacity')} placeholder="20" className={inputCls} /></div>
          </div>
          <button onClick={() => setStep(4)}
            className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm mt-8">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Step 4: Bank Details */}
      {step === 4 && (
        <>
          <h1 className="text-white font-black text-2xl mb-1">Bank Details</h1>
          <p className="text-[#555] text-sm mb-2">We pay out every Friday. You keep 80% of every booking.</p>
          <div className="p-3 rounded-xl bg-[#CAFF00]/10 border border-[#CAFF00]/20 mb-6">
            <p className="text-[#CAFF00] text-xs font-semibold">🔒 Your banking info is encrypted and secure</p>
          </div>
          <div className="space-y-4 flex-1">
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Account Holder Name</label>
              <input type="text" value={form.accountHolder} onChange={set('accountHolder')} placeholder="Velocity Gym (Pty) Ltd" className={inputCls} /></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Bank Name</label>
              <select value={form.bankName} onChange={set('bankName')} className={inputCls + ' appearance-none'}>
                <option value="">Select bank...</option>
                {['FNB', 'Standard Bank', 'ABSA', 'Nedbank', 'Capitec', 'Investec', 'TymeBank'].map(b => <option key={b}>{b}</option>)}
              </select></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Account Number</label>
              <input type="text" value={form.accountNumber} onChange={set('accountNumber')} placeholder="62XXXXXXXXXX" className={inputCls} /></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Branch Code</label>
              <input type="text" value={form.branchCode} onChange={set('branchCode')} placeholder="250655" className={inputCls} /></div>
          </div>
          <button onClick={handleSubmit} disabled={!form.accountHolder || !form.bankName || loading}
            className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-40 mt-8">
            {loading ? 'Submitting application...' : <><span>Submit Application</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#CAFF00]/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-[#CAFF00]" />
          </div>
          <h1 className="text-white font-black text-2xl mb-3">Application submitted!</h1>
          <p className="text-[#888] text-sm leading-relaxed mb-8 max-w-xs">Our team will review <span className="text-white font-semibold">{form.gymName}</span> within 24–48 hours. You'll get an email when you're approved.</p>
          <div className="w-full space-y-3">
            <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E] text-left space-y-2">
              <p className="text-[#555] text-xs font-bold uppercase tracking-widest">What happens next</p>
              {['Our team reviews your application','You receive approval email in 24–48h','Set up your first slots in the partner app','Get paid every Friday'].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1A1A1A] border border-[#242424] text-[#CAFF00] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-[#888] text-sm">{s}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/auth/login')} className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl text-sm">
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

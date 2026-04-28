import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const SUBURBS = ['Sea Point','Green Point','De Waterkant','Cape Town CBD','Camps Bay','Woodstock','Gardens','Claremont','Observatory','Rondebosch']
const FITNESS_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite']

export function EditProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    suburb: user?.location_suburb ?? '',
    vitality_id: user?.vitality_id ?? '',
    fitness_level: 'Intermediate',
    bio: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); navigate(-1) }, 1200)
  }

  const inputCls = "w-full bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 text-white placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 text-sm"

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-black text-lg flex-1">Edit Profile</h1>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CAFF00] text-black text-sm font-bold disabled:opacity-50">
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 pb-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#CAFF00] flex items-center justify-center text-black font-black text-3xl">
              {form.name.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#242424] flex items-center justify-center">
              <Camera className="w-4 h-4 text-[#888]" />
            </button>
          </div>
          <p className="text-[#555] text-xs">Tap to change photo</p>
        </div>

        {/* Personal */}
        <div className="space-y-4">
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Personal Info</p>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Full Name</label>
            <input type="text" value={form.name} onChange={set('name')} className={inputCls} />
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Bio</label>
            <textarea value={form.bio} onChange={set('bio') as any} rows={2} placeholder="Tell your squad a bit about you..." className={inputCls + ' resize-none'} />
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Home Suburb</label>
            <select value={form.suburb} onChange={set('suburb')} className={inputCls + ' appearance-none'}>
              {SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Fitness Level</label>
            <select value={form.fitness_level} onChange={set('fitness_level')} className={inputCls + ' appearance-none'}>
              {FITNESS_LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Contact</p>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Email</label>
            <input type="email" value={form.email} onChange={set('email')} className={inputCls} />
          </div>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Phone</label>
            <input type="tel" value={form.phone} onChange={set('phone')} className={inputCls} />
          </div>
        </div>

        {/* Vitality */}
        <div className="space-y-4">
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Vitality</p>
          <div>
            <label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Vitality ID <span className="text-[#555] font-normal normal-case">(optional)</span></label>
            <input type="text" value={form.vitality_id} onChange={set('vitality_id')} placeholder="8843001234567" className={inputCls} />
            <p className="text-[#555] text-xs mt-2">Link your Discovery Vitality ID to earn points for every session.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Camera, Save, Check, Plus, X, Clock } from 'lucide-react'
import { PARTNER_GYM } from '../../data/mockData'

const ALL_AMENITIES = ['Showers','Lockers','Towels','Parking','WiFi','Café','Sauna','Steam Room','Pool','Protein Bar','Tea Bar','Outdoor Area','Reformers','Meditation Room','Cardio','Free Weights']
const VIBE_OPTIONS = ['High Energy','Community','Results-Driven','Serious','No BS','Mindful','Premium','Zen','Lifestyle','Beach','Functional','CrossFit','Intense','Boutique','Precise']
const HOURS = ['Closed','05:00','05:30','06:00','06:30','07:00','07:30','08:00','09:00','10:00','17:00','17:30','18:00','18:30','19:00','20:00','21:00','22:00']

const DEFAULT_SCHEDULE = {
  Mon: { open: '06:00', close: '21:00', closed: false },
  Tue: { open: '06:00', close: '21:00', closed: false },
  Wed: { open: '06:00', close: '21:00', closed: false },
  Thu: { open: '06:00', close: '21:00', closed: false },
  Fri: { open: '06:00', close: '20:00', closed: false },
  Sat: { open: '07:00', close: '14:00', closed: false },
  Sun: { open: '08:00', close: '13:00', closed: false },
}

export function GymEditor() {
  const gym = PARTNER_GYM
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [amenities, setAmenities] = useState<string[]>(gym.amenities)
  const [vibes, setVibes] = useState<string[]>(gym.vibe_tags)
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)
  const [form, setForm] = useState({
    name: gym.name,
    description: gym.description,
    address: gym.address,
    phone: '+27 21 434 5678',
    instagram: '@velocitygym',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputCls = "w-full bg-[#111] border border-[#242424] rounded-2xl px-4 py-3.5 text-white placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 text-sm"

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Edit Gym Profile</h1>
            <p className="text-[#555] text-xs">Changes go live immediately</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#CAFF00] text-black text-sm font-bold disabled:opacity-50">
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : saving ? 'Saving...' : <><Save className="w-3.5 h-3.5" /> Save</>}
          </button>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Photos */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Photos</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            <div className="relative shrink-0 w-28 h-28 rounded-2xl overflow-hidden bg-[#111] border border-[#1E1E1E]">
              <img src={gym.photos[0]} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="absolute top-1.5 left-1.5 bg-[#CAFF00] text-black text-[9px] font-black px-1.5 py-0.5 rounded-md">MAIN</span>
            </div>
            {[1, 2, 3].map(n => (
              <button key={n} className="shrink-0 w-28 h-28 rounded-2xl bg-[#111] border border-dashed border-[#2A2A2A] flex flex-col items-center justify-center gap-1">
                <Plus className="w-5 h-5 text-[#555]" />
                <span className="text-[#555] text-xs">Add photo</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic info */}
        <div className="space-y-4">
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Basic Info</p>
          <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Gym Name</label>
            <input type="text" value={form.name} onChange={set('name')} className={inputCls} /></div>
          <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Description</label>
            <textarea value={form.description} onChange={set('description') as any} rows={3} className={inputCls + ' resize-none'} /></div>
          <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Address</label>
            <input type="text" value={form.address} onChange={set('address')} className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Phone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} className={inputCls} /></div>
            <div><label className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2 block">Instagram</label>
              <input type="text" value={form.instagram} onChange={set('instagram')} placeholder="@handle" className={inputCls} /></div>
          </div>
        </div>

        {/* Hours */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Opening Hours</p>
          </div>
          <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
            {(Object.entries(schedule) as [keyof typeof schedule, typeof schedule['Mon']][]).map(([day, hours], i) => (
              <div key={day} className={`flex items-center gap-3 px-4 py-3 ${i < Object.keys(schedule).length - 1 ? 'border-b border-[#1A1A1A]' : ''}`}>
                <p className="text-white text-sm font-medium w-8">{day}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setSchedule(s => ({ ...s, [day]: { ...s[day], closed: !s[day].closed } }))}
                    className={`w-8 h-4 rounded-full transition-all relative ${!hours.closed ? 'bg-[#CAFF00]' : 'bg-[#2A2A2A]'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${!hours.closed ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </label>
                {hours.closed ? (
                  <span className="text-[#555] text-sm flex-1">Closed</span>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <select value={hours.open} onChange={e => setSchedule(s => ({ ...s, [day]: { ...s[day], open: e.target.value } }))}
                      className="flex-1 bg-[#1A1A1A] border border-[#242424] rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none">
                      {HOURS.filter(h => h !== 'Closed').map(h => <option key={h}>{h}</option>)}
                    </select>
                    <span className="text-[#555] text-xs">–</span>
                    <select value={hours.close} onChange={e => setSchedule(s => ({ ...s, [day]: { ...s[day], close: e.target.value } }))}
                      className="flex-1 bg-[#1A1A1A] border border-[#242424] rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none">
                      {HOURS.filter(h => h !== 'Closed').map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Amenities</p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_AMENITIES.map(a => (
              <button key={a} onClick={() => toggle(amenities, setAmenities, a)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${amenities.includes(a) ? 'bg-[#CAFF00]/10 border-[#CAFF00]/50 text-[#CAFF00]' : 'bg-[#111] border-[#242424] text-[#888]'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe tags */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Vibe Tags</p>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map(v => (
              <button key={v} onClick={() => toggle(vibes, setVibes, v)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${vibes.includes(v) ? 'bg-[#CAFF00]/10 border-[#CAFF00]/50 text-[#CAFF00]' : 'bg-[#111] border-[#242424] text-[#888]'}`}>
                {vibes.includes(v) && <X className="inline w-2.5 h-2.5 mr-1" />}{v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

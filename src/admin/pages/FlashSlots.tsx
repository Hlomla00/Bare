import { useState } from 'react'
import { Zap, Plus, Clock, Users, CheckCircle, XCircle } from 'lucide-react'
import { MOCK_SLOTS, MOCK_GYMS } from '../../data/mockData'
import { format, addMinutes } from 'date-fns'
import { CountdownTimer } from '../../components/CountdownTimer'

const ALL_FLASH = MOCK_SLOTS.filter(s => s.is_flash)

const FLASH_METRICS = {
  activeCampaigns: 3,
  avgFillTime: '7 min',
  fillRate: 96,
  revenueFromFlash: 28400,
}

export function AdminFlashSlots() {
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ gym: '', classType: '', title: '', spots: '5', price: '150', duration: '60' })
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    await new Promise(r => setTimeout(r, 1200))
    setCreating(false)
    setShowCreate(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Flash Slots</h1>
            <p className="text-[#555] text-xs">Manage urgency campaigns</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF3547] text-white text-xs font-bold">
            <Plus className="w-3.5 h-3.5" /> Create Flash
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Flash metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Active Campaigns', value: FLASH_METRICS.activeCampaigns, color: '#FF3547' },
            { label: 'Avg Fill Time', value: FLASH_METRICS.avgFillTime, color: '#FF9500' },
            { label: 'Fill Rate', value: `${FLASH_METRICS.fillRate}%`, color: '#00FF6A' },
            { label: 'Flash Revenue MTD', value: `R${(FLASH_METRICS.revenueFromFlash / 1000).toFixed(1)}k`, color: '#CAFF00' },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
              <p className="font-black text-2xl" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[#555] text-xs mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* How to use flash */}
        <div className="p-4 rounded-2xl bg-[#FF3547]/10 border border-[#FF3547]/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#FF3547] shrink-0 mt-0.5" fill="#FF3547" />
            <div>
              <p className="text-white font-bold text-sm">Flash Slot Engine</p>
              <p className="text-[#888] text-xs mt-1">Create urgent 60-min booking windows for under-filled slots. Members get push + in-app notifications instantly. Average fill time: 7 minutes.</p>
            </div>
          </div>
        </div>

        {/* Active flash slots */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Active Flash Campaigns</p>
          {ALL_FLASH.map(slot => (
            <div key={slot.id} className="p-4 rounded-2xl bg-[#111] border border-[#FF3547]/20 mb-3">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Zap className="w-4 h-4 text-[#FF3547]" fill="#FF3547" />
                    <span className="text-white font-bold">{slot.title}</span>
                  </div>
                  <p className="text-[#555] text-xs">{slot.gym?.name} · {slot.gym?.suburb}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">R{slot.price}</p>
                  <p className="text-[#555] text-xs">{slot.spots_remaining} spots left</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[#888] text-xs"><Clock className="w-3 h-3" />{format(new Date(slot.start_time), 'HH:mm')}</span>
                <span className="flex items-center gap-1.5 text-[#888] text-xs"><Users className="w-3 h-3" />{slot.spots_remaining}/{slot.bare_allocation} bare spots</span>
                {slot.flash_expires_at && <CountdownTimer expiresAt={slot.flash_expires_at} className="text-xs font-bold" />}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#00FF6A]/10 border border-[#00FF6A]/30 text-[#00FF6A] text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Extend 30min
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FF3547]/10 border border-[#FF3547]/30 text-[#FF3547] text-xs font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          ))}
          {ALL_FLASH.length === 0 && (
            <div className="text-center py-10">
              <Zap className="w-12 h-12 text-[#2A2A2A] mx-auto mb-3" />
              <p className="text-[#555]">No active flash campaigns</p>
            </div>
          )}
        </div>

        {/* Past flash performance */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Recent Flash Performance</p>
          <div className="space-y-2">
            {[
              { gym: 'Surf & Sweat', class: 'Beach Circuit', spots: 8, fillTime: '4 min', revenue: 1600 },
              { gym: 'Velocity Gym', class: 'HIIT Blast', spots: 6, fillTime: '6 min', revenue: 900 },
              { gym: 'The Grid', class: 'CrossFit WOD', spots: 7, fillTime: '11 min', revenue: 1260 },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="w-8 h-8 rounded-xl bg-[#FF3547]/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#FF3547]" fill="#FF3547" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{f.gym} — {f.class}</p>
                  <p className="text-[#555] text-xs">{f.spots} spots · filled in {f.fillTime}</p>
                </div>
                <p className="text-[#CAFF00] font-bold text-sm shrink-0">R{f.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Flash modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] p-6 space-y-4">
            <h3 className="text-white font-black text-lg">Create Flash Slot</h3>
            <div className="space-y-3">
              <select value={form.gym} onChange={e => setForm(f => ({ ...f, gym: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#242424] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none">
                <option value="">Select gym...</option>
                {MOCK_GYMS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Flash slot title"
                className="w-full bg-[#0A0A0A] border border-[#242424] rounded-2xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none" />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-1">Spots</label>
                  <input type="number" value={form.spots} onChange={e => setForm(f => ({ ...f, spots: e.target.value }))} className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-1">Price (R)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-1">Window (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none" />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#FF3547]/10 border border-[#FF3547]/20">
                <p className="text-[#FF3547] text-xs font-semibold">⚡ Push notification sent to all members in {MOCK_GYMS.find(g => g.id === form.gym)?.suburb ?? 'all suburbs'} instantly</p>
              </div>
            </div>
            <button onClick={handleCreate} disabled={!form.gym || !form.title || creating}
              className="w-full bg-[#FF3547] text-white font-bold py-4 rounded-2xl text-sm disabled:opacity-40 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" fill="currentColor" />
              {creating ? 'Launching Flash...' : 'Launch Flash Slot'}
            </button>
            <button onClick={() => setShowCreate(false)} className="w-full text-[#555] text-sm py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Plus, Zap, Clock, Users, Edit2, Trash2, X, Check } from 'lucide-react'
import { format, addHours } from 'date-fns'
import { PARTNER_SLOTS } from '../../data/mockData'
import type { Slot } from '../../types'
import { CountdownTimer } from '../../components/CountdownTimer'

function SlotStatusBadge({ slot }: { slot: Slot }) {
  if (slot.is_flash) {
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF3547]/10 text-[#FF3547] text-[10px] font-bold uppercase border border-[#FF3547]/20">
        <Zap className="w-2.5 h-2.5" fill="currentColor" />
        Flash
      </span>
    )
  }
  if (slot.status === 'completed') {
    return (
      <span className="px-2.5 py-1 rounded-full bg-[#1A1A1A] text-[#444] text-[10px] font-bold uppercase border border-[#242424]">
        Done
      </span>
    )
  }
  if (slot.spots_remaining === 0) {
    return (
      <span className="px-2.5 py-1 rounded-full bg-[#00FF6A]/10 text-[#00FF6A] text-[10px] font-bold uppercase border border-[#00FF6A]/20">
        Full
      </span>
    )
  }
  return (
    <span className="px-2.5 py-1 rounded-full bg-[#CAFF00]/10 text-[#CAFF00] text-[10px] font-bold uppercase border border-[#CAFF00]/20">
      Open
    </span>
  )
}

function SlotRow({ slot }: { slot: Slot }) {
  const booked = slot.bare_allocation - slot.spots_remaining
  const pct = (booked / slot.bare_allocation) * 100
  const isCompleted = slot.status === 'completed'

  return (
    <div className={`p-4 rounded-2xl border ${isCompleted ? 'bg-[#0A0A0A] border-[#1A1A1A] opacity-60' : 'bg-[#111] border-[#1E1E1E]'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SlotStatusBadge slot={slot} />
            {slot.is_flash && slot.flash_expires_at && (
              <CountdownTimer expiresAt={slot.flash_expires_at} className="text-xs" />
            )}
          </div>
          <h3 className="text-white font-bold text-base leading-tight">{slot.title}</h3>
          <p className="text-[#888] text-sm">
            {format(new Date(slot.start_time), 'HH:mm')} – {format(new Date(slot.end_time), 'HH:mm')} · {slot.class_type}
          </p>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <button className="p-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
              <Edit2 className="w-3.5 h-3.5 text-[#666]" />
            </button>
            <button className="p-2 rounded-xl bg-[#FF3547]/10 border border-[#FF3547]/20">
              <Trash2 className="w-3.5 h-3.5 text-[#FF3547]" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#888]">
            <Users className="w-3.5 h-3.5" />
            <span>{booked}/{slot.bare_allocation} booked</span>
          </div>
          <span className="text-white font-semibold">R{slot.price} each · R{booked * slot.price * 0.8} earned</span>
        </div>
        <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: pct >= 90 ? '#00FF6A' : pct >= 60 ? '#CAFF00' : '#888',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function CreateSlotModal({ onClose, isFlash }: { onClose: () => void; isFlash: boolean }) {
  const now = new Date()
  const defaultStart = format(addHours(now, 2), "yyyy-MM-dd'T'HH:mm")

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] animate-slide-up">
        <div className="px-4 pt-4 pb-2">
          <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isFlash ? (
                <Zap className="w-5 h-5 text-[#FF3547]" fill="currentColor" />
              ) : (
                <Clock className="w-5 h-5 text-[#CAFF00]" />
              )}
              <h2 className="text-white font-bold text-lg">
                {isFlash ? 'Create Flash Slot' : 'Create Slot'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-[#1A1A1A] border border-[#242424]">
              <X className="w-4 h-4 text-[#888]" />
            </button>
          </div>

          {isFlash && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF3547]/10 border border-[#FF3547]/20">
              <p className="text-[#FF3547] text-xs font-semibold">
                ⚡ Flash slots expire in 60 minutes. Members get instant push notifications.
              </p>
            </div>
          )}
        </div>

        <div className="px-4 pb-8 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <div>
              <label className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-1.5 block">Class Type</label>
              <select className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CAFF00]">
                <option>HIIT</option>
                <option>Strength</option>
                <option>CrossFit</option>
                <option>Yoga</option>
                <option>Pilates</option>
                <option>Boxing</option>
                <option>Spin</option>
                <option>Open Gym</option>
              </select>
            </div>

            <div>
              <label className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-1.5 block">Title</label>
              <input
                type="text"
                placeholder="e.g. Morning HIIT Blast"
                className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#CAFF00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-1.5 block">Start</label>
                <input
                  type="datetime-local"
                  defaultValue={defaultStart}
                  className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#CAFF00]"
                />
              </div>
              <div>
                <label className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-1.5 block">Duration</label>
                <select className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#CAFF00]">
                  <option>45 min</option>
                  <option>60 min</option>
                  <option>75 min</option>
                  <option>90 min</option>
                  <option>120 min</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-1.5 block">Bare Spots</label>
                <input
                  type="number"
                  defaultValue="8"
                  min="1"
                  max="50"
                  className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CAFF00]"
                />
              </div>
              <div>
                <label className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-1.5 block">Price (R)</label>
                <input
                  type="number"
                  defaultValue="150"
                  step="10"
                  className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CAFF00]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A]">
              <div className="flex justify-between text-xs text-[#888] mb-1">
                <span>Listed price</span>
                <span>R150</span>
              </div>
              <div className="flex justify-between text-xs text-[#888] mb-1">
                <span>Bare commission (20%)</span>
                <span>-R30</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-white border-t border-[#1E1E1E] pt-1 mt-1">
                <span>You receive per session</span>
                <span className="text-[#CAFF00]">R120</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ backgroundColor: isFlash ? '#FF3547' : '#CAFF00', color: '#000' }}
            >
              {isFlash ? '⚡ Publish Flash Slot' : 'Publish Slot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Slots() {
  const [showCreate, setShowCreate] = useState(false)
  const [isFlash, setIsFlash] = useState(false)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  const upcoming = PARTNER_SLOTS.filter((s) => s.status === 'open')
  const past = PARTNER_SLOTS.filter((s) => s.status === 'completed')
  const displayed = tab === 'upcoming' ? upcoming : past

  return (
    <>
      <div className="pb-24 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-white font-black text-2xl">Slots</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsFlash(true); setShowCreate(true) }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF3547]/10 border border-[#FF3547]/20 text-[#FF3547] text-sm font-bold"
              >
                <Zap className="w-3.5 h-3.5" fill="currentColor" />
                Flash
              </button>
              <button
                onClick={() => { setIsFlash(false); setShowCreate(true) }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#CAFF00] text-black text-sm font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                Slot
              </button>
            </div>
          </div>
          <div className="flex px-4 gap-1 pb-3">
            {(['upcoming', 'past'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                  tab === t ? 'bg-[#CAFF00] text-black' : 'bg-[#151515] text-[#555] border border-[#242424]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 space-y-3">
          {displayed.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Clock className="w-10 h-10 text-[#333] mx-auto" />
              <p className="text-[#555]">No {tab} slots</p>
              {tab === 'upcoming' && (
                <button
                  onClick={() => { setIsFlash(false); setShowCreate(true) }}
                  className="px-6 py-3 rounded-2xl bg-[#CAFF00] text-black font-bold text-sm"
                >
                  Create your first slot
                </button>
              )}
            </div>
          ) : (
            displayed.map((slot) => <SlotRow key={slot.id} slot={slot} />)
          )}
        </div>
      </div>

      {showCreate && (
        <CreateSlotModal onClose={() => setShowCreate(false)} isFlash={isFlash} />
      )}
    </>
  )
}

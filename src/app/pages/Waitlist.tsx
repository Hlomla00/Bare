import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Users, X, Bell } from 'lucide-react'
import { MOCK_WAITLIST, MOCK_SLOTS } from '../../data/mockData'
import { format } from 'date-fns'
import { CountdownTimer } from '../../components/CountdownTimer'

export function Waitlist() {
  const navigate = useNavigate()

  const fullSlots = MOCK_SLOTS.filter(s => s.spots_remaining === 0 || s.status === 'full').slice(0, 4)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-black text-lg flex-1">Waitlist</h1>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* How it works */}
        <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">How Waitlist Works</p>
          <div className="space-y-2.5">
            {[
              { n: '1', t: 'Join a full slot\'s waitlist' },
              { n: '2', t: 'You\'ll be notified instantly if a spot opens' },
              { n: '3', t: 'You have 10 minutes to confirm your booking' },
            ].map(s => (
              <div key={s.n} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#CAFF00]/10 border border-[#CAFF00]/20 text-[#CAFF00] text-[10px] font-black flex items-center justify-center shrink-0">{s.n}</span>
                <p className="text-[#888] text-sm">{s.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My waitlist */}
        {MOCK_WAITLIST.length > 0 && (
          <div>
            <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">My Waitlist ({MOCK_WAITLIST.length})</p>
            <div className="space-y-3">
              {MOCK_WAITLIST.map(entry => {
                const slot = entry.slot
                if (!slot) return null
                return (
                  <div key={entry.id} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{slot.title}</p>
                        <p className="text-[#555] text-xs">{slot.gym?.name} · {slot.gym?.suburb}</p>
                      </div>
                      <button className="p-1.5 rounded-lg bg-[#1A1A1A]">
                        <X className="w-3.5 h-3.5 text-[#555]" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[#888] text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{format(new Date(slot.start_time), 'EEE, dd MMM · HH:mm')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#CAFF00] text-xs font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>#{entry.position} in queue</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Available to join */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Full Sessions — Join Waitlist</p>
          <div className="space-y-3">
            {MOCK_SLOTS.filter(s => s.spots_remaining <= 2).map(slot => (
              <div key={slot.id} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{slot.title}</p>
                    <p className="text-[#555] text-xs">{slot.gym?.name} · {slot.gym?.suburb}</p>
                  </div>
                  <span className="text-white font-bold text-sm">R{slot.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[#555] text-xs"><Clock className="w-3 h-3" />{format(new Date(slot.start_time), 'HH:mm')}</span>
                    <span className={`text-xs font-semibold ${slot.spots_remaining === 0 ? 'text-[#FF3547]' : 'text-[#FF9500]'}`}>
                      {slot.spots_remaining === 0 ? 'Full' : `${slot.spots_remaining} left`}
                    </span>
                    {slot.is_flash && slot.flash_expires_at && (
                      <CountdownTimer expiresAt={slot.flash_expires_at} className="text-xs" />
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#CAFF00]/10 border border-[#CAFF00]/30 text-[#CAFF00] text-xs font-bold">
                    <Bell className="w-3 h-3" /> Waitlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

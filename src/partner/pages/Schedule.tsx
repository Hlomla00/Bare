import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Zap, Users } from 'lucide-react'
import { addDays, format, startOfWeek, isSameDay } from 'date-fns'
import { MOCK_SLOTS } from '../../data/mockData'

const CLASS_COLORS: Record<string, string> = {
  HIIT: '#FF3547', Strength: '#CAFF00', CrossFit: '#FF9500',
  Yoga: '#0EA5E9', Pilates: '#EC4899', Boxing: '#7C3AED',
  Spin: '#00FF6A', Functional: '#F59E0B',
}

export function Schedule() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekSlots = MOCK_SLOTS.filter(s => {
    const d = new Date(s.start_time)
    return d >= weekStart && d <= addDays(weekStart, 7)
  })
  const daySlots = weekSlots.filter(s => isSameDay(new Date(s.start_time), selectedDay))

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-white font-black text-xl">Schedule</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#CAFF00] text-black text-xs font-bold">
            <Plus className="w-3.5 h-3.5" /> Add Slot
          </button>
        </div>

        {/* Week navigator */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <button onClick={() => setWeekStart(d => addDays(d, -7))} className="p-2 rounded-xl bg-[#111] border border-[#1E1E1E]">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-white text-sm font-bold flex-1 text-center">
            {format(weekStart, 'dd MMM')} – {format(addDays(weekStart, 6), 'dd MMM yyyy')}
          </span>
          <button onClick={() => setWeekStart(d => addDays(d, 7))} className="p-2 rounded-xl bg-[#111] border border-[#1E1E1E]">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Day strip */}
        <div className="flex px-4 pb-3 gap-1">
          {days.map(d => {
            const isSelected = isSameDay(d, selectedDay)
            const isToday = isSameDay(d, new Date())
            const slotsOnDay = weekSlots.filter(s => isSameDay(new Date(s.start_time), d)).length
            return (
              <button key={d.toISOString()} onClick={() => setSelectedDay(d)}
                className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${isSelected ? 'bg-[#CAFF00]' : 'bg-[#111] border border-[#1E1E1E]'}`}>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-black' : isToday ? 'text-[#CAFF00]' : 'text-[#555]'}`}>{format(d, 'EEE').slice(0, 1)}</span>
                <span className={`text-sm font-black ${isSelected ? 'text-black' : 'text-white'}`}>{format(d, 'd')}</span>
                {slotsOnDay > 0 && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-black' : 'bg-[#CAFF00]'}`} />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Week summary */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Slots this week', value: weekSlots.length },
            { label: 'Expected bookings', value: weekSlots.reduce((s, sl) => s + (sl.total_capacity - sl.spots_remaining), 0) },
            { label: 'Est. revenue', value: `R${(weekSlots.reduce((s, sl) => s + sl.price * (sl.total_capacity - sl.spots_remaining), 0) * 0.8 / 1000).toFixed(1)}k` },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-2xl bg-[#111] border border-[#1E1E1E] text-center">
              <p className="text-white font-black text-xl">{item.value}</p>
              <p className="text-[#555] text-[10px] leading-tight mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Day slots */}
        <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">
          {format(selectedDay, 'EEEE, dd MMMM')} — {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
        </p>

        {daySlots.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-[#555] text-lg">No slots scheduled</p>
            <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 rounded-xl bg-[#CAFF00]/10 border border-[#CAFF00]/30 text-[#CAFF00] text-sm font-bold">
              + Add a slot for this day
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {daySlots.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).map(slot => {
              const color = CLASS_COLORS[slot.class_type] ?? '#CAFF00'
              const booked = slot.total_capacity - slot.spots_remaining
              const fillPct = Math.round((booked / slot.total_capacity) * 100)
              return (
                <div key={slot.id} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                  <div className="flex items-start gap-3">
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-bold text-sm truncate">{slot.title}</span>
                        {slot.is_flash && <Zap className="w-3.5 h-3.5 text-[#FF3547] shrink-0" fill="#FF3547" />}
                      </div>
                      <p className="text-[#555] text-xs mb-2">
                        {format(new Date(slot.start_time), 'HH:mm')} – {format(new Date(slot.end_time), 'HH:mm')} · {slot.class_type}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-[#888]">
                          <Users className="w-3 h-3" />
                          <span>{booked}/{slot.total_capacity}</span>
                        </div>
                        <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden max-w-24">
                          <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, backgroundColor: fillPct >= 90 ? '#FF3547' : fillPct >= 70 ? '#FF9500' : color }} />
                        </div>
                        <span className="text-[#555] text-xs">{fillPct}%</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold text-sm">R{slot.price}</p>
                      <p className="text-[#555] text-[10px]">R{(slot.price * 0.8 * booked).toFixed(0)} earned</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add slot modal (simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] p-6 space-y-4">
            <h3 className="text-white font-black text-lg">Quick Add Slot</h3>
            <p className="text-[#555] text-sm">For {format(selectedDay, 'EEEE, dd MMMM')}</p>
            <div className="grid grid-cols-2 gap-3">
              {['HIIT', 'Strength', 'Yoga', 'Boxing', 'CrossFit', 'Pilates'].map(type => (
                <button key={type} onClick={() => setShowAddModal(false)}
                  className="py-3 rounded-xl bg-[#1A1A1A] border border-[#242424] text-white text-sm font-medium">
                  {type}
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddModal(false)} className="w-full text-[#555] text-sm py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { TrendingUp, Users, Clock, Star, ArrowUp, ArrowDown, Zap } from 'lucide-react'

const WEEKLY = [
  { day: 'Mon', bookings: 18, revenue: 2880 },
  { day: 'Tue', bookings: 22, revenue: 3520 },
  { day: 'Wed', bookings: 31, revenue: 4960 },
  { day: 'Thu', bookings: 25, revenue: 4000 },
  { day: 'Fri', bookings: 38, revenue: 6080 },
  { day: 'Sat', bookings: 44, revenue: 7040 },
  { day: 'Sun', bookings: 27, revenue: 4320 },
]

const PEAK_HOURS = [
  { hour: '06:00', pct: 45 }, { hour: '07:00', pct: 80 }, { hour: '08:00', pct: 95 },
  { hour: '09:00', pct: 70 }, { hour: '10:00', pct: 40 }, { hour: '11:00', pct: 30 },
  { hour: '12:00', pct: 55 }, { hour: '13:00', pct: 45 }, { hour: '17:00', pct: 75 },
  { hour: '18:00', pct: 100 }, { hour: '19:00', pct: 90 }, { hour: '20:00', pct: 60 },
]

const CLASS_PERF = [
  { type: 'HIIT', bookings: 142, revenue: 21300, fill: 94 },
  { type: 'Strength', bookings: 98, revenue: 17640, fill: 82 },
  { type: 'Yoga', bookings: 74, revenue: 16280, fill: 88 },
  { type: 'Boxing', bookings: 51, revenue: 8160, fill: 71 },
]

const maxBookings = Math.max(...WEEKLY.map(d => d.bookings))

export function Analytics() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Analytics</h1>
            <p className="text-[#555] text-xs">Velocity Gym performance</p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-[#111] border border-[#1E1E1E]">
            {(['week', 'month'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${period === p ? 'bg-[#CAFF00] text-black' : 'text-[#555]'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Bookings', value: period === 'week' ? '205' : '891', change: +12, icon: Users, color: '#CAFF00' },
            { label: 'Revenue', value: period === 'week' ? 'R32.8k' : 'R142k', change: +18, icon: TrendingUp, color: '#00FF6A' },
            { label: 'Avg Fill Rate', value: '84%', change: +5, icon: Clock, color: '#0EA5E9' },
            { label: 'Bare Score', value: '4.9', change: +0.1, icon: Star, color: '#FF9500' },
          ].map(kpi => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${kpi.color}18` }}>
                    <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-bold ${kpi.change > 0 ? 'text-[#00FF6A]' : 'text-[#FF3547]'}`}>
                    {kpi.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
                <p className="text-white font-black text-2xl">{kpi.value}</p>
                <p className="text-[#555] text-xs mt-0.5">{kpi.label}</p>
              </div>
            )
          })}
        </div>

        {/* Bookings bar chart */}
        <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <p className="text-white font-bold text-sm mb-4">Bookings This Week</p>
          <div className="flex items-end gap-1 h-24 mb-2">
            {WEEKLY.map((d, i) => {
              const h = (d.bookings / maxBookings) * 96
              const isToday = i === 4
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#555]">{d.bookings}</span>
                  <div className="w-full rounded-t-sm transition-all" style={{
                    height: `${h}px`,
                    backgroundColor: isToday ? '#CAFF00' : '#2A2A2A',
                  }} />
                </div>
              )
            })}
          </div>
          <div className="flex">
            {WEEKLY.map(d => (
              <div key={d.day} className="flex-1 text-center text-[10px] text-[#555]">{d.day}</div>
            ))}
          </div>
        </div>

        {/* Peak hours */}
        <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <p className="text-white font-bold text-sm mb-4">Peak Hours</p>
          <div className="space-y-2">
            {PEAK_HOURS.map(h => (
              <div key={h.hour} className="flex items-center gap-3">
                <span className="text-[#555] text-xs w-10 shrink-0">{h.hour}</span>
                <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${h.pct}%`,
                    backgroundColor: h.pct >= 90 ? '#FF3547' : h.pct >= 70 ? '#FF9500' : '#CAFF00',
                  }} />
                </div>
                <span className="text-[#555] text-xs w-8 text-right">{h.pct}%</span>
              </div>
            ))}
          </div>
          <p className="text-[#555] text-xs mt-3">💡 Add flash slots at 12:00 and 13:00 to capture lunchtime demand</p>
        </div>

        {/* Class performance */}
        <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <p className="text-white font-bold text-sm mb-4">Class Performance</p>
          <div className="space-y-4">
            {CLASS_PERF.map(c => (
              <div key={c.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-medium">{c.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#555] text-xs">{c.bookings} bookings</span>
                    <span className="text-[#CAFF00] text-xs font-bold">R{(c.revenue / 1000).toFixed(1)}k</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#CAFF00] rounded-full" style={{ width: `${c.fill}%` }} />
                  </div>
                  <span className="text-[#555] text-xs w-8">{c.fill}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flash slot insight */}
        <div className="p-4 rounded-2xl bg-[#FF3547]/10 border border-[#FF3547]/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#FF3547] shrink-0 mt-0.5" fill="#FF3547" />
            <div>
              <p className="text-white font-bold text-sm">Flash Slot Impact</p>
              <p className="text-[#888] text-xs mt-1">Your 3 flash slots this week filled in under 8 minutes on average. Flash members spend 34% more per session.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Users, Building2, TrendingUp, Zap, ArrowUp, Activity, DollarSign, Calendar } from 'lucide-react'
import { ADMIN_PLATFORM_STATS } from '../../data/mockData'

const RECENT_ACTIVITY = [
  { text: 'New gym application: SteelWorks Gym', time: '6m ago', type: 'gym', color: '#CAFF00' },
  { text: 'Flash slot dropped: Velocity Gym HIIT', time: '12m ago', type: 'flash', color: '#FF3547' },
  { text: 'Payout processed: R18,240 to 12 gyms', time: '1h ago', type: 'payout', color: '#00FF6A' },
  { text: 'New member: Nomvula Dlamini (Sea Point)', time: '1h ago', type: 'user', color: '#0EA5E9' },
  { text: 'Support ticket resolved: booking dispute', time: '2h ago', type: 'support', color: '#FF9500' },
  { text: 'Surge: 312 active bookings today (+18%)', time: '3h ago', type: 'stats', color: '#CAFF00' },
]

const WEEKLY_REV = [88, 102, 96, 118, 135, 142, 124]
const maxRev = Math.max(...WEEKLY_REV)

export function AdminOverview() {
  const s = ADMIN_PLATFORM_STATS

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-xl">bare</span>
              <span className="text-[10px] font-black bg-[#FF3547] text-white px-2 py-0.5 rounded-full tracking-widest">ADMIN</span>
            </div>
            <p className="text-[#555] text-xs">Platform Command Centre</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#00FF6A]/10 border border-[#00FF6A]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF6A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF6A]" />
            </span>
            <span className="text-[#00FF6A] text-xs font-bold">LIVE</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Live banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#CAFF00]/10 to-transparent border border-[#CAFF00]/20">
          <div className="flex items-baseline gap-2">
            <span className="text-[#CAFF00] font-black text-4xl">{s.activeSessionsNow}</span>
            <span className="text-[#888] text-sm">members training right now</span>
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-[#555] text-xs">{s.totalBookingsToday} bookings today</span>
            <span className="text-[#555] text-xs">R{(s.revenueToday / 1000).toFixed(1)}k revenue</span>
            <span className="text-[#555] text-xs">{s.newUsersToday} new users</span>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Members', value: s.totalUsers.toLocaleString(), icon: Users, color: '#0EA5E9', change: `+${s.newUsersMonth} this month` },
            { label: 'Active Gyms', value: s.totalGyms, icon: Building2, color: '#CAFF00', change: '2 pending approval' },
            { label: 'Monthly Revenue', value: `R${(s.revenueMonth / 1000000).toFixed(2)}M`, icon: DollarSign, color: '#00FF6A', change: '+18% vs last month' },
            { label: 'Commission', value: `R${(s.commissionMonth / 1000).toFixed(0)}k`, icon: TrendingUp, color: '#FF9500', change: '20% of bookings' },
            { label: 'Monthly Bookings', value: s.totalBookingsMonth.toLocaleString(), icon: Calendar, color: '#EC4899', change: `+${Math.round(s.totalBookingsMonth * 0.15)} vs last` },
            { label: 'Avg Booking', value: `R${s.avgBookingValue}`, icon: Activity, color: '#7C3AED', change: `${100 - s.churnRate}% retention` },
          ].map(k => {
            const Icon = k.icon
            return (
              <div key={k.label} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}18` }}>
                    <Icon className="w-4 h-4" style={{ color: k.color }} />
                  </div>
                  <ArrowUp className="w-3 h-3 text-[#00FF6A]" />
                </div>
                <p className="text-white font-black text-xl">{k.value}</p>
                <p className="text-[#555] text-xs mt-0.5">{k.label}</p>
                <p className="text-[#333] text-[10px] mt-1">{k.change}</p>
              </div>
            )
          })}
        </div>

        {/* Revenue chart */}
        <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold text-sm">Weekly Revenue (R'000)</p>
            <span className="flex items-center gap-1 text-[#00FF6A] text-xs font-bold"><ArrowUp className="w-3 h-3" />+18%</span>
          </div>
          <div className="flex items-end gap-1 h-20 mb-2">
            {WEEKLY_REV.map((v, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{
                height: `${(v / maxRev) * 80}px`,
                backgroundColor: i === WEEKLY_REV.length - 1 ? '#CAFF00' : '#2A2A2A',
              }} />
            ))}
          </div>
          <div className="flex justify-between text-[#333] text-[10px]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Recent Activity</p>
          <div className="space-y-2">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
                <p className="text-[#888] text-sm flex-1">{a.text}</p>
                <span className="text-[#333] text-xs shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

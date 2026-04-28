import { DollarSign, TrendingUp, ArrowUp, Building2, Calendar, Download } from 'lucide-react'
import { ADMIN_PLATFORM_STATS } from '../../data/mockData'
import { format, subDays } from 'date-fns'

const PAYOUT_HISTORY = [
  { date: subDays(new Date(), 7), gyms: 48, amount: 142800, status: 'paid' },
  { date: subDays(new Date(), 14), gyms: 46, amount: 138400, status: 'paid' },
  { date: subDays(new Date(), 21), gyms: 44, amount: 121600, status: 'paid' },
  { date: subDays(new Date(), 28), gyms: 41, amount: 108000, status: 'paid' },
]

const TOP_EARNERS = [
  { name: 'Velocity Gym', suburb: 'Sea Point', revenue: 89400, commission: 17880, bookings: 596 },
  { name: 'Surf & Sweat', suburb: 'Camps Bay', revenue: 76200, commission: 15240, bookings: 381 },
  { name: 'The Grid', suburb: 'Woodstock', revenue: 68900, commission: 13780, bookings: 383 },
  { name: 'Forma Pilates', suburb: 'Gardens', revenue: 61600, commission: 12320, bookings: 220 },
  { name: 'Atlas Strength', suburb: 'Green Point', revenue: 58400, commission: 11680, bookings: 324 },
]

const MONTHLY = [62, 78, 84, 96, 108, 118, 124, 132, 128, 136, 142, 0]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const maxM = Math.max(...MONTHLY)

export function AdminRevenue() {
  const s = ADMIN_PLATFORM_STATS

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Revenue</h1>
            <p className="text-[#555] text-xs">Platform financials</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] border border-[#1E1E1E] text-[#888] text-xs font-medium">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Hero stats */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#242424] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#CAFF00]/5 blur-2xl" />
          <p className="text-[#555] text-xs font-semibold uppercase tracking-widest mb-1">Monthly GMV</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[#CAFF00] font-black text-4xl">R{(s.revenueMonth / 1_000_000).toFixed(2)}M</span>
            <span className="flex items-center gap-1 text-[#00FF6A] text-sm font-bold"><ArrowUp className="w-3.5 h-3.5" />18%</span>
          </div>
          <p className="text-[#555] text-sm">Bare commission: <span className="text-white font-bold">R{(s.commissionMonth / 1000).toFixed(0)}k</span> (20%)</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Today\'s GMV', value: `R${(s.revenueToday / 1000).toFixed(1)}k`, icon: DollarSign, color: '#CAFF00' },
            { label: 'Today\'s Commission', value: `R${(s.revenueToday * 0.2 / 1000).toFixed(1)}k`, icon: TrendingUp, color: '#00FF6A' },
            { label: 'Pending Payouts', value: 'R178.2k', icon: Building2, color: '#FF9500' },
            { label: 'Avg Booking Value', value: `R${s.avgBookingValue}`, icon: Calendar, color: '#0EA5E9' },
          ].map(k => {
            const Icon = k.icon
            return (
              <div key={k.label} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${k.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                <p className="text-white font-black text-xl">{k.value}</p>
                <p className="text-[#555] text-xs mt-0.5">{k.label}</p>
              </div>
            )
          })}
        </div>

        {/* Annual chart */}
        <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <p className="text-white font-bold text-sm mb-4">Monthly GMV (R'000) — 2024</p>
          <div className="flex items-end gap-1 h-24 mb-2">
            {MONTHLY.map((v, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{
                height: v > 0 ? `${(v / maxM) * 96}px` : '4px',
                backgroundColor: i === new Date().getMonth() ? '#CAFF00' : v > 0 ? '#2A2A2A' : '#1A1A1A',
              }} />
            ))}
          </div>
          <div className="flex">
            {MONTHS.map(m => <div key={m} className="flex-1 text-center text-[9px] text-[#333]">{m}</div>)}
          </div>
        </div>

        {/* Payout schedule */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Payout Schedule</p>
            <button className="px-3 py-1.5 rounded-xl bg-[#CAFF00] text-black text-xs font-bold">Run Payout</button>
          </div>
          <div className="space-y-2">
            {PAYOUT_HISTORY.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="w-8 h-8 rounded-xl bg-[#00FF6A]/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-[#00FF6A]" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{format(p.date, 'dd MMM yyyy')} — Friday payout</p>
                  <p className="text-[#555] text-xs">{p.gyms} gyms · avg R{Math.round(p.amount / p.gyms).toLocaleString()}/gym</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">R{(p.amount / 1000).toFixed(1)}k</p>
                  <span className="text-[#00FF6A] text-[10px] font-bold">PAID</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top earning gyms */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Top Earning Gyms — This Month</p>
          <div className="space-y-2">
            {TOP_EARNERS.map((g, i) => (
              <div key={g.name} className="flex items-center gap-3 p-3 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-[#555] text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{g.name}</p>
                  <p className="text-[#555] text-xs">{g.suburb} · {g.bookings} bookings</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-bold text-sm">R{(g.revenue / 1000).toFixed(1)}k</p>
                  <p className="text-[#555] text-[10px]">R{(g.commission / 1000).toFixed(1)}k to Bare</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

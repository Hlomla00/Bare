import { TrendingUp, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { PARTNER_STATS } from '../../data/mockData'

interface Payout {
  id: string
  date: Date
  amount: number
  sessions: number
  status: 'paid' | 'pending'
}

const PAYOUTS: Payout[] = [
  { id: 'p1', date: subDays(new Date(), 7), amount: 18240, sessions: 152, status: 'paid' },
  { id: 'p2', date: subDays(new Date(), 14), amount: 21360, sessions: 178, status: 'paid' },
  { id: 'p3', date: subDays(new Date(), 21), amount: 19680, sessions: 164, status: 'paid' },
  { id: 'p4', date: subDays(new Date(), 28), amount: 22560, sessions: 188, status: 'paid' },
]

const WEEKLY_DATA = [
  { label: 'Mon', amount: 3200 },
  { label: 'Tue', amount: 4100 },
  { label: 'Wed', amount: 2800 },
  { label: 'Thu', amount: 4800 },
  { label: 'Fri', amount: 5200 },
  { label: 'Sat', amount: 6400 },
  { label: 'Sun', amount: 3900 },
]

const maxAmount = Math.max(...WEEKLY_DATA.map((d) => d.amount))

export function Earnings() {
  const today = new Date()

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="px-4 py-4">
          <h1 className="text-white font-black text-2xl">Earnings</h1>
          <p className="text-[#555] text-sm">Net after Bare's 20% commission</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* MTD hero */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0A1A00] to-[#111] border border-[#CAFF00]/20 p-5 space-y-1">
          <p className="text-[#CAFF00]/60 text-xs font-bold uppercase tracking-widest">This month</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[#CAFF00] font-black text-4xl">R{(PARTNER_STATS.monthRevenue * 0.8).toLocaleString()}</span>
          </div>
          <p className="text-[#888] text-sm">from {Math.round(PARTNER_STATS.monthRevenue / 150)} sessions</p>
          <div className="flex items-center gap-1.5 pt-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00FF6A]" />
            <span className="text-[#00FF6A] text-xs font-semibold">+18% vs last month</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4">
            <p className="text-[#555] text-xs uppercase tracking-widest mb-1">This week</p>
            <p className="text-white font-black text-2xl">R{(PARTNER_STATS.weekRevenue * 0.8).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4">
            <p className="text-[#555] text-xs uppercase tracking-widest mb-1">Pending payout</p>
            <p className="text-[#CAFF00] font-black text-2xl">R{PARTNER_STATS.pendingPayout.toLocaleString()}</p>
            <p className="text-[#555] text-xs mt-0.5">Settles Friday</p>
          </div>
        </div>

        {/* Weekly chart */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-sm">This Week</h2>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#CAFF00]" />
              <span className="text-[#CAFF00] text-xs font-semibold">+12%</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-24">
            {WEEKLY_DATA.map((day) => {
              const pct = (day.amount / maxAmount) * 100
              const isToday = day.label === format(today, 'EEE').slice(0, 3)
              return (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: isToday ? '#CAFF00' : '#1E1E1E',
                    }}
                  />
                  <span className={`text-[9px] font-medium ${isToday ? 'text-[#CAFF00]' : 'text-[#444]'}`}>
                    {day.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payout history */}
        <div>
          <h2 className="text-white font-bold text-sm mb-3">Payout History</h2>
          <div className="space-y-2">
            {/* Next pending */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#CAFF00]/5 border border-[#CAFF00]/20">
              <div className="w-10 h-10 rounded-xl bg-[#CAFF00]/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#CAFF00]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Upcoming payout</p>
                <p className="text-[#888] text-xs">Settling {format(subDays(today, -4), 'EEEE d MMM')}</p>
              </div>
              <div className="text-right">
                <p className="text-[#CAFF00] font-bold">R{PARTNER_STATS.pendingPayout.toLocaleString()}</p>
                <p className="text-[#555] text-xs">pending</p>
              </div>
            </div>

            {PAYOUTS.map((payout) => (
              <div key={payout.id} className="flex items-center gap-3 p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="w-10 h-10 rounded-xl bg-[#00FF6A]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF6A]" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{payout.sessions} sessions</p>
                  <p className="text-[#888] text-xs">{format(payout.date, 'EEE d MMM yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">R{payout.amount.toLocaleString()}</p>
                  <p className="text-[#00FF6A] text-xs">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bare commission note */}
        <div className="rounded-2xl bg-[#0F0F0F] border border-[#1A1A1A] p-4">
          <p className="text-[#444] text-xs leading-relaxed">
            Bare holds payment and pays you 80% of each booking within 7 days of confirmed check-in.
            Payouts are made every Friday via EFT to your registered bank account.
            The 20% Bare fee covers platform access, payment processing, and customer support.
          </p>
        </div>
      </div>
    </div>
  )
}

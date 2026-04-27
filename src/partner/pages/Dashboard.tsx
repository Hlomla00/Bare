import { TrendingUp, Users, Zap, Clock, ChevronRight, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { PARTNER_STATS, PARTNER_GYM, PARTNER_SLOTS, MOCK_BOOKINGS } from '../../data/mockData'
import { useAuth } from '../../hooks/useAuth'

function StatCard({
  label,
  value,
  sub,
  trend,
  accent,
}: {
  label: string
  value: string
  sub?: string
  trend?: string
  accent?: string
}) {
  return (
    <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4 space-y-1">
      <p className="text-[#555] text-xs font-medium uppercase tracking-widest">{label}</p>
      <p className="text-white font-black text-2xl" style={accent ? { color: accent } : undefined}>{value}</p>
      {sub && <p className="text-[#555] text-xs">{sub}</p>}
      {trend && (
        <div className="flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3 text-[#00FF6A]" />
          <span className="text-[#00FF6A] text-xs font-semibold">{trend}</span>
        </div>
      )}
    </div>
  )
}

function LiveBookingRow({ name, slotTitle, time }: { name: string; slotTitle: string; time: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#1A1A1A] last:border-0">
      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-sm font-bold text-[#888]">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium leading-tight truncate">{name}</p>
        <p className="text-[#555] text-xs">{slotTitle}</p>
      </div>
      <span className="text-[#555] text-xs shrink-0">{time}</span>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth('partner')
  const upcomingSlot = PARTNER_SLOTS.find((s) => s.status === 'open')

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="px-4 pt-safe pt-6 pb-4 border-b border-[#1E1E1E]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#555] text-sm">Welcome back,</p>
            <h1 className="text-white font-black text-xl">{user?.name?.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FF6A]/10 border border-[#00FF6A]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF6A] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF6A]" />
              </span>
              <span className="text-[#00FF6A] text-xs font-bold">Live</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#242424] flex items-center justify-center text-sm font-bold text-[#888]">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
        <div className="mt-1">
          <p className="text-[#888] text-sm font-medium">{PARTNER_GYM.name}</p>
          <p className="text-[#444] text-xs">{PARTNER_GYM.suburb} · Bare Score {PARTNER_GYM.bare_score}★</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Today's stats */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm">Today</h2>
            <span className="text-[#555] text-xs">{format(new Date(), 'EEE d MMM')}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Bookings"
              value={String(PARTNER_STATS.todayBookings)}
              sub="across all slots"
              trend="+12% vs last week"
            />
            <StatCard
              label="Revenue"
              value={`R${(PARTNER_STATS.todayRevenue).toLocaleString()}`}
              sub="before Bare fee"
              accent="#CAFF00"
            />
            <StatCard
              label="Capacity"
              value={`${PARTNER_STATS.capacityUtil}%`}
              sub="utilisation"
            />
            <StatCard
              label="Pending payout"
              value={`R${(PARTNER_STATS.pendingPayout).toLocaleString()}`}
              sub="settles Friday"
            />
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-white font-bold text-sm mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/partner/slots')}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-[#CAFF00]/5 border border-[#CAFF00]/20 active:bg-[#CAFF00]/10 transition-colors text-left"
            >
              <Clock className="w-5 h-5 text-[#CAFF00]" />
              <span className="text-white font-semibold text-sm">Add Slot</span>
              <span className="text-[#888] text-xs">Create a new time slot</span>
            </button>
            <button
              onClick={() => navigate('/partner/slots')}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-[#FF3547]/5 border border-[#FF3547]/20 active:bg-[#FF3547]/10 transition-colors text-left"
            >
              <Zap className="w-5 h-5 text-[#FF3547]" fill="currentColor" />
              <span className="text-white font-semibold text-sm">Flash Slot</span>
              <span className="text-[#888] text-xs">60-min urgent booking</span>
            </button>
            <button
              onClick={() => navigate('/partner/bookings')}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-[#111] border border-[#1E1E1E] active:bg-[#1A1A1A] transition-colors text-left"
            >
              <Users className="w-5 h-5 text-[#888]" />
              <span className="text-white font-semibold text-sm">Check-ins</span>
              <span className="text-[#888] text-xs">Manage today's members</span>
            </button>
            <button
              onClick={() => navigate('/partner/earnings')}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-[#111] border border-[#1E1E1E] active:bg-[#1A1A1A] transition-colors text-left"
            >
              <TrendingUp className="w-5 h-5 text-[#888]" />
              <span className="text-white font-semibold text-sm">Earnings</span>
              <span className="text-[#888] text-xs">Revenue & payouts</span>
            </button>
          </div>
        </section>

        {/* Upcoming slot */}
        {upcomingSlot && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-sm">Next Slot</h2>
              <button
                onClick={() => navigate('/partner/slots')}
                className="flex items-center gap-1 text-[#CAFF00] text-xs font-semibold"
              >
                All slots <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-bold">{upcomingSlot.title}</p>
                  <p className="text-[#888] text-sm">{format(new Date(upcomingSlot.start_time), 'HH:mm')} – {format(new Date(upcomingSlot.end_time), 'HH:mm')}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#CAFF00]/10 text-[#CAFF00] text-xs font-bold">
                  {upcomingSlot.class_type}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">
                    {upcomingSlot.bare_allocation - upcomingSlot.spots_remaining}/{upcomingSlot.bare_allocation} booked
                  </span>
                  <span className="text-[#CAFF00]">
                    {Math.round(((upcomingSlot.bare_allocation - upcomingSlot.spots_remaining) / upcomingSlot.bare_allocation) * 100)}% full
                  </span>
                </div>
                <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CAFF00] rounded-full"
                    style={{
                      width: `${((upcomingSlot.bare_allocation - upcomingSlot.spots_remaining) / upcomingSlot.bare_allocation) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent bookings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm">Recent Bookings</h2>
            <button
              onClick={() => navigate('/partner/bookings')}
              className="flex items-center gap-1 text-[#CAFF00] text-xs font-semibold"
            >
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] px-4">
            <LiveBookingRow name="Sarah M." slotTitle="Morning HIIT Blast" time="2m ago" />
            <LiveBookingRow name="James K." slotTitle="Morning HIIT Blast" time="15m ago" />
            <LiveBookingRow name="Aisha P." slotTitle="Evening HIIT" time="1h ago" />
            <LiveBookingRow name="Theo M." slotTitle="Morning HIIT Blast" time="2h ago" />
          </div>
        </section>
      </div>
    </div>
  )
}

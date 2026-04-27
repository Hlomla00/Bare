import { useState } from 'react'
import { Bell, MapPin, Search, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSlots } from '../../hooks/useSlots'
import { useActiveDots } from '../../hooks/useActiveDots'
import { useAuth } from '../../hooks/useAuth'
import { SlotCard, SlotCardSkeleton } from '../../components/SlotCard'
import { FlashBanner } from '../../components/FlashBanner'
import { SuburbFilter } from '../../components/SuburbFilter'
import { SUBURBS, CLASS_TYPES, MOCK_NOTIFICATIONS } from '../../data/mockData'

function CityPulse({ count }: { count: number }) {
  return (
    <div className="mx-4 mb-4 rounded-2xl bg-[#111] border border-[#1E1E1E] p-5 overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#CAFF00]/5 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-[#CAFF00]/5 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[#CAFF00] text-5xl font-black tabular-nums leading-none">{count}</span>
              <span className="text-[#888] text-sm">people</span>
            </div>
            <p className="text-white font-semibold mt-1">training in Cape Town right now</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#00FF6A]/10 border border-[#00FF6A]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF6A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF6A]" />
            </span>
            <span className="text-[#00FF6A] text-xs font-bold">LIVE</span>
          </div>
        </div>

        {/* Activity bar */}
        <div className="space-y-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [20, 30, 55, 70, 90, 95, 80, 60, 45, 40, 50, 65, 55, 45, 40, 55, 75, 90, 85, 70, 50, 35, 25, 15]
              const h = heights[i]
              const currentHour = new Date().getHours()
              const isActive = i === currentHour
              const isPast = i < currentHour
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all ${isActive ? 'bg-[#CAFF00]' : isPast ? 'bg-[#333]' : 'bg-[#1E1E1E]'}`}
                  style={{ height: `${Math.max(4, (h / 100) * 40)}px` }}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-[#333] text-[9px] font-medium">
            <span>12AM</span>
            <span className="text-[#CAFF00]">Now</span>
            <span>11PM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClassTypeFilter({ types, selected, onChange }: { types: string[]; selected: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            selected === type
              ? 'bg-[#CAFF00]/10 text-[#CAFF00] border-[#CAFF00]/40'
              : 'bg-transparent text-[#555] border-[#242424]'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  )
}

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [suburb, setSuburb] = useState('All')
  const [classType, setClassType] = useState('All')
  const { flashSlots, regularSlots, loading } = useSlots({ suburb, classType })
  const { liveCount } = useActiveDots()
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="flex items-center gap-2 bg-[#151515] rounded-full px-3 py-2 border border-[#242424]"
            onClick={() => {}}
          >
            <MapPin className="w-3.5 h-3.5 text-[#CAFF00]" />
            <span className="text-white text-sm font-medium">{user?.location_suburb ?? 'Cape Town'}</span>
            <span className="text-[#555] text-sm">▾</span>
          </button>

          <div className="flex items-center gap-1">
            <span className="text-white font-black text-xl tracking-tighter">bare</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-full bg-[#151515] border border-[#242424]"
              onClick={() => navigate('/app/notifications')}
            >
              <Bell className="w-4.5 h-4.5 text-white w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF3547] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/app/profile')}
              className="w-8 h-8 rounded-full bg-[#CAFF00] flex items-center justify-center text-black font-bold text-sm"
            >
              {user?.name?.charAt(0) ?? 'J'}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-[#151515] rounded-2xl px-4 py-3 border border-[#242424]">
            <Search className="w-4 h-4 text-[#555] shrink-0" />
            <span className="text-[#555] text-sm">Find gyms, classes, suburbs...</span>
          </div>
        </div>
      </div>

      {/* City Pulse */}
      <div className="pt-4">
        <CityPulse count={liveCount} />
      </div>

      {/* Flash banners */}
      {flashSlots.map((slot) => (
        <FlashBanner key={slot.id} slot={slot} />
      ))}

      {/* Filters */}
      <div className="space-y-2 mb-4">
        <SuburbFilter suburbs={SUBURBS} selected={suburb} onChange={setSuburb} />
        <ClassTypeFilter types={CLASS_TYPES} selected={classType} onChange={setClassType} />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#CAFF00]" />
          <span className="text-white font-bold">Available Now</span>
          {!loading && <span className="text-[#555] text-sm">({regularSlots.length})</span>}
        </div>
        <button className="text-[#CAFF00] text-sm font-semibold">See all</button>
      </div>

      {/* Slots feed */}
      <div className="px-4 space-y-3">
        {loading ? (
          <>
            <SlotCardSkeleton />
            <SlotCardSkeleton />
            <SlotCardSkeleton />
          </>
        ) : regularSlots.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-[#555] text-lg">No slots available</p>
            <p className="text-[#333] text-sm">Try a different suburb or class type</p>
          </div>
        ) : (
          regularSlots.map((slot) => <SlotCard key={slot.id} slot={slot} />)
        )}
      </div>
    </div>
  )
}

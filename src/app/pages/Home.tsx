import { useState, useRef } from 'react'
import { Bell, MapPin, Search, X, TrendingUp, Map, List } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRealtimeSlots, useLiveCount } from '../../hooks/useRealtimeSlots'
import { useAuth } from '../../hooks/useAuth'
import { SlotCard, SlotCardSkeleton } from '../../components/SlotCard'
import { FlashBanner } from '../../components/FlashBanner'
import { SuburbFilter } from '../../components/SuburbFilter'
import { MapView } from './MapView'
import { SUBURBS, CLASS_TYPES, MOCK_NOTIFICATIONS, MOCK_GYMS, MOCK_SLOTS } from '../../data/mockData'
import { useFlashSlotDemo } from '../../hooks/useNotifications'
import type { Slot } from '../../types'

// ─── City Pulse ─────────────────────────────────────────────────────────────
function CityPulse({ count }: { count: number }) {
  const hours = Array.from({ length: 24 })
  const peakPattern = [10, 25, 45, 65, 90, 98, 85, 60, 45, 42, 50, 62, 58, 48, 44, 60, 80, 95, 88, 72, 52, 38, 26, 14]
  const currentHour = new Date().getHours()

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-[#111] border border-[#1E1E1E] p-5 overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#CAFF00]/4 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#CAFF00]/4 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[#CAFF00] text-5xl font-black tabular-nums leading-none transition-all duration-700">
                {count}
              </span>
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

        {/* Hourly activity bars */}
        <div className="flex items-end gap-0.5 h-10 mb-1">
          {hours.map((_, i) => {
            const h = peakPattern[i]
            const isNow = i === currentHour
            const isPast = i < currentHour
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${Math.max(10, (h / 100) * 40)}px`,
                  backgroundColor: isNow ? '#CAFF00' : isPast ? '#2A2A2A' : '#1A1A1A',
                  opacity: isNow ? 1 : isPast ? 0.7 : 0.5,
                }}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-[#333] text-[9px] font-medium px-0.5">
          <span>12am</span>
          <span className="text-[#CAFF00] font-bold">Now</span>
          <span>11pm</span>
        </div>
      </div>
    </div>
  )
}

// ─── View toggle ─────────────────────────────────────────────────────────────
function ViewToggle({
  view,
  onChange,
}: {
  view: 'feed' | 'map'
  onChange: (v: 'feed' | 'map') => void
}) {
  return (
    <div className="flex items-center gap-1 mx-4 mb-3 p-1 rounded-2xl bg-[#111] border border-[#1E1E1E]">
      {(['feed', 'map'] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            view === v
              ? 'bg-[#CAFF00] text-black'
              : 'text-[#555]'
          }`}
        >
          {v === 'feed' ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
          {v === 'feed' ? 'Feed' : 'Map'}
        </button>
      ))}
    </div>
  )
}

// ─── Search overlay ───────────────────────────────────────────────────────────
function SearchResults({ query, onClose }: { query: string; onClose: () => void }) {
  const navigate = useNavigate()
  const q = query.toLowerCase()

  const matchedGyms = MOCK_GYMS.filter(
    (g) =>
      g.name.toLowerCase().includes(q) ||
      g.suburb.toLowerCase().includes(q) ||
      g.vibe_tags.some((t) => t.toLowerCase().includes(q))
  )

  const matchedSlots = MOCK_SLOTS.filter(
    (s) =>
      s.status === 'open' &&
      s.spots_remaining > 0 &&
      (s.title.toLowerCase().includes(q) ||
        s.class_type.toLowerCase().includes(q) ||
        s.gym?.name?.toLowerCase().includes(q) ||
        s.gym?.suburb?.toLowerCase().includes(q))
  )

  return (
    <div className="absolute inset-0 z-50 bg-[#0A0A0A] overflow-y-auto scrollbar-none pb-24">
      <div className="px-4 pt-2 space-y-5">
        {matchedGyms.length > 0 && (
          <section>
            <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-2">Gyms</p>
            <div className="space-y-2">
              {matchedGyms.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { navigate(`/app/gym/${g.id}`); onClose() }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#111] border border-[#1E1E1E] text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#242424] flex items-center justify-center text-[#CAFF00] font-black text-sm shrink-0">
                    {g.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{g.name}</p>
                    <p className="text-[#555] text-xs">{g.suburb} · {g.bare_score}★</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {matchedSlots.length > 0 && (
          <section>
            <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-2">Available Slots</p>
            <div className="space-y-3">
              {matchedSlots.map((s) => (
                <SlotCard key={s.id} slot={s} />
              ))}
            </div>
          </section>
        )}

        {matchedGyms.length === 0 && matchedSlots.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <p className="text-[#555] text-lg">No results for "{query}"</p>
            <p className="text-[#333] text-sm">Try a suburb, gym name, or class type</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Class type filter chips ──────────────────────────────────────────────────
function ClassFilter({ types, selected, onChange }: { types: string[]; selected: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
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

// ─── Home ─────────────────────────────────────────────────────────────────────
export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [view, setView] = useState<'feed' | 'map'>('feed')
  const [suburb, setSuburb] = useState('All')
  const [classType, setClassType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const { slots, flashSlots, allSlots } = useRealtimeSlots()
  const liveCount = useLiveCount()

  useFlashSlotDemo()

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  // Apply suburb + class filters to open slots
  const filteredSlots = slots.filter((s) => {
    const suburbMatch = suburb === 'All' || s.gym?.suburb === suburb
    const classMatch = classType === 'All' || s.class_type === classType
    return suburbMatch && classMatch && !s.is_flash
  })

  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="flex items-center gap-2 bg-[#151515] rounded-full px-3 py-2 border border-[#242424]">
            <MapPin className="w-3.5 h-3.5 text-[#CAFF00]" />
            <span className="text-white text-sm font-medium">{user?.location_suburb ?? 'Cape Town'}</span>
            <span className="text-[#555] text-xs">▾</span>
          </button>

          <span className="text-white font-black text-2xl tracking-tighter">bare</span>

          <div className="flex items-center gap-2">
            <button
              className="relative p-2 rounded-full bg-[#151515] border border-[#242424]"
              onClick={() => navigate('/app/notifications')}
            >
              <Bell className="w-5 h-5 text-white" />
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

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-[#151515] rounded-2xl px-4 py-3 border border-[#242424]">
            <Search className="w-4 h-4 text-[#555] shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchActive(true)}
              placeholder="Gyms, classes, suburbs..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#444] focus:outline-none"
            />
            {searchActive && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSearchActive(false)
                  searchRef.current?.blur()
                }}
              >
                <X className="w-4 h-4 text-[#555]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchActive && searchQuery.length > 0 && (
        <SearchResults query={searchQuery} onClose={() => { setSearchActive(false); setSearchQuery('') }} />
      )}

      {/* View toggle */}
      <ViewToggle view={view} onChange={setView} />

      {/* MAP view */}
      {view === 'map' ? (
        <MapView heightStyle="calc(100dvh - 195px)" />
      ) : (
        /* FEED view */
        <div className="pb-24 overflow-y-auto scrollbar-none">
          {/* City pulse */}
          <CityPulse count={liveCount} />

          {/* Flash banners */}
          {flashSlots.map((s) => (
            <FlashBanner key={s.id} slot={s} />
          ))}

          {/* Filters */}
          <div className="space-y-2 mb-4">
            <SuburbFilter suburbs={SUBURBS} selected={suburb} onChange={setSuburb} />
            <ClassFilter types={CLASS_TYPES} selected={classType} onChange={setClassType} />
          </div>

          {/* Slot feed header */}
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#CAFF00]" />
              <span className="text-white font-bold">Available Now</span>
              <span className="text-[#555] text-sm">({filteredSlots.length})</span>
            </div>
          </div>

          {/* Slots */}
          <div className="px-4 space-y-3">
            {filteredSlots.length === 0 ? (
              allSlots.length === 0 ? (
                <>
                  <SlotCardSkeleton />
                  <SlotCardSkeleton />
                  <SlotCardSkeleton />
                </>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <p className="text-[#555] text-lg">No slots available</p>
                  <p className="text-[#333] text-sm">Try a different suburb or class type</p>
                </div>
              )
            ) : (
              filteredSlots.map((s) => <SlotCard key={s.id} slot={s} />)
            )}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import { X, Star, Zap, Clock, MapPin } from 'lucide-react'
import { MOCK_GYMS, MOCK_SLOTS } from '../../data/mockData'
import { useActiveDots } from '../../hooks/useActiveDots'
import { useRealtimeSlots } from '../../hooks/useRealtimeSlots'
import type { Gym, Slot } from '../../types'
import { format } from 'date-fns'
import { CountdownTimer } from '../../components/CountdownTimer'

// Cape Town centre
const CT: [number, number] = [-33.9249, 18.4241]

// Fix default icon (required in Vite builds)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function buildIcon(spotsLeft: number, hasFlash: boolean, isLive: boolean, selected: boolean): L.DivIcon {
  const bg =
    isLive      ? '#FF3547'
    : hasFlash  ? '#FF3547'
    : spotsLeft === 0 ? '#2A2A2A'
    : spotsLeft <= 2  ? '#FF9500'
    : '#CAFF00'

  const textColor = (bg === '#CAFF00' || bg === '#FF9500') ? '#000' : '#fff'
  const size = selected ? 50 : 40
  const border = selected
    ? '3px solid #fff'
    : '2.5px solid rgba(0,0,0,0.85)'
  const shadow = selected
    ? '0 0 0 4px rgba(202,255,0,0.35), 0 6px 20px rgba(0,0,0,0.7)'
    : '0 3px 12px rgba(0,0,0,0.6)'

  const ping = isLive
    ? `<div style="position:absolute;top:${-(size * 0.2)}px;left:${-(size * 0.2)}px;
        width:${size * 1.4}px;height:${size * 1.4}px;border-radius:50%;
        border:2.5px solid #FF3547;opacity:0;
        animation:mapPing 1.6s cubic-bezier(0,0,0.2,1) infinite;"></div>`
    : ''

  const label = spotsLeft === 0 ? '✕' : spotsLeft > 9 ? '9+' : String(spotsLeft)

  return L.divIcon({
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      ${ping}
      <div style="width:${size}px;height:${size}px;border-radius:50%;
        background:${bg};border:${border};
        display:flex;align-items:center;justify-content:center;
        color:${textColor};font-weight:900;font-size:${selected ? 15 : 13}px;
        font-family:Inter,system-ui,sans-serif;
        box-shadow:${shadow};cursor:pointer;
        transition:box-shadow 0.2s,width 0.2s,height 0.2s;">
        ${label}
      </div>
    </div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Forces the map to re-measure its container when mounted inside a flex layout
function SizeAware() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(t)
  }, [map])
  return null
}

// ---------- Bottom Sheet ----------
interface SheetProps {
  gym: Gym
  slots: Slot[]
  onClose: () => void
}

function GymSheet({ gym, slots, onClose }: SheetProps) {
  const navigate = useNavigate()
  const gymSlots = slots.filter(
    (s) => s.gym_id === gym.id && s.status === 'open' && s.spots_remaining > 0
  )

  return (
    <>
      {/* Tap-away backdrop */}
      <div className="absolute inset-0 z-[450]" onClick={onClose} />

      <div className="absolute bottom-0 left-0 right-0 z-[460] max-h-[62vh] flex flex-col rounded-t-3xl bg-[#0F0F0F] border-t border-[#1E1E1E] overflow-hidden animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-[#2A2A2A] rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-4 pb-8 scrollbar-none">
          {/* Gym header */}
          <div className="flex items-start justify-between pt-2 mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-black text-xl leading-tight">{gym.name}</h2>
                {gym.verified && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#CAFF00] flex items-center justify-center text-black text-[9px] font-black">✓</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[#888] text-sm">
                  <MapPin className="w-3.5 h-3.5" />{gym.suburb}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-3.5 h-3.5 text-[#CAFF00]" fill="#CAFF00" />
                  <span className="text-white font-bold">{gym.bare_score}</span>
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#1A1A1A] border border-[#242424] shrink-0"
            >
              <X className="w-4 h-4 text-[#666]" />
            </button>
          </div>

          {/* Vibe tags */}
          <div className="flex gap-2 flex-wrap mb-4">
            {gym.vibe_tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-[#1A1A1A] text-[#888] border border-[#242424]">
                {tag}
              </span>
            ))}
          </div>

          {/* Slots */}
          {gymSlots.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <p className="text-[#555] text-sm">No open slots right now</p>
              <button
                onClick={() => navigate(`/app/gym/${gym.id}`)}
                className="text-[#CAFF00] text-sm font-semibold"
              >
                View gym profile →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">
                {gymSlots.length} open slot{gymSlots.length !== 1 ? 's' : ''}
              </p>
              {gymSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#111] border border-[#1E1E1E]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-white font-semibold text-sm leading-tight truncate max-w-[180px]">
                        {slot.title}
                      </span>
                      {slot.is_flash && (
                        <Zap className="w-3 h-3 text-[#FF3547] shrink-0" fill="currentColor" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#555]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(slot.start_time), 'HH:mm')}
                      </span>
                      <span
                        style={{
                          color:
                            slot.spots_remaining <= 2
                              ? '#FF3547'
                              : slot.spots_remaining <= 5
                              ? '#FF9500'
                              : '#888',
                        }}
                      >
                        {slot.spots_remaining} spot{slot.spots_remaining !== 1 ? 's' : ''}
                      </span>
                      {slot.is_flash && slot.flash_expires_at && (
                        <CountdownTimer expiresAt={slot.flash_expires_at} className="text-xs" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-white font-bold text-sm">R{slot.price}</span>
                    <button
                      onClick={() => navigate(`/app/book/${slot.id}`)}
                      className="px-3 py-1.5 rounded-xl text-black text-xs font-bold"
                      style={{ backgroundColor: slot.is_flash ? '#FF3547' : '#CAFF00' }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate(`/app/gym/${gym.id}`)}
                className="w-full mt-2 py-3 rounded-2xl bg-[#1A1A1A] border border-[#242424] text-[#888] text-sm font-medium"
              >
                Full gym profile →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ---------- MapView ----------
interface MapViewProps {
  heightStyle?: string
}

export function MapView({ heightStyle = 'calc(100dvh - 190px)' }: MapViewProps) {
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null)
  const { live } = useActiveDots()
  const { slots } = useRealtimeSlots()

  // Gyms that have a friend training live nearby
  const liveGymIds = new Set(
    live
      .map((f) => MOCK_GYMS.find((g) => g.name.includes(f.last_session?.gym_name?.split(' ')[0] ?? '')))
      .filter(Boolean)
      .map((g) => g!.id)
  )
  // Always show gym-1 as live (Sarah is there in mock data)
  liveGymIds.add('gym-1')

  const handleMarkerClick = (gym: Gym) => {
    setSelectedGym((prev) => (prev?.id === gym.id ? null : gym))
  }

  return (
    <div className="relative w-full" style={{ height: heightStyle }}>
      {/* Leaflet map */}
      <MapContainer
        center={CT}
        zoom={13}
        minZoom={11}
        maxZoom={18}
        style={{ height: '100%', width: '100%', background: '#0A0A0A' }}
        zoomControl={false}
        attributionControl={false}
      >
        <SizeAware />
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {MOCK_GYMS.map((gym) => {
          const gymSlots = slots.filter((s) => s.gym_id === gym.id)
          const totalSpots = gymSlots.reduce((sum, s) => sum + s.spots_remaining, 0)
          const hasFlash = gymSlots.some((s) => s.is_flash)
          const isLive = liveGymIds.has(gym.id)
          const isSelected = selectedGym?.id === gym.id

          return (
            <Marker
              key={gym.id}
              position={[gym.lat, gym.lng]}
              icon={buildIcon(totalSpots, hasFlash, isLive, isSelected)}
              eventHandlers={{ click: () => handleMarkerClick(gym) }}
            />
          )
        })}
      </MapContainer>

      {/* Live pill — top left */}
      <div className="absolute top-3 left-3 z-[400] pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1E1E1E]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF6A] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF6A]" />
          </span>
          <span className="text-white text-xs font-bold">{MOCK_GYMS.length} gyms live</span>
        </div>
      </div>

      {/* Legend — top right */}
      <div className="absolute top-3 right-3 z-[400] bg-[#0A0A0A]/90 backdrop-blur-sm border border-[#1E1E1E] rounded-xl px-3 py-2.5 space-y-1.5 pointer-events-none">
        {[
          { color: '#CAFF00', label: 'Available' },
          { color: '#FF9500', label: 'Limited' },
          { color: '#FF3547', label: 'Flash / Live' },
          { color: '#2A2A2A', label: 'Full' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[#888] text-[10px]">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-0.5 border-t border-[#1A1A1A]">
          <span className="text-[#888] text-[10px]">Tap number = open slots</span>
        </div>
      </div>

      {/* Bottom sheet */}
      {selectedGym && (
        <GymSheet
          gym={selectedGym}
          slots={slots}
          onClose={() => setSelectedGym(null)}
        />
      )}
    </div>
  )
}

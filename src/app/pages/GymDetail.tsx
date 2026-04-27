import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Car, Zap, Shield } from 'lucide-react'
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MOCK_GYMS, MOCK_SLOTS } from '../../data/mockData'
import { SlotCard } from '../../components/SlotCard'

// Fix Leaflet default icon for Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const gymPinIcon = L.divIcon({
  html: `<div style="width:36px;height:36px;border-radius:50%;background:#CAFF00;border:3px solid #000;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#000;box-shadow:0 4px 12px rgba(0,0,0,0.6);">★</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const AMENITY_ICONS: Record<string, string> = {
  Showers: '🚿',
  Lockers: '🔒',
  Towels: '🏊',
  Parking: '🅿️',
  Pool: '🏊',
  Sauna: '♨️',
  Café: '☕',
  'Protein Bar': '🥤',
  'Tea Bar': '🍵',
  WiFi: '📶',
  'Steam Room': '💨',
}

export function GymDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const highlightSlotId = searchParams.get('slot')

  const gym = MOCK_GYMS.find((g) => g.id === id)
  const gymSlots = MOCK_SLOTS.filter((s) => s.gym_id === id && s.status === 'open' && s.spots_remaining > 0)

  if (!gym) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#555]">Gym not found</p>
      </div>
    )
  }

  return (
    <div className="pb-24 min-h-screen">
      {/* Hero */}
      <div className="relative h-64">
        {gym.photos[0] ? (
          <img src={gym.photos[0]} alt={gym.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-safe left-4 mt-4 p-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Verified badge */}
        {gym.verified && (
          <div className="absolute top-safe right-4 mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-[#CAFF00]/30">
            <Shield className="w-3.5 h-3.5 text-[#CAFF00]" />
            <span className="text-[#CAFF00] text-xs font-bold">Verified</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 -mt-6 relative space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-black text-2xl leading-tight">{gym.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#888]" />
              <span className="text-[#888] text-sm">{gym.suburb}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 ml-4">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
              <Star className="w-4 h-4 text-[#CAFF00]" fill="#CAFF00" />
              <span className="text-white font-bold">{gym.bare_score}</span>
            </div>
            <span className="text-[#555] text-xs">Bare Score</span>
          </div>
        </div>

        {/* Vibe tags */}
        <div className="flex gap-2 flex-wrap">
          {gym.vibe_tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-[#1A1A1A] text-[#888] border border-[#242424]">
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-[#888] text-sm leading-relaxed">{gym.description}</p>

        {/* Facility flags */}
        <div className="flex gap-3">
          {gym.has_generator && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
              <Zap className="w-3.5 h-3.5 text-[#CAFF00]" />
              <span className="text-[#888] text-xs">Generator</span>
            </div>
          )}
          {gym.parking && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
              <Car className="w-3.5 h-3.5 text-[#CAFF00]" />
              <span className="text-[#888] text-xs">Parking</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div>
          <h2 className="text-white font-bold text-sm mb-3">Amenities</h2>
          <div className="grid grid-cols-3 gap-2">
            {gym.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#111] border border-[#1E1E1E]">
                <span className="text-base">{AMENITY_ICONS[amenity] ?? '✓'}</span>
                <span className="text-[#888] text-xs leading-tight">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available slots */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold">Available Slots</h2>
            <span className="text-[#555] text-sm">{gymSlots.length} open</span>
          </div>
          {gymSlots.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#555]">No slots available right now</p>
              <p className="text-[#333] text-sm mt-1">Check back soon or enable notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gymSlots.map((slot) => (
                <div key={slot.id} className={highlightSlotId === slot.id ? 'ring-2 ring-[#CAFF00] rounded-2xl' : ''}>
                  <SlotCard slot={slot} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location mini-map */}
        <div>
          <h2 className="text-white font-bold text-sm mb-3">Location</h2>
          <div className="rounded-2xl overflow-hidden border border-[#1E1E1E]" style={{ height: 180 }}>
            <MapContainer
              center={[gym.lat, gym.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%', background: '#0A0A0A' }}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={19}
              />
              <ZoomControl position="bottomright" />
              <Marker position={[gym.lat, gym.lng]} icon={gymPinIcon} />
            </MapContainer>
          </div>
          <div className="flex items-start gap-3 mt-3 px-1">
            <MapPin className="w-4 h-4 text-[#CAFF00] mt-0.5 shrink-0" />
            <div>
              <p className="text-white text-sm font-medium">{gym.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${gym.lat},${gym.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CAFF00] text-xs mt-1 inline-block"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

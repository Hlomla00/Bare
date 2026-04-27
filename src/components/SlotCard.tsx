import { Clock, MapPin, Users, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import type { Slot } from '../types'
import { CountdownTimer } from './CountdownTimer'

interface SlotCardProps {
  slot: Slot
  compact?: boolean
}

function SpotsBar({ remaining, total }: { remaining: number; total: number }) {
  const pct = (remaining / total) * 100
  const color = remaining <= 2 ? '#FF3547' : remaining <= 5 ? '#FF9500' : '#CAFF00'
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color }}>
          {remaining === 1 ? '1 spot left!' : `${remaining} spots left`}
        </span>
        <span className="text-[#444] text-xs">{total} total</span>
      </div>
      <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export function SlotCard({ slot, compact = false }: SlotCardProps) {
  const navigate = useNavigate()
  const gym = slot.gym
  const startTime = format(new Date(slot.start_time), 'HH:mm')
  const endTime = format(new Date(slot.end_time), 'HH:mm')

  const gradients = [
    'from-violet-900/60 to-indigo-900/60',
    'from-emerald-900/60 to-teal-900/60',
    'from-orange-900/60 to-red-900/60',
    'from-blue-900/60 to-cyan-900/60',
    'from-pink-900/60 to-rose-900/60',
  ]
  const gradient = gradients[slot.id.charCodeAt(5) % gradients.length]

  return (
    <div
      className="rounded-2xl overflow-hidden bg-[#111] border border-[#1E1E1E] cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => navigate(`/app/gym/${slot.gym_id}?slot=${slot.id}`)}
    >
      {/* Photo / header */}
      <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-end p-3`}>
        {gym?.photos?.[0] && (
          <img
            src={gym.photos[0]}
            alt={gym.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-black/60 text-[#CAFF00] text-[10px] font-bold tracking-widest uppercase border border-[#CAFF00]/30">
            {slot.class_type}
          </span>
          {slot.is_flash && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF3547]/80 text-white text-[10px] font-bold tracking-widest uppercase">
              <Zap className="w-3 h-3" fill="currentColor" />
              Flash
            </span>
          )}
          {slot.spots_remaining <= 2 && (
            <span className="px-2 py-0.5 rounded-full bg-[#FF3547]/80 text-white text-[10px] font-bold uppercase">
              Almost Full
            </span>
          )}
        </div>

        {/* Bare score */}
        {gym?.bare_score && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <span className="text-[#CAFF00] text-xs font-bold">{gym.bare_score}</span>
            <span className="text-[#CAFF00] text-xs">★</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-bold text-base leading-tight">{slot.title}</h3>
          <p className="text-[#888] text-sm">{gym?.name}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-[#666]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {startTime} – {endTime}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {gym?.suburb}
          </span>
        </div>

        {slot.is_flash && slot.flash_expires_at && (
          <div className="flex items-center gap-2 text-xs text-[#FF3547]">
            <Zap className="w-3 h-3" fill="currentColor" />
            <span>Expires in</span>
            <CountdownTimer expiresAt={slot.flash_expires_at} className="text-xs" />
          </div>
        )}

        <SpotsBar remaining={slot.spots_remaining} total={slot.bare_allocation} />

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-white font-bold text-xl">R{slot.price}</span>
            <span className="text-[#555] text-xs ml-1">/ session</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/app/book/${slot.id}`)
            }}
            className="px-5 py-2.5 rounded-xl bg-[#CAFF00] text-black text-sm font-bold active:bg-[#b8e600] transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export function SlotCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#111] border border-[#1E1E1E] animate-pulse">
      <div className="h-36 bg-[#1A1A1A]" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-[#1A1A1A] rounded w-3/4" />
          <div className="h-3 bg-[#1A1A1A] rounded w-1/2" />
        </div>
        <div className="h-3 bg-[#1A1A1A] rounded w-2/3" />
        <div className="h-1.5 bg-[#1A1A1A] rounded-full" />
        <div className="flex justify-between">
          <div className="h-6 bg-[#1A1A1A] rounded w-16" />
          <div className="h-10 bg-[#1A1A1A] rounded-xl w-28" />
        </div>
      </div>
    </div>
  )
}

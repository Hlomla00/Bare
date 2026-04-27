import { Zap, X } from 'lucide-react'
import { useState } from 'react'
import { CountdownTimer } from './CountdownTimer'
import type { Slot } from '../types'
import { useNavigate } from 'react-router-dom'

interface FlashBannerProps {
  slot: Slot
}

export function FlashBanner({ slot }: FlashBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed || !slot.flash_expires_at) return null

  return (
    <div className="mx-4 mb-3 rounded-2xl overflow-hidden border border-[#FF3547]/30 bg-[#FF3547]/10 animate-fade-in">
      <div className="flex items-center gap-3 p-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FF3547]/20 shrink-0">
          <Zap className="w-4 h-4 text-[#FF3547]" fill="currentColor" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3547] text-[10px] font-bold tracking-widest uppercase">Flash Slot</span>
            <CountdownTimer expiresAt={slot.flash_expires_at} onExpired={() => setDismissed(true)} />
          </div>
          <p className="text-white text-sm font-semibold leading-tight truncate">{slot.title}</p>
          <p className="text-[#888] text-xs">
            {slot.gym?.name} · {slot.spots_remaining} {slot.spots_remaining === 1 ? 'spot' : 'spots'} left · R{slot.price}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate(`/app/book/${slot.id}`)}
            className="px-3 py-1.5 rounded-lg bg-[#FF3547] text-white text-xs font-bold"
          >
            Book
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-[#555] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="h-0.5 bg-[#FF3547]/20">
        <div
          className="h-full bg-[#FF3547] transition-none"
          style={{
            width: `${Math.min(100, (1 - (new Date(slot.flash_expires_at).getTime() - Date.now()) / (60 * 60 * 1000)) * 100)}%`,
          }}
        />
      </div>
    </div>
  )
}

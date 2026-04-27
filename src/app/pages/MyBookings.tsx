import { useState } from 'react'
import { Clock, MapPin, QrCode, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { MOCK_BOOKINGS } from '../../data/mockData'
import { BookingCode } from '../../components/BookingCode'
import type { Booking } from '../../types'

type Tab = 'upcoming' | 'past'

function StatusBadge({ status }: { status: Booking['status'] }) {
  const config = {
    confirmed: { label: 'Confirmed', className: 'bg-[#CAFF00]/10 text-[#CAFF00] border-[#CAFF00]/20' },
    checked_in: { label: 'Checked In', className: 'bg-[#00FF6A]/10 text-[#00FF6A] border-[#00FF6A]/20' },
    no_show: { label: 'No Show', className: 'bg-[#FF3547]/10 text-[#FF3547] border-[#FF3547]/20' },
    cancelled: { label: 'Cancelled', className: 'bg-[#333]/50 text-[#666] border-[#333]/50' },
  }
  const c = config[status]
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${c.className}`}>
      {c.label}
    </span>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const [showQR, setShowQR] = useState(false)
  const navigate = useNavigate()
  const gym = booking.gym!
  const slot = booking.slot

  const startTime = slot?.start_time
    ? format(new Date(slot.start_time), 'EEE d MMM · HH:mm')
    : 'Time TBC'

  return (
    <>
      <div
        className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
        onClick={() => navigate(`/app/gym/${booking.gym_id}`)}
      >
        {/* Gym image stripe */}
        {gym.photos?.[0] && (
          <img src={gym.photos[0]} alt={gym.name} className="w-full h-24 object-cover opacity-60" />
        )}

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base leading-tight truncate">{slot?.title ?? 'Session'}</h3>
              <p className="text-[#888] text-sm">{gym.name}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex items-center gap-4 text-sm text-[#666]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {startTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {gym.suburb}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#1E1E1E]">
            <span className="text-[#555] text-sm">R{booking.amount_paid} paid</span>
            {booking.status === 'confirmed' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowQR(true)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#242424] text-white text-sm font-medium"
              >
                <QrCode className="w-4 h-4" />
                Show QR
              </button>
            )}
            {booking.status === 'checked_in' && (
              <div className="flex items-center gap-1.5 text-[#00FF6A] text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Checked in</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0A0A0A] rounded-t-3xl p-6 pb-12 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-6" />
            <h2 className="text-white font-bold text-xl text-center mb-6">Entry QR Code</h2>
            <BookingCode
              code={booking.qr_code}
              gymName={gym.name}
              slotTitle={slot?.title ?? 'Session'}
              startTime={startTime}
            />
            <p className="text-[#555] text-xs text-center mt-4">
              Show this to the front desk on arrival
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export function MyBookings() {
  const [tab, setTab] = useState<Tab>('upcoming')

  const upcoming = MOCK_BOOKINGS.filter(
    (b) => b.status === 'confirmed' && (!b.slot?.start_time || !isPast(new Date(b.slot.start_time)))
  )
  const past = MOCK_BOOKINGS.filter(
    (b) => b.status === 'checked_in' || (b.slot?.start_time && isPast(new Date(b.slot.start_time)))
  )

  const displayed = tab === 'upcoming' ? upcoming : past

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-white font-black text-2xl">My Bookings</h1>
        </div>
        <div className="flex px-4 gap-1 pb-3">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'bg-[#CAFF00] text-black' : 'bg-[#151515] text-[#555] border border-[#242424]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {displayed.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-[#555] text-lg">
              {tab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions'}
            </p>
            <p className="text-[#333] text-sm">
              {tab === 'upcoming' ? 'Book a slot and get moving.' : 'Your completed sessions will appear here.'}
            </p>
          </div>
        ) : (
          displayed.map((b) => <BookingCard key={b.id} booking={b} />)
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Search, CheckCircle2, Clock, AlertCircle, QrCode } from 'lucide-react'
import { format, subHours, subMinutes } from 'date-fns'
import { MOCK_GYMS } from '../../data/mockData'

interface PartnerBooking {
  id: string
  memberName: string
  memberPhone: string
  slotTitle: string
  startTime: Date
  status: 'confirmed' | 'checked_in' | 'no_show'
  qrCode: string
  amount: number
}

const GYM = MOCK_GYMS[0]

const now = new Date()

const BOOKINGS: PartnerBooking[] = [
  { id: 'pb1', memberName: 'Sarah M.', memberPhone: '+27 82 555 0101', slotTitle: 'Morning HIIT Blast', startTime: now, status: 'checked_in', qrCode: 'BARE-2401-XK9M', amount: 150 },
  { id: 'pb2', memberName: 'James K.', memberPhone: '+27 83 444 0202', slotTitle: 'Morning HIIT Blast', startTime: now, status: 'checked_in', qrCode: 'BARE-2401-TY3W', amount: 150 },
  { id: 'pb3', memberName: 'Aisha P.', memberPhone: '+27 71 333 0303', slotTitle: 'Morning HIIT Blast', startTime: now, status: 'confirmed', qrCode: 'BARE-2401-PL7R', amount: 150 },
  { id: 'pb4', memberName: 'Theo M.', memberPhone: '+27 79 222 0404', slotTitle: 'Morning HIIT Blast', startTime: now, status: 'confirmed', qrCode: 'BARE-2401-ZR5Q', amount: 150 },
  { id: 'pb5', memberName: 'Lena B.', memberPhone: '+27 84 111 0505', slotTitle: 'Evening HIIT', startTime: subHours(now, 6), status: 'checked_in', qrCode: 'BARE-2401-QF8P', amount: 150 },
  { id: 'pb6', memberName: 'Kyle T.', memberPhone: '+27 82 000 0606', slotTitle: 'Evening HIIT', startTime: subHours(now, 6), status: 'no_show', qrCode: 'BARE-2401-MX2N', amount: 150 },
]

function StatusChip({ status }: { status: PartnerBooking['status'] }) {
  if (status === 'checked_in') {
    return (
      <div className="flex items-center gap-1.5 text-[#00FF6A]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">In</span>
      </div>
    )
  }
  if (status === 'no_show') {
    return (
      <div className="flex items-center gap-1.5 text-[#FF3547]">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">No show</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-[#888]">
      <Clock className="w-3.5 h-3.5" />
      <span className="text-xs font-semibold">Expected</span>
    </div>
  )
}

function BookingRow({ booking, onCheckIn }: { booking: PartnerBooking; onCheckIn: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F0F0F] border border-[#1A1A1A]">
      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-sm font-bold text-[#888] shrink-0">
        {booking.memberName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-tight">{booking.memberName}</p>
        <p className="text-[#555] text-xs">{booking.slotTitle}</p>
        <p className="text-[#444] text-xs">{booking.memberPhone}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <StatusChip status={booking.status} />
        {booking.status === 'confirmed' && (
          <button
            onClick={() => onCheckIn(booking.id)}
            className="px-3 py-1.5 rounded-lg bg-[#CAFF00] text-black text-xs font-bold"
          >
            Check in
          </button>
        )}
        {booking.status === 'checked_in' && (
          <span className="text-[#555] text-xs">R{(booking.amount * 0.8).toFixed(0)} earned</span>
        )}
      </div>
    </div>
  )
}

export function PartnerBookings() {
  const [search, setSearch] = useState('')
  const [bookings, setBookings] = useState(BOOKINGS)
  const [tab, setTab] = useState<'today' | 'upcoming' | 'past'>('today')

  const filtered = bookings.filter((b) =>
    b.memberName.toLowerCase().includes(search.toLowerCase()) ||
    b.qrCode.toLowerCase().includes(search.toLowerCase())
  )

  const checkedIn = filtered.filter((b) => b.status === 'checked_in').length
  const expected = filtered.filter((b) => b.status === 'confirmed').length
  const noShows = filtered.filter((b) => b.status === 'no_show').length

  const handleCheckIn = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'checked_in' } : b))
  }

  return (
    <div className="pb-24 min-h-screen">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-white font-black text-2xl mb-3">Bookings</h1>
          <div className="flex items-center gap-3 bg-[#151515] rounded-2xl px-4 py-3 border border-[#242424]">
            <Search className="w-4 h-4 text-[#555] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or scan QR code..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#444] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[#00FF6A]/5 border border-[#00FF6A]/20 p-3 text-center">
            <p className="text-[#00FF6A] font-black text-2xl">{checkedIn}</p>
            <p className="text-[#555] text-xs">Checked in</p>
          </div>
          <div className="rounded-xl bg-[#111] border border-[#1E1E1E] p-3 text-center">
            <p className="text-white font-black text-2xl">{expected}</p>
            <p className="text-[#555] text-xs">Expected</p>
          </div>
          <div className="rounded-xl bg-[#FF3547]/5 border border-[#FF3547]/20 p-3 text-center">
            <p className="text-[#FF3547] font-black text-2xl">{noShows}</p>
            <p className="text-[#555] text-xs">No-shows</p>
          </div>
        </div>

        {/* Slot group */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-sm">Morning HIIT Blast · Now</h2>
            <span className="text-[#CAFF00] text-xs">{checkedIn}/{expected + checkedIn} in</span>
          </div>
          <div className="space-y-2">
            {filtered.map((b) => (
              <BookingRow key={b.id} booking={b} onCheckIn={handleCheckIn} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react'
import { MOCK_BOOKINGS, MOCK_GYMS } from '../../data/mockData'
import { format } from 'date-fns'

const STATUS_META = {
  confirmed:  { label: 'Confirmed',  color: '#0EA5E9', bg: '#0EA5E918' },
  checked_in: { label: 'Checked In', color: '#00FF6A', bg: '#00FF6A18' },
  no_show:    { label: 'No Show',    color: '#FF3547', bg: '#FF354718' },
  cancelled:  { label: 'Cancelled',  color: '#555',    bg: '#55555518' },
}

// Expand mock bookings with extra ones for demo
const ALL_BOOKINGS = [
  ...MOCK_BOOKINGS,
  ...MOCK_GYMS.slice(0, 5).map((g, i) => ({
    id: `admin-b-${i}`, user_id: `u-${i}`, slot_id: `sl-${i}`, gym_id: g.id, gym: g,
    status: (['confirmed', 'checked_in', 'no_show', 'confirmed', 'checked_in'] as const)[i],
    amount_paid: [150, 180, 220, 200, 140][i], gym_payout: [120, 144, 176, 160, 112][i],
    qr_code: `BARE-DEMO-${String(i + 1).padStart(4, '0')}`,
    checked_in_at: i === 1 ? new Date().toISOString() : null,
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
  })),
]

export function AdminAllBookings() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = ALL_BOOKINGS.filter(b => {
    const q = search.toLowerCase()
    const matchQ = !q || b.qr_code.toLowerCase().includes(q) || b.gym?.name?.toLowerCase().includes(q) || ''
    const matchS = statusFilter === 'all' || b.status === statusFilter
    return matchQ && matchS
  })

  const stats = {
    total: ALL_BOOKINGS.length,
    confirmed: ALL_BOOKINGS.filter(b => b.status === 'confirmed').length,
    checked_in: ALL_BOOKINGS.filter(b => b.status === 'checked_in').length,
    no_show: ALL_BOOKINGS.filter(b => b.status === 'no_show').length,
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Bookings</h1>
            <p className="text-[#555] text-xs">{stats.total} total · {stats.checked_in} checked in</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#111] border border-[#1E1E1E]">
            <Filter className="w-3.5 h-3.5 text-[#555]" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-white text-xs focus:outline-none">
              <option value="all">All statuses</option>
              {['confirmed', 'checked_in', 'no_show', 'cancelled'].map(s => (
                <option key={s} value={s} className="bg-[#111] capitalize">{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-[#111] rounded-2xl px-4 py-3 border border-[#242424]">
            <Search className="w-4 h-4 text-[#555]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code or gym..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#444] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total', value: stats.total, color: '#888' },
            { label: 'Confirmed', value: stats.confirmed, color: '#0EA5E9' },
            { label: 'Checked In', value: stats.checked_in, color: '#00FF6A' },
            { label: 'No-shows', value: stats.no_show, color: '#FF3547' },
          ].map(s => (
            <div key={s.label} className="p-2.5 rounded-xl bg-[#111] border border-[#1E1E1E] text-center">
              <p className="font-black text-lg" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[#555] text-[9px]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings list */}
        <div className="space-y-2">
          {filtered.map(b => {
            const meta = STATUS_META[b.status as keyof typeof STATUS_META] ?? STATUS_META.confirmed
            return (
              <div key={b.id} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: meta.bg }}>
                    {b.status === 'checked_in' ? <CheckCircle className="w-4 h-4" style={{ color: meta.color }} />
                      : b.status === 'no_show' ? <XCircle className="w-4 h-4" style={{ color: meta.color }} />
                      : <Clock className="w-4 h-4" style={{ color: meta.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm font-mono">{b.qr_code}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.label}</span>
                    </div>
                    <p className="text-[#555] text-xs truncate">{b.gym?.name ?? 'Unknown gym'} · {b.gym?.suburb}</p>
                    <p className="text-[#555] text-xs">{format(new Date(b.created_at), 'dd MMM · HH:mm')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-bold text-sm">R{b.amount_paid}</p>
                    <p className="text-[#555] text-xs">R{b.gym_payout} to gym</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react'
import { MOCK_SUPPORT_TICKETS } from '../../data/mockData'
import { format } from 'date-fns'
import type { SupportTicket } from '../../types'

const STATUS_META = {
  open:        { label: 'Open',        color: '#FF3547', bg: '#FF354718', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: '#FF9500', bg: '#FF950018', icon: Clock },
  resolved:    { label: 'Resolved',    color: '#00FF6A', bg: '#00FF6A18', icon: CheckCircle },
}

const TYPE_LABELS: Record<string, string> = {
  booking_issue: 'Booking Issue',
  payment: 'Payment',
  gym_quality: 'Gym Quality',
  other: 'Other',
}

export function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS)
  const [selected, setSelected] = useState<SupportTicket | null>(null)
  const [reply, setReply] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all')

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  const updateStatus = (id: string, status: SupportTicket['status']) => {
    setTickets(t => t.map(x => x.id === id ? { ...x, status } : x))
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
  }

  const sendReply = () => {
    if (!reply.trim() || !selected) return
    updateStatus(selected.id, 'in_progress')
    setReply('')
  }

  const openCount = tickets.filter(t => t.status === 'open').length

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Support</h1>
            <p className="text-[#555] text-xs">{openCount} open ticket{openCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex gap-1 mx-4 mb-3 overflow-x-auto scrollbar-none">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === f ? 'bg-[#CAFF00]/10 text-[#CAFF00] border-[#CAFF00]/40' : 'text-[#555] border-[#242424]'}`}>
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {(['open', 'in_progress', 'resolved'] as const).map(s => {
            const meta = STATUS_META[s]
            const Icon = meta.icon
            const count = tickets.filter(t => t.status === s).length
            return (
              <div key={s} className="p-3 rounded-2xl border text-center" style={{ borderColor: `${meta.color}30`, backgroundColor: `${meta.color}08` }}>
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: meta.color }} />
                <p className="font-black text-lg" style={{ color: meta.color }}>{count}</p>
                <p className="text-[#555] text-[10px]">{meta.label}</p>
              </div>
            )
          })}
        </div>

        {filtered.map(ticket => {
          const meta = STATUS_META[ticket.status]
          const Icon = meta.icon
          return (
            <button key={ticket.id} onClick={() => setSelected(ticket)} className="w-full text-left">
              <div className={`p-4 rounded-2xl border transition-all ${selected?.id === ticket.id ? 'border-[#CAFF00]/40 bg-[#CAFF00]/5' : 'bg-[#111] border-[#1E1E1E]'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: meta.bg }}>
                    <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white font-semibold text-sm leading-tight">{ticket.subject}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.label}</span>
                    </div>
                    <p className="text-[#888] text-xs mt-0.5 line-clamp-2">{ticket.body}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[#555] text-[10px]">{ticket.user_name}</span>
                      <span className="text-[#555] text-[10px]">{TYPE_LABELS[ticket.type]}</span>
                      <span className="text-[#555] text-[10px]">{format(new Date(ticket.created_at), 'dd MMM · HH:mm')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <MessageSquare className="w-12 h-12 text-[#2A2A2A] mx-auto" />
            <p className="text-[#555]">No {filter} tickets</p>
          </div>
        )}
      </div>

      {/* Ticket detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between shrink-0">
              <div>
                <p className="text-white font-black text-base">{selected.subject}</p>
                <p className="text-[#555] text-xs">{selected.user_name} · {TYPE_LABELS[selected.type]} · {format(new Date(selected.created_at), 'dd MMM HH:mm')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg bg-[#1A1A1A] border border-[#242424] text-[#555] text-sm">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#1E1E1E] mb-4">
                <p className="text-[#888] text-sm leading-relaxed">{selected.body}</p>
              </div>
            </div>
            {/* Status actions */}
            <div className="flex gap-2 shrink-0">
              {(['open', 'in_progress', 'resolved'] as const).filter(s => s !== selected.status).map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border"
                  style={{ borderColor: `${STATUS_META[s].color}30`, color: STATUS_META[s].color, backgroundColor: STATUS_META[s].bg }}>
                  Mark {STATUS_META[s].label}
                </button>
              ))}
            </div>
            {/* Reply box */}
            <div className="flex gap-2 shrink-0">
              <input type="text" value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply to member..."
                className="flex-1 bg-[#0A0A0A] border border-[#242424] rounded-2xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50" />
              <button onClick={sendReply} disabled={!reply.trim()} className="px-4 rounded-2xl bg-[#CAFF00] text-black disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

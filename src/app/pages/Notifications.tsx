import { ArrowLeft, Zap, Users, CheckCircle, Bell, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { MOCK_NOTIFICATIONS } from '../../data/mockData'
import type { Notification } from '../../types'

const NOTIF_ICONS: Record<Notification['type'], { icon: typeof Zap; color: string; bg: string }> = {
  flash_slot: { icon: Zap, color: '#FF3547', bg: '#FF3547/10' },
  booking_confirmed: { icon: CheckCircle, color: '#00FF6A', bg: '#00FF6A/10' },
  friend_live: { icon: Users, color: '#0EA5E9', bg: '#0EA5E9/10' },
  check_in_reminder: { icon: Bell, color: '#FF9500', bg: '#FF9500/10' },
  payout: { icon: TrendingUp, color: '#CAFF00', bg: '#CAFF00/10' },
}

function NotifCard({ notif }: { notif: Notification }) {
  const { icon: Icon, color, bg } = NOTIF_ICONS[notif.type]
  const timeAgo = formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
        notif.read ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-[#111] border-[#1E1E1E]'
      }`}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${notif.read ? 'text-[#888]' : 'text-white'}`}>
          {notif.title}
        </p>
        <p className="text-[#555] text-xs mt-1 leading-relaxed">{notif.body}</p>
        <p className="text-[#333] text-[10px] mt-2">{timeAgo}</p>
      </div>
      {!notif.read && (
        <div className="w-2 h-2 rounded-full bg-[#CAFF00] mt-1 shrink-0" />
      )}
    </div>
  )
}

export function Notifications() {
  const navigate = useNavigate()
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read)
  const read = MOCK_NOTIFICATIONS.filter((n) => n.read)

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#151515] border border-[#242424]">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-lg">Notifications</h1>
          </div>
          {unread.length > 0 && (
            <button className="text-[#CAFF00] text-sm font-semibold">Mark all read</button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {unread.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-[#888] text-xs font-bold uppercase tracking-widest mb-3">New</h2>
            {unread.map((n) => <NotifCard key={n.id} notif={n} />)}
          </section>
        )}

        {read.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-[#555] text-xs font-bold uppercase tracking-widest mb-3">Earlier</h2>
            {read.map((n) => <NotifCard key={n.id} notif={n} />)}
          </section>
        )}

        {MOCK_NOTIFICATIONS.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <Bell className="w-10 h-10 text-[#333] mx-auto" />
            <p className="text-[#555]">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { formatDistanceToNow } from 'date-fns'
import { UserPlus, MessageCircle } from 'lucide-react'
import { useActiveDots } from '../../hooks/useActiveDots'
import { ActiveDot, ActiveDotLabel } from '../../components/ActiveDot'
import type { Friend } from '../../types'

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  const colors = ['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
  const color = colors[name.charCodeAt(0) % colors.length]
  const sz = size === 'sm' ? 'w-9 h-9 text-xs' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-11 h-11 text-sm'

  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

function LiveFriendCard({ friend }: { friend: Friend }) {
  const duration = friend.last_session?.started_at
    ? formatDistanceToNow(new Date(friend.last_session.started_at), { addSuffix: false })
    : null

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111] border border-red-500/20">
      <div className="relative">
        <Avatar name={friend.name} size="lg" />
        <div className="absolute -bottom-0.5 -right-0.5">
          <ActiveDot status="live" size="lg" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white font-bold text-base">{friend.name}</span>
          <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase animate-pulse">● LIVE</span>
        </div>
        <p className="text-[#888] text-sm">
          {friend.last_session?.suburb ? `${friend.last_session.suburb} area` : 'Training now'}
        </p>
        {duration && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1 bg-[#1A1A1A] rounded-full overflow-hidden max-w-24">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (new Date().getTime() - new Date(friend.last_session!.started_at).getTime()) / (60 * 60 * 1000 * 0.6) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[#555] text-xs">{duration} in</span>
          </div>
        )}
      </div>

      <button className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#242424]">
        <MessageCircle className="w-4 h-4 text-[#666]" />
      </button>
    </div>
  )
}

function DoneFriendCard({ friend }: { friend: Friend }) {
  const timeAgo = friend.trained_at
    ? `${friend.trained_at}`
    : friend.last_session?.started_at
    ? formatDistanceToNow(new Date(friend.last_session.started_at), { addSuffix: true })
    : null

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0E0E0E] border border-[#1A1A1A]">
      <div className="relative">
        <Avatar name={friend.name} size="md" />
        <div className="absolute -bottom-0.5 -right-0.5 bg-[#0E0E0E] rounded-full p-0.5">
          <ActiveDot status="done_today" size="sm" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-tight">{friend.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {friend.last_session?.suburb && (
            <span className="text-[#555] text-xs">{friend.last_session.suburb}</span>
          )}
          {timeAgo && (
            <>
              <span className="text-[#333] text-xs">·</span>
              <span className="text-[#555] text-xs">{timeAgo}</span>
            </>
          )}
        </div>
      </div>

      <ActiveDotLabel status="done_today" />
    </div>
  )
}

function NotYetFriendCard({ friend, onPoke }: { friend: Friend; onPoke: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0E0E0E] border border-[#1A1A1A]">
      <div className="relative">
        <Avatar name={friend.name} size="md" />
        <div className="absolute -bottom-0.5 -right-0.5 bg-[#0E0E0E] rounded-full p-0.5">
          <ActiveDot status="not_yet" size="sm" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[#888] font-semibold text-sm leading-tight">{friend.name}</p>
        <p className="text-[#444] text-xs mt-0.5">hasn't trained yet</p>
      </div>

      <button
        onClick={() => onPoke(friend.id)}
        className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#242424] text-[#666] text-xs font-medium active:bg-[#222] transition-colors"
      >
        Poke 👊
      </button>
    </div>
  )
}

export function Friends() {
  const { live, doneToday, notYet } = useActiveDots()
  const totalFriends = live.length + doneToday.length + notYet.length
  const trainedCount = live.length + doneToday.length

  const handlePoke = (_id: string) => {
    // In production: send push notification to friend
  }

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-2xl">Your Squad</h1>
            <p className="text-[#555] text-sm">{totalFriends} friends · {trainedCount} trained today</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#242424] text-white text-sm font-medium">
            <UserPlus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {/* Today's progress bar */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Squad Progress Today</span>
            <span className="text-[#CAFF00] font-bold text-sm">{trainedCount}/{totalFriends}</span>
          </div>
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#CAFF00] to-[#00FF6A] rounded-full transition-all duration-700"
              style={{ width: `${totalFriends ? (trainedCount / totalFriends) * 100 : 0}%` }}
            />
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <span className="text-[#888]">{live.length} live now</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF6A] inline-block" />
              <span className="text-[#888]">{doneToday.length} done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3A3A3A] inline-block" />
              <span className="text-[#888]">{notYet.length} not yet</span>
            </div>
          </div>
        </div>

        {/* Training NOW */}
        {live.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-white font-bold flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              Training Now
            </h2>
            {live.map((friend) => (
              <LiveFriendCard key={friend.id} friend={friend} />
            ))}
          </section>
        )}

        {/* Done Today */}
        {doneToday.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-white font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF6A] inline-block" />
              Done Today ✓
            </h2>
            {doneToday.map((friend) => (
              <DoneFriendCard key={friend.id} friend={friend} />
            ))}
          </section>
        )}

        {/* Not Yet */}
        {notYet.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-[#555] font-bold flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3A3A3A] inline-block" />
              Not Yet
            </h2>
            {notYet.map((friend) => (
              <NotYetFriendCard key={friend.id} friend={friend} onPoke={handlePoke} />
            ))}
          </section>
        )}

        {totalFriends === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-4xl">👥</p>
            <p className="text-white font-bold text-lg">Build your squad</p>
            <p className="text-[#555] text-sm leading-relaxed max-w-xs mx-auto">
              Connect with friends to see their training dots and keep each other accountable.
            </p>
            <button className="px-6 py-3 rounded-2xl bg-[#CAFF00] text-black font-bold text-sm mt-2">
              Find Friends
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

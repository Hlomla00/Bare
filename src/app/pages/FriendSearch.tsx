import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, UserPlus, Check, X } from 'lucide-react'
import { ActiveDot } from '../../components/ActiveDot'

const SUGGESTED = [
  { id: 'u-s1', name: 'Nomvula Dlamini', suburb: 'Sea Point', sessions: 31, mutual: 2, dot_status: 'done_today' as const },
  { id: 'u-s2', name: 'Ruan van der Berg', suburb: 'Green Point', sessions: 18, mutual: 1, dot_status: 'not_yet' as const },
  { id: 'u-s3', name: 'Chloe Naidoo', suburb: 'Camps Bay', sessions: 44, mutual: 3, dot_status: 'live' as const },
  { id: 'u-s4', name: 'Brendan Ellis', suburb: 'Woodstock', sessions: 12, mutual: 0, dot_status: 'not_yet' as const },
  { id: 'u-s5', name: 'Yolanda Khumalo', suburb: 'Gardens', sessions: 27, mutual: 1, dot_status: 'done_today' as const },
]

const PENDING_REQUESTS = [
  { id: 'req-1', name: 'Marcus Green', suburb: 'De Waterkant', sessions: 19, dot_status: 'not_yet' as const },
]

export function FriendSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sent, setSent] = useState<Set<string>>(new Set())
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [declined, setDeclined] = useState<Set<string>>(new Set())

  const filtered = query.length > 1
    ? SUGGESTED.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.suburb.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTED

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const colors = ['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
  const color = (name: string) => colors[name.charCodeAt(0) % colors.length]

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-black text-lg flex-1">Find Friends</h1>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-[#111] rounded-2xl px-4 py-3 border border-[#242424]">
            <Search className="w-4 h-4 text-[#555]" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or suburb..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#444] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Pending requests */}
        {PENDING_REQUESTS.filter(r => !accepted.has(r.id) && !declined.has(r.id)).length > 0 && (
          <div>
            <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">
              Friend Requests ({PENDING_REQUESTS.filter(r => !accepted.has(r.id) && !declined.has(r.id)).length})
            </p>
            {PENDING_REQUESTS.filter(r => !accepted.has(r.id) && !declined.has(r.id)).map(req => (
              <div key={req.id} className="flex items-center gap-3 p-4 rounded-2xl bg-[#111] border border-[#CAFF00]/20 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: color(req.name) }}>
                    {initials(req.name)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-[#111] rounded-full p-0.5">
                    <ActiveDot status={req.dot_status} size="sm" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{req.name}</p>
                  <p className="text-[#555] text-xs">{req.suburb} · {req.sessions} sessions</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAccepted(p => new Set([...p, req.id]))}
                    className="w-8 h-8 rounded-full bg-[#CAFF00] flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" />
                  </button>
                  <button onClick={() => setDeclined(p => new Set([...p, req.id]))}
                    className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#242424] flex items-center justify-center">
                    <X className="w-4 h-4 text-[#555]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggested / search results */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">
            {query.length > 1 ? `Results for "${query}"` : 'People you may know'}
          </p>
          <div className="space-y-2">
            {filtered.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: color(u.name) }}>
                    {initials(u.name)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-[#111] rounded-full p-0.5">
                    <ActiveDot status={u.dot_status} size="sm" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{u.name}</p>
                  <p className="text-[#555] text-xs">{u.suburb} · {u.sessions} sessions{u.mutual > 0 ? ` · ${u.mutual} mutual` : ''}</p>
                </div>
                <button
                  onClick={() => setSent(p => { const n = new Set(p); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${sent.has(u.id) ? 'bg-[#1A1A1A] border border-[#242424] text-[#555]' : 'bg-[#CAFF00]/10 border border-[#CAFF00]/30 text-[#CAFF00]'}`}>
                  {sent.has(u.id) ? <><Check className="w-3 h-3" /> Sent</> : <><UserPlus className="w-3 h-3" /> Add</>}
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#555]">No members found for "{query}"</p>
                <p className="text-[#333] text-sm mt-1">Try a different name or suburb</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

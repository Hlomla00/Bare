import { useState } from 'react'
import { Search, Filter, UserX, Eye, Mail, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'

const MOCK_USERS = [
  { id: 'u1', name: 'Jordan Cape', email: 'jordan@example.com', suburb: 'Sea Point', plan: 'active', credits: 11, sessions: 47, joined: '2024-01-01', status: 'active' },
  { id: 'u2', name: 'Sarah Möller', email: 'sarah@example.com', suburb: 'Green Point', plan: 'explorer', credits: 6, sessions: 31, joined: '2024-01-15', status: 'active' },
  { id: 'u3', name: 'James Khumalo', email: 'james@example.com', suburb: 'Gardens', plan: 'daily', credits: 18, sessions: 89, joined: '2024-01-08', status: 'active' },
  { id: 'u4', name: 'Aisha Patel', email: 'aisha@example.com', suburb: 'De Waterkant', plan: 'starter', credits: 2, sessions: 14, joined: '2024-02-01', status: 'active' },
  { id: 'u5', name: 'Theo Mostert', email: 'theo@example.com', suburb: 'Camps Bay', plan: 'none', credits: 0, sessions: 3, joined: '2024-03-01', status: 'suspended' },
  { id: 'u6', name: 'Lena Botha', email: 'lena@example.com', suburb: 'Claremont', plan: 'active', credits: 8, sessions: 52, joined: '2024-01-20', status: 'active' },
  { id: 'u7', name: 'Kyle Turner', email: 'kyle@example.com', suburb: 'Woodstock', plan: 'explorer', credits: 4, sessions: 22, joined: '2024-02-14', status: 'active' },
  { id: 'u8', name: 'Nomvula Dlamini', email: 'nomvula@example.com', suburb: 'Sea Point', plan: 'active', credits: 14, sessions: 38, joined: '2024-03-10', status: 'active' },
]

const PLAN_COLORS: Record<string, string> = {
  none: '#555', starter: '#888', explorer: '#0EA5E9', active: '#CAFF00', daily: '#FF3547',
}

export function AdminUsers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null)
  const [suspended, setSuspended] = useState<Set<string>>(new Set(['u5']))

  const filtered = MOCK_USERS.filter(u => {
    const matchQ = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchF = filter === 'all' || u.plan === filter || (filter === 'suspended' && suspended.has(u.id))
    return matchQ && matchF
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Users</h1>
            <p className="text-[#555] text-xs">{MOCK_USERS.length} members shown · 4,821 total</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111] border border-[#1E1E1E]">
            <Filter className="w-3.5 h-3.5 text-[#555]" />
            <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-transparent text-white text-xs focus:outline-none">
              {['all', 'none', 'starter', 'explorer', 'active', 'daily', 'suspended'].map(f => (
                <option key={f} value={f} className="bg-[#111] capitalize">{f === 'all' ? 'All plans' : f}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#555]" />
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-[#111] rounded-2xl px-4 py-3 border border-[#242424]">
            <Search className="w-4 h-4 text-[#555]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#444] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-2">
        {filtered.map(u => {
          const isSuspended = suspended.has(u.id)
          return (
            <div key={u.id} className={`p-4 rounded-2xl border transition-all ${isSuspended ? 'bg-[#0F0F0F] border-[#FF3547]/20' : 'bg-[#111] border-[#1E1E1E]'}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CAFF00]/20 to-[#CAFF00]/5 border border-[#CAFF00]/20 flex items-center justify-center text-[#CAFF00] font-black text-sm shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-sm">{u.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${PLAN_COLORS[u.plan]}18`, color: PLAN_COLORS[u.plan] }}>{u.plan}</span>
                    {isSuspended && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF3547]/10 text-[#FF3547]">SUSPENDED</span>}
                  </div>
                  <p className="text-[#555] text-xs truncate">{u.email}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[#555] text-[10px]">{u.suburb}</span>
                    <span className="text-[#555] text-[10px]">{u.sessions} sessions</span>
                    <span className="text-[#555] text-[10px]">{u.credits} credits</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setSelectedUser(u)} className="p-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
                    <Eye className="w-3.5 h-3.5 text-[#888]" />
                  </button>
                  <button className="p-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
                    <Mail className="w-3.5 h-3.5 text-[#888]" />
                  </button>
                  <button onClick={() => setSuspended(p => { const n = new Set(p); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n })}
                    className="p-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
                    <UserX className={`w-3.5 h-3.5 ${isSuspended ? 'text-[#00FF6A]' : 'text-[#FF3547]'}`} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-black text-lg">{selectedUser.name}</h3>
                <p className="text-[#555] text-sm">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full bg-[#1A1A1A] border border-[#242424]">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Sessions', value: selectedUser.sessions },
                { label: 'Credits', value: selectedUser.credits },
                { label: 'Plan', value: selectedUser.plan },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-[#1A1A1A] border border-[#242424] text-center">
                  <p className="text-white font-bold">{s.value}</p>
                  <p className="text-[#555] text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between py-2 border-b border-[#1A1A1A]">
                <span className="text-[#555]">Suburb</span><span className="text-white">{selectedUser.suburb}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1A1A1A]">
                <span className="text-[#555]">Joined</span><span className="text-white">{format(new Date(selectedUser.joined), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#555]">Status</span><span className={suspended.has(selectedUser.id) ? 'text-[#FF3547]' : 'text-[#00FF6A]'}>{suspended.has(selectedUser.id) ? 'Suspended' : 'Active'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 rounded-2xl bg-[#1A1A1A] border border-[#242424] text-white text-sm font-medium">Send Email</button>
              <button onClick={() => setSuspended(p => { const n = new Set(p); n.has(selectedUser.id) ? n.delete(selectedUser.id) : n.add(selectedUser.id); return n })}
                className={`py-3 rounded-2xl text-sm font-bold ${suspended.has(selectedUser.id) ? 'bg-[#00FF6A]/10 border border-[#00FF6A]/30 text-[#00FF6A]' : 'bg-[#FF3547]/10 border border-[#FF3547]/30 text-[#FF3547]'}`}>
                {suspended.has(selectedUser.id) ? 'Unsuspend' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

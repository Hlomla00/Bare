import { useState } from 'react'
import { Search, CheckCircle, XCircle, Eye, Star, Shield } from 'lucide-react'
import { MOCK_GYMS, MOCK_GYM_APPLICATIONS } from '../../data/mockData'
import type { GymApplication } from '../../types'

export function AdminGyms() {
  const [tab, setTab] = useState<'live' | 'applications'>('applications')
  const [search, setSearch] = useState('')
  const [apps, setApps] = useState<GymApplication[]>(MOCK_GYM_APPLICATIONS)

  const approve = (id: string) => setApps(a => a.map(x => x.id === id ? { ...x, status: 'approved' } : x))
  const reject = (id: string) => setApps(a => a.map(x => x.id === id ? { ...x, status: 'rejected' } : x))

  const pendingCount = apps.filter(a => a.status === 'pending').length

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-white font-black text-xl">Gyms</h1>
            <p className="text-[#555] text-xs">{MOCK_GYMS.length} live · {pendingCount} pending approval</p>
          </div>
        </div>
        <div className="flex gap-1 mx-4 mb-3 p-1 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          {(['applications', 'live'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${tab === t ? 'bg-[#CAFF00] text-black' : 'text-[#555]'}`}>
              {t === 'applications' ? `Applications${pendingCount > 0 ? ` (${pendingCount})` : ''}` : 'Live Gyms'}
            </button>
          ))}
        </div>
        {tab === 'live' && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 bg-[#111] rounded-2xl px-4 py-3 border border-[#242424]">
              <Search className="w-4 h-4 text-[#555]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gyms..." className="flex-1 bg-transparent text-white text-sm placeholder-[#444] focus:outline-none" />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-3">
        {tab === 'applications' && apps.map(app => (
          <div key={app.id} className={`p-4 rounded-2xl border ${app.status === 'pending' ? 'bg-[#111] border-[#1E1E1E]' : app.status === 'approved' ? 'bg-[#00FF6A]/5 border-[#00FF6A]/20' : 'bg-[#FF3547]/5 border-[#FF3547]/20'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">{app.gym_name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    app.status === 'pending' ? 'bg-[#FF9500]/10 text-[#FF9500]' :
                    app.status === 'approved' ? 'bg-[#00FF6A]/10 text-[#00FF6A]' :
                    'bg-[#FF3547]/10 text-[#FF3547]'
                  }`}>{app.status}</span>
                </div>
                <p className="text-[#555] text-xs">{app.owner_name} · {app.suburb}</p>
                <p className="text-[#555] text-xs">{app.email} · {app.phone}</p>
              </div>
            </div>
            {app.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => approve(app.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00FF6A]/10 border border-[#00FF6A]/30 text-[#00FF6A] text-sm font-bold">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => reject(app.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FF3547]/10 border border-[#FF3547]/30 text-[#FF3547] text-sm font-bold">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {tab === 'live' && MOCK_GYMS.filter(g => !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.suburb.toLowerCase().includes(search.toLowerCase())).map(gym => (
          <div key={gym.id} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#242424] flex items-center justify-center text-[#CAFF00] font-black text-sm shrink-0">
                {gym.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{gym.name}</span>
                  {gym.verified && <Shield className="w-3.5 h-3.5 text-[#CAFF00]" />}
                </div>
                <p className="text-[#555] text-xs">{gym.suburb} · {gym.address.split(',')[0]}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[#888] text-xs"><Star className="w-3 h-3 text-[#CAFF00]" fill="#CAFF00" />{gym.bare_score}</span>
                  <span className="text-[#555] text-xs">{gym.amenities.length} amenities</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button className="p-2 rounded-xl bg-[#1A1A1A] border border-[#242424]">
                  <Eye className="w-3.5 h-3.5 text-[#888]" />
                </button>
                <button className="px-2 py-1 rounded-lg border text-[10px] font-bold border-[#FF3547]/30 text-[#FF3547]">
                  Suspend
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

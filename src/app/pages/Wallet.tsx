import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Plus, Zap, TrendingUp, ArrowDownLeft, ArrowUpRight, RotateCcw } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { MOCK_TRANSACTIONS } from '../../data/mockData'
import { format } from 'date-fns'

const TOPUP_PACKS = [
  { credits: 1, price: 99, label: '1 credit', popular: false },
  { credits: 3, price: 269, label: '3 credits', popular: true },
  { credits: 5, price: 429, label: '5 credits', popular: false },
  { credits: 10, price: 799, label: '10 credits', popular: false },
]

const TX_ICONS = {
  credit_purchase: { icon: ArrowDownLeft, color: '#00FF6A', bg: '#00FF6A18' },
  booking_debit:  { icon: ArrowUpRight, color: '#FF3547', bg: '#FF354718' },
  refund:         { icon: RotateCcw, color: '#CAFF00', bg: '#CAFF0018' },
  subscription:   { icon: TrendingUp, color: '#0EA5E9', bg: '#0EA5E918' },
}

export function Wallet() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showTopup, setShowTopup] = useState(false)
  const [selectedPack, setSelectedPack] = useState<number | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [tab, setTab] = useState<'credits' | 'history'>('credits')

  const handlePurchase = async () => {
    if (selectedPack === null) return
    setPurchasing(true)
    await new Promise(r => setTimeout(r, 1500))
    setPurchasing(false)
    setShowTopup(false)
    setSelectedPack(null)
  }

  const planMap: Record<string, { visits: number; price: number }> = {
    starter: { visits: 5, price: 299 },
    explorer: { visits: 10, price: 549 },
    active: { visits: 16, price: 799 },
    daily: { visits: 26, price: 1399 },
    none: { visits: 0, price: 0 },
  }
  const plan = planMap[user?.subscription_tier ?? 'none']
  const creditsUsed = plan.visits - (user?.credits_remaining ?? 0)
  const usedPct = plan.visits > 0 ? Math.round((creditsUsed / plan.visits) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-black text-lg flex-1">Wallet</h1>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-5">
        {/* Credits card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#242424] p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#CAFF00]/8 blur-2xl" />
          <p className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-1">Credits remaining</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[#CAFF00] font-black text-5xl tabular-nums">{user?.credits_remaining ?? 0}</span>
            <span className="text-[#555] text-sm">/ {plan.visits}</span>
          </div>
          <p className="text-[#888] text-sm capitalize mb-4">{user?.subscription_tier} Plan · renews in 18 days</p>
          {/* Usage bar */}
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full bg-[#CAFF00] transition-all" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#555]">{creditsUsed} used</span>
            <span className="text-[#555]">{user?.credits_remaining} left</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          {(['credits', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-[#CAFF00] text-black' : 'text-[#555]'}`}>
              {t === 'credits' ? 'Top Up' : 'History'}
            </button>
          ))}
        </div>

        {tab === 'credits' && (
          <div className="space-y-4">
            <p className="text-[#555] text-xs font-bold uppercase tracking-widest">Buy extra credits</p>
            <div className="grid grid-cols-2 gap-3">
              {TOPUP_PACKS.map((pack, i) => (
                <button key={i} onClick={() => setSelectedPack(i)}
                  className={`p-4 rounded-2xl border text-left relative transition-all ${selectedPack === i ? 'bg-[#CAFF00]/10 border-[#CAFF00]/50' : 'bg-[#111] border-[#242424]'}`}>
                  {pack.popular && <span className="absolute -top-2 right-2 text-[9px] font-black bg-[#CAFF00] text-black px-2 py-0.5 rounded-full">BEST VALUE</span>}
                  <p className={`font-black text-2xl ${selectedPack === i ? 'text-[#CAFF00]' : 'text-white'}`}>{pack.credits}</p>
                  <p className="text-[#555] text-xs">{pack.credits === 1 ? 'credit' : 'credits'}</p>
                  <p className="text-white font-bold text-sm mt-2">R{pack.price}</p>
                  <p className="text-[#555] text-[10px]">R{Math.round(pack.price / pack.credits)} / credit</p>
                </button>
              ))}
            </div>
            <button onClick={handlePurchase} disabled={selectedPack === null || purchasing}
              className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-40">
              <CreditCard className="w-4 h-4" />
              {purchasing ? 'Processing...' : selectedPack !== null ? `Pay R${TOPUP_PACKS[selectedPack].price} via PayFast` : 'Select a pack'}
            </button>
            <p className="text-center text-[#555] text-xs">Secure payment via PayFast · Credits never expire</p>

            {/* Upgrade nudge */}
            <div className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E] flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#CAFF00] shrink-0" fill="#CAFF00" />
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">Save more with a plan upgrade</p>
                <p className="text-[#555] text-xs">Daily Plan = R54/credit vs R99 à la carte</p>
              </div>
              <button onClick={() => navigate('/app/subscriptions')} className="px-3 py-1.5 rounded-xl bg-[#CAFF00]/10 border border-[#CAFF00]/30 text-[#CAFF00] text-xs font-bold shrink-0">
                Upgrade
              </button>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-2">
            {MOCK_TRANSACTIONS.map(tx => {
              const meta = TX_ICONS[tx.type]
              const Icon = meta.icon
              const isDebit = tx.type === 'booking_debit'
              return (
                <div key={tx.id} className="flex items-center gap-3 p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: meta.bg }}>
                    <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{tx.description}</p>
                    <p className="text-[#555] text-xs">{format(new Date(tx.created_at), 'dd MMM · HH:mm')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-sm ${isDebit ? 'text-[#FF3547]' : 'text-[#00FF6A]'}`}>
                      {isDebit ? '−' : '+'}R{tx.amount}
                    </p>
                    {tx.credits && <p className="text-[#555] text-xs">{isDebit ? `−${tx.credits}` : `+${tx.credits}`} credit{tx.credits !== 1 ? 's' : ''}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ArrowLeft, Check, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { SUBSCRIPTION_PLANS } from '../../types'
import type { SubscriptionTier } from '../../types'

const PLAN_ORDER: Exclude<SubscriptionTier, 'none'>[] = ['starter', 'explorer', 'active', 'daily']

const PLAN_HIGHLIGHTS: Record<string, string[]> = {
  starter: ['5 gym visits/month', 'Any Bare-listed gym', 'Full booking flexibility', 'Member community'],
  explorer: ['10 gym visits/month', 'Any Bare-listed gym', 'Flash slot priority access', 'Member community'],
  active: ['16 gym visits/month', 'Any Bare-listed gym', 'Flash slot priority access', 'Vitality points integration', 'Member community'],
  daily: ['26 gym visits/month', 'Any Bare-listed gym', 'First access to flash slots', 'Vitality points integration', 'Dedicated support', 'Monthly performance report'],
}

const PLAN_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  starter: { accent: '#888', bg: '#111', border: '#242424' },
  explorer: { accent: '#0EA5E9', bg: '#001A2E', border: '#0EA5E9/20' },
  active: { accent: '#CAFF00', bg: '#0A1A00', border: '#CAFF00/20' },
  daily: { accent: '#FF9500', bg: '#1A0E00', border: '#FF9500/20' },
}

function PlanCard({
  tier,
  isCurrentPlan,
  onSelect,
}: {
  tier: Exclude<SubscriptionTier, 'none'>
  isCurrentPlan: boolean
  onSelect: (tier: Exclude<SubscriptionTier, 'none'>) => void
}) {
  const plan = SUBSCRIPTION_PLANS[tier]
  const colors = PLAN_COLORS[tier]
  const highlights = PLAN_HIGHLIGHTS[tier]
  const isPopular = tier === 'active'

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all cursor-pointer ${
        isCurrentPlan ? 'ring-2' : ''
      }`}
      style={{
        backgroundColor: isCurrentPlan ? colors.bg : '#0F0F0F',
        borderColor: isCurrentPlan ? colors.accent : '#1E1E1E',
        boxShadow: isCurrentPlan ? `0 0 0 2px ${colors.accent}` : undefined,
      }}
      onClick={() => onSelect(tier)}
    >
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full bg-[#CAFF00] text-black text-[10px] font-black uppercase tracking-widest">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4" style={{ color: colors.accent }} fill={colors.accent} />
            <span className="font-bold text-base" style={{ color: colors.accent }}>
              {plan.name}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-white font-black text-3xl">R{plan.price}</span>
            <span className="text-[#555] text-sm">/month</span>
          </div>
          <p className="text-[#888] text-xs mt-0.5">
            R{plan.pricePerVisit.toFixed(0)}/visit
          </p>
        </div>
        {isCurrentPlan && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.accent }}
          >
            <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {highlights.map((h) => (
          <div key={h} className="flex items-center gap-2.5">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${colors.accent}20` }}
            >
              <Check className="w-2.5 h-2.5" style={{ color: colors.accent }} strokeWidth={3} />
            </div>
            <span className="text-[#888] text-sm">{h}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Subscriptions() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selected, setSelected] = useState<Exclude<SubscriptionTier, 'none'>>(
    (user?.subscription_tier as Exclude<SubscriptionTier, 'none'>) ?? 'active'
  )
  const [processing, setProcessing] = useState(false)

  const currentTier = user?.subscription_tier as Exclude<SubscriptionTier, 'none'> | 'none'

  const handleUpgrade = async () => {
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setProcessing(false)
    navigate('/app/profile')
  }

  const selectedPlan = SUBSCRIPTION_PLANS[selected]
  const isSamePlan = selected === currentTier

  return (
    <div className="pb-12 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#151515] border border-[#242424]">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">Choose a Plan</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Hero */}
        <div className="text-center py-4 space-y-2">
          <h2 className="text-white font-black text-2xl">Train anywhere in Cape Town</h2>
          <p className="text-[#888] text-sm leading-relaxed max-w-xs mx-auto">
            One membership. Every gym. No lock-in. Pay monthly, cancel anytime.
          </p>
        </div>

        {/* Pay-per-use vs subscription toggle info */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">Pay-per-use</p>
              <p className="text-[#555] text-xs">Book individual sessions at listed price</p>
            </div>
            <div className="text-right">
              <p className="text-[#888] text-xs">vs. Active plan</p>
              <p className="text-[#CAFF00] text-xs font-bold">Save up to 33%</p>
            </div>
          </div>
        </div>

        {/* Plan cards */}
        <div className="space-y-3 pt-2">
          {PLAN_ORDER.map((tier) => (
            <PlanCard
              key={tier}
              tier={tier}
              isCurrentPlan={tier === selected}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={processing || isSamePlan}
            className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: '#CAFF00', color: '#000' }}
          >
            {processing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : isSamePlan ? (
              `You're on ${selectedPlan.name}`
            ) : (
              `Get ${selectedPlan.name} — R${selectedPlan.price}/mo`
            )}
          </button>
          <p className="text-[#444] text-xs text-center">
            Billed monthly via PayFast. Cancel anytime. Credits expire at end of billing cycle.
          </p>
        </div>
      </div>
    </div>
  )
}

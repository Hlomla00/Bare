import { useNavigate } from 'react-router-dom'
import { ChevronRight, CreditCard, Bell, Shield, HelpCircle, LogOut, Zap, Star } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { SUBSCRIPTION_PLANS } from '../../types'

export function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const plan = user?.subscription_tier !== 'none' ? SUBSCRIPTION_PLANS[user!.subscription_tier as keyof typeof SUBSCRIPTION_PLANS] : null
  const creditsUsed = plan ? plan.visits - (user?.credits_remaining ?? 0) : 0
  const creditsTotal = plan?.visits ?? 0
  const creditsPct = creditsTotal > 0 ? (creditsUsed / creditsTotal) * 100 : 0

  const menuItems = [
    {
      label: 'Subscription & Credits',
      icon: CreditCard,
      action: () => navigate('/app/subscriptions'),
      badge: plan ? `${user?.credits_remaining} left` : 'Pay-per-use',
    },
    {
      label: 'Notifications',
      icon: Bell,
      action: () => navigate('/app/notifications'),
      badge: null,
    },
    {
      label: 'Privacy & Sharing',
      icon: Shield,
      action: () => {},
      badge: null,
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => {},
      badge: null,
    },
  ]

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="pt-safe px-4 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#CAFF00] flex items-center justify-center text-black font-black text-2xl shrink-0">
            {user?.name?.charAt(0) ?? 'J'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-black text-xl leading-tight">{user?.name}</h1>
            <p className="text-[#555] text-sm">{user?.location_suburb} · Cape Town</p>
            {user?.vitality_id && (
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-3 h-3 text-[#CAFF00]" />
                <span className="text-[#888] text-xs">Vitality Member</span>
              </div>
            )}
          </div>
          <button className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#242424] text-white text-sm font-medium">
            Edit
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: '47' },
            { label: 'Gyms visited', value: '12' },
            { label: 'Streak', value: '8 days' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-3 text-center">
              <p className="text-white font-black text-xl leading-none">{stat.value}</p>
              <p className="text-[#555] text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription card */}
      {plan ? (
        <div className="mx-4 mb-6 rounded-2xl bg-gradient-to-br from-[#1A1A00] to-[#111] border border-[#CAFF00]/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#CAFF00]" fill="currentColor" />
                <span className="text-[#CAFF00] font-bold text-sm uppercase tracking-widest">{plan.name}</span>
              </div>
              <p className="text-white font-black text-2xl mt-1">
                {user?.credits_remaining}
                <span className="text-[#888] font-normal text-sm ml-1">/ {plan.visits} visits</span>
              </p>
            </div>
            <button
              onClick={() => navigate('/app/subscriptions')}
              className="px-4 py-2 rounded-xl bg-[#CAFF00] text-black text-sm font-bold"
            >
              Upgrade
            </button>
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#CAFF00] rounded-full transition-all"
                style={{ width: `${100 - creditsPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#555]">
              <span>{user?.credits_remaining} remaining</span>
              <span>Renews monthly · R{plan.price}/mo</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-4 mb-6 rounded-2xl bg-[#111] border border-[#1E1E1E] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#888] text-sm">Currently on</p>
              <p className="text-white font-bold">Pay-per-use</p>
            </div>
            <button
              onClick={() => navigate('/app/subscriptions')}
              className="px-4 py-2 rounded-xl bg-[#CAFF00] text-black text-sm font-bold"
            >
              Get a plan
            </button>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="px-4 space-y-2">
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden divide-y divide-[#1E1E1E]">
          {menuItems.map(({ label, icon: Icon, action, badge }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-4 px-4 py-4 active:bg-[#1A1A1A] transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#888]" />
              </div>
              <span className="flex-1 text-left text-white text-sm font-medium">{label}</span>
              {badge && <span className="text-[#555] text-xs">{badge}</span>}
              <ChevronRight className="w-4 h-4 text-[#333]" />
            </button>
          ))}
        </div>

        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#111] border border-[#1E1E1E] active:bg-[#1A1A1A] transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#FF3547]/10 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-[#FF3547]" />
          </div>
          <span className="flex-1 text-left text-[#FF3547] text-sm font-medium">Sign Out</span>
        </button>
      </div>

      {/* Version */}
      <p className="text-center text-[#333] text-xs mt-8">Bare v1.0.0 · Cape Town</p>
    </div>
  )
}

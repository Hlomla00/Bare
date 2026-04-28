import { ChevronRight, MapPin, Phone, Mail, Shield, CreditCard, Bell, Star } from 'lucide-react'
import { PARTNER_GYM } from '../../data/mockData'
import { useAuth } from '../../hooks/useAuth'

export function PartnerSettings() {
  const { user } = useAuth()

  const sections = [
    {
      title: 'Gym Profile',
      items: [
        { icon: MapPin, label: 'Gym details & photos', sub: PARTNER_GYM.name },
        { icon: Star, label: 'Amenities & vibe tags', sub: `${PARTNER_GYM.amenities.length} amenities listed` },
        { icon: Shield, label: 'Verification status', sub: PARTNER_GYM.verified ? 'Verified ✓' : 'Pending' },
      ],
    },
    {
      title: 'Business',
      items: [
        { icon: CreditCard, label: 'Bank account & payouts', sub: 'EFT every Friday' },
        { icon: Bell, label: 'Booking notifications', sub: 'Push + email' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: Mail, label: user?.email ?? '', sub: 'Account email' },
        { icon: Phone, label: user?.phone ?? '', sub: 'Phone number' },
      ],
    },
  ]

  return (
    <div className="pb-24 min-h-screen">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="px-4 py-4">
          <h1 className="text-white font-black text-2xl">Settings</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Gym card */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          {PARTNER_GYM.photos[0] && (
            <img src={PARTNER_GYM.photos[0]} alt={PARTNER_GYM.name} className="w-full h-28 object-cover opacity-60" />
          )}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{PARTNER_GYM.name}</h2>
                <p className="text-[#888] text-sm">{PARTNER_GYM.suburb} · Bare Score {PARTNER_GYM.bare_score}★</p>
              </div>
              {PARTNER_GYM.verified && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CAFF00]/10 border border-[#CAFF00]/20">
                  <Shield className="w-3 h-3 text-[#CAFF00]" />
                  <span className="text-[#CAFF00] text-[10px] font-bold">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[#555] text-xs font-bold uppercase tracking-widest mb-2 px-1">{section.title}</h3>
            <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden divide-y divide-[#1A1A1A]">
              {section.items.map(({ icon: Icon, label, sub }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-4 px-4 py-4 active:bg-[#1A1A1A] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#888]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white text-sm font-medium leading-tight">{label}</p>
                    {sub && <p className="text-[#555] text-xs mt-0.5">{sub}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#333]" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <p className="text-center text-[#333] text-xs">Bare Partner v1.0.0</p>
      </div>
    </div>
  )
}

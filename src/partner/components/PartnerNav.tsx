import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Users, Wallet, Settings } from 'lucide-react'

const tabs = [
  { to: '/partner', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/partner/slots', icon: CalendarDays, label: 'Slots', end: false },
  { to: '/partner/bookings', icon: Users, label: 'Bookings', end: false },
  { to: '/partner/earnings', icon: Wallet, label: 'Earnings', end: false },
  { to: '/partner/settings', icon: Settings, label: 'Settings', end: false },
]

export function PartnerNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#1E1E1E] pb-safe">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'text-[#CAFF00]' : 'text-[#555]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[9px] font-semibold tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

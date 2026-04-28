import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, Calendar, DollarSign, Zap, HeadphonesIcon, Settings } from 'lucide-react'

const tabs = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/gyms', icon: Building2, label: 'Gyms' },
  { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
  { to: '/admin/flash', icon: Zap, label: 'Flash' },
  { to: '/admin/support', icon: HeadphonesIcon, label: 'Support' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#1E1E1E] pb-safe overflow-x-auto">
      <div className="flex items-center h-16 min-w-max mx-auto px-2">
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-fit ${isActive ? 'text-[#CAFF00]' : 'text-[#555]'}`
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

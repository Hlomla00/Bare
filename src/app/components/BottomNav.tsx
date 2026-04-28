import { NavLink } from 'react-router-dom'
import { Home, Calendar, Users, Wallet, User } from 'lucide-react'

const tabs = [
  { to: '/app', icon: Home, label: 'Discover', end: true },
  { to: '/app/bookings', icon: Calendar, label: 'Bookings', end: false },
  { to: '/app/friends', icon: Users, label: 'Squad', end: false },
  { to: '/app/wallet', icon: Wallet, label: 'Wallet', end: false },
  { to: '/app/profile', icon: User, label: 'Profile', end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#1E1E1E] pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                isActive ? 'text-[#CAFF00]' : 'text-[#555]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

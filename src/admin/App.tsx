import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminNav } from './components/AdminNav'
import { AdminOverview } from './pages/Overview'
import { AdminUsers } from './pages/Users'
import { AdminGyms } from './pages/Gyms'
import { AdminAllBookings } from './pages/AllBookings'
import { AdminRevenue } from './pages/Revenue'
import { AdminFlashSlots } from './pages/FlashSlots'
import { AdminSupport } from './pages/Support'
import { AdminSettings } from './pages/AdminSettings'

export function AdminApp() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/gyms" element={<AdminGyms />} />
        <Route path="/bookings" element={<AdminAllBookings />} />
        <Route path="/revenue" element={<AdminRevenue />} />
        <Route path="/flash" element={<AdminFlashSlots />} />
        <Route path="/support" element={<AdminSupport />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
      <AdminNav />
    </div>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { PartnerNav } from './components/PartnerNav'
import { Dashboard } from './pages/Dashboard'
import { Slots } from './pages/Slots'
import { PartnerBookings } from './pages/Bookings'
import { Earnings } from './pages/Earnings'
import { PartnerSettings } from './pages/Settings'

export function PartnerApp() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/slots" element={<Slots />} />
        <Route path="/bookings" element={<PartnerBookings />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/settings" element={<PartnerSettings />} />
        <Route path="*" element={<Navigate to="/partner" replace />} />
      </Routes>
      <PartnerNav />
    </div>
  )
}

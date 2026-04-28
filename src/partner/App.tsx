import { Routes, Route, Navigate } from 'react-router-dom'
import { PartnerNav } from './components/PartnerNav'
import { Dashboard } from './pages/Dashboard'
import { Slots } from './pages/Slots'
import { PartnerBookings } from './pages/Bookings'
import { Earnings } from './pages/Earnings'
import { PartnerSettings } from './pages/Settings'
import { Analytics } from './pages/Analytics'
import { QRScanner } from './pages/QRScanner'
import { Schedule } from './pages/Schedule'
import { GymEditor } from './pages/GymEditor'

export function PartnerApp() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/slots" element={<Slots />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/bookings" element={<PartnerBookings />} />
        <Route path="/scanner" element={<QRScanner />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/gym-editor" element={<GymEditor />} />
        <Route path="/settings" element={<PartnerSettings />} />
        <Route path="*" element={<Navigate to="/partner" replace />} />
      </Routes>
      <PartnerNav />
    </div>
  )
}

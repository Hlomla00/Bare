import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Home } from './pages/Home'
import { GymDetail } from './pages/GymDetail'
import { BookingFlow } from './pages/BookingFlow'
import { MyBookings } from './pages/MyBookings'
import { Friends } from './pages/Friends'
import { Profile } from './pages/Profile'
import { Subscriptions } from './pages/Subscriptions'
import { Notifications } from './pages/Notifications'

export function MemberApp() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gym/:id" element={<GymDetail />} />
        <Route path="/book/:slotId" element={<BookingFlow />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

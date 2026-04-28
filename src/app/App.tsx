import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Home } from './pages/Home'
import { GymDetail } from './pages/GymDetail'
import { GymReviews } from './pages/GymReviews'
import { BookingFlow } from './pages/BookingFlow'
import { MyBookings } from './pages/MyBookings'
import { Friends } from './pages/Friends'
import { FriendSearch } from './pages/FriendSearch'
import { Profile } from './pages/Profile'
import { EditProfile } from './pages/EditProfile'
import { Subscriptions } from './pages/Subscriptions'
import { Notifications } from './pages/Notifications'
import { Wallet } from './pages/Wallet'
import { MemberSettings } from './pages/Settings'
import { Waitlist } from './pages/Waitlist'

export function MemberApp() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gym/:id" element={<GymDetail />} />
        <Route path="/gym/:id/reviews" element={<GymReviews />} />
        <Route path="/book/:slotId" element={<BookingFlow />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friends/search" element={<FriendSearch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<MemberSettings />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

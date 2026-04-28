import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Shield, Eye, Smartphone, Globe, Trash2, ChevronRight, Moon } from 'lucide-react'

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`w-12 h-6 rounded-full transition-all relative ${on ? 'bg-[#CAFF00]' : 'bg-[#2A2A2A]'}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-0.5'}`} />
    </button>
  )
}

function SettingRow({ label, sub, children, onClick }: { label: string; sub?: string; children?: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between py-4 border-b border-[#1A1A1A] last:border-0">
      <div className="text-left">
        <p className="text-white text-sm font-medium">{label}</p>
        {sub && <p className="text-[#555] text-xs mt-0.5">{sub}</p>}
      </div>
      {children ?? <ChevronRight className="w-4 h-4 text-[#555]" />}
    </button>
  )
}

export function MemberSettings() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState({ flashSlots: true, friendLive: true, bookingReminder: true, marketing: false })
  const [privacy, setPrivacy] = useState({ showDot: true, showSuburb: true, publicProfile: false })
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const set = (key: keyof typeof notifs) => (v: boolean) => setNotifs(n => ({ ...n, [key]: v }))
  const setP = (key: keyof typeof privacy) => (v: boolean) => setPrivacy(p => ({ ...p, [key]: p[key] === v ? !v : v }))

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-black text-lg">Settings</h1>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">

        {/* Notifications */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Bell className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">Notifications</p>
          </div>
          <div className="px-4">
            <SettingRow label="Flash slots" sub="Get notified when flash slots drop"><Toggle on={notifs.flashSlots} onChange={set('flashSlots')} /></SettingRow>
            <SettingRow label="Friend goes live" sub="When a squad member starts training"><Toggle on={notifs.friendLive} onChange={set('friendLive')} /></SettingRow>
            <SettingRow label="Session reminders" sub="30 min before your booking"><Toggle on={notifs.bookingReminder} onChange={set('bookingReminder')} /></SettingRow>
            <SettingRow label="Marketing & offers"><Toggle on={notifs.marketing} onChange={set('marketing')} /></SettingRow>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Eye className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">Privacy</p>
          </div>
          <div className="px-4">
            <SettingRow label="Show Active Dot" sub="Friends can see when you're training"><Toggle on={privacy.showDot} onChange={setP('showDot')} /></SettingRow>
            <SettingRow label="Show suburb" sub="Friends see which area you trained in"><Toggle on={privacy.showSuburb} onChange={setP('showSuburb')} /></SettingRow>
            <SettingRow label="Public profile" sub="Anyone can see your profile"><Toggle on={privacy.publicProfile} onChange={setP('publicProfile')} /></SettingRow>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Shield className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">Account & Security</p>
          </div>
          <div className="px-4">
            <SettingRow label="Change password" onClick={() => navigate('/auth/forgot-password')} />
            <SettingRow label="Linked accounts" sub="Google, Apple" />
            <SettingRow label="Two-factor authentication" sub="Not enabled" />
            <SettingRow label="Download my data" />
          </div>
        </div>

        {/* App */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Smartphone className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">App</p>
          </div>
          <div className="px-4">
            <SettingRow label="Appearance" sub="Dark (default)"><Moon className="w-4 h-4 text-[#555]" /></SettingRow>
            <SettingRow label="Language" sub="English (South Africa)"><Globe className="w-4 h-4 text-[#555]" /></SettingRow>
            <SettingRow label="App version" sub="v1.0.0"><span className="text-[#555] text-xs">Up to date</span></SettingRow>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl bg-[#111] border border-[#FF3547]/20 overflow-hidden">
          <div className="px-4">
            <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center gap-3 py-4 text-left">
              <Trash2 className="w-4 h-4 text-[#FF3547]" />
              <div>
                <p className="text-[#FF3547] text-sm font-medium">Delete account</p>
                <p className="text-[#555] text-xs">This is permanent and cannot be undone</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] p-6 space-y-4">
            <h3 className="text-white font-black text-lg">Delete account?</h3>
            <p className="text-[#888] text-sm">All your bookings, credits, and history will be permanently deleted. This cannot be undone.</p>
            <button className="w-full bg-[#FF3547] text-white font-bold py-4 rounded-2xl text-sm">Yes, delete my account</button>
            <button onClick={() => setShowDeleteModal(false)} className="w-full bg-[#1A1A1A] border border-[#242424] text-white font-bold py-4 rounded-2xl text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Settings, Percent, Bell, Shield, Database } from 'lucide-react'

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`w-12 h-6 rounded-full transition-all relative ${on ? 'bg-[#CAFF00]' : 'bg-[#2A2A2A]'}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-0.5'}`} />
    </button>
  )
}

export function AdminSettings() {
  const [commission, setCommission] = useState('20')
  const [settings, setSettings] = useState({
    flashEnabled: true, newGymNotif: true, maintenanceMode: false, autoPayouts: true,
  })
  const set = (k: keyof typeof settings) => (v: boolean) => setSettings(s => ({ ...s, [k]: v }))

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="px-4 py-4">
          <h1 className="text-white font-black text-xl">Platform Settings</h1>
          <p className="text-[#555] text-xs">Global configuration</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Commission */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Percent className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">Commission Rate</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input type="number" value={commission} onChange={e => setCommission(e.target.value)} min="0" max="50"
                  className="w-full bg-[#0A0A0A] border border-[#242424] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CAFF00]/50 pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm">%</span>
              </div>
              <button className="px-4 py-3 rounded-xl bg-[#CAFF00] text-black font-bold text-sm">Update</button>
            </div>
            <p className="text-[#555] text-xs">Gyms receive {100 - parseInt(commission)}% of each booking. Applied to all future transactions.</p>
          </div>
        </div>

        {/* Platform toggles */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Settings className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">Platform Controls</p>
          </div>
          <div className="px-4 divide-y divide-[#1A1A1A]">
            {[
              { key: 'flashEnabled', label: 'Flash Slot Engine', sub: 'Allow gyms to create flash slots' },
              { key: 'autoPayouts', label: 'Automatic Friday Payouts', sub: 'Process payouts every Friday at 12:00' },
              { key: 'newGymNotif', label: 'New gym application alerts', sub: 'Notify admin when a gym applies' },
              { key: 'maintenanceMode', label: 'Maintenance Mode', sub: 'Show maintenance page to all users' },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between py-4">
                <div>
                  <p className={`text-sm font-medium ${s.key === 'maintenanceMode' && settings.maintenanceMode ? 'text-[#FF3547]' : 'text-white'}`}>{s.label}</p>
                  <p className="text-[#555] text-xs">{s.sub}</p>
                </div>
                <Toggle on={settings[s.key as keyof typeof settings]} onChange={set(s.key as keyof typeof settings)} />
              </div>
            ))}
          </div>
        </div>

        {/* Notification settings */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Bell className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">Push Notification</p>
          </div>
          <div className="p-4 space-y-3">
            <textarea rows={3} placeholder="Message to send to all members..."
              className="w-full bg-[#0A0A0A] border border-[#242424] rounded-2xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 resize-none" />
            <button className="w-full py-3 rounded-2xl bg-[#CAFF00] text-black font-bold text-sm">
              Send to All Members
            </button>
          </div>
        </div>

        {/* Admin accounts */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Shield className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">Admin Team</p>
          </div>
          <div className="px-4 divide-y divide-[#1A1A1A]">
            {[
              { name: 'Bare Super Admin', email: 'admin@bare.co.za', role: 'Super Admin' },
              { name: 'Support Agent', email: 'support@bare.co.za', role: 'Support' },
              { name: 'Finance Team', email: 'finance@bare.co.za', role: 'Finance' },
            ].map(a => (
              <div key={a.email} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white text-sm font-medium">{a.name}</p>
                  <p className="text-[#555] text-xs">{a.email}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#CAFF00]/10 text-[#CAFF00]">{a.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]">
            <Database className="w-4 h-4 text-[#CAFF00]" />
            <p className="text-white font-bold text-sm">System</p>
          </div>
          <div className="px-4 divide-y divide-[#1A1A1A]">
            {[
              { label: 'App Version', value: 'v1.0.0' },
              { label: 'Database', value: 'Supabase (PostgreSQL)' },
              { label: 'Payments', value: 'PayFast' },
              { label: 'Maps', value: 'Leaflet + CartoDB' },
            ].map(s => (
              <div key={s.label} className="flex justify-between py-3">
                <span className="text-[#555] text-sm">{s.label}</span>
                <span className="text-white text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

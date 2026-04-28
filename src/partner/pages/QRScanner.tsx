import { useState } from 'react'
import { QrCode, Check, X, UserCheck, Clock, Search } from 'lucide-react'
import { format } from 'date-fns'
import { MOCK_BOOKINGS } from '../../data/mockData'

type ScanState = 'idle' | 'scanning' | 'success' | 'error'

const DEMO_CODES = MOCK_BOOKINGS.map(b => b.qr_code)

export function QRScanner() {
  const [state, setScanState] = useState<ScanState>('idle')
  const [manualCode, setManualCode] = useState('')
  const [scannedBooking, setScannedBooking] = useState<typeof MOCK_BOOKINGS[0] | null>(null)
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set())
  const [showManual, setShowManual] = useState(false)

  const processCode = (code: string) => {
    const booking = MOCK_BOOKINGS.find(b => b.qr_code === code.trim().toUpperCase())
    if (booking) {
      setScannedBooking(booking)
      setScanState('success')
    } else {
      setScanState('error')
      setTimeout(() => setScanState('idle'), 2000)
    }
  }

  const simulateScan = () => {
    setScanState('scanning')
    const randomCode = DEMO_CODES[Math.floor(Math.random() * DEMO_CODES.length)]
    setTimeout(() => processCode(randomCode), 1500)
  }

  const confirmCheckIn = () => {
    if (!scannedBooking) return
    setCheckedIn(p => new Set([...p, scannedBooking.id]))
    setScanState('idle')
    setScannedBooking(null)
  }

  const todayBookings = MOCK_BOOKINGS.filter(b => b.status !== 'no_show')

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="px-4 py-4">
          <h1 className="text-white font-black text-xl">Check-In Scanner</h1>
          <p className="text-[#555] text-xs">Scan member QR codes</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Scanner viewport */}
        <div className="relative rounded-3xl bg-[#111] border border-[#1E1E1E] overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
          {/* Camera simulation */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
            {state === 'idle' && (
              <div className="text-center space-y-3">
                <QrCode className="w-16 h-16 text-[#2A2A2A] mx-auto" />
                <p className="text-[#555] text-sm">Camera preview</p>
                <p className="text-[#333] text-xs">(Camera requires device permissions)</p>
              </div>
            )}
            {state === 'scanning' && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 border-4 border-[#CAFF00] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white text-sm font-semibold">Scanning...</p>
              </div>
            )}
            {state === 'success' && scannedBooking && (
              <div className="text-center space-y-3 px-6">
                <div className="w-16 h-16 rounded-full bg-[#00FF6A]/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[#00FF6A]" />
                </div>
                <div>
                  <p className="text-[#00FF6A] font-black text-lg">Valid Booking</p>
                  <p className="text-white font-bold">{scannedBooking.gym?.name}</p>
                  <p className="text-[#888] text-sm">{scannedBooking.qr_code}</p>
                  <p className="text-[#555] text-xs mt-1">R{scannedBooking.amount_paid} paid · {format(new Date(scannedBooking.created_at), 'dd MMM')}</p>
                </div>
              </div>
            )}
            {state === 'error' && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FF3547]/20 flex items-center justify-center mx-auto">
                  <X className="w-8 h-8 text-[#FF3547]" />
                </div>
                <p className="text-[#FF3547] font-bold">Invalid QR Code</p>
              </div>
            )}
          </div>
          {/* Corner brackets */}
          {state === 'idle' && (
            <>
              {[['top-4 left-4 border-t-2 border-l-2', ''],
                ['top-4 right-4 border-t-2 border-r-2', ''],
                ['bottom-4 left-4 border-b-2 border-l-2', ''],
                ['bottom-4 right-4 border-b-2 border-r-2', ''],
              ].map(([cls], i) => (
                <div key={i} className={`absolute w-8 h-8 border-[#CAFF00] rounded-sm ${cls}`} />
              ))}
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={simulateScan} disabled={state === 'scanning'}
            className="py-4 rounded-2xl bg-[#CAFF00] text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            <QrCode className="w-4 h-4" /> Simulate Scan
          </button>
          <button onClick={() => setShowManual(true)}
            className="py-4 rounded-2xl bg-[#111] border border-[#1E1E1E] text-white font-bold text-sm flex items-center justify-center gap-2">
            <Search className="w-4 h-4" /> Manual Entry
          </button>
        </div>

        {/* Confirm check-in */}
        {state === 'success' && scannedBooking && (
          <div className="space-y-3">
            <button onClick={confirmCheckIn}
              className="w-full py-4 rounded-2xl bg-[#00FF6A] text-black font-bold flex items-center justify-center gap-2">
              <UserCheck className="w-5 h-5" /> Confirm Check-In
            </button>
            <button onClick={() => { setScanState('idle'); setScannedBooking(null) }}
              className="w-full py-3.5 rounded-2xl bg-[#111] border border-[#1E1E1E] text-[#888] font-medium text-sm">
              Cancel
            </button>
          </div>
        )}

        {/* Today's bookings list */}
        <div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest mb-3">Today's Expected ({todayBookings.length})</p>
          <div className="space-y-2">
            {todayBookings.map(b => {
              const done = checkedIn.has(b.id) || b.status === 'checked_in'
              return (
                <div key={b.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${done ? 'bg-[#00FF6A]/5 border-[#00FF6A]/20' : 'bg-[#111] border-[#1E1E1E]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${done ? 'bg-[#00FF6A] text-black' : 'bg-[#1A1A1A] text-[#555]'}`}>
                    {done ? <Check className="w-4 h-4" /> : b.qr_code.slice(-2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{b.qr_code}</p>
                    <p className="text-[#555] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> R{b.amount_paid} · {format(new Date(b.created_at), 'HH:mm')}</p>
                  </div>
                  {!done && (
                    <button onClick={() => { setScannedBooking(b); setScanState('success') }}
                      className="px-3 py-1.5 rounded-xl bg-[#CAFF00]/10 border border-[#CAFF00]/30 text-[#CAFF00] text-xs font-bold">
                      Check In
                    </button>
                  )}
                  {done && <span className="text-[#00FF6A] text-xs font-bold">Done ✓</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Manual entry modal */}
      {showManual && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] p-6 space-y-4">
            <h3 className="text-white font-black text-lg">Enter Booking Code</h3>
            <input type="text" value={manualCode} onChange={e => setManualCode(e.target.value.toUpperCase())}
              placeholder="BARE-XXXX-XXXX" className="w-full bg-[#0A0A0A] border border-[#242424] rounded-2xl px-4 py-4 text-white text-center text-lg font-bold tracking-widest focus:outline-none focus:border-[#CAFF00]/50" />
            <button onClick={() => { processCode(manualCode); setShowManual(false) }} disabled={!manualCode}
              className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl disabled:opacity-40">
              Verify Code
            </button>
            <button onClick={() => setShowManual(false)} className="w-full text-[#555] text-sm py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

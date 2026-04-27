import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, CreditCard, Zap, CheckCircle, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useSlotById, useBookSlot } from '../../hooks/useSlots'
import { useAuth } from '../../hooks/useAuth'
import { BookingCode } from '../../components/BookingCode'
import { CountdownTimer } from '../../components/CountdownTimer'

type Step = 'review' | 'payment' | 'confirmed'

export function BookingFlow() {
  const { slotId } = useParams<{ slotId: string }>()
  const navigate = useNavigate()
  const { slot } = useSlotById(slotId ?? '')
  const { user } = useAuth()
  const { bookSlot, loading } = useBookSlot()
  const [step, setStep] = useState<Step>('review')
  const [useCredits, setUseCredits] = useState(user?.subscription_tier !== 'none' && (user?.credits_remaining ?? 0) > 0)
  const [bookingCode, setBookingCode] = useState<string>('')

  if (!slot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#555]">Slot not found</p>
      </div>
    )
  }

  const gym = slot.gym!
  const startTime = format(new Date(slot.start_time), 'EEEE, d MMM · HH:mm')
  const endTime = format(new Date(slot.end_time), 'HH:mm')
  const canUseCredits = (user?.credits_remaining ?? 0) > 0 && user?.subscription_tier !== 'none'
  const payAmount = useCredits && canUseCredits ? 0 : slot.price
  const commissionNote = `Gym receives R${(slot.price * 0.8).toFixed(0)} · Bare fee R${(slot.price * 0.2).toFixed(0)}`

  const handleConfirm = async () => {
    const code = await bookSlot(slot.id, useCredits)
    setBookingCode(code)
    setStep('confirmed')
  }

  const handlePayFast = () => {
    // PayFast redirect — in production, generate a signed form post
    setStep('payment')
    setTimeout(handleConfirm, 1500)
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#CAFF00]/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#CAFF00]" />
            </div>
            <h1 className="text-white font-black text-2xl">You're in.</h1>
            <p className="text-[#888] text-center text-sm leading-relaxed">
              Show this at the door. Your spot is locked.
            </p>
          </div>

          <BookingCode
            code={bookingCode}
            gymName={gym.name}
            slotTitle={slot.title}
            startTime={startTime}
          />

          <div className="w-full space-y-3">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111] border border-[#1E1E1E]">
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <Clock className="w-4 h-4" />
                <span>{startTime} – {endTime}</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111] border border-[#1E1E1E]">
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <MapPin className="w-4 h-4" />
                <span>{gym.address}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/bookings')}
            className="w-full py-4 rounded-2xl bg-[#CAFF00] text-black font-bold text-base"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/app')}
            className="text-[#555] text-sm"
          >
            Back to Discover
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#151515] border border-[#242424]">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-base leading-tight">Review & Book</h1>
            <p className="text-[#555] text-xs">{step === 'payment' ? 'Processing payment...' : 'Confirm your session'}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Slot summary */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] overflow-hidden">
          {gym.photos[0] && (
            <img src={gym.photos[0]} alt={gym.name} className="w-full h-32 object-cover opacity-70" />
          )}
          <div className="p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#CAFF00]/10 text-[#CAFF00] text-[10px] font-bold tracking-widest uppercase border border-[#CAFF00]/20">
                  {slot.class_type}
                </span>
                {slot.is_flash && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF3547]/20 text-[#FF3547] text-[10px] font-bold uppercase border border-[#FF3547]/20">
                    <Zap className="w-2.5 h-2.5" fill="currentColor" />
                    Flash
                  </span>
                )}
              </div>
              <h2 className="text-white font-bold text-lg leading-tight">{slot.title}</h2>
              <p className="text-[#888] text-sm">{gym.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <Clock className="w-4 h-4 text-[#555]" />
                <span>{startTime}</span>
              </div>
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <MapPin className="w-4 h-4 text-[#555]" />
                <span>{gym.suburb}</span>
              </div>
              <div className="flex items-center gap-2 text-[#888] text-sm">
                <Users className="w-4 h-4 text-[#555]" />
                <span>{slot.spots_remaining} spots left</span>
              </div>
            </div>

            {slot.is_flash && slot.flash_expires_at && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FF3547]/10 border border-[#FF3547]/20">
                <Zap className="w-4 h-4 text-[#FF3547]" fill="currentColor" />
                <span className="text-[#FF3547] text-sm">Flash slot expires in </span>
                <CountdownTimer expiresAt={slot.flash_expires_at} className="text-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Payment method */}
        {canUseCredits && (
          <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4 space-y-3">
            <h3 className="text-white font-semibold text-sm">Pay with</h3>

            <button
              onClick={() => setUseCredits(true)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                useCredits ? 'border-[#CAFF00]/40 bg-[#CAFF00]/5' : 'border-[#242424] bg-[#0A0A0A]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${useCredits ? 'border-[#CAFF00]' : 'border-[#444]'}`}>
                {useCredits && <div className="w-2 h-2 rounded-full bg-[#CAFF00]" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">
                  {user?.subscription_tier?.charAt(0).toUpperCase()}{user?.subscription_tier?.slice(1)} Credits
                </p>
                <p className="text-[#888] text-xs">{user?.credits_remaining} visits remaining</p>
              </div>
              <span className="text-[#CAFF00] font-bold text-sm">Free</span>
            </button>

            <button
              onClick={() => setUseCredits(false)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                !useCredits ? 'border-[#CAFF00]/40 bg-[#CAFF00]/5' : 'border-[#242424] bg-[#0A0A0A]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!useCredits ? 'border-[#CAFF00]' : 'border-[#444]'}`}>
                {!useCredits && <div className="w-2 h-2 rounded-full bg-[#CAFF00]" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">PayFast</p>
                <p className="text-[#888] text-xs">Card, EFT, SnapScan</p>
              </div>
              <span className="text-white font-bold text-sm">R{slot.price}</span>
            </button>
          </div>
        )}

        {/* Price breakdown */}
        <div className="rounded-2xl bg-[#111] border border-[#1E1E1E] p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#888]">Session fee</span>
            <span className="text-white">R{slot.price}</span>
          </div>
          {useCredits && canUseCredits && (
            <div className="flex justify-between text-sm">
              <span className="text-[#888]">Credit discount</span>
              <span className="text-[#00FF6A]">-R{slot.price}</span>
            </div>
          )}
          <div className="border-t border-[#1E1E1E] pt-2 flex justify-between">
            <span className="text-white font-semibold">Total</span>
            <span className="text-white font-bold text-lg">R{payAmount}</span>
          </div>
          <p className="text-[#444] text-[10px]">{commissionNote}</p>
        </div>

        {/* Terms note */}
        <p className="text-[#444] text-xs text-center px-4">
          By booking you agree to the 2-hour cancellation policy. No-shows forfeit the session.
        </p>

        {/* CTA */}
        <button
          onClick={payAmount === 0 ? handleConfirm : handlePayFast}
          disabled={loading || step === 'payment'}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#CAFF00', color: '#000' }}
        >
          {loading || step === 'payment' ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>{payAmount === 0 ? 'Confirming...' : 'Redirecting to PayFast...'}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>{payAmount === 0 ? 'Confirm with Credits' : `Pay R${payAmount} with PayFast`}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'

interface CountdownTimerProps {
  expiresAt: string
  onExpired?: () => void
  className?: string
}

export function CountdownTimer({ expiresAt, onExpired, className = '' }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, differenceInSeconds(new Date(expiresAt), new Date()))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, differenceInSeconds(new Date(expiresAt), new Date()))
      setSecondsLeft(remaining)
      if (remaining === 0) {
        onExpired?.()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  const isUrgent = secondsLeft < 300 // < 5 min

  return (
    <span className={`font-mono font-bold tabular-nums ${isUrgent ? 'text-[#FF3547]' : 'text-[#CAFF00]'} ${className}`}>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  )
}
